export const TRANSACTION_CONSTANTS = {
  MODULE_NAME: 'Transactions',
  MODULE_TITLE: 'Quản lý Giao dịch',
  API_ENDPOINTS: {
    BASE: '/api/v1/transactions',
    CREATE: '/api/v1/transactions',
    UPDATE: '/api/v1/transactions',
    DELETE: '/api/v1/transactions',
  },
  DEFAULT_PAGINATION: {
    PAGE: 1,
    LIMIT: 10,
  },
  SORT_OPTIONS: [
    { value: 'amount', label: 'Số tiền' },
    { value: 'type', label: 'Loại giao dịch' },
    { value: 'created_at', label: 'Ngày tạo' },
  ],
  TRANSACTION_TYPES: [
    { value: 'income', label: 'Thu nhập' },
    { value: 'expense', label: 'Chi phí' },
  ],
  SUB_TYPES: [
    { value: 'buy_from_agent', label: 'Mua từ đại lý' },
    { value: 'sell_to_customer', label: 'Bán cho khách hàng' },
    { value: 'commission', label: 'Hoa hồng' },
    { value: 'refund', label: 'Hoàn tiền' },
  ],
} as const;
