import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { 
  CommonFormDialog
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
  organizationCreateFields
} from './constants';
import type { 
  Organization, 
  CreateOrganizationDto, 
  UpdateOrganizationDto, 
  OrganizationSearchParams 
} from './types';

export const OrganizationManagement: React.FC = () => {
  // State management
  const [searchParams, setSearchParams] = useState<OrganizationSearchParams>({
    page: 1,
    limit: 5,
  });
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

  const handleSort = useCallback((sortBy: string) => {
    setSearchParams(prev => ({ ...prev, sortBy, page: 1 }));
  }, []);

  const handleFilter = useCallback((filters: Record<string, string>) => {
    setSearchParams(prev => ({ ...prev, filters, page: 1 }));
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

  const handleUpdateSubmit = useCallback(async (data: Record<string, unknown>, selectedRow?: Organization) => {
    const organizationToUpdate = selectedRow || selectedOrganization;
    if (!organizationToUpdate) return;
    
    try {
      await updateMutation.mutateAsync({ id: organizationToUpdate.id, data: data as unknown as UpdateOrganizationDto });
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
      />

      <Box sx={{ mt: 2 }}>
        <OrganizationSearchAndFilter
          searchParams={searchParams}
          onSearch={handleSearchChange as (query: string) => void}
          onSort={handleSort}
          onFilter={handleFilter}
          onRefresh={handleRefresh}
          loading={isLoading}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <OrganizationDataGrid
          data={organizations as Organization[]}
          loading={isLoading}
          error={error}
          onRefresh={refetch}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onSave={handleUpdateSubmit}
          page={(searchParams.page || 1) - 1}
          rowsPerPage={searchParams.limit || 10}
          total={total}
          onPageChange={(page) => setSearchParams(prev => ({ ...prev, page: page + 1 }))}
          onRowsPerPageChange={(limit) => setSearchParams(prev => ({ ...prev, limit, page: 1 }))}
        />
      </Box>

      {/* Create Dialog */}
      <CommonFormDialog
        open={dialogState.create}
        onClose={() => handleCloseDialog('create')}
        onSave={(data: Record<string, unknown>) => handleCreateSubmit(data as unknown as CreateOrganizationDto)}
        title="Tạo Tổ chức Mới"
        fields={organizationCreateFields}
        submitText="Tạo"
        loading={createMutation.isPending}
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
