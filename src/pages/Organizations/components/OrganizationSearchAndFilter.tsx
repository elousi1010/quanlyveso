import React from 'react';
import { CommonSearchAndFilter, type SearchAndFilterConfig } from '@/components/common';
import { organizationSearchFields } from '../constants';
import type { OrganizationSearchParams } from '../types';

interface OrganizationSearchAndFilterProps {
  searchParams: OrganizationSearchParams;
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onFilter: (filters: Record<string, string>) => void;
  onRefresh: () => void;
  loading: boolean;
}

export const OrganizationSearchAndFilter: React.FC<OrganizationSearchAndFilterProps> = ({
  onSearch,
  onSort,
  onFilter,
  onRefresh,
  loading,
}) => {
  return (
    <CommonSearchAndFilter
      config={organizationSearchFields as SearchAndFilterConfig}
      onSearch={onSearch}
      onSort={onSort}
      onFilter={onFilter}
      onRefresh={onRefresh}
      loading={loading}
    />
  );
};
