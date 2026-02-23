import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Typography,
  Card,
  Switch,
  Button,
  theme as antdTheme,
  Flex,
  Divider,
} from 'antd';
import {
  SaveOutlined,
  CloseOutlined,
  SafetyCertificateOutlined,
  EditOutlined,
} from '@ant-design/icons';
import CommonDrawer from '@/components/common/CommonDrawer';
import { useBasePermissions } from '../hooks/useBasePermissions';
import type { Permission, CreatePermissionDto } from '../types';

const { Text, Title, Paragraph } = Typography;

interface PermissionFormDrawerSimpleProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreatePermissionDto) => void;
  title: string;
  permission?: Permission | null;
  loading?: boolean;
  mode?: 'view' | 'edit';
  onEdit?: () => void;
}

const PermissionFormDrawerSimple: React.FC<PermissionFormDrawerSimpleProps> = ({
  open,
  onClose,
  onSave,
  title,
  permission,
  loading = false,
  mode = 'edit',
  onEdit,
}) => {
  const { token } = antdTheme.useToken();
  const [form] = Form.useForm();
  const { data: basePermissions, isLoading: basePermissionsLoading } = useBasePermissions();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    actions: {} as Record<string, Record<string, boolean>>
  });

  useEffect(() => {
    if (permission) {
      const initialActions = convertActionsToBoolean(permission.actions || {});
      setFormData({
        name: permission.name || '',
        code: permission.code || '',
        actions: initialActions
      });
      form.setFieldsValue({
        name: permission.name,
        code: permission.code,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        actions: {}
      });
      form.resetFields();
    }
  }, [permission, form]);

  const convertActionsToBoolean = (actions: Record<string, number>) => {
    const result: Record<string, Record<string, boolean>> = {};

    Object.entries(actions).forEach(([module, value]) => {
      result[module] = {
        read: !!(value & 1),
        create: !!(value & 2),
        update: !!(value & 4),
        delete: !!(value & 8)
      };
    });

    return result;
  };

  const convertActionsToStringArray = (actions: Record<string, Record<string, boolean>>) => {
    const result: Record<string, string[]> = {};

    Object.entries(actions).forEach(([module, perms]) => {
      const permissionList: string[] = [];
      if (perms.read) permissionList.push('read');
      if (perms.create) permissionList.push('create');
      if (perms.update) permissionList.push('update');
      if (perms.delete) permissionList.push('delete');
      result[module] = permissionList;
    });

    return result;
  };

  const togglePermission = (module: string, action: string) => {
    if (mode === 'view') return;
    setFormData(prev => ({
      ...prev,
      actions: {
        ...prev.actions,
        [module]: {
          ...prev.actions[module],
          [action]: !prev.actions[module]?.[action]
        }
      }
    }));
  };

  const hasPermission = (module: string, action: string) => {
    return formData.actions[module]?.[action] || false;
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const submitData: CreatePermissionDto = {
        name: values.name,
        code: values.code,
        actions: convertActionsToStringArray(formData.actions)
      };
      onSave(submitData);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <CommonDrawer
      open={open}
      onClose={handleClose}
      title={title}
      width={700}
      loading={loading || basePermissionsLoading}
    >
      <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{ name: formData.name, code: formData.code }}
          >
            {/* Basic Information */}
            <div style={{
              backgroundColor: token.colorFillAlter,
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: `1px solid ${token.colorBorderSecondary}`
            }}>
              <Title level={5} style={{ marginBottom: '20px' }}>Thông tin cơ bản</Title>
              <Flex gap={16}>
                <Form.Item
                  name="name"
                  label="Tên quyền"
                  rules={[{ required: true, message: 'Tên quyền là bắt buộc' }]}
                  style={{ flex: 1 }}
                >
                  <Input placeholder="Nhập tên quyền ví dụ: Quản lý bài viết" disabled={mode === 'view'} />
                </Form.Item>
                <Form.Item
                  name="code"
                  label="Mã quyền"
                  rules={[{ required: true, message: 'Mã quyền là bắt buộc' }]}
                  style={{ flex: 1 }}
                >
                  <Input placeholder="Nhập mã ví dụ: posts_manage" disabled={mode === 'view'} />
                </Form.Item>
              </Flex>
            </div>

            {/* Phân quyền chi tiết */}
            <Title level={5} style={{ marginBottom: '16px' }}>Phân quyền chi tiết</Title>

            {basePermissions && (
              <Flex vertical gap={16}>
                {Object.entries(basePermissions).map(([module, actions]) => {
                  const modulePermissions = Object.values(formData.actions[module] || {});
                  const hasAnyPermission = modulePermissions.some(Boolean);

                  return (
                    <Card
                      key={module}
                      size="small"
                      title={
                        <Flex align="center" gap={8}>
                          <SafetyCertificateOutlined style={{ color: hasAnyPermission ? token.colorPrimary : token.colorTextSecondary }} />
                          <Text strong style={{ textTransform: 'uppercase', fontSize: '13px' }}>{module}</Text>
                        </Flex>
                      }
                      style={{
                        borderRadius: '12px',
                        border: `1px solid ${hasAnyPermission ? token.colorPrimaryBorder : token.colorBorderSecondary}`,
                        backgroundColor: hasAnyPermission ? '#f0faff' : 'white'
                      }}
                    >
                      <Flex vertical gap={8}>
                        {Object.entries(actions).map(([action, label]) => (
                          <Flex
                            key={action}
                            align="center"
                            justify="space-between"
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              backgroundColor: hasPermission(module, action) ? 'white' : 'transparent',
                              border: `1px solid ${hasPermission(module, action) ? token.colorBorderSecondary : 'transparent'}`
                            }}
                          >
                            <Flex vertical>
                              <Text strong style={{ textTransform: 'capitalize', fontSize: '14px' }}>{action}</Text>
                              <Text type="secondary" style={{ fontSize: '12px' }}>{label as string}</Text>
                            </Flex>
                            <Switch
                              checked={hasPermission(module, action)}
                              onChange={() => togglePermission(module, action)}
                              disabled={mode === 'view'}
                              size="small"
                            />
                          </Flex>
                        ))}
                      </Flex>
                    </Card>
                  );
                })}
              </Flex>
            )}
          </Form>
        </div>

        {/* Actions Footer */}
        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <Button onClick={handleClose} icon={<CloseOutlined />} disabled={loading}>
            {mode === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          {mode === 'view' && onEdit ? (
            <Button
              type="primary"
              onClick={onEdit}
              icon={<EditOutlined />}
            >
              Chỉnh sửa
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleSave}
              loading={loading}
              icon={<SaveOutlined />}
              style={{ minWidth: '100px' }}
            >
              Lưu thay đổi
            </Button>
          )}
        </div>
      </div>
    </CommonDrawer>
  );
};

export default PermissionFormDrawerSimple;
