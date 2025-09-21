import type { Organization } from '../types';

export const formatOrganizationData = (organization: Organization) => {
  return {
    ...organization,
    created_at: organization.created_at 
      ? new Date(organization.created_at).toLocaleDateString('vi-VN')
      : '',
    updated_at: organization.updated_at 
      ? new Date(organization.updated_at).toLocaleDateString('vi-VN')
      : '',
  };
};

export const validateOrganizationData = (data: Partial<Organization>) => {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = 'Tên tổ chức là bắt buộc';
  }

  if (!data.address?.trim()) {
    errors.address = 'Địa chỉ là bắt buộc';
  }

  if (!data.owner_id?.trim()) {
    errors.owner_id = 'ID chủ sở hữu là bắt buộc';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
