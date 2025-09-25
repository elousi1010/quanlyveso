import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import {
  PermissionHeader,
  PermissionDataGrid,
  PermissionSearchAndFilter,
  PermissionDeleteDialog,
  PermissionSnackbar,
  PermissionFormDialog,
  PermissionFormDrawer,
  PermissionDetailView,
} from './components';
import PermissionFormDrawerSimple from './components/PermissionFormDrawerSimple';
import { usePermissions, usePermissionMutations } from './hooks';
import type { 
  Permission, 
  CreatePermissionDto, 
  UpdatePermissionDto,
  PermissionSearchParams 
} from './types';
import { permissionSearchFields, permissionDetailFields } from './constants';
import type { SearchAndFilterConfig, DetailField } from '@/components/common';

export const PermissionManagement: React.FC = () => {
  // State management
  const [searchParams, setSearchParams] = useState<PermissionSearchParams>({
    page: 1,
    limit: 5,
  });
  const [selectedRows, setSelectedRows] = useState<Permission[]>([]);
  const [dialogState, setDialogState] = useState({
    create: false,
    edit: false,
    view: false,
    delete: false,
  });
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const { data: permissionsData, isLoading, refetch } = usePermissions(searchParams);
  const { createMutation, updateMutation, deleteMutation } = usePermissionMutations();

  // Event handlers
  const handleSearchChange = useCallback((query: string) => {
    setSearchParams(prev => ({ ...prev, query, page: 1 }));
  }, []);

  const handleSort = useCallback((sortBy: string) => {
    setSearchParams(prev => ({ ...prev, sortBy }));
  }, []);

  const handleFilter = useCallback((filters: Record<string, string>) => {
    setSearchParams(prev => ({ ...prev, ...filters }));
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

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
    setViewMode('detail');
  }, []);

  const handleDelete = useCallback((permission: Permission) => {
    setSelectedPermission(permission);
    setDialogState(prev => ({ ...prev, delete: true }));
  }, []);

  const handleBackToList = useCallback(() => {
    setViewMode('list');
    setSelectedPermission(null);
  }, []);

  const handleBackToListKeepSelection = useCallback(() => {
    setViewMode('list');
    // Keep selectedPermission for edit
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

  const handleCloseDialog = useCallback((dialogType: keyof typeof dialogState) => {
    setDialogState(prev => ({ ...prev, [dialogType]: false }));
    if (dialogType === 'edit') {
      // Don't reset selectedPermission when closing edit dialog
      // Keep it for potential re-editing
    } else {
      setSelectedPermission(null);
    }
    setViewMode('list');
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
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tạo quyền hạn',
        severity: 'error',
      });
    }
  }, [createMutation, handleCloseDialog]);

  // Function to create the specific permission with provided data
  const handleCreateSpecificPermission = useCallback(async () => {
    const permissionData: CreatePermissionDto = {
      name: "Permission 1",
      code: "permission_1",
      actions: {
        user: ["read", "create", "update", "delete"]
      }
    };

    try {
      await createMutation.mutateAsync(permissionData);
      setSnackbar({
        open: true,
        message: 'Tạo quyền hạn "Permission 1" thành công',
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tạo quyền hạn "Permission 1"',
        severity: 'error',
      });
    }
  }, [createMutation]);

  const handleUpdateSubmit = useCallback(async (data: Record<string, unknown>, selectedRow?: Permission) => {
    const permissionToUpdate = selectedRow || selectedPermission;
    if (!permissionToUpdate) {
      console.error('No permission to update');
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: permissionToUpdate.id, data: data as unknown as UpdatePermissionDto });
      setSnackbar({
        open: true,
        message: 'Cập nhật quyền hạn thành công',
        severity: 'success',
      });
      setDialogState(prev => ({ ...prev, edit: false }));
      setSelectedPermission(null);
      setViewMode('list');
    } catch (error) {
      console.error('Update error:', error);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật quyền hạn',
        severity: 'error',
      });
    }
  }, [selectedPermission, updateMutation]);

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
    } catch {
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
    <Box sx={{ mt: 0 }}>
      <PermissionHeader
        onCreate={handleCreate}
        onRefresh={handleRefresh}
        selectedCount={selectedRows.length}
        onDeleteSelected={handleDeleteSelected}
        onCreateSpecific={handleCreateSpecificPermission}
      />

      {viewMode === 'list' ? (
        <>
          <Box>
            <PermissionSearchAndFilter
              searchParams={searchParams as Record<string, unknown>} 
              onSearch={handleSearchChange as (query: string) => void}
              onSort={handleSort}
              onFilter={handleFilter}
              onSearchChange={handleSearchChange as (query: string) => void}
              loading={isLoading}
              config={permissionSearchFields as SearchAndFilterConfig}
            />
          </Box>

          <Box>
            <PermissionDataGrid
              data={permissions}
              loading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onSave={handleUpdateSubmit}
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
            />
          </Box>
        </>
      ) : (
        <Box>
          {selectedPermission && (
            <PermissionFormDrawerSimple
              open={true}
              onClose={handleBackToList}
              onSave={(data) => {
                handleUpdateSubmit(data as unknown as Record<string, unknown>, selectedPermission);
                handleBackToList();
              }}
              title="Chi tiết Quyền hạn"
              permission={selectedPermission}
              loading={updateMutation.isPending}
              mode="view"
              onEdit={() => {
                setViewMode('list');
                setDialogState(prev => ({ ...prev, edit: true }));
              }}
            />
          )}
        </Box>
      )}

      {/* Create Drawer */}
      <PermissionFormDrawerSimple
        open={dialogState.create}
        onClose={() => handleCloseDialog('create')}
        onSave={(data) => handleCreateSubmit(data as unknown as CreatePermissionDto)}
        title="Tạo Quyền hạn Mới"
        loading={createMutation.isPending}
        mode="edit"
      />

      {/* Edit Drawer */}
      <PermissionFormDrawerSimple
        open={dialogState.edit}
        onClose={() => handleCloseDialog('edit')}
        onSave={(data) => handleUpdateSubmit(data as unknown as Record<string, unknown>, selectedPermission)}
        title="Chỉnh sửa Quyền hạn"
        permission={selectedPermission}
        loading={updateMutation.isPending}
        mode="edit"
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
