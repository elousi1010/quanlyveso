// PartnerDebt types
import React from 'react';
export interface PartnerDebt {
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  is_active: boolean;
  partner_id: string;
  partner: {
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
  };
  payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'other';
  payment_type: 'income' | 'expense';
  amount: string; // API trả về string
  description: string | null;
  inventory_transaction_id: string | null;
  organization_id: string;
  organization: {
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
  };
}

export interface PartnerDebtResponse {
  data: PartnerDebt;
  message: string;
  statusCode: number;
}

export interface PartnerDebtListResponse {
  message: string;
  error: string;
  statusCode: number;
  data: {
    data: PartnerDebt[];
    total: number;
  };
}

export interface CreatePartnerDebtRequest {
  partner_id: string;
  payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'other';
  payment_type: 'income' | 'expense';
  amount: number;
  description?: string;
}

export interface UpdatePartnerDebtRequest {
  partner_id?: string;
  payment_method?: 'cash' | 'bank_transfer' | 'credit_card' | 'other';
  payment_type?: 'income' | 'expense';
  amount?: number;
  description?: string;
  is_active?: boolean;
}

export interface CreatePartnerDebtResponse {
  data: PartnerDebt;
  message: string;
  statusCode: number;
}

export interface PartnerDebtSearchParams {
  page?: number;
  limit?: number;
  searchKey?: string;
  partner_id?: string;
  debt_type?: 'credit' | 'debit';
  status?: 'pending' | 'paid' | 'partial' | 'overdue';
  is_active?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  start_date?: string;
  end_date?: string;
}

export interface PartnerDebtFormData {
  partner_id: string;
  payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'other';
  payment_type: 'income' | 'expense';
  amount: number;
  description?: string;
}

export interface PartnerDebtTableRow {
  id: string;
  partner_name: string;
  payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'other';
  payment_type: 'income' | 'expense';
  amount: number;
  description?: string;
  created_at: string;
  is_active: boolean;
}

export interface PartnerDebtDetailData {
  id: string;
  partner_id: string;
  partner_name: string;
  payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'other';
  payment_type: 'income' | 'expense';
  amount: number;
  description?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// Table column configuration
export interface PartnerDebtTableColumn {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: unknown) => string | React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

// Search filter configuration
export interface PartnerDebtSearchFilter {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'boolean';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

// Dialog configuration
export interface PartnerDebtDialogConfig {
  title: string;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'date' | 'textarea';
    required: boolean;
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
      message?: string;
    };
  }>;
}

// View/Edit configuration
export interface PartnerDebtViewEditConfig {
  title: string;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'date' | 'textarea' | 'readonly';
    required: boolean;
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
      message?: string;
    };
  }>;
}
