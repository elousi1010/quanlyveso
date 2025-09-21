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
}) => {
  return (
    <CommonHeader
      title={STATION_CONSTANTS.MODULE_TITLE}
      subtitle="Quản lý các trạm xổ số"
      onCreate={onCreate}
      onRefresh={onRefresh}
    />
  );
};
