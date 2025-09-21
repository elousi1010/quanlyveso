import React from 'react';
import { CommonDataTable } from '@/components/common';
import { ticketTableConfig } from '../constants';
import type { Ticket } from '../types';

interface TicketDataGridProps {
  item: Ticket[];
  loading: boolean;
  selectedRows: Ticket[];
  onSelectionChange: (tickets: Ticket[]) => void;
}

export const TicketDataGrid: React.FC<TicketDataGridProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  selectedRows,
  onSelectionChange,
}) => {
  const handleRowClick = (ticket: Ticket) => {
    onView(ticket);
  };

  const handleEdit = (ticket: Ticket) => {
    onEdit(ticket);
  };

  const handleDelete = (ticket: Ticket) => {
    onDelete(ticket);
  };

  return (
    <CommonDataTable
      data={data}
      loading={loading}
      columns={ticketTableConfig.columns}
      onRowClick={handleRowClick}
      onEdit={handleEdit}
      onDelete={handleDelete}
      selectedRows={selectedRows}
      onSelectionChange={onSelectionChange}
      config={ticketTableConfig}
    />
  );
};
