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
} from '../types';

const API_BASE = '/api/v1/permissions';

/**
 * Permission API
 * 
 * Standardized API service for managing system permissions and roles.
 */
export const permissionApi = {
  // Get all permissions with pagination and search
  getAll: async (params: PermissionSearchParams = {}): Promise<PermissionResponse> => {
    const response = await api.get(API_BASE, { params });
    return (response as any).data;
  },

  // Get all base permissions
  getBasePermissions: async (): Promise<BasePermissionsResponse> => {
    const response = await api.get(`${API_BASE}/base`);
    return (response as any).data;
  },

  // Get permission by ID
  getById: async (id: string): Promise<Permission> => {
    const response = await api.get(`${API_BASE}/${id}`);
    return (response as any).data;
  },

  // Create new permission
  create: async (data: CreatePermissionDto): Promise<Permission> => {
    const response = await api.post(API_BASE, data);
    return (response as any).data;
  },

  // Update permission
  update: async (id: string, data: UpdatePermissionDto): Promise<Permission> => {
    const response = await api.patch(`${API_BASE}/${id}`, data);
    return (response as any).data;
  },

  // Delete permission
  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/${id}`);
  },

  // Assign permission to user
  setForUser: async (permissionId: string, data: SetPermissionsForUserDto): Promise<void> => {
    await api.put(`${API_BASE}/set-for-user/${permissionId}`, data);
  },

  // Bulk assign permissions to multiple users
  bulkAssignPermissions: async (data: BulkPermissionAssignment): Promise<void> => {
    console.log('Bulk assigning permissions:', data);
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  // Get user's current permissions
  getUserPermissions: async (userId: string): Promise<Permission[]> => {
    console.log('Getting permissions for user:', userId);
    // Mock data for now as per original implementation
    return [];
  },

  // Template management
  getTemplates: async (): Promise<PermissionTemplate[]> => {
    // Mock data as per original implementation
    return [];
  },

  createTemplate: async (data: CreatePermissionTemplateDto): Promise<PermissionTemplate> => {
    return {
      id: 'new',
      description: '',
      permission_ids: [],
      ...data,
      is_active: true,
      created_at: '',
      updated_at: ''
    };
  },

  updateTemplate: async (id: string, data: UpdatePermissionTemplateDto): Promise<PermissionTemplate> => {
    return {
      id,
      name: '',
      role: 'user',
      description: '',
      permission_ids: [],
      ...data,
      is_active: true,
      created_at: '',
      updated_at: ''
    };
  },

  deleteTemplate: async (id: string): Promise<void> => {
    console.log('Deleting template:', id);
  },

  applyTemplateToUser: async (userId: string, templateId: string): Promise<void> => {
    console.log('Applying template', templateId, 'to user', userId);
  },
};
