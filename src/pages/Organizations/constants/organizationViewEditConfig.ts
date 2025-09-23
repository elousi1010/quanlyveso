import type { FormField, DetailField } from '@/components/common/types';

export const organizationFormFields: FormField[] = [
  {
    key: 'name',
    label: 'Tên Tổ Chức',
    type: 'text',
    required: true,
    placeholder: 'Nhập tên tổ chức',
  },
  {
    key: 'address',
    label: 'Địa Chỉ',
    type: 'textarea',
    required: true,
    placeholder: 'Nhập địa chỉ',
    rows: 3,
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'boolean',
  },
];

export const organizationDetailFields: DetailField[] = [
  {
    key: 'name',
    label: 'Tên Tổ Chức',
    type: 'text',
  },
  {
    key: 'address',
    label: 'Địa Chỉ',
    type: 'text',
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
