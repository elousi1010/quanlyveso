import type { FormField, DetailField } from '../../../components/common';
import { USER_ROLES } from './userConstants';

export const USER_FORM_FIELDS: FormField[] = [
  {
    key: 'name',
    label: 'Tên người dùng',
    type: 'text',
    required: true,
    placeholder: 'Nhập tên người dùng',
  },
  {
    key: 'phone_number',
    label: 'Số điện thoại',
    type: 'text',
    required: true,
    placeholder: 'Nhập số điện thoại',
  },
  {
    key: 'password',
    label: 'Mật khẩu',
    type: 'password',
    required: true,
    placeholder: 'Nhập mật khẩu',
  },
  {
    key: 'role',
    label: 'Vai trò',
    type: 'select',
    required: true,
    options: USER_ROLES as unknown as { value: string; label: string }[],
  },
];

export const USER_DETAIL_FIELDS: DetailField[] = [
  {
    key: 'name',
    label: 'Tên người dùng',
  },
  {
    key: 'phone_number',
    label: 'Số điện thoại',
  },
  {
    key: 'role',
    label: 'Vai trò',
    chip: {
      color: 'primary',
      variant: 'outlined',
    },
  },
  {
    key: 'organization',
    label: 'Tổ chức',
    render: (organization: unknown) => (organization as { key: string })?.key || 'N/A',
  },
  {
    key: 'is_active',
    label: 'Trạng thái',
    chip: {
      color: 'success',
      variant: 'filled',
    },
  },
  {
    key: 'created_at',
    label: 'Ngày tạo',
  },
  {
    key: 'updated_at',
    label: 'Ngày cập nhật',
  },
];
