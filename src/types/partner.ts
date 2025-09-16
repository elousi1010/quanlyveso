// Partner and agent management types

export interface Partner {
  id: string;
  name: string;
  type: 'agent' | 'distributor' | 'wholesaler';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  provinces: string[]; // Array of province IDs
  commission: number; // Phần trăm hoa hồng
  creditLimit: number; // Hạn mức tín dụng
  currentDebt: number; // Nợ hiện tại
  isActive: boolean;
  contractStartDate: Date;
  contractEndDate?: Date;
  notes?: string;
}

export interface PartnerPerformance {
  partnerId: string;
  period: 'daily' | 'weekly' | 'monthly';
  ticketsSold: number;
  revenue: number;
  profit: number;
  commission: number;
  debt: number;
  paymentHistory: PaymentRecord[];
}

export interface PaymentRecord {
  id: string;
  partnerId: string;
  amount: number;
  type: 'payment' | 'credit' | 'debit';
  description: string;
  date: Date;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface PartnerContract {
  id: string;
  partnerId: string;
  contractNumber: string;
  startDate: Date;
  endDate: Date;
  terms: string;
  commission: number;
  creditLimit: number;
  isActive: boolean;
  documents: string[]; // File paths
}
