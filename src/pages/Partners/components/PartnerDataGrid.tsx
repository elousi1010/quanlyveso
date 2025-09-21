import React from 'react';
import { CommonDataTable } from '@/components/common';
import { PARTNER_TABLE_COLUMNS, PARTNER_TABLE_ACTIONS } from '../constants';
import type { Partner } from '../types';

interface PartnerDataGridProps {
  data: Partner[];
  loading: boolean;
  onEdit: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
  onView: (partner: Partner) => void;
  selectedRows?: Partner[];
  onSelectionChange?: (selectedRows: Partner[]) => void;
}

export const PartnerDataGrid: React.FC<PartnerDataGridProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
}) => {
  // Table actions with handlers
  const tableActions = PARTNER_TABLE_ACTIONS.map(action => ({
    ...action,
    onClick: (partner: Partner) => {
      switch (action.key) {
        case 'view':
          onView(partner);
          break;
        case 'edit':
          onEdit(partner);
          break;
        case 'delete':
          onDelete(partner);
          break;
      }
    },
  }));

  return (
    <CommonDataTable
      data={data as unknown as Record<string, unknown>[]}
      columns={PARTNER_TABLE_COLUMNS}
      actions={tableActions}
      isLoading={loading}
      error={null}
      onRefresh={() => window.location.reload()}
      emptyMessage="Không có đối tác"
      emptyDescription="Chưa có đối tác nào trong hệ thống"
      total={data.length}
    />
  );
};