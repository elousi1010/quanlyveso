import React from 'react';
import { CommonSnackbar } from '@/components/common';

interface PartnerDebtSnackbarProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const PartnerDebtSnackbar: React.FC<PartnerDebtSnackbarProps> = ({
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

export default PartnerDebtSnackbar;
