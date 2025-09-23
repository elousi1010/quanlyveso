import type { FormField, DetailField } from '../../../components/common';

export const PARTNER_TYPES = [
  { value: 'agent', label: 'Đại lý' },
  { value: 'seller', label: 'Người bán' },
  { value: 'customer', label: 'Khách hàng' },
  { value: 'supplier', label: 'Nhà cung cấp' },
  { value: 'other', label: 'Khác' },
];

export const PARTNER_LEVELS = [
  { value: 1, label: 'Cấp 1' },
  { value: 2, label: 'Cấp 2' },
  { value: 3, label: 'Cấp 3' },
  { value: 4, label: 'Cấp 4' },
  { value: 5, label: 'Cấp 5' },
];

export const PARTNER_FORM_FIELDS: FormField[] = [
  {
    key: 'name',
    label: 'Tên đối tác',
    type: 'text',
    required: true,
    placeholder: 'Nhập tên đối tác',
  },
  {
    key: 'phone_number',
    label: 'Số điện thoại',
    type: 'text',
    required: true,
    placeholder: 'Nhập số điện thoại',
  },
  {
    key: 'address',
    label: 'Địa chỉ',
    type: 'textarea',
    required: true,
    placeholder: 'Nhập địa chỉ',
    rows: 3,
  },
  {
    key: 'type',
    label: 'Loại',
    type: 'select',
    required: true,
    options: PARTNER_TYPES,
  },
  {
    key: 'level',
    label: 'Cấp độ',
    type: 'select',
    required: true,
    options: PARTNER_LEVELS,
  },
  {
    key: 'debt',
    label: 'Nợ (VNĐ)',
    type: 'number',
    required: false,
    placeholder: 'Nhập số nợ',
  },
];

export const PARTNER_DETAIL_FIELDS: DetailField[] = [
  {
    key: 'name',
    label: 'Tên đối tác',
    type: 'text',
  },
  {
    key: 'phone_number',
    label: 'Số điện thoại',
    type: 'text',
  },
  {
    key: 'address',
    label: 'Địa chỉ',
    type: 'text',
  },
  {
    key: 'type',
    label: 'Loại',
    type: 'custom',
    render: (type: string) => {
      const typeLabel = PARTNER_TYPES.find(t => t.value === type)?.label || type;
      return typeLabel;
    },
    chip: {
      color: 'primary',
      variant: 'outlined',
    },
  },
  {
    key: 'level',
    label: 'Cấp độ',
    type: 'custom',
    render: (level: number) => `Cấp ${level}`,
    chip: {
      color: 'secondary',
      variant: 'outlined',
    },
  },
  {
    key: 'debt',
    label: 'Nợ (VNĐ)',
    type: 'currency',
    render: (debt: number) => debt ? debt.toLocaleString('vi-VN') + ' VNĐ' : '0 VNĐ',
  },
  {
    key: 'is_active',
    label: 'Trạng thái',
    type: 'custom',
    render: (isActive: boolean) => isActive ? 'Hoạt động' : 'Không hoạt động',
    chip: {
      color: 'success',
      variant: 'filled',
    },
  },
  {
    key: 'created_at',
    label: 'Ngày tạo',
    type: 'date',
    render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
  },
  {
    key: 'updated_at',
    label: 'Ngày cập nhật',
    type: 'date',
    render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
  },
];
