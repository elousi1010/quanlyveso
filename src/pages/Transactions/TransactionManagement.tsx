import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { 
  CommonFormDrawer
} from '@/components/common';
import {
  TransactionHeader,
  TransactionDataGrid,
  TransactionSearchAndFilter,
  TransactionDeleteDialog,
  TransactionSnackbar,
} from './components';
import { useTransactions, useTransactionMutations } from './hooks';
import { 
  transactionCreateFields
} from './constants';
import type { 
  Transaction, 
  CreateTransactionDto, 
  UpdateTransactionDto, 
  TransactionSearchParams 
} from './types';

export const TransactionManagement: React.FC = () => {
  // State management
  const [searchParams, setSearchParams] = useState<TransactionSearchParams>({
    page: 1,
    limit: 5,
  });
  const [selectedRows, setSelectedRows] = useState<Transaction[]>([]);
  const [dialogState, setDialogState] = useState({
    create: false,
    edit: false,
    view: false,
    delete: false,
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const { data: transactionsData, isLoading, refetch } = useTransactions(searchParams);
  const { createMutation, updateMutation, deleteMutation } = useTransactionMutations();

  // Event handlers
  const handleSearchChange = useCallback((params: TransactionSearchParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({ page: 1, limit: 5 });
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedTransaction(null);
    setDialogState(prev => ({ ...prev, create: true }));
  }, []);

  const handleEdit = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDialogState(prev => ({ ...prev, edit: true }));
  }, []);

  const handleView = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDialogState(prev => ({ ...prev, view: true }));
  }, []);

  const handleDelete = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDialogState(prev => ({ ...prev, delete: true }));
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selectedRows.length > 0) {
      // Implement bulk delete logic here
      setSnackbar({
        open: true,
        message: `Đã xóa ${selectedRows.length} giao dịch`,
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
    setSelectedTransaction(null);
  }, []);

  const handleCreateSubmit = useCallback(async (data: CreateTransactionDto) => {
    try {
      await createMutation.mutateAsync(data);
      setSnackbar({
        open: true,
        message: 'Tạo giao dịch thành công',
        severity: 'success',
      });
      handleCloseDialog('create');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tạo giao dịch',
        severity: 'error',
      });
    }
  }, [createMutation, handleCloseDialog]);

  const handleUpdateSubmit = useCallback(async (data: Record<string, unknown>, selectedRow?: Transaction) => {
    const transactionToUpdate = selectedRow || selectedTransaction;
    if (!transactionToUpdate) return;
    
    try {
      await updateMutation.mutateAsync({ id: transactionToUpdate.id, data: data as unknown as UpdateTransactionDto });
      setSnackbar({
        open: true,
        message: 'Cập nhật giao dịch thành công',
        severity: 'success',
      });
      handleCloseDialog('edit');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật giao dịch',
        severity: 'error',
      });
    }
  }, [selectedTransaction, updateMutation, handleCloseDialog]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedTransaction) return;
    
    try {
      await deleteMutation.mutateAsync(selectedTransaction.id);
      setSnackbar({
        open: true,
        message: 'Xóa giao dịch thành công',
        severity: 'success',
      });
      handleCloseDialog('delete');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa giao dịch',
        severity: 'error',
      });
    }
  }, [selectedTransaction, deleteMutation, handleCloseDialog]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const transactions = transactionsData?.data || [];

  return (
    <Box sx={{ p: 2 }}>
      <TransactionHeader
        onCreate={handleCreate}
        onRefresh={handleRefresh}
      />

      <Box sx={{ mt: 2 }}>
        <TransactionSearchAndFilter
          searchParams={searchParams as Record<string, unknown>}
          onSearchChange={handleSearchChange}
          onReset={handleReset}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <TransactionDataGrid
          data={transactions}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onSave={handleUpdateSubmit}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
        />
      </Box>

      {/* Create Drawer */}
      <CommonFormDrawer
        open={dialogState.create}
        onClose={() => handleCloseDialog('create')}
        onSave={(data) => handleCreateSubmit(data as unknown as CreateTransactionDto)}
        title="Tạo Giao dịch Mới"
        fields={transactionCreateFields}
        submitText="Tạo"
        loading={createMutation.isPending}
        width={500}
      />

      {/* Delete Dialog */}
      <TransactionDeleteDialog
        open={dialogState.delete}
        onClose={() => handleCloseDialog('delete')}
        onConfirm={handleDeleteConfirm}
        transaction={selectedTransaction}
        loading={deleteMutation.isPending}
      />

      {/* Snackbar */}
      <TransactionSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};
