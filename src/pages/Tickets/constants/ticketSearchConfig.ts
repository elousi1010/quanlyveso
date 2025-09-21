import type { SearchFieldConfig } from '@/components/common/types';

export const ticketSearchFields: SearchFieldConfig[] = [
  {
    key: 'searchKey',
    label: 'Tìm kiếm',
    type: 'text',
    placeholder: 'Tìm kiếm theo mã vé, loại vé...',
  },
];

export const ticketFilterFields: SearchFieldConfig[] = [
  {
    key: 'sortBy',
    label: 'Sắp xếp theo',
    type: 'select',
    options: [
      { value: 'ticket_code', label: 'Mã vé' },
      { value: 'ticket_type', label: 'Loại vé' },
      { value: 'draw_date', label: 'Ngày quay' },
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
