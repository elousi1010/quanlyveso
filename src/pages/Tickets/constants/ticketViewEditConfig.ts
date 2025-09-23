import type { FormField, DetailField } from '@/components/common/types';

export const ticketFormFields: FormField[] = [
  {
    key: 'code',
    label: 'Mã Vé',
    type: 'text',
    required: true,
    placeholder: 'Nhập mã vé',
  },
  {
    key: 'price',
    label: 'Giá Vé',
    type: 'number',
    required: true,
    placeholder: 'Nhập giá vé',
    min: 0,
  },
  {
    key: 'quantity',
    label: 'Số Lượng',
    type: 'number',
    required: true,
    placeholder: 'Nhập số lượng',
    min: 0,
  },
  {
    key: 'note',
    label: 'Ghi Chú',
    type: 'textarea',
    required: false,
    placeholder: 'Nhập ghi chú',
    rows: 3,
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'boolean',
  },
];

export const ticketDetailFields: DetailField[] = [
  {
    key: 'code',
    label: 'Mã Vé',
    type: 'text',
  },
  {
    key: 'price',
    label: 'Giá Vé',
    type: 'currency',
  },
  {
    key: 'quantity',
    label: 'Số Lượng',
    type: 'number',
  },
  {
    key: 'note',
    label: 'Ghi Chú',
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
