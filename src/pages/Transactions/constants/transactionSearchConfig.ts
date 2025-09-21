import type { SearchFieldConfig } from '@/components/common/types';

export const transactionSearchFields: SearchFieldConfig[] = [
  {
    key: 'searchKey',
    label: 'Tìm kiếm',
    type: 'text',
    placeholder: 'Tìm kiếm theo số tiền, loại giao dịch...',
  },
];

export const transactionFilterFields: SearchFieldConfig[] = [
  {
    key: 'sortBy',
    label: 'Sắp xếp theo',
    type: 'select',
    options: [
      { value: 'amount', label: 'Số tiền' },
      { value: 'type', label: 'Loại giao dịch' },
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
