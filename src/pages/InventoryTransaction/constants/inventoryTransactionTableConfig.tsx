import React from 'react';
import { Tag, Typography, Flex } from 'antd';
import type { SimpleTableColumn } from '@/components/common/SimpleTable';
import type { InventoryTransactionItem } from '../types';
import { formatDate } from '@/utils/format';

const { Text } = Typography;

export const inventoryTransactionTableConfig = {
  columns: [
    {
      key: 'inventory',
      label: 'Mã Kho',
      minWidth: 150,
      render: (value: unknown, row: InventoryTransactionItem) => (
        <Text strong>{row.inventory.code}</Text>
      ),
    },
    {
      key: 'quantity',
      label: 'Số Lượng',
      minWidth: 100,
      align: 'right' as const,
      render: (value: unknown) => (
        <Text>{Number(value).toLocaleString()}</Text>
      ),
    },
    {
      key: 'price',
      label: 'Giá',
      minWidth: 120,
      align: 'right' as const,
      render: (value: unknown) => (
        <Text>{Number(value).toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        })}</Text>
      ),
    },
    {
      key: 'total',
      label: 'Tổng Tiền',
      minWidth: 120,
      align: 'right' as const,
      render: (value: unknown) => (
        <Text strong style={{ color: '#1677ff' }}>{Number(value).toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        })}</Text>
      ),
    },
    {
      key: 'transaction',
      label: 'Loại',
      minWidth: 100,
      render: (value: unknown, row: InventoryTransactionItem) => {
        const typeMap: Record<string, { label: string; color: string }> = {
          'import': { label: 'Nhập', color: 'success' },
          'export': { label: 'Xuất', color: 'warning' },
        };
        const config = typeMap[row.transaction.type] || { label: String(row.transaction.type), color: 'default' };
        return (
          <Tag color={config.color} bordered={false}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      key: 'transaction',
      label: 'Loại Phụ',
      minWidth: 120,
      render: (value: unknown, row: InventoryTransactionItem) => {
        const subTypeMap: Record<string, string> = {
          'return_from_seller': 'Trả từ người bán',
          'buy_from_partner': 'Mua từ đối tác',
          'sell_to_customer': 'Bán cho khách hàng',
          'transfer': 'Chuyển kho',
          'return': 'Trả hàng',
        };
        return (
          <Text type="secondary">
            {subTypeMap[row.transaction.sub_type] || String(row.transaction.sub_type)}
          </Text>
        );
      },
    },
    {
      key: 'inventory',
      label: 'Ngày Quay',
      minWidth: 120,
      render: (value: unknown, row: InventoryTransactionItem) => (
        <Text type="secondary">
          {row.inventory.draw_date ? formatDate(row.inventory.draw_date) : 'N/A'}
        </Text>
      ),
    },
    {
      key: 'is_active',
      label: 'Trạng Thái',
      minWidth: 100,
      render: (value: unknown) => (
        <Tag
          color={value ? 'success' : 'default'}
          bordered={false}
        >
          {value ? 'Hoạt động' : 'Khoá'}
        </Tag>
      ),
    },
    {
      key: 'created_at',
      label: 'Ngày Tạo',
      minWidth: 120,
      render: (value: unknown) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {value ? formatDate(value as string) : 'N/A'}
        </Text>
      ),
    },
  ] as SimpleTableColumn[],
};
