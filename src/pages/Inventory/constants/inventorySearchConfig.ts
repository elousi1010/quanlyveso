import type { SearchAndFilterConfig } from '@/components/common';

export const inventorySearchFields: SearchAndFilterConfig = {
  searchPlaceholder: 'Tìm kiếm theo mã kho, mã vé...',
  sortOptions: [
    { value: 'code', label: 'Mã Kho' },
    { value: 'ticket_id', label: 'Mã Vé' },
    { value: 'quantity', label: 'Số Lượng' },
    { value: 'avg_cost', label: 'Giá Trung Bình' },
    { value: 'draw_date', label: 'Ngày Quay' },
    { value: 'created_at', label: 'Ngày Tạo' },
    { value: 'updated_at', label: 'Ngày Cập Nhật' },
  ],
  filterOptions: [
    {
      key: 'is_active',
      label: 'Trạng Thái',
      options: [
        { value: '', label: 'Tất cả' },
        { value: 'true', label: 'Hoạt động' },
        { value: 'false', label: 'Không hoạt động' },
      ],
    },
    {
      key: 'sub_type',
      label: 'Loại Phụ',
      options: [
        { value: '', label: 'Tất cả' },
        { value: 'buy_from_agent', label: 'Mua từ đại lý' },
        { value: 'sell_to_customer', label: 'Bán cho khách hàng' },
        { value: 'transfer', label: 'Chuyển kho' },
        { value: 'return', label: 'Trả về' },
      ],
    },
  ],
};

export const inventoryFilterFields: SearchFieldConfig[] = [
  {
    key: 'sortBy',
    label: 'Sắp xếp theo',
    type: 'select',
    options: [
      { value: 'code', label: 'Mã Kho' },
      { value: 'ticket_id', label: 'Mã Vé' },
      { value: 'quantity', label: 'Số Lượng' },
      { value: 'avg_cost', label: 'Giá Trung Bình' },
      { value: 'draw_date', label: 'Ngày Quay' },
      { value: 'created_at', label: 'Ngày Tạo' },
      { value: 'updated_at', label: 'Ngày Cập Nhật' },
    ],
  },
  {
    key: 'sortOrder',
    label: 'Thứ tự',
    type: 'select',
    options: [
      { value: 'asc', label: 'Tăng dần' },
      { value: 'desc', label: 'Giảm dần' },
    ],
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'select',
    options: [
      { value: 'true', label: 'Hoạt động' },
      { value: 'false', label: 'Không hoạt động' },
    ],
  },
  {
    key: 'sub_type',
    label: 'Loại Phụ',
    type: 'select',
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
    placeholder: 'Tìm kiếm theo ID đối tác',
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