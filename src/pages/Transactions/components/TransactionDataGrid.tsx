import React from 'react';
import { SimpleTable } from '@/components/common';
import { 
  Visibility as ViewIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';
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
}

export const TransactionDataGrid: React.FC<TransactionDataGridProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
}) => {
  // Simple table actions
  const actions = [
    {
      key: 'view',
      label: 'Xem',
      icon: <ViewIcon />,
      color: 'primary' as const,
      onClick: (transaction: unknown) => onView(transaction as Transaction),
    },
    {
      key: 'edit',
      label: 'Sửa',
      icon: <EditIcon />,
      color: 'primary' as const,
      onClick: (transaction: unknown) => onEdit(transaction as Transaction),
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteIcon />,
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
      onRefresh={() => {}}
      emptyMessage="Không có giao dịch"
    />
  );
};
