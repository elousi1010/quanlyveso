import React from 'react';
import { SimpleTable } from '@/components/common';
import { PARTNER_TABLE_COLUMNS } from '../constants';
import type { Partner, PartnerListResponse } from '../types';
import { Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';

interface PartnerDataGridProps {
  data: PartnerListResponse;
  loading: boolean;
  onEdit: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
  onView: (partner: Partner) => void;
  onSave?: (data: Record<string, unknown>) => Promise<void>;
  selectedRows?: Partner[];
  onSelectionChange?: (selectedRows: Partner[]) => void;
  // Pagination props
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

export const PartnerDataGrid: React.FC<PartnerDataGridProps> = ({
  data,
  loading,
  onDelete,
  onView,
  page = 0,
  rowsPerPage = 5,
  onPageChange,
  onRowsPerPageChange,
}) => {
  // Handle data structure - based on actual API response
  // Data structure: { data: { data: { data: Partner[], total: number } } }
  const partnersArray = data?.data?.data?.data || [];
  const totalCount = data?.data?.data?.total || 0;

  // Simple table actions
  const tableActions = [
    {
      key: 'view',
      label: 'Xem chi tiết',
      icon: <ViewIcon />,
      color: 'primary' as const,
      onClick: (partner: unknown) => onView(partner as Partner),
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteIcon />,
      color: 'error' as const,
      onClick: (partner: unknown) => onDelete(partner as Partner),
    },
  ];

  return (
    <SimpleTable
      data={partnersArray}
      columns={PARTNER_TABLE_COLUMNS}
      actions={tableActions}
      loading={loading}
      onRefresh={() => window.location.reload()}
      emptyMessage="Không có đối tác"
      total={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};