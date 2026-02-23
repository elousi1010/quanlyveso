import React, { useState, useCallback, useMemo } from 'react';
import { theme as antdTheme, Alert } from 'antd';
import {
  CommonFormDrawer,
  CommonHeader,
  CommonSnackbar,
  CommonDeleteDialog
} from '@/components/common';
import {
  TransactionDataGrid,
  TransactionSearchAndFilter,
} from './components';
import { useTransactions, useTransactionMutations } from './hooks';
import {
  transactionCreateFields,
  TRANSACTION_CONSTANTS
} from './constants';
import type {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionSearchParams
} from './types';

/**
 * TransactionManagement Component
 * 
 * Manages financial transactions with a unified UI pattern.
 */
export const TransactionManagement: React.FC = () => {
  const { token } = antdTheme.useToken();

  // State management
  const [searchParams, setSearchParams] = useState<TransactionSearchParams>({
    page: 1,
    limit: 5,
  });
  const [selectedRows, setSelectedRows] = useState<Transaction[]>([]);

  /**
   * Unified view state for dialogs and drawers.
   */
  const [activeView, setActiveView] = useState<{
    type: 'create' | 'edit' | 'view' | 'delete' | null;
    transaction: Transaction | null;
  }>({ type: null, transaction: null });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const { data: transactionsData, isLoading, error, refetch } = useTransactions(searchParams);
  const { createMutation, updateMutation, deleteMutation } = useTransactionMutations();

  // Data extraction
  // Data extraction
  const transactions = useMemo(() => {
    if (Array.isArray(transactionsData?.data)) return transactionsData.data;
    if (Array.isArray((transactionsData as any)?.data?.data)) return (transactionsData as any).data.data;
    return [];
  }, [transactionsData]);

  const total = useMemo(() => {
    if (typeof transactionsData?.total === 'number') return transactionsData.total;
    if (typeof (transactionsData as any)?.data?.total === 'number') return (transactionsData as any).data.total;
    return 0;
  }, [transactionsData]);

  // Event handlers
  const handleSearchChange = useCallback((params: TransactionSearchParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({ page: 1, limit: 5 });
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // View control handlers
  const openView = useCallback((type: typeof activeView['type'], transaction: Transaction | null = null) => {
    setActiveView({ type, transaction });
  }, []);

  const closeView = useCallback(() => {
    setActiveView({ type: null, transaction: null });
  }, []);

  const showSnackbar = useCallback((message: string, severity: typeof snackbar['severity'] = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  /**
   * Mutation Handlers
   */

  const handleCreateSubmit = useCallback(async (data: CreateTransactionDto) => {
    try {
      await createMutation.mutateAsync(data);
      showSnackbar('Tạo giao dịch thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi tạo giao dịch', 'error');
    }
  }, [createMutation, closeView, showSnackbar]);

  const handleUpdateSubmit = useCallback(async (data: Record<string, unknown>, selectedRow?: Transaction) => {
    const target = selectedRow || activeView.transaction;
    if (!target) return;

    try {
      await updateMutation.mutateAsync({
        id: target.id,
        data: data as unknown as UpdateTransactionDto
      });
      showSnackbar('Cập nhật giao dịch thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi cập nhật giao dịch', 'error');
    }
  }, [activeView.transaction, updateMutation, closeView, showSnackbar]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeView.transaction) return;

    try {
      await deleteMutation.mutateAsync(activeView.transaction.id);
      showSnackbar('Xóa giao dịch thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi xóa giao dịch', 'error');
    }
  }, [activeView.transaction, deleteMutation, closeView, showSnackbar]);

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Lỗi"
          description={`Không thể tải danh sách giao dịch: ${(error as Error).message}`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '0 0 24px 0', minHeight: '100%' }}>
      <CommonHeader
        title={TRANSACTION_CONSTANTS.MODULE_TITLE}
        subtitle="Quản lý và theo dõi các giao dịch trong hệ thống"
        onRefresh={handleRefresh}
        onCreate={() => openView('create')}
        loading={isLoading}
      />

      <div style={{ marginTop: '16px' }}>
        <TransactionSearchAndFilter
          searchParams={searchParams as Record<string, unknown>}
          onSearchChange={handleSearchChange}
          onReset={handleReset}
        />
      </div>

      <div style={{
        marginTop: '16px',
        background: token.colorBgContainer,
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <TransactionDataGrid
          data={transactions}
          loading={isLoading}
          onEdit={(t) => openView('edit', t)}
          onDelete={(t) => openView('delete', t)}
          onView={(t) => openView('view', t)}
          onSave={handleUpdateSubmit}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          page={searchParams.page ? searchParams.page - 1 : 0}
          rowsPerPage={searchParams.limit || 5}
          total={total}
          onPageChange={(p) => setSearchParams(prev => ({ ...prev, page: p + 1 }))}
          onRowsPerPageChange={(l) => setSearchParams(prev => ({ ...prev, limit: l, page: 1 }))}
        />
      </div>

      {/* Forms & Dialogs */}
      <CommonFormDrawer
        open={activeView.type === 'create'}
        onClose={closeView}
        onSave={(data) => handleCreateSubmit(data as unknown as CreateTransactionDto)}
        title="Tạo Giao dịch Mới"
        fields={transactionCreateFields}
        submitText="Tạo"
        loading={createMutation.isPending}
        width={500}
      />

      <CommonDeleteDialog
        open={activeView.type === 'delete'}
        onClose={closeView}
        onConfirm={handleDeleteConfirm}
        title="Xóa Giao Dịch"
        itemName={activeView.transaction?.id}
        itemType="giao dịch"
        isDeleting={deleteMutation.isPending}
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

export default TransactionManagement;
