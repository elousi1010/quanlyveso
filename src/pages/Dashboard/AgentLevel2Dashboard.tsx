import React, { useState } from 'react';
import {
    Card,
    Typography,
    Row,
    Col,
    Button,
    Space,
    Avatar,
    Tag,
    Flex,
    Table,
    theme as antdTheme,
    Alert
} from 'antd';
import {
    ReloadOutlined,
    UserOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    WarningOutlined,
    HistoryOutlined,
    TeamOutlined,
    BarcodeOutlined
} from '@ant-design/icons';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import styled from '@emotion/styled';
import { useTheme } from '@/contexts/ThemeContext';
import { formatCurrency, formatNumber } from '@/utils';
import { MOCK_AGENT_DASHBOARD_DATA } from '@/data/dashboardMockData';

const { Title, Text } = Typography;

// Styled components
const DashboardCard = styled(Card) <{ isDark: boolean }>`
  border-radius: 12px;
  border: 1px solid ${props => props.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
  background: ${props => props.isDark ? '#1e293b' : '#ffffff'};
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  height: 100%;
  
  .ant-card-body {
    padding: 20px;
  }
`;

const IconWrapper = styled.div<{ gradient: string }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.gradient};
  color: #fff;
  margin-bottom: 16px;
  font-size: 20px;
`;

const AgentLevel2Dashboard: React.FC = () => {
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const { token } = antdTheme.useToken();
    const [loading, setLoading] = useState(false);

    const data = MOCK_AGENT_DASHBOARD_DATA;

    const statsData = [
        {
            title: 'Người bán hoạt động',
            value: data.overview.activeSellers.count,
            unit: 'người',
            change: data.overview.activeSellers.change,
            icon: <TeamOutlined />,
            gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        },
        {
            title: 'Doanh thu hôm nay',
            value: formatCurrency(parseFloat(data.overview.todaySales.amount)),
            unit: `${formatNumber(data.overview.todaySales.count)} vé`,
            change: 'Hôm nay',
            icon: <DollarOutlined />,
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        },
        {
            title: 'Chưa thu tiền',
            value: formatCurrency(parseFloat(data.overview.pendingCollection.amount)),
            unit: `${data.overview.pendingCollection.count} người chưa nộp`,
            change: 'Kết toán ngày',
            icon: <HistoryOutlined />,
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        },
        {
            title: 'Vé tồn (Rủi ro)',
            value: data.overview.unreturnedTickets.count,
            unit: 'vé chưa trả',
            change: 'Cần thu hồi',
            icon: <BarcodeOutlined />,
            gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
        },
    ];

    const columns = [
        {
            title: 'Người bán dạo',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Khu vực',
            dataIndex: 'area',
            key: 'area',
            render: (text: string) => (
                <Space>
                    <EnvironmentOutlined style={{ color: token.colorPrimary }} />
                    {text}
                </Space>
            ),
        },
        {
            title: 'Số tiền nợ',
            dataIndex: 'amount',
            key: 'amount',
            render: (val: number) => <Text style={{ color: '#f43f5e', fontWeight: 600 }}>{formatCurrency(val)}</Text>,
        },
        {
            title: 'Vé giữ',
            dataIndex: 'tickets',
            key: 'tickets',
            render: (val: number) => `${val} tờ`,
        },
        {
            title: 'Cập nhật',
            dataIndex: 'lastSeen',
            key: 'lastSeen',
            render: (text: string) => <Tag bordered={false}>{text}</Tag>,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: () => (
                <Button type="primary" size="small" style={{ borderRadius: '4px' }}>
                    Nhắc nợ
                </Button>
            ),
        },
    ];

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 800);
    };

    return (
        <div style={{ paddingBottom: '24px' }}>
            {/* Header */}
            <Flex justify="space-between" align="center" wrap="wrap" gap={16} style={{ marginBottom: '24px' }}>
                <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                        Dashboard Đại Lý Cấp 2
                    </Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                        Hệ thống quản lý phân phối lẻ & Điều hành người bán dạo.
                    </Text>
                </div>
                <Space>
                    <Alert
                        message="Giờ thu hồi vé ế: 15:30 (Còn 2 tiếng)"
                        type="warning"
                        showIcon
                        style={{ borderRadius: '8px', padding: '4px 12px' }}
                    />
                    <Button
                        icon={<ReloadOutlined spin={loading} />}
                        onClick={handleRefresh}
                        shape="circle"
                    />
                </Space>
            </Flex>

            {/* Stats Grid */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                {statsData.map((stat, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <DashboardCard isDark={isDark}>
                            <Flex justify="space-between" align="flex-start">
                                <IconWrapper gradient={stat.gradient}>
                                    {stat.icon}
                                </IconWrapper>
                                <Tag bordered={false} color={index === 3 ? 'error' : 'processing'} style={{ borderRadius: '4px', margin: 0, fontWeight: 600, fontSize: '11px' }}>
                                    {stat.change}
                                </Tag>
                            </Flex>
                            <Text type="secondary" strong style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                                {stat.title}
                            </Text>
                            <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                                {stat.value}
                            </Title>
                            <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                                {stat.unit}
                            </Text>
                        </DashboardCard>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]}>
                {/* Pending Collections Table */}
                <Col xs={24} xl={16}>
                    <DashboardCard isDark={isDark} title={<Text strong>Tiểu thương chưa nộp tiền & vé ế</Text>}>
                        <Table
                            dataSource={data.pendingSellers}
                            columns={columns}
                            pagination={false}
                            size="middle"
                            rowKey="name"
                            style={{ marginTop: '8px' }}
                        />
                        <Button type="link" block style={{ marginTop: '16px' }}>
                            Xem tất cá 12 người chưa nộp
                        </Button>
                    </DashboardCard>
                </Col>

                {/* Area Performance Chart */}
                <Col xs={24} xl={8}>
                    <DashboardCard isDark={isDark} title={<Text strong>Doanh thu theo khu vực</Text>}>
                        <div style={{ height: '300px', width: '100%', marginTop: '16px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.areaPerformance} layout="vertical" margin={{ left: 20, right: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="area"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: token.colorTextSecondary, fontSize: 12 }}
                                    />
                                    <RechartsTooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={20}>
                                        {data.areaPerformance.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ marginTop: '16px' }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {data.areaPerformance.map((item, i) => (
                                    <Flex key={i} justify="space-between" align="center">
                                        <Space>
                                            <div style={{ width: 8, height: 8, borderRadius: '2px', background: item.color }} />
                                            <Text style={{ fontSize: '12px' }}>{item.area}</Text>
                                        </Space>
                                        <Text strong style={{ fontSize: '12px' }}>{formatNumber(item.sales)} vé</Text>
                                    </Flex>
                                ))}
                            </Space>
                        </div>
                    </DashboardCard>
                </Col>
            </Row>

            {/* Quick Actions / Tips */}
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col xs={24}>
                    <DashboardCard isDark={isDark}>
                        <Flex align="center" gap={16}>
                            <Avatar
                                size={48}
                                icon={<WarningOutlined />}
                                style={{ background: '#fef3c7', color: '#d97706' }}
                            />
                            <div>
                                <Text strong style={{ fontSize: '14px', display: 'block' }}>Mẹo vận hành sáng nay:</Text>
                                <Text type="secondary" style={{ fontSize: '13px' }}>
                                    Khu vực **Bình Thạnh** đang có sức mua tăng đột biến (+25%). Hãy cân nhắc điều chuyển bớt 3,000 tờ vé HCM từ các đại lý khu vực Quận 3 sang đây để tối ưu hóa doanh thu.
                                </Text>
                            </div>
                            <Button type="primary" ghost style={{ marginLeft: 'auto', borderRadius: '6px' }}>
                                Thực hiện ngay
                            </Button>
                        </Flex>
                    </DashboardCard>
                </Col>
            </Row>
        </div>
    );
};

export default AgentLevel2Dashboard;
