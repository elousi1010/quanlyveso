import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { 
  CommonViewEditDialog, 
  CommonDetailDialog 
} from '@/components/common';
import {
  PartnerHeader,
  PartnerDataGrid,
  PartnerSearchAndFilter,
  PartnerDeleteDialog,
  PartnerSnackbar,
  PartnerFormDialog,
} from './components';
import { usePartners, usePartnerMutations } from './hooks';
import { 
  PARTNER_FORM_FIELDS, 
  PARTNER_DETAIL_FIELDS 
} from './constants';
import { 
  formDataToUpdateDto, 
  partnerToFormData, 
  partnerToDisplayData 
} from './utils/partnerHelpers';
import type { 
  Partner, 
  CreatePartnerRequest, 
  PartnerSearchParams 
} from './types';

export const PartnerManagement: React.FC = () => {
  // State management
  const [searchParams, setSearchParams] = useState<PartnerSearchParams>({
    page: 1,
    limit: 10,
  });
  // const [selectedRows, setSelectedRows] = useState<Partner[]>([]);
  const [dialogState, setDialogState] = useState({
    create: false,
    edit: false,
    view: false,
    delete: false,
  });
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const { data: partnersData, isLoading, refetch } = usePartners(searchParams);
  const { createMutation, updateMutation, deleteMutation } = usePartnerMutations();

  // Event handlers
  const handleSearchChange = useCallback((params: PartnerSearchParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({ page: 1, limit: 10 });
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedPartner(null);
    setDialogState(prev => ({ ...prev, create: true }));
  }, []);

  const handleEdit = useCallback((partner: Partner) => {
    setSelectedPartner(partner);
    setDialogState(prev => ({ ...prev, edit: true }));
  }, []);

  const handleView = useCallback((partner: Partner) => {
    setSelectedPartner(partner);
    setDialogState(prev => ({ ...prev, view: true }));
  }, []);

  const handleDelete = useCallback((partner: Partner) => {
    setSelectedPartner(partner);
    setDialogState(prev => ({ ...prev, delete: true }));
  }, []);

  // const handleDeleteSelected = useCallback(() => {
  //   if (selectedRows.length > 0) {
  //     // Implement bulk delete logic here
  //     setSnackbar({
  //       open: true,
  //       message: `Đã xóa ${selectedRows.length} đối tác`,
  //       severity: 'success',
  //     });
  //     setSelectedRows([]);
  //   }
  // }, [selectedRows]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleCloseDialog = useCallback((dialogType: keyof typeof dialogState) => {
    setDialogState(prev => ({ ...prev, [dialogType]: false }));
    setSelectedPartner(null);
  }, []);

  const handleCreateSubmit = useCallback(async (data: CreatePartnerRequest) => {
    try {
      await createMutation.mutateAsync(data);
      setSnackbar({
        open: true,
        message: 'Tạo đối tác thành công',
        severity: 'success',
      });
      handleCloseDialog('create');
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tạo đối tác',
        severity: 'error',
      });
    }
  }, [createMutation, handleCloseDialog]);

  // Function to create the specific partner with provided data
  const handleCreateSpecificPartner = useCallback(async () => {
    const partnerData: CreatePartnerRequest = {
      name: "Đối tác 1",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      phone_number: "0123456789",
      type: "agent",
      level: 1
    };

    try {
      await createMutation.mutateAsync(partnerData);
      setSnackbar({
        open: true,
        message: 'Tạo đối tác "Đối tác 1" thành công',
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tạo đối tác "Đối tác 1"',
        severity: 'error',
      });
    }
  }, [createMutation]);

  const handleUpdateSubmit = useCallback(async (data: Record<string, unknown>) => {
    if (!selectedPartner) return;
    
    try {
      const updateData = formDataToUpdateDto(data);
      await updateMutation.mutateAsync({ id: selectedPartner.id, data: updateData });
      setSnackbar({
        open: true,
        message: 'Cập nhật đối tác thành công',
        severity: 'success',
      });
      handleCloseDialog('edit');
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật đối tác',
        severity: 'error',
      });
    }
  }, [selectedPartner, updateMutation, handleCloseDialog]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedPartner) return;
    
    try {
      await deleteMutation.mutateAsync(selectedPartner.id);
      setSnackbar({
        open: true,
        message: 'Xóa đối tác thành công',
        severity: 'success',
      });
      handleCloseDialog('delete');
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa đối tác',
        severity: 'error',
      });
    }
  }, [selectedPartner, deleteMutation, handleCloseDialog]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);


  const partners = partnersData?.data || [];

  return (
    <Box>
      <PartnerHeader
        onCreate={handleCreate}
        onRefresh={handleRefresh}
        selectedCount={0}
        onDeleteSelected={() => {}}
        onCreateSpecific={handleCreateSpecificPartner}
      />

      <Box sx={{ mt: 2 }}>
        <PartnerSearchAndFilter
          searchParams={searchParams} 
          onSearchChange={handleSearchChange}
          onReset={handleReset}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <PartnerDataGrid
          data={partners}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </Box>

      {/* Create Dialog */}
      <PartnerFormDialog
        open={dialogState.create}
        onClose={() => handleCloseDialog('create')}
        onSave={handleCreateSubmit}
        title="Tạo Đối tác Mới"
        loading={createMutation.isPending}
      />

      {/* Edit Dialog */}
      <CommonViewEditDialog
        open={dialogState.edit}
        onClose={() => handleCloseDialog('edit')}
        onSave={handleUpdateSubmit}
        title="Chỉnh sửa Đối tác"
        formFields={PARTNER_FORM_FIELDS}
        detailFields={PARTNER_DETAIL_FIELDS}
        item={partnerToFormData(selectedPartner)}
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
        title="Chi tiết Đối tác"
        fields={PARTNER_DETAIL_FIELDS}
        item={partnerToDisplayData(selectedPartner)}
      />

      {/* Delete Dialog */}
      <PartnerDeleteDialog
        open={dialogState.delete}
        onClose={() => handleCloseDialog('delete')}
        onConfirm={handleDeleteConfirm}
        partner={selectedPartner}
        loading={deleteMutation.isPending}
      />

      {/* Snackbar */}
      <PartnerSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default PartnerManagement;