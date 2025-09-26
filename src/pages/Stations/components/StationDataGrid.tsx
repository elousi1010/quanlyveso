import React from 'react';
import { SimpleTable } from '@/components/common';
import { 
  Visibility as ViewIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { stationTableConfig } from '../constants';
import type { Station } from '../types';

interface StationDataGridProps {
  data: Station[];
  loading: boolean;
  onEdit: (station: Station) => void;
  onDelete: (station: Station) => void;
  onView: (station: Station) => void;
  onSave?: (data: Record<string, unknown>, selectedRow?: Station) => Promise<void>;
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

export const StationDataGrid: React.FC<StationDataGridProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  onSave,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
}) => {
  // Simple table actions
  const actions = [
    {
      key: 'view',
      label: 'Xem',
      icon: <ViewIcon />,
      color: 'primary' as const,
      onClick: (station: unknown) => onView(station as Station),
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteIcon />,
      color: 'error' as const,
      onClick: (station: unknown) => onDelete(station as Station),
    },
  ];

  return (
    <SimpleTable
      data={data}
      columns={stationTableConfig.columns}
      actions={actions}
      loading={loading}
      onRefresh={() => {}}
      emptyMessage="Không có trạm"
      page={page}
      rowsPerPage={rowsPerPage}
      total={total}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};
