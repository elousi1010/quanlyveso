import React from 'react';
import { CommonSnackbar } from '@/components/common';

interface InventorySnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export const InventorySnackbar: React.FC<InventorySnackbarProps> = ({
  open,
  onClose,
  message,
  severity,
}) => {
  return (
    <CommonSnackbar
      open={open}
      onClose={onClose}
      message={message}
      severity={severity}
    />
  );
};
