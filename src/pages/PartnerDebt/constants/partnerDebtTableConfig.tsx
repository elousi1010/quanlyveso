import React from 'react';
import { Tag, Typography, Flex } from 'antd';
import type { SimpleTableColumn } from '@/components/common/SimpleTable';
import { formatCurrency, formatDate } from '../../../utils/format';
import {
  formatTransactionSubType,
  getStatusColor
} from '../utils/partnerDebtHelpers';

const { Text } = Typography;

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
    minWidth: 150,
    align: 'right',
    render: (value, row: any) => (
      <Flex vertical align="end">
        <Text strong>{formatCurrency(Number(value))}</Text>
        {row.tax_amount > 0 && (
          <Text type="danger" style={{ fontSize: '11px' }}>
            Thuế: -{formatCurrency(row.tax_amount)}
          </Text>
        )}
      </Flex>
    ),
  },
  {
    key: 'transaction_sub_type',
    label: 'Nghiệp vụ',
    minWidth: 140,
    align: 'center',
    render: (value) => {
      const label = formatTransactionSubType(String(value));
      return (
        <Tag color={getStatusColor(String(value))} style={{ margin: 0 }}>
          {label}
        </Tag>
      );
    },
  },
  {
    key: 'payment_method',
    label: 'Phương thức',
    minWidth: 140,
    align: 'center',
    render: (value) => {
      const methodConfig: Record<string, { label: string; color: string }> = {
        cash: { label: 'Tiền mặt', color: 'success' },
        bank_transfer: { label: 'Chuyển khoản', color: 'processing' },
        credit_card: { label: 'Thẻ tín dụng', color: 'warning' },
        winning_ticket: { label: 'Vé trúng', color: 'purple' },
        seasonal_bonus: { label: 'error', color: 'red' },
        other: { label: 'Khác', color: 'default' },
      };

      const config = methodConfig[String(value)] || { label: String(value), color: 'default' };

      return (
        <Tag color={config.color} bordered={false}>
          {config.label}
        </Tag>
      );
    },
  },
  {
    key: 'payment_type',
    label: 'Loại GD',
    minWidth: 120,
    align: 'center',
    render: (value) => {
      const typeMap: Record<string, { label: string; color: string }> = {
        income: { label: 'Thu nhập', color: 'success' },
        expense: { label: 'Chi phí', color: 'error' },
        adjustment: { label: 'Điều chỉnh', color: 'default' },
        tax_withholding: { label: 'Khấu trừ thuế', color: 'warning' },
      };
      const config = typeMap[String(value)] || { label: String(value), color: 'default' };
      return (
        <Tag color={config.color} style={{ borderRadius: '12px' }}>
          {config.label}
        </Tag>
      );
    },
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
      <Tag
        color={value ? 'success' : 'error'}
        bordered={false}
      >
        {value ? 'Hoạt động' : 'Vô hiệu'}
      </Tag>
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
