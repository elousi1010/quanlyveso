import { useQuery } from '@tanstack/react-query';
import { reportsApi, type ReportsOverviewParams, type ReportsRevenueParams } from '@/api/reportsApi';
import { type DashboardFilters } from '@/types/dashboard';

/**
 * Convert date string to API format (YYYY-MM-DD HH:MM:SS)
 */
const formatDateTimeForAPI = (dateString: string, time: string = '00:00:00'): string => {
  // Handle different input formats
  let date: Date;
  
  if (dateString.includes('-') && dateString.length === 10) {
    // Format: YYYY-MM-DD
    date = new Date(dateString + 'T' + time);
  } else {
    // Try to parse as-is
    date = new Date(dateString);
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    // Fallback to current date
    date = new Date();
  }
  
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  // Use the time parameter instead of current time
  return `${year}-${month}-${day} ${time}`;
};

/**
 * Hook for fetching dashboard overview data
 */
export const useDashboardOverview = (filters?: DashboardFilters) => {
  // Set default dates if not provided
  const now = new Date();
  const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  const params: ReportsOverviewParams = {
    start_time: filters?.startDate ? formatDateTimeForAPI(filters.startDate, '00:00:00') : formatDateTimeForAPI(today, '00:00:00'),
    end_time: filters?.endDate ? formatDateTimeForAPI(filters.endDate, '23:59:59') : formatDateTimeForAPI(today, '23:59:59'),
    type: 'daily', // Default to daily view
  };

  return useQuery({
    queryKey: ['dashboard', 'overview', params],
    queryFn: () => reportsApi.getOverview(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    select: (response) => response.data,
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
    queryFn: () => reportsApi.getRevenueReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (response) => response.data,
    enabled: !!filters, // Only run query when filters are available
  });
};

/**
 * Hook for fetching activity report
 */
export const useDashboardActivity = () => {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: () => reportsApi.getActivity(),
    staleTime: 2 * 60 * 1000, // 2 minutes (activities change more frequently)
    refetchInterval: 60 * 1000, // Refetch every minute
    select: (response) => response.data,
  });
};
