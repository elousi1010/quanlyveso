import React from 'react';
import { CommonSearchAndFilter } from '@/components/common';
import { stationSearchFields, stationFilterFields } from '../constants';
import type { StationSearchParams } from '../types';

interface StationSearchAndFilterProps {
  searchParams: Record<string, unknown>;
  onSearchChange: (params: Record<string, unknown>) => void;
  onReset: () => void;
}

export const StationSearchAndFilter: React.FC<StationSearchAndFilterProps> = ({
  searchParams,
  onSearchChange,
  onReset,
}) => {
  return (
    <CommonSearchAndFilter
      searchParams={searchParams as Record<string, unknown>}
      onSearchChange={onSearchChange as (params: Record<string, unknown>) => void}
      onReset={onReset}
    />
  );
};
