import React from 'react';
import { Chip, Typography, Box } from '@mui/material';
import type { SimpleTableColumn } from '@/components/common/SimpleTable';
import type { InventoryTransactionItem } from '../types';
import { formatDate } from '@/utils/format';

export const inventoryTransactionTableConfig = {
  columns: [
    {
      key: 'inventory',
      label: 'Mã Kho',
      minWidth: 150,
      render: (value: unknown, row: InventoryTransactionItem) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {row.inventory.code}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.inventory.ticket_id}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'quantity',
      label: 'Số Lượng',
      minWidth: 100,
      align: 'right' as const,
      render: (value: unknown) => (
        <Typography variant="body2" fontWeight="medium">
          {Number(value).toLocaleString()}
        </Typography>
      ),
    },
    {
      key: 'price',
      label: 'Giá',
      minWidth: 120,
      align: 'right' as const,
      render: (value: unknown) => (
        <Typography variant="body2" fontWeight="medium">
          {Number(value).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
          })}
        </Typography>
      ),
    },
    {
      key: 'total',
      label: 'Tổng Tiền',
      minWidth: 120,
      align: 'right' as const,
      render: (value: unknown) => (
        <Typography variant="body2" fontWeight="medium" color="primary.main">
          {Number(value).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
          })}
        </Typography>
      ),
    },
    {
      key: 'transaction',
      label: 'Loại',
      minWidth: 100,
      render: (value: unknown, row: InventoryTransactionItem) => {
        const typeMap: Record<string, { label: string; color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
          'import': { label: 'Nhập', color: 'success' },
          'export': { label: 'Xuất', color: 'warning' },
        };
        const config = typeMap[row.transaction.type] || { label: String(row.transaction.type), color: 'default' };
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
          <Typography variant="body2" color="text.secondary">
            {subTypeMap[row.transaction.sub_type] || String(row.transaction.sub_type)}
          </Typography>
        );
      },
    },
    {
      key: 'transaction',
      label: 'Partner ID',
      minWidth: 150,
      render: (value: unknown, row: InventoryTransactionItem) => (
        <Typography variant="body2">
          {row.transaction.partner_id}
        </Typography>
      ),
    },
    {
      key: 'inventory',
      label: 'Ngày Quay',
      minWidth: 120,
      render: (value: unknown, row: InventoryTransactionItem) => (
        <Typography variant="body2" color="text.secondary">
          {row.inventory.draw_date ? formatDate(row.inventory.draw_date) : 'N/A'}
        </Typography>
      ),
    },
    {
      key: 'is_active',
      label: 'Trạng Thái',
      minWidth: 100,
      render: (value: unknown) => (
        <Chip
          label={value ? 'Hoạt động' : 'Không hoạt động'}
          color={value ? 'success' : 'default'}
          size="small"
          variant="filled"
        />
      ),
    },
    {
      key: 'created_at',
      label: 'Ngày Tạo',
      minWidth: 120,
      render: (value: unknown) => (
        <Typography variant="body2" color="text.secondary">
          {value ? formatDate(value as string) : 'N/A'}
        </Typography>
      ),
    },
  ] as SimpleTableColumn[],
};
