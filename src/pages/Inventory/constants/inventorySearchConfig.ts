import type { SearchFieldConfig } from '@/components/common/types';

export const inventorySearchFields: SearchFieldConfig[] = [
  {
    key: 'searchKey',
    label: 'Tìm kiếm',
    type: 'text',
    placeholder: 'Tìm kiếm theo mã kho, mã vé...',
  },
];

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
