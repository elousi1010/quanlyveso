import React from 'react';
import { CommonHeader } from '@/components/common';
import { ORGANIZATION_CONSTANTS } from '../constants';

interface OrganizationHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({
  onCreate,
  onRefresh,
  loading = false,
}) => {
  return (
    <CommonHeader
      title={ORGANIZATION_CONSTANTS.MODULE_TITLE}
      subtitle="Quản lý tổ chức và đơn vị"
      onCreate={onCreate}
      onRefresh={onRefresh}
      loading={loading}
    />
  );
};
