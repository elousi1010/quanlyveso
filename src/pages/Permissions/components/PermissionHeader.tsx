import React from 'react';
import { Button } from '@mui/material';
import { CommonHeader } from '@/components/common';
import { PERMISSION_CONSTANTS } from '../constants';

interface PermissionHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  onCreateSpecific?: () => void;
  onBulkAssign?: () => void;
  loading?: boolean;
}

export const PermissionHeader: React.FC<PermissionHeaderProps> = ({
  onCreate,
  onRefresh,
  selectedCount,
  onDeleteSelected,
  onCreateSpecific,
  onBulkAssign,
  loading = false,
}) => {
  return (
    <CommonHeader
      title={PERMISSION_CONSTANTS.MODULE_TITLE}
      subtitle="Quản lý quyền hạn và phân quyền người dùng"
      onCreate={onCreate}
      onRefresh={onRefresh}
      loading={loading}
      selectedCount={selectedCount}
      onDeleteSelected={onDeleteSelected}
      showDeleteSelected={selectedCount > 0}
      customActions={onBulkAssign ? (
        <Button
          variant="outlined"
          onClick={onBulkAssign}
          disabled={selectedCount === 0}
          sx={{ ml: 1 }}
        >
          Gán quyền hàng loạt
        </Button>
      ) : undefined}
    />
  );
};
