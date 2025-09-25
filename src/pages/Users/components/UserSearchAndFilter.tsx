import React, { useState } from 'react';
import { CommonSearchAndFilter, type SearchAndFilterConfig } from '@/components/common';
import { USER_SEARCH_FILTER_CONFIG } from '../constants';

interface UserSearchAndFilterProps {
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onFilter: (filters: Record<string, string>) => void;
  onRefresh: () => void;
  loading: boolean;
  onFilterChange?: (filters: Record<string, unknown>) => void;
  filters?: Record<string, unknown>;
}

const UserSearchAndFilter: React.FC<UserSearchAndFilterProps> = ({
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
      config={USER_SEARCH_FILTER_CONFIG}
      onSearch={onSearch}
      onSort={onSort}
      onFilter={handleFilterChange}
      onClearFilters={handleClearFilters}
      filters={localFilters}
      loading={loading}
    />
  );
};

export default UserSearchAndFilter;