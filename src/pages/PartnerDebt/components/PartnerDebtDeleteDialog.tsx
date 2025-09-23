import React from 'react';
import { CommonDeleteDialog } from '@/components/common';

interface PartnerDebtDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  loading?: boolean;
}

const PartnerDebtDeleteDialog: React.FC<PartnerDebtDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  itemName = 'công nợ đối tác',
  loading = false,
}) => {
  return (
    <CommonDeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      itemName={itemName}
      loading={loading}
      title="Xóa Công Nợ Đối Tác"
      message={`Bạn có chắc chắn muốn xóa ${itemName} này không? Hành động này không thể hoàn tác.`}
    />
  );
};

export default PartnerDebtDeleteDialog;
