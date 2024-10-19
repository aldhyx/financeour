import { asc, eq, sum } from 'drizzle-orm';

import { db } from '@/db/drizzle';
import { accountTable, txTable } from '@/db/tables';
import { getToday } from '@/lib/dayjs';

import type { InsertTx } from '../transaction';
import type {
  CreateAccount,
  GetAccountById,
  GetAccounts,
  GetTotalBalance,
  UpdateAccount,
  UpdateAccountBalance,
  WithAccount,
} from './type';

export const getAccountById: GetAccountById = async (id, dbInstance = db) => {
  const result = await dbInstance
    .select()
    .from(accountTable)
    .where(eq(accountTable.id, id));

  return result.length === 0 ? null : result[0];
};

export const withAccount: WithAccount = async (id, cb) => {
  const account = await getAccountById(id);
  if (!account) throw new Error('404, account not found!');
  return cb(account);
};

export const getTotalBalance: GetTotalBalance = async () => {
  const [result] = await db
    .select({ sumBalance: sum(accountTable.balance) })
    .from(accountTable);
  return result.sumBalance ?? '0';
};

export const getAccounts: GetAccounts = async (filter = {}) => {
  const query = db.select().from(accountTable).orderBy(asc(accountTable.name));
  if (filter.byFavorite) query.where(eq(accountTable.isFavorite, true));
  return await query;
};

export const createAccount: CreateAccount = async (values) => {
  await db.insert(accountTable).values(values);
};

export const updateAccount: UpdateAccount = ({ id, values }) =>
  withAccount(id, async (account) => {
    await db
      .update(accountTable)
      .set(values)
      .where(eq(accountTable.id, account.id));
  });

export const removeAccount = async (id: string) =>
  withAccount(id, async (account) => {
    await db.transaction(async (tx) => {
      await tx.delete(txTable).where(eq(txTable.fromAccountId, account.id));
      await tx.delete(accountTable).where(eq(accountTable.id, account.id));
    });
  });

export const updateAccountBalance: UpdateAccountBalance = async ({
  id,
  values,
}) =>
  withAccount(id, async (account) => {
    await db.transaction(async (tx) => {
      const currentBalance = account.balance || 0;
      const newBalance = values.balance || 0;
      const balanceDiff = newBalance - currentBalance;
      const isIncome = balanceDiff > 0;

      if (balanceDiff !== 0) {
        // - is income (positive), add income row to tx table
        // - is not income (negative), add outcome row to tx table
        const newTx: InsertTx = {
          fromAccountId: account.id,
          fromAccountName: account.name,
          amount: Math.abs(balanceDiff),
          datetime: getToday(),
          type: isIncome ? 'in' : 'out',
          description: 'Account balance adjustment',
        };

        await tx.insert(txTable).values(newTx);
      }

      await db
        .update(accountTable)
        .set(values)
        .where(eq(accountTable.id, account.id));
    });
  });
