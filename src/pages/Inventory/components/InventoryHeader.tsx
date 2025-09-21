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
}) => {
  return (
    <CommonHeader
      title={INVENTORY_CONSTANTS.MODULE_TITLE}
      subtitle={INVENTORY_CONSTANTS.MODULE_TITLE}
      onCreate={onCreate}
      onRefresh={onRefresh}
    />
  );
};
