import React from 'react';
import { CommonSearchAndFilter, type SearchAndFilterConfig } from '@/components/common';
import type { PermissionSearchParams } from '../types';

interface PermissionSearchAndFilterProps {
  searchParams: PermissionSearchParams;
  onSearchChange: (query: string) => void;
  config: SearchAndFilterConfig;
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onFilter: (filters: Record<string, string>) => void;
  loading?: boolean;
}

export const PermissionSearchAndFilter: React.FC<PermissionSearchAndFilterProps> = ({
  searchParams,
  config,
  onSearch,
  onSort,
  onFilter,
  loading,
}) => {
  return (
    <CommonSearchAndFilter
      config={config}
      onSearch={onSearch}
      onSort={onSort}
      onFilter={onFilter}
      loading={loading}
    />
  );
};
