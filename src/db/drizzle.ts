import { Env } from '@env';
import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { openDatabaseSync } from 'expo-sqlite/next';

import migrations from '@/db/migrations/migrations';

const IS_DEV = Env.APP_ENV === 'development';
export const DB_NAME = `v${Env.DB_VERSION}_${Env.DB_NAME}`;

const expoDb = openDatabaseSync(DB_NAME, { enableChangeListener: true });
export const db = drizzle(expoDb, { logger: IS_DEV });

export const useMigrationHelper = () => {
  const { success, error } = useMigrations(
    db as ExpoSQLiteDatabase,
    migrations
  );

  useDrizzleStudio(IS_DEV ? expoDb : null);

  return { success, error };
};
