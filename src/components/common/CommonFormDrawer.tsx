import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Space,
  Divider,
  Flex,
  theme as antdTheme,
} from 'antd';
import dayjs from 'dayjs';
import CommonDrawer from './CommonDrawer';
import type { FormField } from './types';

const { TextArea } = Input;

interface CommonFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void;
  title: string;
  fields: FormField[];
  initialData?: Record<string, unknown>;
  submitText?: string;
  cancelButtonText?: string;
  loading?: boolean;
  width?: number | string;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
}

const CommonFormDrawer: React.FC<CommonFormDrawerProps> = ({
  open,
  onClose,
  onSave,
  title,
  fields,
  initialData = {},
  submitText = 'Lưu',
  cancelButtonText = 'Hủy',
  loading = false,
  width = 400,
  anchor = 'right',
}) => {
  const { token } = antdTheme.useToken();
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      // Process initial data for specific fields like dates
      const processedData = { ...initialData };
      fields.forEach(field => {
        if (field.type === 'date' && processedData[field.key]) {
          processedData[field.key] = dayjs(processedData[field.key] as string);
        }
      });
      form.setFieldsValue(processedData);
    } else {
      form.resetFields();
    }
  }, [open, initialData, form, fields]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // Process values back (e.g. converting dayjs objects to strings)
      const processedValues = { ...values };
      fields.forEach(field => {
        if (field.type === 'date' && processedValues[field.key]) {
          processedValues[field.key] = (processedValues[field.key] as dayjs.Dayjs).toISOString();
        }
      });
      onSave(processedValues);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      placeholder: field.placeholder || `Nhập ${field.label.toLowerCase()}`,
      disabled: field.disabled || loading,
    };

    switch (field.type) {
      case 'select':
        return (
          <Select
            {...commonProps}
            options={field.options}
            style={{ width: '100%' }}
          />
        );

      case 'textarea':
        return (
          <TextArea
            {...commonProps}
            rows={field.rows || 3}
          />
        );

      case 'date':
        return (
          <DatePicker
            {...commonProps}
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
          />
        );

      case 'json':
        return (
          <TextArea
            {...commonProps}
            rows={field.rows || 4}
          />
        );

      case 'password':
        return (
          <Input.Password
            {...commonProps}
          />
        );

      default:
        return (
          <Input
            {...commonProps}
            type={field.type as any}
          />
        );
    }
  };

  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      title={title}
      width={width}
      anchor={anchor}
      loading={loading}
    >
      <Flex vertical style={{ height: '100%', padding: '24px' }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialData}
          requiredMark="optional"
          style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}
        >
          {fields.map((field) => (
            <Form.Item
              key={field.key}
              name={field.key}
              label={<span style={{ fontWeight: 600, fontSize: '13px' }}>{field.label}</span>}
              rules={[{ required: field.required, message: `${field.label} là bắt buộc` }]}
            >
              {renderField(field)}
            </Form.Item>
          ))}
        </Form>

        <Divider style={{ margin: '24px 0 16px' }} />

        <Flex justify="end" gap={12}>
          <Button onClick={onClose} disabled={loading}>
            {cancelButtonText}
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            style={{ minWidth: '100px' }}
          >
            {submitText}
          </Button>
        </Flex>
      </Flex>
    </CommonDrawer>
  );
};

export default CommonFormDrawer;
