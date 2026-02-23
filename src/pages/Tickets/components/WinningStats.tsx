import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Typography } from 'antd';
import { TrophyOutlined, ShoppingCartOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import type { Ticket } from '../types/ticketTypes';
import { getWinningStats } from '../utils/winningChecker';
import type { ProvinceResult } from '../utils/winningChecker';
import { formatCurrency } from '@/utils';

const { Title, Text } = Typography;

interface WinningStatsProps {
    tickets: Ticket[];
    results: ProvinceResult[];
    loading?: boolean;
}

export const WinningStats: React.FC<WinningStatsProps> = ({ tickets, results, loading }) => {
    const stats = useMemo(() => getWinningStats(tickets, results), [tickets, results]);

    const columns = [
        {
            title: 'Mã vé',
            dataIndex: ['ticket', 'ticket_code'],
            key: 'code',
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: 'Nhà đài',
            dataIndex: ['ticket', 'station_id'],
            key: 'station',
        },
        {
            title: 'Giải trúng',
            dataIndex: ['winning', 'prizeName'],
            key: 'prize',
            render: (prize: string) => (
                <Tag color={prize === 'ĐB' ? 'gold' : 'blue'} style={{ fontWeight: 600 }}>
                    {prize}
                </Tag>
            )
        },
        {
            title: 'Tiền thưởng',
            dataIndex: ['winning', 'amount'],
            key: 'amount',
            render: (amount: number) => (
                <Text type="success" strong>
                    {formatCurrency(amount)}
                </Text>
            )
        }
    ];

    return (
        <div style={{ marginTop: 24 }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 12 }}>
                        <Statistic
                            title="Tổng vé đã bán"
                            value={stats.totalSold}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 12 }}>
                        <Statistic
                            title="Số vé trúng"
                            value={stats.winnerCount}
                            prefix={<TrophyOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 12 }}>
                        <Statistic
                            title="Tổng tiền trúng"
                            value={stats.totalWinningAmount}
                            prefix={<DollarOutlined />}
                            formatter={(value) => formatCurrency(Number(value))}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 12 }}>
                        <Statistic
                            title="Tỷ lệ trúng"
                            value={(stats.winnerCount / (stats.totalSold || 1)) * 100}
                            precision={2}
                            suffix="%"
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card
                title={<Title level={5} style={{ margin: 0 }}>Danh sách vé trúng thưởng trong ngày</Title>}
                style={{ marginTop: 24, borderRadius: 12 }}
                styles={{ body: { padding: 0 } }}
            >
                <Table
                    columns={columns}
                    dataSource={stats.winners}
                    loading={loading}
                    rowKey={(record) => record.ticket.id}
                    pagination={{ pageSize: 5 }}
                />
            </Card>
        </div>
    );
};
