import React, { useState, useEffect } from 'react';
import { Typography, Flex, Alert, Spin, message, theme as antdTheme } from 'antd';
import PermissionMatrix from './components/PermissionMatrix';
import { useUsers } from '@/pages/Users/hooks/useUserApi';
import type { User } from '@/pages/Users/types/userTypes';

const { Title, Paragraph } = Typography;

const PermissionMatrixPage: React.FC = () => {
  const { token } = antdTheme.useToken();
  const [users, setUsers] = useState<User[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Lấy danh sách users
  const { data: usersData, isLoading, error } = useUsers({ limit: 1000 });

  useEffect(() => {
    if (usersData?.data?.data) {
      setUsers(usersData.data.data);
    }
  }, [usersData]);

  const handleSuccess = () => {
    messageApi.success('Cập nhật ma trận quyền hạn thành công!');
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ height: '400px' }}>
        <Spin size="large" tip="Đang tải danh sách người dùng..." />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex vertical gap={24}>
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: token.boxShadowSecondary
        }}>
          <Title level={2} style={{ margin: 0 }}>Ma trận quyền hạn</Title>
          <Paragraph type="secondary" style={{ margin: '8px 0 0 0' }}>
            Quản lý quyền hạn dạng ma trận trực quan cho tất cả user
          </Paragraph>
        </div>
        <Alert
          message="Lỗi"
          description="Không thể tải danh sách user. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </Flex>
    );
  }

  return (
    <Flex vertical gap={24}>
      {contextHolder}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: token.boxShadowSecondary,
        border: `1px solid ${token.colorBorderSecondary}`
      }}>
        <Title level={2} style={{ margin: 0 }}>Ma trận quyền hạn</Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0 0' }}>
          Quản lý quyền hạn dạng ma trận trực quan cho tất cả user ({users.length} user)
        </Paragraph>
      </div>

      {users.length === 0 ? (
        <Alert
          message="Thông báo"
          description="Không có user nào để hiển thị ma trận quyền hạn."
          type="info"
          showIcon
        />
      ) : (
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: token.boxShadowSecondary,
          border: `1px solid ${token.colorBorderSecondary}`
        }}>
          <PermissionMatrix
            users={users}
            onSuccess={handleSuccess}
          />
        </div>
      )}
    </Flex>
  );
};

export default PermissionMatrixPage;
