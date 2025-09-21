import React from 'react';
import { CommonDataTable } from '@/components/common';
import { permissionTableConfig } from '../constants';
import type { Permission } from '../types';

interface PermissionDataGridProps {
  item: Permission[];
  loading: boolean;
  selectedRows: Permission[];
  onSelectionChange: (permissions: Permission[]) => void;
}

export const PermissionDataGrid: React.FC<PermissionDataGridProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  selectedRows,
  onSelectionChange,
}) => {
  const handleRowClick = (permission: Permission) => {
    onView(permission);
  };

  const handleEdit = (permission: Permission) => {
    onEdit(permission);
  };

  const handleDelete = (permission: Permission) => {
    onDelete(permission);
  };

  return (
    <CommonDataTable
      data={data}
      loading={loading}
      columns={permissionTableConfig.columns}
      onRowClick={handleRowClick}
      onEdit={handleEdit}
      onDelete={handleDelete}
      selectedRows={selectedRows}
      onSelectionChange={onSelectionChange}
      config={permissionTableConfig}
    />
  );
};
