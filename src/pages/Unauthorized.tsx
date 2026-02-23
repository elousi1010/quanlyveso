import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Alert,
  Tag,
  Result,
  Card,
  Flex,
  theme as antdTheme
} from 'antd';
import {
  LockOutlined,
  ArrowLeftOutlined,
  HomeOutlined
} from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

const Unauthorized: React.FC = () => {
  const { token } = antdTheme.useToken();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    from?: { pathname: string };
    requiredRole?: string;
    requiredRoles?: string[];
    userRole?: string;
  };
  const from = state?.from?.pathname || '/';
  const requiredRole = state?.requiredRole;
  const requiredRoles = state?.requiredRoles;
  const userRole = state?.userRole;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{ minHeight: '100vh', padding: '24px', backgroundColor: token.colorFillAlter }}
    >
      <Card style={{ maxWidth: 600, width: '100%', borderRadius: '12px', boxShadow: token.boxShadow }}>
        <Result
          status="403"
          title={<Title level={2} style={{ margin: 0 }}>Truy cập bị từ chối</Title>}
          subTitle="Bạn không có quyền truy cập trang này."
          extra={[
            <Flex gap={12} justify="center" key="actions">
              <Button
                type="primary"
                icon={<ArrowLeftOutlined />}
                onClick={handleGoBack}
                size="large"
              >
                Quay lại
              </Button>
              <Button
                icon={<HomeOutlined />}
                onClick={handleGoHome}
                size="large"
              >
                Trang chủ
              </Button>
            </Flex>
          ]}
        >
          <div style={{ textAlign: 'left' }}>
            <Alert
              message={<Text strong>Thông tin chi tiết</Text>}
              description={
                <div style={{ marginTop: '8px' }}>
                  <Paragraph style={{ margin: 0 }}>
                    • Vai trò hiện tại: <Tag color="default">{userRole || 'Khách'}</Tag>
                  </Paragraph>
                  {requiredRole && (
                    <Paragraph style={{ margin: '4px 0 0 0' }}>
                      • Vai trò yêu cầu: <Tag color="blue">{requiredRole}</Tag>
                    </Paragraph>
                  )}
                  {requiredRoles && (
                    <Paragraph style={{ margin: '4px 0 0 0' }}>
                      • Vai trò yêu cầu: {requiredRoles.map(role => (
                        <Tag key={role} color="blue">{role}</Tag>
                      ))}
                    </Paragraph>
                  )}
                  <Paragraph style={{ margin: '4px 0 0 0' }}>
                    • Trang yêu cầu: <Text code>{from}</Text>
                  </Paragraph>
                </div>
              }
              type="warning"
              showIcon
            />

            <Paragraph style={{ textAlign: 'center', marginTop: '24px', color: token.colorTextSecondary }}>
              Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ quản trị viên.
            </Paragraph>
          </div>
        </Result>
      </Card>
    </Flex>
  );
};

export default Unauthorized;
