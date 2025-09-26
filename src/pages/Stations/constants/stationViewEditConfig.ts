import type { FormField, DetailField } from '@/components/common/types';

export const stationFormFields: FormField[] = [
  {
    key: 'name',
    label: 'Tên Trạm',
    type: 'text',
    required: true,
    placeholder: 'Nhập tên trạm',
  },
  {
    key: 'address',
    label: 'Địa Chỉ',
    type: 'textarea',
    required: true,
    placeholder: 'Nhập địa chỉ trạm',
    rows: 3,
  },
  {
    key: 'phone_number',
    label: 'Số Điện Thoại',
    type: 'tel',
    required: false,
    placeholder: 'Nhập số điện thoại',
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'boolean',
  },
];

export const stationDetailFields: DetailField[] = [
  {
    key: 'name',
    label: 'Tên Trạm',
    type: 'text',
  },
  {
    key: 'address',
    label: 'Địa Chỉ',
    type: 'text',
  },
  {
    key: 'phone_number',
    label: 'Số Điện Thoại',
    type: 'tel',
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
