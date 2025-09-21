import type { DialogFieldConfig } from '@/components/common/types';
import type { CreateTransactionDto, UpdateTransactionDto } from '../types';

export const transactionCreateFields: DialogFieldConfig<CreateTransactionDto>[] = [
  {
    key: 'amount',
    label: 'Số tiền',
    type: 'number',
    required: true,
    placeholder: 'Nhập số tiền',
  },
  {
    key: 'type',
    label: 'Loại giao dịch',
    type: 'select',
    required: true,
    options: [
      { value: 'income', label: 'Thu nhập' },
      { value: 'expense', label: 'Chi phí' },
    ],
  },
  {
    key: 'subType',
    label: 'Loại phụ',
    type: 'select',
    required: true,
    options: [
      { value: 'buy_from_agent', label: 'Mua từ đại lý' },
      { value: 'sell_to_customer', label: 'Bán cho khách hàng' },
      { value: 'commission', label: 'Hoa hồng' },
      { value: 'refund', label: 'Hoàn tiền' },
    ],
  },
  {
    key: 'partner_id',
    label: 'ID Đối tác',
    type: 'text',
    required: true,
    placeholder: 'Nhập ID đối tác',
  },
  {
    key: 'swap_id',
    label: 'ID Swap',
    type: 'text',
    required: false,
    placeholder: 'Nhập ID swap',
  },
  {
    key: 'note',
    label: 'Ghi chú',
    type: 'text',
    required: false,
    placeholder: 'Nhập ghi chú',
  },
  {
    key: 'tickets',
    label: 'Vé số',
    type: 'json',
    required: true,
    placeholder: '[{"ticket_id": "uuid", "qt": 1, "price": 100}]',
  },
];

export const transactionUpdateFields: DialogFieldConfig<UpdateTransactionDto>[] = [
  {
    key: 'amount',
    label: 'Số tiền',
    type: 'number',
    required: false,
    placeholder: 'Nhập số tiền',
  },
  {
    key: 'type',
    label: 'Loại giao dịch',
    type: 'select',
    required: false,
    options: [
      { value: 'income', label: 'Thu nhập' },
      { value: 'expense', label: 'Chi phí' },
    ],
  },
  {
    key: 'subType',
    label: 'Loại phụ',
    type: 'select',
    required: false,
    options: [
      { value: 'buy_from_agent', label: 'Mua từ đại lý' },
      { value: 'sell_to_customer', label: 'Bán cho khách hàng' },
      { value: 'commission', label: 'Hoa hồng' },
      { value: 'refund', label: 'Hoàn tiền' },
    ],
  },
  {
    key: 'partner_id',
    label: 'ID Đối tác',
    type: 'text',
    required: false,
    placeholder: 'Nhập ID đối tác',
  },
  {
    key: 'swap_id',
    label: 'ID Swap',
    type: 'text',
    required: false,
    placeholder: 'Nhập ID swap',
  },
  {
    key: 'note',
    label: 'Ghi chú',
    type: 'text',
    required: false,
    placeholder: 'Nhập ghi chú',
  },
  {
    key: 'tickets',
    label: 'Vé số',
    type: 'json',
    required: false,
    placeholder: '[{"ticket_id": "uuid", "qt": 1, "price": 100}]',
  },
];

export const transactionDetailFields: DialogFieldConfig[] = [
  {
    key: 'id',
    label: 'ID',
    type: 'text',
    readonly: true,
  },
  {
    key: 'amount',
    label: 'Số tiền',
    type: 'text',
    readonly: true,
  },
  {
    key: 'type',
    label: 'Loại giao dịch',
    type: 'text',
    readonly: true,
  },
  {
    key: 'subType',
    label: 'Loại phụ',
    type: 'text',
    readonly: true,
  },
  {
    key: 'partner_id',
    label: 'ID Đối tác',
    type: 'text',
    readonly: true,
  },
  {
    key: 'swap_id',
    label: 'ID Swap',
    type: 'text',
    readonly: true,
  },
  {
    key: 'note',
    label: 'Ghi chú',
    type: 'text',
    readonly: true,
  },
  {
    key: 'tickets',
    label: 'Vé số',
    type: 'json',
    readonly: true,
  },
  {
    key: 'created_at',
    label: 'Ngày tạo',
    type: 'text',
    readonly: true,
  },
  {
    key: 'updated_at',
    label: 'Ngày cập nhật',
    type: 'text',
    readonly: true,
  },
];
