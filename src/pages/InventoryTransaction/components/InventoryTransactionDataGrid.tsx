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

  return (
    <CommonDataTable
      data={data as unknown as Record<string, unknown>[]}
      columns={inventoryTransactionTableConfig.columns}
      actions={actions}
      isLoading={loading}
      error={undefined}
      onRefresh={() => {}}
      onRowClick={handleRowClick as (item: InventoryTransactionItem) => void}
      onEdit={handleEdit as (item: InventoryTransactionItem) => void}
      onDelete={handleDelete as (item: InventoryTransactionItem) => void}
      selectedRows={selectedRows as unknown as Record<string, unknown>[]}
      onSelectionChange={onSelectionChange as (items: unknown[]) => void}
      config={inventoryTransactionTableConfig as unknown as Record<string, unknown>}
      total={total}
      // Enable view detail with edit capability
      enableViewDetail={!!onSave}
      enableEdit={false}
      detailFields={inventoryTransactionDetailFields}
      editFields={inventoryTransactionFormFields}
      onSave={onSave as unknown as (data: Record<string, unknown>, selectedRow?: Record<string, unknown>) => Promise<void>}
      detailTitle="Chi tiết Giao dịch Kho"
    />
  );
};
