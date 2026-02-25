import { useAuthStore } from '../stores/authStore';
import { ROLE_PERMISSIONS, PERMISSIONS } from '../types/auth';

export const useHasPermission = () => {
    const { user } = useAuthStore();

    const hasPermission = (permission: string): boolean => {
        // Nếu chưa đăng nhập, không có quyền
        if (!user || !user.role) {
            return false;
        }

        // Role Admin mặc định có toàn bộ quyền
        if (user.role === 'admin') {
            return true;
        }

        // Kiểm tra Permission theo Role trong danh sách cứng ROLE_PERMISSIONS 
        // Trong thực tế sẽ lấy từ jwtPayload?.permission hoặc từ context
        const userRolePermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];

        return userRolePermissions.includes(permission);
    };

    const hasAnyPermission = (permissions: string[]): boolean => {
        return permissions.some(hasPermission);
    };

    const hasAllPermissions = (permissions: string[]): boolean => {
        return permissions.every(hasPermission);
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        PERMISSIONS, // Export constant ra để component dễ map
    };
};
