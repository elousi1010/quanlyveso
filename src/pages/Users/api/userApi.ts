import { api } from '../../../utils/api';
import type {
  UserListResponse,
  UserResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserResponse,
} from '../types';

// User API functions
export const userApi = {
  // Get all users
  getUsers: async (): Promise<UserListResponse> => {
    return api.get<UserListResponse>('/api/v1/users');
  },

  // Get user by ID
  getUser: async (id: string): Promise<UserResponse> => {
    return api.get<UserResponse>(`/api/v1/users/${id}`);
  },

  // Create new user
  createUser: async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    return api.post<CreateUserResponse>('/api/v1/users', data);
  },

  // Update user
  updateUser: async (id: string, data: UpdateUserRequest): Promise<UpdateUserResponse> => {
    return api.put<UpdateUserResponse>(`/api/v1/users/${id}`, data);
  },

  // Delete user
  deleteUser: async (id: string): Promise<DeleteUserResponse> => {
    return api.delete<DeleteUserResponse>(`/api/v1/users/${id}`);
  },
};
