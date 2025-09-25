import type { SearchFieldConfig } from '@/components/common/types';

export const inventoryTransactionSearchFields: SearchFieldConfig[] = [
  {
    key: 'searchKey',
    label: 'Tìm kiếm',
    type: 'text',
    placeholder: 'Tìm kiếm theo mã giao dịch, mã vé...',
  },
  {
    key: 'type',
    label: 'Loại Giao Dịch',
    type: 'select',
    options: [
      { value: 'import', label: 'Nhập' },
      { value: 'export', label: 'Xuất' },
    ],
  },
  {
    key: 'sub_type',
    label: 'Loại Phụ',
    type: 'select',
    options: [
      { value: 'return_from_seller', label: 'Trả từ người bán' },
      { value: 'buy_from_partner', label: 'Mua từ đối tác' },
      { value: 'sell_to_customer', label: 'Bán cho khách hàng' },
      { value: 'transfer', label: 'Chuyển kho' },
      { value: 'return', label: 'Trả hàng' },
    ],
  },
  {
    key: 'partner_id',
    label: 'Đối Tác',
    type: 'text',
    placeholder: 'Nhập ID đối tác',
  },
  {
    key: 'draw_date',
    label: 'Ngày Quay',
    type: 'date',
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