import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api';
import type { CreateUserRequest, UpdateUserRequest } from '../types';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hook để lấy danh sách users
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => userApi.getUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook để lấy chi tiết user
export const useUserQuery = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUser(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook để tạo user mới
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userApi.createUser(data),
    onSuccess: () => {
      // Invalidate và refetch danh sách users
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// Hook để cập nhật user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userApi.updateUser(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate và refetch danh sách users và chi tiết user
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
};

// Hook để xóa user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      // Invalidate và refetch danh sách users
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};
