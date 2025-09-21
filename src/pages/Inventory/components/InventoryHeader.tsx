import React from 'react';
import { CommonHeader } from '@/components/common';
import { INVENTORY_CONSTANTS } from '../constants';

interface InventoryHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  onCreate,
  onRefresh,
  selectedCount,
  onDeleteSelected,
}) => {
  return (
    <CommonHeader
      title={INVENTORY_CONSTANTS.MODULE_TITLE}
      onCreate={onCreate}
      onRefresh={onRefresh}
      selectedCount={selectedCount}
      onDeleteSelected={onDeleteSelected}
    />
  );
};
