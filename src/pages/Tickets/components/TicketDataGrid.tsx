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
import { ticketTableConfig } from '../constants';
import type { Ticket } from '../types';

interface TicketDataGridProps {
  data: Ticket[];
  loading: boolean;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
  onView: (ticket: Ticket) => void;
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

  const handleView = (ticket: Ticket) => {
    onView(ticket);
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
      isLoading={loading}
      error={undefined}
      onRefresh={() => {}}
      columns={ticketTableConfig.columns}
      actions={actions}
      onRowClick={handleRowClick as (item: Ticket) => void}
      onEdit={handleEdit as (item: Ticket) => void}
      onDelete={handleDelete as (item: Ticket) => void}
      selectedRows={selectedRows as unknown as Record<string, unknown>[]}
      onSelectionChange={onSelectionChange as (items: unknown[]) => void}
      config={ticketTableConfig as unknown as Record<string, unknown>}
    />
  );
};
