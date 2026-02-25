import React, { useState, useMemo } from 'react';
import { Table, Checkbox, Typography, Button, Tooltip, Input, Flex, Spin, theme as antdTheme, Card, message } from 'antd';
import { SaveOutlined, SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../../../types/auth'; // Ensure we have all available permissions imported

const { Text } = Typography;

// Định nghĩa cứng các Role cho Ma Trận Quyền
const SYSTEM_ROLES = [
    { id: 'admin', name: 'Admin', desc: 'Quản trị viên toàn hệ thống' },
    { id: 'owner', name: 'Owner (Chủ Đại Lý)', desc: 'Chủ đại lý cấp 1' },
    { id: 'user', name: 'Employee (Nhân viên)', desc: 'Nhân viên thu ngân / Kho' },
    { id: 'seller', name: 'Seller (Người bán dạo)', desc: 'Người bán dạo / Đại lý vé' }
];

interface RoleMatrixUIProps {
    onSuccess?: () => void;
}

export const PermissionMatrix: React.FC<RoleMatrixUIProps> = ({ onSuccess }) => {
    const { token } = antdTheme.useToken();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // MOCK TRẠNG THÁI CACHE: State giữ ma trận quyền
    const [matrixState, setMatrixState] = useState<Record<string, Record<string, boolean>>>({
        'admin': { [PERMISSIONS.VIEW_DASHBOARD]: true, [PERMISSIONS.MANAGE_EMPLOYEES]: true, [PERMISSIONS.MANAGE_TICKETS]: true, [PERMISSIONS.MANAGE_PARTNERS]: true },
        'owner': { [PERMISSIONS.VIEW_DASHBOARD]: true, [PERMISSIONS.MANAGE_TICKETS]: true, [PERMISSIONS.MANAGE_PARTNERS]: true },
        'user': { [PERMISSIONS.VIEW_DASHBOARD]: true, [PERMISSIONS.MANAGE_TICKETS]: true },
        'seller': { [PERMISSIONS.VIEW_DASHBOARD]: true }
    });

    const { data: permissionsData, isLoading: permissionsLoading } = usePermissions({ limit: 100 });
    const permissions = useMemo(() => (permissionsData as any)?.data || [], [permissionsData]);

    const filteredPermissions = useMemo(() => {
        return permissions.filter((p: any) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [permissions, searchQuery]);

    const togglePermission = (roleId: string, permCode: string) => {
        setMatrixState(prev => {
            const rolePerms = prev[roleId] || {};
            return {
                ...prev,
                [roleId]: {
                    ...rolePerms,
                    [permCode]: !rolePerms[permCode]
                }
            };
        });
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        message.success('Đã lưu thành công Ma trận Phân quyền.');
        setIsSaving(false);
        onSuccess?.();
    };

    const columns = useMemo(() => {
        const baseColumns = [
            {
                title: 'Vai trò (Role)',
                dataIndex: 'name',
                key: 'name',
                fixed: 'left' as const,
                width: 250,
                render: (text: string, record: any) => (
                    <div>
                        <Text strong style={{ display: 'block' }}>{text}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.desc}</Text>
                    </div>
                ),
            },
        ];

        const permissionCols = filteredPermissions.map((p: any) => ({
            title: (
                <Tooltip title={p.code}>
                    <Text style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>{p.name}</Text>
                </Tooltip>
            ),
            key: p.code,
            align: 'center' as const,
            width: 140,
            render: (_: any, record: any) => (
                <Checkbox
                    checked={!!matrixState[record.id]?.[p.code]}
                    onChange={() => togglePermission(record.id, p.code)}
                    disabled={record.id === 'admin'} // Admin luôn có full quyền ngầm định
                />
            ),
        }));

        return [...baseColumns, ...permissionCols];
    }, [filteredPermissions, matrixState]);

    if (permissionsLoading) {
        return (
            <Flex justify="center" align="center" style={{ height: '300px' }}>
                <Spin size="large" tip="Đang tải dữ liệu ma trận quyền..." />
            </Flex>
        );
    }

    return (
        <Flex vertical gap={16} style={{ height: '100%', marginTop: 16 }}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
                <Input
                    placeholder="Tìm kiếm tên Module / Quyền..."
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
                    style={{ borderRadius: '8px', backgroundColor: '#faad14', borderColor: '#faad14' }}
                >
                    Lưu lại cấu hình Ma Trận
                </Button>
            </Flex>

            <div style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: `1px solid ${token.colorBorderSecondary}`,
                backgroundColor: 'white'
            }}>
                <Table
                    columns={columns}
                    dataSource={SYSTEM_ROLES}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    size="middle"
                    bordered
                />
            </div>

            <Card size="small" style={{ backgroundColor: token.colorFillAlter, borderRadius: '8px', border: 'none' }}>
                <Flex align="center" gap={8}>
                    <InfoCircleOutlined style={{ color: token.colorInfo }} />
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                        Bảng Ma Trận Quyền (Role Matrix) cho phép phân quyền tập trung cấp độ hệ thống dựa trên khái niệm <strong>Vai Trò (Roles)</strong>. Vai trò Quản trị viên (Admin) mặc định có Full Quyền.
                    </Text>
                </Flex>
            </Card>
        </Flex>
    );
};

export default PermissionMatrix;
