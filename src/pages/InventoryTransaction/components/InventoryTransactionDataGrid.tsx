import React from 'react';
import { SimpleTable } from '@/components/common';
import { 
  Visibility as ViewIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { inventoryTransactionTableConfig } from '../constants';
import { inventoryTransactionFormFields, inventoryTransactionDetailFields } from '../constants/inventoryTransactionViewEditConfig';
import type { InventoryTransactionItem } from '../types';

interface InventoryTransactionDataGridProps {
  data: InventoryTransactionItem[];
  loading: boolean;
  onEdit: (item: InventoryTransactionItem) => void;
  onDelete: (item: InventoryTransactionItem) => void;
  onView: (item: InventoryTransactionItem) => void;
  onSave?: (data: Record<string, unknown>, selectedRow?: InventoryTransactionItem) => Promise<void>;
  selectedRows: InventoryTransactionItem[];
  onSelectionChange: (items: InventoryTransactionItem[]) => void;
  total?: number;
}

export const InventoryTransactionDataGrid: React.FC<InventoryTransactionDataGridProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  onSave,
  selectedRows,
  onSelectionChange,
  total = 0,
}) => {
  const handleRowClick = (item: InventoryTransactionItem) => {
    onView(item);
  };

  const handleEdit = (item: InventoryTransactionItem) => {
    onEdit(item);
  };

  const handleDelete = (item: InventoryTransactionItem) => {
    onDelete(item);
  };

  const handleView = (item: InventoryTransactionItem) => {
    onView(item);
  };

  const actions: TableAction[] = [
    {
      key: 'view',
      label: 'Xem chi tiết',
      icon: <ViewIcon fontSize="small" />,
      color: 'primary.main',
      onClick: handleView,
    },
    {
      key: 'edit',
      label: 'Chỉnh sửa',
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

  const simpleActions = [
    {
      key: 'view',
      label: 'Xem chi tiết',
      icon: <ViewIcon />,
      color: 'primary' as const,
      onClick: (item: unknown) => onView(item as InventoryTransactionItem),
    },
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <EditIcon />,
      color: 'primary' as const,
      onClick: (item: unknown) => onEdit(item as InventoryTransactionItem),
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteIcon />,
      color: 'error' as const,
      onClick: (item: unknown) => onDelete(item as InventoryTransactionItem),
    },
  ];

  return (
    <SimpleTable
      data={data}
      columns={inventoryTransactionTableConfig.columns}
      actions={simpleActions}
      loading={loading}
      onRefresh={() => {}}
      emptyMessage="Không có giao dịch kho hàng"
      total={total}
    />
  );
};
