import React, { useState } from 'react';
import { CommonSearchAndFilter, type SearchAndFilterConfig } from '@/components/common';
import { inventoryTransactionSearchFields } from '../constants';
import type { InventoryTransactionSearchParams } from '../types';

interface InventoryTransactionSearchAndFilterProps {
  searchParams: InventoryTransactionSearchParams;
  onSearchChange: (params: InventoryTransactionSearchParams) => void;
  onReset: () => void;
  loading?: boolean;
  onFilterChange?: (filters: Record<string, unknown>) => void;
  filters?: Record<string, unknown>;
}

export const InventoryTransactionSearchAndFilter: React.FC<InventoryTransactionSearchAndFilterProps> = ({
  searchParams,
  onSearchChange,
  onReset,
  loading = false,
  onFilterChange,
  filters = {},
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    setLocalFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
    onSearchChange({ ...searchParams, ...newFilters });
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
    onReset();
  };

  return (
    <CommonSearchAndFilter
      config={inventoryTransactionSearchFields as SearchAndFilterConfig}
      onSearch={(query: string) => onSearchChange({ ...searchParams, searchKey: query })}
      onSort={(sortBy: string) => onSearchChange({ ...searchParams, sortBy })}
      onFilter={handleFilterChange}
      onClearFilters={handleClearFilters}
      filters={localFilters}
      loading={loading}
    />
  );
};