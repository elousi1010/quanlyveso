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
    fullWidth: false,
  },
  {
    key: 'sortOrder',
    label: 'Thứ tự',
    type: 'select',
    options: [
      { value: 'asc', label: 'Tăng dần' },
      { value: 'desc', label: 'Giảm dần' },
    ],
    fullWidth: false,
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'select',
    options: [
      { value: 'true', label: 'Hoạt động' },
      { value: 'false', label: 'Không hoạt động' },
    ],
    fullWidth: false,
  },
];
