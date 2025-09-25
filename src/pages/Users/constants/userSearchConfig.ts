import type { SearchAndFilterConfig } from '@/components/common';

export const USER_SORT_OPTIONS = [
  { value: 'created_at', label: 'Ngày tạo' },
  { value: 'updated_at', label: 'Ngày cập nhật' },
  { value: 'name', label: 'Tên' },
  { value: 'phone_number', label: 'Số điện thoại' },
  { value: 'role', label: 'Vai trò' },
];

export const USER_ROLE_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'user', label: 'Người dùng' },
  { value: 'owner', label: 'Chủ sở hữu' },
  { value: 'employee', label: 'Nhân viên' },
  { value: 'seller', label: 'Người bán' },
];

export const USER_STATUS_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
];

export const USER_SEARCH_FILTER_CONFIG: SearchAndFilterConfig = {
  searchPlaceholder: 'Tìm kiếm người dùng...',
  sortOptions: USER_SORT_OPTIONS,
  filterOptions: [
    {
      key: 'role',
      label: 'Vai trò',
      options: USER_ROLE_OPTIONS,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      options: USER_STATUS_OPTIONS,
    },
  ],
};
