import React from 'react';
import { CommonHeader } from '@/components/common';
import { STATION_CONSTANTS } from '../constants';

interface StationHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
}

export const StationHeader: React.FC<StationHeaderProps> = ({
  onCreate,
  onRefresh,
  selectedCount,
  onDeleteSelected,
}) => {
  return (
    <CommonHeader
      title={STATION_CONSTANTS.MODULE_TITLE}
      onCreate={onCreate}
      onRefresh={onRefresh}
      onDeleteSelected={onDeleteSelected}
    />
  );
};
