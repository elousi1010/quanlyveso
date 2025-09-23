export interface Ticket {
  price: number;
  quantity: number;
  code: string;
  note?: string;
}

export interface Inventory {
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string | null;
  is_active: boolean;
  ticket_id: string;
  code: string;
  avg_cost: number;
  quantity: number;
  draw_date: string;
  organization_id: string;
  sub_type: 'buy_from_agent' | 'sell_to_customer' | 'transfer' | 'return';
  partner_id: string;
}

export interface CreateInventoryDto {
  draw_date: string;
  ticket_type: string;
  station_id: string;
  type: 'import' | 'export';
  sub_type: 'buy_from_agent' | 'sell_to_customer' | 'transfer' | 'return' | 'return_from_seller' | 'buy_from_partner' | 'exchange_ticket' | 'return_to_agent' | 'sell_to_seller' | 'sell_to_online';
  partner_id: string;
  note?: string;
  tickets: Ticket[];
  is_update?: boolean;
}

export interface UpdateInventoryDto {
  draw_date?: string;
  ticket_type?: string;
  station_id?: string;
  type?: 'import' | 'export';
  sub_type?: 'buy_from_agent' | 'sell_to_customer' | 'transfer' | 'return';
  partner_id?: string;
  note?: string;
  tickets?: Ticket[];
  is_update?: boolean;
  quantity?: number;
  avg_cost?: number;
  is_active?: boolean;
}

export interface InventoryResponse {
  data: Inventory[];
  total: number;
  page: number;
  limit: number;
}

export interface InventorySearchParams {
  searchKey?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
