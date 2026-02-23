import React from 'react';
import { Flex, Spin, Alert, Typography, Result, Button } from 'antd';
import { useIsAuthenticated } from '../../hooks/useAuthApi';
import LoginForm from './LoginForm';

const { Text, Title } = Typography;

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
      <Flex
        vertical
        justify="center"
        align="center"
        style={{ minHeight: '100vh' }}
        gap={16}
      >
        <Spin size="large" />
        <Text strong>Đang kiểm tra xác thực...</Text>
      </Flex>
    );
  }

  // Error state
  if (error) {
    return (
      <Flex
        vertical
        justify="center"
        align="center"
        style={{ minHeight: '100vh', padding: '24px' }}
        gap={16}
      >
        <Result
          status="error"
          title="Lỗi xác thực"
          subTitle={error}
          extra={[
            <Text key="desc" type="secondary">Vui lòng thử lại hoặc liên hệ quản trị viên.</Text>
          ]}
        />
      </Flex>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (fallback as any) || <LoginForm />;
  }

  // Check role permission
  if (requiredRole && user.role !== requiredRole) {
    return (
      <Flex
        vertical
        justify="center"
        align="center"
        style={{ minHeight: '100vh', padding: '24px' }}
        gap={16}
      >
        <Result
          status="warning"
          title="Không có quyền truy cập"
          subTitle={`Bạn không có quyền truy cập trang này. Vai trò yêu cầu: ${requiredRole}`}
          extra={[
            <Flex vertical align="center" gap={8} key="role-info">
              <Text>Vai trò hiện tại: <Text strong>{user.role}</Text></Text>
              <Button type="primary" onClick={() => window.location.href = '/'}>
                Về Trang Chủ
              </Button>
            </Flex>
          ]}
        />
      </Flex>
    );
  }

  // Authenticated and authorized
  return <>{children}</>;
};

export default AuthGuard;
