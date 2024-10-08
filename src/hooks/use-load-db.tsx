import { useCallback, useEffect } from 'react';

import { useMigrationHelper } from '@/db/drizzle';
import { useSeedHelper } from '@/db/seed';

export const useLoadDB = () => {
  const { success: loadedDB, error: loadDBError } = useMigrationHelper();
  const { seeding, seeded } = useSeedHelper();

  const initApp = useCallback(async () => {
    await seeding();
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (loadDBError) throw loadDBError;
  }, [loadDBError]);

  useEffect(() => {
    if (loadedDB) initApp();
  }, [loadedDB, initApp]);

  return { loaded: loadedDB && seeded };
};
