import { Env } from '@env';
import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { openDatabaseSync } from 'expo-sqlite/next';

import migrations from '@/db/migrations/migrations';

const DB_NAME = `v${Env.DB_VERSION}_${Env.DB_NAME}`;
const expoDb = openDatabaseSync(DB_NAME, { enableChangeListener: true });
const db = drizzle(expoDb, { logger: __DEV__ });

const DrizzleStudioDevTool = () => {
  useDrizzleStudio(expoDb);
  return null;
};

const useMigrationHelper = () => {
  const { success, error } = useMigrations(
    db as ExpoSQLiteDatabase,
    migrations
  );

  return { success, error };
};

export { db, DB_NAME, DrizzleStudioDevTool, useMigrationHelper };
