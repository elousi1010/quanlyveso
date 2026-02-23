import React, { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Typography,
  Checkbox,
  Input,
  Tag,
  Divider,
  Alert,
  Flex,
  Spin,
  theme as antdTheme,
} from 'antd';
import {
  SearchOutlined,
  SecurityScanOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import CommonDrawer from '@/components/common/CommonDrawer';
import { usePermissions } from '../hooks/usePermissions';
import { useUserPermissions } from '../hooks/useUserPermissions';
import { usePermissionMutations } from '../hooks/usePermissionMutations';
import type { Permission, User } from '../types';

const { Text, Title } = Typography;

interface UserPermissionAssignmentProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess?: () => void;
}

export const UserPermissionAssignment: React.FC<UserPermissionAssignmentProps> = ({
  open,
  onClose,
  user,
  onSuccess,
}) => {
  const { token } = antdTheme.useToken();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // API hooks
  const { data: allPermissions, isLoading: permissionsLoading } = usePermissions({ limit: 1000 });
  const { data: userPermissions, isLoading: userPermissionsLoading } = useUserPermissions(user?.id || '');
  const { setForUserMutation } = usePermissionMutations();

  // Initialize selected permissions when user changes
  useEffect(() => {
    if (userPermissions) {
      setSelectedPermissions(userPermissions.map(p => p.id));
    }
  }, [userPermissions]);

  // Filter permissions based on search query
  const filteredPermissions = useMemo(() => {
    if (!allPermissions?.data) return [];

    return allPermissions.data.filter(permission =>
      permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allPermissions, searchQuery]);

  // Group permissions by category
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};

    filteredPermissions.forEach(permission => {
      const category = permission.code.split('_')[0] || 'other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });

    return groups;
  }, [filteredPermissions]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = (permissions: Permission[]) => {
    const allSelected = permissions.every(p => selectedPermissions.includes(p.id));

    if (allSelected) {
      // Deselect all in this group
      setSelectedPermissions(prev =>
        prev.filter(id => !permissions.some(p => p.id === id))
      );
    } else {
      // Select all in this group
      setSelectedPermissions(prev => [
        ...prev,
        ...permissions.map(p => p.id).filter(id => !prev.includes(id))
      ]);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Gán từng quyền cho user
      const promises = selectedPermissions.map(permissionId =>
        setForUserMutation.mutateAsync({
          permissionId: permissionId,
          data: { user_id: user.id }
        })
      );

      await Promise.all(promises);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error assigning permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (userPermissions) {
      setSelectedPermissions(userPermissions.map(p => p.id));
    }
    onClose();
  };

  const hasChanges = useMemo(() => {
    if (!userPermissions) return false;
    const currentIds = userPermissions.map(p => p.id).sort();
    const selectedIds = [...selectedPermissions].sort();
    return JSON.stringify(currentIds) !== JSON.stringify(selectedIds);
  }, [userPermissions, selectedPermissions]);

  if (!user) return null;

  return (
    <CommonDrawer
      open={open}
      onClose={handleCancel}
      title={`Gán quyền cho ${user.name}`}
      width={600}
    >
      <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* User Info */}
        <div style={{
          padding: '16px',
          marginBottom: '16px',
          backgroundColor: token.colorPrimaryBg,
          borderRadius: '8px',
          border: `1px solid ${token.colorPrimaryBorder}`
        }}>
          <Flex align="center" gap={12}>
            <UserOutlined style={{ color: token.colorPrimary, fontSize: '24px' }} />
            <Flex vertical>
              <Title level={5} style={{ margin: 0 }}>{user.name}</Title>
              <Text type="secondary">
                {user.phone_number} • <Tag color="blue">{user.role}</Tag>
              </Text>
            </Flex>
          </Flex>
        </div>

        {/* Mock Data Notice */}
        <Alert
          message="Thông báo hệ thống"
          description="Tính năng gán quyền cho user hiện đang sử dụng mock implementation. API thực tế chưa được implement."
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />

        {/* Search */}
        <Input
          placeholder="Tìm kiếm quyền hạn..."
          prefix={<SearchOutlined style={{ color: token.colorTextSecondary }} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          style={{ marginBottom: '16px' }}
        />

        {/* Current Selection Summary */}
        <div style={{ marginBottom: '16px' }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
            Đã chọn <Text strong>{selectedPermissions.length}</Text> quyền hạn
          </Text>
          <Flex wrap="wrap" gap={4}>
            {selectedPermissions.slice(0, 5).map(permissionId => {
              const permission = allPermissions?.data.find(p => p.id === permissionId);
              return permission ? (
                <Tag key={permissionId} color="blue" closable onClose={() => handlePermissionToggle(permissionId)}>
                  {permission.name}
                </Tag>
              ) : null;
            })}
            {selectedPermissions.length > 5 && (
              <Tag color="blue">+{selectedPermissions.length - 5} khác</Tag>
            )}
          </Flex>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* Permissions List */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {permissionsLoading || userPermissionsLoading ? (
            <Flex justify="center" align="center" style={{ height: '200px' }}>
              <Spin tip="Đang tải..." />
            </Flex>
          ) : (
            <div>
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <div key={category} style={{ marginBottom: '24px' }}>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: token.colorFillAlter,
                    borderRadius: '6px',
                    marginBottom: '10px'
                  }}>
                    <Checkbox
                      checked={permissions.every(p => selectedPermissions.includes(p.id))}
                      indeterminate={
                        permissions.some(p => selectedPermissions.includes(p.id)) &&
                        !permissions.every(p => selectedPermissions.includes(p.id))
                      }
                      onChange={() => handleSelectAll(permissions)}
                    >
                      <Text strong style={{ textTransform: 'capitalize' }}>
                        {category} ({permissions.length})
                      </Text>
                    </Checkbox>
                  </div>

                  <div style={{
                    marginLeft: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    {permissions.map(permission => (
                      <div
                        key={permission.id}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: selectedPermissions.includes(permission.id)
                            ? `1px solid ${token.colorPrimaryBorder}`
                            : '1px solid transparent',
                          backgroundColor: selectedPermissions.includes(permission.id)
                            ? token.colorPrimaryBg
                            : 'transparent'
                        }}
                      >
                        <Checkbox
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => handlePermissionToggle(permission.id)}
                        >
                          <Flex vertical gap={0}>
                            <Text style={{ fontSize: '13px' }}>{permission.name}</Text>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              {permission.code}
                            </Text>
                          </Flex>
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Warnings */}
        {hasChanges && (
          <Alert
            message="Bạn có các thay đổi chưa được lưu"
            type="info"
            showIcon
            style={{ marginBottom: '12px' }}
          />
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '12px',
          paddingTop: '16px',
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          marginTop: '16px'
        }}>
          <Button
            onClick={handleCancel}
            disabled={isLoading}
            icon={<CloseOutlined />}
            style={{ minWidth: '100px' }}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={isLoading}
            disabled={!hasChanges}
            icon={<SaveOutlined />}
            style={{ flex: 1 }}
          >
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </CommonDrawer>
  );
};

export default UserPermissionAssignment;
