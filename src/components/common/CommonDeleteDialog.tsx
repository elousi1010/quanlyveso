import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon, Warning as WarningIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

interface CommonDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  itemType?: string;
  isDeleting?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  severity?: 'warning' | 'error';
}

const CommonDeleteDialog: React.FC<CommonDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'Xác nhận xóa',
  message,
  itemName,
  itemType = 'mục',
  isDeleting = false,
  maxWidth = 'sm',
  fullWidth = true,
  confirmButtonText = 'Xóa',
  cancelButtonText = 'Hủy',
  severity = 'warning',
}) => {
  const defaultMessage = message || `Bạn có chắc chắn muốn xóa ${itemType} "${itemName}" không? Hành động này không thể hoàn tác.`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{
              bgcolor: severity === 'error' ? 'error.main' : 'warning.main',
              width: 40,
              height: 40,
            }}
          >
            <WarningIcon />
          </Avatar>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Alert severity={severity} sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Cảnh báo
          </Typography>
          <Typography variant="body2">
            Hành động này sẽ xóa vĩnh viễn {itemType} và không thể hoàn tác.
          </Typography>
        </Alert>

        <Typography variant="body1" color="text.primary">
          {defaultMessage}
        </Typography>

        {itemName && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 1,
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {itemType} sẽ bị xóa:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {itemName}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          disabled={isDeleting}
          sx={{ textTransform: 'none' }}
        >
          {cancelButtonText}
        </Button>
        <LoadingButton
          onClick={onConfirm}
          loading={isDeleting}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ textTransform: 'none' }}
        >
          {confirmButtonText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CommonDeleteDialog;
