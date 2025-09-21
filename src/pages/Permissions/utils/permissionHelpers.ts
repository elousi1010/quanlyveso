import type { Permission } from '../types';

export const formatPermissionData = (permission: Permission) => {
  return {
    ...permission,
    created_at: permission.created_at 
      ? new Date(permission.created_at).toLocaleDateString('vi-VN')
      : '',
    updated_at: permission.updated_at 
      ? new Date(permission.updated_at).toLocaleDateString('vi-VN')
      : '',
  };
};

export const validatePermissionData = (data: Partial<Permission>) => {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = 'Tên quyền là bắt buộc';
  }

  if (!data.code?.trim()) {
    errors.code = 'Mã quyền là bắt buộc';
  }

  if (!data.actions || Object.keys(data.actions).length === 0) {
    errors.actions = 'Hành động là bắt buộc';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const formatActionsDisplay = (actions: Record<string, string[]>) => {
  return Object.entries(actions)
    .map(([resource, resourceActions]) => 
      `${resource}: ${Array.isArray(resourceActions) ? resourceActions.join(', ') : resourceActions}`
    )
    .join('; ');
};
