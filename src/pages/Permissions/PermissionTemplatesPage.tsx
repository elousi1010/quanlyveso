import React from 'react';
import { Typography, Flex, theme as antdTheme } from 'antd';
import PermissionTemplates from './components/PermissionTemplates';

const { Title, Paragraph } = Typography;

const PermissionTemplatesPage: React.FC = () => {
  const { token } = antdTheme.useToken();

  return (
    <Flex vertical gap={24}>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: token.boxShadowSecondary,
        border: `1px solid ${token.colorBorderSecondary}`
      }}>
        <Title level={2} style={{ margin: 0 }}>
          Template quyền hạn
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0 0' }}>
          Quản lý template quyền hạn theo role để gán nhanh cho user
        </Paragraph>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: token.boxShadowSecondary,
        border: `1px solid ${token.colorBorderSecondary}`
      }}>
        <PermissionTemplates />
      </div>
    </Flex>
  );
};

export default PermissionTemplatesPage;
