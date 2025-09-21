// Partners page-specific constants
export const PARTNER_CONSTANTS = {
  MODULE_TITLE: 'Quản lý đối tác',
} as const;

export const PARTNER_TYPES = {
  agent: 'Đại lý',
  seller: 'Người bán',
  customer: 'Khách hàng',
  supplier: 'Nhà cung cấp',
  other: 'Khác',
} as const;

export const PARTNER_LEVELS = [
  { value: 1, label: 'Cấp 1' },
  { value: 2, label: 'Cấp 2' },
  { value: 3, label: 'Cấp 3' },
  { value: 4, label: 'Cấp 4' },
  { value: 5, label: 'Cấp 5' },
] as const;

export const PARTNER_SORT_OPTIONS = [
  { value: 'name', label: 'Tên' },
  { value: 'created_at', label: 'Ngày tạo' },
  { value: 'type', label: 'Loại' },
  { value: 'level', label: 'Cấp độ' },
  { value: 'debt', label: 'Nợ' },
] as const;

export const PARTNER_GRID_CONFIG = {
  pageSizeOptions: [5, 10, 25, 50],
  defaultPageSize: 10,
  height: 600,
} as const;
