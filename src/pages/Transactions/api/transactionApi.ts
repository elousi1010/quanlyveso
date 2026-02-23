import { api } from '@/utils/api';
import { TRANSACTION_CONSTANTS } from '../constants';
import type {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionResponse,
  TransactionSearchParams
} from '../types';

export const transactionApi = {
  /**
   * Get all transactions with pagination and search
   */
  getAll: async (params: TransactionSearchParams = {}): Promise<TransactionResponse> => {
    const response = await api.get(TRANSACTION_CONSTANTS.API_ENDPOINTS.BASE, { params });
    return response as unknown as TransactionResponse;
  },

  /**
   * Get transaction by ID
   */
  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get(`${TRANSACTION_CONSTANTS.API_ENDPOINTS.BASE}/${id}`);
    return response as unknown as any;
  },

  /**
   * Create new transaction
   */
  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await api.post(TRANSACTION_CONSTANTS.API_ENDPOINTS.CREATE, data);
    return response as unknown as any;
  },

  /**
   * Update transaction
   */
  update: async (id: string, data: UpdateTransactionDto): Promise<Transaction> => {
    const response = await api.patch(`${TRANSACTION_CONSTANTS.API_ENDPOINTS.UPDATE}/${id}`, data);
    return response as unknown as any;
  },

  /**
   * Delete transaction
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`${TRANSACTION_CONSTANTS.API_ENDPOINTS.DELETE}/${id}`);
  },
};
