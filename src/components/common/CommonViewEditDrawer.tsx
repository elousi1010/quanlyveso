import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  Typography,
  Tag,
  Space,
  Divider,
  Flex,
  Descriptions,
  Form,
  Input,
  Select,
  DatePicker,
  Alert,
  theme as antdTheme,
} from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import CommonDrawer from './CommonDrawer';
import type { DetailField, FormField } from './types';

const { Text } = Typography;
const { TextArea } = Input;

export interface CommonViewEditDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, unknown>;
  viewFields?: DetailField[];
  editFields?: FormField[];
  onSave?: (data: Record<string, unknown>) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  width?: number | string;
  mode?: 'view' | 'edit';
  enableEdit?: boolean;
}

const CommonViewEditDrawer: React.FC<CommonViewEditDrawerProps> = ({
  open,
  onClose,
  title,
  data,
  viewFields = [],
  editFields = [],
  onSave,
  loading = false,
  error = null,
  width = 500,
  mode = 'view',
  enableEdit = true,
}) => {
  const { token } = antdTheme.useToken();
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      setIsEditing(mode === 'edit');
      if (mode === 'edit' || (enableEdit && isEditing)) {
        const processedData = { ...data };
        editFields.forEach(field => {
          if (field.type === 'date' && processedData[field.key]) {
            processedData[field.key] = dayjs(processedData[field.key] as string);
          }
        });
        form.setFieldsValue(processedData);
      }
    }
  }, [open, data, mode, isEditing, editFields, form, enableEdit]);

  const handleEdit = () => {
    setIsEditing(true);
    const processedData = { ...data };
    editFields.forEach(field => {
      if (field.type === 'date' && processedData[field.key]) {
        processedData[field.key] = dayjs(processedData[field.key] as string);
      }
    });
    form.setFieldsValue(processedData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const processedValues = { ...values };
      editFields.forEach(field => {
        if (field.type === 'date' && processedValues[field.key]) {
          processedValues[field.key] = (processedValues[field.key] as dayjs.Dayjs).toISOString();
        }
      });
      await onSave?.(processedValues);
      setIsEditing(false);
    } catch (err) {
      console.error('Validate Failed:', err);
    }
  };

  const renderFieldValue = (field: DetailField, value: any) => {
    if (value === null || value === undefined || value === '') {
      return <Text type="secondary" italic>Không có dữ liệu</Text>;
    }

    switch (field.type) {
      case 'currency':
        return <Text strong>{typeof value === 'number' ? value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : value}</Text>;
      case 'date':
        return dayjs(value).format('DD/MM/YYYY');
      case 'datetime':
        return dayjs(value).format('DD/MM/YYYY HH:mm');
      case 'boolean':
        return <Tag color={value ? 'success' : 'default'}>{value ? 'Có' : 'Không'}</Tag>;
      case 'status': {
        const config = field.statusConfig?.[value] || { label: String(value), color: 'default' };
        return <Tag color={config.color}>{config.label}</Tag>;
      }
      case 'array':
        return (
          <Space wrap>
            {Array.isArray(value) && value.map((item, i) => (
              <Tag key={i} variant="outlined">{typeof item === 'object' ? item?.name || item?.label || JSON.stringify(item) : String(item)}</Tag>
            ))}
          </Space>
        );
      default:
        return field.render ? field.render(value, data) : String(value);
    }
  };

  const renderEditField = (field: FormField) => {
    switch (field.type) {
      case 'select':
        return <Select options={field.options} style={{ width: '100%' }} />;
      case 'textarea':
        return <TextArea rows={field.rows || 3} />;
      case 'date':
        return <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />;
      case 'password':
        return <Input.Password />;
      default:
        return <Input type={field.type as any} />;
    }
  };

  return (
    <CommonDrawer open={open} onClose={onClose} title={title} width={width}>
      <Flex vertical style={{ height: '100%', padding: '24px' }}>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '16px' }} />}

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {isEditing ? (
            <Form form={form} layout="vertical" requiredMark="optional">
              {editFields.map(field => (
                <Form.Item
                  key={field.key}
                  name={field.key}
                  label={<Text strong style={{ fontSize: '13px' }}>{field.label}</Text>}
                  rules={[{ required: field.required, message: `${field.label} là bắt buộc` }]}
                >
                  {renderEditField(field)}
                </Form.Item>
              ))}
            </Form>
          ) : (
            <Descriptions
              column={1}
              bordered
              size="small"
              labelStyle={{ width: '140px', fontWeight: 600, background: token.colorFillAlter }}
            >
              {viewFields.map(field => (
                <Descriptions.Item key={field.key} label={field.label}>
                  {renderFieldValue(field, data[field.key])}
                </Descriptions.Item>
              ))}
            </Descriptions>
          )}
        </div>

        <Divider style={{ margin: '24px 0 16px' }} />

        <Flex justify="end" gap={12}>
          {isEditing ? (
            <>
              <Button onClick={handleCancel} disabled={loading}>Hủy</Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={loading}>Lưu thay đổi</Button>
            </>
          ) : (
            <>
              <Button onClick={onClose}>Đóng</Button>
              {enableEdit && onSave && (
                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>Chỉnh sửa</Button>
              )}
            </>
          )}
        </Flex>
      </Flex>
    </CommonDrawer>
  );
};

export default CommonViewEditDrawer;
