import React from 'react';
import {
  Typography,
  Tag,
  Card,
  Flex,
  Divider,
  Button,
  theme as antdTheme,
} from 'antd';
import { EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { CommonDrawer, type DetailField, type FormField } from './index';

const { Text, Title, Paragraph } = Typography;

export interface CommonDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, unknown>;
  fields: DetailField[];
  width?: number | string;
  enableEdit?: boolean;
  onEdit?: () => void;
  onSave?: (data: Record<string, unknown>) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  isEditing?: boolean;
  editFields?: FormField[];
}

const CommonDetailDrawer: React.FC<CommonDetailDrawerProps> = ({
  open,
  onClose,
  title,
  data,
  fields,
  enableEdit = false,
  onEdit,
  width = 720,
  isEditing = false,
}) => {
  const { token } = antdTheme.useToken();

  const renderFieldValue = (field: DetailField, value: unknown) => {
    if (value === null || value === undefined || value === '') {
      return (
        <Text type="secondary" italic>
          Không có dữ liệu
        </Text>
      );
    }

    if (field.render) {
      return field.render(value, data);
    }

    return (
      <Text style={{ wordBreak: 'break-word' }}>
        {String(value)}
      </Text>
    );
  };

  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      title={title}
      width={width}
    >
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: token.colorFillAlter
      }}>
        {/* Header Section */}
        <div style={{
          padding: '24px',
          backgroundColor: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`
        }}>
          <Flex align="center" gap={12}>
            <Title level={4} style={{ margin: 0 }}>
              {(data.name as string) || (data.id as string) || 'Chi tiết'}
            </Title>
          </Flex>
          <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>
            Thông tin chi tiết của hệ thống
          </Text>
        </div>

        {/* Content Section */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {fields
              .filter(field => field.key !== 'id' && field.key !== 'organization_id')
              .map((field) => {
                const value = data[field.key];

                if (field.hideIfEmpty && (value === null || value === undefined || value === '')) {
                  return null;
                }

                return (
                  <Card
                    key={field.key}
                    size="small"
                    hoverable
                    styles={{ body: { padding: '16px' } }}
                    style={{
                      borderRadius: '8px',
                      border: `1px solid ${token.colorBorderSecondary}`
                    }}
                  >
                    <Flex vertical gap={8}>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {field.label}
                      </Text>

                      <div style={{ minHeight: '24px', display: 'flex', alignItems: 'center' }}>
                        {field.chip && (typeof value === 'string' || typeof value === 'number') ? (
                          <Tag
                            color={field.chip.color === 'primary' ? 'blue' : field.chip.color as any}
                            bordered={false}
                          >
                            {String(renderFieldValue(field, value))}
                          </Tag>
                        ) : (
                          <div style={{ fontWeight: 500, fontSize: '15px' }}>
                            {renderFieldValue(field, value)}
                          </div>
                        )}
                      </div>
                    </Flex>
                  </Card>
                );
              })}
          </div>

          {fields.length === 0 && (
            <Flex vertical align="center" justify="center" style={{ padding: '48px 0' }}>
              <InfoCircleOutlined style={{ fontSize: '48px', color: token.colorTextDisabled, marginBottom: '16px' }} />
              <Text type="secondary">Không có thông tin chi tiết</Text>
            </Flex>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: token.colorBgContainer,
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Cập nhật lần cuối: {data.updated_at ? new Date(data.updated_at as string).toLocaleDateString('vi-VN') : 'N/A'}
          </Text>

          {enableEdit && onEdit && !isEditing && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={onEdit}
            >
              Chỉnh sửa ngay
            </Button>
          )}
        </div>
      </div>
    </CommonDrawer>
  );
};

export default CommonDetailDrawer;