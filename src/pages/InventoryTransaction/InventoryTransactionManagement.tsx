import React, { useState, useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import {
  InventoryTransactionHeader,
  InventoryTransactionDataGrid,
  InventoryTransactionSearchAndFilter,
} from './components';
import { useInventoryTransactions } from './hooks';
import type { 
  InventoryTransactionItem, 
  InventoryTransactionSearchParams,
  InventoryTransactionType
} from './types';

interface InventoryTransactionManagementProps {
  type: InventoryTransactionType;
}

export const InventoryTransactionManagement: React.FC<InventoryTransactionManagementProps> = ({ type }) => {
  // State management
  const [searchParams, setSearchParams] = useState({});
  const [filters, setFilters] = useState<Record<string, unknown>>({});
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

  const items = response?.data?.data || [];
  const total = response?.data?.total || 0;

  // Handlers
  const handleSearchChange = useCallback((params: InventoryTransactionSearchParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({
      page: 1,
      limit: 10,
      type, // Keep the current type
    });
  }, [type]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleView = useCallback((item: InventoryTransactionItem) => {
    // View functionality - could be implemented later

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
          onFilterChange={handleFilterChange}
          filters={filters}

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <InventoryTransactionDataGrid
          data={items as InventoryTransactionItem[]}
          total={total}
          loading={isLoading}
          onEdit={() => {}} // Empty function since we don't want edit
          onDelete={() => {}} // Empty function since we don't want delete
          onView={handleView}
          selectedRows={[]}
          onSelectionChange={() => {}} // Empty function since we don't want selection
        />
      </Box>
    </Box>
  );
};
