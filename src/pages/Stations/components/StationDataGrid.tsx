import React from 'react';
import { CommonDataTable } from '@/components/common';
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

  return (
    <CommonDataTable
      data={data as unknown as Record<string, unknown>[]}
      columns={stationTableConfig.columns}
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
