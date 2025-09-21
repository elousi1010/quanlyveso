export interface Organization {
  id: string;
  name: string;
  address: string;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateOrganizationDto {
  name: string;
  address: string;
  owner_id: string;
}

export interface UpdateMyOrganizationDto {
  name: string;
  address?: string;
}

export interface OrganizationResponse {
  data: Organization[];
  total: number;
  page: number;
  limit: number;
}

export interface OrganizationSearchParams {
  searchKey?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
