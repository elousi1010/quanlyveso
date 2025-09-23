import type { FormField, DetailField } from '@/components/common/types';

export const inventoryFormFields: FormField[] = [
  {
    key: 'code',
    label: 'Mã Kho',
    type: 'text',
    required: true,
    placeholder: 'Nhập mã kho',
  },
  {
    key: 'ticket_id',
    label: 'Mã Vé',
    type: 'text',
    required: true,
    placeholder: 'Nhập mã vé',
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
    key: 'avg_cost',
    label: 'Giá Trung Bình',
    type: 'number',
    required: true,
    placeholder: 'Nhập giá trung bình',
    min: 0,
  },
  {
    key: 'draw_date',
    label: 'Ngày Quay',
    type: 'date',
    required: true,
  },
  {
    key: 'sub_type',
    label: 'Loại Phụ',
    type: 'select',
    required: true,
    options: [
      { value: 'buy_from_agent', label: 'Mua từ đại lý' },
      { value: 'sell_to_customer', label: 'Bán cho khách hàng' },
      { value: 'transfer', label: 'Chuyển kho' },
      { value: 'return', label: 'Trả lại' },
    ],
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'boolean',
  },
];

export const inventoryDetailFields: DetailField[] = [
  {
    key: 'code',
    label: 'Mã Kho',
    type: 'text',
  },
  {
    key: 'ticket_id',
    label: 'Mã Vé',
    type: 'text',
  },
  {
    key: 'quantity',
    label: 'Số Lượng',
    type: 'number',
  },
  {
    key: 'avg_cost',
    label: 'Giá Trung Bình',
    type: 'currency',
  },
  {
    key: 'draw_date',
    label: 'Ngày Quay',
    type: 'date',
  },
  {
    key: 'sub_type',
    label: 'Loại Phụ',
    type: 'custom',
    render: (subType: unknown) => {
      const typeMap: Record<string, string> = {
        'buy_from_agent': 'Mua từ đại lý',
        'sell_to_customer': 'Bán cho khách hàng',
        'transfer': 'Chuyển kho',
        'return': 'Trả lại',
      };
      return typeMap[subType as string] || String(subType);
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
