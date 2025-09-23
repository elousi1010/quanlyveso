import React from 'react';
import { 
  CommonDataTable, 
  type TableAction 
} from '@/components/common';
import { 
  Visibility as ViewIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { transactionTableConfig } from '../constants';
import { transactionFormFields, transactionDetailFields } from '../constants/transactionViewEditConfig';
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
  onSave,
  selectedRows,
  onSelectionChange,
}) => {
  const handleRowClick = (transaction: Transaction) => {
    onView(transaction);
  };

  const handleEdit = (transaction: Transaction) => {
    onEdit(transaction);
  };

  const handleDelete = (transaction: Transaction) => {
    onDelete(transaction);
  };

  const handleView = (transaction: Transaction) => {
    onView(transaction);
  };

  // Define actions for the table
  const actions: TableAction[] = [
    {
      key: 'view',
      label: 'Xem',
      icon: <ViewIcon fontSize="small" />,
      color: 'primary.main',
      onClick: handleView,
    },
    {
      key: 'edit',
      label: 'Sửa',
      icon: <EditIcon fontSize="small" />,
      color: 'warning.main',
      onClick: handleEdit,
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteIcon fontSize="small" />,
      color: 'error.main',
      onClick: handleDelete,
    },
  ];

  return (
    <CommonDataTable
      data={data as unknown as Record<string, unknown>[]}
      isLoading={loading}
      error={undefined}
      onRefresh={() => {}}
      columns={transactionTableConfig.columns}
      actions={actions}
      onRowClick={handleRowClick as (item: Transaction) => void}
      onEdit={handleEdit as (item: Transaction) => void}
      onDelete={handleDelete as (item: Transaction) => void}
      selectedRows={selectedRows as unknown as Record<string, unknown>[]}
      onSelectionChange={onSelectionChange as (items: unknown[]) => void}
      config={transactionTableConfig as unknown as Record<string, unknown>}
      // Enable view detail with edit capability
      enableViewDetail={!!onSave}
      enableEdit={false}
      detailFields={transactionDetailFields}
      editFields={transactionFormFields}
      onSave={onSave as unknown as (data: Record<string, unknown>, selectedRow?: Record<string, unknown>) => Promise<void>}
      detailTitle="Chi tiết Giao dịch"
    />
  );
};
