import React from 'react';
import { Drawer, Typography, Button, Flex, theme as antdTheme } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface CommonDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number | string;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  loading?: boolean;
}

const CommonDrawer: React.FC<CommonDrawerProps> = ({
  open,
  onClose,
  title,
  children,
  width = 400,
  anchor = 'right',
}) => {
  const { token } = antdTheme.useToken();

  return (
    <Drawer
      title={
        <Flex justify="space-between" align="center">
          <Title level={5} style={{ margin: 0, fontWeight: 700 }}>
            {title}
          </Title>
        </Flex>
      }
      placement={anchor as any}
      onClose={onClose}
      open={open}
      width={width}
      closeIcon={<CloseOutlined style={{ fontSize: '16px' }} />}
      styles={{
        header: {
          padding: '16px 24px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        },
        body: {
          padding: 0,
        }
      }}
    >
      {children}
    </Drawer>
  );
};

export default CommonDrawer;