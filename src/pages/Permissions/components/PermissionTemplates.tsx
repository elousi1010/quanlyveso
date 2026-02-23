import React, { useState } from 'react';
import {
    Row,
    Col,
    Card,
    Typography,
    Button,
    Tag,
    Avatar,
    Divider,
    Modal,
    Flex,
    Tooltip,
    Space,
    theme as antdTheme,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
    CheckCircleOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { permissionApi } from '../api';
import type { PermissionTemplate } from '../types';

const { Text, Title, Paragraph } = Typography;

const PermissionTemplates: React.FC = () => {
    const { token } = antdTheme.useToken();
    const [selectedTemplate, setSelectedTemplate] = useState<PermissionTemplate | null>(null);
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);

    // Fetch templates (Mocked in the API)
    const { data: templates, isLoading } = useQuery({
        queryKey: ['permission-templates'],
        queryFn: () => permissionApi.getTemplates(),
    });

    const handleApplyTemplate = (template: PermissionTemplate) => {
        setSelectedTemplate(template);
        setApplyDialogOpen(true);
    };

    const handleApplyConfirm = async () => {
        if (selectedTemplate) {
            try {
                await permissionApi.applyTemplateToUser('all', selectedTemplate.id);
                setApplyDialogOpen(false);
            } catch (error) {
                console.error('Error applying template:', error);
            }
        }
    };

    if (isLoading) {
        return <Flex justify="center"><Text>Đang tải templates...</Text></Flex>;
    }

    return (
        <Flex vertical gap={24}>
            <Flex justify="space-between" align="center">
                <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                    Danh sách Template ({templates?.length || 0})
                </Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                >
                    Tạo Template Mới
                </Button>
            </Flex>

            <Row gutter={[24, 24]}>
                {(templates || []).map((template) => (
                    <Col xs={24} sm={12} md={8} key={template.id}>
                        <Card
                            hoverable
                            style={{
                                borderRadius: '12px',
                                height: '100%',
                                border: `1px solid ${token.colorBorderSecondary}`
                            }}
                            styles={{ body: { padding: '24px' } }}
                            actions={[
                                <Button
                                    type="primary"
                                    ghost
                                    icon={<ThunderboltOutlined />}
                                    onClick={() => handleApplyTemplate(template)}
                                    // style={{ borderRadius: '8px' }}
                                    key="apply"
                                >
                                    Áp dụng cho User
                                </Button>
                            ]}
                        >
                            <Flex vertical gap={16}>
                                <Flex justify="space-between" align="center">
                                    <AvatarGradient icon={<SafetyCertificateOutlined />} token={token} />
                                    <Space>
                                        <Tooltip title="Chỉnh sửa">
                                            <Button type="text" icon={<EditOutlined />} />
                                        </Tooltip>
                                        <Tooltip title="Xóa">
                                            <Button type="text" danger icon={<DeleteOutlined />} />
                                        </Tooltip>
                                    </Space>
                                </Flex>

                                <div>
                                    <Title level={5} style={{ margin: '0 0 8px 0', fontWeight: 700 }}>
                                        {template.name}
                                    </Title>
                                    <Tag color="blue" bordered={false} style={{ marginBottom: '8px' }}>
                                        Role: {template.role.toUpperCase()}
                                    </Tag>
                                    <Paragraph
                                        type="secondary"
                                        ellipsis={{ rows: 2 }}
                                        style={{ margin: '8px 0', minHeight: '44px' }}
                                    >
                                        {template.description || 'Không có mô tả cho template này.'}
                                    </Paragraph>
                                </div>

                                <Divider style={{ margin: '8px 0' }} />

                                <Flex align="center" gap={8}>
                                    <CheckCircleOutlined style={{ color: token.colorSuccess }} />
                                    <Text type="secondary" size="small">
                                        {template.permission_ids.length} quyền hạn được gán
                                    </Text>
                                </Flex>
                            </Flex>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Apply Template Modal */}
            <Modal
                title={<Title level={4}>Áp dụng Template</Title>}
                open={applyDialogOpen}
                onCancel={() => setApplyDialogOpen(false)}
                onOk={handleApplyConfirm}
                okText="Xác nhận"
                cancelText="Hủy"
                centered
            >
                <Flex vertical gap={12} style={{ padding: '16px 0' }}>
                    <Text>
                        Bạn có chắc chắn muốn áp dụng template <Text strong>{selectedTemplate?.name}</Text> cho các người dùng được chọn?
                    </Text>
                    <Alert
                        message="Lưu ý"
                        description="Thao tác này sẽ cập nhật lại toàn bộ quyền hạn theo template này. Hành động này không thể hoàn tác cho các quyền hiện tại của user."
                        type="warning"
                        showIcon
                    />
                </Flex>
            </Modal>
        </Flex>
    );
};

// Helper component for styled avatar
const AvatarGradient: React.FC<{ icon: React.ReactNode, token: any }> = ({ icon, token }) => (
    <div style={{
        width: 44,
        height: 44,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryHover} 100%)`,
        color: 'white',
        boxShadow: `0 4px 12px ${token.colorPrimaryBg}`,
        fontSize: '20px'
    }}>
        {icon}
    </div>
);

export default PermissionTemplates;
