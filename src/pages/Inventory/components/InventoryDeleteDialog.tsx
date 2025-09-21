import React from 'react';
import { CommonDeleteDialog } from '@/components/common';
import type { Inventory } from '../types';

interface InventoryDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  inventory: Inventory | null;
  loading?: boolean;
}

export const InventoryDeleteDialog: React.FC<InventoryDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  inventory,
  loading = false,
}) => {
  return (
    <CommonDeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xóa Kho"
      itemName={`Bạn có chắc chắn muốn xóa kho "${inventory?.id}"?`}
      isDeleting={loading}
    />
  );
};
