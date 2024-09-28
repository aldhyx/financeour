import { MaskOptions } from '@/lib/mask';

export type CURRENCY = 'IDR' | 'USD';

export const CURRENCY_FORMAT: Record<CURRENCY, MaskOptions> = {
  IDR: {
    prefix: ['Rp', ' '],
    delimiter: '.',
    separator: ',',
    precision: 0,
  },
  USD: {
    prefix: '$',
    delimiter: ',',
    separator: '.',
    precision: 0,
  },
} as const;
