import type { GridColDef } from '@mui/x-data-grid';
import type { Permission } from '../types';

export const permissionTableColumns: GridColDef<Permission>[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 200,
    sortable: true,
    filterable: true,
  },
  {
    field: 'name',
    headerName: 'Tên quyền',
    width: 200,
    sortable: true,
    filterable: true,
  },
  {
    field: 'code',
    headerName: 'Mã quyền',
    width: 200,
    sortable: true,
    filterable: true,
  },
  {
    field: 'actions',
    headerName: 'Hành động',
    width: 300,
    sortable: false,
    filterable: false,
    valueFormatter: (value) => {
      if (!value || typeof value !== 'object') return '';
      return Object.entries(value)
        .map(([resource, actions]) => `${resource}: ${Array.isArray(actions) ? actions.join(', ') : actions}`)
        .join('; ');
    },
  },
  {
    field: 'created_at',
    headerName: 'Ngày tạo',
    width: 150,
    sortable: true,
    filterable: false,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value).toLocaleDateString('vi-VN');
    },
  },
  {
    field: 'updated_at',
    headerName: 'Ngày cập nhật',
    width: 150,
    sortable: true,
    filterable: false,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value).toLocaleDateString('vi-VN');
    },
  },
];

export const permissionTableConfig = {
  columns: permissionTableColumns,
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
