import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Alert,
} from '@mui/material';
import {
  CommonHeader,
  CommonSearchAndFilter,
  CommonFormDialog,
  CommonDeleteDialog,
  CommonSnackbar,
} from '../../components/common';
import { useUsers, useUserMutations } from './hooks';
import { UserDataGrid } from './components/UserDataGrid';
import type { CreateUserRequest, UpdateUserRequest, User } from './types';
import { USER_FORM_FIELDS } from './constants/userDialogConfig';
import { USER_ROLES, USER_STATUS_OPTIONS, USER_SORT_OPTIONS } from './constants';

const UserManagement: React.FC = () => {
  // State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Hooks
  const { data: usersResponse, isLoading, error, refetch } = useUsers();
  const {
    selectedUser,
    isCreateDialogOpen,
    isDeleteDialogOpen,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
    openCreateDialog,
    closeAllDialogs,
  } = useUserMutations();

  
  // Debug logging removed to prevent console spam

  // Handlers
  const handleSearch = () => {
    // TODO: Implement search functionality
  };

  const handleSort = () => {
    // TODO: Implement sort functionality
  };

  const handleFilter = () => {
    // TODO: Implement filter functionality
  };

  const handleRefresh = () => {
    refetch();
  };

  // Form data
  const createFormData: CreateUserRequest = useMemo(() => ({
    name: '',
    phone_number: '',
    password: '',
    role: 'user',
  }), []);


  // Success/Error handlers
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Enhanced handlers with snackbar
  const handleCreateUserWithSnackbar = (data: Record<string, unknown>) => {
    const createData = data as unknown as CreateUserRequest;
    createUserMutation.mutate(createData, {
      onSuccess: () => {
        showSnackbar('Tạo người dùng thành công!', 'success');
        closeAllDialogs();
      },
      onError: (error: Error) => {
        showSnackbar(`Lỗi: ${error.message}`, 'error');
      },
    });
  };

  const handleUpdateUserWithSnackbar = async (data: Record<string, unknown>, selectedRow?: User) => {
    const userToUpdate = selectedRow || selectedUser;
    if (!userToUpdate?.id) {
      showSnackbar('Lỗi: Không tìm thấy ID người dùng', 'error');
      return;
    }
    
    const updateData = data as unknown as UpdateUserRequest;
    updateUserMutation.mutate(
      { id: userToUpdate.id, data: updateData },
      {
        onSuccess: () => {
          showSnackbar('Cập nhật người dùng thành công!', 'success');
          closeAllDialogs();
        },
        onError: (error: Error) => {
          showSnackbar(`Lỗi: ${error.message}`, 'error');
        },
      }
    );
  };

  const handleViewUser = () => {
    // View functionality is now handled by CommonViewEditDrawer
  };

  const handleEditUser = () => {
    // Edit functionality is now handled by CommonViewEditDrawer
  };

  const handleDeleteUser = () => {
    // Delete functionality is now handled by CommonViewEditDrawer
  };

  const handleDeleteUserWithSnackbar = () => {
    deleteUserMutation.mutate(selectedUser!.id, {
      onSuccess: () => {
        showSnackbar('Xóa người dùng thành công!', 'success');
        closeAllDialogs();
      },
      onError: (error: Error) => {
        showSnackbar(`Lỗi: ${error.message}`, 'error');
      },
    });
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Không thể tải danh sách người dùng: {(error as Error).message}
        </Alert>
      </Box>
    );
  }

  // Search and filter config
  const searchFilterConfig = {
    searchPlaceholder: 'Tìm kiếm người dùng...',
    sortOptions: [...(USER_SORT_OPTIONS || [])],
    filterOptions: [
      {
        key: 'role',
        label: 'Vai trò',
        options: [...(USER_ROLES || [])],
      },
      {
        key: 'status',
        label: 'Trạng thái',
        options: [...(USER_STATUS_OPTIONS || [])],
      },
    ],
  };

  // Table actions with handlers

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CommonHeader
        title="Quản lý người dùng"
        subtitle="Quản lý thông tin và quyền hạn của các người dùng trong hệ thống"
        onRefresh={handleRefresh}
        onCreate={openCreateDialog}
        createButtonText="Thêm người dùng"
        loading={isLoading}
      />

      <Box sx={{ mt: 2 }}>
        <CommonSearchAndFilter
          config={searchFilterConfig}
          onSearch={handleSearch}
          onSort={handleSort}
          onFilter={handleFilter}
          loading={isLoading}
        />
      </Box>

      <Box sx={{ mt: 2, flex: 1, overflow: 'hidden' }}>
        <Paper sx={{ height: '100%' }}>
          <UserDataGrid
            data={usersResponse}
            isLoading={isLoading}
            error={error}
            onRefresh={handleRefresh}
            onViewDetail={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onSave={handleUpdateUserWithSnackbar}
          />
        </Paper>
      </Box>

      {/* Dialogs */}
      <CommonFormDialog
        open={isCreateDialogOpen}
        onClose={closeAllDialogs}
        onSave={handleCreateUserWithSnackbar}
        title="Thêm người dùng mới"
        fields={USER_FORM_FIELDS}
        initialData={createFormData as unknown as Record<string, unknown>}
        loading={createUserMutation.isPending}
        submitText="Tạo người dùng"
      />


      <CommonDeleteDialog
        open={isDeleteDialogOpen}
        onClose={closeAllDialogs}
        onConfirm={handleDeleteUserWithSnackbar}
        title="Xóa người dùng"
        itemName={selectedUser?.name}
        itemType="người dùng"
        isDeleting={deleteUserMutation.isPending}
      />

      {/* Snackbar */}
      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
};

export default UserManagement;
