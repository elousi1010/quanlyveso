import type { Station } from '../types';

export const formatStationData = (station: Station) => {
  return {
    ...station,
    created_at: station.created_at 
      ? new Date(station.created_at).toLocaleDateString('vi-VN')
      : '',
    updated_at: station.updated_at 
      ? new Date(station.updated_at).toLocaleDateString('vi-VN')
      : '',
  };
};

export const validateStationData = (data: Partial<Station>) => {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = 'Tên trạm là bắt buộc';
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (data.website && !/^https?:\/\/.+/.test(data.website)) {
    errors.website = 'Website phải bắt đầu với http:// hoặc https://';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
