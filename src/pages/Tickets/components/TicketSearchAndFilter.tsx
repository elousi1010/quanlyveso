import React from 'react';
import { CommonSearchAndFilter } from '@/components/common';
import { ticketSearchFields, ticketFilterFields } from '../constants';
import type { TicketSearchParams } from '../types';

interface TicketSearchAndFilterProps {
  searchParams: Record<string, unknown>;
  onSearchChange: (params: Record<string, unknown>) => void;
  onReset: () => void;
}

export const TicketSearchAndFilter: React.FC<TicketSearchAndFilterProps> = ({
  searchParams,
  onSearchChange,
  onReset,
}) => {
  return (
    <CommonSearchAndFilter
      searchFields={ticketSearchFields}
      filterFields={ticketFilterFields}
      searchParams={searchParams}
      onSearchChange={onSearchChange}
      onReset={onReset}
    />
  );
};
