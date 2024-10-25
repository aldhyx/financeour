import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-key';

import {
  createTransaction,
  getTransactionById,
  getTransactionGroupedByDay,
  getTransactions,
  removeTransaction,
} from './action';
import {
  GetTransactionGroupedByDayFilter,
  GetTransactionsFilter,
} from './type';

/**
 * a hook used to get transaction by id
 */
export function useTransactionByID(id: string) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.TX_BY_ID, id],
    queryFn: () => getTransactionById(id),
  });

  return query;
}

/**
 * a hook used to get transaction list grouped by day, with default filter to today month & year
 */
export function useTransactionGroupedByDay(
  filter: GetTransactionGroupedByDayFilter = {}
) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.TX_LIST_GROUPED_BY_DAY, filter],
    queryFn: () => getTransactionGroupedByDay(filter),
    initialData: [],
  });

  return query;
}

/**
 * a hook used to get transaction list, with default filter of 5 rows & order by column id descending
 */
export function useTransactions(filter: GetTransactionsFilter = {}) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.TX_LIST, filter],
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
        queryKey: [QUERY_KEYS.ACCOUNT_LIST],
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

/**
 * a hook used to remove transaction by id
 */
export function useRemoveTransaction() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: removeTransaction,
    onSuccess(_, id) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACCOUNT_LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACCOUNT_TOTAL_BALANCE],
      });

      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.TX_BY_ID, id],
        exact: true,
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TX_LIST] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TX_LIST_GROUPED_BY_DAY],
      });
    },
  });

  return mutation;
}
