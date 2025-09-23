import React from 'react';
import { CommonHeader } from '@/components/common';
import { TICKET_CONSTANTS } from '../constants';

interface TicketHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export const TicketHeader: React.FC<TicketHeaderProps> = ({
  onCreate,
  onRefresh,
  loading = false,
}) => {
  return (
    <CommonHeader
      title={TICKET_CONSTANTS.MODULE_TITLE}
      subtitle="Quản lý các vé số"
      onCreate={onCreate}
      onRefresh={onRefresh}
      loading={loading}
    />
  );
};
