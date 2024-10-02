import { useReactQueryDevTools } from '@dev-plugins/react-query';
import {
  QueryClient,
  QueryClientProvider as QProvider,
} from '@tanstack/react-query';
import React, { PropsWithChildren } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const ReactQueryDevTool = () => {
  useReactQueryDevTools(queryClient);
  return null;
};

export const QueryClientProvider = ({ children }: PropsWithChildren) => {
  return <QProvider client={queryClient}>{children}</QProvider>;
};
