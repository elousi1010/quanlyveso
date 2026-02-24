import React from 'react';
import { Table, Tag, Typography, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckCircleOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import type { PrizeClaim } from '../types';
import { PRIZE_CLAIM_CONSTANTS } from '../constants';

const { Text } = Typography;

interface PrizeClaimDataGridProps {
    data: PrizeClaim[];
    loading: boolean;
    onView: (record: PrizeClaim) => void;
    selectedRows: PrizeClaim[];
    onSelectionChange: (rows: PrizeClaim[]) => void;
    page: number;
    rowsPerPage: number;
    total: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (size: number) => void;
}

export const PrizeClaimDataGrid: React.FC<PrizeClaimDataGridProps> = ({
    data,
    loading,
    onView,
    selectedRows,
    onSelectionChange,
    page,
    rowsPerPage,
    total,
    onPageChange,
    onRowsPerPageChange
}) => {
    const rowSelection = {
        selectedRowKeys: selectedRows.map(r => r.id),
        onChange: (_: React.Key[], selectedRows: PrizeClaim[]) => {
            onSelectionChange(selectedRows);
        },
        getCheckboxProps: (record: PrizeClaim) => ({
            disabled: record.status === 'verified_with_company', // Không chọn những cái đã đổi công ty
        }),
    };

    const columns: ColumnsType<PrizeClaim> = [
        {
            title: 'Mã Phiếu',
            dataIndex: 'claimCode',
            key: 'claimCode',
            width: 120,
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Thông Tin Khách Hàng',
            key: 'customer',
            width: 200,
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong><UserOutlined /> {record.customerName}</Text>
                    {record.customerPhone && <Text type="secondary" style={{ fontSize: '12px' }}>{record.customerPhone}</Text>}
                </Space>
            ),
        },
        {
            title: 'Vé Trúng',
            key: 'ticketInfo',
            width: 180,
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.ticketCode}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.stationName}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Xổ: {record.drawDate}</Text>
                </Space>
            ),
        },
        {
            title: 'Giải Thưởng',
            key: 'prize',
            width: 150,
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong style={{ color: '#1890ff' }}>{record.prizeType}</Text>
                    <Text>{record.prizeAmount.toLocaleString()} đ</Text>
                </Space>
            ),
        },
        {
            title: 'Thực Nhận',
            key: 'netAmount',
            width: 180,
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text type="success" strong>{record.netAmount.toLocaleString()} đ</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                        Hoa hồng: {record.commissionAmount.toLocaleString()}đ ({record.commissionRate}%)
                    </Text>
                    {record.taxAmount > 0 && (
                        <Text type="danger" style={{ fontSize: '11px' }}>
                            Thuế: {record.taxAmount.toLocaleString()}đ
                        </Text>
                    )}
                </Space>
            ),
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            align: 'center',
            render: (status: keyof typeof PRIZE_CLAIM_CONSTANTS.STATUS) => {
                const config = PRIZE_CLAIM_CONSTANTS.STATUS[status] || { label: 'Khác', color: 'default' };
                return (
                    <Tag
                        color={config.color}
                        icon={status === 'verified_with_company' ? <CheckCircleOutlined /> : <SyncOutlined spin={status === 'pending'} />}
                        style={{ margin: 0 }}
                    >
                        {config.label}
                    </Tag>
                );
            },
        },
        {
            title: 'Thao Tác',
            key: 'action',
            width: 100,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Button size="small" type="link" onClick={() => onView(record)}>
                    Chi tiết
                </Button>
            ),
        },
    ];

    return (
        <Table
            rowSelection={{
                type: 'checkbox',
                ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={{
                current: page + 1,
                pageSize: rowsPerPage,
                total: total,
                showSizeChanger: true,
                showTotal: (total) => `Tổng số ${total} bản ghi`,
                onChange: (page) => onPageChange(page - 1),
                onShowSizeChange: (_, size) => onRowsPerPageChange(size),
            }}
            scroll={{ x: 1000 }}
            size="middle"
        />
    );
};
