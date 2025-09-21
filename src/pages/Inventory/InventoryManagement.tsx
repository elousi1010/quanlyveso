import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { 
  CommonFormDialog, 
  CommonViewEditDialog, 
  CommonDetailDialog 
} from '@/components/common';
import {
  InventoryHeader,
  InventoryDataGrid,
  InventorySearchAndFilter,
  InventoryDeleteDialog,
  InventorySnackbar,
} from './components';
import { useInventories, useInventoryMutations } from './hooks';
import { 
  inventoryCreateFields, 
  inventoryUpdateFields, 
  inventoryDetailFields 
} from './constants';
import type { 
  Inventory, 
  CreateInventoryDto, 
  UpdateInventoryDto, 
  InventorySearchParams 
} from './types';

export const InventoryManagement: React.FC = () => {
  // State management
  const [searchParams, setSearchParams] = useState<InventorySearchParams>({
    page: 1,
    limit: 10,
  });
  const [selectedRows, setSelectedRows] = useState<Inventory[]>([]);
  const [dialogState, setDialogState] = useState({
    create: false,
    edit: false,
    view: false,
    delete: false,
  });
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const { data: inventoriesData, isLoading, refetch } = useInventories(searchParams);
  const { createMutation, updateMutation, deleteMutation } = useInventoryMutations();

  // Event handlers
  const handleSearchChange = useCallback((params: InventorySearchParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({ page: 1, limit: 10 });
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedInventory(null);
    setDialogState(prev => ({ ...prev, create: true }));
  }, []);

  const handleEdit = useCallback((inventory: Inventory) => {
    setSelectedInventory(inventory);
    setDialogState(prev => ({ ...prev, edit: true }));
  }, []);

  const handleView = useCallback((inventory: Inventory) => {
    setSelectedInventory(inventory);
    setDialogState(prev => ({ ...prev, view: true }));
  }, []);

  const handleDelete = useCallback((inventory: Inventory) => {
    setSelectedInventory(inventory);
    setDialogState(prev => ({ ...prev, delete: true }));
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selectedRows.length > 0) {
      // Implement bulk delete logic here
      setSnackbar({
        open: true,
        message: `Đã xóa ${selectedRows.length} kho`,
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
    setSelectedInventory(null);
  }, []);

  const handleCreateSubmit = useCallback(async (data: CreateInventoryDto) => {
    try {
      await createMutation.mutateAsync(data);
      setSnackbar({
        open: true,
        message: 'Tạo kho thành công',
        severity: 'success',
      });
      handleCloseDialog('create');
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tạo kho',
        severity: 'error',
      });
    }
  }, [createMutation, handleCloseDialog]);

  const handleUpdateSubmit = useCallback(async (data: UpdateInventoryDto) => {
    if (!selectedInventory) return;
    
    try {
      await updateMutation.mutateAsync({ id: selectedInventory.id, data });
      setSnackbar({
        open: true,
        message: 'Cập nhật kho thành công',
        severity: 'success',
      });
      handleCloseDialog('edit');
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật kho',
        severity: 'error',
      });
    }
  }, [selectedInventory, updateMutation, handleCloseDialog]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedInventory) return;
    
    try {
      await deleteMutation.mutateAsync(selectedInventory.id);
      setSnackbar({
        open: true,
        message: 'Xóa kho thành công',
        severity: 'success',
      });
      handleCloseDialog('delete');
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa kho',
        severity: 'error',
      });
    }
  }, [selectedInventory, deleteMutation, handleCloseDialog]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const inventories = React.useMemo(() => inventoriesData?.data || [], [inventoriesData?.data]);

  return (
    <Box sx={{ p: 2 }}>
      <InventoryHeader
        onCreate={handleCreate}
        onRefresh={handleRefresh}
        selectedCount={selectedRows.length}
        onDeleteSelected={handleDeleteSelected}
      />

      <Box sx={{ mt: 2 }}>
        <InventorySearchAndFilter
          searchParams={searchParams}
          onSearchChange={handleSearchChange}
          onReset={handleReset}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <InventoryDataGrid
          data={inventories}
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
        title="Tạo Kho Mới"
        fields={inventoryCreateFields}
        submitButtonText="Tạo"
        isSubmitting={createMutation.isPending}
      />

      {/* Edit Dialog */}
      <CommonViewEditDialog
        open={dialogState.edit}
        onClose={() => handleCloseDialog('edit')}
        onSave={handleUpdateSubmit}
        title="Chỉnh sửa Kho"
        item={selectedInventory}
        formFields={inventoryUpdateFields}
        detailFields={inventoryDetailFields}
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
        title="Chi tiết Kho"
        fields={inventoryDetailFields}
        item={selectedInventory}
      />

      {/* Delete Dialog */}
      <InventoryDeleteDialog
        open={dialogState.delete}
        onClose={() => handleCloseDialog('delete')}
        onConfirm={handleDeleteConfirm}
        inventory={selectedInventory}
        loading={deleteMutation.isPending}
      />

      {/* Snackbar */}
      <InventorySnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};
