import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
  Stack,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Alert,
  Button,
  ButtonGroup,
  Skeleton,
  useTheme
} from '@mui/material';
import {
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  ConfirmationNumber as TicketIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useDashboardOverview, useDashboardActivity, useDashboardRevenue } from '@/hooks';
import { type DashboardFilters } from '@/types/dashboard';
import { 
  formatCurrency, 
  formatNumber, 
  formatDate, 
  formatRelativeTime 
} from '@/utils';

const DashboardOverview: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('today');
  const [revenueType, setRevenueType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  
  // Fetch dashboard data
  const { 
    data: dashboardData, 
    isLoading, 
    error, 
    refetch 
  } = useDashboardOverview(filters);

  // Fetch activity data
  const { 
    data: activityData, 
    isLoading: isActivityLoading 
  } = useDashboardActivity();

  // Fetch revenue data
  const { 
    data: revenueData, 
    isLoading: isRevenueLoading 
  } = useDashboardRevenue(revenueType);

  // Handle time range change
  const handleTimeRangeChange = (range: 'today' | 'week' | 'month' | 'year') => {
    setTimeRange(range);
    const now = new Date();
    let startDate: string;
    let newRevenueType: 'daily' | 'weekly' | 'monthly' | 'yearly';
    
    switch (range) {
      case 'today':
        startDate = formatDate(now, 'API'); // Use API format (YYYY-MM-DD)
        newRevenueType = 'daily';
        break;
      case 'week': {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        startDate = formatDate(weekAgo, 'API');
        newRevenueType = 'weekly';
        break;
      }
      case 'month': {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        startDate = formatDate(monthAgo, 'API');
        newRevenueType = 'monthly';
        break;
      }
      case 'year': {
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        startDate = formatDate(yearAgo, 'API');
        newRevenueType = 'yearly';
        break;
      }
      default:
        startDate = formatDate(now, 'API');
        newRevenueType = 'daily';
    }
    
    setRevenueType(newRevenueType);
    setFilters({
      ...filters,
      startDate,
      endDate: formatDate(now, 'API')
    });
  };

  // Helper function to safely format growth percentage
  const formatGrowth = (value: number | undefined | null): string => {
    if (value == null || isNaN(value)) return '0.0';
    return value.toFixed(1);
  };

  // Helper function to determine growth type
  // const getGrowthType = (value: number | undefined | null): 'positive' | 'negative' | 'neutral' => {
  //   if (value == null || isNaN(value) || value === 0) return 'neutral';
  //   return value > 0 ? 'positive' : 'negative';
  // };

  // Helper function to safely format numbers
  const safeFormatNumber = (value: number | undefined | null): string => {
    if (value == null || isNaN(value)) return '0';
    return formatNumber(value);
  };

  // Helper function to safely format currency
  const safeFormatCurrency = (value: number | undefined | null): string => {
    if (value == null || isNaN(value)) return formatCurrency(0);
    return formatCurrency(value);
  };

  // Prepare stats data from API - Updated to match actual response
  const statsData = dashboardData ? [
    {
      title: 'Tổng nợ',
      value: safeFormatCurrency(parseFloat(dashboardData.debt.this || '0')),
      unit: 'VNĐ',
      change: dashboardData.debt.prev ? 
        `${((parseFloat(dashboardData.debt.this || '0') - parseFloat(dashboardData.debt.prev)) / parseFloat(dashboardData.debt.prev) * 100).toFixed(1)}%` : '0%',
      changeType: dashboardData.debt.prev ? 
        (parseFloat(dashboardData.debt.this || '0') > parseFloat(dashboardData.debt.prev) ? 'positive' : 'negative') : 'neutral',
      icon: <MoneyIcon />,
      color: '#f44336',
      bgColor: '#ffebee',
    },
    {
      title: 'Vé nhập',
      value: safeFormatNumber(parseInt(dashboardData.ticketImport.this || '0')),
      unit: 'vé',
      change: dashboardData.ticketImport.prev ? 
        `${((parseInt(dashboardData.ticketImport.this || '0') - parseInt(dashboardData.ticketImport.prev)) / parseInt(dashboardData.ticketImport.prev) * 100).toFixed(1)}%` : '0%',
      changeType: dashboardData.ticketImport.prev ? 
        (parseInt(dashboardData.ticketImport.this || '0') > parseInt(dashboardData.ticketImport.prev) ? 'positive' : 'negative') : 'neutral',
      icon: <TicketIcon />,
      color: '#2196f3',
      bgColor: '#e3f2fd',
    },
    {
      title: 'Vé xuất',
      value: safeFormatNumber(parseInt(dashboardData.ticketExport.this || '0')),
      unit: 'vé',
      change: dashboardData.ticketExport.prev ? 
        `${((parseInt(dashboardData.ticketExport.this || '0') - parseInt(dashboardData.ticketExport.prev)) / parseInt(dashboardData.ticketExport.prev) * 100).toFixed(1)}%` : '0%',
      changeType: dashboardData.ticketExport.prev ? 
        (parseInt(dashboardData.ticketExport.this || '0') > parseInt(dashboardData.ticketExport.prev) ? 'positive' : 'negative') : 'neutral',
      icon: <ReceiptIcon />,
      color: '#ff9800',
      bgColor: '#fff3e0',
    },
    {
      title: 'Giao dịch',
      value: safeFormatNumber(parseInt(dashboardData.transaction.this || '0')),
      unit: 'giao dịch',
      change: dashboardData.transaction.prev ? 
        `${((parseInt(dashboardData.transaction.this || '0') - parseInt(dashboardData.transaction.prev)) / parseInt(dashboardData.transaction.prev) * 100).toFixed(1)}%` : '0%',
      changeType: dashboardData.transaction.prev ? 
        (parseInt(dashboardData.transaction.this || '0') > parseInt(dashboardData.transaction.prev) ? 'positive' : 'negative') : 'neutral',
      icon: <PeopleIcon />,
      color: '#9c27b0',
      bgColor: '#f3e5f5',
    },
    {
      title: 'Tổng nợ (trước)',
      value: safeFormatCurrency(parseFloat(dashboardData.debt.prev || '0')),
      unit: 'VNĐ',
      change: '0%',
      changeType: 'neutral' as const,
      icon: <AccountBalanceIcon />,
      color: '#607d8b',
      bgColor: '#eceff1',
    },
    {
      title: 'Vé nhập (trước)',
      value: safeFormatNumber(parseInt(dashboardData.ticketImport.prev || '0')),
      unit: 'vé',
      change: '0%',
      changeType: 'neutral' as const,
      icon: <StoreIcon />,
      color: '#795548',
      bgColor: '#efebe9',
    },
  ] : [];

  // Chart colors
  const chartColors = ['#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#607d8b', '#795548'];

  // Prepare chart data from revenue API
  const revenueChartData = revenueData?.map(item => ({
    label: item.label,
    import: item.import,
    export: item.export,
    total: item.total,
    revenue: item.total, // For backward compatibility with existing chart
  })) || [];

  const topPartnersData = (dashboardData as any)?.topPartners?.slice(0, 5) || [];
  const topStationsData = (dashboardData as any)?.topStations?.slice(0, 5) || [];

  // System health data
  const systemHealthData = (dashboardData as any)?.systemHealth;
  const inventoryStatus = (dashboardData as any)?.inventoryStatus;

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Có lỗi xảy ra khi tải dữ liệu dashboard. Vui lòng thử lại.
        </Alert>
        <Button variant="contained" onClick={() => refetch()}>
          Thử lại
        </Button>
      </Box>
    );
  }

  // Prepare recent activities from activity API or fallback to transactions
  const recentActivities = activityData ? [{
    id: activityData.activity.id,
    title: `${activityData.activity.transaction.type === 'export' ? 'Xuất hàng' : 'Nhập hàng'} - ${activityData.activity.transaction.sub_type}`,
    description: `${activityData.partner.name} - ${activityData.inventory.code}: ${safeFormatCurrency(parseFloat(activityData.activity.total))} (${activityData.activity.quantity} vé)`,
    time: formatRelativeTime(new Date(activityData.activity.created_at)),
    type: activityData.activity.transaction.type === 'export' ? 'warning' as const : 'success' as const,
    avatar: undefined,
    color: activityData.activity.transaction.type === 'export' ? '#ff9800' : '#4caf50',
  }] : (dashboardData as any)?.recentTransactions?.slice(0, 5)?.map(transaction => ({
    id: transaction.id,
    title: `Giao dịch ${transaction.type || 'N/A'}`,
    description: `${transaction.partnerName || 'N/A'} - ${transaction.stationName || 'N/A'}: ${safeFormatCurrency(transaction.amount)}`,
    time: transaction.createdAt ? formatRelativeTime(new Date(transaction.createdAt)) : 'N/A',
    type: transaction.status === 'completed' ? 'success' as const : 'warning' as const,
    avatar: undefined,
    color: transaction.status === 'completed' ? '#4caf50' : '#ff9800',
  })) || [];

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2 },
      background: isDark 
        ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
        : 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                mb: 1, 
                fontSize: { xs: '1.5rem', sm: '2rem' },
                color: isDark ? '#ffffff' : 'text.primary',
                textShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : 'none'
              }}
            >
              Dashboard Tổng Quan
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
              }}
            >
              Thống kê và báo cáo tổng quan về hoạt động hệ thống
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ButtonGroup 
              size="small" 
              variant="outlined"
              sx={{
                '& .MuiButton-root': {
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'text.primary',
                  '&:hover': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                  },
                  '&.Mui-selected': {
                    backgroundColor: isDark ? 'rgba(79, 172, 254, 0.2)' : 'primary.main',
                    color: isDark ? '#ffffff' : 'white',
                    borderColor: isDark ? 'rgba(79, 172, 254, 0.5)' : 'primary.main'
                  }
                }
              }}
            >
              <Button 
                onClick={() => handleTimeRangeChange('today')}
                variant={timeRange === 'today' ? 'contained' : 'outlined'}
              >
                Hôm nay
              </Button>
              <Button 
                onClick={() => handleTimeRangeChange('week')}
                variant={timeRange === 'week' ? 'contained' : 'outlined'}
              >
                Tuần
              </Button>
              <Button 
                onClick={() => handleTimeRangeChange('month')}
                variant={timeRange === 'month' ? 'contained' : 'outlined'}
              >
                Tháng
              </Button>
              <Button 
                onClick={() => handleTimeRangeChange('year')}
                variant={timeRange === 'year' ? 'contained' : 'outlined'}
              >
                Năm
              </Button>
            </ButtonGroup>
            <IconButton 
              color="primary" 
              onClick={() => refetch()} 
              disabled={isLoading}
              sx={{
                color: isDark ? 'rgba(79, 172, 254, 0.8)' : 'primary.main',
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(79, 172, 254, 0.1)' : 'rgba(25, 118, 210, 0.1)'
                }
              }}
            >
              {isLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Card sx={{ p: 2 }}>
                  <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
                  <Skeleton variant="text" height={40} width="60%" />
                  <Skeleton variant="text" height={20} width="40%" />
                  <Skeleton variant="text" height={24} width="80%" />
                </Card>
              </Grid>
            ))
          ) : (
            statsData.map((stat, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
            <Card
              sx={{
                height: '100%',
                background: isDark 
                  ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
                  : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: isDark 
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid #e0e0e0',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                boxShadow: isDark 
                  ? '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                  : '0 4px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: isDark 
                    ? '0px 8px 25px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    : '0px 8px 25px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                },
              }}
            >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: stat.bgColor,
                      color: stat.color,
                          width: { xs: 40, sm: 48 },
                          height: { xs: 40, sm: 48 },
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Chip
                    label={stat.change}
                    size="small"
                        color={stat.changeType === 'positive' ? 'success' : stat.changeType === 'negative' ? 'error' : 'default'}
                    sx={{ fontWeight: 600 }}
                        icon={stat.changeType === 'positive' ? <TrendingUpIcon /> : stat.changeType === 'negative' ? <TrendingDownIcon /> : undefined}
                  />
                </Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 0.5, 
                        color: isDark ? '#ffffff' : 'text.primary', 
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        textShadow: isDark ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 1, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'
                      }}
                    >
                      {stat.unit}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600, 
                        color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'text.primary', 
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      {stat.title}
                    </Typography>
              </CardContent>
            </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      {/* Charts and Data */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              background: isDark 
                ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: isDark 
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid #e0e0e0',
              boxShadow: isDark 
                ? '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                : '0 4px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: isDark ? '#ffffff' : 'text.primary'
                  }}
                >
                  Biểu đồ doanh thu ({revenueType === 'daily' ? 'Hàng ngày' : revenueType === 'weekly' ? 'Hàng tuần' : revenueType === 'monthly' ? 'Hàng tháng' : 'Hàng năm'})
                </Typography>
                <IconButton 
                  size="small"
                  sx={{
                    color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                    }
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
              {(isLoading || isRevenueLoading) ? (
                <Skeleton variant="rectangular" height={300} />
              ) : revenueChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        safeFormatCurrency(value),
                        name === 'import' ? 'Nhập hàng' : name === 'export' ? 'Xuất hàng' : 'Tổng doanh thu'
                      ]}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="import" 
                      stackId="1"
                      stroke="#2196f3" 
                      fill="#2196f3" 
                      fillOpacity={0.6}
                      name="Nhập hàng"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="export" 
                      stackId="1"
                      stroke="#ff9800" 
                      fill="#ff9800" 
                      fillOpacity={0.6}
                      name="Xuất hàng"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#4caf50" 
                      fill="#4caf50" 
                      fillOpacity={0.3}
                      name="Tổng doanh thu"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
              <Box 
                sx={{ 
                  height: 300, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'grey.50',
                  borderRadius: 2,
                  border: '2px dashed',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'grey.300'
                }}
              >
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{
                    color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'
                  }}
                >
                    Chưa có dữ liệu biểu đồ
                </Typography>
              </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} lg={4}>
          <Card 
            sx={{ 
              height: '100%',
              background: isDark 
                ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: isDark 
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid #e0e0e0',
              boxShadow: isDark 
                ? '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                : '0 4px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <CardContent>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 3,
                  color: isDark ? '#ffffff' : 'text.primary'
                }}
              >
                Hoạt động gần đây
              </Typography>
              {(isLoading || isActivityLoading) ? (
              <Stack spacing={2}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" height={20} width="80%" />
                        <Skeleton variant="text" height={16} width="60%" />
                        <Skeleton variant="text" height={14} width="40%" />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              ) : recentActivities.length > 0 ? (
                <List sx={{ p: 0 }}>
                {recentActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemAvatar>
                    <Avatar
                      sx={{
                              bgcolor: activity.color,
                        width: 32,
                        height: 32,
                      }}
                    >
                            {activity.type === 'success' ? <CheckCircleIcon /> : <WarningIcon />}
                    </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {activity.title}
                      </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                          }
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'
                    }}
                  >
                    Chưa có hoạt động nào
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Partners */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: isDark 
                ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: isDark 
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid #e0e0e0',
              boxShadow: isDark 
                ? '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                : '0 4px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <CardContent>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 3,
                  color: isDark ? '#ffffff' : 'text.primary'
                }}
              >
                Đối tác hàng đầu
              </Typography>
              {isLoading ? (
                <Stack spacing={2}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" height={20} width="60%" />
                          <Skeleton variant="text" height={16} width="40%" />
                        </Box>
                      </Box>
                      <Skeleton variant="text" height={20} width="20%" />
                  </Box>
                ))}
              </Stack>
              ) : topPartnersData.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {topPartnersData.map((partner, index) => (
                    <React.Fragment key={partner.id}>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: chartColors[index % chartColors.length], width: 32, height: 32 }}>
                            <PeopleIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                              {partner.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              {safeFormatNumber(partner.ticketsSold)} vé • {(partner.growth || 0) > 0 ? '+' : ''}{formatGrowth(partner.growth)}%
                            </Typography>
                          }
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {safeFormatCurrency(partner.revenue)}
                        </Typography>
                      </ListItem>
                      {index < topPartnersData.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'
                    }}
                  >
                    Chưa có dữ liệu đối tác
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Stations */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: isDark 
                ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: isDark 
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid #e0e0e0',
              boxShadow: isDark 
                ? '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                : '0 4px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <CardContent>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 3,
                  color: isDark ? '#ffffff' : 'text.primary'
                }}
              >
                Trạm hàng đầu
              </Typography>
              {isLoading ? (
                <Stack spacing={2}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" height={20} width="60%" />
                          <Skeleton variant="text" height={16} width="40%" />
        </Box>
      </Box>
                      <Skeleton variant="text" height={20} width="20%" />
                    </Box>
                  ))}
                </Stack>
              ) : topStationsData.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {topStationsData.map((station, index) => (
                    <React.Fragment key={station.id}>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: chartColors[index % chartColors.length], width: 32, height: 32 }}>
                            <StoreIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                              {station.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              {safeFormatNumber(station.ticketsSold)} vé • {(station.growth || 0) > 0 ? '+' : ''}{formatGrowth(station.growth)}%
                            </Typography>
                          }
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {safeFormatCurrency(station.revenue)}
                        </Typography>
                      </ListItem>
                      {index < topStationsData.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'
                    }}
                  >
                    Chưa có dữ liệu trạm
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* System Health */}
        {systemHealthData && (
          <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Tình trạng hệ thống
            </Typography>
                <Stack spacing={2}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                        Uptime
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatGrowth(systemHealthData.uptime)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                      value={systemHealthData.uptime}
                  sx={{
                        height: 6,
                        borderRadius: 3,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          bgcolor: systemHealthData.uptime > 95 ? 'success.main' : 'warning.main',
                    },
                  }}
                />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                        Người dùng hoạt động
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {safeFormatNumber(systemHealthData.activeUsers)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tải hệ thống
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatGrowth(systemHealthData.systemLoad)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                      value={systemHealthData.systemLoad}
                  sx={{
                        height: 6,
                        borderRadius: 3,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          bgcolor: systemHealthData.systemLoad < 70 ? 'success.main' : systemHealthData.systemLoad < 85 ? 'warning.main' : 'error.main',
                    },
                  }}
                />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                        Tỷ lệ lỗi
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {(systemHealthData.errorRate || 0).toFixed(2)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                      value={systemHealthData.errorRate}
                  sx={{
                        height: 6,
                        borderRadius: 3,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          bgcolor: systemHealthData.errorRate < 1 ? 'success.main' : systemHealthData.errorRate < 5 ? 'warning.main' : 'error.main',
                    },
                  }}
                />
              </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Inventory Status */}
        {inventoryStatus && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Tình trạng kho
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InventoryIcon color="primary" />
                      <Typography variant="body2">Tổng sản phẩm</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {safeFormatNumber(inventoryStatus.totalItems)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WarningIcon color="warning" />
                      <Typography variant="body2">Sắp hết hàng</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                      {safeFormatNumber(inventoryStatus.lowStockItems)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ErrorIcon color="error" />
                      <Typography variant="body2">Hết hàng</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                      {safeFormatNumber(inventoryStatus.outOfStockItems)}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Tổng giá trị kho
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {safeFormatCurrency(inventoryStatus.totalValue)}
                    </Typography>
            </Box>
                </Stack>
          </CardContent>
        </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DashboardOverview;