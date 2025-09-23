import { useQuery } from '@tanstack/react-query';
import { partnerDebtApi } from '../api';

export const usePartnerDebt = (id: string) => {
  return useQuery({
    queryKey: ['partnerDebt', id],
    queryFn: () => partnerDebtApi.getPartnerDebtById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
