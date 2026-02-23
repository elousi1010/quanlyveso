import React from 'react';
import { SimpleTable } from '@/components/common';
import {
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { inventoryTableConfig } from '../constants';
import type { Inventory } from '../types';

// Convert table config columns to SimpleTable format
const convertColumnsToTableFormat = (tableColumns: any[]): any[] => {
  return tableColumns.map((column) => {
    return {
      key: column.key,
      label: column.label,
      minWidth: column.minWidth,
      align: column.align || 'left',
      render: column.render,
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
  onSave?: (data: Record<string, unknown>, selectedRow?: Inventory) => Promise<void>;
}

export const InventoryDataGrid: React.FC<InventoryDataGridProps> = ({
  data,
  loading,
  onDelete,
  onView,
}) => {
  const tableColumns = convertColumnsToTableFormat(inventoryTableConfig.columns);

  // Simple table actions
  const actions = [
    {
      key: 'view',
      label: 'Xem',
      icon: <EyeOutlined />,
      color: 'primary' as const,
      onClick: (inventory: unknown) => onView(inventory as Inventory),
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteOutlined />,
      color: 'error' as const,
      onClick: (inventory: unknown) => onDelete(inventory as Inventory),
    },
  ];

  return (
    <SimpleTable
      data={data}
      columns={tableColumns}
      actions={actions}
      loading={loading}
      onRefresh={() => { }}
      emptyMessage="Không có dữ liệu kho hàng"
    />
  );
};
