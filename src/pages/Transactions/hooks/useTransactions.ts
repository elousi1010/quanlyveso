import { useQuery } from '@tanstack/react-query';
import { transactionApi } from '../api';
import type { TransactionSearchParams } from '../types';

export const useTransactions = (params: TransactionSearchParams = {}) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
