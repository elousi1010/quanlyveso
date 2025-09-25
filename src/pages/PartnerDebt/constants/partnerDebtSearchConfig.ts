import type { PartnerDebtSearchFilter } from '../types';

// Search and filter configuration
export const partnerDebtSearchConfig: PartnerDebtSearchFilter[] = [
  {
    id: 'searchKey',
    label: 'Tìm kiếm',
    type: 'text',
    placeholder: 'Tìm kiếm theo tên đối tác, mô tả...',
  },
  {
    id: 'partner_id',
    label: 'Đối tác',
    type: 'select',
    placeholder: 'Chọn đối tác',
    options: [], // Will be populated dynamically
  },
  {
    id: 'payment_method',
    label: 'Phương thức thanh toán',
    type: 'select',
    placeholder: 'Chọn phương thức thanh toán',
    options: [
      { value: 'cash', label: 'Tiền mặt' },
      { value: 'bank_transfer', label: 'Chuyển khoản' },
      { value: 'credit_card', label: 'Thẻ tín dụng' },
      { value: 'other', label: 'Khác' },
    ],
  },
  {
    id: 'payment_type',
    label: 'Loại giao dịch',
    type: 'select',
    placeholder: 'Chọn loại giao dịch',
    options: [
      { value: 'income', label: 'Thu nhập' },
      { value: 'expense', label: 'Chi phí' },
    ],
  },
  {
    id: 'is_active',
    label: 'Trạng thái hoạt động',
    type: 'select',
    placeholder: 'Chọn trạng thái hoạt động',
    options: [
      { value: 'true', label: 'Hoạt động' },
      { value: 'false', label: 'Không hoạt động' },
    ],
  },
  {
    id: 'start_date',
    label: 'Từ ngày',
    type: 'date',
    placeholder: 'Chọn ngày bắt đầu',
  },
  {
    id: 'end_date',
    label: 'Đến ngày',
    type: 'date',
    placeholder: 'Chọn ngày kết thúc',
  },
];

export const filterFields = [
  {
    key: 'status',
    label: 'Trạng thái',
    type: 'select',
    options: [
      { value: '', label: 'Tất cả' },
      { value: 'active', label: 'Hoạt động' },
      { value: 'inactive', label: 'Không hoạt động' },
    ],
  },
  {
    key: 'type',
    label: 'Loại',
    type: 'select',
    options: [
      { value: '', label: 'Tất cả' },
      { value: 'individual', label: 'Cá nhân' },
      { value: 'company', label: 'Công ty' },
    ],
  },
  {
    key: 'dateRange',
    label: 'Khoảng thời gian',
    type: 'dateRange',
  },
];