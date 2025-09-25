import React, { useState } from 'react';
import { CommonSearchAndFilter } from '@/components/common';
import { PARTNER_SEARCH_FILTER_CONFIG } from '../constants';
import type { PartnerSearchParams } from '../types';

interface PartnerSearchAndFilterProps {
  searchParams: PartnerSearchParams;
  onSearchChange: (params: PartnerSearchParams) => void;
  onReset: () => void;
  onFilterChange?: (filters: Record<string, unknown>) => void;
  filters?: Record<string, unknown>;
}

export const PartnerSearchAndFilter: React.FC<PartnerSearchAndFilterProps> = ({
  searchParams,
  onSearchChange,
  onReset,
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
      config={PARTNER_SEARCH_FILTER_CONFIG}
      onSearch={() => onSearchChange(searchParams)}
      onSort={() => onSearchChange(searchParams)}
      onFilter={handleFilterChange}
      onClearFilters={handleClearFilters}
      filters={localFilters}
      loading={false}
    />
  );
};