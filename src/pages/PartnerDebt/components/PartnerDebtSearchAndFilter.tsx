import React, { useState } from 'react';
import { CommonSearchAndFilter, type SearchAndFilterConfig } from '@/components/common';
import { partnerDebtSearchConfig } from '../constants';
import type { PartnerDebtSearchParams } from '../types';

interface PartnerDebtSearchAndFilterProps {
  searchParams: PartnerDebtSearchParams;
  onSearchChange: (params: PartnerDebtSearchParams) => void;
  onReset: () => void;
  partnerOptions?: Array<{ value: string; label: string }>;
  onFilterChange?: (filters: Record<string, unknown>) => void;
  filters?: Record<string, unknown>;
}

const PartnerDebtSearchAndFilter: React.FC<PartnerDebtSearchAndFilterProps> = ({
  searchParams,
  onSearchChange,
  onReset,
  partnerOptions = [],
  onFilterChange,
  filters = {},
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Update partner options in search config
  const updatedSearchConfig = partnerDebtSearchConfig.map(config => {
    if (config.id === 'partner_id') {
      return {
        ...config,
        options: partnerOptions,
      };
    }
    return config;
  });

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
      config={updatedSearchConfig as SearchAndFilterConfig}
      onSearch={(query: string) => onSearchChange({ ...searchParams, searchKey: query })}
      onSort={(sortBy: string) => onSearchChange({ ...searchParams, sortBy })}
      onFilter={handleFilterChange}
      onClearFilters={handleClearFilters}
      filters={localFilters}
      loading={false}
    />
  );
};

export default PartnerDebtSearchAndFilter;