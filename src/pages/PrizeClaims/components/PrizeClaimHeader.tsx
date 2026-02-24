import React from 'react';
import { CommonHeader } from '@/components/common';
import { Button } from 'antd';
import { SafetyCertificateOutlined, RetweetOutlined } from '@ant-design/icons';
import { PRIZE_CLAIM_CONSTANTS } from '../constants';

interface PrizeClaimHeaderProps {
    onRefresh: () => void;
    onCreate: () => void;
    onVerify: () => void;
    selectedCount: number;
}

export const PrizeClaimHeader: React.FC<PrizeClaimHeaderProps> = ({
    onRefresh,
    onCreate,
    onVerify,
    selectedCount
}) => {
    return (
        <CommonHeader
            title={PRIZE_CLAIM_CONSTANTS.MODULE_TITLE}
            subtitle="Quản lý và ghi nhận thông tin vé đổi thưởng"
            onRefresh={onRefresh}
            onCreate={onCreate}
            createButtonText={PRIZE_CLAIM_CONSTANTS.ACTIONS.CREATE}
            createButtonIcon={<RetweetOutlined />}
            customActions={
                <Button
                    type="primary"
                    style={{ backgroundColor: '#52c41a' }}
                    icon={<SafetyCertificateOutlined />}
                    onClick={onVerify}
                    disabled={selectedCount === 0}
                >
                    {PRIZE_CLAIM_CONSTANTS.ACTIONS.VERIFY} ({selectedCount})
                </Button>
            }
        />
    );
};
