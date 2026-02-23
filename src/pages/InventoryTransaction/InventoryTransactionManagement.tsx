import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { theme as antdTheme } from 'antd';
import {
  CommonHeader,
  CommonSnackbar,
} from '@/components/common';
import {
  InventoryTransactionDataGrid,
  InventoryTransactionSearchAndFilter,
} from './components';
import { useInventoryTransactions } from './hooks';
import type {
  InventoryTransactionItem,
  InventoryTransactionSearchParams,
  InventoryTransactionType,
} from './types';

interface InventoryTransactionManagementProps {
  type: InventoryTransactionType;
}

/**
 * InventoryTransactionManagement Component
 * 
 * Handles management of inventory imports/exports with a unified UI pattern.
 */
export const InventoryTransactionManagement: React.FC<InventoryTransactionManagementProps> = ({ type }) => {
  const { token } = antdTheme.useToken();

  // State management
  const [searchParams, setSearchParams] = useState<Record<string, unknown>>({});
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  /**
   * Update searchParams when type prop changes.
   * This is important for multi-tab or dynamic routing.
   */
  useEffect(() => {
    setSearchParams(prev => ({
      ...prev,
      type,
      page: 1, // Reset to first page when type changes
    }));
  }, [type]);

  // Hooks
  const { data: response, isLoading, refetch } = useInventoryTransactions(searchParams);

  const items = useMemo(() => response?.data?.data || [], [response]);
  const total = response?.data?.total || 0;

  // Event handlers
  const handleSearchChange = useCallback((params: InventoryTransactionSearchParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({
      page: 1,
      limit: 5,
      type, // Keep the current type
    });
    setFilters({});
  }, [type]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleFilterChange = useCallback((newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setSearchParams(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const title = type === 'import' ? 'Giao Dịch Nhập Kho' : 'Giao Dịch Xuất Kho';

  return (
    <div style={{ padding: '0 0 24px 0', minHeight: '100%' }}>
      <CommonHeader
        title={title}
        subtitle={`Quản lý và xem lịch sử các giao dịch ${type === 'import' ? 'nhập' : 'xuất'} kho`}
        onRefresh={handleRefresh}
        loading={isLoading}
      />

      <div style={{ marginTop: '16px' }}>
        <InventoryTransactionSearchAndFilter
          searchParams={searchParams}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          filters={filters}
          onReset={handleReset}
        />
      </div>

      <div style={{
        marginTop: '16px',
        background: token.colorBgContainer,
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <InventoryTransactionDataGrid
          data={items as InventoryTransactionItem[]}
          total={total}
          loading={isLoading}
        />
      </div>

      {/* Snackbar */}
      <CommonSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </div>
  );
};
