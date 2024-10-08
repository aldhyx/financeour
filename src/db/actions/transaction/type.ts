import { z } from "zod";

import { insertTxSchema, selectTxSchema } from "./schema";

export type Tx = z.infer<typeof selectTxSchema>;
export type InsertTx = Omit<z.infer<typeof insertTxSchema>, "createdAt" | "id">;
export type UpdateTx = Partial<InsertTx>;
export type TxColumn = keyof z.infer<typeof selectTxSchema>;

export type GetTransactionsFilter =
  | {
      orderBy?: {
        column: TxColumn;
        mode: "asc" | "desc";
      };
      limit?: number;
    }
  | undefined;
export type GetTransactions = (filter: GetTransactionsFilter) => Promise<Tx[]>;
