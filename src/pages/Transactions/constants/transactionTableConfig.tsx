import type { GridColDef } from '@mui/x-data-grid';
import type { Transaction } from '../types';

export const transactionTableColumns: GridColDef<Transaction>[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 200,
    sortable: true,
    filterable: true,
  },
  {
    field: 'amount',
    headerName: 'Số tiền',
    width: 120,
    sortable: true,
    filterable: true,
    valueFormatter: (value) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value);
    },
  },
  {
    field: 'type',
    headerName: 'Loại',
    width: 100,
    sortable: true,
    filterable: true,
    valueFormatter: (value) => {
      const typeMap: Record<string, string> = {
        'income': 'Thu nhập',
        'expense': 'Chi phí',
      };
      return typeMap[value] || value;
    },
  },
  {
    field: 'subType',
    headerName: 'Loại phụ',
    width: 150,
    sortable: true,
    filterable: true,
    valueFormatter: (value) => {
      const subTypeMap: Record<string, string> = {
        'buy_from_agent': 'Mua từ đại lý',
        'sell_to_customer': 'Bán cho khách hàng',
        'commission': 'Hoa hồng',
        'refund': 'Hoàn tiền',
      };
      return subTypeMap[value] || value;
    },
  },
  {
    field: 'partner_id',
    headerName: 'ID Đối tác',
    width: 150,
    sortable: true,
    filterable: true,
  },
  {
    field: 'swap_id',
    headerName: 'ID Swap',
    width: 150,
    sortable: true,
    filterable: true,
  },
  {
    field: 'note',
    headerName: 'Ghi chú',
    width: 200,
    sortable: false,
    filterable: true,
  },
  {
    field: 'tickets',
    headerName: 'Số vé',
    width: 100,
    sortable: false,
    filterable: false,
    valueFormatter: (value) => {
      if (!Array.isArray(value)) return '0';
      return value(value as any)?.length.toString();
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

export const transactionTableConfig = {
  columns: transactionTableColumns,
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
