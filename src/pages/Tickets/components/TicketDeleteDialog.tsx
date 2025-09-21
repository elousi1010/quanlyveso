import React from 'react';
import { CommonDeleteDialog } from '@/components/common';
import type { Ticket } from '../types';

interface TicketDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ticket: Ticket | null;
  loading?: boolean;
}

export const TicketDeleteDialog: React.FC<TicketDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  ticket,
  loading = false,
}) => {
  return (
    <CommonDeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xóa Vé số"
      content={`Bạn có chắc chắn muốn xóa vé "${ticket?.ticket_code}"?`}
      loading={loading}
    />
  );
};
