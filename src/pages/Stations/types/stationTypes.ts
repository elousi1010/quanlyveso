export interface Station {
  id: string;
  name: string;
  code?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateStationDto {
  name: string;
  code?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  website?: string;
}

export interface UpdateStationDto {
  name?: string;
  code?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  website?: string;
}

export interface StationResponse {
  data: Station[];
  total: number;
  page: number;
  limit: number;
  success?: boolean;
  message?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface StationSearchParams {
  searchKey?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
