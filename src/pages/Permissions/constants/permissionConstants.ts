export const PERMISSION_CONSTANTS = {
  MODULE_NAME: 'Permissions',
  MODULE_TITLE: 'Quản lý Quyền hạn',
  API_ENDPOINTS: {
    BASE: '/api/v1/permissions',
    CREATE: '/api/v1/permissions',
    UPDATE: '/api/v1/permissions',
    DELETE: '/api/v1/permissions',
    BASE_PERMISSIONS: '/api/v1/permissions/base',
    SET_FOR_USER: '/api/v1/permissions/set-for-user',
  },
  DEFAULT_PAGINATION: {
    PAGE: 1,
    LIMIT: 5,
  },
  SORT_OPTIONS: [
    { value: 'name', label: 'Tên quyền' },
    { value: 'code', label: 'Mã quyền' },
    { value: 'created_at', label: 'Ngày tạo' },
  ],
  ACTION_TYPES: [
    { value: 'read', label: 'Đọc' },
    { value: 'create', label: 'Tạo' },
    { value: 'update', label: 'Cập nhật' },
    { value: 'delete', label: 'Xóa' },
  ],
  RESOURCE_TYPES: [
    { value: 'user', label: 'Người dùng' },
    { value: 'organization', label: 'Tổ chức' },
    { value: 'permission', label: 'Quyền hạn' },
    { value: 'station', label: 'Trạm' },
    { value: 'inventory', label: 'Kho' },
    { value: 'partner', label: 'Đối tác' },
    { value: 'transaction', label: 'Giao dịch' },
    { value: 'ticket', label: 'Vé số' },
  ],
} as const;
