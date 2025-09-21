import type { GridColDef } from '@mui/x-data-grid';
import type { Ticket } from '../types';

export const ticketTableColumns: GridColDef<Ticket>[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 200,
    sortable: true,
    filterable: true,
  },
  {
    field: 'ticket_code',
    headerName: 'Mã vé',
    width: 150,
    sortable: true,
    filterable: true,
  },
  {
    field: 'ticket_type',
    headerName: 'Loại vé',
    width: 120,
    sortable: true,
    filterable: true,
    valueFormatter: (value) => {
      const typeMap: Record<string, string> = {
        'traditional': 'Truyền thống',
        'online': 'Trực tuyến',
        'instant': 'Tức thời',
      };
      return typeMap[value] || value;
    },
  },
  {
    field: 'station_id',
    headerName: 'ID Trạm',
    width: 150,
    sortable: true,
    filterable: true,
  },
  {
    field: 'draw_date',
    headerName: 'Ngày quay',
    width: 150,
    sortable: true,
    filterable: false,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Date(value).toLocaleDateString('vi-VN');
    },
  },
  {
    field: 'note',
    headerName: 'Ghi chú',
    width: 200,
    sortable: false,
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

export const ticketTableConfig = {
  columns: ticketTableColumns,
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
