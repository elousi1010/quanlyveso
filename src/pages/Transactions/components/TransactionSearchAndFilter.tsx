import React from 'react';
import { CommonSearchAndFilter } from '@/components/common';
import { transactionSearchFields, transactionFilterFields } from '../constants';
import type { TransactionSearchParams } from '../types';

interface TransactionSearchAndFilterProps {
  searchParams: Record<string, unknown>;
  onSearchChange: (params: Record<string, unknown>) => void;
  onReset: () => void;
}

export const TransactionSearchAndFilter: React.FC<TransactionSearchAndFilterProps> = ({
  searchParams,
  onSearchChange,
  onReset,
}) => {
  return (
    <CommonSearchAndFilter
      searchFields={transactionSearchFields}
      filterFields={transactionFilterFields}
      searchParams={searchParams}
      onSearchChange={onSearchChange}
      onReset={onReset}
    />
  );
};
