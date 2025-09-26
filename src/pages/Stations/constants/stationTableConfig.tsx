import type { SimpleTableColumn } from '@/components/common/SimpleTable';
import type { Station } from '../types';
import { formatDate } from '@/utils/format';

export const stationTableConfig = {
  columns: [
    {
      key: 'name',
      label: 'Tên trạm',
      minWidth: 200,
    },
    {
      key: 'code',
      label: 'Mã trạm',
      minWidth: 120,
    },
    {
      key: 'address',
      label: 'Địa chỉ',
      minWidth: 250,
    },
    {
      key: 'phone_number',
      label: 'Số điện thoại',
      minWidth: 130,
    },
    {
      key: 'is_active',
      label: 'Trạng thái',
      minWidth: 100,
      align: 'center',
      render: (value: boolean) => {
        return value ? 'Hoạt động' : 'Không hoạt động';
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