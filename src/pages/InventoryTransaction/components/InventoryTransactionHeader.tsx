import React from 'react';
import { CommonHeader } from '@/components/common';

interface InventoryTransactionHeaderProps {
  title: string;
  onCreate: () => void;
  onRefresh?: () => void;
  loading?: boolean;
  selectedCount?: number;
  onDeleteSelected?: () => void;
  showDeleteSelected?: boolean;
}

export const InventoryTransactionHeader: React.FC<InventoryTransactionHeaderProps> = ({
  title,
  onCreate,
  onRefresh,
  loading = false,
  selectedCount = 0,
  onDeleteSelected,
  showDeleteSelected = false,
}) => {
  return (
    <CommonHeader
      title={title}
      subtitle="Quản lý giao dịch kho hàng"
      onCreate={onCreate}
      onRefresh={onRefresh}
      createButtonText="Tạo Giao Dịch"
      refreshButtonText="Làm mới"
      loading={loading}
      selectedCount={selectedCount}
      onDeleteSelected={onDeleteSelected}
      deleteButtonText="Xóa đã chọn"
      showDeleteSelected={showDeleteSelected}
    />
  );
};
