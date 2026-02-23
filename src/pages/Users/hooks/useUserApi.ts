import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api';
import type { CreateUserRequest, UpdateUserRequest, UserSearchParams } from '../types';
import { MOCK_USER_LIST_RESPONSE, MOCK_USERS } from '@/data/commonMockData';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hook để lấy danh sách users
export const useUsers = (searchParams?: Partial<UserSearchParams>) => {
  return useQuery({
    queryKey: userKeys.list(searchParams || {}),
    queryFn: async () => {
      try {
        const response = await userApi.getUsers(searchParams);
        if (!response?.data?.data || response.data.data.length === 0) {
          return MOCK_USER_LIST_RESPONSE;
        }
        return response;
      } catch (error) {
        console.warn('Users API failed, using mock data');
        return MOCK_USER_LIST_RESPONSE;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook để lấy chi tiết user
export const useUserQuery = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      try {
        const response = await userApi.getUser(id);
        return response;
      } catch (error) {
        console.warn('User details API failed, using mock data');
        const mockUser = MOCK_USERS.find(u => u.id === id) || MOCK_USERS[0];
        return { data: mockUser, message: 'Success', error: '', statusCode: 200 };
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations remain the same for now...
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserRequest) => userApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userApi.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};
