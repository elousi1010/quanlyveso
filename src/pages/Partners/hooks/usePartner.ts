import { useQuery } from '@tanstack/react-query';
import { partnerApi } from '../api';
import { partnerKeys } from './usePartners';

// Page-specific hook for single Partner
export const usePartner = (id: string) => {
  return useQuery({
    queryKey: partnerKeys.detail(id),
    queryFn: async () => {
      const response = await partnerApi.getPartnerById(id);

      // Transform data để partnerDetail?.data trả về trực tiếp partner object
      return {
        ...response,
        data: response.data
      };
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
