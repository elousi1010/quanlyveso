import type { SimpleTableColumn } from '@/components/common/SimpleTable';
import { formatDate } from '@/utils/format';

export const organizationTableColumns: SimpleTableColumn[] = [
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
      return formatDate(value as string);
    },
  },
  {
    key: 'updated_at',
    label: 'Ngày cập nhật',
    minWidth: 150,
    align: 'left',
    render: (value) => {
      if (!value) return '';
      return formatDate(value as string);
    },
  },
];

export const organizationTableConfig = {
  columns: organizationTableColumns,
  pageSize: 10,
  pageSizeOptions: [5, 10, 25, 50],
};
