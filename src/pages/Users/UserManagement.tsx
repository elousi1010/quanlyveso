import React, { useState, useCallback, useMemo } from 'react';
import { Alert, theme as antdTheme } from 'antd';
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

/**
 * UserManagement Component
 * 
 * Manages system users with a unified UI pattern and integrated state management.
 */
const UserManagement: React.FC = () => {
  const { token } = antdTheme.useToken();

  // Pagination state using custom hook
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

  /**
   * Unified view state for dialogs and drawers.
   */
  const [activeView, setActiveView] = useState<{
    type: 'create' | 'edit' | 'view' | 'delete' | null;
    user: User | null;
  }>({ type: null, user: null });

  // Snackbar state for user feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const combinedParams = useMemo(() => ({
    ...searchParams,
    ...apiParams,
  }), [searchParams, apiParams]);

  const { data: usersResponse, isLoading, error, refetch } = useUsers(combinedParams);
  const { createUserMutation, updateUserMutation, deleteUserMutation } = useUserMutations();

  // View control handlers
  const openView = useCallback((type: typeof activeView['type'], user: User | null = null) => {
    setActiveView({ type, user });
  }, []);

  const closeView = useCallback(() => {
    setActiveView({ type: null, user: null });
  }, []);

  const showSnackbar = useCallback((message: string, severity: typeof snackbar['severity'] = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Event handlers
  const handleSearch = useCallback((query: string) => {
    setSearchParams(prev => ({ ...prev, searchKey: query }));
  }, []);

  const handleSort = useCallback((sortBy: string) => {
    setSearchParams(prev => ({ ...prev, sortBy }));
  }, []);

  const handleFilterChange = useCallback((newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setSearchParams(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  /**
   * Mutation Handlers
   */

  const handleCreateSubmit = useCallback(async (data: Record<string, unknown>) => {
    try {
      await createUserMutation.mutateAsync(data as unknown as CreateUserRequest);
      showSnackbar('Tạo người dùng thành công!', 'success');
      closeView();
    } catch (err: any) {
      showSnackbar(`Lỗi: ${err.message}`, 'error');
    }
  }, [createUserMutation, closeView, showSnackbar]);

  const handleUpdateSubmit = useCallback(async (data: Record<string, unknown>, selectedRow?: User) => {
    const target = selectedRow || activeView.user;
    if (!target?.id) {
      showSnackbar('Lỗi: Không tìm thấy ID người dùng', 'error');
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        id: target.id,
        data: data as unknown as UpdateUserRequest
      });
      showSnackbar('Cập nhật người dùng thành công!', 'success');
      closeView();
    } catch (err: any) {
      showSnackbar(`Lỗi: ${err.message}`, 'error');
    }
  }, [activeView.user, updateUserMutation, closeView, showSnackbar]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeView.user?.id) return;

    try {
      await deleteUserMutation.mutateAsync(activeView.user.id);
      showSnackbar('Xóa người dùng thành công!', 'success');
      closeView();
    } catch (err: any) {
      showSnackbar(`Lỗi: ${err.message}`, 'error');
    }
  }, [activeView.user, deleteUserMutation, closeView, showSnackbar]);

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Lỗi"
          description={`Không thể tải danh sách người dùng: ${(error as Error).message}`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '0 0 24px 0', minHeight: '100%' }}>
      <CommonHeader
        title="Quản lý người dùng"
        subtitle="Quản lý thông tin và quyền hạn của các người dùng trong hệ thống"
        onRefresh={handleRefresh}
        onCreate={() => openView('create')}
        createButtonText="Thêm người dùng"
        loading={isLoading}
      />

      <div style={{ marginTop: '16px' }}>
        <UserSearchAndFilter
          onSearch={handleSearch}
          onSort={handleSort}
          onFilter={(f) => handleFilterChange(f)}
          onRefresh={handleRefresh}
          loading={isLoading}
          onFilterChange={handleFilterChange}
          filters={filters}
        />
      </div>

      <div style={{
        marginTop: '16px',
        background: token.colorBgContainer,
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <UserDataGrid
          data={usersResponse}
          isLoading={isLoading}
          error={error}
          onRefresh={handleRefresh}
          onViewDetail={(u) => openView('view', u)}
          onEdit={(u) => openView('edit', u)}
          onDelete={(u) => openView('delete', u)}
          onSave={handleUpdateSubmit}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage: number) => handleChangePage(null, newPage)}
          onRowsPerPageChange={(newRowsPerPage: number) => {
            handleChangeRowsPerPage({ target: { value: newRowsPerPage.toString() } } as any);
          }}
        />
      </div>

      {/* Drawers & Dialogs */}
      <CommonFormDrawer
        open={activeView.type === 'create'}
        onClose={closeView}
        onSave={handleCreateSubmit}
        title="Thêm người dùng mới"
        fields={USER_FORM_FIELDS}
        loading={createUserMutation.isPending}
        submitText="Tạo người dùng"
        width={500}
      />

      {activeView.user && (activeView.type === 'view' || activeView.type === 'edit') && (
        <CommonViewEditDrawer
          open={true}
          onClose={closeView}
          onSave={handleUpdateSubmit}
          title={activeView.type === 'view' ? 'Chi tiết người dùng' : 'Chỉnh sửa người dùng'}
          viewFields={USER_FORM_FIELDS as DetailField[]}
          editFields={USER_FORM_FIELDS as FormField[]}
          data={activeView.user as unknown as Record<string, unknown>}
          loading={updateUserMutation.isPending}
          mode={activeView.type === 'view' ? 'view' : 'edit'}
        />
      )}

      <CommonDeleteDialog
        open={activeView.type === 'delete'}
        onClose={closeView}
        onConfirm={handleDeleteConfirm}
        title="Xóa người dùng"
        itemName={activeView.user?.name}
        itemType="người dùng"
        isDeleting={deleteUserMutation.isPending}
      />

      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      />
    </div>
  );
};

export default UserManagement;
