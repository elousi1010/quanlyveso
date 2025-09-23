import React from 'react';
import { CommonHeader } from '@/components/common';
import { TRANSACTION_CONSTANTS } from '../constants';

interface TransactionHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  onCreate,
  onRefresh,
  loading = false,
}) => {
  return (
    <CommonHeader
      title={TRANSACTION_CONSTANTS.MODULE_TITLE}
      subtitle="Quản lý các giao dịch"
      onCreate={onCreate}
      onRefresh={onRefresh}
      loading={loading}
    />
  );
};
