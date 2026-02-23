import React from 'react';
import { SimpleTable } from '@/components/common';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { transactionTableConfig } from '../constants';
import type { Transaction } from '../types';

interface TransactionDataGridProps {
  data: Transaction[];
  loading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onView: (transaction: Transaction) => void;
  onSave?: (data: Record<string, unknown>, selectedRow?: Transaction) => Promise<void>;
  selectedRows: Transaction[];
  onSelectionChange: (transactions: Transaction[]) => void;
  // Pagination props
  page?: number;
  rowsPerPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

export const TransactionDataGrid: React.FC<TransactionDataGridProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
}) => {
  // Simple table actions
  const actions = [
    {
      key: 'view',
      label: 'Xem',
      icon: <EyeOutlined />,
      color: 'primary' as const,
      onClick: (transaction: unknown) => onView(transaction as Transaction),
    },
    {
      key: 'edit',
      label: 'Sửa',
      icon: <EditOutlined />,
      color: 'primary' as const,
      onClick: (transaction: unknown) => onEdit(transaction as Transaction),
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteOutlined />,
      color: 'error' as const,
      onClick: (transaction: unknown) => onDelete(transaction as Transaction),
    },
  ];

  return (
    <SimpleTable
      data={data}
      columns={transactionTableConfig.columns}
      actions={actions}
      loading={loading}
      onRefresh={() => { }}
      emptyMessage="Không có giao dịch"
      page={page}
      rowsPerPage={rowsPerPage}
      total={total}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};
