import React from 'react';
import { CommonDeleteDialog } from '@/components/common';
import type { Organization } from '../types';

interface OrganizationDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  organization: Organization | null;
  loading?: boolean;
}

export const OrganizationDeleteDialog: React.FC<OrganizationDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  organization,
  loading = false,
}) => {
  return (
    <CommonDeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xóa Tổ chức"
      content={`Bạn có chắc chắn muốn xóa tổ chức "${organization?.name}"?`}
      loading={loading}
    />
  );
};
