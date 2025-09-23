import React from 'react';
import { CommonDataTable } from '@/components/common';
import { partnerDebtTableConfig } from '../constants';
import type { PartnerDebtTableRow } from '../types';

interface PartnerDebtDataGridProps {
  data: PartnerDebtTableRow[];
  loading: boolean;
  error: unknown;
  onRefresh: () => void;
  onEdit?: (item: PartnerDebtTableRow) => void;
  onDelete?: (item: PartnerDebtTableRow) => void;
  onView?: (item: PartnerDebtTableRow) => void;
}

export const PartnerDebtDataGrid: React.FC<PartnerDebtDataGridProps> = ({
  data,
  loading,
  error,
  onRefresh,
  onEdit,
  onDelete,
  onView,
}) => {
  const actions = [
    {
      key: 'view',
      label: 'Xem',
      icon: <span>👁️</span>,
      color: 'info',
      onClick: (item: PartnerDebtTableRow) => onView?.(item),
    },
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <span>✏️</span>,
      color: 'primary',
      onClick: (item: PartnerDebtTableRow) => onEdit?.(item),
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <span>🗑️</span>,
      color: 'error',
      onClick: (item: PartnerDebtTableRow) => onDelete?.(item),
    },
  ];

  return (
    <CommonDataTable
      data={data as unknown as Record<string, unknown>[]}
      columns={partnerDebtTableConfig.columns}
      actions={actions}
      isLoading={loading}
      error={error}
      onRefresh={onRefresh}
      emptyMessage="Không có công nợ đối tác"
      emptyDescription="Chưa có công nợ đối tác nào trong hệ thống"
    />
  );
};

export default PartnerDebtDataGrid;
