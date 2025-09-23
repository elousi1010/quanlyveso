import React from 'react';
import { CommonSearchAndFilter } from '@/components/common';
import { partnerDebtSearchConfig } from '../constants';
import type { PartnerDebtSearchParams } from '../types';

interface PartnerDebtSearchAndFilterProps {
  searchParams: PartnerDebtSearchParams;
  onSearchChange: (params: PartnerDebtSearchParams) => void;
  onReset: () => void;
  partnerOptions?: Array<{ value: string; label: string }>;
}

const PartnerDebtSearchAndFilter: React.FC<PartnerDebtSearchAndFilterProps> = ({
  searchParams,
  onSearchChange,
  onReset,
  partnerOptions = [],
}) => {
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

  return (
    <CommonSearchAndFilter
      config={updatedSearchConfig}
      searchParams={searchParams}
      onSearchChange={onSearchChange}
      onReset={onReset}
    />
  );
};

export default PartnerDebtSearchAndFilter;
