// Partners page-specific types

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
  credit_limit: number;
  commission_rate: number; // Percent %
  last_payment_at: string | null;
  debt_overdue_days: number;
  status_risk: 'normal' | 'warning' | 'high_risk' | 'blacklisted';
  work_area?: string; // Khu vực bán dạo (ví dụ: Quận 1, Ngã tư Bảy Hiền)
  equipment_rented?: string[]; // Danh sách thiết bị thuê (bàn, ghế, dù...)
  notes?: string;
  organization_id: string;
  organization: Organization;
}

export interface CreatePartnerRequest {
  name: string;
  address: string;
  phone_number: string;
  type: 'agent' | 'seller' | 'customer' | 'supplier' | 'other';
  level: number;
  debt?: number;
  credit_limit?: number;
  commission_rate?: number;
}

export interface UpdatePartnerRequest {
  name?: string;
  address?: string;
  phone_number?: string;
  type?: 'agent' | 'seller' | 'customer' | 'supplier' | 'other';
  level?: number;
  debt?: number;
  credit_limit?: number;
  commission_rate?: number;
  status_risk?: 'normal' | 'warning' | 'high_risk' | 'blacklisted';
}

export interface PartnerListResponse {
  message: string;
  error: string;
  statusCode: number;
  data: {
    data: {
      data: Partner[];
      total: number;
    };
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

export interface PartnerSearchParams {
  page?: number;
  limit?: number;
  searchKey?: string;
  type?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
