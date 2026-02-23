import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Button,
  Space,
  Avatar,
  Tag,
  Spin,
  Skeleton,
  DatePicker,
  Flex,
  theme as antdTheme
} from 'antd';
import {
  ReloadOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  DatabaseOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';

// Hooks and Utils
import { useDashboardOverview, useDashboardRevenue, useDashboardActivity } from '@/hooks/useDashboard';
import {
  formatCurrency,
  formatNumber,
  formatRelativeTime
} from '@/utils';
import { useTheme } from '@/contexts/ThemeContext';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Custom components
const DashboardCard: React.FC<any> = ({ isDark, style, styles, children, ...props }) => {
  return (
    <Card
      {...props}
      style={{
        borderRadius: '12px',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        background: isDark ? '#1e293b' : '#ffffff',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        height: '100%',
        ...style
      }}
      styles={{ body: { padding: 20 }, ...styles }}
    >
      {children}
    </Card>
  );
};

const IconWrapper: React.FC<{ gradient: string, children: React.ReactNode }> = ({ gradient, children }) => (
  <div style={{
    width: 44,
    height: 44,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: gradient,
    color: '#fff',
    marginBottom: 16,
    fontSize: 20
  }}>
    {children}
  </div>
);

const ChartTooltip = ({ active, payload, label, isDark }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          padding: '12px',
          borderRadius: '8px',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <Text strong style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>{label}</Text>
        {payload.map((entry: any, index: number) => (
          <Flex key={index} align="center" gap={8} style={{ marginBottom: '4px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {entry.name === 'import' ? 'Nhập Kho' : entry.name === 'export' ? 'Xuất Kho' : 'Tổng Cộng'}:
            </Text>
            <Text strong style={{ fontSize: '12px' }}>
              {formatCurrency(entry.value)}
            </Text>
          </Flex>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardOverview: React.FC = () => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const { token } = antdTheme.useToken();
  const now = new Date();

  // State
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('today');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>([
    dayjs().subtract(1, 'day'),
    dayjs()
  ]);
  const [revenueType, setRevenueType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  // Refs for debouncing
  const debounceRef = useRef<number | null>(null);

  // Format today's date for API
  const todayStr = now.toISOString().split('T')[0];

  // Initialize filters with today's date
  const [filters, setFilters] = useState({
    startDate: todayStr,
    endDate: todayStr
  });

  // API calls
  const {
    data: overviewData,
    isLoading,
    refetch
  } = useDashboardOverview(filters);

  const {
    data: revenueData,
    isLoading: isRevenueLoading
  } = useDashboardRevenue(revenueType, filters);

  const {
    data: activityData,
    isLoading: isActivityLoading
  } = useDashboardActivity();

  // Time range change handler
  const handleTimeRangeChange = useCallback((range: 'today' | 'week' | 'month' | 'year') => {
    setTimeRange(range);
    const today = new Date();
    let startDate: Date;
    let endDate: Date = new Date(today);

    switch (range) {
      case 'today':
        startDate = new Date(today);
        break;
      case 'week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate = new Date(today);
    }

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    setFilters({
      startDate: startDateStr,
      endDate: endDateStr
    });

    // Update date range picker
    setDateRange([dayjs(startDateStr), dayjs(endDateStr)]);
  }, []);

  // Date range change handler
  const handleDateRangeChange = useCallback((dates: any) => {
    if (!dates) return;

    setDateRange(dates as [Dayjs, Dayjs]);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');
      setFilters({ startDate, endDate });
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Process data
  const statsData = overviewData ? [
    {
      title: 'Tổng Công Nợ',
      value: formatCurrency(parseFloat(overviewData.debt?.this || '0')),
      unit: 'VND',
      change: '+0%',
      icon: <DollarOutlined />,
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    },
    {
      title: 'Vé Nhập Vào',
      value: formatNumber(parseInt(overviewData.ticketImport?.this || '0')),
      unit: 'vé',
      change: '+0%',
      icon: <DatabaseOutlined />,
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
    },
    {
      title: 'Vé Xuất Ra',
      value: formatNumber(parseInt(overviewData.ticketExport?.this || '0')),
      unit: 'vé',
      change: '+0%',
      icon: <ShoppingCartOutlined />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      title: 'Giao Dịch',
      value: formatNumber(parseInt(overviewData.transaction?.this || '0')),
      unit: 'giao dịch',
      change: '+0%',
      icon: <UserOutlined />,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
  ] : [];

  // Process revenue chart data
  const revenueChartData = revenueData?.map((item: any) => ({
    label: item.label,
    import: item.import || 0,
    export: item.export || 0,
    total: item.total || 0,
  })) || [];

  // Process recent activities
  const recentActivities = Array.isArray(activityData) ? activityData.map((item: any) => ({
    id: item.activity?.id || item.id,
    title: `${item.transaction?.type === 'import' ? 'Nhập' : 'Xuất'} - ${item.transaction?.sub_type || 'Giao dịch'}`,
    description: `${item.partner?.name || 'Đối tác'} - ${item.inventory?.code || 'Kho'}: ${formatCurrency(parseFloat(item.activity?.total || '0'))}`,
    time: formatRelativeTime(item.activity?.created_at || new Date().toISOString()),
    type: item.transaction?.type === 'import' ? 'success' as const : 'warning' as const,
    color: item.transaction?.type === 'import' ? '#10b981' : '#f59e0b',
  })) : [];

  return (
    <div style={{ paddingBottom: '24px' }}>
      {/* Header Section */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={16} style={{ marginBottom: '24px' }}>
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Tổng Quan Hệ Thống</Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>Theo dõi tình hình kinh doanh thời gian thực.</Text>
        </div>

        <Space size="middle" wrap>
          <Space.Compact style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', padding: '4px', borderRadius: '8px' }}>
            {(['today', 'week', 'month', 'year'] as const).map((range) => (
              <Button
                key={range}
                type={timeRange === range ? 'primary' : 'text'}
                onClick={() => handleTimeRangeChange(range)}
                size="small"
                style={{ borderRadius: '6px', fontWeight: 600 }}
              >
                {range === 'today' ? 'Ngày' : range === 'week' ? 'Tuần' : range === 'month' ? 'Tháng' : 'Năm'}
              </Button>
            ))}
          </Space.Compact>

          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="DD/MM/YYYY"
            size="middle"
            style={{ borderRadius: '8px' }}
          />

          <Button
            shape="circle"
            icon={isLoading ? <Spin size="small" /> : <ReloadOutlined />}
            onClick={() => refetch()}
          />
        </Space>
      </Flex>

      {/* Stats Grid */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card loading style={{ borderRadius: '12px' }} />
            </Col>
          ))
        ) : (
          statsData.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <DashboardCard isDark={isDark}>
                <Flex justify="space-between" align="flex-start">
                  <IconWrapper gradient={stat.gradient}>
                    {stat.icon}
                  </IconWrapper>
                  <Tag color="success" style={{ borderRadius: '4px', margin: 0, fontWeight: 600, fontSize: '11px' }}>
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
          ))
        )}
      </Row>

      {/* Main Content Sections */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <DashboardCard isDark={isDark} title={<Text strong>Biểu Đồ Doanh Thu</Text>} extra={
            <Space.Compact style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', padding: '2px', borderRadius: '6px' }}>
              {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((type) => (
                <Button
                  key={type}
                  type={revenueType === type ? 'primary' : 'text'}
                  onClick={() => setRevenueType(type)}
                  size="small"
                  style={{ borderRadius: '4px', fontSize: '12px' }}
                >
                  {type === 'daily' ? 'Ngày' : type === 'weekly' ? 'Tuần' : type === 'monthly' ? 'Tháng' : 'Năm'}
                </Button>
              ))}
            </Space.Compact>
          }>
            <div style={{ height: '320px', marginTop: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorImport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: token.colorTextSecondary, fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: token.colorTextSecondary, fontSize: 11 }} tickFormatter={(val) => `${val / 1000000}M`} />
                  <RechartsTooltip content={<ChartTooltip isDark={isDark} />} />
                  <Area type="monotone" dataKey="import" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorImport)" />
                  <Area type="monotone" dataKey="export" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorExport)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </Col>

        <Col xs={24} lg={8}>
          <DashboardCard isDark={isDark} title={<Text strong>Hoạt Động Gần Đây</Text>}>
            <Space direction="vertical" size={16} style={{ width: '100%', marginTop: '8px' }}>
              {isActivityLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} avatar active paragraph={{ rows: 1 }} />
                ))
              ) : recentActivities.length > 0 ? (
                recentActivities.slice(0, 6).map((activity) => (
                  <Flex key={activity.id} gap={12} align="center">
                    <Avatar
                      size={36}
                      icon={activity.type === 'success' ? <RiseOutlined /> : <FallOutlined />}
                      style={{ background: `${activity.color}15`, color: activity.color, borderRadius: '8px' }}
                    />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <Text strong style={{ display: 'block', fontSize: '13px' }}>{activity.title}</Text>
                      <Text type="secondary" ellipsis style={{ display: 'block', fontSize: '12px' }}>{activity.description}</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: '11px' }}>{activity.time}</Text>
                  </Flex>
                ))
              ) : (
                <div style={{ padding: '24px 0', textAlign: 'center' }}><Text type="secondary">Không có hoạt động nào</Text></div>
              )}
            </Space>
          </DashboardCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} md={12}>
          <DashboardCard isDark={isDark} title={<Text strong>Đối Tác Hàng Đầu</Text>} extra={<Button type="link" size="small">Tất cả</Button>}>
            <Space direction="vertical" size={14} style={{ width: '100%' }}>
              {[
                { name: 'Đại lý Kim Anh', debt: 150000000, grow: '+12%', color: '#6366f1' },
                { name: 'Đại lý Minh Ngọc', debt: 85000000, grow: '+8%', color: '#10b981' },
                { name: 'Đại lý Thành Phát', debt: 42000000, grow: '-3%', color: '#f59e0b' },
              ].map((partner, i) => (
                <Flex key={i} align="center" gap={12}>
                  <Avatar size={32} style={{ background: `${partner.color}15`, color: partner.color, fontWeight: 700, borderRadius: '6px' }}>{partner.name.charAt(0)}</Avatar>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ display: 'block', fontSize: '13px' }}>{partner.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{formatCurrency(partner.debt)}</Text>
                  </div>
                  <Tag color={partner.grow.startsWith('+') ? 'success' : 'error'} style={{ borderRadius: '4px', margin: 0, fontSize: '11px' }}>{partner.grow}</Tag>
                </Flex>
              ))}
            </Space>
          </DashboardCard>
        </Col>

        <Col xs={24} md={12}>
          <DashboardCard isDark={isDark} title={<Text strong>Trạm Vé Hoạt Động</Text>} extra={<Button type="link" size="small">Chi tiết</Button>}>
            <Space direction="vertical" size={14} style={{ width: '100%' }}>
              {[
                { name: 'Trạm Miền Nam', tickets: 45000, load: 85, color: '#3b82f6' },
                { name: 'Trạm Miền Trung', tickets: 12000, load: 45, color: '#8b5cf6' },
                { name: 'Trạm Miền Bắc', tickets: 28000, load: 65, color: '#ec4899' },
              ].map((station, i) => (
                <div key={i}>
                  <Flex justify="space-between" align="center" style={{ marginBottom: '4px' }}>
                    <Text strong style={{ fontSize: '13px' }}>{station.name}</Text>
                    <Text strong style={{ color: token.colorPrimary, fontSize: '11px' }}>{formatNumber(station.tickets)} vé</Text>
                  </Flex>
                  <div style={{ width: '100%', height: '4px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: station.color, width: `${station.load}%` }} />
                  </div>
                </div>
              ))}
            </Space>
          </DashboardCard>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardOverview;
