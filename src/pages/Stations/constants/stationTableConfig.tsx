import type { TableColumn } from '@/components/common/types';
import type { Station } from '../types';

export const stationTableColumns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    width: 200,
    sortable: true,
  },
  {
    key: 'name',
    label: 'Tên trạm',
    width: 200,
    sortable: true,
  },
  {
    key: 'code',
    label: 'Mã trạm',
    width: 150,
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
    width: 150,
    sortable: true,
  },
  {
    key: 'email',
    label: 'Email',
    width: 200,
    sortable: true,
  },
  {
    key: 'website',
    label: 'Website',
    width: 200,
    sortable: true,
  },
  {
    key: 'created_at',
    label: 'Ngày tạo',
    width: 150,
    sortable: true,
    render: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleDateString('vi-VN');
    },
  },
  {
    key: 'updated_at',
    label: 'Ngày cập nhật',
    width: 150,
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
