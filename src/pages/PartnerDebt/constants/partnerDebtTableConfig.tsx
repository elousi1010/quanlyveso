import React from 'react';
import { Chip } from '@mui/material';
import type { SimpleTableColumn } from '@/components/common/SimpleTable';
import { formatCurrency, formatDate } from '../../../utils/format';

// Table columns configuration
export const partnerDebtTableColumns: SimpleTableColumn[] = [
  {
    key: 'partner_name',
    label: 'Đối tác',
    minWidth: 150,
    align: 'left',
  },
  {
    key: 'amount',
    label: 'Số tiền',
    minWidth: 120,
    align: 'right',
    render: (value) => {
      if (!value) return '';
      return formatCurrency(Number(value));
    },
  },
  {
    key: 'payment_method',
    label: 'Phương thức',
    minWidth: 120,
    align: 'center',
    render: (value) => {
      const methodConfig = {
        cash: { label: 'Tiền mặt', color: 'success' as const },
        bank_transfer: { label: 'Chuyển khoản', color: 'info' as const },
        credit_card: { label: 'Thẻ tín dụng', color: 'warning' as const },
        other: { label: 'Khác', color: 'default' as const },
      };
      
      const config = methodConfig[String(value) as keyof typeof methodConfig] || { label: String(value), color: 'default' as const };
      
      return (
        <Chip
          label={config.label}
          color={config.color}
          size="small"
          variant="outlined"
        />
      );
    },
  },
  {
    key: 'payment_type',
    label: 'Loại giao dịch',
    minWidth: 120,
    align: 'center',
    render: (value) => (
      <Chip
        label={String(value) === 'income' ? 'Thu nhập' : 'Chi phí'}
        color={String(value) === 'income' ? 'success' : 'error'}
        size="small"
        variant="outlined"
      />
    ),
  },
  {
    key: 'description',
    label: 'Mô tả',
    minWidth: 200,
    align: 'left',
    render: (value) => {
      if (!value) return '-';
      return String(value);
    },
  },
  {
    key: 'created_at',
    label: 'Ngày tạo',
    minWidth: 120,
    align: 'center',
    render: (value: string) => {
      if (!value) return '';
      return formatDate(value);
    },
  },
  {
    key: 'is_active',
    label: 'Trạng thái',
    minWidth: 100,
    align: 'center',
    render: (value) => (
      <Chip
        label={value ? 'Hoạt động' : 'Không hoạt động'}
        color={value ? 'success' : 'error'}
        size="small"
        variant="outlined"
      />
    ),
  },
];

// Table configuration
export const partnerDebtTableConfig = {
  columns: partnerDebtTableColumns,
  rowsPerPage: 10,
  rowsPerPageOptions: [10, 25, 50, 100],
  dense: false,
  stickyHeader: true,
  showCheckbox: true,
  showActions: true,
  actions: [
    {
      id: 'view',
      label: 'Xem',
      icon: 'visibility',
      color: 'primary',
    },
    {
      id: 'edit',
      label: 'Sửa',
      icon: 'edit',
      color: 'warning',
    },
    {
      id: 'delete',
      label: 'Xóa',
      icon: 'delete',
      color: 'error',
    },
  ],
};
