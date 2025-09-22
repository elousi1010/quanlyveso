export interface Permission {
  id: string;
  name: string;
  code: string;
  actions: Record<string, number>;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  is_active: boolean;
  users: string[];
  organization_id: string;
}

export interface CreatePermissionDto {
  name: string;
  code: string;
  actions: Record<string, string[]>;
}

export interface UpdatePermissionDto {
  name?: string;
  code?: string;
  actions?: Record<string, string[]>;
}

export interface SetPermissionsForUserDto {
  user_id: string;
}

export interface ApiResponse<T> {
  message: string;
  error: string;
  statusCode: number;
  data: T;
}

export interface PermissionResponse {
  data: Permission[];
  total: number;
  page: number;
  limit: number;
}

export interface PermissionSearchParams {
  searchKey?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: unknown;
}

export interface BasePermission {
  read: number;
  create: number;
  update: number;
  delete: number;
}

export interface BasePermissionsResponse {
  user: BasePermission;
  permission: BasePermission;
  partner: BasePermission;
  ticket: BasePermission;
  transaction: BasePermission;
  organization: BasePermission;
}

export interface User {
  id: string;
  name: string;
  phone_number: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
}
