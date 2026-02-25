// Types for the vé số ticket management system

export interface Province {
  id: string;
  name: string;
  code: string;
  ticketPrice: number;
  commission: number; // Phần trăm hoa hồng
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  address: string;
  provinces: string[]; // Array of province IDs
  isActive: boolean;
  createdAt: Date;
}

export interface Ticket {
  id: string;
  provinceId: string;
  agentId: string;
  ticketNumber: string;
  series?: string; // Dải số
  isFullPack?: boolean; // Cặp nguyên - Cấm xé lẻ nếu chưa được phép
  price: number;
  quantity: number;
  status: 'available' | 'sold' | 'returned' | 'lost'; // Thêm trạng thái 'lost' (mất/hỏng)
  purchaseDate: Date;
  sellDate?: Date;
  sellerId?: string;
}

export interface Seller {
  id: string;
  name: string;
  phone: string;
  agentId: string;
  averageTicketsPerDay: number;
  totalDebt: number;
  isActive: boolean;
  createdAt: Date;
  lat?: number; // Tọa độ GPS phục vụ Bản đồ
  lng?: number;
  workArea?: string; // Tên khu vực phân công
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'return' | 'exchange';
  agentId: string;
  relatedAgentId?: string; // For exchanges
  provinceId: string;
  ticketId?: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Debt {
  id: string;
  agentId: string;
  sellerId?: string;
  amount: number;
  type: 'credit' | 'debit' | 'winning_settlement'; // Thêm hình thức cấn trừ vé trúng
  isCarryForward?: boolean; // Đánh dấu nợ gối đầu (chuyển qua ngày hôm sau)
  description: string;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: Date;
  paidAt?: Date;
}

export interface Exchange {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  provinceId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface ProfitData {
  date: string;
  revenue: number;
  cost: number;
  profit: number;
  ticketCount: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  totalTickets: number;
  activeAgents: number;
  activeSellers: number;
  pendingDebts: number;
}

export type TimeRange = 'day' | 'week' | 'month' | 'year';

// Common API Response Interfaces
export interface BaseApiResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface ApiListResponse<T> extends BaseApiResponse {
  data: {
    data: T[];
    total: number;
  };
}

export interface ApiItemResponse<T> extends BaseApiResponse {
  data: T;
}

export interface ApiDeleteResponse extends BaseApiResponse {
  data: {
    id: string;
  };
}

// Export additional type modules
export * from './auth';
export * from './partner';
export * from './dashboard';
export * from './pagination';

export interface Equipment {
  id: string;
  sellerId: string;
  type: 'table' | 'chair' | 'umbrella' | 'shelf' | 'other';
  name: string;
  status: 'good' | 'damaged' | 'lost' | 'returned';
  rentedAt: Date;
  returnedAt?: Date;
  notes?: string;
}
