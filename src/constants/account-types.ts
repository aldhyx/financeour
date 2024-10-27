import { msg } from '@lingui/macro';
import { LucideIcon } from 'lucide-react-native';

import {
  CoinsIcon,
  CreditCard,
  FileQuestion,
  LandmarkIcon,
  PiggyBankIcon,
  SmartphoneNfc,
} from '@/components/ui/icon';

export const ACCOUNT_TYPE_ID = {
  cash: 'cash',
  bank: 'bank',
  ewallet: 'ewallet',
  emoney: 'emoney',
  piggybank: 'piggybank',
  others: 'others',
} as const;

type AccountTypeId = keyof typeof ACCOUNT_TYPE_ID;

/**
 * Refers to return type msg
 */
type MessageDescriptor = {
  id: string;
  comment?: string;
  message?: string;
  values?: Record<string, unknown>;
};

type AccountType = {
  label: MessageDescriptor;
  id: AccountTypeId;
  icon: LucideIcon;
};

export const ACCOUNT_TYPES: AccountType[] = [
  // cash should always be 0 index followed by bank, cause we use it to seed default account for cash & bank in seed.ts
  { label: msg`Cash`, id: 'cash', icon: CoinsIcon },
  { label: msg`Bank`, id: 'bank', icon: LandmarkIcon },
  { label: msg`E-Wallet`, id: 'ewallet', icon: SmartphoneNfc },
  { label: msg`E-Money`, id: 'emoney', icon: CreditCard },
  { label: msg`Piggy-Bank`, id: 'piggybank', icon: PiggyBankIcon },
  { label: msg`Others`, id: 'others', icon: FileQuestion },
] as const;

type MapAccountLabel = Record<AccountTypeId, MessageDescriptor>;
const mapAccountLabels: MapAccountLabel = ACCOUNT_TYPES.reduce(
  (acc, account) => {
    acc[account.id] = account.label;
    return acc;
  },
  {} as MapAccountLabel
);

type MapAccountIcon = Record<AccountTypeId, LucideIcon>;
const mapAccountIcon: MapAccountIcon = ACCOUNT_TYPES.reduce((acc, account) => {
  acc[account.id] = account.icon;
  return acc;
}, {} as MapAccountIcon);

/**
 * Get trans account type label from given type
 */
export const getAccountTypeLabel = (type: string) => {
  const accountType = type as AccountTypeId;

  return accountType && mapAccountLabels[accountType]
    ? mapAccountLabels[accountType]
    : mapAccountLabels.others;
};

/**
 * Get account type icon from given type
 */
export const getAccountTypeIcon = (type: string) => {
  const accountType = type as AccountTypeId;

  return accountType && mapAccountIcon[accountType]
    ? mapAccountIcon[accountType]
    : mapAccountIcon.others;
};
