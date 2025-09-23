import React from 'react';
import { CommonDataTable } from '@/components/common';
import { PARTNER_TABLE_COLUMNS, PARTNER_TABLE_ACTIONS, PARTNER_DETAIL_FIELDS, PARTNER_FORM_FIELDS } from '../constants';
import type { Partner, PartnerListResponse } from '../types';
import LoadingScreen from '@/components/common/LoadingScreen';

interface PartnerDataGridProps {
  data: PartnerListResponse;
  loading: boolean;
  onEdit: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
  onView: (partner: Partner) => void;
  onSave?: (data: Record<string, unknown>) => Promise<void>;
  selectedRows?: Partner[];
  onSelectionChange?: (selectedRows: Partner[]) => void;
}

export const PartnerDataGrid: React.FC<PartnerDataGridProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  onSave,
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

  // Handle data structure - based on actual API response
  // Data structure: { data: { data: { data: Partner[], total: number } } }
  const partnersArray = data?.data?.data?.data || [];
  const totalCount = data?.data?.data?.total || 0;
  

  // Show loading if data is not ready
  if (loading) {
    return <LoadingScreen />;
  }

  // Show message if no data
  if (!data || !partnersArray.length) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Không có dữ liệu đối tác</p>
      </div>
    );
  }


  return (
    <CommonDataTable
      data={partnersArray as unknown as Record<string, unknown>[]}
      columns={PARTNER_TABLE_COLUMNS}
      actions={tableActions}
      isLoading={loading}
      error={null}
      onRefresh={() => window.location.reload()}
      emptyMessage="Không có đối tác"
      emptyDescription="Chưa có đối tác nào trong hệ thống"
      total={totalCount}
      // Enable both view and edit
      enableViewDetail={!!onSave}
      enableEdit={false}
      detailFields={PARTNER_DETAIL_FIELDS}
      editFields={PARTNER_FORM_FIELDS}
      onSave={onSave}
      detailTitle="Chi tiết Đối tác"
    />
  );
};