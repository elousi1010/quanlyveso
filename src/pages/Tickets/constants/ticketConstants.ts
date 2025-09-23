export const TICKET_CONSTANTS = {
  MODULE_NAME: 'Tickets',
  MODULE_TITLE: 'Quản lý Vé số',
  API_ENDPOINTS: {
    BASE: '/api/v1/tickets',
    CREATE: '/api/v1/tickets',
    UPDATE: '/api/v1/tickets',
    DELETE: '/api/v1/tickets',
  },
  DEFAULT_PAGINATION: {
    PAGE: 1,
    LIMIT: 5,
  },
  SORT_OPTIONS: [
    { value: 'ticket_code', label: 'Mã vé' },
    { value: 'ticket_type', label: 'Loại vé' },
    { value: 'draw_date', label: 'Ngày quay' },
    { value: 'created_at', label: 'Ngày tạo' },
  ],
  TICKET_TYPES: [
    { value: 'traditional', label: 'Truyền thống' },
    { value: 'online', label: 'Trực tuyến' },
    { value: 'instant', label: 'Tức thời' },
  ],
} as const;
