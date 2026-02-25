import React, { useState } from 'react';
import { Modal, Steps, Form, Input, Select, DatePicker, Button, InputNumber, Divider, Typography, Space } from 'antd';
import { UserOutlined, AppstoreOutlined } from '@ant-design/icons';
import { usePartners } from '@/pages/Partners/hooks/usePartners';
import { useInventories } from '@/pages/Inventory/hooks/useInventories';
import type { InventoryTransactionType } from '../types';
import type { Partner } from '@/types/partner';

const { Title, Text } = Typography;

interface InventoryTransactionFormDialogProps {
    open: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => Promise<void>;
    initialType: InventoryTransactionType;
}

export const InventoryTransactionFormDialog: React.FC<InventoryTransactionFormDialogProps> = ({
    open,
    onCancel,
    onSubmit,
    initialType,
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();

    // Data fetching hooks for select options
    const { data: partnersResponse, isLoading: isLoadingPartners } = usePartners({ limit: 100 });
    const { data: inventoryResponse, isLoading: isLoadingInventory } = useInventories({ limit: 100 });

    const partners: Partner[] = (partnersResponse?.data as any)?.data || partnersResponse?.data || [];
    // For inventory if we want to show available ones
    const inventoryItems = (inventoryResponse?.data as any)?.data || inventoryResponse?.data || [];

    const handleNext = async () => {
        try {
            await form.validateFields();
            setCurrentStep(1);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(0);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit(values);
            form.resetFields();
            setCurrentStep(0);
            onCancel();
        } catch (error) {
            console.error('Submit validation failed:', error);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setCurrentStep(0);
        onCancel();
    };

    const currentType = Form.useWatch('type', form) || initialType;

    // Render Step 1: Partner & Transaction Details
    const renderStep1 = () => (
        <div style={{ marginTop: 24 }}>
            <Form.Item
                name="type"
                label="Loại giao dịch"
                initialValue={initialType}
                rules={[{ required: true, message: 'Vui lòng chọn loại giao dịch' }]}
            >
                <Select disabled>
                    <Select.Option value="import">Nhập trả vé (Import/Return)</Select.Option>
                    <Select.Option value="export">Xuất vé (Export)</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="sub_type"
                label="Lý do chi tiết"
                rules={[{ required: true, message: 'Vui lòng chọn lý do' }]}
            >
                <Select>
                    {currentType === 'import' ? (
                        <>
                            <Select.Option value="return">Trả vé dự phòng</Select.Option>
                            <Select.Option value="buy_from_agent">Nhập từ nhà phân phối</Select.Option>
                        </>
                    ) : (
                        <>
                            <Select.Option value="sell_to_customer">Xuất bán cho khách/đại lý</Select.Option>
                            <Select.Option value="transfer">Luân chuyển</Select.Option>
                        </>
                    )}
                </Select>
            </Form.Item>

            <Form.Item
                name="partner_id"
                label="Chọn Đối Tác"
                rules={[{ required: true, message: 'Vui lòng chọn đối tác giao dịch' }]}
            >
                <Select
                    allowClear
                    showSearch
                    loading={isLoadingPartners}
                    placeholder="Tìm đối tác..."
                    filterOption={(input, option) =>
                        String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={partners.map((p) => ({
                        value: p.id,
                        label: `${p.name} - ${p.phone_number}`,
                    }))}
                />
            </Form.Item>

            <Form.Item name="note" label="Ghi chú thêm">
                <Input.TextArea rows={2} placeholder="Nhập ghi chú cho giao dịch này..." />
            </Form.Item>
        </div>
    );

    // Render Step 2: Series Selection
    const renderStep2 = () => (
        <div style={{ marginTop: 24 }}>
            <Form.Item
                name="ticket_id"
                label="Chọn Vé/Dải số cấu hình (Ticket ID)"
                rules={[{ required: true, message: 'Vui lòng chọn vé' }]}
            >
                <Input placeholder="Nhập Ticket ID hoặc chọn từ kho..." />
            </Form.Item>

            <Form.Item
                name="code"
                label="Mã Dải Số (Code/Series)"
                rules={[{ required: true, message: 'Vui lòng nhập mã dải số' }]}
            >
                <Input placeholder="Ví dụ: MN_6969" />
            </Form.Item>

            <Form.Item
                name="quantity"
                label="Số lượng vé"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
            >
                <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="avg_cost"
                label="Đơn giá (AVG Cost)"
                rules={[{ required: true, message: 'Vui lòng nhập đơn giá' }]}
            >
                <InputNumber min={0} step={100} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="draw_date"
                label="Ngày quay số (Mẫu: YYYY-MM-DD)"
                rules={[{ required: true, message: 'Vui lòng nhập ngày quay số' }]}
            >
                <Input placeholder="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
                name="station_id"
                label="Trạm xổ số (Station ID)"
                rules={[{ required: true, message: 'Vui lòng điền m\u00e3 trạm xổ số' }]}
            >
                <Input placeholder="Nhập ID trạm xổ số" />
            </Form.Item>
        </div>
    );

    return (
        <Modal
            title={<Title level={4}>Tạo Giao Dịch Kho</Title>}
            open={open}
            onCancel={handleClose}
            width={700}
            footer={[
                <Button key="cancel" onClick={handleClose}>
                    Hủy bỏ
                </Button>,
                currentStep > 0 && (
                    <Button key="back" onClick={handlePrevious}>
                        Quay lại
                    </Button>
                ),
                currentStep < 1 && (
                    <Button key="next" type="primary" onClick={handleNext}>
                        Tiếp tục (Chọn dải số)
                    </Button>
                ),
                currentStep === 1 && (
                    <Button key="submit" type="primary" onClick={handleSubmit}>
                        Xác nhận tạo giao dịch
                    </Button>
                ),
            ].filter(Boolean)}
            style={{ top: 40 }}
        >
            <Steps
                current={currentStep}
                items={[
                    {
                        title: 'Thông tin chung',
                        description: 'Chọn loại giao dịch & Đối tác',
                        icon: <UserOutlined />,
                    },
                    {
                        title: 'Chi tiết vé',
                        description: 'Chọn dải số & Số lượng',
                        icon: <AppstoreOutlined />,
                    },
                ]}
            />

            <Divider />

            <Form form={form} layout="vertical" preserve={false}>
                {currentStep === 0 && renderStep1()}
                {currentStep === 1 && renderStep2()}
            </Form>
        </Modal>
    );
};
