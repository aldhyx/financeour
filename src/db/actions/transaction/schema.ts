import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { txTable, txTypeEnum } from '@/db/tables';

export const selectTxSchema = createSelectSchema(txTable);
export const insertTxSchema = createInsertSchema(txTable, {
  description: (schema) => schema.description.max(240).trim(),
  amount: z
    .number({ message: 'Nilai transaksi tidak benar!' })
    .min(1, { message: 'Nilai transaksi tidak benar!' })
    .positive(),
});

export const validateCreateTransferTxSchema = z
  .object({
    balance: z.number(),
    amount: z.number(),
    toAccountId: z.string(),
    toAccountName: z.string(),
  })
  .superRefine((data, ctx) => {
    const isEmptyBalance = data.balance === 0;
    const isInsufficientBalance = data.amount > data.balance;
    // Check if transfer, then balance must be greater than 0
    // Check if transfer, amount must not greater than balance
    if (isEmptyBalance || isInsufficientBalance) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Gagal, saldo akun tidak cukup!',
        path: ['balance'], // Specifies the path of the error
      });
    }

    // Check if transfer, toAccountId must be provided
    if (!data.toAccountId || !data.toAccountName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'To Account id & name must be provided for transfers',
        path: ['toAccountId'],
      });
    }
  });

export const validateCreateExpenseTxSchema = z
  .object({
    balance: z.number(),
    amount: z.number(),
  })
  .superRefine((data, ctx) => {
    const isEmptyBalance = data.balance === 0;
    const isInsufficientBalance = data.amount > data.balance;
    // Check if expense, then balance must be greater than 0
    // Check if expense, amount must be less than or equal to balance
    if (isEmptyBalance || isInsufficientBalance) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Gagal, saldo akun tidak cukup!',
        path: ['balance'], // Specifies the path of the error
      });
    }
  });

export const insertTxFormSchema = insertTxSchema
  .pick({
    amount: true,
    datetime: true,
    description: true,
    isExcluded: true,
  })
  .merge(
    z.object({
      // same as type from insert scheme but we hold the label too
      transactionTypeId: z.enum(txTypeEnum),
      // same as account_id from insert scheme but we hold the name too
      fromAccount: z
        .object({
          id: z.string(),
          name: z.string(),
        })
        .required(),
      // same as to_account_id from insert scheme but we hold the name too
      toAccount: z
        .object({
          id: z.string(),
          name: z.string(),
        })
        .optional(),
    })
  )
  .refine(
    (data) => {
      const isTransfer = data.transactionTypeId === 'tf';
      const hasToAccount = data.toAccount !== undefined;

      return !isTransfer || (isTransfer && hasToAccount);
    },
    {
      message: 'Wajib dipilih!',
      path: ['toAccount'],
    }
  );
