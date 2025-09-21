import React from 'react';
import { CommonDataTable } from '@/components/common';
import { organizationTableConfig } from '../constants';
import type { Organization } from '../types';

interface OrganizationDataGridProps {
  item: Organization[];
  loading: boolean;
  error: unknown;
  onRefresh: () => void;
  page?: number;
  rowsPerPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

export const OrganizationDataGrid: React.FC<OrganizationDataGridProps> = ({
  data,
  loading,
  error,
  onRefresh,
  onEdit,
  onDelete,
  onView,
  page = 0,
  rowsPerPage = 10,
  total = 0,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const actions = [
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <span>✏️</span>,
      color: 'primary',
      onClick: onEdit,
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <span>🗑️</span>,
      color: 'error',
      onClick: onDelete,
    },
    {
      key: 'view',
      label: 'Xem',
      icon: <span>👁️</span>,
      color: 'info',
      onClick: onView,
    },
  ];

  return (
    <CommonDataTable
      data={data}
      columns={organizationTableConfig.columns}
      actions={actions}
      isLoading={loading}
      error={error}
      onRefresh={onRefresh}
      page={page}
      rowsPerPage={rowsPerPage}
      total={total}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};
