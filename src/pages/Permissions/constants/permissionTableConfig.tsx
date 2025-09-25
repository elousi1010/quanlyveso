import type { SimpleTableColumn } from '../../../components/common/SimpleTable';
import type { Permission } from '../types';
import { formatDate } from '@/utils/format';

export const permissionTableConfig = {
  columns: [
    {
      key: 'id',
      label: 'ID',
      minWidth: 200,
    },
    {
      key: 'name',
      label: 'Tên quyền',
      minWidth: 200,
    },
    {
      key: 'code',
      label: 'Mã quyền',
      minWidth: 150,
    },
    {
      key: 'description',
      label: 'Mô tả',
      minWidth: 250,
    },
    {
      key: 'actions',
      label: 'Hành động',
      minWidth: 300,
      render: (value: Record<string, number>) => {
        return Object.entries(value || {}).map(([resource, permissions]) => {
          const actions = [];
          if (permissions & 1) actions.push('Đọc');
          if (permissions & 2) actions.push('Tạo');
          if (permissions & 4) actions.push('Cập nhật');
          if (permissions & 8) actions.push('Xóa');
          return `${resource}: ${actions.join(', ')}`;
        }).join(' | ');
      },
    },
    {
      key: 'created_at',
      label: 'Ngày tạo',
      minWidth: 150,
      render: (value: string) => {
        return formatDate(value);
      },
    },
    {
      key: 'updated_at',
      label: 'Ngày cập nhật',
      minWidth: 150,
      render: (value: string) => {
        return formatDate(value);
      },
    },
  ] as SimpleTableColumn[],
};