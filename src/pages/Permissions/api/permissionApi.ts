import { api } from '@/utils/api';
import type { 
  Permission, 
  CreatePermissionDto, 
  UpdatePermissionDto, 
  SetPermissionsForUserDto,
  BulkPermissionAssignment,
  PermissionTemplate,
  CreatePermissionTemplateDto,
  UpdatePermissionTemplateDto,
  PermissionResponse, 
  PermissionSearchParams,
  BasePermissionsResponse,
  ApiResponse
} from '../types';

const API_BASE = 'https://lottery.esimvn.net/api/v1';

export const permissionApi = {
  // Get all permissions with pagination and search
  getAll: async (params: PermissionSearchParams = {}): Promise<PermissionResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.searchKey) searchParams.append('searchKey', params.searchKey);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const response = await api.get(`${API_BASE}/permissions?${searchParams.toString()}`);
    const apiResponse = response as ApiResponse<PermissionResponse>;
    return apiResponse.data;
  },

  // Get all base permissions
  getBasePermissions: async (): Promise<BasePermissionsResponse> => {
    const response = await api.get(`${API_BASE}/permissions/base`);
    const apiResponse = response as ApiResponse<BasePermissionsResponse>;
    return apiResponse.data;
  },

  // Get permission by ID
  getById: async (id: string): Promise<Permission> => {
    const response = await api.get(`${API_BASE}/permissions/${id}`);
    const apiResponse = response as ApiResponse<Permission>;
    return apiResponse.data;
  },

  // Create new permission
  create: async (data: CreatePermissionDto): Promise<Permission> => {
    const response = await api.post(`${API_BASE}/permissions`, data);
    const apiResponse = response as ApiResponse<Permission>;
    return apiResponse.data;
  },

  // Update permission
  update: async (id: string, data: UpdatePermissionDto): Promise<Permission> => {
    const response = await api.patch(`${API_BASE}/permissions/${id}`, data);
    const apiResponse = response as ApiResponse<Permission>;
    return apiResponse.data;
  },

  // Delete permission
  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/permissions/${id}`);
  },

  // Assign permission to user (id = permission_id, body = { user_id })
  setForUser: async (permissionId: string, data: SetPermissionsForUserDto): Promise<void> => {
    await api.put(`${API_BASE}/permissions/set-for-user/${permissionId}`, data);
  },

  // Bulk assign permissions to multiple users (Mock implementation)
  bulkAssignPermissions: async (data: BulkPermissionAssignment): Promise<void> => {
    // Mock implementation - replace with real API when available
    console.log('Bulk assigning permissions:', data);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  // Get user's current permissions (Mock implementation)
  getUserPermissions: async (userId: string): Promise<Permission[]> => {
    // Mock implementation - replace with real API when available
    console.log('Getting permissions for user:', userId);
    
    // Tạo dữ liệu mẫu dựa trên userId
    const mockPermissions: Permission[] = [
      {
        id: '1',
        name: 'Read Users',
        code: 'users.read',
        description: 'Xem danh sách người dùng',
        actions: { user: ['read'] },
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2', 
        name: 'Create Users',
        code: 'users.create',
        description: 'Tạo người dùng mới',
        actions: { user: ['create'] },
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];

    // Trả về một số quyền ngẫu nhiên dựa trên userId
    const userHash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const numPermissions = Math.abs(userHash) % 3 + 1; // 1-3 permissions
    return mockPermissions.slice(0, numPermissions);
  },

  // Get permission templates (Mock data for now)
  getTemplates: async (): Promise<PermissionTemplate[]> => {
    // Mock data - replace with real API when available
    return [
      {
        id: '1',
        name: 'Admin Template',
        role: 'admin',
        description: 'Full access template for administrators',
        permission_ids: [],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'User Template',
        role: 'user',
        description: 'Basic access template for regular users',
        permission_ids: [],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  },

  // Create permission template (Mock implementation)
  createTemplate: async (data: CreatePermissionTemplateDto): Promise<PermissionTemplate> => {
    // Mock implementation - replace with real API when available
    const template: PermissionTemplate = {
      id: Date.now().toString(),
      ...data,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return template;
  },

  // Update permission template (Mock implementation)
  updateTemplate: async (id: string, data: UpdatePermissionTemplateDto): Promise<PermissionTemplate> => {
    // Mock implementation - replace with real API when available
    const template: PermissionTemplate = {
      id,
      name: data.name || 'Updated Template',
      role: data.role || 'user',
      description: data.description || '',
      permission_ids: data.permission_ids || [],
      is_active: data.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return template;
  },

  // Delete permission template (Mock implementation)
  deleteTemplate: async (id: string): Promise<void> => {
    // Mock implementation - replace with real API when available
    console.log('Deleting template:', id);
  },

  // Apply template to user (Mock implementation)
  applyTemplateToUser: async (userId: string, templateId: string): Promise<void> => {
    // Mock implementation - replace with real API when available
    console.log('Applying template', templateId, 'to user', userId);
  },
};
