import React, { useState } from 'react';
import { CommonSearchAndFilter, type SearchAndFilterConfig } from '@/components/common';
import { inventorySearchFields } from '../constants';

interface InventorySearchAndFilterProps {
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onFilter: (filters: Record<string, string>) => void;
  onRefresh: () => void;
  loading: boolean;
  onFilterChange?: (filters: Record<string, unknown>) => void;
  filters?: Record<string, unknown>;
}

export const InventorySearchAndFilter: React.FC<InventorySearchAndFilterProps> = ({
  onSearch,
  onSort,
  onFilter,
  onRefresh,
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
    onFilter(newFilters as Record<string, string>);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
    onFilter({});
  };

  return (
    <CommonSearchAndFilter
      config={inventorySearchFields as SearchAndFilterConfig}
      onSearch={onSearch}
      onSort={onSort}
      onFilter={handleFilterChange}
      onClearFilters={handleClearFilters}
      filters={localFilters}
      loading={loading}
    />
  );
};