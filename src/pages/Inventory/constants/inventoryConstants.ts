export const INVENTORY_CONSTANTS = {
  MODULE_NAME: 'Inventory',
  MODULE_TITLE: 'Quản lý Kho',
  API_ENDPOINTS: {
    BASE: '/api/v1/inventory',
    CREATE: '/api/v1/inventory',
    UPDATE: '/api/v1/inventory',
    DELETE: '/api/v1/inventory',
  },
  DEFAULT_PAGINATION: {
    PAGE: 1,
    LIMIT: 5,
  },
  SORT_OPTIONS: [
    { value: 'created_at', label: 'Ngày tạo' },
    { value: 'updated_at', label: 'Ngày cập nhật' },
  ],
} as const;
