import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Alert,
} from '@mui/material';
import { useTablePagination } from '@/hooks';
import {
  CommonHeader,
  CommonFormDrawer,
  CommonDeleteDialog,
  CommonSnackbar,
  CommonViewEditDrawer,
  type DetailField,
  type FormField,
} from '@/components/common';
import { useUsers, useUserMutations } from './hooks';
import { UserDataGrid, UserSearchAndFilter } from './components';
import type { CreateUserRequest, UpdateUserRequest, User, UserSearchParams } from './types';
import { USER_FORM_FIELDS } from './constants/userDialogConfig';

const UserManagement: React.FC = () => {
  // Pagination state
  const {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    apiParams,
  } = useTablePagination({
    initialLimit: 5,
  });

  // Search and filter state
  const [searchParams, setSearchParams] = useState<UserSearchParams>({});
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  // State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks - combine search params with pagination
  const combinedParams = {
    ...searchParams,
    ...apiParams,
  };
  const { data: usersResponse, isLoading, error, refetch } = useUsers(combinedParams);
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

  // Debug logging removed to prevent console spam

  // Handlers
  const handleSearch = (query: string) => {
    setSearchParams(prev => ({ ...prev, searchKey: query }));
  };

  const handleSort = (sortBy: string) => {
    setSearchParams(prev => ({ ...prev, sortBy }));
  };

  const handleFilter = (filters: Record<string, string>) => {
    setSearchParams(prev => ({ ...prev, ...filters }));
  };

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    const combinedParams = { ...searchParams, ...newFilters };
    setSearchParams(combinedParams);
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

  const handleViewUser = (user: User) => {
    openViewEditDialog(user);
    // View functionality is now handled by CommonViewEditDrawer
  };

  const handleEditUser = (user: User) => {
    openViewEditDialog(user);
    // Edit functionality is now handled by CommonViewEditDrawer
  };

  const handleDeleteUser = (user: User) => {
    openDeleteDialog(user);
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
        <UserSearchAndFilter
          onSearch={handleSearch}
          onSort={handleSort}
          onFilter={handleFilter}
          onRefresh={handleRefresh}
          loading={isLoading}
          onFilterChange={handleFilterChange}
          filters={filters}
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
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(newPage: number) => handleChangePage(null, newPage)}
            onRowsPerPageChange={(newRowsPerPage: number) => {
              const event = { target: { value: newRowsPerPage.toString() } } as React.ChangeEvent<HTMLInputElement>;
              handleChangeRowsPerPage(event);
            }}
          />
        </Paper>
      </Box>

      {/* Drawers */}
      <CommonFormDrawer
        open={isCreateDialogOpen}
        onClose={closeAllDialogs}
        onSave={handleCreateUserWithSnackbar}
        title="Thêm người dùng mới"
        fields={USER_FORM_FIELDS}
        initialData={createFormData as unknown as Record<string, unknown>}
        loading={createUserMutation.isPending}
        submitText="Tạo người dùng"
        width={500}
      />

      <CommonViewEditDrawer
        open={isViewEditDialogOpen}
        onClose={closeAllDialogs}
        onSave={handleUpdateUserWithSnackbar}
        title="Chi tiết người dùng"
        viewFields={USER_FORM_FIELDS as DetailField[]}
        editFields={USER_FORM_FIELDS as FormField[]}
        data={selectedUser as unknown as Record<string, unknown>}
        loading={updateUserMutation.isPending}
        mode={isViewEditDialogOpen ? 'view' : 'edit'}
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
