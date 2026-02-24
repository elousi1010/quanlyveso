import { useQuery } from '@tanstack/react-query';
import { reportsApi, type ReportsOverviewParams, type ReportsRevenueParams } from '@/api/reportsApi';
import { type DashboardFilters } from '@/types/dashboard';


/**
 * Convert date string to API format (YYYY-MM-DD HH:MM:SS)
 */
const formatDateTimeForAPI = (dateString: string, time: string = '00:00:00'): string => {
  let date: Date;
  if (dateString.includes('-') && dateString.length === 10) {
    date = new Date(dateString + 'T' + time);
  } else {
    date = new Date(dateString);
  }
  if (isNaN(date.getTime())) {
    date = new Date();
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${time}`;
};

/**
 * Hook for fetching dashboard overview data
 */
export const useDashboardOverview = (filters?: DashboardFilters) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const params: ReportsOverviewParams = {
    start_time: filters?.startDate ? formatDateTimeForAPI(filters.startDate, '00:00:00') : formatDateTimeForAPI(today, '00:00:00'),
    end_time: filters?.endDate ? formatDateTimeForAPI(filters.endDate, '23:59:59') : formatDateTimeForAPI(today, '23:59:59'),
    type: 'daily',
  };

  return useQuery({
    queryKey: ['dashboard', 'overview', params],
    queryFn: async () => {
      const response = await reportsApi.getOverview(params);
      return response?.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
  });
};

/**
 * Hook for fetching revenue report
 */
export const useDashboardRevenue = (type?: 'daily' | 'weekly' | 'monthly' | 'yearly', filters?: DashboardFilters) => {
  const params: ReportsRevenueParams = {
    type: type || 'daily',
    start_time: filters?.startDate ? formatDateTimeForAPI(filters.startDate, '00:00:00') : undefined,
    end_time: filters?.endDate ? formatDateTimeForAPI(filters.endDate, '23:59:59') : undefined,
  };

  return useQuery({
    queryKey: ['dashboard', 'revenue', params],
    queryFn: async () => {
      const response = await reportsApi.getRevenueReport(params);
      let data = response?.data;

      // Unwrap data if it's nested
      if (data && !Array.isArray(data) && (data as any).data) {
        data = (data as any).data;
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!filters,
  });
};

/**
 * Hook for fetching activity report
 */
export const useDashboardActivity = () => {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: async () => {
      const response = await reportsApi.getActivity();
      const data = response?.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray((data as any)?.data)) return (data as any).data;

      return [];
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });
};
