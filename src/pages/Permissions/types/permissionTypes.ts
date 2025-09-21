export interface Permission {
  id: string;
  name: string;
  code: string;
  actions: Record<string, string[]>;
  created_at?: string;
  updated_at?: string;
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
}
