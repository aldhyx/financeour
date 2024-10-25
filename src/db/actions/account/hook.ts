import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-key';

import {
  createAccount,
  getAccountById,
  getAccounts,
  getTotalBalance,
  removeAccount,
  updateAccount,
  updateAccountBalance,
} from './action';
import { GetAccountsFilter } from './type';

export function useTotalBalance() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT_TOTAL_BALANCE],
    queryFn: getTotalBalance,
  });

  return query;
}

export function useAccounts(filter: GetAccountsFilter = {}) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT_LIST, filter],
    queryFn: () => getAccounts(filter),
    initialData: [],
  });

  return query;
}

export function useAccountById(id: string) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT_BY_ID, id],
    queryFn: ({ queryKey }) => getAccountById(queryKey[1]),
    initialData: null,
  });

  return query;
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createAccount,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNT_LIST] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACCOUNT_TOTAL_BALANCE],
      });
    },
  });

  return mutation;
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateAccount,
    onSuccess(_, variables) {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNT_LIST] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACCOUNT_BY_ID, variables.id],
        exact: true,
      });
    },
  });

  return mutation;
}

export function useUpdateAccountBalance() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateAccountBalance,
    onSuccess(_, variables) {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNT_LIST] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACCOUNT_BY_ID, variables.id],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACCOUNT_TOTAL_BALANCE],
      });

      // Invalidate recent transaction in main/home.tsx
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TX_LIST, { limit: 5 }],
        exact: true,
      });
    },
  });

  return mutation;
}

export function useRemoveAccount() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: removeAccount,
    onSuccess(_, id) {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNT_LIST] });
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.ACCOUNT_BY_ID, id],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACCOUNT_TOTAL_BALANCE],
      });
    },
  });

  return mutation;
}
