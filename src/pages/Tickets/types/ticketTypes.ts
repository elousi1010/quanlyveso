export interface Ticket {
  id: string;
  ticket_code: string;
  ticket_type: string;
  station_id: string;
  draw_date: string;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTicketDto {
  ticket_code: string;
  ticket_type: string;
  station_id: string;
  draw_date: string;
  note?: string;
}

export interface UpdateTicketDto {
  ticket_code?: string;
  ticket_type?: string;
  station_id?: string;
  draw_date?: string;
  note?: string;
}

export interface TicketResponse {
  data: Ticket[];
  total: number;
  page: number;
  limit: number;
}

export interface TicketSearchParams {
  searchKey?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
