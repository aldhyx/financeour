import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { txTable, txTypeEnum } from "@/db/tables";

export const selectTxSchema = createSelectSchema(txTable);
export const insertTxSchema = createInsertSchema(txTable, {
  description: (schema) => schema.description.max(240).trim(),
  amount: z
    .number({ message: "Nilai transaksi tidak benar!" })
    .min(1, { message: "Nilai transaksi tidak benar!" })
    .positive(),
});

export const validateCreateTxSchema = z
  .object({
    balance: z.number(),
    amount: z.number(),
    isTransfer: z.boolean(),
    isExpense: z.boolean(),
    toAccountId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const isEmptyBalance = data.balance === 0;
    const isInsufficientBalance = data.amount > data.balance;
    // Check if expense or transfer, then balance must be greater than 0
    // Check if expense or transfer, amount must be less than or equal to balance
    if (
      (data.isExpense || data.isTransfer) &&
      (isEmptyBalance || isInsufficientBalance)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Gagal, saldo akun tidak cukup!",
        path: ["balance"], // Specifies the path of the error
      });
    }

    // Check if transfer, toAccountId must be provided
    if (data.isTransfer && !data.toAccountId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "To Account ID must be provided for transfers",
        path: ["toAccountId"],
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
      transactionType: z
        .object({
          key: z.enum(txTypeEnum),
          label: z.string(),
        })
        .required(),
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
      const isTransfer = data.transactionType.key === "tf";
      const hasToAccount = data.toAccount !== undefined;

      return !isTransfer || (isTransfer && hasToAccount);
    },
    {
      message: "Wajib dipilih!",
      path: ["toAccount"],
    }
  );
