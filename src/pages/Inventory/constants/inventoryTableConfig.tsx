import type { SimpleTableColumn } from '../../../components/common/SimpleTable';
import { formatDate } from '@/utils/format';

export const inventoryTableConfig = {
  columns: [
    {
      key: 'code',
      label: 'Mã Vé',
      minWidth: 150,
    },
    {
      key: 'quantity',
      label: 'Số Lượng',
      minWidth: 100,
      align: 'right',
      render: (value: number) => value?.toString() || '0',
    },
    {
      key: 'avg_cost',
      label: 'Giá Trung Bình',
      minWidth: 120,
      align: 'right',
      render: (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(value || 0);
      },
    },
    {
      key: 'total_value',
      label: 'Tổng Giá Trị',
      minWidth: 150,
      align: 'right',
      render: (value: number, row: any) => {
        const quantity = row?.quantity || 0;
        const avgCost = row?.avg_cost || 0;
        const total = quantity * avgCost;
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(total);
      },
    },
    {
      key: 'is_active',
      label: 'Trạng thái',
      minWidth: 120,
      render: (value: boolean) => {
        return (
          <span style={{ color: value ? '#4caf50' : '#f44336' }}>
            {value ? 'Hoạt động' : 'Không hoạt động'}
          </span>
        );
      },
    },
    {
      key: 'draw_date',
      label: 'Ngày Quay',
      minWidth: 120,
      render: (value: string) => formatDate(value),
    },
    {
      key: 'created_at',
      label: 'Ngày tạo',
      minWidth: 150,
      render: (value: string) => formatDate(value),
    },
  ] as SimpleTableColumn[],
};