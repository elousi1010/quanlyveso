// PartnerDebt constants
export const PARTNER_DEBT_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  
  // Debt types
  DEBT_TYPES: [
    { value: 'credit', label: 'Công nợ' },
    { value: 'debit', label: 'Nợ' },
  ] as const,
  
  // Status options
  STATUS_OPTIONS: [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'paid', label: 'Đã thanh toán' },
    { value: 'partial', label: 'Thanh toán một phần' },
    { value: 'overdue', label: 'Quá hạn' },
  ] as const,
  
  // Table configuration
  TABLE_CONFIG: {
    ROWS_PER_PAGE: 10,
    DENSE: false,
    STICKY_HEADER: true,
  },
  
  // API endpoints
  API_ENDPOINTS: {
    BASE: '/api/v1/partner-debt',
    LIST: '/api/v1/partner-debt',
    DETAIL: (id: string) => `/api/v1/partner-debt/${id}`,
    CREATE: '/api/v1/partner-debt',
    UPDATE: (id: string) => `/api/v1/partner-debt/${id}`,
    DELETE: (id: string) => `/api/v1/partner-debt/${id}`,
    TOGGLE_STATUS: (id: string) => `/api/v1/partner-debt/${id}/status`,
  },
  
  // Form validation
  VALIDATION: {
    DEBT_AMOUNT: {
      MIN: 0,
      MAX: 999999999,
    },
    DESCRIPTION: {
      MAX_LENGTH: 500,
    },
  },
  
  // Date formats
  DATE_FORMATS: {
    DISPLAY: 'DD/MM/YYYY',
    API: 'YYYY-MM-DD',
  },
  
  // Currency
  CURRENCY: {
    SYMBOL: 'VNĐ',
    DECIMAL_PLACES: 0,
  },
} as const;

// Export individual constants for easier access
export const {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  DEBT_TYPES,
  STATUS_OPTIONS,
  TABLE_CONFIG,
  API_ENDPOINTS,
  VALIDATION,
  DATE_FORMATS,
  CURRENCY,
} = PARTNER_DEBT_CONSTANTS;
