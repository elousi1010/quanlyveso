import { useQuery } from '@tanstack/react-query';
import { partnerDebtApi } from '../api';
import type { PartnerDebtSearchParams, PartnerDebtListResponse } from '../types';
import { MOCK_PARTNER_DEBT_LIST_RESPONSE } from '@/data/commonMockData';

export const usePartnerDebts = (searchParams?: PartnerDebtSearchParams) => {
  return useQuery<PartnerDebtListResponse>({
    queryKey: ['partnerDebts', searchParams],
    queryFn: async () => {
      try {
        const response = await partnerDebtApi.getPartnerDebts(searchParams);
        if (!response?.data?.data || response.data.data.length === 0) {
          return MOCK_PARTNER_DEBT_LIST_RESPONSE;
        }
        return response;
      } catch (error) {
        console.warn('Partner Debts API failed, using mock data');
        return MOCK_PARTNER_DEBT_LIST_RESPONSE;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
