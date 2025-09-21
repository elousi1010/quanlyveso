import React from 'react';
import { CommonSearchAndFilter } from '@/components/common';
import { permissionSearchFields, permissionFilterFields } from '../constants';
import type { PermissionSearchParams } from '../types';

interface PermissionSearchAndFilterProps {
  searchParams: Record<string, unknown>;
  onSearchChange: (params: Record<string, unknown>) => void;
  onReset: () => void;
}

export const PermissionSearchAndFilter: React.FC<PermissionSearchAndFilterProps> = ({
  searchParams,
  onSearchChange,
  onReset,
}) => {
  return (
    <CommonSearchAndFilter
      searchFields={permissionSearchFields}
      filterFields={permissionFilterFields}
      searchParams={searchParams}
      onSearchChange={onSearchChange}
      onReset={onReset}
    />
  );
};
