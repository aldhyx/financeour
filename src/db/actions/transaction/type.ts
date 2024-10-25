import { z } from 'zod';

import { insertTxSchema, selectTxSchema } from './schema';

export type Tx = z.infer<typeof selectTxSchema>;
export type InsertTx = Omit<z.infer<typeof insertTxSchema>, 'createdAt' | 'id'>;
export type UpdateTx = Partial<InsertTx>;
export type TxColumn = keyof z.infer<typeof selectTxSchema>;

export type GetTransactionGroupedByDayFilter =
  | {
      /**
       * Default to today month & year
       */
      datetime?: {
        month: number;
        year: number;
      };
    }
  | undefined;
export type GetTransactionGroupedByDay = (
  filter: GetTransactionGroupedByDayFilter
) => Promise<
  (
    | string // used as grouped title
    | (Tx & {
        // used to track start & end of grouped data
        isStart: boolean;
        isEnd: boolean;
      })
  )[]
>;

export type GetTransactionsFilter =
  | {
      /**
       * Default to datetime-desc
       */
      orderBy?: {
        column: TxColumn;
        mode: 'asc' | 'desc';
      };
      limit?: number;
      datetime?: {
        month: number;
        year: number;
      };
    }
  | undefined;
export type GetTransactions = (filter: GetTransactionsFilter) => Promise<Tx[]>;
export type CreateTransaction = (values: InsertTx) => Promise<void>;
export type MakeTransaction = (
  sourceBalance: number,
  values: Pick<
    InsertTx,
    | 'amount'
    | 'datetime'
    | 'fromAccountId'
    | 'fromAccountName'
    | 'description'
    | 'type'
  >
) => Promise<void>;
export type MakeTransferTransaction = (
  sourceBalance: number,
  values: InsertTx
) => Promise<void>;
export type WithTransaction = (
  id: string,
  cb: (transaction: Tx) => any
) => Promise<any>;
