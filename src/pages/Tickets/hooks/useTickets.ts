import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from '../api';
import { scraperApi } from '../api/scraperApi';
import type { TicketSearchParams } from '../types';
import { MOCK_TICKET_RESPONSE } from '../constants/mockTickets';
import { MOCK_LOTTERY_RESULTS } from '@/data/mockLotteryResults';
import dayjs from 'dayjs';

export const useTickets = (params: TicketSearchParams = {}) => {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: async () => {
      try {
        const response = await ticketApi.getAll(params);
        // Nếu API trả về data rỗng, dùng mock data
        if (!response?.data || response.data.length === 0) {
          return MOCK_TICKET_RESPONSE;
        }
        return response;
      } catch (error) {
        console.warn('Ticket API failed, using mock data:', error);
        return MOCK_TICKET_RESPONSE;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useLotteryResults = (date?: string) => {
  const queryDate = date || dayjs().format('YYYY-MM-DD');

  return useQuery({
    queryKey: ['lottery-results', queryDate],
    queryFn: async () => {
      try {
        const response = await scraperApi.getResultsByDate(queryDate);
        if (!response || response.length === 0) {
          return MOCK_LOTTERY_RESULTS;
        }
        return response;
      } catch (error) {
        console.warn('Scraper API failed, using mock data:', error);
        return MOCK_LOTTERY_RESULTS;
      }
    },
    enabled: !!queryDate,
    staleTime: 30 * 60 * 1000,
  });
};
