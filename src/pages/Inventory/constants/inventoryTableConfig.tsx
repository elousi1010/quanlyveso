import type { GridColDef } from '@mui/x-data-grid';
import type { Inventory } from '../types';

export const inventoryTableColumns: GridColDef<Inventory>[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 200,
    sortable: true,
    filterable: true,
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

export const inventoryTableConfig = {
  columns: inventoryTableColumns,
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
