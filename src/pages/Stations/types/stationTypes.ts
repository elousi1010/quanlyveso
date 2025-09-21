import { type ApiListResponse, type ApiItemResponse, type ApiDeleteResponse } from '@/types';

export interface Station {
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  is_active: boolean;
  name: string;
  code: string;
  address: string;
  phone_number: string;
  email: string;
  website: string;
}

export interface CreateStationDto {
  name: string;
  code: string;
  address: string;
  phone_number: string;
  email?: string;
  website?: string;
}

export interface UpdateStationDto {
  name: string;
  code: string;
  address: string;
  phone_number: string;
  email?: string;
  website?: string;
}

export type StationListResponse = ApiListResponse<Station>;
export type StationResponse = ApiItemResponse<Station>;
export type CreateStationResponse = ApiItemResponse<Station>;
export type UpdateStationResponse = ApiItemResponse<Station>;
export type DeleteStationResponse = ApiDeleteResponse;

export interface StationSearchParams {
  searchKey?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
