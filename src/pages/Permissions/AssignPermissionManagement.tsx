import React, { useState, useCallback } from 'react';
import {
  Typography,
  Button,
  Card,
  Avatar,
  Tag,
  Row,
  Col,
  Empty,
  Flex,
  theme as antdTheme,
  Spin,
} from 'antd';
import {
  UserOutlined,
  SafetyCertificateOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../Users/api';
import { usePermissionMutations } from './hooks/usePermissionMutations';
import { usePermissions } from './hooks/usePermissions';
import { UserPermissionAssignment } from './components';
import { CommonSnackbar, CommonHeader } from '@/components/common';
import type { User } from './types';

const { Text, Title } = Typography;

export const AssignPermissionManagement: React.FC = () => {
  const { token } = antdTheme.useToken();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Fetch users
  const { data: usersResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getUsers(),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch permissions to calculate user permissions
  const { data: permissionsData } = usePermissions();

  const handleAssignPermission = useCallback((user: User) => {
    setSelectedUser(user);
    setAssignDialogOpen(true);
  }, []);

  const handleAssignSuccess = useCallback(() => {
    setSnackbar({
      open: true,
      message: 'Gán quyền hạn thành công',
      severity: 'success',
    });
    setAssignDialogOpen(false);
    setSelectedUser(null);
    // Refetch data to update permissions count
    refetch();
  }, [refetch]);

  const handleCloseDialog = useCallback(() => {
    setAssignDialogOpen(false);
    setSelectedUser(null);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Calculate user permissions count
  const getUserPermissionsCount = useCallback((userId: string): number => {
    if (!permissionsData?.data) return 0;

    return permissionsData.data.filter(permission =>
      permission.users?.includes(userId)
    ).length;
  }, [permissionsData]);

  const users = usersResponse?.data?.data || [];

  if (error) {
    return (
      <Flex style={{ padding: '24px' }}>
        <Alert
          message="Lỗi"
          description={`Lỗi khi tải danh sách người dùng: ${(error as Error).message}`}
          type="error"
          showIcon
        />
      </Flex>
    );
  }

  return (
    <Flex vertical style={{ height: '100%' }}>
      {/* Header */}
      <CommonHeader
        title="Gán quyền hạn"
        subtitle="Gán quyền hạn cho các người dùng trong hệ thống"
        onCreate={() => { }} // No create action for this page
        onRefresh={handleRefresh}
        loading={isLoading}
        showRefresh={true}
        createButtonText=""
        showBulkEdit={false}
      />

      {/* Users Grid */}
      <div style={{
        marginTop: '16px',
        flex: 1,
        overflow: 'auto',
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: token.boxShadowSecondary
      }}>
        <Title level={4} style={{ marginBottom: '24px', fontWeight: 600 }}>
          Danh sách người dùng ({users.length})
        </Title>

        {isLoading ? (
          <Flex justify="center" align="center" style={{ padding: '64px' }}>
            <Spin size="large" tip="Đang tải danh sách người dùng..." />
          </Flex>
        ) : users.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Flex vertical align="center">
                <Text type="secondary">Không có người dùng nào</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>Chưa có người dùng nào trong hệ thống</Text>
              </Flex>
            }
          />
        ) : (
          <Row gutter={[24, 24]}>
            {users.map((user: User) => (
              <Col xs={24} sm={12} md={8} xl={6} key={user.id}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    borderRadius: '12px',
                    border: `1px solid ${token.colorBorderSecondary}`
                  }}
                  styles={{ body: { padding: '24px' } }}
                  actions={[
                    <Button
                      type="link"
                      icon={<SafetyCertificateOutlined />}
                      onClick={() => handleAssignPermission(user)}
                      key="assign"
                    >
                      Gán quyền hạn
                    </Button>
                  ]}
                >
                  <Card.Meta
                    avatar={
                      <Avatar
                        size={48}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: token.colorPrimary }}
                      />
                    }
                    title={
                      <Text strong style={{ fontSize: '16px' }}>{user.name}</Text>
                    }
                    description={
                      <Flex vertical gap={12}>
                        <Text type="secondary" style={{ fontFamily: 'monospace' }}>
                          {user.phone_number}
                        </Text>

                        <Flex gap={8}>
                          <Tag color={user.role === 'admin' ? 'error' : 'processing'} bordered={false}>
                            {user.role.toUpperCase()}
                          </Tag>
                          <Tag color={user.is_active ? 'success' : 'error'} bordered={false}>
                            {user.is_active ? 'Hoạt động' : 'Không hoạt động'}
                          </Tag>
                        </Flex>

                        <div style={{ marginTop: '8px' }}>
                          <Text type="secondary" style={{ display: 'block' }}>
                            Quyền hạn: <Text strong color={token.colorPrimary}>{getUserPermissionsCount(user.id)}</Text> quyền
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Tạo: {new Date(user.created_at).toLocaleDateString('vi-VN')}
                          </Text>
                        </div>
                      </Flex>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* User Permission Assignment Modal */}
      <UserPermissionAssignment
        open={assignDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleAssignSuccess}
        user={selectedUser}
      />

      {/* Snackbar */}
      <CommonSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Flex>
  );
};
