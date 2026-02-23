import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Alert,
  Card,
  Tabs,
  Typography,
  Flex,
  ConfigProvider,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  LoginOutlined,
  UserAddOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useLogin, useSignup } from '../../hooks/useAuthApi';
import { debugJWT, logJWTInfo } from '../../utils/debugJWT';
import { Logo } from '../common/Logo';

const { Title, Text } = Typography;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', sans-serif;
  
  /* Soft Background Gradient */
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.03) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(99, 102, 241, 0.03) 0%, transparent 40%);
    z-index: 0;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1000px;
  gap: 80px;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 40px;
    text-align: center;
  }
`;

const BrandingSide = styled.div`
  flex: 1;
  max-width: 450px;
  
  @media (max-width: 1024px) {
    max-width: 100%;
  }

  .badge {
    background: #e0e7ff;
    padding: 6px 14px;
    border-radius: 100px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #4338ca;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 24px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  h1 {
    color: #0f172a !important;
    font-size: 48px !important;
    font-weight: 800 !important;
    line-height: 1.1 !important;
    margin-bottom: 24px !important;
    letter-spacing: -2px !important;
    
    span {
      display: block;
      color: #2563eb;
    }
  }

  p {
    color: #475569 !important;
    font-size: 18px !important;
    line-height: 1.6 !important;
    margin-bottom: 0 !important;
    font-weight: 500;
  }
`;

const AuthCardWrapper = styled.div`
  flex: 0 0 420px;
  
  @media (max-width: 1024px) {
    flex: 1;
    width: 100%;
    max-width: 420px;
  }
`;

const StyledCard = styled(Card)`
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 28px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
  overflow: hidden;

  .ant-card-body {
    padding: 48px;
  }
`;

const StyledTabs = styled(Tabs)`
  margin-bottom: 32px;
  
  .ant-tabs-nav::before {
    border-bottom: 1px solid #f1f5f9;
  }
  
  .ant-tabs-tab {
    padding: 10px 0;
    margin: 0 16px 0 0 !important;
    
    .ant-tabs-tab-btn {
      color: #94a3b8;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.5px;
    }
  }
  
  .ant-tabs-ink-bar {
    background: #2563eb;
    height: 3px !important;
    border-radius: 3px;
  }
`;

const StyledItemLabel = styled(Text)`
  font-weight: 700;
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
  display: block;
`;

const StyledInput = styled(Input)`
  border: 1px solid #e2e8f0 !important;
  height: 52px;
  border-radius: 14px !important;
  font-family: inherit;
  
  &:hover, &:focus {
    border-color: #2563eb !important;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.06) !important;
  }

  .ant-input-prefix {
    margin-right: 12px;
    color: #94a3b8;
  }
`;

const StyledPassword = styled(Input.Password)`
  border: 1px solid #e2e8f0 !important;
  height: 52px;
  border-radius: 14px !important;
  font-family: inherit;
  
  &:hover, &:focus {
    border-color: #2563eb !important;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.06) !important;
  }

  .ant-input-prefix {
    margin-right: 12px;
    color: #94a3b8;
  }
`;

const SubmitButton = styled(Button)`
  height: 54px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 16px;
  background: #2563eb !important;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.25) !important;
  margin-top: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background: #1d4ed8 !important;
    box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.3) !important;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LoginForm: React.FC = () => {
  const [tabKey, setTabKey] = useState('login');
  const [form] = Form.useForm();

  const loginMutation = useLogin();
  const signupMutation = useSignup();

  useEffect(() => {
    if (loginMutation.isSuccess || signupMutation.isSuccess) {
      debugJWT();
      logJWTInfo();
    }
  }, [loginMutation.isSuccess, signupMutation.isSuccess]);

  const onFinish = (values: any) => {
    if (tabKey === 'login') {
      loginMutation.mutate({
        phone_number: values.phone_number,
        password: values.password,
      });
    } else {
      signupMutation.mutate({
        name: values.name,
        phone_number: values.phone_number,
        password: values.password,
      });
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 14,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          colorText: '#1e293b',
          colorTextDescription: '#64748b',
          colorTextHeading: '#0f172a',
        },
      }}
    >
      <LoginContainer>
        <ContentWrapper>
          <BrandingSide>
            <div className="badge">
              <SafetyCertificateOutlined />
              Hệ thống tin cậy
            </div>
            <h1>
              Quản trị tối ưu
              <span>Daily Veso</span>
            </h1>
            <p>
              Giải pháp quản lý hiện đại, giúp bạn vận hành doanh nghiệp một cách thông minh và bền vững.
            </p>
          </BrandingSide>

          <AuthCardWrapper>
            <StyledCard>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <Logo size={60} variant="icon" showText={false} style={{ margin: '0 auto 16px' }} />
                <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
                  {tabKey === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
                </Title>
              </div>

              <StyledTabs
                activeKey={tabKey}
                onChange={setTabKey}
                centered
                items={[
                  { key: 'login', label: 'ĐĂNG NHẬP', icon: <LoginOutlined /> },
                  { key: 'signup', label: 'ĐĂNG KÝ', icon: <UserAddOutlined /> },
                ]}
              />

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
              >
                {tabKey === 'signup' && (
                  <Form.Item
                    name="name"
                    label={<StyledItemLabel>Họ và tên</StyledItemLabel>}
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    style={{ marginBottom: '24px' }}
                  >
                    <StyledInput prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                  </Form.Item>
                )}

                <Form.Item
                  name="phone_number"
                  label={<StyledItemLabel>Số điện thoại</StyledItemLabel>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                    { pattern: /^[0-9+ ]+$/, message: 'Số điện thoại không hợp lệ' }
                  ]}
                  style={{ marginBottom: '24px' }}
                >
                  <StyledInput prefix={<PhoneOutlined />} placeholder="09xx xxx xxx" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={
                    <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                      <StyledItemLabel style={{ marginBottom: 0 }}>Mật khẩu</StyledItemLabel>
                      {tabKey === 'login' && (
                        <Button type="link" size="small" style={{ padding: 0, fontWeight: 600, fontSize: '12px' }}>
                          Quên mật khẩu?
                        </Button>
                      )}
                    </Flex>
                  }
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                  style={{ marginBottom: '32px' }}
                >
                  <StyledPassword prefix={<LockOutlined />} placeholder="••••••••" />
                </Form.Item>

                {(loginMutation.error || signupMutation.error) && (
                  <Alert
                    type="error"
                    showIcon
                    message={loginMutation.error?.message || signupMutation.error?.message || 'Thông tin không hợp lệ'}
                    style={{ marginBottom: '24px', borderRadius: '12px' }}
                  />
                )}

                <Form.Item style={{ marginBottom: 0 }}>
                  <SubmitButton
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loginMutation.isPending || signupMutation.isPending}
                  >
                    {tabKey === 'login' ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
                  </SubmitButton>
                </Form.Item>
              </Form>

              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Text type="secondary" style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, letterSpacing: '1px' }}>
                  © 2024 DAILY VESO SYSTEM
                </Text>
              </div>
            </StyledCard>
          </AuthCardWrapper>
        </ContentWrapper>
      </LoginContainer>
    </ConfigProvider>
  );
};

export default LoginForm;