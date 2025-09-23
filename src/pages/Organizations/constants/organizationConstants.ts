export const ORGANIZATION_CONSTANTS = {
  MODULE_NAME: 'Organizations',
  MODULE_TITLE: 'Quản lý Tổ chức',
  API_ENDPOINTS: {
    BASE: '/api/v1/organizations',
    CREATE: '/api/v1/organizations',
    UPDATE: '/api/v1/organizations',
    DELETE: '/api/v1/organizations',
  },
  DEFAULT_PAGINATION: {
    PAGE: 1,
    LIMIT: 5,
  },
  SORT_OPTIONS: [
    { value: 'name', label: 'Tên tổ chức' },
    { value: 'address', label: 'Địa chỉ' },
    { value: 'created_at', label: 'Ngày tạo' },
  ],
  PARTNER_TYPES: [
    { value: 'agent', label: 'Đại lý' },
    { value: 'distributor', label: 'Nhà phân phối' },
    { value: 'retailer', label: 'Bán lẻ' },
  ],
} as const;
