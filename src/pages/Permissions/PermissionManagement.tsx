import React, { useState, useCallback } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { 
  Security,
  Cancel,
  Edit
} from '@mui/icons-material';
import {
  PermissionHeader,
  PermissionDataGrid,
  PermissionSearchAndFilter,
  PermissionDeleteDialog,
  PermissionSnackbar,
  PermissionFormDialog,
  PermissionDetailView,
} from './components';
import { usePermissions, usePermissionMutations } from './hooks';
import type { 
  Permission, 
  CreatePermissionDto, 
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

  const handleUpdateSubmit = useCallback(async (data: CreatePermissionDto) => {
    if (!selectedPermission) return;
    
    try {
      // Use data directly instead of converting it again
      await updateMutation.mutateAsync({ id: selectedPermission.id, data: data });
      setSnackbar({
        open: true,
        message: 'Cập nhật quyền hạn thành công',
        severity: 'success',
      });
      // Close dialog after a short delay to show success message
      setTimeout(() => {
        handleCloseDialog('edit');
      }, 1000);
    } catch {
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

      <Box>
        <PermissionSearchAndFilter
          searchParams={searchParams} 
          onSearchChange={handleSearchChange}
          onReset={handleReset}
        />
      </Box>

      <Box>
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
      <PermissionFormDialog
        open={dialogState.create}
        onClose={() => handleCloseDialog('create')}
        onSave={handleCreateSubmit}
        title="Tạo Quyền hạn Mới"
        loading={createMutation.isPending}
      />

      {/* Edit Dialog */}
      <PermissionFormDialog
        open={dialogState.edit}
        onClose={() => handleCloseDialog('edit')}
        onSave={handleUpdateSubmit}
        title="Chỉnh sửa Quyền hạn"
        permission={selectedPermission}
        loading={updateMutation.isPending}
      />

      {/* View Dialog */}
      <Dialog
        open={dialogState.view}
        onClose={() => handleCloseDialog('view')}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            minHeight: '700px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 2, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <Security sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Chi tiết Quyền hạn
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Xem thông tin chi tiết và phân quyền
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {selectedPermission && <PermissionDetailView permission={selectedPermission} />}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => handleCloseDialog('view')}
            startIcon={<Cancel />}
            size="large"
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1
            }}
          >
            Đóng
          </Button>
          <Button
            onClick={() => {
              handleCloseDialog('view');
              setDialogState(prev => ({ ...prev, edit: true }));
            }}
            startIcon={<Edit />}
            variant="contained"
            size="large"
            sx={{ 
              borderRadius: 2,
              px: 4,
              py: 1,
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
              }
            }}
          >
            Chỉnh sửa
          </Button>
        </DialogActions>
      </Dialog>

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
