import { type ApiItemResponse } from '@/types';
import { api } from '@/utils/api';

// Types for Reports API
export interface ReportsOverview {
  debt: {
    this: string | null;
    prev: string | null;
  };
  ticketImport: {
    this: string | null;
    prev: string | null;
  };
  ticketExport: {
    this: string | null;
    prev: string | null;
  };
  transaction: {
    this: string | null;
    prev: string | null;
  };
}

export interface ReportsOverviewParams {
  start_time?: string; // Format: 2025-09-24 00:00:00
  end_time?: string;   // Format: 2025-09-24 23:59:59
  type?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface ReportsRevenueParams {
  type?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_time?: string;
  end_time?: string;
}

export interface RevenueReport {
  import: number;
  export: number;
  total: number;
  label: string;
}

export type RevenueReportData = RevenueReport[];

export interface ActivityReport {
  activity: {
    id: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string | null;
    deleted_at: string | null;
    is_active: boolean;
    inventory_id: string;
    transaction_id: string;
    transaction: {
      id: string;
      created_at: string;
      created_by: string;
      updated_at: string;
      updated_by: string | null;
      deleted_at: string | null;
      is_active: boolean;
      type: string;
      sub_type: string;
      note: string;
      partner_id: string;
      partner: unknown | null;
      organization_id: string;
    };
    quantity: number;
    price: string;
    total: string;
  };
  inventory: {
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
  };
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
    type: string;
    address: string;
    level: number;
    debt: number;
    organization_id: string;
  };
}

class ReportsApi {
  private baseUrl = '/reports';

  /**
   * Get dashboard overview data
   * @param params - Query parameters including start_time, end_time, and type
   */
  async getOverview(params?: ReportsOverviewParams): Promise<ApiItemResponse<ReportsOverview>> {
    const queryParams = new URLSearchParams();
    
    if (params?.start_time) {
      queryParams.append('start_time', params.start_time);
    }
    if (params?.end_time) {
      queryParams.append('end_time', params.end_time);
    }
    if (params?.type) {
      queryParams.append('type', params.type);
    }

    const url = queryParams.toString() 
      ? `${this.baseUrl}/overview?${queryParams.toString()}`
      : `${this.baseUrl}/overview`;

    const response = await api.get<ApiItemResponse<ReportsOverview>>(url);
    return response as unknown as ApiItemResponse<ReportsOverview>;
  }

  /**
   * Get revenue report
   * @param params - Query parameters with type (daily, weekly, monthly, yearly)
   */
  async getRevenueReport(params?: ReportsRevenueParams): Promise<ApiItemResponse<RevenueReportData>> {
    const queryParams = new URLSearchParams();
    
    if (params?.type) {
      queryParams.append('type', params.type);
    }

    const url = queryParams.toString() 
      ? `${this.baseUrl}/revenue?${queryParams.toString()}`
      : `${this.baseUrl}/revenue`;

    const response = await api.get<ApiItemResponse<RevenueReportData>>(url);
    return response as unknown as ApiItemResponse<RevenueReportData>;
  }

  /**
   * Get activity report (no parameters)
   */
  async getActivity(): Promise<ApiItemResponse<ActivityReport>> {
    const url = `${this.baseUrl}/activity`;
    const response = await api.get<ApiItemResponse<ActivityReport>>(url);
    return response as unknown as ApiItemResponse<ActivityReport>;
  }
}

export const reportsApi = new ReportsApi();
