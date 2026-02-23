import React, { useState, useCallback, useMemo } from 'react';
import { theme as antdTheme, Alert } from 'antd';
import {
  CommonHeader,
  CommonSnackbar,
  CommonDeleteDialog,
  type DetailField,
  type FormField
} from '@/components/common';
import {
  InventoryDataGrid,
  InventorySearchAndFilter,
  InventoryFormDialog,
  InventoryBulkEditDialog,
} from './components';
import { InventoryViewEditDrawer } from './components/InventoryViewEditDrawer';
import { useInventories, useInventoryMutations } from './hooks';
import {
  inventoryDetailFields,
  inventoryFormFields
} from './constants/inventoryViewEditConfig';
import type {
  Inventory,
  CreateInventoryDto,
  UpdateInventoryDto,
  InventorySearchParams
} from './types';

export const InventoryManagement: React.FC = () => {
  const { token } = antdTheme.useToken();

  // State management
  const [searchParams, setSearchParams] = useState<InventorySearchParams>({});
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [selectedRows, setSelectedRows] = useState<Inventory[]>([]);

  /**
   * Universal state to control which view or dialog is currently active.
   * This approach is highly maintainable as it prevents "zombie dialogs" and 
   * ensures only one major UI flow is active at a time.
   */
  const [activeView, setActiveView] = useState<{
    type: 'create' | 'edit' | 'view' | 'delete' | 'bulkEdit' | 'viewEdit' | null;
    inventory: Inventory | null;
  }>({ type: null, inventory: null });

  // Snackbar state for user feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks for data fetching and mutations
  const { data: inventoriesData, isLoading, error, refetch } = useInventories(searchParams);
  const { createMutation, updateMutation, deleteMutation } = useInventoryMutations();

  // Memoized inventory list to prevent unnecessary computations during re-renders
  const inventories = useMemo(() => inventoriesData?.data || [], [inventoriesData]);

  // Event handlers for search, sort, and filter
  const handleSearchChange = useCallback((query: string) => {
    setSearchParams(prev => ({ ...prev, searchKey: query, page: 1 }));
  }, []);

  const handleSort = useCallback((sortBy: string) => {
    setSearchParams(prev => ({ ...prev, sortBy, page: 1 }));
  }, []);

  const handleFilterChange = useCallback((newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setSearchParams(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({});
    setFilters({});
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // View control handlers - centralized logic for opening and closing drawers/dialogs
  const openView = useCallback((type: typeof activeView['type'], inventory: Inventory | null = null) => {
    setActiveView({ type, inventory });
  }, []);

  const closeView = useCallback(() => {
    setActiveView({ type: null, inventory: null });
  }, []);

  const showSnackbar = useCallback((message: string, severity: typeof snackbar['severity'] = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  /**
   * Data Mutation Handlers
   */

  const handleCreateSubmit = useCallback(async (data: CreateInventoryDto) => {
    try {
      await createMutation.mutateAsync(data);
      showSnackbar('Tạo kho thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi tạo kho', 'error');
    }
  }, [createMutation, closeView, showSnackbar]);

  const handleUpdateSubmit = useCallback(async (data: Record<string, unknown>, selectedRow?: Inventory) => {
    const target = selectedRow || activeView.inventory;
    if (!target) return;

    try {
      // Ensure we merge the ID for the update request
      await updateMutation.mutateAsync({ ...data as UpdateInventoryDto, id: target.id });
      showSnackbar('Cập nhật kho thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi cập nhật kho', 'error');
    }
  }, [activeView.inventory, updateMutation, closeView, showSnackbar]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeView.inventory) return;

    try {
      await deleteMutation.mutateAsync(activeView.inventory.id);
      showSnackbar('Xóa kho thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi xóa kho', 'error');
    }
  }, [activeView.inventory, deleteMutation, closeView, showSnackbar]);

  const handleBulkEditSubmit = useCallback(async (updates: Array<{ id: string; data: UpdateInventoryDto }>) => {
    try {
      await Promise.all(updates.map(({ data }) => updateMutation.mutateAsync(data)));
      showSnackbar(`Cập nhật thành công ${updates.length} kho`);
      closeView();
      setSelectedRows([]);
    } catch {
      showSnackbar('Có lỗi xảy ra khi cập nhật kho', 'error');
    }
  }, [updateMutation, closeView, showSnackbar]);

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Lỗi"
          description={`Không thể tải danh sách kho: ${(error as Error).message}`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '0 0 24px 0', minHeight: '100%' }}>
      <CommonHeader
        title="Quản lý Kho"
        subtitle="Theo dõi và quản lý hàng tồn kho"
        onRefresh={handleRefresh}
        onCreate={() => openView('create')}
        onBulkEdit={() => openView('bulkEdit')}
        showBulkEdit={selectedRows.length > 0}
        loading={isLoading}
      />

      <div style={{ marginTop: '16px' }}>
        <InventorySearchAndFilter
          onSearch={handleSearchChange}
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
        <InventoryDataGrid
          data={inventories}
          loading={isLoading}
          onEdit={(inv) => openView('edit', inv)}
          onDelete={(inv) => openView('delete', inv)}
          onView={(inv) => openView('viewEdit', inv)}
          onSave={handleUpdateSubmit}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
        />
      </div>

      {/* Dialogs & Drawers */}
      <InventoryFormDialog
        open={activeView.type === 'create'}
        onClose={closeView}
        onSave={handleCreateSubmit}
        loading={createMutation.isPending}
      />

      <CommonDeleteDialog
        open={activeView.type === 'delete'}
        onClose={closeView}
        onConfirm={handleDeleteConfirm}
        title="Xóa Kho"
        itemName={activeView.inventory?.code}
        itemType="kho"
        isDeleting={deleteMutation.isPending}
      />

      <InventoryBulkEditDialog
        open={activeView.type === 'bulkEdit'}
        onClose={closeView}
        onSave={handleBulkEditSubmit}
        selectedInventories={selectedRows}
        loading={updateMutation.isPending}
      />

      <InventoryViewEditDrawer
        open={activeView.type === 'viewEdit'}
        onClose={closeView}
        inventory={activeView.inventory}
        onSave={handleUpdateSubmit}
        loading={updateMutation.isPending}
        mode="view"
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
