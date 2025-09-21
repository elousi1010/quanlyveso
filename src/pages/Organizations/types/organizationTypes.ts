import { type ApiListResponse, type ApiItemResponse, type ApiDeleteResponse } from '@/types';

export interface Organization {
  id: string;
  name: string;
  address: string | null;
  owner_id: string;
}

export interface CreateOrganizationDto {
  name: string;
  address?: string;
  owner_id?: string;
}

export interface UpdateOrganizationDto {
  name: string;
  address?: string;
}

export interface UpdateMyOrganizationDto {
  name: string;
  address?: string;
}

export type OrganizationListResponse = ApiListResponse<Organization>;
export type OrganizationResponse = ApiItemResponse<Organization>;
export type CreateOrganizationResponse = ApiItemResponse<Organization>;
export type UpdateOrganizationResponse = ApiItemResponse<Organization>;
export type DeleteOrganizationResponse = ApiDeleteResponse;

export interface OrganizationSearchParams {
  searchKey?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
