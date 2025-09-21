import React from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useIsAuthenticated } from '../../hooks/useAuthApi';
import LoginForm from './LoginForm';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole, 
  fallback 
}) => {
  const { isAuthenticated, user, isLoading, error } = useIsAuthenticated();

  // Loading state
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <Box>Đang kiểm tra xác thực...</Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
        p={3}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <strong>Lỗi xác thực:</strong> {error}
        </Alert>
        <Box>
          Vui lòng thử lại hoặc liên hệ quản trị viên.
        </Box>
      </Box>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return fallback || <LoginForm />;
  }

  // Check role permission
  if (requiredRole && user.role !== requiredRole) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
        p={3}
      >
        <Alert severity="warning" sx={{ maxWidth: 500 }}>
          <strong>Không có quyền truy cập</strong>
        </Alert>
        <Box>
          Bạn không có quyền truy cập trang này. Vai trò yêu cầu: {requiredRole}
        </Box>
        <Box>
          Vai trò hiện tại: {user.role}
        </Box>
      </Box>
    );
  }

  // Authenticated and authorized
  return <>{children}</>;
};

export default AuthGuard;
