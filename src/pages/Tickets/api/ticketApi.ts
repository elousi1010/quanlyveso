import { api } from '@/utils/api';
import type { 
  Ticket, 
  CreateTicketDto, 
  UpdateTicketDto, 
  TicketResponse, 
  TicketSearchParams 
} from '../types';

const API_BASE = 'https://lottery.esimvn.net/api/v1';

export const ticketApi = {
  // Get all tickets with pagination and search
  getAll: async (params: TicketSearchParams = {}): Promise<TicketResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.searchKey) searchParams.append('searchKey', params.searchKey);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const response = await api.get(`${API_BASE}/tickets?${searchParams.toString()}`);
    return (response as any).data;
  },

  // Get ticket by ID
  getById: async (id: string): Promise<Ticket> => {
    const response = await api.get(`${API_BASE}/tickets/${id}`);
    return (response as any).data;
  },

  // Create new ticket
  create: async (data: CreateTicketDto): Promise<Ticket> => {
    const response = await api.post(`${API_BASE}/tickets`, data);
    return (response as any).data;
  },

  // Update ticket
  update: async (id: string, data: UpdateTicketDto): Promise<Ticket> => {
    const response = await api.patch(`${API_BASE}/tickets/${id}`, data);
    return (response as any).data;
  },

  // Delete ticket
  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/tickets/${id}`);
  },
};
