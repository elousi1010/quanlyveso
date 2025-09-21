import type { Permission, CreatePermissionDto, UpdatePermissionDto } from '../types';

/**
 * Convert permission actions to form fields for display/editing
 */
export const permissionToFormData = (permission: Permission | null): Record<string, unknown> => {
  if (!permission) return {};
  
  const formData: Record<string, unknown> = {
    name: permission.name,
    code: permission.code,
  };
  
  // Convert actions to individual boolean fields
  if (permission.actions) {
    // User permissions
    formData.user_read = permission.actions.user?.includes('read') || false;
    formData.user_create = permission.actions.user?.includes('create') || false;
    formData.user_update = permission.actions.user?.includes('update') || false;
    formData.user_delete = permission.actions.user?.includes('delete') || false;
    
    // Organization permissions
    formData.organization_read = permission.actions.organization?.includes('read') || false;
    formData.organization_create = permission.actions.organization?.includes('create') || false;
    formData.organization_update = permission.actions.organization?.includes('update') || false;
    formData.organization_delete = permission.actions.organization?.includes('delete') || false;
  }
  
  return formData;
};

/**
 * Convert form data to permission actions format
 */
export const formDataToActions = (data: Record<string, unknown>): Record<string, string[]> => {
  const actions: Record<string, string[]> = {};
  
  // User permissions
  const userActions: string[] = [];
  if (data.user_read) userActions.push('read');
  if (data.user_create) userActions.push('create');
  if (data.user_update) userActions.push('update');
  if (data.user_delete) userActions.push('delete');
  if (userActions.length > 0) actions.user = userActions;
  
  // Organization permissions
  const organizationActions: string[] = [];
  if (data.organization_read) organizationActions.push('read');
  if (data.organization_create) organizationActions.push('create');
  if (data.organization_update) organizationActions.push('update');
  if (data.organization_delete) organizationActions.push('delete');
  if (organizationActions.length > 0) actions.organization = organizationActions;
  
  return actions;
};

/**
 * Convert form data to CreatePermissionDto
 */
export const formDataToCreateDto = (data: Record<string, unknown>): CreatePermissionDto => {
  return {
    name: data.name as string,
    code: data.code as string,
    actions: formDataToActions(data),
  };
};

/**
 * Convert form data to UpdatePermissionDto
 */
export const formDataToUpdateDto = (data: Record<string, unknown>): UpdatePermissionDto => {
  return {
    name: data.name as string,
    code: data.code as string,
    actions: formDataToActions(data),
  };
};

/**
 * Convert permission actions to display format for detail view
 */
export const permissionToDisplayData = (permission: Permission | null): Record<string, unknown> => {
  if (!permission) return {};
  
  const displayData: Record<string, unknown> = {
    id: permission.id,
    name: permission.name,
    code: permission.code,
    created_at: permission.created_at,
    updated_at: permission.updated_at,
  };
  
  // Convert actions to readable format
  if (permission.actions) {
    // User permissions
    const userPermissions: string[] = [];
    if (permission.actions.user?.includes('read')) userPermissions.push('Đọc');
    if (permission.actions.user?.includes('create')) userPermissions.push('Tạo');
    if (permission.actions.user?.includes('update')) userPermissions.push('Cập nhật');
    if (permission.actions.user?.includes('delete')) userPermissions.push('Xóa');
    displayData.user_permissions = userPermissions.length > 0 ? userPermissions.join(', ') : 'Không có';
    
    // Organization permissions
    const organizationPermissions: string[] = [];
    if (permission.actions.organization?.includes('read')) organizationPermissions.push('Đọc');
    if (permission.actions.organization?.includes('create')) organizationPermissions.push('Tạo');
    if (permission.actions.organization?.includes('update')) organizationPermissions.push('Cập nhật');
    if (permission.actions.organization?.includes('delete')) organizationPermissions.push('Xóa');
    displayData.organization_permissions = organizationPermissions.length > 0 ? organizationPermissions.join(', ') : 'Không có';
  }
  
  return displayData;
};