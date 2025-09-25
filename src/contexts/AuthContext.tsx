import React, { useState, useEffect } from 'react';
import type { User, AuthContextType, UserRole } from '@/types/auth';
import { ROLE_PERMISSIONS } from '@/types/auth';
import { useLogout } from '@/hooks/useAuthApi';
import { useAuthStore } from '@/stores/authStore';
import { mapApiRoleToSystemRole } from '@/utils/roleMapping';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Sử dụng Zustand store
  const { isAuthenticated, user: apiUser, isLoading } = useAuthStore();
  const logoutMutation = useLogout();
  
  // Convert API user to local User type
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (apiUser && isAuthenticated) {
      // Convert API user to local User type
      const mappedRole = mapApiRoleToSystemRole(apiUser.role);

      const localUser: User = {
        id: apiUser?.sub || '',
        username: apiUser.phone_number,
        email: `${apiUser.phone_number}@example.com`,
        fullName: apiUser.name,
        role: mappedRole as UserRole,
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date(),
      };
      setUser(localUser);
    } else {
      setUser(null);
    }
  }, [apiUser, isAuthenticated]);

  // Mock login function for backward compatibility
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (username: string, password: string): Promise<boolean> => {
    // This function is now handled by the LoginForm component using useLogin hook
    // Return false to indicate this method is deprecated

    return false;
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Admin và User có tất cả quyền
    if (user.role === 'admin' || user.role === 'user') return true;
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    hasPermission,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
