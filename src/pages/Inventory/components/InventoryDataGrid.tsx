import React from 'react';
import { CommonDataTable, type TableColumn } from '@/components/common';
import { inventoryTableConfig } from '../constants';
import type { Inventory } from '../types';

interface InventoryDataGridProps {
  data: Inventory[];
  loading: boolean;
  selectedRows: Inventory[];
  onSelectionChange: (inventories: Inventory[]) => void;
  onEdit: (inventory: Inventory) => void;
  onDelete: (inventory: Inventory) => void;
  onView: (inventory: Inventory) => void;
}

export const InventoryDataGrid: React.FC<InventoryDataGridProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  selectedRows,
  onSelectionChange,
}) => {
  const handleRowClick = (inventory: Inventory) => {
    onView(inventory);
  };

  const handleEdit = (inventory: Inventory) => {
    onEdit(inventory);
  };

  const handleDelete = (inventory: Inventory) => {
    onDelete(inventory);
  };

  return (
    <CommonDataTable
      data={data as unknown as Record<string, unknown>[]}
      isLoading={loading}
      error={undefined}
      onRefresh={() => {}}
      columns={inventoryTableConfig.columns as unknown as TableColumn[]}
      onRowClick={handleRowClick as (item: Inventory) => void}
      onEdit={handleEdit as (item: Inventory) => void}
      onDelete={handleDelete as (item: Inventory) => void}
      selectedRows={selectedRows as unknown as Record<string, unknown>[]}
      onSelectionChange={onSelectionChange as (items: unknown[]) => void}
      config={inventoryTableConfig as unknown as Record<string, unknown>}
    />
  );
};
