import React from 'react';
import { CommonSnackbar } from '@/components/common';

interface OrganizationSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export const OrganizationSnackbar: React.FC<OrganizationSnackbarProps> = ({
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
