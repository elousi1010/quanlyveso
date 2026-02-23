import React from 'react';
import { SimpleTable } from '@/components/common';
import {
  Tag,
  Typography,
  Tooltip,
  Flex,
  theme as antdTheme
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CodeOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from '@ant-design/icons';
import type { Permission } from '../types';

const { Text } = Typography;

interface PermissionDataGridProps {
  data: Permission[];
  loading: boolean;
  onEdit: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
  onView: (permission: Permission) => void;
  onSave?: (data: Record<string, unknown>, selectedRow?: Permission) => Promise<void>;
  selectedRows: Permission[];
  onSelectionChange: (permissions: Permission[]) => void;
}

export const PermissionDataGrid: React.FC<PermissionDataGridProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  onSave,
  selectedRows,
  onSelectionChange,
}) => {
  const { token } = antdTheme.useToken();

  // Helper function to render permission badges
  const renderPermissionBadges = (actions: Record<string, number>) => {
    return (
      <Flex vertical gap={4} style={{ padding: '8px 0' }}>
        {Object.entries(actions || {}).map(([resource, value]) => {
          const permissions = [];
          if (value & 1) permissions.push('Đọc');
          if (value & 2) permissions.push('Tạo');
          if (value & 4) permissions.push('Cập nhật');
          if (value & 8) permissions.push('Xóa');

          const hasPermissions = permissions.length > 0;

          return (
            <Flex key={resource} vertical gap={4} style={{
              backgroundColor: token.colorFillAlter,
              padding: '8px',
              borderRadius: '8px',
              border: `1px solid ${token.colorBorderSecondary}`
            }}>
              <Flex justify="space-between" align="center">
                <Text strong style={{ fontSize: '11px', color: token.colorPrimary }}>
                  {resource.toUpperCase()}
                </Text>
                <Text type="secondary" style={{ fontSize: '10px' }}>
                  {hasPermissions ? `${permissions.length} quyền` : 'Không có quyền'}
                </Text>
              </Flex>

              {hasPermissions && (
                <Flex wrap="wrap" gap={4}>
                  {permissions.map(perm => (
                    <Tag
                      key={perm}
                      color="default"
                      bordered={false}
                      style={{ fontSize: '10px', lineHeight: '18px', margin: 0 }}
                    >
                      {perm}
                    </Tag>
                  ))}
                </Flex>
              )}
            </Flex>
          );
        })}
      </Flex>
    );
  };

  // Transform data for SimpleTable
  const displayData = data?.map((permission, index) => ({
    ...permission,
    id: permission.id || `permission-${index}`,
    actions_display: renderPermissionBadges(permission.actions || {}),
    created_at_display: permission.created_at ? new Date(permission.created_at).toLocaleDateString('vi-VN') : '',
    updated_at_display: permission.updated_at ? new Date(permission.updated_at).toLocaleDateString('vi-VN') : '',
  })) || [];

  // Define columns for the table
  const columns = [
    {
      key: 'name',
      label: 'Tên quyền',
      render: (value: any) => (
        <Text strong>{value}</Text>
      )
    },
    {
      key: 'code',
      label: 'Mã quyền',
      render: (value: any) => (
        <Tag icon={<CodeOutlined />} color="cyan" style={{ fontFamily: 'monospace' }}>
          {value}
        </Tag>
      )
    },
    {
      key: 'is_active',
      label: 'Trạng thái',
      render: (value: any) => (
        <Tag
          icon={value ? <CheckCircleFilled /> : <CloseCircleFilled />}
          color={value ? 'success' : 'error'}
          bordered={false}
        >
          {value ? 'Hoạt động' : 'Vô hiệu'}
        </Tag>
      )
    },
    {
      key: 'created_at_display',
      label: 'Ngày tạo',
      render: (value: any) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>{value}</Text>
      )
    },
    {
      key: 'updated_at_display',
      label: 'Cập nhật',
      render: (value: any) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>{value}</Text>
      )
    }
  ];

  const actions = [
    {
      key: 'view',
      label: 'Xem',
      icon: <EyeOutlined />,
      color: 'primary' as const,
      onClick: (permission: any) => onView(permission as Permission),
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteOutlined />,
      color: 'error' as const,
      onClick: (permission: any) => onDelete(permission as Permission),
    },
  ];

  return (
    <SimpleTable
      data={displayData}
      columns={columns}
      actions={actions}
      loading={loading}
      onRefresh={() => { }}
      emptyMessage="Không có quyền hạn nào"
    />
  );
};