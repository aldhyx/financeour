import { asc, desc, eq } from 'drizzle-orm';

import { db } from '@/db/drizzle';
import { accountTable, txTable } from '@/db/tables';

import { getAccountById, withAccount } from '../account';
import {
  validateCreateExpenseTxSchema,
  validateCreateTransferTxSchema,
} from './schema';
import type {
  CreateTransaction,
  GetTransactions,
  MakeTransaction,
  MakeTransferTransaction,
  WithTransaction,
} from './type';

export const getTransactionById = async (id: string) => {
  const result = await db.select().from(txTable).where(eq(txTable.id, id));
  return result.length === 0 ? null : result[0];
};

export const getTransactions: GetTransactions = async (filter = {}) => {
  const { limit, orderBy } = filter;
  const query = db.select().from(txTable);

  if (orderBy?.mode === 'asc') {
    query.orderBy(asc(txTable[orderBy.column]));
  }

  if (orderBy?.mode === 'desc') {
    query.orderBy(desc(txTable[orderBy.column]));
  }

  if (limit) query.limit(limit);
  return await query;
};

const makeTransaction: MakeTransaction = async (sourceBalance, values) => {
  let newBalance = sourceBalance;

  if (values.type === 'in') newBalance = newBalance + values.amount;
  if (values.type === 'out') {
    const { error, success } = validateCreateExpenseTxSchema.safeParse({
      balance: sourceBalance,
      amount: values.amount,
    });
    if (!success) throw new Error(error.issues[0].message);
    newBalance = newBalance - values.amount;
  }

  await db.transaction(async (tx) => {
    // adjust source account balance
    await tx
      .update(accountTable)
      .set({ balance: newBalance })
      .where(eq(accountTable.id, values.fromAccountId));

    // add new tx record
    await tx.insert(txTable).values(values);
  });
};

const makeTransferTransaction: MakeTransferTransaction = async (
  sourceBalance,
  values
) => {
  const { success, data, error } = validateCreateTransferTxSchema.safeParse({
    balance: sourceBalance,
    amount: values.amount,
    toAccountId: values.toAccountId,
    toAccountName: values.toAccountName,
  });

  if (!success) throw new Error(error.issues[0].message);

  await withAccount(data.toAccountId, async (destinationAccount) => {
    const isTransferToDiffAccount = values.fromAccountId !== data.toAccountId;
    const destinationBalance = destinationAccount?.balance || 0;

    await db.transaction(async (tx) => {
      if (isTransferToDiffAccount) {
        // adjust destination account balance
        await tx
          .update(accountTable)
          .set({ balance: destinationBalance + values.amount })
          .where(eq(accountTable.id, data.toAccountId));

        // adjust source account balance
        await tx
          .update(accountTable)
          .set({ balance: sourceBalance - values.amount })
          .where(eq(accountTable.id, values.fromAccountId));
      }

      // add new tx record
      await tx.insert(txTable).values(values);
    });
  });
};

export const createTransaction: CreateTransaction = async (values) =>
  await withAccount(values.fromAccountId, async (account) => {
    const sourceBalance = account.balance || 0;

    switch (values.type) {
      case 'tf':
        await makeTransferTransaction(sourceBalance, values);
        break;
      default:
        await makeTransaction(sourceBalance, values);
        break;
    }
  });

export const withTransaction: WithTransaction = async (id, cb) => {
  const transaction = await getTransactionById(id);
  if (!transaction) throw new Error('404, transaction not found!');
  return cb(transaction);
};

export const removeTransaction = async (id: string) =>
  withTransaction(id, async (transaction) => {
    await withAccount(transaction.fromAccountId, async (fromAccount) => {
      const isIncome = transaction.type === 'in';
      const isTransfer = transaction.type === 'tf';
      const fromAccountBalance = fromAccount.balance || 0;

      await db.transaction(async (tx) => {
        await tx
          .update(accountTable)
          .set({
            balance: isIncome
              ? fromAccountBalance - transaction.amount
              : fromAccountBalance + transaction.amount,
          })
          .where(eq(accountTable.id, fromAccount.id));

        if (isTransfer && transaction.toAccountId) {
          const toAccount = await getAccountById(transaction.toAccountId, tx);
          if (toAccount) {
            const toAccountBalance = toAccount.balance || 0;
            await tx
              .update(accountTable)
              .set({
                balance: toAccountBalance - transaction.amount,
              })
              .where(eq(accountTable.id, toAccount.id));
          }
        }

        await db.delete(txTable).where(eq(txTable.id, id));
      });
    });
  });
