import { msg } from '@lingui/macro';
import { LucideIcon } from 'lucide-react-native';

import {
  ArrowBigDownIcon,
  ArrowBigRightIcon,
  ArrowBigUpIcon,
} from '@/components/ui/icon';

export const TRANSACTION_TYPE_ID = {
  in: 'in',
  out: 'out',
  tf: 'tf',
} as const;

type TransactionTypeId = keyof typeof TRANSACTION_TYPE_ID;

/**
 * Refers to return type msg
 */
type MessageDescriptor = {
  id: string;
  comment?: string;
  message?: string;
  values?: Record<string, unknown>;
};

type TransactionType = {
  label: MessageDescriptor;
  id: TransactionTypeId;
  icon: LucideIcon;
};

export const TRANSACTION_TYPES: TransactionType[] = [
  { id: 'in', label: msg`Income`, icon: ArrowBigDownIcon },
  { id: 'out', label: msg`Expense`, icon: ArrowBigUpIcon },
  { id: 'tf', label: msg`Transfer`, icon: ArrowBigRightIcon },
] as const;

type MapTransactionLabel = Record<TransactionTypeId, MessageDescriptor>;
const mapTransactionLabel: MapTransactionLabel = TRANSACTION_TYPES.reduce(
  (acc, account) => {
    acc[account.id] = account.label;
    return acc;
  },
  {} as MapTransactionLabel
);

type MapTransactionIcon = Record<TransactionTypeId, LucideIcon>;
const mapTransactionIcon: MapTransactionIcon = TRANSACTION_TYPES.reduce(
  (acc, account) => {
    acc[account.id] = account.icon;
    return acc;
  },
  {} as MapTransactionIcon
);

/**
 * Get trans transaction label from given type
 */
export const getTransactionLabel = (type: string) => {
  const accountType = type as TransactionTypeId;
  return mapTransactionLabel[accountType];
};

/**
 * Get transaction icon from given type
 */
export const getTransactionIcon = (type: string) => {
  const accountType = type as TransactionTypeId;
  return mapTransactionIcon[accountType];
};

/**
 * Get transaction color from given type
 */
export const getTransactionColor = (type: string) => {
  if (type === 'in') return 'text-green-600 fill-green-600';
  if (type === 'out') return 'text-red-600 fill-red-600';
  return 'text-amber-600 fill-amber-600';
};
