import React from 'react';
import { CommonDeleteDialog } from '@/components/common';
import type { Permission } from '../types';

interface PermissionDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  permission: Permission | null;
  loading?: boolean;
}

export const PermissionDeleteDialog: React.FC<PermissionDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  permission,
  loading = false,
}) => {
  return (
    <CommonDeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xóa Quyền hạn"
      content={`Bạn có chắc chắn muốn xóa quyền "${permission?.name}"?`}
      loading={loading}
    />
  );
};
