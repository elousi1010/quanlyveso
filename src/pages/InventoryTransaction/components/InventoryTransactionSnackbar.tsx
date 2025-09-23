import React from 'react';
import { CommonSnackbar } from '@/components/common';

interface InventoryTransactionSnackbarProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export const InventoryTransactionSnackbar: React.FC<InventoryTransactionSnackbarProps> = ({
  open,
  message,
  severity,
  onClose,
}) => {
  return (
    <CommonSnackbar
      open={open}
      message={message}
      severity={severity}
      onClose={onClose}
    />
  );
};
