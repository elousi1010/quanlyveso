import React from 'react';
import { CommonSearchAndFilter } from '@/components/common';
import { organizationSearchFields, organizationFilterFields } from '../constants';
import type { OrganizationSearchParams } from '../types';

interface OrganizationSearchAndFilterProps {
  searchParams: Record<string, unknown>;
  onSearchChange: (params: Record<string, unknown>) => void;
  onReset: () => void;
}

export const OrganizationSearchAndFilter: React.FC<OrganizationSearchAndFilterProps> = ({
  searchParams,
  onSearchChange,
  onReset,
}) => {
  return (
    <CommonSearchAndFilter
      searchFields={organizationSearchFields}
      filterFields={organizationFilterFields}
      searchParams={searchParams}
      onSearchChange={onSearchChange}
      onReset={onReset}
    />
  );
};
