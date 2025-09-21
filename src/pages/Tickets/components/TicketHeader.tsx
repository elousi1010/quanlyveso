import React from 'react';
import { CommonHeader } from '@/components/common';
import { TICKET_CONSTANTS } from '../constants';

interface TicketHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
}

export const TicketHeader: React.FC<TicketHeaderProps> = ({
  onCreate,
  onRefresh,
  selectedCount,
  onDeleteSelected,
}) => {
  return (
    <CommonHeader
      title={TICKET_CONSTANTS.MODULE_TITLE}
      onCreate={onCreate}
      onRefresh={onRefresh}
      selectedCount={selectedCount}
      onDeleteSelected={onDeleteSelected}
    />
  );
};
