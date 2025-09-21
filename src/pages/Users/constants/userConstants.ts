// User management constants

export const USER_ROLES = [
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'user', label: 'Người dùng' },
  { value: 'owner', label: 'Chủ sở hữu' },
  { value: 'employee', label: 'Nhân viên' },
  { value: 'seller', label: 'Người bán' },
] as const;

export const USER_STATUS_OPTIONS = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
] as const;

export const USER_SORT_OPTIONS = [
  { value: 'created_at', label: 'Ngày tạo' },
  { value: 'updated_at', label: 'Ngày cập nhật' },
  { value: 'name', label: 'Tên' },
  { value: 'role', label: 'Vai trò' },
] as const;

export const USER_TABLE_COLUMNS = [
  { field: 'name', headerName: 'Tên người dùng', width: 200 },
  { field: 'phone_number', headerName: 'Số điện thoại', width: 150 },
  { field: 'role', headerName: 'Vai trò', width: 120 },
  { field: 'organization', headerName: 'Tổ chức', width: 200 },
  { field: 'is_active', headerName: 'Trạng thái', width: 120 },
  { field: 'created_at', headerName: 'Ngày tạo', width: 150 },
  { field: 'actions', headerName: 'Thao tác', width: 120, sortable: false },
] as const;
