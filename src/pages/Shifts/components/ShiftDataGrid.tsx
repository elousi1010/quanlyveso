import React from 'react';
import { Table, Tag, Typography, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FieldTimeOutlined, CarryOutOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import type { Shift } from '../types';
import { SHIFT_CONSTANTS } from '../constants';

const { Text } = Typography;

interface ShiftDataGridProps {
    data: Shift[];
    loading: boolean;
    onView: (record: Shift) => void;
    page: number;
    rowsPerPage: number;
    total: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (size: number) => void;
}

export const ShiftDataGrid: React.FC<ShiftDataGridProps> = ({
    data,
    loading,
    onView,
    page,
    rowsPerPage,
    total,
    onPageChange,
    onRowsPerPageChange
}) => {

    const columns: ColumnsType<Shift> = [
        {
            title: 'Thông tin Ca',
            key: 'shiftInfo',
            width: 180,
            render: (_, record) => (
                <Space direction="vertical" size={2}>
                    <Text strong>{record.shiftCode}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}><EnvironmentOutlined /> {record.stationName}</Text>
                </Space>
            ),
        },
        {
            title: 'Người Phụ Trách',
            key: 'employee',
            width: 180,
            render: (_, record) => (
                <Space direction="vertical" size={2}>
                    <Text><UserOutlined /> {record.employeeName}</Text>
                </Space>
            ),
        },
        {
            title: 'Thời Gian Ra/Vào',
            key: 'timing',
            width: 200,
            render: (_, record) => (
                <Space direction="vertical" size={2}>
                    <Text style={{ fontSize: '13px', color: '#52c41a' }}><CarryOutOutlined /> Mở: {new Date(record.openedAt).toLocaleString('vi-VN')}</Text>
                    {record.closedAt ? (
                        <Text style={{ fontSize: '13px', color: '#ff4d4f' }}><FieldTimeOutlined /> Đóng: {new Date(record.closedAt).toLocaleString('vi-VN')}</Text>
                    ) : (
                        <Text type="secondary" style={{ fontSize: '13px' }}>Chưa chốt ca</Text>
                    )}
                </Space>
            ),
        },
        {
            title: 'Kiểm Kê Tiền',
            key: 'cash',
            width: 220,
            render: (_, record) => {
                if (record.status === 'open') {
                    return <Text italic type="secondary">Sẽ kiểm đếm khi chốt ca</Text>;
                }

                const isMatch = record.cashDifference === 0;
                return (
                    <Space direction="vertical" size={0}>
                        <Text>Thực tế: <strong>{record.actualCash.toLocaleString()} đ</strong></Text>
                        <Text type="secondary" style={{ fontSize: '11px' }}>Hệ thống: {record.systemCash.toLocaleString()} đ</Text>
                        {!isMatch && (
                            <Text type="danger" style={{ fontSize: '11px' }}>Lệch: {record.cashDifference > 0 ? '+' : ''}{record.cashDifference.toLocaleString()} đ</Text>
                        )}
                    </Space>
                )
            },
        },
        {
            title: 'Trạng Thái',
            key: 'status',
            width: 160,
            align: 'center',
            render: (_, record) => {
                const statusConfig = SHIFT_CONSTANTS.STATUS[record.status];
                return (
                    <Tag
                        color={statusConfig.color}
                        style={{ fontWeight: 600 }}
                    >
                        {statusConfig.label}
                    </Tag>
                );
            }
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
