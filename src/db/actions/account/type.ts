import { z } from 'zod';

import { insertAccountSchema, selectAccountSchema } from './schema';

export type Account = z.infer<typeof selectAccountSchema>;
export type InsertAccount = Omit<
  z.infer<typeof insertAccountSchema>,
  'createdAt' | 'id'
>;
export type UpdateAccount = Partial<InsertAccount>;

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
export type GetTotalBalance = () => Promise<string>;
