import type { Organization } from '../types';

export const formatOrganizationData = (organization: Organization) => {
  return {
    ...organization,
  };
};

export const validateOrganizationData = (data: Partial<Organization>) => {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = 'Tên tổ chức là bắt buộc';
  }

  // Address is now optional, so we don't validate it
  // owner_id is also optional, so we don't validate it

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateOrganizationUpdateData = (data: Partial<Organization>) => {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = 'Tên tổ chức là bắt buộc';
  }

  // Address is optional
  // owner_id is not editable via the API

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
