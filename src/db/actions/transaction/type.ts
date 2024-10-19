import { z } from 'zod';

import { insertTxSchema, selectTxSchema } from './schema';

export type Tx = z.infer<typeof selectTxSchema>;
export type InsertTx = Omit<z.infer<typeof insertTxSchema>, 'createdAt' | 'id'>;
export type UpdateTx = Partial<InsertTx>;
export type TxColumn = keyof z.infer<typeof selectTxSchema>;

export type GetTransactionsFilter =
  | {
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
