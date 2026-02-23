import React, { useState, useMemo } from 'react';
import {
    Button,
    Typography,
    Checkbox,
    Input,
    Tag,
    Divider,
    Alert,
    Radio,
    Space,
    Flex,
    Spin,
    theme as antdTheme,
} from 'antd';
import {
    SearchOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    CloseOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons';
import CommonDrawer from '@/components/common/CommonDrawer';
import { usePermissions } from '../hooks/usePermissions';
import { usePermissionMutations } from '../hooks/usePermissionMutations';
import type { Permission, User, BulkPermissionAssignment as BulkAssignDto } from '../types';

const { Text, Title } = Typography;

interface BulkPermissionAssignmentProps {
    open: boolean;
    onClose: () => void;
    selectedUsers: User[];
    onSuccess?: () => void;
}

const BulkPermissionAssignment: React.FC<BulkPermissionAssignmentProps> = ({
    open,
    onClose,
    selectedUsers,
    onSuccess,
}) => {
    const { token } = antdTheme.useToken();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [operation, setOperation] = useState<'assign' | 'remove' | 'replace'>('assign');
    const [isLoading, setIsLoading] = useState(false);

    // API hooks
    const { data: allPermissions, isLoading: permissionsLoading } = usePermissions({ limit: 1000 });
    const { bulkAssignMutation } = usePermissionMutations();

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

    const handleExecute = async () => {
        if (selectedUsers.length === 0 || selectedPermissions.length === 0) return;

        setIsLoading(true);
        try {
            const dto: BulkAssignDto = {
                user_ids: selectedUsers.map(u => u.id),
                permission_ids: selectedPermissions,
                operation,
            };

            await bulkAssignMutation.mutateAsync(dto);

            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error in bulk permission assignment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedPermissions([]);
        onClose();
    };

    return (
        <CommonDrawer
            open={open}
            onClose={handleClose}
            title="Gán quyền hàng loạt"
            width={700}
        >
            <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Selection Info */}
                <div style={{
                    padding: '16px',
                    marginBottom: '24px',
                    backgroundColor: token.colorInfoBg,
                    borderRadius: '8px',
                    border: `1px solid ${token.colorInfoBorder}`
                }}>
                    <Flex align="center" gap={12} style={{ marginBottom: '12px' }}>
                        <TeamOutlined style={{ color: token.colorPrimary, fontSize: '20px' }} />
                        <Title level={5} style={{ margin: 0 }}>
                            Đang chọn {selectedUsers.length} người dùng
                        </Title>
                    </Flex>
                    <Flex wrap="wrap" gap={6}>
                        {selectedUsers.slice(0, 10).map(user => (
                            <Tag key={user.id} color="blue" bordered={false}>
                                {user.name}
                            </Tag>
                        ))}
                        {selectedUsers.length > 10 && (
                            <Tag bordered={false}>+ {selectedUsers.length - 10} người khác</Tag>
                        )}
                    </Flex>
                </div>

                {/* Operation Mode */}
                <div style={{ marginBottom: '24px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                        Thao tác thực hiện
                    </Text>
                    <Radio.Group
                        value={operation}
                        onChange={(e) => setOperation(e.target.value)}
                        optionType="button"
                        buttonStyle="solid"
                    >
                        <Radio.Button value="assign">Gán thêm</Radio.Button>
                        <Radio.Button value="remove">Gỡ bỏ</Radio.Button>
                        <Radio.Button value="replace">Thay thế tất cả</Radio.Button>
                    </Radio.Group>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                {/* Search Permissions */}
                <Input
                    placeholder="Tìm kiếm quyền hạn để gán..."
                    prefix={<SearchOutlined style={{ color: token.colorTextSecondary }} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    allowClear
                    style={{ marginBottom: '16px' }}
                />

                {/* Permissions List */}
                <div style={{ flex: 1, overflow: 'auto', paddingRight: '4px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Chọn quyền hạn bạn muốn thực hiện thao tác trên {selectedUsers.length} người dùng đã chọn.
                        </Text>
                    </div>

                    {permissionsLoading ? (
                        <Flex justify="center" align="center" style={{ height: '200px' }}>
                            <Spin tip="Đang tải..." />
                        </Flex>
                    ) : (
                        Object.entries(groupedPermissions).map(([category, permissions]) => (
                            <div key={category} style={{ marginBottom: '24px' }}>
                                <div style={{
                                    padding: '8px 12px',
                                    backgroundColor: token.colorFillAlter,
                                    borderRadius: '6px',
                                    marginBottom: '12px'
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
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                    gap: '8px'
                                }}>
                                    {permissions.map(permission => (
                                        <div
                                            key={permission.id}
                                            style={{
                                                padding: '8px',
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
                        ))
                    )}
                </div>

                {/* Warnings */}
                {operation === 'replace' && (
                    <Alert
                        type="warning"
                        showIcon
                        message={<Text strong>Lưu ý quan trọng</Text>}
                        description="Thao tác 'Thay thế tất cả' sẽ xóa hết quyền hiện có của các user và chỉ giữ lại những quyền bạn vừa chọn."
                        style={{ marginTop: '16px' }}
                    />
                )}

                {/* Footer Actions */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: `1px solid ${token.colorBorderSecondary}`,
                    marginTop: '16px'
                }}>
                    <Button
                        onClick={handleClose}
                        disabled={isLoading}
                        icon={<CloseOutlined />}
                        style={{ minWidth: '100px' }}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleExecute}
                        loading={isLoading}
                        disabled={selectedPermissions.length === 0}
                        icon={<ThunderboltOutlined />}
                        style={{ flex: 1, backgroundColor: token.colorPrimary }}
                    >
                        Thực hiện cho {selectedUsers.length} người dùng
                    </Button>
                </div>
            </div>
        </CommonDrawer>
    );
};

export default BulkPermissionAssignment;
