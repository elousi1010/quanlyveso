import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { 
  CommonFormDialog, 
  CommonViewEditDialog, 
  CommonDetailDialog 
} from '@/components/common';
import {
  PermissionHeader,
  PermissionDataGrid,
  PermissionSearchAndFilter,
  PermissionDeleteDialog,
  PermissionSnackbar,
} from './components';
import { usePermissions, usePermissionMutations } from './hooks';
import { 
  permissionCreateFields, 
  permissionUpdateFields, 
  permissionDetailFields 
} from './constants';
import type { 
  Permission, 
  CreatePermissionDto, 
  UpdatePermissionDto, 
  PermissionSearchParams 
} from './types';

export const PermissionManagement: React.FC = () => {
  // State management
  const [searchParams, setSearchParams] = useState<PermissionSearchParams>({
    page: 1,
    limit: 10,
  });
  const [selectedRows, setSelectedRows] = useState<Permission[]>([]);
  const [dialogState, setDialogState] = useState({
    create: false,
    edit: false,
    view: false,
    delete: false,
  });
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const { data: permissionsData, isLoading, refetch } = usePermissions(searchParams);
  const { createMutation, updateMutation, deleteMutation } = usePermissionMutations();

  // Event handlers
  const handleSearchChange = useCallback((params: PermissionSearchParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({ page: 1, limit: 10 });
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedPermission(null);
    setDialogState(prev => ({ ...prev, create: true }));
  }, []);

  const handleEdit = useCallback((permission: Permission) => {
    setSelectedPermission(permission);
    setDialogState(prev => ({ ...prev, edit: true }));
  }, []);

  const handleView = useCallback((permission: Permission) => {
    setSelectedPermission(permission);
    setDialogState(prev => ({ ...prev, view: true }));
  }, []);

  const handleDelete = useCallback((permission: Permission) => {
    setSelectedPermission(permission);
    setDialogState(prev => ({ ...prev, delete: true }));
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selectedRows.length > 0) {
      // Implement bulk delete logic here
      setSnackbar({
        open: true,
        message: `Đã xóa ${selectedRows.length} quyền hạn`,
        severity: 'success',
      });
      setSelectedRows([]);
    }
  }, [selectedRows]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleCloseDialog = useCallback((dialogType: keyof typeof dialogState) => {
    setDialogState(prev => ({ ...prev, [dialogType]: false }));
    setSelectedPermission(null);
  }, []);

  const handleCreateSubmit = useCallback(async (data: CreatePermissionDto) => {
    try {
      await createMutation.mutateAsync(data);
      setSnackbar({
        open: true,
        message: 'Tạo quyền hạn thành công',
        severity: 'success',
      });
      handleCloseDialog('create');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tạo quyền hạn',
        severity: 'error',
      });
    }
  }, [createMutation, handleCloseDialog]);

  const handleUpdateSubmit = useCallback(async (data: UpdatePermissionDto) => {
    if (!selectedPermission) return;
    
    try {
      await updateMutation.mutateAsync({ id: selectedPermission.id, data });
      setSnackbar({
        open: true,
        message: 'Cập nhật quyền hạn thành công',
        severity: 'success',
      });
      handleCloseDialog('edit');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật quyền hạn',
        severity: 'error',
      });
    }
  }, [selectedPermission, updateMutation, handleCloseDialog]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedPermission) return;
    
    try {
      await deleteMutation.mutateAsync(selectedPermission.id);
      setSnackbar({
        open: true,
        message: 'Xóa quyền hạn thành công',
        severity: 'success',
      });
      handleCloseDialog('delete');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa quyền hạn',
        severity: 'error',
      });
    }
  }, [selectedPermission, deleteMutation, handleCloseDialog]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const permissions = permissionsData?.data || [];

  return (
    <Box sx={{ p: 2 }}>
      <PermissionHeader
        onCreate={handleCreate}
        onRefresh={handleRefresh}
        selectedCount={selectedRows.length}
        onDeleteSelected={handleDeleteSelected}
      />

      <Box sx={{ mt: 2 }}>
        <PermissionSearchAndFilter
          searchParams={searchParams}
          onSearchChange={handleSearchChange}
          onReset={handleReset}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <PermissionDataGrid
          data={permissions}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
        />
      </Box>

      {/* Create Dialog */}
      <CommonFormDialog
        open={dialogState.create}
        onClose={() => handleCloseDialog('create')}
        onSubmit={handleCreateSubmit}
        title="Tạo Quyền hạn Mới"
        fields={permissionCreateFields}
        submitText="Tạo"
        loading={createMutation.isPending}
      />

      {/* Edit Dialog */}
      <CommonViewEditDialog
        open={dialogState.edit}
        onClose={() => handleCloseDialog('edit')}
        onSubmit={handleUpdateSubmit}
        onView={() => {
          handleCloseDialog('edit');
          setDialogState(prev => ({ ...prev, view: true }));
        }}
        title="Chỉnh sửa Quyền hạn"
        fields={permissionUpdateFields}
        data={selectedPermission}
        submitText="Cập nhật"
        loading={updateMutation.isPending}
      />

      {/* View Dialog */}
      <CommonDetailDialog
        open={dialogState.view}
        onClose={() => handleCloseDialog('view')}
        onEdit={() => {
          handleCloseDialog('view');
          setDialogState(prev => ({ ...prev, edit: true }));
        }}
        title="Chi tiết Quyền hạn"
        fields={permissionDetailFields}
        data={selectedPermission}
      />

      {/* Delete Dialog */}
      <PermissionDeleteDialog
        open={dialogState.delete}
        onClose={() => handleCloseDialog('delete')}
        onConfirm={handleDeleteConfirm}
        permission={selectedPermission}
        loading={deleteMutation.isPending}
      />

      {/* Snackbar */}
      <PermissionSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};
