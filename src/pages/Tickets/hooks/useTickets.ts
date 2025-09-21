import { useQuery } from '@tanstack/react-query';
import { ticketApi } from '../api';
import type { TicketSearchParams } from '../types';

export const useTickets = (params: TicketSearchParams = {}) => {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => ticketApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
