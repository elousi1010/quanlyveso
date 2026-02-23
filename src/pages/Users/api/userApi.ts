import { api } from '@/utils/api';
import { withDefaultPagination } from '@/utils';
import type {
  UserListResponse,
  UserResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserResponse,
  UserSearchParams,
} from '../types';

const API_BASE = '/api/v1/users';

/**
 * User API
 * 
 * Standardized API service for managing system users.
 */
export const userApi = {
  // Get all users
  getUsers: async (searchParams?: Partial<UserSearchParams>): Promise<UserListResponse> => {
    const params = withDefaultPagination(searchParams);
    const response = await api.get(API_BASE, { params });
    return response as unknown as UserListResponse;
  },

  // Get user by ID
  getUser: async (id: string): Promise<UserResponse> => {
    const response = await api.get(`${API_BASE}/${id}`);
    return response as unknown as UserResponse;
  },

  // Create new user
  createUser: async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    const response = await api.post(API_BASE, data);
    return response as unknown as CreateUserResponse;
  },

  // Update user
  updateUser: async (id: string, data: UpdateUserRequest): Promise<UpdateUserResponse> => {
    const response = await api.put(`${API_BASE}/${id}`, data);
    return response as unknown as UpdateUserResponse;
  },

  // Delete user
  deleteUser: async (id: string): Promise<DeleteUserResponse> => {
    const response = await api.delete(`${API_BASE}/${id}`);
    return (response as any).data;
  },
};
