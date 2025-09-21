import type { SearchAndFilterConfig } from '../../../components/common';
import { PARTNER_TYPES } from './partnerDialogConfig';

export const PARTNER_SORT_OPTIONS = [
  { value: 'created_at', label: 'Ngày tạo' },
  { value: 'updated_at', label: 'Ngày cập nhật' },
  { value: 'name', label: 'Tên' },
  { value: 'debt', label: 'Nợ' },
  { value: 'level', label: 'Cấp độ' },
];

export const PARTNER_STATUS_OPTIONS = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
];

export const PARTNER_SEARCH_FILTER_CONFIG: SearchAndFilterConfig = {
  searchPlaceholder: 'Tìm kiếm đối tác...',
  sortOptions: PARTNER_SORT_OPTIONS,
  filterOptions: [
    {
      key: 'type',
      label: 'Loại',
      options: PARTNER_TYPES,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      options: PARTNER_STATUS_OPTIONS,
    },
  ],
};
