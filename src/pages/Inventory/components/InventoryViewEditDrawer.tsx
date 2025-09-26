import React from 'react';
import { CommonViewEditDrawer } from '@/components/common';
import { inventoryFormFields, inventoryDetailFields } from '../constants/inventoryViewEditConfig';
import type { Inventory, UpdateInventoryDto } from '../types';

export interface InventoryViewEditDrawerProps {
  open: boolean;
  onClose: () => void;
  inventory: Inventory | null;
  onSave?: (data: UpdateInventoryDto) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  mode?: 'view' | 'edit';
}

const InventoryViewEditDrawer: React.FC<InventoryViewEditDrawerProps> = ({
  open,
  onClose,
  inventory,
  onSave,
  loading = false,
  error = null,
  mode = 'view',
}) => {
  const handleSave = async (data: Record<string, unknown>) => {
    if (onSave && inventory) {
      await onSave({
        ...data as UpdateInventoryDto,
        id: inventory.id,
      });
    }
  };

  return (
    <CommonViewEditDrawer
      open={open}
      onClose={onClose}
      title={inventory ? `Kho: ${inventory.code}` : 'Chi tiết kho'}
      data={inventory || {}}
      viewFields={inventoryDetailFields}
      editFields={inventoryFormFields}
      onSave={onSave ? handleSave : undefined}
      loading={loading}
      error={error}
      mode={mode}
      enableEdit={!!onSave}
      width={600}
    />
  );
};

export { InventoryViewEditDrawer };
export default InventoryViewEditDrawer;
