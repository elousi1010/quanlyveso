import type { FormField, DetailField } from '@/components/common/types';

export const transactionFormFields: FormField[] = [
  {
    key: 'amount',
    label: 'Số Tiền',
    type: 'number',
    required: true,
    placeholder: 'Nhập số tiền',
    min: 0,
  },
  {
    key: 'type',
    label: 'Loại Giao Dịch',
    type: 'select',
    required: true,
    options: [
      { value: 'deposit', label: 'Nạp tiền' },
      { value: 'withdraw', label: 'Rút tiền' },
      { value: 'transfer', label: 'Chuyển khoản' },
      { value: 'payment', label: 'Thanh toán' },
    ],
  },
  {
    key: 'status',
    label: 'Trạng Thái',
    type: 'select',
    required: true,
    options: [
      { value: 'pending', label: 'Đang chờ' },
      { value: 'completed', label: 'Hoàn thành' },
      { value: 'failed', label: 'Thất bại' },
      { value: 'cancelled', label: 'Đã hủy' },
    ],
  },
  {
    key: 'description',
    label: 'Mô Tả',
    type: 'textarea',
    required: false,
    placeholder: 'Nhập mô tả giao dịch',
    rows: 3,
  },
];

export const transactionDetailFields: DetailField[] = [
  {
    key: 'amount',
    label: 'Số Tiền',
    type: 'currency',
  },
  {
    key: 'type',
    label: 'Loại Giao Dịch',
    type: 'custom',
    render: (type: unknown) => {
      const typeMap: Record<string, string> = {
        'deposit': 'Nạp tiền',
        'withdraw': 'Rút tiền',
        'transfer': 'Chuyển khoản',
        'payment': 'Thanh toán',
      };
      return typeMap[type as string] || String(type);
    },
    chip: {
      color: 'primary',
      variant: 'outlined',
    },
  },
  {
    key: 'status',
    label: 'Trạng Thái',
    type: 'custom',
    render: (status: unknown) => {
      const statusMap: Record<string, string> = {
        'pending': 'Đang chờ',
        'completed': 'Hoàn thành',
        'failed': 'Thất bại',
        'cancelled': 'Đã hủy',
      };
      return statusMap[status as string] || String(status);
    },
    chip: {
      color: 'success',
      variant: 'filled',
    },
  },
  {
    key: 'description',
    label: 'Mô Tả',
    type: 'text',
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
