import { api } from '@/utils/api';
import type { 
  Permission, 
  CreatePermissionDto, 
  UpdatePermissionDto, 
  SetPermissionsForUserDto,
  PermissionResponse, 
  PermissionSearchParams 
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
    return (response as any).data;
  },

  // Get all base permissions
  getBasePermissions: async (): Promise<Permission[]> => {
    const response = await api.get(`${API_BASE}/permissions/base`);
    return (response as any).data;
  },

  // Get permission by ID
  getById: async (id: string): Promise<Permission> => {
    const response = await api.get(`${API_BASE}/permissions/${id}`);
    return (response as any).data;
  },

  // Create new permission
  create: async (data: CreatePermissionDto): Promise<Permission> => {
    const response = await api.post(`${API_BASE}/permissions`, data);
    return (response as any).data;
  },

  // Update permission
  update: async (id: string, data: UpdatePermissionDto): Promise<Permission> => {
    const response = await api.patch(`${API_BASE}/permissions/${id}`, data);
    return (response as any).data;
  },

  // Delete permission
  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/permissions/${id}`);
  },

  // Set permissions for user
  setForUser: async (id: string, data: SetPermissionsForUserDto): Promise<void> => {
    await api.put(`${API_BASE}/permissions/set-for-user/${id}`, data);
  },
};
