import React from 'react';
import { CommonDataTable } from '@/components/common';
import { transactionTableConfig } from '../constants';
import type { Transaction } from '../types';

interface TransactionDataGridProps {
  item: Transaction[];
  loading: boolean;
  selectedRows: Transaction[];
  onSelectionChange: (transactions: Transaction[]) => void;
}

export const TransactionDataGrid: React.FC<TransactionDataGridProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
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

  return (
    <CommonDataTable
      data={data}
      loading={loading}
      columns={transactionTableConfig.columns}
      onRowClick={handleRowClick}
      onEdit={handleEdit}
      onDelete={handleDelete}
      selectedRows={selectedRows}
      onSelectionChange={onSelectionChange}
      config={transactionTableConfig}
    />
  );
};
