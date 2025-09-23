import api from '../../../utils/api';
import type {
  PartnerDebtListResponse,
  PartnerDebtResponse,
  CreatePartnerDebtRequest,
  UpdatePartnerDebtRequest,
  CreatePartnerDebtResponse,
  PartnerDebtSearchParams
} from '../types/partnerDebtTypes';

// PartnerDebt page-specific API functions
export const partnerDebtApi = {
  // Get all partner debts
  getPartnerDebts: async (searchParams?: PartnerDebtSearchParams): Promise<PartnerDebtListResponse> => {
    try {
      const response = await api.get<PartnerDebtListResponse>('/api/v1/partner-debt', { params: searchParams });
      return response.data as unknown as PartnerDebtListResponse;
    } catch (error) {
      console.error('API error - getPartnerDebts:', error);
      throw error;
    }
  },

  // Get partner debt by ID
  getPartnerDebtById: async (id: string): Promise<PartnerDebtResponse> => {
    const response = await api.get<PartnerDebtResponse>(`/api/v1/partner-debt/${id}`);
    return response as unknown as PartnerDebtResponse;
  },

  // Create new partner debt
  createPartnerDebt: async (data: CreatePartnerDebtRequest): Promise<CreatePartnerDebtResponse> => {
    const response = await api.post<CreatePartnerDebtResponse>('/api/v1/partner-debt', data);
    return response as unknown as CreatePartnerDebtResponse;
  },

  // Update partner debt
  updatePartnerDebt: async (id: string, data: UpdatePartnerDebtRequest): Promise<PartnerDebtResponse> => {
    const response = await api.patch<PartnerDebtResponse>(`/api/v1/partner-debt/${id}`, data);
    return response as unknown as PartnerDebtResponse;
  },

  // Delete partner debt
  deletePartnerDebt: async (id: string): Promise<{ message: string; error: string; statusCode: number }> => {
    const response = await api.delete<{ message: string; error: string; statusCode: number }>(`/api/v1/partner-debt/${id}`);
    return response as unknown as { message: string; error: string; statusCode: number };
  },

  // Toggle partner debt status
  togglePartnerDebtStatus: async (id: string, is_active: boolean): Promise<PartnerDebtResponse> => {
    const response = await api.patch<PartnerDebtResponse>(`/api/v1/partner-debt/${id}/status`, { is_active });
    return response as unknown as PartnerDebtResponse;
  },
};
