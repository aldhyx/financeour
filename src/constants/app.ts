import { TxTypeEnum } from '@/db/tables';

export const DEFAULT_ACCOUNT_TYPES = [
  // cash should always be 0 index followed by bank, cause we use it to seed default account for cash & bank in seed.ts
  'kas',
  'bank',
  'e-wallet',
  'e-money',
  'celengan',
  // "investasi", <- TODO: figure it out the best way for invest account
  // "crypto", <- TODO: figure it out the best way for invest account
  // "saham", <- TODO: figure it out the best way for invest account
  // "gold", <- TODO: figure it out the best way for invest account
] as const;

export const TRANSACTION_TYPES: {
  key: TxTypeEnum;
  label: string;
}[] = [
  { key: 'in', label: 'Pendapatan' },
  { key: 'out', label: 'Pengeluaran' },
  { key: 'tf', label: 'Transfer' },
] as const;

export const TRANSACTION_TYPES_LABEL: Record<TxTypeEnum, string> = {
  in: 'Pendapatan',
  out: 'Pengeluaran',
  tf: 'Transfer',
} as const;
