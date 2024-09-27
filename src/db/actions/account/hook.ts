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
    queryKey: [QUERY_KEYS.GET_TOTAL_BALANCE],
    queryFn: getTotalBalance,
  });

  return query;
}

export function useAccounts(filter: GetAccountsFilter = {}) {
  const { byFavorite = false } = filter;

  const query = useQuery({
    queryKey: [QUERY_KEYS.GET_ACCOUNTS, byFavorite],
    queryFn: () => getAccounts({ byFavorite }),
    initialData: [],
  });

  return query;
}

export function useAccountById(id: string) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.GET_ACCOUNT_BY_ID, id],
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ACCOUNTS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TOTAL_BALANCE],
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ACCOUNTS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ACCOUNT_BY_ID, variables.id],
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ACCOUNTS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ACCOUNT_BY_ID, variables.id],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TOTAL_BALANCE],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TXS] });
    },
  });

  return mutation;
}

export function useRemoveAccount() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: removeAccount,
    onSuccess(_, id) {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ACCOUNTS] });
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.GET_ACCOUNT_BY_ID, id],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TOTAL_BALANCE],
      });
      // todo refresh recent transaction key
    },
  });

  return mutation;
}
