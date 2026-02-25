import React, { useRef, useEffect } from 'react';
import { Card, Form, InputNumber, Button, Select, Space, message, Typography, Divider, Row, Col, Input } from 'antd';
import { SendOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { usePartnerDebtMutations } from '../hooks';
import { usePartners } from '../../Partners/hooks/usePartners';

const { Title, Text } = Typography;

export const PartnerDebtQuickLedger: React.FC = () => {
    const [form] = Form.useForm();
    const { createMutation } = usePartnerDebtMutations();
    const { data: partnersData, isLoading: isLoadingPartners } = usePartners({ limit: 1000 });
    const partners: any[] = (partnersData?.data as any)?.data || partnersData?.data || [];

    const handleQuickSubmit = async () => {
        try {
            const values = await form.validateFields();
            await createMutation.mutateAsync({
                partner_id: values.partner_id,
                amount: Number(values.amount),
                payment_method: 'cash', // Default to cash for quick entries
                payment_type: values.payment_type,
                transaction_sub_type: values.payment_type === 'income' ? 'payment' : 'return', // Example mapping
                description: values.description || 'Thu/Chi nhanh qua Quick Ledger',
            } as any);

            message.success('Đã lưu giao dịch nhanh thành công!');

            // Reset some fields but might want to keep others (like keeping latest selected type)
            form.resetFields(['amount', 'description']);

            // Focus lại vào ô Đối tác nếu cần
            document.getElementById('quick-partner-select')?.focus();

        } catch (error: any) {
            if (error.errorFields) {
                // Validation errors
                return;
            }
            message.error(error.response?.data?.message || 'Có lỗi khi lưu nhanh!');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleQuickSubmit();
        }
    };

    return (
        <Card
            bordered={false}
            style={{ borderRadius: '12px', marginTop: '16px' }}
            title={<Space><ThunderboltOutlined style={{ color: '#faad14' }} /> <Title level={4} style={{ margin: 0 }}>Sổ Thu Ngân (Quick Ledger)</Title></Space>}
        >
            <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
                Công cụ nhập thu/chi siêu tốc. Dành cho Thu ngân vào giờ cao điểm: Chọn [Đối tác] ➔ Gõ [Số Tiền] ➔ Bấm [Enter]
            </Text>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleQuickSubmit}
                initialValues={{ payment_type: 'income' }}
            >
                <Row gutter={16}>
                    <Col xs={24} md={6}>
                        <Form.Item
                            name="partner_id"
                            label="Đối tác (Khách nợ/Đại lý)"
                            rules={[{ required: true, message: 'Vui lòng chọn đối tác!' }]}
                        >
                            <Select
                                id="quick-partner-select"
                                showSearch
                                loading={isLoadingPartners}
                                placeholder="Gõ tên tìm kiếm..."
                                filterOption={(input, option) =>
                                    String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={partners.map(p => ({
                                    value: p.id,
                                    label: `${p.name} - ${p.phone_number}`,
                                }))}
                                onKeyDown={handleKeyPress}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={4}>
                        <Form.Item
                            name="payment_type"
                            label="Loại (Thu / Chi)"
                            rules={[{ required: true }]}
                        >
                            <Select onKeyDown={handleKeyPress}>
                                <Select.Option value="income">Thu tiền (Có)</Select.Option>
                                <Select.Option value="expense">Chi tiền (Nợ)</Select.Option>
                                <Select.Option value="adjustment">Cấn trừ trúng</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                        <Form.Item
                            name="amount"
                            label="Số tiền (VNĐ)"
                            rules={[{ required: true, message: 'Nhập số tiền!' }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
                                min={0}
                                onKeyDown={handleKeyPress}
                                placeholder="1,000,000"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                        <Form.Item
                            name="description"
                            label="Ghi chú (Tùy chọn)"
                        >
                            <Input
                                placeholder="Nhập diễn giải lô vé..."
                                onKeyDown={handleKeyPress}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={2} style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 24 }}>
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleQuickSubmit}
                            loading={createMutation.isPending}
                            style={{ width: '100%', backgroundColor: '#faad14' }}
                        >
                            LƯU
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Divider dashed />
            <Text type="secondary" italic>Lịch sử 5 giao dịch gần nhất (Cập nhật real-time) sẽ hiển thị tại đây...</Text>
        </Card>
    );
};
