import type { GridColDef } from '@mui/x-data-grid';
import type { Inventory } from '../types';

export const inventoryTableColumns: GridColDef<Inventory>[] = [
  {
    field: 'code',
    headerName: 'Mã Kho',
    width: 150,
    sortable: true,
    filterable: true,
  },
  {
    field: 'ticket_id',
    headerName: 'Mã Vé',
    width: 200,
    sortable: true,
    filterable: true,
  },
  {
    field: 'quantity',
    headerName: 'Số Lượng',
    width: 100,
    sortable: true,
    filterable: false,
    type: 'number',
    align: 'right',
    headerAlign: 'right',
  },
  {
    field: 'avg_cost',
    headerName: 'Giá Trung Bình',
    width: 120,
    sortable: true,
    filterable: false,
    type: 'number',
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value) => {
      if (value == null) return '';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value);
    },
  },
  {
    field: 'draw_date',
    headerName: 'Ngày Quay',
    width: 120,
    sortable: true,
    filterable: true,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value).toLocaleDateString('vi-VN');
    },
  },
  {
    field: 'organization_id',
    headerName: 'Tổ Chức',
    width: 150,
    sortable: true,
    filterable: true,
  },
  {
    field: 'is_active',
    headerName: 'Trạng Thái',
    width: 100,
    sortable: true,
    filterable: true,
    type: 'boolean',
    renderCell: (params) => (
      <span style={{ color: params.value ? '#4caf50' : '#f44336' }}>
        {params.value ? 'Hoạt động' : 'Không hoạt động'}
      </span>
    ),
  },
  {
    field: 'created_at',
    headerName: 'Ngày Tạo',
    width: 120,
    sortable: true,
    filterable: false,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value).toLocaleDateString('vi-VN');
    },
  },
  {
    field: 'created_by',
    headerName: 'Người Tạo',
    width: 120,
    sortable: true,
    filterable: true,
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
