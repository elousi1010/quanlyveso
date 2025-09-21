import React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

interface CommonSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  duration?: number;
  variant?: 'filled' | 'outlined' | 'standard';
  action?: React.ReactNode;
}

const CommonSnackbar: React.FC<CommonSnackbarProps> = ({
  open,
  onClose,
  message,
  severity = 'success',
  title,
  duration = 6000,
  variant = 'filled',
  action,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 8 }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant={variant}
        sx={{ width: '100%' }}
        action={action}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CommonSnackbar;
