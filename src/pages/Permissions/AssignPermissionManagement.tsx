import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Person,
  Security,
  Assignment,
  Refresh,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../Users/api';
import { usePermissionMutations } from './hooks/usePermissionMutations';
import { usePermissions } from './hooks/usePermissions';
import { AssignPermissionDialog } from './components';
import { CommonSnackbar, CommonHeader } from '@/components/common';
import type { User } from './types';

export const AssignPermissionManagement: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Fetch users
  const { data: usersResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getUsers(),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch permissions to calculate user permissions
  const { data: permissionsData } = usePermissions();

  const { setForUserMutation } = usePermissionMutations();

  const handleAssignPermission = useCallback((user: User) => {
    setSelectedUser(user);
    setAssignDialogOpen(true);
  }, []);

  const handleAssignSubmit = useCallback(async (permissionId: string, data: any) => {
    try {
      await setForUserMutation.mutateAsync({ id: permissionId, data });
      // Success will be handled after all permissions are assigned
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi gán quyền hạn',
        severity: 'error',
      });
      throw error; // Re-throw to let dialog handle it
    }
  }, [setForUserMutation]);

  const handleAssignSuccess = useCallback(() => {
    setSnackbar({
      open: true,
      message: 'Gán quyền hạn thành công',
      severity: 'success',
    });
    setAssignDialogOpen(false);
    setSelectedUser(null);
    // Refetch data to update permissions count
    refetch();
  }, [refetch]);


  const handleCloseDialog = useCallback(() => {
    setAssignDialogOpen(false);
    setSelectedUser(null);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Calculate user permissions count
  const getUserPermissionsCount = useCallback((userId: string): number => {
    if (!permissionsData?.data) return 0;
    
    return permissionsData.data.filter(permission => 
      permission.users?.some(user => user.id === userId)
    ).length;
  }, [permissionsData]);

  const users = usersResponse?.data?.data || [];

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Lỗi khi tải danh sách người dùng: {(error as Error).message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <CommonHeader
        title="Gán quyền hạn"
        subtitle="Gán quyền hạn cho các người dùng trong hệ thống"
        onCreate={() => {}} // No create action for this page
        onRefresh={handleRefresh}
        loading={isLoading}
        showRefresh={true}
        createButtonText=""
        showBulkEdit={false}
      />

      {/* Users Grid */}
      <Box sx={{ mt: 2, flex: 1, overflow: 'hidden' }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, background: 'white', height: '100%', overflow: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.dark' }}>
            Danh sách người dùng ({users.length})
          </Typography>
        
        {isLoading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Đang tải danh sách người dùng...
            </Typography>
          </Box>
        ) : users.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Không có người dùng nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chưa có người dùng nào trong hệ thống
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {users.map((user: User) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          mr: 2,
                          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        }}
                      >
                        <Person />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark' }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                          {user.phone_number}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={user.role.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: user.role === 'admin' ? '#f44336' : '#2196f3',
                          color: 'white',
                          fontWeight: 600,
                          mr: 1
                        }}
                      />
                      <Chip
                        label={user.is_active ? 'Hoạt động' : 'Không hoạt động'}
                        size="small"
                        color={user.is_active ? 'success' : 'error'}
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Quyền hạn: {getUserPermissionsCount(user.id)} quyền
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      Tạo: {new Date(user.created_at).toLocaleDateString('vi-VN')}
                    </Typography>
                  </CardContent>

                  <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Security />}
                      onClick={() => handleAssignPermission(user)}
                      sx={{
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                        }
                      }}
                    >
                      Gán quyền hạn
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        </Paper>
      </Box>

      {/* Assign Permission Dialog */}
      <AssignPermissionDialog
        open={assignDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleAssignSubmit}
        onSuccess={handleAssignSuccess}
        user={selectedUser}
        loading={setForUserMutation.isPending}
      />

      {/* Snackbar */}
      <CommonSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};
