import React from 'react';
import { CommonSearchAndFilter } from '@/components/common';
import { inventoryTransactionSearchFields } from '../constants';
import type { InventoryTransactionSearchParams } from '../types';

interface InventoryTransactionSearchAndFilterProps {
  searchParams: InventoryTransactionSearchParams;
  onSearchChange: (params: InventoryTransactionSearchParams) => void;
  onReset: () => void;
  loading?: boolean;
}

export const InventoryTransactionSearchAndFilter: React.FC<InventoryTransactionSearchAndFilterProps> = ({
  searchParams,
  onSearchChange,
  onReset,
  loading = false,
}) => {
  return (
    <CommonSearchAndFilter
      searchParams={searchParams as Record<string, unknown>}
      onSearchChange={onSearchChange as (params: Record<string, unknown>) => void}
      onReset={onReset}
      loading={loading}
      config={inventoryTransactionSearchFields}
    />
  );
};
