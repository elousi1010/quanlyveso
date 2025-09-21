import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box,
  Avatar,
  Stack
} from '@mui/material';
import { 
  Warning as WarningIcon
} from '@mui/icons-material';
import type { User } from '../types';

interface UserDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  isDeleting: boolean;
}

const UserDeleteDialog: React.FC<UserDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  user,
  isDeleting,
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 2,
        borderBottom: '1px solid #e0e0e0',
        bgcolor: '#fafafa'
      }}>
        <Box display="flex" alignItems="center">
          <WarningIcon sx={{ mr: 1.5, color: 'error.main' }} />
          <Typography variant="h6" fontWeight="500">
            Xác nhận xóa
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar sx={{ 
            bgcolor: 'grey.100', 
            color: 'text.primary',
            width: 48, 
            height: 48,
            fontSize: '1.25rem',
            fontWeight: 500
          }}>
            {user?.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6" fontWeight="500" gutterBottom>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.phone_number} • {user?.role}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ 
          p: 2, 
          bgcolor: 'grey.50',
          borderRadius: 1,
          border: '1px solid #e0e0e0'
        }}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <WarningIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Bạn có chắc chắn muốn xóa người dùng này? Hành động này sẽ xóa vĩnh viễn 
                tất cả dữ liệu liên quan và không thể hoàn tác.
              </Typography>
            </Box>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 2, 
        borderTop: '1px solid #e0e0e0'
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
        >
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isDeleting}
        >
          {isDeleting ? 'Đang xóa...' : 'Xóa'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDeleteDialog;
