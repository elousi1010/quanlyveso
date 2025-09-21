import React from 'react';
import { CommonHeader } from '@/components/common';
import { PERMISSION_CONSTANTS } from '../constants';

interface PermissionHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
}

export const PermissionHeader: React.FC<PermissionHeaderProps> = ({
  onCreate,
  onRefresh,
  selectedCount,
  onDeleteSelected,
}) => {
  return (
    <CommonHeader
      title={PERMISSION_CONSTANTS.MODULE_TITLE}
      onCreate={onCreate}
      onRefresh={onRefresh}
      selectedCount={selectedCount}
      onDeleteSelected={onDeleteSelected}
    />
  );
};
