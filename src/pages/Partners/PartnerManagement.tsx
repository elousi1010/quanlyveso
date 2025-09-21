import React, { useState, useCallback } from 'react';
import { Box, Paper } from '@mui/material';
import { usePartners, usePartner, useCreatePartner, useUpdatePartner, useDeletePartner } from './hooks';
import {
  CommonHeader,
  CommonSearchAndFilter,
  CommonDataTable,
  CommonFormDialog,
  CommonViewEditDialog,
  CommonDeleteDialog,
  CommonSnackbar,
} from '../../components/common';
import type { Partner, CreatePartnerRequest } from './types';
import { PARTNER_TABLE_COLUMNS, PARTNER_TABLE_ACTIONS } from './constants/partnerTableConfig';
import { PARTNER_FORM_FIELDS, PARTNER_DETAIL_FIELDS } from './constants/partnerDialogConfig';
import { PARTNER_SEARCH_FILTER_CONFIG } from './constants/partnerSearchConfig';

const PartnerManagement: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewEditDialogOpen, setViewEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Search and sort state - tạm thời disable
  // const [searchKey] = useState('');

  // Form state
  const [formData, setFormData] = useState<CreatePartnerRequest>({
    name: '',
    address: '',
    phone_number: '',
    type: 'agent',
    level: 1,
  });

  // API hooks - tạm thời gọi không cần filter
  const { data: partnersData, isLoading, error, refetch } = usePartners();
  console.log('Partners data:', partnersData?.data);

  const createPartnerMutation = useCreatePartner();
  const updatePartnerMutation = useUpdatePartner();
  const deletePartnerMutation = useDeletePartner();
  
  // Hook for getting partner detail - chỉ gọi khi view/edit dialog mở
  const { data: partnerDetail } = usePartner(
    viewEditDialogOpen && selectedPartner?.id ? selectedPartner.id : ''
  );

  // Handlers - tạm thời disable search và sort
  const handleSearch = useCallback(() => {
    // Tạm thời chỉ refetch data
    refetch();
  }, [refetch]);


  const handleSort = useCallback(() => {
    // Tạm thời chỉ refetch data
    refetch();
  }, [refetch]);

  const handleCreate = useCallback(() => {
    setFormData({
      name: '',
      address: '',
      phone_number: '',
      type: 'agent',
      level: 1,
    });
    setCreateDialogOpen(true);
  }, []);

  const handleCreatePartner = useCallback((data: Record<string, unknown>) => {
    const createData = data as unknown as CreatePartnerRequest;
    createPartnerMutation.mutate(createData, {
      onSuccess: () => {
        setCreateDialogOpen(false);
        setFormData({
          name: '',
          address: '',
          phone_number: '',
          type: 'agent',
          level: 1,
        });
        setSnackbar({
          open: true,
          message: 'Tạo đối tác thành công',
          severity: 'success',
        });
      },
      onError: (error) => {
        console.error('Create partner error:', error);
        setSnackbar({
          open: true,
          message: 'Tạo đối tác thất bại',
          severity: 'error',
        });
      },
    });
  }, [createPartnerMutation]);

  const handleViewEdit = useCallback((partner: Partner) => {
    setSelectedPartner(partner);
    setViewEditDialogOpen(true);
  }, []);

  const handleDelete = useCallback((partner: Partner) => {
    setSelectedPartner(partner);
    setDeleteDialogOpen(true);
  }, []);

  const handleUpdatePartner = useCallback((data: Record<string, unknown>) => {
    if (!selectedPartner) return;

    const updateData = data as unknown as CreatePartnerRequest;
    updatePartnerMutation.mutate(
      { id: selectedPartner.id, data: updateData },
      {
        onSuccess: () => {
          setViewEditDialogOpen(false);
          setSelectedPartner(null);
          setSnackbar({
            open: true,
            message: 'Cập nhật đối tác thành công',
            severity: 'success',
          });
        },
        onError: (error) => {
          console.error('Update partner error:', error);
          setSnackbar({
            open: true,
            message: 'Cập nhật đối tác thất bại',
            severity: 'error',
          });
        },
      }
    );
  }, [selectedPartner, updatePartnerMutation]);

  const handleConfirmDelete = () => {
    if (!selectedPartner) return;

    deletePartnerMutation.mutate(selectedPartner.id, {
      onSuccess: (response) => {
        console.log('Delete partner success:', response);
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Xóa đối tác thành công',
          severity: 'success',
        });
        // Không cần refetch() vì invalidateQueries đã tự động refetch
      },
      onError: (error) => {
        console.error('Delete partner error:', error);
        setSnackbar({
          open: true,
          message: 'Xóa đối tác thất bại',
          severity: 'error',
        });
      },
    }    );
  };


  // Table actions with handlers
  const tableActions = PARTNER_TABLE_ACTIONS.map(action => ({
    ...action,
    onClick: (partner: Partner) => {
      switch (action.key) {
        case 'view':
        case 'edit':
          handleViewEdit(partner);
          break;
        case 'delete':
          handleDelete(partner);
          break;
      }
    },
  }));

  return (
    <Box sx={{ p: 3 }}>
      <CommonHeader
        title="Quản lý đối tác"
        subtitle="Quản lý thông tin và cấp độ của các đối tác trong hệ thống"
        onRefresh={refetch}
        onCreate={handleCreate}
        createButtonText="Thêm đối tác"
        loading={isLoading}
      />

      <CommonSearchAndFilter
        config={PARTNER_SEARCH_FILTER_CONFIG}
        onSearch={handleSearch}
        onSort={handleSort}
        onFilter={(filters) => console.log('Filter:', filters)}
        onRefresh={refetch}
        loading={isLoading}
      />

      <Paper sx={{ p: 3 }}>
        <CommonDataTable
          data={(partnersData as { data?: { data?: Partner[] } })?.data?.data || partnersData?.data}
          columns={PARTNER_TABLE_COLUMNS}
          actions={tableActions}
          isLoading={isLoading}
          error={error}
          onRefresh={refetch}
          emptyMessage="Không có đối tác"
          emptyDescription="Chưa có đối tác nào trong hệ thống"
        />
      </Paper>

      {/* Create Partner Dialog */}
      <CommonFormDialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          setFormData({
            name: '',
            address: '',
            phone_number: '',
            type: 'agent',
            level: 1,
          });
        }}
        onSubmit={handleCreatePartner}
        title="Thêm đối tác mới"
        fields={PARTNER_FORM_FIELDS}
        initialData={formData as unknown as Record<string, unknown>}
        isSubmitting={createPartnerMutation.isPending}
        submitButtonText="Tạo đối tác"
      />

      {/* View/Edit Partner Dialog */}
      <CommonViewEditDialog
        open={viewEditDialogOpen}
        onClose={() => {
          setViewEditDialogOpen(false);
          setSelectedPartner(null);
        }}
        onSave={handleUpdatePartner}
        title="Thông tin đối tác"
        item={(partnerDetail?.data || selectedPartner) as unknown as Record<string, unknown>}
        formFields={PARTNER_FORM_FIELDS}
        detailFields={PARTNER_DETAIL_FIELDS as unknown as import('../../components/common').DetailField[]}
        isSubmitting={updatePartnerMutation.isPending}
        avatar={{
          text: selectedPartner?.name?.charAt(0)?.toUpperCase() || 'P',
          color: 'primary.main',
        }}
      />

      {/* Delete Confirmation Dialog */}
      <CommonDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa đối tác"
        itemName={selectedPartner?.name}
        itemType="đối tác"
        isDeleting={deletePartnerMutation.isPending}
      />

      {/* Snackbar */}
      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default PartnerManagement;