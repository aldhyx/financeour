import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { accountTable, txTable } from "@/db/tables";

import { getAccountById } from "../account";
import { validateCreateTxSchema } from "./schema";
import type { GetTransactions, InsertTx } from "./type";

export const getTransactionById = async (id: string) => {
  if (!id) throw new Error("Failed, undefined transaction ID!");

  const result = await db.select().from(txTable).where(eq(txTable.id, id));

  return result.length === 0 ? null : result[0];
};

export const getTransactions: GetTransactions = async (filter = {}) => {
  const { limit, orderBy } = filter;
  const query = db.select().from(txTable);

  if (orderBy?.mode === "asc") {
    query.orderBy(asc(txTable[orderBy.column]));
  }

  if (orderBy?.mode === "desc") {
    query.orderBy(desc(txTable[orderBy.column]));
  }

  if (limit) query.limit(limit);
  return await query;
};

export const createTransaction = async (values: InsertTx) => {
  const account = await getAccountById(values.fromAccountId);
  if (!account) throw new Error("404!");

  const isExpense = values.type === "out";
  const isIncome = values.type === "in";
  const isTransfer = values.type === "tf";
  const sourceBalance = account.balance || 0;

  const validated = validateCreateTxSchema.safeParse({
    balance: sourceBalance,
    amount: values.amount,
    isTransfer: isTransfer,
    isExpense: isExpense,
    toAccountId: values.toAccountId,
  });

  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  await db.transaction(async (tx) => {
    // if income, add balance to source account
    if (isIncome) {
      await tx
        .update(accountTable)
        .set({ balance: sourceBalance + values.amount })
        .where(eq(accountTable.id, values.fromAccountId));
    }

    // if Expense or transfer (not same account), reduce balance from the source account
    if (
      isExpense ||
      (isTransfer && values.fromAccountId !== values.toAccountId)
    ) {
      await tx
        .update(accountTable)
        .set({
          balance: sourceBalance - values.amount,
        })
        .where(eq(accountTable.id, values.fromAccountId));
    }

    // if transfer (not same account), add balance to destination account
    if (
      isTransfer &&
      values.fromAccountId !== values.toAccountId &&
      values.toAccountId
    ) {
      const destinationAccount = await getAccountById(values.toAccountId, tx);
      if (!destinationAccount) throw new Error("404!");

      const destinationBalance = destinationAccount.balance || 0;
      await tx
        .update(accountTable)
        .set({ balance: destinationBalance + values.amount })
        .where(eq(accountTable.id, values.toAccountId));
    }

    return await tx.insert(txTable).values(values);
  });

  return;
};

export const removeTransaction = async (id: string) => {
  const transaction = await getTransactionById(id);
  if (!transaction) throw new Error("404!");

  const fromAccount = await getAccountById(transaction.fromAccountId, db);
  if (!fromAccount) throw new Error("404!");

  const isIncome = transaction.type === "in";
  const isTransfer = transaction.type === "tf";
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
      if (!toAccount) throw new Error("404!");

      const toAccountBalance = toAccount.balance || 0;

      await tx
        .update(accountTable)
        .set({
          balance: toAccountBalance - transaction.amount,
        })
        .where(eq(accountTable.id, toAccount.id));
    }

    await db.delete(txTable).where(eq(txTable.id, id));
  });

  return;
};
