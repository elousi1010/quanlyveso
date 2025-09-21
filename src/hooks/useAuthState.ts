import { useLogout } from './useAuthApi';
import { useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useAuthState = () => {
  const { isAuthenticated, user, isLoading, error } = useAuthStore();
  const logoutMutation = useLogout();

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'owner';
  const isEmployee = user?.role === 'employee';
  const isSeller = user?.role === 'seller';
  const isUser = user?.role === 'user';

  const hasRole = useCallback((role: string) => {
    return user?.role === role;
  }, [user?.role]);

  const hasAnyRole = useCallback((roles: string[]) => {
    return user?.role ? roles.includes(user.role) : false;
  }, [user?.role]);

  return {
    // Auth state
    isAuthenticated,
    user,
    isLoading,
    error,
    
    // Role checks
    isAdmin,
    isOwner,
    isEmployee,
    isSeller,
    isUser,
    hasRole,
    hasAnyRole,
    
    // Actions
    logout,
    isLoggingOut: logoutMutation.isPending,
  };
};
