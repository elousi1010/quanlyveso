import React from 'react';
import { CommonHeader } from '@/components/common';

interface PartnerDebtHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
  onExport?: () => void;
  onImport?: () => void;
  selectedCount: number;
  onBulkDelete?: () => void;
  onBulkEdit?: () => void;
}

const PartnerDebtHeader: React.FC<PartnerDebtHeaderProps> = ({
  onCreate,
  onRefresh,
  onExport,
  onImport,
  selectedCount,
  onBulkDelete,
  onBulkEdit,
}) => {
  return (
    <CommonHeader
      title="Quản Lý Công Nợ Đối Tác"
      subtitle="Quản lý công nợ và nợ của các đối tác"
      onCreate={onCreate}
      onRefresh={onRefresh}
      createButtonText="Thêm Công Nợ"
      selectedCount={selectedCount}
      onDeleteSelected={onBulkDelete}
      onBulkEdit={onBulkEdit}
      showBulkEdit={selectedCount > 0}
      showDeleteSelected={selectedCount > 0}
    />
  );
};

export default PartnerDebtHeader;
