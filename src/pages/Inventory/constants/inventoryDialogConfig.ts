import type { DialogFieldConfig } from '@/components/common/types';
import type { CreateInventoryDto, UpdateInventoryDto } from '../types';

export const inventoryCreateFields: DialogFieldConfig<CreateInventoryDto>[] = [
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
    inputProps: {
      min: 0,
    },
  },
  {
    key: 'avg_cost',
    label: 'Giá Trung Bình',
    type: 'number',
    required: true,
    placeholder: 'Nhập giá trung bình',
    inputProps: {
      step: 1000,
    },
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
      { value: 'return', label: 'Trả về' },
    ],
  },
  {
    key: 'partner_id',
    label: 'Đối Tác',
    type: 'text',
    required: true,
    placeholder: 'Nhập ID đối tác',
  },
  {
    key: 'organization_id',
    label: 'Tổ Chức',
    type: 'text',
    required: true,
    placeholder: 'Nhập ID tổ chức',
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'boolean',
    required: false,
    defaultValue: true,
  },
];

export const inventoryUpdateFields: DialogFieldConfig<UpdateInventoryDto>[] = [
  {
    key: 'code',
    label: 'Mã Kho',
    type: 'text',
    required: false,
    placeholder: 'Nhập mã kho',
  },
  {
    key: 'ticket_id',
    label: 'Mã Vé',
    type: 'text',
    required: false,
    placeholder: 'Nhập mã vé',
  },
  {
    key: 'quantity',
    label: 'Số Lượng',
    type: 'number',
    required: false,
    placeholder: 'Nhập số lượng',
    inputProps: {
      min: 0,
    },
  },
  {
    key: 'avg_cost',
    label: 'Giá Trung Bình',
    type: 'number',
    required: false,
    placeholder: 'Nhập giá trung bình',
    inputProps: {
      step: 1000,
    },
  },
  {
    key: 'draw_date',
    label: 'Ngày Quay',
    type: 'date',
    required: false,
  },
  {
    key: 'sub_type',
    label: 'Loại Phụ',
    type: 'select',
    required: false,
    options: [
      { value: 'buy_from_agent', label: 'Mua từ đại lý' },
      { value: 'sell_to_customer', label: 'Bán cho khách hàng' },
      { value: 'transfer', label: 'Chuyển kho' },
      { value: 'return', label: 'Trả về' },
    ],
  },
  {
    key: 'partner_id',
    label: 'Đối Tác',
    type: 'text',
    required: false,
    placeholder: 'Nhập ID đối tác',
  },
  {
    key: 'organization_id',
    label: 'Tổ Chức',
    type: 'text',
    required: false,
    placeholder: 'Nhập ID tổ chức',
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'boolean',
    required: false,
  },
];

export const inventoryDetailFields: DialogFieldConfig[] = [
  {
    key: 'id',
    label: 'ID',
    type: 'text',
    readonly: true,
  },
  {
    key: 'code',
    label: 'Mã Kho',
    type: 'text',
    readonly: true,
  },
  {
    key: 'ticket_id',
    label: 'Mã Vé',
    type: 'text',
    readonly: true,
  },
  {
    key: 'quantity',
    label: 'Số Lượng',
    type: 'number',
    readonly: true,
  },
  {
    key: 'avg_cost',
    label: 'Giá Trung Bình',
    type: 'number',
    readonly: true,
    valueFormatter: (value) => {
      if (value == null) return '';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value);
    },
  },
  {
    key: 'draw_date',
    label: 'Ngày Quay',
    type: 'date',
    readonly: true,
  },
  {
    key: 'sub_type',
    label: 'Loại Phụ',
    type: 'text',
    readonly: true,
    valueFormatter: (value) => {
      const typeMap: Record<string, string> = {
        'buy_from_agent': 'Mua từ đại lý',
        'sell_to_customer': 'Bán cho khách hàng',
        'transfer': 'Chuyển kho',
        'return': 'Trả về',
      };
      return typeMap[value] || value;
    },
  },
  {
    key: 'partner_id',
    label: 'Đối Tác',
    type: 'text',
    readonly: true,
  },
  {
    key: 'organization_id',
    label: 'Tổ Chức',
    type: 'text',
    readonly: true,
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'boolean',
    readonly: true,
    valueFormatter: (value) => value ? 'Hoạt động' : 'Không hoạt động',
  },
  {
    key: 'created_at',
    label: 'Ngày Tạo',
    type: 'text',
    readonly: true,
    valueFormatter: (value) => {
      if (!value) return '';
      const date = new Date(value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
  },
  {
    key: 'created_by',
    label: 'Người Tạo',
    type: 'text',
    readonly: true,
  },
  {
    key: 'updated_at',
    label: 'Ngày Cập Nhật',
    type: 'text',
    readonly: true,
    valueFormatter: (value) => {
      if (!value) return '';
      const date = new Date(value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
  },
  {
    key: 'updated_by',
    label: 'Người Cập Nhật',
    type: 'text',
    readonly: true,
  },
];
