import { api } from '@/utils/api';
import { TICKET_CONSTANTS } from '../constants';
import type {
  Ticket,
  CreateTicketDto,
  UpdateTicketDto,
  TicketResponse,
  TicketSearchParams
} from '../types';

export const ticketApi = {
  /**
   * Get all tickets with pagination and search
   * Uses consolidated params for maintainability.
   */
  getAll: async (params: TicketSearchParams = {}): Promise<TicketResponse> => {
    const response = await api.get(TICKET_CONSTANTS.API_ENDPOINTS.BASE, { params });
    return response as unknown as TicketResponse;
  },

  /**
   * Get ticket by ID
   */
  getById: async (id: string): Promise<Ticket> => {
    const response = await api.get(`${TICKET_CONSTANTS.API_ENDPOINTS.BASE}/${id}`);
    return response as unknown as any;
  },

  /**
   * Create new ticket
   */
  create: async (data: CreateTicketDto): Promise<Ticket> => {
    const response = await api.post(TICKET_CONSTANTS.API_ENDPOINTS.CREATE, data);
    return response as unknown as any;
  },

  /**
   * Update ticket
   */
  update: async (id: string, data: UpdateTicketDto): Promise<Ticket> => {
    const response = await api.patch(`${TICKET_CONSTANTS.API_ENDPOINTS.UPDATE}/${id}`, data);
    return response as unknown as any;
  },

  /**
   * Delete ticket
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`${TICKET_CONSTANTS.API_ENDPOINTS.DELETE}/${id}`);
  },
};
