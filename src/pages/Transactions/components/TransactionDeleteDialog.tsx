import React from 'react';
import { CommonDeleteDialog } from '@/components/common';
import type { Transaction } from '../types';

interface TransactionDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: Transaction | null;
  loading?: boolean;
}

export const TransactionDeleteDialog: React.FC<TransactionDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  transaction,
  loading = false,
}) => {
  return (
    <CommonDeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xóa Giao dịch"
      content={`Bạn có chắc chắn muốn xóa giao dịch ${transaction?.amount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(transaction.amount) : ''}?`}
      loading={loading}
    />
  );
};
