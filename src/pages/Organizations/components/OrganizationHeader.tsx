import React from 'react';
import { CommonHeader } from '@/components/common';
import { ORGANIZATION_CONSTANTS } from '../constants';

interface OrganizationHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
}

export const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({
  onCreate,
  onRefresh,
}) => {
  return (
    <CommonHeader
      title={ORGANIZATION_CONSTANTS.MODULE_TITLE}
      subtitle={ORGANIZATION_CONSTANTS.MODULE_TITLE}
      onCreate={onCreate}
      onRefresh={onRefresh}
    />
  );
};
