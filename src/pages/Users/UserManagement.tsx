import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Alert,
} from '@mui/material';
import {
  CommonHeader,
  CommonSearchAndFilter,
  CommonDataTable,
  CommonFormDialog,
  CommonViewEditDialog,
  CommonDeleteDialog,
  CommonSnackbar,
} from '../../components/common';
import { useUsers, useUserMutations, useUser } from './hooks';
import type { CreateUserRequest, UpdateUserRequest, User } from './types';
import { USER_TABLE_COLUMNS, USER_TABLE_ACTIONS } from './constants/userTableConfig';
import { USER_FORM_FIELDS, USER_DETAIL_FIELDS } from './constants/userDialogConfig';
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
    isViewEditDialogOpen,
    isDeleteDialogOpen,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
    openCreateDialog,
    openViewEditDialog,
    openDeleteDialog,
    closeAllDialogs,
  } = useUserMutations();

  // Luôn gọi useUser nhưng với enabled condition
  const { user: userDetail } = useUser(selectedUser?.id || '');
  
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

  const handleUpdateUserWithSnackbar = (data: Record<string, unknown>) => {
    if (!selectedUser?.id) {
      showSnackbar('Lỗi: Không tìm thấy ID người dùng', 'error');
      return;
    }
    
    const updateData = data as unknown as UpdateUserRequest;
    updateUserMutation.mutate(
      { id: selectedUser.id, data: updateData },
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
  const tableActions = USER_TABLE_ACTIONS.map(action => ({
    ...action,
    onClick: (user: User) => {
      switch (action.key) {
        case 'view':
        case 'edit':
          openViewEditDialog(user);
          break;
        case 'delete':
          openDeleteDialog(user);
          break;
      }
    },
  }));

  return (
    <Box sx={{ p: 3 }}>
      <CommonHeader
        title="Quản lý người dùng"
        subtitle="Quản lý thông tin và quyền hạn của các người dùng trong hệ thống"
        onRefresh={handleRefresh}
        onCreate={openCreateDialog}
        createButtonText="Thêm người dùng"
        loading={isLoading}
      />

      <CommonSearchAndFilter
        config={searchFilterConfig}
        onSearch={handleSearch}
        onSort={handleSort}
        onFilter={handleFilter}
        onRefresh={handleRefresh}
        loading={isLoading}
      />

      <Paper sx={{ p: 3 }}>
        <CommonDataTable
          data={usersResponse?.data?.data}
          columns={USER_TABLE_COLUMNS}
          actions={tableActions}
          isLoading={isLoading}
          error={error}
          onRefresh={handleRefresh}
          emptyMessage="Không có người dùng"
          emptyDescription="Chưa có người dùng nào trong hệ thống"
        />
      </Paper>

      {/* Dialogs */}
      <CommonFormDialog
        open={isCreateDialogOpen}
        onClose={closeAllDialogs}
        onSubmit={handleCreateUserWithSnackbar}
        title="Thêm người dùng mới"
        fields={USER_FORM_FIELDS}
        initialData={createFormData as unknown as Record<string, unknown>}
        isSubmitting={createUserMutation.isPending}
        submitButtonText="Tạo người dùng"
      />

      <CommonViewEditDialog
        open={isViewEditDialogOpen}
        onClose={closeAllDialogs}
        onSave={handleUpdateUserWithSnackbar}
        title="Thông tin người dùng"
        item={(userDetail || selectedUser || {}) as unknown as Record<string, unknown>}
        formFields={USER_FORM_FIELDS.filter(field => field.key !== 'password')}
        detailFields={USER_DETAIL_FIELDS as unknown as import('../../components/common/types').DetailField[]}
        isSubmitting={updateUserMutation.isPending}
        avatar={{
          text: selectedUser?.name?.charAt(0)?.toUpperCase() || 'U',
          color: 'primary.main',
        }}
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
