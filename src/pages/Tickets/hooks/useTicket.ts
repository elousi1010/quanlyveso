import { useQuery } from '@tanstack/react-query';
import { ticketApi } from '../api';

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
