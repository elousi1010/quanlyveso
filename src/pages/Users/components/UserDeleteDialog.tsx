import React from 'react';
import {
  Modal,
  Button,
  Typography,
  Avatar,
  Flex,
  theme as antdTheme
} from 'antd';
import {
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { User } from '../types';

const { Text } = Typography;

interface UserDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  isDeleting: boolean;
}

const UserDeleteDialog: React.FC<UserDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  user,
  isDeleting,
}) => {
  const { token } = antdTheme.useToken();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onConfirm}
      confirmLoading={isDeleting}
      title={
        <Flex align="center" gap={12}>
          <ExclamationCircleOutlined style={{ color: token.colorError, fontSize: '22px' }} />
          <Text strong style={{ fontSize: '16px' }}>Xác nhận xóa người dùng</Text>
        </Flex>
      }
      footer={[
        <Button key="back" onClick={onClose} disabled={isDeleting}>
          Hủy
        </Button>,
        <Button
          key="submit"
          danger
          type="primary"
          loading={isDeleting}
          onClick={onConfirm}
        >
          Xóa người dùng
        </Button>,
      ]}
      width={480}
      centered
    >
      <div style={{ padding: '16px 0' }}>
        <Flex gap={16} align="center" style={{ marginBottom: '24px' }}>
          <Avatar
            size={64}
            style={{
              backgroundColor: token.colorPrimaryBg,
              color: token.colorPrimary,
              fontSize: '24px',
              fontWeight: 600
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Flex vertical>
            <Text strong style={{ fontSize: '18px' }}>{user?.name}</Text>
            <Text type="secondary">
              {user?.phone_number} • <Text code>{user?.role}</Text>
            </Text>
          </Flex>
        </Flex>

        <div style={{
          padding: '16px',
          backgroundColor: token.colorErrorBg,
          borderRadius: '8px',
          border: `1px solid ${token.colorErrorBorder}`
        }}>
          <Flex gap={12} align="flex-start">
            <ExclamationCircleOutlined style={{ color: token.colorError, marginTop: '4px' }} />
            <Text type="danger">
              Bạn có chắc chắn muốn xóa người dùng này? Hành động này sẽ xóa vĩnh viễn
              tất cả dữ liệu liên quan và <strong>không thể hoàn tác</strong>.
            </Text>
          </Flex>
        </div>
      </div>
    </Modal>
  );
};

export default UserDeleteDialog;
