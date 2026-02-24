import React from 'react';
import { CommonHeader } from '@/components/common';
import { Button, Space, Typography } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { CASHBOOK_CONSTANTS } from '../constants';

const { Text } = Typography;

interface CashbookHeaderProps {
    onRefresh: () => void;
    onCreateIncome: () => void;
    onCreateExpense: () => void;
    totalIncome: number;
    totalExpense: number;
}

export const CashbookHeader: React.FC<CashbookHeaderProps> = ({
    onRefresh,
    onCreateIncome,
    onCreateExpense,
    totalIncome,
    totalExpense
}) => {
    return (
        <div style={{ marginBottom: '16px' }}>
            <CommonHeader
                title={CASHBOOK_CONSTANTS.MODULE_TITLE}
                subtitle="Quản lý và theo dõi dòng tiền mặt, chuyển khoản"
                onRefresh={onRefresh}
                showRefresh={true}
                customActions={
                    <Space>
                        <Button
                            type="primary"
                            style={{ backgroundColor: '#52c41a' }}
                            icon={<PlusCircleOutlined />}
                            onClick={onCreateIncome}
                        >
                            {CASHBOOK_CONSTANTS.ACTIONS.CREATE_INCOME}
                        </Button>
                        <Button
                            type="primary"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={onCreateExpense}
                        >
                            {CASHBOOK_CONSTANTS.ACTIONS.CREATE_EXPENSE}
                        </Button>
                    </Space>
                }
            />
            <div style={{
                display: 'flex',
                gap: '24px',
                padding: '16px',
                background: 'rgba(0,0,0,0.02)',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text type="secondary">Tổng Thu (hôm nay)</Text>
                    <Text strong style={{ color: '#52c41a', fontSize: '18px' }}>+{totalIncome.toLocaleString()} đ</Text>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text type="secondary">Tổng Chi (hôm nay)</Text>
                    <Text strong style={{ color: '#ff4d4f', fontSize: '18px' }}>-{totalExpense.toLocaleString()} đ</Text>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(0,0,0,0.1)', paddingLeft: '24px' }}>
                    <Text type="secondary">Cân Đối (Tồn quỹ phát sinh)</Text>
                    <Text strong style={{ color: (totalIncome - totalExpense) >= 0 ? '#1890ff' : '#cf1322', fontSize: '18px' }}>
                        {(totalIncome - totalExpense).toLocaleString()} đ
                    </Text>
                </div>
            </div>
        </div>
    );
};
