import React, { useState, useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import {
  InventoryTransactionHeader,
  InventoryTransactionDataGrid,
  InventoryTransactionSearchAndFilter,
  InventoryTransactionSnackbar,
} from './components';
import { useInventoryTransactions, useInventoryTransactionMutations } from './hooks';
import type { 
  InventoryTransactionItem, 
  InventoryTransactionSearchParams,
  InventoryTransactionType,
  UpdateInventoryTransactionItemDto
} from './types';

interface InventoryTransactionManagementProps {
  type: InventoryTransactionType;
}

export const InventoryTransactionManagement: React.FC<InventoryTransactionManagementProps> = ({ type }) => {
  // State management
  const [searchParams, setSearchParams] = useState({});
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [dialogState, setDialogState] = useState({
    edit: false,
    view: false,
    delete: false,
  });
  const [selectedItem, setSelectedItem] = useState<InventoryTransactionItem | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  
  // Update searchParams when type prop changes
  useEffect(() => {
    setSearchParams(prev => ({
      ...prev,
      type,
      page: 1, // Reset to first page when type changes
    }));
  }, [type]);

  // Hooks
  const { data: response, isLoading, refetch } = useInventoryTransactions(searchParams);
  const { updateMutation, deleteMutation } = useInventoryTransactionMutations();

  const items = response?.data?.data || [];
  const total = response?.data?.total || 0;

  // Handlers
  const handleSearchChange = useCallback((params: InventoryTransactionSearchParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({
      page: 1,
      limit: 5,
      type, // Keep the current type
    });
  }, [type]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleFilterChange = useCallback((newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setSearchParams(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handleEdit = useCallback((item: InventoryTransactionItem) => {
    setSelectedItem(item);
    setDialogState(prev => ({ ...prev, edit: true }));
  }, []);

  const handleView = useCallback((item: InventoryTransactionItem) => {
    setSelectedItem(item);
    setDialogState(prev => ({ ...prev, view: true }));
  }, []);

  const handleDelete = useCallback((item: InventoryTransactionItem) => {
    setSelectedItem(item);
    setDialogState(prev => ({ ...prev, delete: true }));
  }, []);

  const handleCloseDialog = useCallback((dialogType: keyof typeof dialogState) => {
    setDialogState(prev => ({ ...prev, [dialogType]: false }));
    setSelectedItem(null);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const title = type === 'import' ? 'Giao Dịch Nhập Kho' : 'Giao Dịch Xuất Kho';

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <InventoryTransactionHeader
        title={title}
        onCreate={() => {}} // Empty function since we don't want create
        onRefresh={handleRefresh}
      />
      
      <InventoryTransactionSearchAndFilter
        searchParams={searchParams}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        filters={filters}
        onReset={handleReset}
      />

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <InventoryTransactionDataGrid
          data={items as InventoryTransactionItem[]}
          total={total}
          loading={isLoading}
        />
      </Box>

      {/* Snackbar */}
      <InventoryTransactionSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};
