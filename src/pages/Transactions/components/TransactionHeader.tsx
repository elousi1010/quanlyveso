import React from 'react';
import { CommonHeader } from '@/components/common';
import { TRANSACTION_CONSTANTS } from '../constants';

interface TransactionHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
}

export const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  onCreate,
  onRefresh,
}) => {
  return (
    <CommonHeader
      title={TRANSACTION_CONSTANTS.MODULE_TITLE}
      subtitle="Quản lý các giao dịch"
      onCreate={onCreate}
      onRefresh={onRefresh}
    />
  );
};
