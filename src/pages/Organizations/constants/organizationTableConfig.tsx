import type { TableColumn } from '@/components/common/CommonDataTable';
import type { Organization } from '../types';

export const organizationTableColumns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    minWidth: 200,
    align: 'left',
  },
  {
    key: 'name',
    label: 'Tên tổ chức',
    minWidth: 200,
    align: 'left',
  },
  {
    key: 'address',
    label: 'Địa chỉ',
    minWidth: 250,
    align: 'left',
  },
  {
    key: 'owner_id',
    label: 'ID Chủ sở hữu',
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
      return new Date(value).toLocaleDateString('vi-VN');
    },
  },
  {
    key: 'updated_at',
    label: 'Ngày cập nhật',
    minWidth: 150,
    align: 'left',
    render: (value) => {
      if (!value) return '';
      return new Date(value).toLocaleDateString('vi-VN');
    },
  },
];

export const organizationTableConfig = {
  columns: organizationTableColumns,
  pageSize: 10,
  pageSizeOptions: [5, 10, 25, 50],
};
