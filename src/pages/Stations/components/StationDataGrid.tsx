import React from 'react';
import { CommonDataTable } from '@/components/common';
import { stationTableConfig } from '../constants';
import type { Station } from '../types';

interface StationDataGridProps {
  data: Station[];
  loading: boolean;
  selectedRows: Station[];
  onSelectionChange: (stations: Station[]) => void;
}

export const StationDataGrid: React.FC<StationDataGridProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  selectedRows,
  onSelectionChange,
}) => {
  const handleRowClick = (station: Station) => {
    onView(station);
  };

  const handleEdit = (station: Station) => {
    onEdit(station);
  };

  const handleDelete = (station: Station) => {
    onDelete(station);
  };

  return (
    <CommonDataTable
      data={data}
      isLoading={loading}
      columns={stationTableConfig.columns}
      onRowClick={handleRowClick}
      onEdit={handleEdit}
      onDelete={handleDelete}
      selectedRows={selectedRows}
      onSelectionChange={onSelectionChange}
      config={stationTableConfig}
    />
  );
};
