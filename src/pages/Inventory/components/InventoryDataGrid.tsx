import React from 'react';
import { CommonDataTable, type TableColumn } from '@/components/common';
import { inventoryTableConfig } from '../constants';
import type { Inventory } from '../types';

// Convert MUI DataGrid columns to CommonDataTable columns
const convertColumnsToTableFormat = (dataGridColumns: unknown[]): TableColumn[] => {
  return dataGridColumns.map((col: unknown) => {
    const column = col as {
      field: string;
      headerName?: string;
      width?: number;
      align?: 'left' | 'center' | 'right';
      renderCell?: (params: { value: unknown }) => React.ReactNode;
      valueFormatter?: (value: unknown) => string;
    };
    return {
      key: column.field,
      label: column.headerName || column.field,
      minWidth: column.width,
      align: column.align || 'left',
      render: column.renderCell ? (value: unknown): React.ReactNode => {
        // Handle special rendering cases
        if (column.field === 'is_active') {
          return (
            <span style={{ color: value ? '#4caf50' : '#f44336' }}>
              {value ? 'Hoạt động' : 'Không hoạt động'}
            </span>
          );
        }
        if (column.valueFormatter) {
          return column.valueFormatter(value);
        }
        return value as React.ReactNode;
      } : undefined,
    };
  });
};

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

  const tableColumns = convertColumnsToTableFormat(inventoryTableConfig.columns);

  return (
    <CommonDataTable
      data={data as unknown as Record<string, unknown>[]}
      isLoading={loading}
      error={undefined}
      onRefresh={() => {}}
      columns={tableColumns}
      onRowClick={handleRowClick as (item: Inventory) => void}
      onEdit={handleEdit as (item: Inventory) => void}
      onDelete={handleDelete as (item: Inventory) => void}
      selectedRows={selectedRows as unknown as Record<string, unknown>[]}
      onSelectionChange={onSelectionChange as (items: unknown[]) => void}
      config={inventoryTableConfig as unknown as Record<string, unknown>}
    />
  );
};
