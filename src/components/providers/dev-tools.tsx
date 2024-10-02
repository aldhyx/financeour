import { useReactNavigationDevTools } from '@dev-plugins/react-navigation/build/useReactNavigationDevTools';
import { useNavigationContainerRef } from 'expo-router';

import { DrizzleStudioDevTool } from '@/db/drizzle';
import { MMKVDevTool } from '@/lib/storage';

import { ReactQueryDevTool } from './query-provider';

const NavigationDevTool = () => {
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);
  return null;
};

export const DevTools = () => {
  // Only run dev tools in dev mode, not staging or production
  if (__DEV__) {
    return (
      <>
        <MMKVDevTool />
        <DrizzleStudioDevTool />
        <NavigationDevTool />
        <ReactQueryDevTool />
      </>
    );
  }

  return null;
};
