import React from 'react';
import { CommonSnackbar } from '@/components/common';

interface StationSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export const StationSnackbar: React.FC<StationSnackbarProps> = ({
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
