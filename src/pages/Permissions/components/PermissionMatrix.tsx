import React, { useState, useMemo } from 'react';
import {
    Table,
    Checkbox,
    Typography,
    Button,
    Tooltip,
    Input,
    Flex,
    Spin,
    theme as antdTheme,
    Card,
} from 'antd';
import {
    SaveOutlined,
    SearchOutlined,
    CheckCircleFilled,
    InfoCircleOutlined,
} from '@ant-design/icons';
import { usePermissions } from '../hooks/usePermissions';
import { usePermissionMutations } from '../hooks/usePermissionMutations';
import type { User, Permission } from '../types';

const { Text, Title } = Typography;

interface PermissionMatrixProps {
    users: User[];
    onSuccess?: () => void;
}

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ users, onSuccess }) => {
    const { token } = antdTheme.useToken();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Fetch all permissions
    const { data: permissionsData, isLoading: permissionsLoading } = usePermissions({ limit: 1000 });
    const { setForUserMutation } = usePermissionMutations();

    const permissions = useMemo(() => permissionsData?.data || [], [permissionsData]);

    const filteredPermissions = useMemo(() => {
        return permissions.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [permissions, searchQuery]);

    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => a.name.localeCompare(b.name));
    }, [users]);

    // Check if a user has a specific permission
    const hasPermissionState = (userId: string, permission: Permission) => {
        return permission.users?.includes(userId) || false;
    };

    const togglePermission = (userId: string, permissionId: string) => {
        console.log(`Toggle permission ${permissionId} for user ${userId}`);
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        // Simulate complex batch save
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        onSuccess?.();
    };

    // Columns definition for Ant Design Table
    const columns = useMemo(() => {
        const baseColumns = [
            {
                title: 'Người dùng / Quyền hạn',
                dataIndex: 'name',
                key: 'userinfo',
                fixed: 'left' as const,
                width: 200,
                render: (text: string, record: User) => (
                    <div>
                        <Text strong style={{ display: 'block' }}>{text}</Text>
                        <Text type="secondary" style={{ fontSize: '11px' }}>{record.role.toUpperCase()}</Text>
                    </div>
                ),
            },
        ];

        const permissionCols = filteredPermissions.map(p => ({
            title: (
                <Tooltip title={p.code}>
                    <Text style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{p.name}</Text>
                </Tooltip>
            ),
            key: p.id,
            align: 'center' as const,
            width: 120,
            render: (_: any, record: User) => (
                <Checkbox
                    checked={hasPermissionState(record.id, p)}
                    onChange={() => togglePermission(record.id, p.id)}
                />
            ),
        }));

        return [...baseColumns, ...permissionCols];
    }, [filteredPermissions, sortedUsers]);

    if (permissionsLoading) {
        return (
            <Flex justify="center" align="center" style={{ height: '300px' }}>
                <Spin size="large" tip="Đang tải dữ liệu ma trận quyền..." />
            </Flex>
        );
    }

    return (
        <Flex vertical gap={16} style={{ height: '100%' }}>
            {/* Search and Global Actions */}
            <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
                <Input
                    placeholder="Tìm kiếm quyền hạn..."
                    prefix={<SearchOutlined />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: 330 }}
                    size="large"
                />
                <Button
                    type="primary"
                    icon={isSaving ? <Spin size="small" /> : <SaveOutlined />}
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    size="large"
                    style={{
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    Lưu tất cả thay đổi
                </Button>
            </Flex>

            {/* Matrix Table */}
            <div style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: `1px solid ${token.colorBorderSecondary}`,
                backgroundColor: 'white'
            }}>
                <Table
                    columns={columns}
                    dataSource={sortedUsers}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 'max-content', y: 'calc(100vh - 400px)' }}
                    size="small"
                    bordered
                    sticky
                />
            </div>

            {/* Legend / Footer */}
            <Card size="small" style={{ backgroundColor: token.colorFillAlter, borderRadius: '8px', border: 'none' }}>
                <Flex align="center" gap={8}>
                    <InfoCircleOutlined style={{ color: token.colorInfo }} />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        Ma trận này cho phép bạn quản lý quyền hạn của tất cả người dùng một cách trực quan.
                        Tick vào ô tương ứng để gán quyền. Lưu ý: Thao tác hiện tại đang chạy ở chế độ mô phỏng.
                    </Text>
                </Flex>
            </Card>
        </Flex>
    );
};

export default PermissionMatrix;
