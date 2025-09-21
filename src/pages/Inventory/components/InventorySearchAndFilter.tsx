import React from 'react';
import { CommonSearchAndFilter } from '@/components/common';
import { inventorySearchFields, inventoryFilterFields } from '../constants';
import type { InventorySearchParams } from '../types';

interface InventorySearchAndFilterProps {
  searchParams: Record<string, unknown>;
  onSearchChange: (params: Record<string, unknown>) => void;
  onReset: () => void;
}

export const InventorySearchAndFilter: React.FC<InventorySearchAndFilterProps> = ({
  searchParams,
  onSearchChange,
  onReset,
}) => {
  return (
    <CommonSearchAndFilter
      searchFields={inventorySearchFields}
      filterFields={inventoryFilterFields}
      searchParams={searchParams}
      onSearchChange={onSearchChange}
      onReset={onReset}
    />
  );
};
