import api from '@/utils/api';
import { DEFAULT_PAGINATION } from '@/types/pagination';
import type {
  PartnerListResponse,
  PartnerResponse,
  CreatePartnerRequest,
  UpdatePartnerRequest,
  CreatePartnerResponse,
  PartnerSearchParams
} from '../types';

// Partners page-specific API functions
export const partnerApi = {
  // Get all partners
  getPartners: async (searchParams?: Partial<PartnerSearchParams>): Promise<PartnerListResponse> => {
    try {
      // Apply default pagination if not provided
      const params: PartnerSearchParams = {
        page: searchParams?.page || DEFAULT_PAGINATION.page,
        limit: searchParams?.limit || DEFAULT_PAGINATION.limit,
        ...searchParams,
      };
      
      const response = await api.get<PartnerListResponse>('/api/v1/partners', { params });
      return response as unknown as PartnerListResponse;
    } catch (error) {
      console.error('API error - getPartners:', error);
      // Return empty data structure on error
      return {
        message: 'Error fetching partners',
      } as PartnerListResponse;
    }
  },

  // Get partner by ID
  getPartnerById: async (id: string): Promise<PartnerResponse> => {
    const response = await api.get<PartnerResponse>(`/api/v1/partners/${id}`);
    return response as unknown as PartnerResponse;
  },

  // Create new partner
  createPartner: async (data: CreatePartnerRequest): Promise<CreatePartnerResponse> => {
    const response = await api.post<CreatePartnerResponse>('/api/v1/partners', data);
    return response as unknown as CreatePartnerResponse;
  },

  // Update partner
  updatePartner: async (id: string, data: UpdatePartnerRequest): Promise<PartnerResponse> => {
    const response = await api.patch<PartnerResponse>(`/api/v1/partners/${id}`, data);
    return response as unknown as PartnerResponse;
  },

  // Delete partner
  deletePartner: async (id: string): Promise<{ message: string; error: string; statusCode: number }> => {
    const response = await api.delete<{ message: string; error: string; statusCode: number }>(`/api/v1/partners/${id}`);
    return response as unknown as { message: string; error: string; statusCode: number };
  },

  // Toggle partner active status
  togglePartnerStatus: async (id: string, is_active: boolean): Promise<PartnerResponse> => {
    const response = await api.patch<PartnerResponse>(`/api/v1/partners/${id}/status`, { is_active });
    return response as unknown as PartnerResponse;
  },
};
