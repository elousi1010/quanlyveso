import type { SimpleTableColumn } from '../../../components/common/SimpleTable';
import type { Ticket } from '../types';
import { formatDate } from '@/utils/format';

export const ticketTableConfig = {
  columns: [
    {
      key: 'id',
      label: 'ID',
      minWidth: 200,
    },
    {
      key: 'ticket_code',
      label: 'Mã vé',
      minWidth: 150,
    },
    {
      key: 'ticket_type',
      label: 'Loại vé',
      minWidth: 120,
      render: (value: string) => {
        const typeMap: Record<string, string> = {
          'number': 'Số',
          'special': 'Đặc biệt',
        };
        return typeMap[value] || value;
      },
    },
    {
      key: 'numbers',
      label: 'Số',
      minWidth: 200,
      render: (value: string[]) => value?.join(', ') || '',
    },
    {
      key: 'price',
      label: 'Giá',
      minWidth: 120,
      render: (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(value);
      },
    },
    {
      key: 'status',
      label: 'Trạng thái',
      minWidth: 120,
      render: (value: string) => {
        const statusMap: Record<string, string> = {
          'active': 'Hoạt động',
          'inactive': 'Không hoạt động',
          'sold': 'Đã bán',
          'cancelled': 'Đã hủy',
        };
        return statusMap[value] || value;
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