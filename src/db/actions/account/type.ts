import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { z } from 'zod';

import { insertAccountSchema, selectAccountSchema } from './schema';

export type Account = z.infer<typeof selectAccountSchema>;
export type InsertAccount = Omit<
  z.infer<typeof insertAccountSchema>,
  'createdAt' | 'id'
>;

export type ReturnGroupedAccounts = {
  data: { [key: string]: Account[] };
  error: Error | undefined;
};
export type ReturnRawAccounts = { data: Account[]; error: Error | undefined };

export type GetAccountsFilter =
  | {
      byFavorite?: boolean;
    }
  | undefined;
export type GetAccounts = (filter: GetAccountsFilter) => Promise<Account[]>;
export type GetAccountById = (
  id: string,
  dbInstance?: ExpoSQLiteDatabase
) => Promise<Account | null>;
export type WithAccount = (
  id: string,
  cb: (account: Account) => any
) => Promise<any>;
export type GetTotalBalance = () => Promise<string>;

export type CreateAccount = (params: InsertAccount) => Promise<void>;
export type UpdateAccount = (params: {
  values: Omit<Partial<InsertAccount>, 'balance'>;
  id: string;
}) => Promise<void>;
export type UpdateAccountBalance = (params: {
  values: Pick<InsertAccount, 'balance'>;
  id: string;
}) => Promise<void>;
