import React from 'react';
import { SimpleTable } from '@/components/common';
import { organizationTableConfig } from '../constants';
import { organizationFormFields, organizationDetailFields } from '../constants/organizationViewEditConfig';
import type { Organization } from '../types';

interface OrganizationDataGridProps {
  data: Organization[];
  loading: boolean;
  error: unknown;
  onRefresh: () => void;
  page?: number;
  rowsPerPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  onEdit?: (item: Organization) => void;
  onDelete?: (item: Organization) => void;
  onView?: (item: Organization) => void;
  onSave?: (data: Record<string, unknown>, selectedRow?: Organization) => Promise<void>;
}

export const OrganizationDataGrid: React.FC<OrganizationDataGridProps> = ({
  data,
  loading,
  error,
  onRefresh,
  page = 0,
  rowsPerPage = 10,
  total = 0,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  onView,
  onSave,
}) => {
  const actions = [
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <span>✏️</span>,
      color: 'primary',
      onClick: (item: Organization) => onEdit(item),
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <span>🗑️</span>,
      color: 'error',
      onClick: (item: Organization) => onDelete(item),
    },
    {
      key: 'view',
      label: 'Xem',
      icon: <span>👁️</span>,
      color: 'info',
      onClick: (item: Organization) => onView(item),
    },
  ];

  return (
    <SimpleTable
      data={data || []}
      columns={organizationTableConfig.columns}
      actions={actions}
      loading={loading}
      error={error}
      onRefresh={onRefresh}
      page={page}
      rowsPerPage={rowsPerPage}
      total={total}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      emptyMessage="Không có tổ chức"
    />
  );
};
