import React from 'react';
import { CommonDeleteDialog } from '@/components/common';

interface InventoryTransactionDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  loading?: boolean;
}

export const InventoryTransactionDeleteDialog: React.FC<InventoryTransactionDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  itemName,
  loading = false,
}) => {
  return (
    <CommonDeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xóa Giao Dịch Kho"
      itemName={itemName}
      itemType="giao dịch kho"
      loading={loading}
    />
  );
};
