import { useQuery } from '@tanstack/react-query';
import { partnerDebtApi } from '../api';
import type { PartnerDebtSearchParams, PartnerDebtListResponse } from '../types';

export const usePartnerDebts = (searchParams?: PartnerDebtSearchParams) => {
  return useQuery<PartnerDebtListResponse>({
    queryKey: ['partnerDebts', searchParams],
    queryFn: () => partnerDebtApi.getPartnerDebts(searchParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
