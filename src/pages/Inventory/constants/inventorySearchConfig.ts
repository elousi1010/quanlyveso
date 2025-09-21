import type { SearchFieldConfig } from '@/components/common/types';

export const inventorySearchFields: SearchFieldConfig[] = [
  {
    key: 'searchKey',
    label: 'Tìm kiếm',
    type: 'text',
    placeholder: 'Tìm kiếm theo ID...',
  },
];

export const inventoryFilterFields: SearchFieldConfig[] = [
  {
    key: 'sortBy',
    label: 'Sắp xếp theo',
    type: 'select',
    options: [
      { value: 'created_at', label: 'Ngày tạo' },
      { value: 'updated_at', label: 'Ngày cập nhật' },
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
];
