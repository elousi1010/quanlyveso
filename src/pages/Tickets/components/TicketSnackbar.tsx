import React from 'react';
import { CommonSnackbar } from '@/components/common';

interface TicketSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export const TicketSnackbar: React.FC<TicketSnackbarProps> = ({
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
