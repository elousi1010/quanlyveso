export const STATION_CONSTANTS = {
  MODULE_NAME: 'Stations',
  MODULE_TITLE: 'Quản lý Trạm',
  API_ENDPOINTS: {
    BASE: '/api/v1/stations',
    CREATE: '/api/v1/stations',
    UPDATE: '/api/v1/stations',
    DELETE: '/api/v1/stations',
  },
  DEFAULT_PAGINATION: {
    PAGE: 1,
    LIMIT: 10,
  },
  SORT_OPTIONS: [
    { value: 'name', label: 'Tên trạm' },
    { value: 'code', label: 'Mã trạm' },
    { value: 'address', label: 'Địa chỉ' },
    { value: 'created_at', label: 'Ngày tạo' },
  ],
} as const;
