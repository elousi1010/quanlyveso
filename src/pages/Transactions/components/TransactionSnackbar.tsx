import React from 'react';
import { CommonSnackbar } from '@/components/common';

interface TransactionSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export const TransactionSnackbar: React.FC<TransactionSnackbarProps> = ({
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
