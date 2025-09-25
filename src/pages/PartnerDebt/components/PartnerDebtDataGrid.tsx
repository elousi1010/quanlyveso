import React from 'react';
import { SimpleTable } from '@/components/common';
import { partnerDebtTableConfig } from '../constants';
import type { PartnerDebtTableRow } from '../types';
import { Visibility } from '@mui/icons-material';

interface PartnerDebtDataGridProps {
  data: PartnerDebtTableRow[];
  loading: boolean;
  error: unknown; 
  onView?: (item: PartnerDebtTableRow) => void;
}

export const PartnerDebtDataGrid: React.FC<PartnerDebtDataGridProps> = ({
  data,
  loading,
  error,
  onView,
}) => {
  const actions = [
    {
      key: 'view',
      label: 'Xem',
      icon: <Visibility />,
      color: 'primary' as const,
      onClick: (item: PartnerDebtTableRow) => onView?.(item),
    },
  ];

  return (
    <SimpleTable
      data={data}
      columns={partnerDebtTableConfig.columns}
      actions={actions}
      loading={loading}
      error={error}
      emptyMessage="Không có công nợ đối tác"
    />
  );
};

export default PartnerDebtDataGrid;
