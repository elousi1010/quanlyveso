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
  message,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  LoginOutlined,
  UserAddOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useLogin, useSignup } from '../../hooks/useAuthApi';
import { debugJWT, logJWTInfo } from '../../utils/debugJWT';
import { Logo } from '../common/Logo';

const { Title, Text } = Typography;

const LoginForm: React.FC = () => {
  const [tabKey, setTabKey] = useState('login');
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const loginMutation = useLogin();
  const signupMutation = useSignup();

  useEffect(() => {
    if (loginMutation.isSuccess) {
      debugJWT();
      logJWTInfo();
    }
  }, [loginMutation.isSuccess]);

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
      }, {
        onSuccess: () => {
          messageApi.success('Đăng ký thành công, vui lòng đăng nhập!');
          setTabKey('login');
          // Preserve phone_number but clear password
          form.setFieldsValue({
            password: '',
          });
        }
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
      {contextHolder}
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: #f8fafc;
          position: relative;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .login-container::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.03) 0%, transparent 40%),
                      radial-gradient(circle at 90% 80%, rgba(99, 102, 241, 0.03) 0%, transparent 40%);
          z-index: 0;
        }
        .content-wrapper {
          display: flex;
          width: 100%;
          max-width: 1000px;
          gap: 80px;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 1024px) {
          .content-wrapper {
            flex-direction: column;
            gap: 40px;
            text-align: center;
          }
        }
        .branding-side {
          flex: 1;
          max-width: 450px;
        }
        @media (max-width: 1024px) {
          .branding-side {
            max-width: 100%;
          }
        }
        .branding-side .badge {
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
        .branding-side h1 {
          color: #0f172a !important;
          font-size: 48px !important;
          font-weight: 800 !important;
          line-height: 1.1 !important;
          margin-bottom: 24px !important;
          letter-spacing: -2px !important;
        }
        .branding-side h1 span {
          display: block;
          color: #2563eb;
        }
        .branding-side p {
          color: #475569 !important;
          font-size: 18px !important;
          line-height: 1.6 !important;
          margin-bottom: 0 !important;
          font-weight: 500;
        }
        .auth-card-wrapper {
          flex: 0 0 420px;
        }
        @media (max-width: 1024px) {
          .auth-card-wrapper {
            flex: 1;
            width: 100%;
            max-width: 420px;
          }
        }
        .styled-card {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 28px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }
        .styled-card .ant-card-body {
          padding: 48px;
        }
        .styled-tabs {
          margin-bottom: 32px;
        }
        .styled-tabs .ant-tabs-nav::before {
          border-bottom: 1px solid #f1f5f9;
        }
        .styled-tabs .ant-tabs-tab {
          padding: 10px 0;
          margin: 0 16px 0 0 !important;
        }
        .styled-tabs .ant-tabs-tab-btn {
          color: #94a3b8;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.5px;
        }
        .styled-tabs .ant-tabs-ink-bar {
          background: #2563eb;
          height: 3px !important;
          border-radius: 3px;
        }
        .styled-item-label {
          font-weight: 700;
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
          display: block;
        }
        .styled-input {
          border: 1px solid #e2e8f0 !important;
          height: 52px;
          border-radius: 14px !important;
          font-family: inherit;
        }
        .styled-input:hover, .styled-input:focus, .styled-input:focus-within {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.06) !important;
        }
        .styled-input .ant-input-prefix {
          margin-right: 12px;
          color: #94a3b8;
        }
        .submit-button {
          height: 54px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 16px;
          background: #2563eb !important;
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.25) !important;
          margin-top: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .submit-button:hover {
          background: #1d4ed8 !important;
          box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.3) !important;
          transform: translateY(-1px);
        }
        .submit-button:active {
          transform: translateY(0);
        }
      `}</style>
      <div className="login-container">
        <div className="content-wrapper">
          <div className="branding-side">
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
          </div>

          <div className="auth-card-wrapper">
            <Card className="styled-card">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <Logo size={60} variant="icon" showText={false} style={{ margin: '0 auto 16px' }} />
                <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
                  {tabKey === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
                </Title>
              </div>

              <Tabs
                className="styled-tabs"
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
                    label={<div className="styled-item-label">Họ và tên</div>}
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    style={{ marginBottom: '24px' }}
                  >
                    <Input className="styled-input" prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                  </Form.Item>
                )}

                <Form.Item
                  name="phone_number"
                  label={<div className="styled-item-label">Số điện thoại</div>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                    { pattern: /^[0-9+ ]+$/, message: 'Số điện thoại không hợp lệ' }
                  ]}
                  style={{ marginBottom: '24px' }}
                >
                  <Input className="styled-input" prefix={<PhoneOutlined />} placeholder="09xx xxx xxx" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={
                    <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                      <div className="styled-item-label" style={{ marginBottom: 0 }}>Mật khẩu</div>
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
                  <Input.Password className="styled-input" prefix={<LockOutlined />} placeholder="••••••••" />
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
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    className="submit-button"
                    loading={loginMutation.isPending || signupMutation.isPending}
                  >
                    {tabKey === 'login' ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
                  </Button>
                </Form.Item>
              </Form>

              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Text type="secondary" style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, letterSpacing: '1px' }}>
                  © 2024 DAILY VESO SYSTEM
                </Text>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default LoginForm;