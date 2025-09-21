import React from 'react';
import { CommonDeleteDialog } from '@/components/common';
import type { Station } from '../types';

interface StationDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  station: Station | null;
  loading?: boolean;
}

export const StationDeleteDialog: React.FC<StationDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  station,
}) => {
  return (
    <CommonDeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xóa Trạm"
      itemName={station?.name}
    />
  );
};
