import type { FormField, DetailField } from '@/components/common/types';

export const userFormFields: FormField[] = [
  {
    key: 'username',
    label: 'Tên Đăng Nhập',
    type: 'text',
    required: true,
    placeholder: 'Nhập tên đăng nhập',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'Nhập email',
  },
  {
    key: 'full_name',
    label: 'Họ và Tên',
    type: 'text',
    required: true,
    placeholder: 'Nhập họ và tên',
  },
  {
    key: 'phone',
    label: 'Số Điện Thoại',
    type: 'tel',
    required: false,
    placeholder: 'Nhập số điện thoại',
  },
  {
    key: 'role',
    label: 'Vai Trò',
    type: 'select',
    required: true,
    options: [
      { value: 'admin', label: 'Quản trị viên' },
      { value: 'manager', label: 'Quản lý' },
      { value: 'staff', label: 'Nhân viên' },
      { value: 'user', label: 'Người dùng' },
    ],
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'boolean',
  },
];

export const userDetailFields: DetailField[] = [
  {
    key: 'username',
    label: 'Tên Đăng Nhập',
    type: 'text',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
  },
  {
    key: 'full_name',
    label: 'Họ và Tên',
    type: 'text',
  },
  {
    key: 'phone',
    label: 'Số Điện Thoại',
    type: 'tel',
  },
  {
    key: 'role',
    label: 'Vai Trò',
    type: 'custom',
    render: (role: unknown) => {
      const roleMap: Record<string, string> = {
        'admin': 'Quản trị viên',
        'manager': 'Quản lý',
        'staff': 'Nhân viên',
        'user': 'Người dùng',
      };
      return roleMap[role as string] || String(role);
    },
    chip: {
      color: 'primary',
      variant: 'outlined',
    },
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'custom',
    render: (isActive: unknown) => isActive ? 'Hoạt động' : 'Không hoạt động',
    chip: {
      color: 'success',
      variant: 'filled',
    },
  },
  {
    key: 'created_at',
    label: 'Ngày Tạo',
    type: 'date',
  },
  {
    key: 'updated_at',
    label: 'Ngày Cập Nhật',
    type: 'date',
  },
];
