import React from 'react';
import { SimpleTable } from '@/components/common';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
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
  // Pagination props
  page?: number;
  rowsPerPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

export const TicketDataGrid: React.FC<TicketDataGridProps> = ({
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

  // Simple table actions
  const actions = [
    {
      key: 'view',
      label: 'Xem',
      icon: <EyeOutlined />,
      color: 'primary' as const,
      onClick: (ticket: unknown) => onView(ticket as Ticket),
    },
    {
      key: 'edit',
      label: 'Sửa',
      icon: <EditOutlined />,
      color: 'primary' as const,
      onClick: (ticket: unknown) => onEdit(ticket as Ticket),
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteOutlined />,
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
      onRefresh={() => { }}
      emptyMessage="Không có vé số"
      page={page}
      rowsPerPage={rowsPerPage}
      total={total}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};
