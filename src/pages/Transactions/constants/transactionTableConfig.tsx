import type { SimpleTableColumn } from '../../../components/common/SimpleTable';
import type { Transaction } from '../types';
import { formatDate } from '@/utils/format';

export const transactionTableConfig = {
  columns: [
    {
      key: 'id',
      label: 'ID',
      minWidth: 200,
    },
    {
      key: 'amount',
      label: 'Số tiền',
      minWidth: 120,
      render: (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(value);
      },
    },
    {
      key: 'type',
      label: 'Loại',
      minWidth: 100,
      render: (value: string) => {
        const typeMap: Record<string, string> = {
          'income': 'Thu nhập',
          'expense': 'Chi phí',
        };
        return typeMap[value] || value;
      },
    },
    {
      key: 'subType',
      label: 'Loại phụ',
      minWidth: 150,
      render: (value: string) => {
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
      key: 'partner_id',
      label: 'ID Đối tác',
      minWidth: 150,
    },
    {
      key: 'swap_id',
      label: 'ID Swap',
      minWidth: 150,
    },
    {
      key: 'note',
      label: 'Ghi chú',
      minWidth: 200,
    },
    {
      key: 'tickets',
      label: 'Số vé',
      minWidth: 100,
      render: (value: number) => value || 0,
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