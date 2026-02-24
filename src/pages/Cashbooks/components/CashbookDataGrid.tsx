import React from 'react';
import { Table, Tag, Typography, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FallOutlined, RiseOutlined, IdcardOutlined, BankOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import type { CashbookTransaction } from '../types';
import { CASHBOOK_CONSTANTS } from '../constants';

const { Text } = Typography;

interface CashbookDataGridProps {
    data: CashbookTransaction[];
    loading: boolean;
    onView: (record: CashbookTransaction) => void;
    page: number;
    rowsPerPage: number;
    total: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (size: number) => void;
}

export const CashbookDataGrid: React.FC<CashbookDataGridProps> = ({
    data,
    loading,
    onView,
    page,
    rowsPerPage,
    total,
    onPageChange,
    onRowsPerPageChange
}) => {

    const columns: ColumnsType<CashbookTransaction> = [
        {
            title: 'Mã Phiếu',
            dataIndex: 'transactionCode',
            key: 'transactionCode',
            width: 140,
            render: (text, record) => (
                <Space direction="vertical" size={2}>
                    <Text strong>{text}</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                        {new Date(record.transactionDate).toLocaleString('vi-VN')}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Loại Giao Dịch',
            key: 'type',
            width: 120,
            align: 'center',
            render: (_, record) => {
                const typeConfig = CASHBOOK_CONSTANTS.TYPES[record.type];
                return (
                    <Tag
                        color={typeConfig.color}
                        icon={record.type === 'income' ? <RiseOutlined /> : <FallOutlined />}
                        style={{ fontWeight: 600, width: '60px', textAlign: 'center' }}
                    >
                        {typeConfig.label}
                    </Tag>
                );
            },
        },
        {
            title: 'Nội Dung',
            key: 'subType',
            width: 160,
            render: (_, record) => (
                <Text>{CASHBOOK_CONSTANTS.SUB_TYPES[record.subType]}</Text>
            ),
        },
        {
            title: 'Số Tiền',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            align: 'right',
            render: (amount: number, record) => (
                <Text strong style={{ color: record.type === 'income' ? '#52c41a' : '#ff4d4f', fontSize: '15px' }}>
                    {record.type === 'income' ? '+' : '-'}{amount.toLocaleString()} đ
                </Text>
            ),
        },
        {
            title: 'Khách / Đối Tác',
            key: 'partnerName',
            width: 200,
            render: (_, record) => (
                <Space direction="vertical" size={2}>
                    <Text strong><IdcardOutlined /> {record.partnerName}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.paymentMethod === 'bank_transfer' ?
                            <><BankOutlined /> Chuyển khoản</> :
                            <><MoneyCollectOutlined /> Tiền mặt</>
                        }
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Ghi Chú',
            dataIndex: 'note',
            key: 'note',
            width: 220,
            ellipsis: true,
            render: (text) => <Text type="secondary">{text}</Text>,
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
