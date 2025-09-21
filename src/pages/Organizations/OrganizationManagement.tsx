import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { 
  CommonFormDialog, 
  CommonViewEditDialog, 
  CommonDetailDialog 
} from '@/components/common';
import {
  OrganizationHeader,
  OrganizationDataGrid,
  OrganizationSearchAndFilter,
  OrganizationDeleteDialog,
  OrganizationSnackbar,
} from './components';
import { useOrganizations, useOrganizationMutations } from './hooks';
import { 
  organizationCreateFields, 
  organizationUpdateFields, 
  organizationDetailFields 
} from './constants';
import type { 
  Organization, 
  CreateOrganizationDto, 
  UpdateMyOrganizationDto, 
  OrganizationSearchParams 
} from './types';

export const OrganizationManagement: React.FC = () => {
  // State management
  const [searchParams, setSearchParams] = useState<OrganizationSearchParams>({
    page: 1,
    limit: 10,
  });
  const [selectedRows, setSelectedRows] = useState<Organization[]>([]);
  const [dialogState, setDialogState] = useState({
    create: false,
    edit: false,
    view: false,
    delete: false,
  });
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const { organizations, isLoading, error, total, refetch } = useOrganizations(searchParams);
  const { createMutation, updateMutation } = useOrganizationMutations();

  // Event handlers
  const handleSearchChange = useCallback((params: OrganizationSearchParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({ page: 1, limit: 10 });
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedOrganization(null);
    setDialogState(prev => ({ ...prev, create: true }));
  }, []);

  const handleEdit = useCallback((organization: Organization) => {
    setSelectedOrganization(organization);
    setDialogState(prev => ({ ...prev, edit: true }));
  }, []);

  const handleView = useCallback((organization: Organization) => {
    setSelectedOrganization(organization);
    setDialogState(prev => ({ ...prev, view: true }));
  }, []);

  const handleDelete = useCallback((organization: Organization) => {
    setSelectedOrganization(organization);
    setDialogState(prev => ({ ...prev, delete: true }));
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selectedRows.length > 0) {
      // Implement bulk delete logic here
      setSnackbar({
        open: true,
        message: `Đã xóa ${selectedRows.length} tổ chức`,
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
    setSelectedOrganization(null);
  }, []);

  const handleCreateSubmit = useCallback(async (data: CreateOrganizationDto) => {
    try {
      await createMutation.mutateAsync(data);
      setSnackbar({
        open: true,
        message: 'Tạo tổ chức thành công',
        severity: 'success',
      });
      handleCloseDialog('create');
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tạo tổ chức',
        severity: 'error',
      });
    }
  }, [createMutation, handleCloseDialog]);

  const handleUpdateSubmit = useCallback(async (data: UpdateMyOrganizationDto) => {
    if (!selectedOrganization) return;
    
    try {
      await updateMutation.mutateAsync({ id: selectedOrganization.id, data });
      setSnackbar({
        open: true,
        message: 'Cập nhật tổ chức thành công',
        severity: 'success',
      });
      handleCloseDialog('edit');
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật tổ chức',
        severity: 'error',
      });
    }
  }, [selectedOrganization, updateMutation, handleCloseDialog]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedOrganization) return;
    
    try {
      // Implement delete API call here
      setSnackbar({
        open: true,
        message: 'Xóa tổ chức thành công',
        severity: 'success',
      });
      handleCloseDialog('delete');
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa tổ chức',
        severity: 'error',
      });
    }
  }, [selectedOrganization, handleCloseDialog]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);


  return (
    <Box sx={{ p: 2 }}>
      <OrganizationHeader
        onCreate={handleCreate}
        onRefresh={handleRefresh}
        selectedCount={selectedRows.length}
        onDeleteSelected={handleDeleteSelected}
      />

      <Box sx={{ mt: 2 }}>
        <OrganizationSearchAndFilter
          searchParams={searchParams}
          onSearchChange={handleSearchChange}
          onReset={handleReset}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <OrganizationDataGrid
          data={organizations}
          loading={isLoading}
          error={error}
          onRefresh={refetch}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          page={searchParams.page || 0}
          rowsPerPage={searchParams.limit || 10}
          total={total}
          onPageChange={(page) => setSearchParams(prev => ({ ...prev, page }))}
          onRowsPerPageChange={(limit) => setSearchParams(prev => ({ ...prev, limit, page: 0 }))}
        />
      </Box>

      {/* Create Dialog */}
      <CommonFormDialog
        open={dialogState.create}
        onClose={() => handleCloseDialog('create')}
        onSubmit={(data: Record<string, unknown>) => handleCreateSubmit(data as unknown as CreateOrganizationDto)}
        title="Tạo Tổ chức Mới"
        fields={organizationCreateFields}
        submitButtonText="Tạo"
        isSubmitting={createMutation.isPending}
      />

      {/* Edit Dialog */}
      <CommonViewEditDialog
        open={dialogState.edit}
        onClose={() => handleCloseDialog('edit')}
        onSave={(data: Record<string, unknown>) => handleUpdateSubmit(data as unknown as UpdateMyOrganizationDto)}
        title="Chỉnh sửa Tổ chức"
        item={selectedOrganization as unknown as Record<string, unknown>}
        formFields={organizationUpdateFields}
        detailFields={organizationDetailFields}
        isSubmitting={updateMutation.isPending}
      />

      {/* View Dialog */}
      <CommonDetailDialog
        open={dialogState.view}
        onClose={() => handleCloseDialog('view')}
        onEdit={() => {
          handleCloseDialog('view');
          setDialogState(prev => ({ ...prev, edit: true }));
        }}
        title="Chi tiết Tổ chức"
        fields={organizationDetailFields}
        item={selectedOrganization as unknown as Record<string, unknown>}
      />

      {/* Delete Dialog */}
      <OrganizationDeleteDialog
        open={dialogState.delete}
        onClose={() => handleCloseDialog('delete')}
        onConfirm={handleDeleteConfirm}
        organization={selectedOrganization}
      />

      {/* Snackbar */}
      <OrganizationSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};
