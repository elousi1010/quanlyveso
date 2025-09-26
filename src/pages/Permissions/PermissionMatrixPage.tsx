import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import PermissionMatrix from './components/PermissionMatrix';
import { useUsers } from '@/pages/Users/hooks/useUserApi';
import type { User } from '@/pages/Users/types/userTypes';

const PermissionMatrixPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Lấy danh sách users
  const { data: usersData, isLoading, error } = useUsers({ limit: 1000 });

  useEffect(() => {
    if (usersData?.data?.data) {
      setUsers(usersData.data.data);
    }
  }, [usersData]);

  const handleSuccess = () => {
    setSnackbar({
      open: true,
      message: 'Cập nhật ma trận quyền hạn thành công!',
      severity: 'success',
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 0 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Ma trận quyền hạn
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quản lý quyền hạn dạng ma trận trực quan cho tất cả user
          </Typography>
        </Paper>
        <Alert severity="error">
          Không thể tải danh sách user. Vui lòng thử lại sau.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 0 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Ma trận quyền hạn
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quản lý quyền hạn dạng ma trận trực quan cho tất cả user ({users.length} user)
        </Typography>
      </Paper>

      {users.length === 0 ? (
        <Alert severity="info">
          Không có user nào để hiển thị ma trận quyền hạn.
        </Alert>
      ) : (
        <PermissionMatrix
          users={users}
          onSuccess={handleSuccess}
        />
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <Alert 
          severity={snackbar.severity} 
          onClose={handleSnackbarClose}
          sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}
        >
          {snackbar.message}
        </Alert>
      )}
    </Box>
  );
};

export default PermissionMatrixPage;
