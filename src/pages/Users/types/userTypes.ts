// Users page-specific types

export interface User {
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  is_active: boolean;
  name: string;
  phone_number: string;
  role: 'admin' | 'user' | 'owner' | 'employee' | 'seller';
  organization_id: string;
  organization: {
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
  };
}

export interface CreateUserRequest {
  name: string;
  phone_number: string;
  password: string;
  role: 'admin' | 'user' | 'owner' | 'employee' | 'seller';
}

export interface UpdateUserRequest {
  name: string;
  phone_number: string;
  role: 'admin' | 'user' | 'owner' | 'employee' | 'seller';
}

export interface UserListResponse {
  message: string;
  error: string;
  statusCode: number;
  data: {
    data: User[];
    total: number;
  };
}

export interface UserResponse {
  message: string;
  error: string;
  statusCode: number;
  data: User;
}

export interface CreateUserResponse {
  message: string;
  error: string;
  statusCode: number;
  data: User;
}

export interface UpdateUserResponse {
  message: string;
  error: string;
  statusCode: number;
  data: User;
}

export interface DeleteUserResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface UserSearchParams {
  searchKey?: string;  // Search key parameter
  page?: number;       // Page number
  limit?: number;      // Limit number
  sortBy?: string;     // Sort by field
  sortOrder?: 'asc' | 'desc';  // Sort order
}
