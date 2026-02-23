import React from 'react';
import { Typography, Button, Space, Flex, theme as antdTheme, Grid } from 'antd';
import {
  ReloadOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface CommonHeaderProps {
  title: string;
  subtitle?: string;
  onCreate?: () => void;
  onRefresh?: () => void;
  createButtonText?: string;
  createButtonIcon?: React.ReactNode;
  refreshButtonText?: string;
  refreshButtonIcon?: React.ReactNode;
  loading?: boolean;
  onBulkEdit?: () => void;
  bulkEditButtonText?: string;
  bulkEditButtonIcon?: React.ReactNode;
  showBulkEdit?: boolean;
  selectedCount?: number;
  onDeleteSelected?: () => void;
  deleteButtonText?: string;
  deleteButtonIcon?: React.ReactNode;
  showDeleteSelected?: boolean;
  customActions?: React.ReactNode;
  showRefresh?: boolean;
  onExtraClick?: () => void;
  extraText?: string;
  extraIcon?: React.ReactNode;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
  title,
  subtitle,
  onCreate,
  onRefresh,
  createButtonText = 'Thêm mới',
  createButtonIcon = <UserAddOutlined />,
  refreshButtonText = 'Làm mới',
  refreshButtonIcon = <ReloadOutlined />,
  loading = false,
  onBulkEdit,
  bulkEditButtonText = 'Chỉnh sửa hàng loạt',
  bulkEditButtonIcon = <EditOutlined />,
  showBulkEdit = false,
  selectedCount = 0,
  onDeleteSelected,
  deleteButtonText = 'Xóa đã chọn',
  deleteButtonIcon = <DeleteOutlined />,
  showDeleteSelected = false,
  customActions,
  showRefresh = true,
  onExtraClick,
  extraText,
  extraIcon,
}) => {
  const { token } = antdTheme.useToken();
  const screens = useBreakpoint();
  const isMobile = screens.xs || (screens.sm && !screens.md);

  return (
    <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
      <Flex
        justify="space-between"
        align={isMobile ? 'flex-start' : 'center'}
        vertical={isMobile}
        gap={isMobile ? 12 : 16}
      >
        <div style={{ width: '100%' }}>
          <Title
            level={2}
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: isMobile ? '1.5rem' : 'clamp(1.5rem, 5vw, 2rem)',
              lineHeight: 1.2,
              letterSpacing: '-0.02em'
            }}
          >
            {title}
          </Title>
          {subtitle && (
            <Text
              type="secondary"
              style={{
                fontSize: isMobile ? '12px' : '14px',
                lineHeight: 1.4,
                opacity: 0.8,
                maxWidth: '600px',
                display: 'block',
                marginTop: '4px'
              }}
            >
              {subtitle}
            </Text>
          )}
        </div>

        <div style={{ width: isMobile ? '100%' : 'auto' }}>
          <Space
            size={isMobile ? 8 : 'middle'}
            wrap
            style={{
              width: '100%',
              justifyContent: isMobile ? 'flex-start' : 'flex-end'
            }}
          >
            {customActions}

            {showRefresh && onRefresh && (
              <Button
                icon={refreshButtonIcon}
                onClick={onRefresh}
                loading={loading}
                style={{ borderRadius: '8px' }}
                size={isMobile ? 'middle' : 'middle'}
              >
                {!isMobile && refreshButtonText}
              </Button>
            )}

            {showBulkEdit && onBulkEdit && (
              <Button
                icon={bulkEditButtonIcon}
                onClick={onBulkEdit}
                disabled={loading}
                style={{
                  borderRadius: '8px',
                  color: token.colorWarning,
                  borderColor: token.colorWarning
                }}
              >
                {bulkEditButtonText}
              </Button>
            )}

            {showDeleteSelected && onDeleteSelected && selectedCount > 0 && (
              <Button
                danger
                icon={deleteButtonIcon}
                onClick={onDeleteSelected}
                disabled={loading || selectedCount === 0}
                style={{ borderRadius: '8px' }}
              >
                {deleteButtonText} ({selectedCount})
              </Button>
            )}

            {onExtraClick && (
              <Button
                icon={extraIcon}
                onClick={onExtraClick}
                disabled={loading}
                style={{ borderRadius: '8px' }}
              >
                {extraText}
              </Button>
            )}

            {onCreate && (
              <Button
                type="primary"
                icon={createButtonIcon}
                onClick={onCreate}
                disabled={loading}
                style={{
                  borderRadius: '8px',
                  fontWeight: 500,
                  flexGrow: isMobile ? 1 : 0
                }}
              >
                {createButtonText}
              </Button>
            )}
          </Space>
        </div>
      </Flex>
    </div>
  );
};

export default CommonHeader;
