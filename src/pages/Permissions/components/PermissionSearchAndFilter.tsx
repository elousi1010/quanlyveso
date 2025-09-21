import React from 'react';
import { CommonSearchAndFilter } from '@/components/common';
import { permissionSearchFields, permissionFilterFields } from '../constants';
import type { PermissionSearchParams } from '../types';

interface PermissionSearchAndFilterProps {
  searchParams: PermissionSearchParams;
  onSearchChange: (params: PermissionSearchParams) => void;
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
