import React from 'react';
import { CommonDataTable } from '@/components/common';
import { PARTNER_TABLE_COLUMNS, PARTNER_TABLE_ACTIONS, PARTNER_DETAIL_FIELDS, PARTNER_FORM_FIELDS } from '../constants';
import type { Partner, PartnerListResponse } from '../types';

interface PartnerDataGridProps {
  data: PartnerListResponse;
  loading: boolean;
  onEdit: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
  onView: (partner: Partner) => void;
  onSave?: (data: Record<string, any>) => Promise<void>;
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
  console.log('PartnerDataGrid - Full data:', data);
  console.log('PartnerDataGrid - Data array:', data?.data?.data);
  console.log('PartnerDataGrid - Total:', data?.data?.total);
  
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

  // Handle data structure
  const partnersArray = data?.data?.data || [];
  const totalCount = data?.data?.total || 0;
  
  console.log('PartnerDataGrid - partnersArray:', partnersArray);
  console.log('PartnerDataGrid - partnersArray length:', partnersArray.length);
  console.log('PartnerDataGrid - totalCount:', totalCount);
  console.log('PartnerDataGrid - data structure:', {
    hasData: !!data,
    hasDataData: !!data?.data,
    hasDataDataData: !!data?.data?.data,
    dataKeys: data ? Object.keys(data) : [],
    dataDataKeys: data?.data ? Object.keys(data.data) : []
  });

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
      // Drawer props
      enableViewDetail={true}
      enableEdit={!!onSave}
      detailFields={PARTNER_DETAIL_FIELDS}
      editFields={PARTNER_FORM_FIELDS}
      onSave={onSave}
      detailTitle="Chi tiết Đối tác"
      editTitle="Chỉnh sửa Đối tác"
    />
  );
};