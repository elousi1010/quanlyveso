export interface InventoryTransactionItem {
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  is_active: boolean;
  inventory_id: string;
  inventory: {
    id: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string | null;
    deleted_at: string | null;
    is_active: boolean;
    ticket_id: string;
    code: string;
    avg_cost: number;
    quantity: number;
    draw_date: string;
    organization_id: string;
  };
  transaction_id: string;
  transaction: {
    id: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string | null;
    deleted_at: string | null;
    is_active: boolean;
    type: 'import' | 'export';
    sub_type: 'return_from_seller' | 'buy_from_partner' | 'sell_to_customer' | 'transfer' | 'return';
    note: string;
    partner_id: string;
    organization_id: string;
  };
  quantity: number;
  price: string;
  total: string;
}

export interface CreateInventoryTransactionItemDto {
  code: string;
  ticket_id: string;
  quantity: number;
  avg_cost: number;
  draw_date: string;
  type: 'import' | 'export';
  sub_type: 'buy_from_agent' | 'sell_to_customer' | 'transfer' | 'return';
  station_id: string;
  partner_id: string;
  note?: string;
  is_active?: boolean;
}

export interface UpdateInventoryTransactionItemDto {
  code?: string;
  ticket_id?: string;
  quantity?: number;
  avg_cost?: number;
  draw_date?: string;
  type?: 'import' | 'export';
  sub_type?: 'buy_from_agent' | 'sell_to_customer' | 'transfer' | 'return';
  station_id?: string;
  partner_id?: string;
  note?: string;
  is_active?: boolean;
}

export interface InventoryTransactionSearchParams {
  searchKey?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  type?: 'import' | 'export';
  sub_type?: 'buy_from_agent' | 'sell_to_customer' | 'transfer' | 'return';
  partner_id?: string;
}

export interface InventoryTransactionListResponse {
  data: {data: InventoryTransactionItem[] , total: number};
  message: string;
  error: string;
  statusCode: number;
}

export type InventoryTransactionType = 'import' | 'export';
