// Partner and agent management types

export interface Organization {
  id: string;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  is_active: boolean;
  name: string;
  address: string | null;
  owner_id: string;
}

export interface Partner {
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  is_active: boolean;
  name: string;
  phone_number: string;
  type: 'agent' | 'seller' | 'customer' | 'supplier' | 'other';
  address: string;
  level: number;
  debt: number;
  organization_id: string;
  organization: Organization;
}

export interface CreatePartnerRequest {
  name: string;
  address: string;
  phone_number: string;
  type: 'agent' | 'seller' | 'customer' | 'supplier' | 'other';
  level: number;
}

export interface UpdatePartnerRequest {
  name: string;
  address: string;
  phone_number: string;
  type: 'agent' | 'seller' | 'customer' | 'supplier' | 'other';
  level: number;
}

export interface PartnerListResponse {
  message: string;
  error: string;
  statusCode: number;
  data: {
    data: Partner[];
    total: number;
  };
}

export interface PartnerResponse {
  message: string;
  error: string;
  statusCode: number;
  data: Partner;
}

export interface CreatePartnerResponse {
  message: string;
  error: string;
  statusCode: number;
  data: Partner;
}

// Legacy types for backward compatibility
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