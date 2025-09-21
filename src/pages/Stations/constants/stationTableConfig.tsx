import type { TableColumn } from '@/components/common/types';
import type { Station } from '../types';

export const stationTableColumns: TableColumn[] = [
  {
    key: 'name',
    label: 'Tên trạm',
    width: 200,
    sortable: true,
  },
  {
    key: 'code',
    label: 'Mã trạm',
    width: 120,
    sortable: true,
  },
  {
    key: 'address',
    label: 'Địa chỉ',
    width: 250,
    sortable: true,
  },
  {
    key: 'phone_number',
    label: 'Số điện thoại',
    width: 130,
    sortable: true,
  },
  {
    key: 'email',
    label: 'Email',
    width: 180,
    sortable: true,
  },
  {
    key: 'is_active',
    label: 'Trạng thái',
    width: 100,
    sortable: true,
    align: 'center',
    render: (value) => {
      return value ? 'Hoạt động' : 'Không hoạt động';
    },
  },
  {
    key: 'created_at',
    label: 'Ngày tạo',
    width: 120,
    sortable: true,
    render: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleDateString('vi-VN');
    },
  },
];

export const stationTableConfig = {
  columns: stationTableColumns,
  pageSize: 10,
  pageSizeOptions: [5, 10, 25, 50],
  density: 'compact' as const,
  disableColumnMenu: false,
  disableColumnFilter: false,
  disableColumnSelector: false,
  disableDensitySelector: false,
  disableRowSelectionOnClick: true,
  checkboxSelection: true,
  rowSelection: true,
};
