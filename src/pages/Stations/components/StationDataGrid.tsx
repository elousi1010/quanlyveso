import React from 'react';
import { 
  CommonDataTable, 
  type TableAction 
} from '@/components/common';
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
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const handleEdit = (station: Station) => {
    onEdit(station);
  };

  const handleDelete = (station: Station) => {
    onDelete(station);
  };

  const handleView = (station: Station) => {
    onView(station);
  };

  // Define actions for the table
  const actions: TableAction[] = [
    {
      key: 'view',
      label: 'Xem',
      icon: <ViewIcon fontSize="small" />,
      color: 'primary.main',
      onClick: handleView,
    },
    {
      key: 'edit',
      label: 'Sửa',
      icon: <EditIcon fontSize="small" />,
      color: 'warning.main',
      onClick: handleEdit,
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteIcon fontSize="small" />,
      color: 'error.main',
      onClick: handleDelete,
    },
  ];

  return (
    <CommonDataTable
      data={data as unknown as Record<string, unknown>[]}
      columns={stationTableConfig.columns}
      actions={actions}
      isLoading={loading}
      error={undefined}
      onRefresh={() => {}}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onRowClick={onView}
      page={page}
      rowsPerPage={rowsPerPage}
      total={total}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};
