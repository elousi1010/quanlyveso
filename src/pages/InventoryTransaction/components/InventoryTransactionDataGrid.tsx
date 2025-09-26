import React from 'react';
import { SimpleTable } from '@/components/common';
import { 
  inventoryTransactionTableConfig } from '../constants';
import type { InventoryTransactionItem } from '../types';

interface InventoryTransactionDataGridProps {
  data: InventoryTransactionItem[];
  loading: boolean;
  total?: number;
}

export const InventoryTransactionDataGrid: React.FC<InventoryTransactionDataGridProps> = ({
  data,
  loading,
  total = 0,
}) => {

  return (
    <SimpleTable
      data={data}
      columns={inventoryTransactionTableConfig.columns}
      loading={loading}
      onRefresh={() => {}}
      emptyMessage="Không có giao dịch kho hàng"
      total={total}
    />
  );
};
