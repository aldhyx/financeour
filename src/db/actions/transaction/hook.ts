import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-key';

import {
  createTransaction,
  getTransactionById,
  getTransactions,
  removeTransaction,
} from './action';
import { GetTransactionsFilter } from './type';

/**
 * a hook used to get transaction by id
 */
export function useTransactionByID(id: string) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.GET_TX_BY_ID, id],
    queryFn: () => getTransactionById(id),
  });

  return query;
}

/**
 * a hook used to get transaction list, with default filter of 5 rows & order by column id descending
 */
export function useTransactions(filter: GetTransactionsFilter = {}) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.GET_TXS, filter],
    queryFn: () => getTransactions(filter),
    initialData: [],
  });

  return query;
}

/**
 * a hook used to create transaction
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess(_) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ACCOUNTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TOTAL_BALANCE],
      });

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TXS] });
    },
  });

  return mutation;
}

/**
 * a hook used to remove transaction by id
 */
export function useRemoveTransaction() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: removeTransaction,
    onSuccess(_, id) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ACCOUNTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TOTAL_BALANCE],
      });

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TXS] });
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.GET_TX_BY_ID, id],
        exact: true,
      });
    },
  });

  return mutation;
}
