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
  {
    key: 'credit_limit',
    label: 'Hạn mức tín dụng (VNĐ)',
    type: 'number',
    required: false,
    placeholder: 'Nhập hạn mức tín dụng',
  },
  {
    key: 'commission_rate',
    label: 'Hoa hồng (%)',
    type: 'number',
    required: false,
    placeholder: 'Nhập mức hoa hồng (ví dụ: 10)',
  },
  {
    key: 'work_area',
    label: 'Khu vực bán (Cho người bán dạo)',
    type: 'text',
    required: false,
    placeholder: 'Nhập khu vực (ví dụ: Công viên Lê Văn Tám)',
  },
  {
    key: 'notes',
    label: 'Ghi chú thêm',
    type: 'textarea',
    required: false,
    placeholder: 'Ví dụ: Tình trạng thiết bị, thâm niên...',
    rows: 2,
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
    label: 'Nợ hiện tại (VNĐ)',
    type: 'currency',
    render: (debt: number) => debt ? debt.toLocaleString('vi-VN') + ' VNĐ' : '0 VNĐ',
  },
  {
    key: 'credit_limit',
    label: 'Hạn mức tín dụng (VNĐ)',
    type: 'currency',
    render: (limit: number) => limit ? limit.toLocaleString('vi-VN') + ' VNĐ' : 'Chưa thiết lập',
  },
  {
    key: 'commission_rate',
    label: 'Hoa hồng (%)',
    type: 'text',
    render: (rate: number) => rate ? `${rate}%` : 'Chưa thiết lập',
  },
  {
    key: 'work_area',
    label: 'Khu vực bán',
    type: 'text',
    render: (area: string) => area || 'Chưa xác định',
  },
  {
    key: 'notes',
    label: 'Ghi chú',
    type: 'text',
    render: (notes: string) => notes || 'Không có ghi chú',
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
