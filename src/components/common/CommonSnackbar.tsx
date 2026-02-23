import React, { useEffect } from 'react';
import { message as antdMessage, notification } from 'antd';

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
}) => {
  useEffect(() => {
    if (open) {
      if (title) {
        notification[severity]({
          message: title,
          description: message,
          duration: duration / 1000,
          onClose: onClose,
        });
      } else {
        antdMessage[severity]({
          content: message,
          duration: duration / 1000,
          onClose: onClose,
        });
      }
    }
  }, [open, severity, message, title, duration, onClose]);

  return null;
};

export default CommonSnackbar;
