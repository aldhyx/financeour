import { DrizzleStudioDevTool } from '@/db/drizzle';
import { MMKVDevTool } from '@/lib/storage';

import { ReactQueryDevTool } from './query-provider';

export const DevTools = () => {
  // Only run dev tools in dev mode, not staging or production
  if (__DEV__) {
    return (
      <>
        <MMKVDevTool />
        <DrizzleStudioDevTool />
        <ReactQueryDevTool />
      </>
    );
  }

  return null;
};
