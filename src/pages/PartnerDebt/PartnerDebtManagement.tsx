import React, { useState, useCallback, useMemo } from 'react';
import { Box, Paper } from '@mui/material';
import { CommonFormDrawer, CommonViewEditDrawer, type DetailField, type FormField } from '@/components/common';
import {
  PartnerDebtDataGrid,
  PartnerDebtHeader,
  PartnerDebtSearchAndFilter,
  PartnerDebtSnackbar,
  PartnerDebtDeleteDialog,
} from './components';
import { usePartnerDebts, usePartnerDebtMutations } from './hooks';
import { usePartners } from '../Partners/hooks/usePartners';
import {
  partnerDebtViewEditConfig,
} from './constants';
import type {
  PartnerDebtSearchParams,
  PartnerDebtFormData,
} from './types';
import { convertToTableRow, convertToFormData, convertToDetailData } from './utils';

const PartnerDebtManagement: React.FC = () => {
  // State management
  const [searchParams, setSearchParams] = useState<PartnerDebtSearchParams>({
    page: 1,
    limit: 10,
  });
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('');
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const { data: partnerDebtsData, isLoading, refetch } = usePartnerDebts(searchParams);
  const { data: partnersData } = usePartners({ page: 1, limit: 1000 }); // Fetch all partners
  const {
    createMutation,
    updateMutation,
    deleteMutation,
  } = usePartnerDebtMutations();

  // Data processing
  const partnerDebts = useMemo(() => {
    if (!partnerDebtsData?.data?.data) return [];
    return Array.isArray(partnerDebtsData.data.data) ? partnerDebtsData.data.data : [];
  }, [partnerDebtsData]);
  
//   const tableData: PartnerDebtListResponse[] = useMemo(() => {
//     return partnerDebts.map(convertToTableRow);
//   }, [partnerDebts]);

  // Event handlers
  const handleSearchChange = useCallback((params: PartnerDebtSearchParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({ page: 1, limit: 10 });
  }, []);

  const handleCreate = useCallback(() => {
    setCreateDialogOpen(true);
  }, []);

  const handleEdit = useCallback((id: string) => {
    setSelectedId(id);
    setEditDialogOpen(true);
  }, []);

  const handleView = useCallback((id: string) => {
    setSelectedId(id);
    setViewDrawerOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

//   const handleSort = useCallback((field: string, order: 'asc' | 'desc') => {
//     setSearchParams(prev => ({ ...prev, sortBy: field, sortOrder: order }));
//   }, []);


  // Dialog handlers
  const handleCreateSubmit = useCallback(async (data: Record<string, unknown>) => {
    try {
      const formData = {
        ...data,
        amount: Number(data.amount), // Convert to number
      } as unknown as PartnerDebtFormData;
      
      await createMutation.mutateAsync(formData);
      setCreateDialogOpen(false);
      refetch(); // Fetch lại danh sách
      setSnackbar({
        open: true,
        message: 'Tạo công nợ đối tác thành công',
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tạo công nợ đối tác',
        severity: 'error',
      });
    }
  }, [createMutation, refetch]);

  const handleEditSubmit = useCallback(async (data: Record<string, unknown>) => {
    try {
      const formData = {
        ...data,
        amount: Number(data.amount), // Convert to number
      } as unknown as PartnerDebtFormData;
      
      await updateMutation.mutateAsync({
        id: selectedId,
        data: formData,
      });
      setEditDialogOpen(false);
      refetch(); // Fetch lại danh sách
      setSnackbar({
        open: true,
        message: 'Cập nhật công nợ đối tác thành công',
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật công nợ đối tác',
        severity: 'error',
      });
    }
  }, [updateMutation, selectedId, refetch]);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await deleteMutation.mutateAsync(selectedId);
      setDeleteDialogOpen(false);
      refetch(); // Fetch lại danh sách
      setSnackbar({
        open: true,
        message: 'Xóa công nợ đối tác thành công',
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa công nợ đối tác',
        severity: 'error',
      });
    }
  }, [deleteMutation, selectedId, refetch]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Get selected item for editing/viewing
  const selectedItem = partnerDebts.find(item => item.id === selectedId);
  const selectedFormData = selectedItem ? convertToFormData(selectedItem) : undefined;
  const selectedDetailData = selectedItem ? convertToDetailData(selectedItem) as unknown as Record<string, unknown> : undefined;

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <PartnerDebtHeader
          onCreate={handleCreate}
          onRefresh={handleRefresh}
          selectedCount={0}
        />
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <PartnerDebtSearchAndFilter
          searchParams={searchParams}
          onSearchChange={handleSearchChange}
          onReset={handleReset}
        />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <PartnerDebtDataGrid
          data={partnerDebts.map(convertToTableRow)}
          loading={isLoading}
          error={null}
          onRefresh={handleRefresh}
          onView={(item) => handleView(item.id)}
          onEdit={(item) => handleEdit(item.id)}
          onDelete={(item) => handleDelete(item.id)}
        />
      </Paper>

      {/* Create Drawer */}
      <CommonFormDrawer
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreateSubmit}
        fields={[
          {
            key: 'partner_id',
            label: 'Đối tác',
            type: 'select',
            required: true,
            options: partnersData?.data?.data?.data?.map(partner => ({
              value: partner.id,
              label: partner.name
            })) || [],
          },
          {
            key: 'payment_method',
            label: 'Phương thức thanh toán',
            type: 'select',
            required: true,
            options: [
              { value: 'cash', label: 'Tiền mặt' },
              { value: 'bank_transfer', label: 'Chuyển khoản' },
              { value: 'credit_card', label: 'Thẻ tín dụng' },
              { value: 'other', label: 'Khác' },
            ],
          },
          {
            key: 'payment_type',
            label: 'Loại giao dịch',
            type: 'select',
            required: true,
            options: [
              { value: 'income', label: 'Thu nhập' },
              { value: 'expense', label: 'Chi phí' },
            ],
          },
          {
            key: 'amount',
            label: 'Số tiền',
            type: 'number',
            required: true,
            placeholder: 'Nhập số tiền',
          },
          {
            key: 'description',
            label: 'Mô tả',
            type: 'textarea',
            required: false,
            placeholder: 'Nhập mô tả (tùy chọn)',
          },
        ]}
        title="Thêm Công Nợ Đối Tác"
        loading={createMutation.isPending}
        width={500}
      />

      {/* Edit Drawer */}
      <CommonFormDrawer
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleEditSubmit}
        fields={[
          {
            key: 'partner_id',
            label: 'Đối tác',
            type: 'select',
            required: true,
            options: partnersData?.data?.data?.data?.map(partner => ({
              value: partner.id,
              label: partner.name
            })) || [],
          },
          {
            key: 'payment_method',
            label: 'Phương thức thanh toán',
            type: 'select',
            required: true,
            options: [
              { value: 'cash', label: 'Tiền mặt' },
              { value: 'bank_transfer', label: 'Chuyển khoản' },
              { value: 'credit_card', label: 'Thẻ tín dụng' },
              { value: 'other', label: 'Khác' },
            ],
          },
          {
            key: 'payment_type',
            label: 'Loại giao dịch',
            type: 'select',
            required: true,
            options: [
              { value: 'income', label: 'Thu nhập' },
              { value: 'expense', label: 'Chi phí' },
            ],
          },
          {
            key: 'amount',
            label: 'Số tiền',
            type: 'number',
            required: true,
            placeholder: 'Nhập số tiền',
          },
          {
            key: 'description',
            label: 'Mô tả',
            type: 'textarea',
            required: false,
            placeholder: 'Nhập mô tả (tùy chọn)',
          },
        ]}
        title="Chỉnh Sửa Công Nợ Đối Tác"
        initialData={selectedFormData as unknown as Record<string, unknown>}
        loading={updateMutation.isPending}
        width={500}
      />

      {/* View/Edit Drawer */}
      <CommonViewEditDrawer
        open={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        onSave={handleEditSubmit}
        viewFields={partnerDebtViewEditConfig.fields as DetailField[]}
        editFields={partnerDebtViewEditConfig.fields as FormField[]}
        data={selectedDetailData || {}}
        title="Chi Tiết Công Nợ Đối Tác"
      />

      {/* Delete Dialog */}
      <PartnerDebtDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedItem?.partner?.name || 'công nợ đối tác'}
        loading={deleteMutation.isPending}
      />

      {/* Snackbar */}
      <PartnerDebtSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
};

export default PartnerDebtManagement;
