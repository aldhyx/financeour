import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const accountTable = sqliteTable(
  "accounts",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .notNull()
      .primaryKey(),
    name: text("name").notNull().unique(),
    balance: int("balance", { mode: "number" }).default(0),
    description: text("description"),
    type: text("type").notNull(),
    isFavorite: int("is_favorite", { mode: "boolean" }),
    createdAt: text("created_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updatedAt: text("updated_at"),
  },
  (table) => ({
    isFavoritex: index("is_favoritex").on(table.isFavorite),
  })
);
