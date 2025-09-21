import type { SearchFieldConfig } from '@/components/common/types';

export const organizationSearchFields: SearchFieldConfig[] = [
  {
    key: 'searchKey',
    label: 'Tìm kiếm',
    type: 'text',
    placeholder: 'Tìm kiếm theo tên, địa chỉ...',
  },
];

export const organizationFilterFields: SearchFieldConfig[] = [
  {
    key: 'sortBy',
    label: 'Sắp xếp theo',
    type: 'select',
    options: [
      { value: 'name', label: 'Tên tổ chức' },
      { value: 'address', label: 'Địa chỉ' },
      { value: 'created_at', label: 'Ngày tạo' },
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
