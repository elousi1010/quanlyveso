import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from '../../hooks/useAuthState';
import LoadingScreen from '../common/LoadingScreen';
import LoginForm from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredRoles,
  fallback
}) => {
  const location = useLocation();
  const { isAuthenticated, user, isLoading, hasRole, hasAnyRole } = useAuthState();

  // Loading state
  if (isLoading) {
    return <LoadingScreen message="Đang kiểm tra quyền truy cập..." />;
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return fallback || <LoginForm />;
  }

  // Check single role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ from: location, requiredRole, userRole: user.role }}
        replace 
      />
    );
  }

  // Check multiple roles requirement
  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ from: location, requiredRoles, userRole: user.role }}
        replace 
      />
    );
  }

  // Authorized
  return <>{children}</>;
};

export default ProtectedRoute;
