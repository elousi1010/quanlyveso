import type { Permission, CreatePermissionDto, UpdatePermissionDto } from '../types';

/**
 * Convert permission actions to form fields for display/editing
 */
export const permissionToFormData = (permission: Permission | null): Record<string, unknown> => {
  if (!permission) return {};
  
  const formData: Record<string, unknown> = {
    name: permission.name,
    code: permission.code,
    is_active: permission.is_active,
    organization_id: permission.organization_id,
  };
  
  // Convert actions to individual boolean fields based on numeric values
  if (permission.actions) {
    // User permissions (15 = read + create + update + delete)
    formData.user_read = (permission.actions.user & 1) !== 0; // 1 = read
    formData.user_create = (permission.actions.user & 2) !== 0; // 2 = create
    formData.user_update = (permission.actions.user & 4) !== 0; // 4 = update
    formData.user_delete = (permission.actions.user & 8) !== 0; // 8 = delete
    
    // Ticket permissions
    formData.ticket_read = (permission.actions.ticket & 1) !== 0;
    formData.ticket_create = (permission.actions.ticket & 2) !== 0;
    formData.ticket_update = (permission.actions.ticket & 4) !== 0;
    formData.ticket_delete = (permission.actions.ticket & 8) !== 0;
    
    // Partner permissions
    formData.partner_read = (permission.actions.partner & 1) !== 0;
    formData.partner_create = (permission.actions.partner & 2) !== 0;
    formData.partner_update = (permission.actions.partner & 4) !== 0;
    formData.partner_delete = (permission.actions.partner & 8) !== 0;
    
    // Permission permissions
    formData.permission_read = (permission.actions.permission & 1) !== 0;
    formData.permission_create = (permission.actions.permission & 2) !== 0;
    formData.permission_update = (permission.actions.permission & 4) !== 0;
    formData.permission_delete = (permission.actions.permission & 8) !== 0;
    
    // Transaction permissions
    formData.transaction_read = (permission.actions.transaction & 1) !== 0;
    formData.transaction_create = (permission.actions.transaction & 2) !== 0;
    formData.transaction_update = (permission.actions.transaction & 4) !== 0;
    formData.transaction_delete = (permission.actions.transaction & 8) !== 0;
    
    // Organization permissions
    formData.organization_read = (permission.actions.organization & 1) !== 0;
    formData.organization_create = (permission.actions.organization & 2) !== 0;
    formData.organization_update = (permission.actions.organization & 4) !== 0;
    formData.organization_delete = (permission.actions.organization & 8) !== 0;
  }
  
  return formData;
};

/**
 * Convert form data to permission actions format (numeric)
 */
export const formDataToActions = (data: Record<string, unknown>): Record<string, number> => {
  const actions: Record<string, number> = {};
  
  // Helper function to calculate numeric permission value
  const calculatePermissionValue = (prefix: string): number => {
    let value = 0;
    if (data[`${prefix}_read`]) value += 1;    // 1 = read
    if (data[`${prefix}_create`]) value += 2;  // 2 = create
    if (data[`${prefix}_update`]) value += 4;  // 4 = update
    if (data[`${prefix}_delete`]) value += 8;  // 8 = delete
    return value;
  };
  
  // Calculate permissions for each module
  actions.user = calculatePermissionValue('user');
  actions.ticket = calculatePermissionValue('ticket');
  actions.partner = calculatePermissionValue('partner');
  actions.permission = calculatePermissionValue('permission');
  actions.transaction = calculatePermissionValue('transaction');
  actions.organization = calculatePermissionValue('organization');
  
  return actions;
};

/**
 * Convert form data to CreatePermissionDto (string array format)
 */
export const formDataToCreateDto = (data: Record<string, unknown>): CreatePermissionDto => {
  const actions: Record<string, string[]> = {};
  
  // Helper function to get selected actions as string array
  const getSelectedActions = (prefix: string): string[] => {
    const selectedActions: string[] = [];
    if (data[`${prefix}_read`]) selectedActions.push('read');
    if (data[`${prefix}_create`]) selectedActions.push('create');
    if (data[`${prefix}_update`]) selectedActions.push('update');
    if (data[`${prefix}_delete`]) selectedActions.push('delete');
    return selectedActions;
  };
  
  // Get actions for each module
  const userActions = getSelectedActions('user');
  const ticketActions = getSelectedActions('ticket');
  const partnerActions = getSelectedActions('partner');
  const permissionActions = getSelectedActions('permission');
  const transactionActions = getSelectedActions('transaction');
  const organizationActions = getSelectedActions('organization');
  
  // Only include modules that have actions
  if (userActions.length > 0) actions.user = userActions;
  if (ticketActions.length > 0) actions.ticket = ticketActions;
  if (partnerActions.length > 0) actions.partner = partnerActions;
  if (permissionActions.length > 0) actions.permission = permissionActions;
  if (transactionActions.length > 0) actions.transaction = transactionActions;
  if (organizationActions.length > 0) actions.organization = organizationActions;
  
  return {
    name: data.name as string,
    code: data.code as string,
    actions: actions,
  };
};

/**
 * Convert form data to UpdatePermissionDto (string array format)
 */
export const formDataToUpdateDto = (data: CreatePermissionDto): UpdatePermissionDto => {
  const actions: Record<string, string[]> = {};
  
  // Helper function to get selected actions as string array
  const getSelectedActions = (prefix: string): string[] => {
    const selectedActions: string[] = [];
    if (data[`${prefix}_read`]) selectedActions.push('read');
    if (data[`${prefix}_create`]) selectedActions.push('create');
    if (data[`${prefix}_update`]) selectedActions.push('update');
    if (data[`${prefix}_delete`]) selectedActions.push('delete');
    return selectedActions;
  };
  
  // Get actions for each module
  const userActions = getSelectedActions('user');
  const ticketActions = getSelectedActions('ticket');
  const partnerActions = getSelectedActions('partner');
  const permissionActions = getSelectedActions('permission');
  const transactionActions = getSelectedActions('transaction');
  const organizationActions = getSelectedActions('organization');
  
  // Only include modules that have actions
  if (userActions.length > 0) actions.user = userActions;
  if (ticketActions.length > 0) actions.ticket = ticketActions;
  if (partnerActions.length > 0) actions.partner = partnerActions;
  if (permissionActions.length > 0) actions.permission = permissionActions;
  if (transactionActions.length > 0) actions.transaction = transactionActions;
  if (organizationActions.length > 0) actions.organization = organizationActions;
  
  return {
    name: data.name as string,
    code: data.code as string,
    actions: actions,
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
    is_active: permission.is_active ? 'Hoạt động' : 'Không hoạt động',
    created_at: permission.created_at,
    created_by: permission.created_by,
    updated_at: permission.updated_at,
    updated_by: permission.updated_by || 'Chưa cập nhật',
    organization_id: permission.organization_id,
  };
  
  // Convert actions to readable format based on numeric values
  if (permission.actions) {
    // Helper function to convert numeric permission to readable text
    const getPermissionText = (value: number): string => {
      const permissions: string[] = [];
      if (value & 1) permissions.push('Đọc');
      if (value & 2) permissions.push('Tạo');
      if (value & 4) permissions.push('Cập nhật');
      if (value & 8) permissions.push('Xóa');
      return permissions.length > 0 ? permissions.join(', ') : 'Không có';
    };
    
    // User permissions
    displayData.user_permissions = getPermissionText(permission.actions.user);
    
    // Ticket permissions
    displayData.ticket_permissions = getPermissionText(permission.actions.ticket);
    
    // Partner permissions
    displayData.partner_permissions = getPermissionText(permission.actions.partner);
    
    // Permission permissions
    displayData.permission_permissions = getPermissionText(permission.actions.permission);
    
    // Transaction permissions
    displayData.transaction_permissions = getPermissionText(permission.actions.transaction);
    
    // Organization permissions
    displayData.organization_permissions = getPermissionText(permission.actions.organization);
  }
  
  return displayData;
};