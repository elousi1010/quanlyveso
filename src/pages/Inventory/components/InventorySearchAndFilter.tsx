import React from 'react';
import { CommonSearchAndFilter, type SearchAndFilterConfig } from '@/components/common';
import { inventorySearchFields } from '../constants';

interface InventorySearchAndFilterProps {
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onFilter: (filters: Record<string, string>) => void;
  onRefresh: () => void;
  loading: boolean;
}

export const InventorySearchAndFilter: React.FC<InventorySearchAndFilterProps> = ({
  onSearch,
  onSort,
  onFilter,
  onRefresh,
  loading = false,
}) => {
  return (
    <CommonSearchAndFilter
      config={inventorySearchFields as SearchAndFilterConfig}
      onSearch={onSearch as (query: string) => void}
      onSort={onSort as (sortBy: string) => void}
      onFilter={onFilter as (filters: Record<string, string>) => void}
      onRefresh={onRefresh as () => void}
      loading={loading}
    />
  );
};
