import React, { useState } from 'react';
import { Row, Col, Card, Typography, Statistic, Table, Tag, Button, Avatar, Space, Flex, Input, Modal, Form, Select, InputNumber, message } from 'antd';
import { WarningOutlined, UserOutlined, TeamOutlined, SwapOutlined, SearchOutlined } from '@ant-design/icons';
import { CommonHeader } from '@/components/common';
import type { Partner } from '@/types/partner';

const { Title, Text } = Typography;

// Mock Data
const activeSellersMock: (Partner & { status: string; holdingTickets: number; soldTickets: number })[] = [
    {
        id: '1',
        name: 'Nguyễn Văn A',
        address: 'Quận 1, TP.HCM',
        phone_number: '0901234567',
        type: 'seller',
        level: 1,
        debt: 500000,
        status: 'online',
        holdingTickets: 250,
        soldTickets: 150,
        is_active: true,
        created_at: new Date().toISOString(),
        created_by: 'admin',
        updated_at: new Date().toISOString(),
        updated_by: null,
        deleted_at: null,
        organization_id: 'org1',
        organization: {} as any
    },
    {
        id: '2',
        name: 'Trần Thị B',
        address: 'Quận 3, TP.HCM',
        phone_number: '0987654321',
        type: 'seller',
        level: 2,
        debt: 120000,
        status: 'offline',
        holdingTickets: 120,
        soldTickets: 300,
        is_active: true,
        created_at: new Date().toISOString(),
        created_by: 'admin',
        updated_at: new Date().toISOString(),
        updated_by: null,
        deleted_at: null,
        organization_id: 'org1',
        organization: {} as any
    }
];

export const CommandCenterDashboard: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState<any>(null);
    const [formTransfer] = Form.useForm();

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
    };

    const handleTransfer = (seller: any) => {
        setSelectedSeller(seller);
        setIsTransferModalOpen(true);
    };

    const handleTransferSubmit = () => {
        formTransfer.validateFields().then(values => {
            message.success(`Đã điều chuyển ${values.quantity} vé đi thành công!`);
            setIsTransferModalOpen(false);
            formTransfer.resetFields();
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const columnsSellers = [
        {
            title: 'Người Bán Dạo',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <Space>
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: record.status === 'online' ? '#87d068' : '#d9d9d9' }} />
                    <div>
                        <Text strong style={{ display: 'block' }}>{text}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.phone_number}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Khu Vực',
            dataIndex: 'address',
            key: 'address',
            render: (text: string) => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Đang Giữ Vé',
            dataIndex: 'holdingTickets',
            key: 'holdingTickets',
            align: 'right' as const,
            render: (val: number) => <Text strong style={{ color: val > 200 ? '#faad14' : 'inherit' }}>{val.toLocaleString()} vé</Text>
        },
        {
            title: 'Đã Bán',
            dataIndex: 'soldTickets',
            key: 'soldTickets',
            align: 'right' as const,
            render: (val: number) => <Text style={{ color: '#52c41a' }}>{val.toLocaleString()} vé</Text>
        },
        {
            title: 'Công Nợ (VNĐ)',
            dataIndex: 'debt',
            key: 'debt',
            align: 'right' as const,
            render: (val: number) => <Text type="danger">{val.toLocaleString()}</Text>
        },
        {
            title: 'Hành Động',
            key: 'actions',
            align: 'center' as const,
            render: (_: any, record: any) => (
                <Space>
                    <Button type="primary" size="small" icon={<SwapOutlined />} onClick={() => handleTransfer(record)}>
                        Điều chuyển vé
                    </Button>
                </Space>
            )
        }
    ];

    const filteredSellers = activeSellersMock.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone_number.includes(searchQuery)
    );

    const totalHolding = activeSellersMock.reduce((acc, curr) => acc + curr.holdingTickets, 0);
    const totalSold = activeSellersMock.reduce((acc, curr) => acc + curr.soldTickets, 0);

    return (
        <div style={{ padding: '0 0 24px 0', minHeight: '100%' }}>
            <CommonHeader
                title="Quản Lý Tuyến Bán (Đại lý cấp 2)"
                subtitle="Hệ thống giám sát và phân bổ vé cho người bán dạo"
                onRefresh={handleRefresh}
                loading={loading}
            />

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} md={8}>
                    <Card bordered={false} style={{ borderRadius: 12, background: '#f0f5ff' }}>
                        <Statistic
                            title="Tổng Người Bán"
                            value={activeSellersMock.length}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#1677ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card bordered={false} style={{ borderRadius: 12, background: '#f6ffed' }}>
                        <Statistic
                            title="Tổng Vé Đã Giao"
                            value={totalHolding + totalSold}
                            suffix="vé"
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card bordered={false} style={{ borderRadius: 12, background: '#fff2e8' }}>
                        <Statistic
                            title="Vé Tồn Cảnh Báo (Đang Giữ)"
                            value={totalHolding}
                            suffix="vé"
                            prefix={<WarningOutlined />}
                            valueStyle={{ color: '#fa541c' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card
                bordered={false}
                style={{ borderRadius: 12, marginTop: 16 }}
                title={
                    <Flex justify="space-between" align="center">
                        <Title level={5} style={{ margin: 0 }}>Danh Sách Người Bán Dạo</Title>
                        <Input
                            placeholder="Tìm theo tên hoặc SĐT..."
                            prefix={<SearchOutlined />}
                            style={{ width: 250 }}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </Flex>
                }
            >
                <Table
                    columns={columnsSellers}
                    dataSource={filteredSellers}
                    pagination={{ pageSize: 10 }}
                    rowKey="id"
                    size="middle"
                />
            </Card>

            <Modal
                title={`Điều Chuyển Vé - Từ ${selectedSeller?.name || ''}`}
                open={isTransferModalOpen}
                onOk={handleTransferSubmit}
                onCancel={() => {
                    setIsTransferModalOpen(false);
                    formTransfer.resetFields();
                }}
                okText="Xác nhận điều chuyển"
                cancelText="Hủy"
            >
                <Form form={formTransfer} layout="vertical">
                    <Form.Item
                        name="receiverId"
                        label="Chuyển đến người bán:"
                        rules={[{ required: true, message: 'Vui lòng chọn người nhận!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn người nhận từ danh sách..."
                            options={activeSellersMock.filter(s => s.id !== selectedSeller?.id).map(s => ({
                                label: `${s.name} - Đang giữ ${s.holdingTickets} vé`,
                                value: s.id
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        name="quantity"
                        label="Số lượng vé điều chuyển:"
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                        help={`Người này hiện đang giữ tối đa ${selectedSeller?.holdingTickets || 0} vé`}
                    >
                        <InputNumber
                            min={1}
                            max={selectedSeller?.holdingTickets || 0}
                            style={{ width: '100%' }}
                            placeholder="Nhập số lượng..."
                        />
                    </Form.Item>
                    <Form.Item name="note" label="Ghi chú (Tùy chọn):">
                        <Input.TextArea rows={2} placeholder="Lý do điều chuyển..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CommandCenterDashboard;
