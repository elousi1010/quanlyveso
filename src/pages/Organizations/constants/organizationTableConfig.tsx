import type { TableColumn } from '@/components/common/CommonDataTable';

export const organizationTableColumns: TableColumn[] = [
  {
    key: 'name',
    label: 'Tên tổ chức',
    minWidth: 200,
    align: 'left',
  },
  {
    key: 'created_at',
    label: 'Ngày tạo',
    minWidth: 150,
    align: 'left',
    render: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleDateString('vi-VN');
    },
  },
  {
    key: 'updated_at',
    label: 'Ngày cập nhật',
    minWidth: 150,
    align: 'left',
    render: (value) => {
      if (!value) return '';
      return new Date(value as string).toLocaleDateString('vi-VN');
    },
  },
];

export const organizationTableConfig = {
  columns: organizationTableColumns,
  pageSize: 10,
  pageSizeOptions: [5, 10, 25, 50],
};
