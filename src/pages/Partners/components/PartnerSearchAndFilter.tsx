import React from 'react';
import { CommonSearchAndFilter } from '@/components/common';
import { PARTNER_SEARCH_FILTER_CONFIG } from '../constants';
import type { PartnerSearchParams } from '../types';

interface PartnerSearchAndFilterProps {
  searchParams: PartnerSearchParams;
  onSearchChange: (params: PartnerSearchParams) => void;
  onReset: () => void;
}

export const PartnerSearchAndFilter: React.FC<PartnerSearchAndFilterProps> = ({
  searchParams,
  onSearchChange,
  onReset,
}) => {
  return (
    <CommonSearchAndFilter
      config={PARTNER_SEARCH_FILTER_CONFIG}
      onSearch={() => onSearchChange(searchParams)}
      onSort={() => onSearchChange(searchParams)}
      onFilter={(filters) => onSearchChange({ ...searchParams, ...filters })}
      onRefresh={onReset}
      loading={false}
    />
  );
};