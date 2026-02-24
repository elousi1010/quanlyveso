import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from '../api';
import { scraperApi } from '../api/scraperApi';
import type { TicketSearchParams } from '../types';

import dayjs from 'dayjs';

export const useTickets = (params: TicketSearchParams = {}) => {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: async () => {
      const response = await ticketApi.getAll(params);
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useLotteryResults = (date?: string) => {
  const queryDate = date || dayjs().format('YYYY-MM-DD');

  return useQuery({
    queryKey: ['lottery-results', queryDate],
    queryFn: async () => {
      const response = await scraperApi.getResultsByDate(queryDate);
      return response;
    },
    enabled: !!queryDate,
    staleTime: 30 * 60 * 1000,
  });
};
