import React from 'react';
import { CommonHeader } from '@/components/common';
import { Button, Space, Typography } from 'antd';
import { ClockCircleOutlined, ControlOutlined } from '@ant-design/icons';
import { SHIFT_CONSTANTS } from '../constants';

const { Text } = Typography;

interface ShiftHeaderProps {
    onRefresh: () => void;
    onOpenShift: () => void;
    onCloseShift: () => void;
}

export const ShiftHeader: React.FC<ShiftHeaderProps> = ({
    onRefresh,
    onOpenShift,
    onCloseShift,
}) => {
    return (
        <div style={{ marginBottom: '16px' }}>
            <CommonHeader
                title={SHIFT_CONSTANTS.MODULE_TITLE}
                subtitle="Quản lý thời gian, két sắt giao ca cho nhân viên"
                onRefresh={onRefresh}
                showRefresh={true}
                customActions={
                    <Space>
                        <Button
                            type="primary"
                            ghost
                            icon={<ClockCircleOutlined />}
                            onClick={onOpenShift}
                        >
                            {SHIFT_CONSTANTS.ACTIONS.OPEN_SHIFT}
                        </Button>
                        <Button
                            type="primary"
                            style={{ backgroundColor: '#1890ff' }}
                            icon={<ControlOutlined />}
                            onClick={onCloseShift}
                        >
                            {SHIFT_CONSTANTS.ACTIONS.CLOSE_SHIFT}
                        </Button>
                    </Space>
                }
            />
        </div>
    );
};
