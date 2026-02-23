import React from 'react';
import { Modal, Button, Typography, Alert, Space, Flex, Avatar, theme as antdTheme } from 'antd';
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';

const { Text, Title } = Typography;

interface CommonDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  itemType?: string;
  isDeleting?: boolean;
  loading?: boolean; // Alias for isDeleting
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  content?: string; // Alias for message
  severity?: 'warning' | 'error';
}

const CommonDeleteDialog: React.FC<CommonDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'Xác nhận xóa',
  message,
  itemName,
  itemType = 'mục',
  isDeleting = false,
  confirmButtonText = 'Xóa',
  cancelButtonText = 'Hủy',
  severity = 'warning',
  content,
  loading,
}) => {
  const { token } = antdTheme.useToken();
  const actualIsDeleting = isDeleting || loading;
  const actualMessage = message || content || `Bạn có chắc chắn muốn xóa ${itemType} "${itemName}" không? Hành động này không thể hoàn tác.`;

  return (
    <Modal
      title={
        <Flex align="center" gap={12}>
          <Avatar
            icon={<ExclamationCircleFilled />}
            style={{
              backgroundColor: severity === 'error' ? token.colorError : token.colorWarning,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          <Title level={5} style={{ margin: 0 }}>
            {title}
          </Title>
        </Flex>
      }
      open={open}
      onCancel={onClose}
      footer={
        <Space size="middle" style={{ padding: '12px 0 0 0' }}>
          <Button onClick={onClose} disabled={actualIsDeleting}>
            {cancelButtonText}
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            loading={actualIsDeleting}
            onClick={onConfirm}
          >
            {confirmButtonText}
          </Button>
        </Space>
      }
      width={severity === 'error' ? 500 : 450}
      centered
      styles={{
        body: { paddingTop: '16px' }
      }}
    >
      <Alert
        message={<Text strong>Cảnh báo</Text>}
        description={`Hành động này sẽ xóa vĩnh viễn ${itemType} và không thể hoàn tác.`}
        type={severity === 'error' ? 'error' : 'warning'}
        showIcon
        style={{ marginBottom: '20px' }}
      />

      <Text type="secondary" style={{ display: 'block', fontSize: '15px' }}>
        {actualMessage}
      </Text>

      {itemName && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            background: token.colorFillAlter,
            borderRadius: '12px',
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Text type="secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
            {itemType} sẽ bị xóa:
          </Text>
          <Text strong style={{ fontSize: '16px' }}>
            {itemName}
          </Text>
        </div>
      )}
    </Modal>
  );
};

export default CommonDeleteDialog;
