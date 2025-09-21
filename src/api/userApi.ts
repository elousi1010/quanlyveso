import { api } from '../utils/api';

// User interfaces
export interface CreateUserRequest {
  name: string;
  phone_number: string;
  role: string;
  password?: string;
  email?: string;
  organization_id?: string;
}

export interface UpdateUserRequest {
  id: string;
  name?: string;
  phone_number?: string;
  role?: string;
  password?: string;
  email?: string;
  is_active?: boolean;
}

export interface User {
  id: string;
  name: string;
  phone_number: string;
  role: string;
  email?: string;
  organization_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface UserListResponse {
  message: string;
  error: string;
  statusCode: number;
  data: {
    users: User[];
    total: number;
    page: number;
    limit: number;
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

// User API functions
export const userApi = {
  // Get all users
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    is_active?: boolean;
  }): Promise<UserListResponse> => {
    return await api.get<UserListResponse>('/api/v1/users', { params });
  },

  // Get user by ID
  getUserById: async (id: string): Promise<UserResponse> => {
    return await api.get<UserResponse>(`/api/v1/users/${id}`);
  },

  // Create new user
  createUser: async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    return await api.post<CreateUserResponse>('/api/v1/users', data);
  },

  // Update user
  updateUser: async (data: UpdateUserRequest): Promise<UpdateUserResponse> => {
    const { id, ...updateData } = data;
    return await api.put<UpdateUserResponse>(`/api/v1/users/${id}`, updateData);
  },

  // Delete user
  deleteUser: async (id: string): Promise<DeleteUserResponse> => {
    return await api.delete<DeleteUserResponse>(`/api/v1/users/${id}`);
  },

  // Toggle user active status
  toggleUserStatus: async (id: string, is_active: boolean): Promise<UpdateUserResponse> => {
    return await api.patch<UpdateUserResponse>(`/api/v1/users/${id}/status`, { is_active });
  },

  // Reset user password
  resetPassword: async (id: string, new_password: string): Promise<UpdateUserResponse> => {
    return await api.patch<UpdateUserResponse>(`/api/v1/users/${id}/password`, { new_password });
  },
};
