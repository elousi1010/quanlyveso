import { api } from '../utils/api';

// Partner interfaces
export interface CreatePartnerRequest {
  name: string;
  address: string;
  phone_number: string;
  type: 'agent' | 'seller' | 'customer' | 'supplier' | 'other';
  level: number;
}

export interface UpdatePartnerRequest {
  name: string;
  address: string;
  phone_number: string;
  type: 'agent' | 'seller' | 'customer' | 'supplier' | 'other';
  level: number;
}

export interface Organization {
  id: string;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  is_active: boolean;
  name: string;
  address: string | null;
  owner_id: string;
}

export interface Partner {
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  is_active: boolean;
  name: string;
  phone_number: string;
  type: 'agent' | 'seller' | 'customer' | 'supplier' | 'other';
  address: string;
  level: number;
  debt: number;
  organization_id: string;
  organization: Organization;
}

export interface PartnerListResponse {
  message: string;
  error: string;
  statusCode: number;
  data: {
    data: Partner[];
    total: number;
  };
}

export interface PartnerResponse {
  message: string;
  error: string;
  statusCode: number;
  data: Partner;
}

export interface CreatePartnerResponse {
  message: string;
  error: string;
  statusCode: number;
  data: Partner;
}

// Partner API functions
export const partnerApi = {
  // Get all partners
  getPartners: async (params?: {
    searchKey?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PartnerListResponse> => {
    return await api.get<PartnerListResponse>('/api/v1/partners', { params });
  },

  // Get partner by ID
  getPartnerById: async (id: string): Promise<PartnerResponse> => {
    return await api.get<PartnerResponse>(`/api/v1/partners/${id}`);
  },

  // Create new partner
  createPartner: async (data: CreatePartnerRequest): Promise<CreatePartnerResponse> => {
    return await api.post<CreatePartnerResponse>('/api/v1/partners', data);
  },

  // Update partner
  updatePartner: async (id: string, data: UpdatePartnerRequest): Promise<PartnerResponse> => {
    return await api.patch<PartnerResponse>(`/api/v1/partners/${id}`, data);
  },

  // Delete partner
  deletePartner: async (id: string): Promise<{ message: string; error: string; statusCode: number }> => {
    return await api.delete<{ message: string; error: string; statusCode: number }>(`/api/v1/partners/${id}`);
  },

  // Toggle partner active status
  togglePartnerStatus: async (id: string, is_active: boolean): Promise<PartnerResponse> => {
    return await api.patch<PartnerResponse>(`/api/v1/partners/${id}/status`, { is_active });
  },
};
