import { api } from '@/utils/api';
import type {
  PartnerDebtListResponse,
  PartnerDebtResponse,
  CreatePartnerDebtRequest,
  UpdatePartnerDebtRequest,
  CreatePartnerDebtResponse,
  PartnerDebtSearchParams
} from '../types/partnerDebtTypes';

const API_BASE = '/api/v1/partner-debt';

/**
 * PartnerDebt API
 * 
 * Standardized API service for managing partner debts.
 */
export const partnerDebtApi = {
  // Get all partner debts
  getPartnerDebts: async (params?: PartnerDebtSearchParams): Promise<PartnerDebtListResponse> => {
    const response = await api.get(API_BASE, { params });
    return response as unknown as PartnerDebtListResponse;
  },

  // Get partner debt by ID
  getPartnerDebtById: async (id: string): Promise<PartnerDebtResponse> => {
    const response = await api.get(`${API_BASE}/${id}`);
    return response as unknown as PartnerDebtResponse;
  },

  // Create new partner debt
  createPartnerDebt: async (data: CreatePartnerDebtRequest): Promise<CreatePartnerDebtResponse> => {
    const response = await api.post(API_BASE, data);
    return response as unknown as CreatePartnerDebtResponse;
  },

  // Update partner debt
  updatePartnerDebt: async (id: string, data: UpdatePartnerDebtRequest): Promise<PartnerDebtResponse> => {
    const response = await api.patch(`${API_BASE}/${id}`, data);
    return response as unknown as PartnerDebtResponse;
  },

  // Delete partner debt
  deletePartnerDebt: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/${id}`);
  },

  // Toggle partner debt status
  togglePartnerDebtStatus: async (id: string, is_active: boolean): Promise<PartnerDebtResponse> => {
    const response = await api.patch(`${API_BASE}/${id}/status`, { is_active });
    return response as unknown as PartnerDebtResponse;
  },
};
