export interface Transaction {
  id: string;
  amount: number;
  type: string;
  subType: string;
  swap_id?: string;
  partner_id: string;
  note?: string;
  tickets: Array<{
    ticket_id: string;
    qt: number;
    price: number;
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTransactionDto {
  amount: number;
  type: string;
  subType: string;
  swap_id?: string;
  partner_id: string;
  note?: string;
  tickets: Array<{
    ticket_id: string;
    qt: number;
    price: number;
  }>;
}

export interface UpdateTransactionDto {
  amount?: number;
  type?: string;
  subType?: string;
  swap_id?: string;
  partner_id?: string;
  note?: string;
  tickets?: Array<{
    ticket_id: string;
    qt: number;
    price: number;
  }>;
}

export interface TransactionResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export interface TransactionSearchParams {
  searchKey?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
