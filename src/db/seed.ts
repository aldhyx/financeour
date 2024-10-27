import { count } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useState } from 'react';

import { ACCOUNT_TYPE_ID } from '@/constants/account-types';
import { STORED_KEY } from '@/constants/local-storage-key';
import * as storage from '@/lib/storage';

import { db, DB_NAME } from './drizzle';
import { accountTable } from './tables';

export function useSeedHelper() {
  const [seeded, setSeeded] = useState(false);

  const seeding = async () => {
    try {
      const S_DB_NAME = storage.getItem<string>(STORED_KEY.DB_NAME);

      /**
       * For the first time init, it always be diff cause S_DB_NAME might be null or string but DB_NAME always be a string
       */
      const isDiff = S_DB_NAME !== DB_NAME;
      if (isDiff) {
        storage.removeItem(STORED_KEY.DB_NAME);
        storage.setItem(STORED_KEY.DB_NAME, DB_NAME);
        await seedDefaultAccount(db);
      }

      setSeeded(true);
    } catch (_) {
      throw new Error('Failed to seeding app data!');
    }
  };

  return { seeding, seeded };
}

export const seedDefaultAccount = async (db: ExpoSQLiteDatabase) => {
  if (!db) throw new Error('Undefined DB instance!');
  const [accounts] = await db.select({ count: count() }).from(accountTable);

  // only seed when account table is empty
  if (accounts.count > 0) return;

  return await db.insert(accountTable).values([
    {
      name: 'My Wallet',
      type: ACCOUNT_TYPE_ID.cash,
      isFavorite: true,
    },
    {
      name: 'Bank XYZ',
      type: ACCOUNT_TYPE_ID.bank,
      isFavorite: true,
    },
    {
      name: 'Paypal',
      type: ACCOUNT_TYPE_ID.ewallet,
    },
  ]);
};
