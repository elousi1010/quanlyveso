import React from 'react';
import { CommonDataTable } from '@/components/common';
import { inventoryTableConfig } from '../constants';
import type { Inventory } from '../types';

interface InventoryDataGridProps {
  item: Inventory[];
  loading: boolean;
  selectedRows: Inventory[];
  onSelectionChange: (inventories: Inventory[]) => void;
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
      data={data}
      loading={loading}
      columns={inventoryTableConfig.columns}
      onRowClick={handleRowClick}
      onEdit={handleEdit}
      onDelete={handleDelete}
      selectedRows={selectedRows}
      onSelectionChange={onSelectionChange}
      config={inventoryTableConfig}
    />
  );
};
