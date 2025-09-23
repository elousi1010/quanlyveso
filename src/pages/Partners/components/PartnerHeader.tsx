import React from 'react';
import { Button } from '@mui/material';
import { CommonHeader } from '@/components/common';
import { PARTNER_CONSTANTS } from '../constants';

interface PartnerHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  onCreateSpecific?: () => void;
  loading?: boolean;
}

export const PartnerHeader: React.FC<PartnerHeaderProps> = ({
  onCreate,
  onRefresh,
  selectedCount,
  onDeleteSelected,
  onCreateSpecific,
  loading = false,
}) => {
  return (
    <CommonHeader
      title={PARTNER_CONSTANTS.MODULE_TITLE}
      subtitle="Quản lý thông tin đối tác và nhà phân phối"
      onCreate={onCreate}
      onRefresh={onRefresh}
      loading={loading}
      selectedCount={selectedCount}
      onDeleteSelected={onDeleteSelected}
      showDeleteSelected={selectedCount > 0}
      customActions={onCreateSpecific && (
        <Button
          variant="outlined"
          onClick={onCreateSpecific}
          disabled={loading}
          size="small"
          sx={{ 
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Tạo đối tác cụ thể
        </Button>
      )}
    />
  );
};