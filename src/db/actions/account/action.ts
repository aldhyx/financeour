import { asc, eq, sum } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import { db } from '@/db/drizzle';
import { accountTable, txTable } from '@/db/tables';
import { getToday } from '@/lib/dayjs';

import type { InsertTx } from '../transaction';
import type {
  GetAccounts,
  GetTotalBalance,
  InsertAccount,
  UpdateAccount,
} from './type';

export const getAccountById = async (
  id: string,
  dbInstance?: ExpoSQLiteDatabase
) => {
  if (!id) throw new Error('Failed, undefined account ID!');
  const runInstance = dbInstance || db;

  const result = await runInstance
    .select()
    .from(accountTable)
    .where(eq(accountTable.id, id));

  return result.length === 0 ? null : result[0];
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

export const createAccount = async (values: InsertAccount) => {
  return await db.insert(accountTable).values(values);
};

export const updateAccount = async (props: {
  values: Omit<UpdateAccount, 'balance'>;
  id: string;
}) => {
  const account = await getAccountById(props.id, db);
  if (!account) throw new Error('404!');

  await db
    .update(accountTable)
    .set(props.values)
    .where(eq(accountTable.id, account.id));
  return;
};

export const removeAccount = async (id: string) => {
  const account = await getAccountById(id);
  if (!account) throw new Error('404!');

  await db.transaction(async (tx) => {
    await tx.delete(txTable).where(eq(txTable.fromAccountId, account.id));
    await tx.delete(accountTable).where(eq(accountTable.id, account.id));
  });

  return;
};

export const updateAccountBalance = async (props: {
  values: Pick<UpdateAccount, 'balance'>;
  id: string;
}) => {
  const account = await getAccountById(props.id);
  if (!account) throw new Error('404!');

  await db.transaction(async (tx) => {
    const currentBalance = account.balance || 0;
    const newBalance = props.values.balance || 0;
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
      .set(props.values)
      .where(eq(accountTable.id, account.id));
  });
};
