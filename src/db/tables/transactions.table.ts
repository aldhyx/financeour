import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { accountTable } from './accounts.table';

export const txTypeEnum = ['in', 'out', 'tf'] as const;
export type TxTypeEnum = (typeof txTypeEnum)[number];

export const txTable = sqliteTable(
  'transactions',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .notNull()
      .primaryKey(),
    datetime: int('datetime', { mode: 'timestamp_ms' }).notNull(),
    type: text('type', { enum: txTypeEnum }).notNull(),
    amount: int('amount').notNull(),
    description: text('description'),
    isExcluded: int('is_excluded', { mode: 'boolean' }),
    fromAccountId: text('from_account_id')
      .notNull()
      .references(() => accountTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    fromAccountName: text('from_account_name')
      .notNull()
      .references(() => accountTable.name, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    toAccountId: text('to_account_id').references(() => accountTable.id, {
      onDelete: 'no action',
      onUpdate: 'cascade',
    }),
    toAccountName: text('to_account_name').references(() => accountTable.name, {
      onDelete: 'no action',
      onUpdate: 'cascade',
    }),
    createdAt: text('created_at')
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updatedAt: text('updated_at'),
  },
  (table) => {
    return {
      accountIdx: index('account_idx').on(table.fromAccountId),
      typex: index('typex').on(table.type),
    };
  }
);
