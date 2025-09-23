import React from 'react';
import { CommonHeader } from '@/components/common';
import { INVENTORY_CONSTANTS } from '../constants';

interface InventoryHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
  onBulkEdit?: () => void;
  showBulkEdit?: boolean;
  loading?: boolean;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  onCreate,
  onRefresh,
  onBulkEdit,
  showBulkEdit = false,
  loading = false,
}) => {
  return (
    <CommonHeader
      title={INVENTORY_CONSTANTS.MODULE_TITLE}
      subtitle="Quản lý kho hàng và sản phẩm"
      onCreate={onCreate}
      onRefresh={onRefresh}
      onBulkEdit={onBulkEdit}
      showBulkEdit={showBulkEdit}
      loading={loading}
    />
  );
};
