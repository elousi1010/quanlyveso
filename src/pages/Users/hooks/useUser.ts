import { useUserQuery } from './useUserApi';

// Hook để lấy chi tiết user với loading state
export const useUser = (id: string) => {
  const query = useUserQuery(id);

  return {
    user: query.data?.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
