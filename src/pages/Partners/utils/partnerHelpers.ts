import { PARTNER_TYPES } from '../constants';

// Helper functions for Partners page
export const getPartnerTypeLabel = (type: keyof typeof PARTNER_TYPES): string => {
  return PARTNER_TYPES[type] || type;
};

export const getPartnerTypeColor = (type: string): 'primary' | 'secondary' | 'success' | 'warning' | 'default' => {
  switch (type) {
    case 'agent':
      return 'primary';
    case 'seller':
      return 'secondary';
    case 'customer':
      return 'success';
    case 'supplier':
      return 'warning';
    default:
      return 'default';
  }
};

export const formatPartnerDebt = (debt: number): string => {
  return debt.toLocaleString('vi-VN') + ' VNĐ';
};

export const getPartnerStatusColor = (isActive: boolean): 'success' | 'error' => {
  return isActive ? 'success' : 'error';
};

export const getPartnerStatusLabel = (isActive: boolean): string => {
  return isActive ? 'Hoạt động' : 'Không hoạt động';
};
