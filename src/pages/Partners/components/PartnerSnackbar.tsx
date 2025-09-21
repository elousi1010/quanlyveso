import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface PartnerSnackbarProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
  onClose: () => void;
}

const PartnerSnackbar: React.FC<PartnerSnackbarProps> = ({
  open,
  message,
  severity,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert
        onClose={onClose}
        severity={severity}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default PartnerSnackbar;
