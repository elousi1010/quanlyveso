import React from 'react';
import { SimpleTable } from '@/components/common';
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
  onSave?: (data: Record<string, unknown>, selectedRow?: Ticket) => Promise<void>;
  selectedRows: Ticket[];
  onSelectionChange: (tickets: Ticket[]) => void;
}

export const TicketDataGrid: React.FC<TicketDataGridProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  onSave,
  selectedRows,
  onSelectionChange,
}) => {

  // Simple table actions
  const actions = [
    {
      key: 'view',
      label: 'Xem',
      icon: <ViewIcon />,
      color: 'primary' as const,
      onClick: (ticket: unknown) => onView(ticket as Ticket),
    },
    {
      key: 'edit',
      label: 'Sửa',
      icon: <EditIcon />,
      color: 'primary' as const,
      onClick: (ticket: unknown) => onEdit(ticket as Ticket),
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteIcon />,
      color: 'error' as const,
      onClick: (ticket: unknown) => onDelete(ticket as Ticket),
    },
  ];

  return (
    <SimpleTable
      data={data}
      columns={ticketTableConfig.columns}
      actions={actions}
      loading={loading}
      onRefresh={() => {}}
      emptyMessage="Không có vé số"
    />
  );
};
