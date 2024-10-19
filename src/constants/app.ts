import { LucideIcon } from 'lucide-react-native';

import {
  CoinsIcon,
  CreditCard,
  FileQuestion,
  LandmarkIcon,
  PiggyBankIcon,
  SmartphoneNfc,
} from '@/components/ui/icon';
import { TxTypeEnum } from '@/db/tables';

export const ACCOUNT_TYPES = [
  // cash should always be 0 index followed by bank, cause we use it to seed default account for cash & bank in seed.ts
  { label: 'cash', icon: CoinsIcon },
  { label: 'bank', icon: LandmarkIcon },
  { label: 'e-wallet', icon: SmartphoneNfc },
  { label: 'e-money', icon: CreditCard },
  { label: 'piggy-bank', icon: PiggyBankIcon },
] as const;

export const ACCOUNT_TYPE_ICONS: Record<string, LucideIcon> = {
  cash: CoinsIcon,
  bank: LandmarkIcon,
  'e-wallet': SmartphoneNfc,
  'e-money': CreditCard,
  'piggy-bank': PiggyBankIcon,
  unknown: FileQuestion,
};

export const TRANSACTION_TYPES: {
  id: TxTypeEnum;
  label: string;
}[] = [
  { id: 'in', label: 'Income' },
  { id: 'out', label: 'Expense' },
  { id: 'tf', label: 'Transfer' },
] as const;

export const TRANSACTION_TYPES_LABEL: Record<TxTypeEnum, string> = {
  in: 'Income',
  out: 'Expense',
  tf: 'Transfer',
} as const;
