import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { accountTable } from '@/db/tables';

export const selectAccountSchema = createSelectSchema(accountTable);
export const insertAccountSchema = createInsertSchema(accountTable, {
  name: z.string().min(1).max(60).trim(),
  description: (schema) => schema.description.max(240).trim(),
  type: (schema) => schema.type.toLowerCase(),
});
