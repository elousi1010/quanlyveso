import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  ButtonGroup,
  IconButton,
  Avatar,
  Chip,
  CircularProgress,
  Skeleton,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  useTheme,
  alpha,
  styled
} from '@mui/material';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import 'antd/dist/reset.css';

// Icons
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HomeIcon from '@mui/icons-material/Home';

// Charts
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Hooks and Utils
import { useDashboardOverview, useDashboardRevenue, useDashboardActivity } from '@/hooks/useDashboard';
import { 
  formatCurrency, 
  formatNumber, 
  formatDate, 
  formatRelativeTime 
} from '@/utils';

// MUI Minimal Dashboard Styled Components
const MinimalCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  boxShadow: 'none',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
  },
}));

const StatsCard = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  padding: 24,
  position: 'relative',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
  },
}));

const DashboardOverview: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const now = new Date();

  // State
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('today');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>([
    dayjs().subtract(1, 'day'),
    dayjs()
  ]);
  const [revenueType, setRevenueType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [isDatePickerChanging, setIsDatePickerChanging] = useState(false);

  // Refs for debouncing
  const debounceRef = useRef<number | null>(null);

  // Format today's date for API
  const today = now.toISOString().split('T')[0];

  // Initialize filters with today's date
  const [filters, setFilters] = useState({
    startDate: today,
    endDate: today
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

  // Date range change handler with debouncing
  const handleDateRangeChange = useCallback((dates: [Dayjs, Dayjs] | null) => {
    if (!dates) return;

    setDateRange(dates);
    setIsDatePickerChanging(true);

    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = setTimeout(() => {
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');

      setFilters({
        startDate,
        endDate
      });

      setIsDatePickerChanging(false);
    }, 500);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Debug logging
  console.log('Dashboard Data:', {
    overviewData,
    revenueData,
    activityData,
    filters,
    isLoading,
    isRevenueLoading,
    isActivityLoading
  });

  // Process data
  const statsData = overviewData ? [
    {
      title: 'Total Debt',
      value: formatCurrency(parseFloat(overviewData.debt?.this || '0')),
      unit: 'VND',
      change: '+0%',
      changeType: 'neutral' as const,
      icon: <AttachMoneyIcon />,
      bgColor: '#e3f2fd',
      color: '#1976d2',
    },
    {
      title: 'Tickets In',
      value: formatNumber(parseInt(overviewData.ticketImport?.this || '0')),
      unit: 'tickets',
      change: '+0%',
      changeType: 'neutral' as const,
      icon: <InventoryIcon />,
      bgColor: '#f3e5f5',
      color: '#7b1fa2',
    },
    {
      title: 'Tickets Out',
      value: formatNumber(parseInt(overviewData.ticketExport?.this || '0')),
      unit: 'tickets',
      change: '+0%',
      changeType: 'neutral' as const,
      icon: <ShoppingCartIcon />,
      bgColor: '#fff3e0',
      color: '#f57c00',
    },
    {
      title: 'Transactions',
      value: formatNumber(parseInt(overviewData.transaction?.this || '0')),
      unit: 'transactions',
      change: '+0%',
      changeType: 'neutral' as const,
      icon: <PeopleIcon />,
      bgColor: '#e8f5e8',
      color: '#388e3c',
    },
    {
      title: 'Previous Total Debt',
      value: formatCurrency(parseFloat(overviewData.debt?.prev || '0')),
      unit: 'VND',
      change: '+0%',
      changeType: 'neutral' as const,
      icon: <AccountBalanceIcon />,
      bgColor: '#fce4ec',
      color: '#c2185b',
    },
    {
      title: 'Previous Tickets In',
      value: formatNumber(parseInt(overviewData.ticketImport?.prev || '0')),
      unit: 'tickets',
      change: '+0%',
      changeType: 'neutral' as const,
      icon: <HomeIcon />,
      bgColor: '#f1f8e9',
      color: '#689f38',
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
    title: `${item.transaction?.type || 'Transaction'} - ${item.transaction?.sub_type || 'Activity'}`,
    description: `${item.partner?.name || 'Unknown Partner'} - ${item.inventory?.code || 'N/A'}: ${formatCurrency(parseFloat(item.activity?.total || '0'))} (${item.activity?.quantity || 0} tickets)`,
    time: formatRelativeTime(item.activity?.created_at || new Date().toISOString()),
    type: item.transaction?.type === 'import' ? 'success' as const : 'warning' as const,
    avatar: undefined,
    color: item.transaction?.type === 'import' ? '#4caf50' : '#ff9800',
  })) : [];

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 },
      background: isDark ? '#0a0a0a' : '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Professional Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                color: isDark ? '#ffffff' : 'text.primary',
                mb: 1
              }}
            >
              Dashboard
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                fontWeight: 400
              }}
            >
              Welcome back! Here's what's happening with your business today.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            {/* Professional Time Range Buttons */}
            <ButtonGroup 
              size="medium" 
              variant="outlined"
              sx={{
                '& .MuiButton-root': {
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  fontSize: '0.875rem',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'text.primary',
                  '&:hover': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                  }
                }
              }}
            >
              <Button 
                onClick={() => handleTimeRangeChange('today')}
                variant={timeRange === 'today' ? 'contained' : 'outlined'}
              >
                Today
              </Button>
              <Button 
                onClick={() => handleTimeRangeChange('week')}
                variant={timeRange === 'week' ? 'contained' : 'outlined'}
              >
                Week
              </Button>
              <Button 
                onClick={() => handleTimeRangeChange('month')}
                variant={timeRange === 'month' ? 'contained' : 'outlined'}
              >
                Month
              </Button>
              <Button 
                onClick={() => handleTimeRangeChange('year')}
                variant={timeRange === 'year' ? 'contained' : 'outlined'}
              >
                Year
              </Button>
            </ButtonGroup>
            
            {/* Professional Date Range Picker */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
              borderRadius: 2,
              p: 1,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            }}>
              <DatePicker.RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                format="DD/MM/YYYY"
                placeholder={['From', 'To']}
                size="small"
                style={{
                  width: 240,
                  height: 40,
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
                className="antd-date-range-picker"
              />
            </Box>
            
            {/* Professional Refresh Button */}
            <IconButton 
              onClick={() => refetch()} 
              disabled={isLoading}
              sx={{
                width: 40,
                height: 40,
                color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'text.primary',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                }
              }}
            >
              {isLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {/* Professional Statistics Cards */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 3 
        }}>
            {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <MinimalCard key={index} sx={{ p: 3 }}>
                <Skeleton variant="circular" width={56} height={56} sx={{ mb: 2 }} />
                <Skeleton variant="text" height={40} width="60%" sx={{ mb: 1 }} />
                <Skeleton variant="text" height={20} width="40%" sx={{ mb: 1 }} />
                <Skeleton variant="text" height={24} width="80%" />
              </MinimalCard>
            ))
          ) : (
            statsData.map((stat, index) => (
              <MinimalCard key={index} sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: stat.bgColor,
                    color: stat.color,
                    width: 56,
                    height: 56,
                  }}
                >
                  {stat.icon}
                </Avatar>
                    <Chip
                      label={stat.change}
                      size="small"
                      color="default"
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28
                      }}
                    />
              </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1, 
                      color: isDark ? '#ffffff' : 'text.primary', 
                      fontSize: '2rem'
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 2, 
                      color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary',
                      fontWeight: 500
                    }}
                  >
                    {stat.unit}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'text.primary'
                    }}
                  >
                    {stat.title}
                  </Typography>
                </CardContent>
              </MinimalCard>
            ))
          )}
        </Box>
      </Box>

      {/* Professional Charts and Data */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        gap: 3,
        mb: 3
      }}>
        {/* Revenue Chart */}
        <MinimalCard>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                color: isDark ? '#ffffff' : 'text.primary',
                fontSize: '1.25rem'
              }}>
                Revenue Chart
              </Typography>
              <ButtonGroup size="small" variant="outlined">
                {['daily', 'weekly', 'monthly', 'yearly'].map((type) => (
                  <Button 
                    key={type}
                    onClick={() => setRevenueType(type as any)}
                    variant={revenueType === type ? 'contained' : 'outlined'}
                    sx={{ 
                      textTransform: 'capitalize',
                      fontSize: '0.875rem',
                      px: 2,
                      py: 0.5
                    }}
                  >
                    {type === 'daily' ? 'Day' : type === 'weekly' ? 'Week' : type === 'monthly' ? 'Month' : 'Year'}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>
            {(isLoading || isRevenueLoading) ? (
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            ) : revenueChartData.length > 0 ? (
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
                    <XAxis dataKey="label" stroke={isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'} />
                    <YAxis stroke={isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
                        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        borderRadius: 8,
                      }}
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name === 'import' ? 'Import' : name === 'export' ? 'Export' : 'Total Revenue'
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
                      name="Import"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="export" 
                      stackId="1"
                      stroke="#ff9800" 
                      fill="#ff9800" 
                      fillOpacity={0.6}
                      name="Export"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#4caf50" 
                      fill="#4caf50" 
                      fillOpacity={0.3}
                      name="Total Revenue"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box sx={{ 
                height: 300, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'text.secondary'
              }}>
                <Typography variant="body1">No data available</Typography>
              </Box>
            )}
          </CardContent>
        </MinimalCard>

        {/* Professional Activity Feed */}
        <MinimalCard sx={{ height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                mb: 3,
                color: isDark ? '#ffffff' : 'text.primary',
                fontSize: '1.25rem'
              }}
            >
              Recent Activity
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
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: activity.color,
                            width: 40,
                            height: 40,
                          }}
                        >
                          {activity.type === 'success' ? <CheckCircleIcon sx={{ fontSize: 20 }} /> : <WarningIcon sx={{ fontSize: 20 }} />}
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
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              {activity.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider sx={{ my: 1 }} />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary',
                    fontSize: '0.875rem'
                  }}
                >
                  No recent activity
                </Typography>
              </Box>
            )}
          </CardContent>
        </MinimalCard>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 3
      }}>
        {/* Top Partners */}
        <MinimalCard sx={{ height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                mb: 3,
                color: isDark ? '#ffffff' : 'text.primary',
                fontSize: '1.25rem'
              }}
            >
              Top Partners
            </Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary',
                  fontSize: '0.875rem'
                }}
              >
                No partner data yet
              </Typography>
            </Box>
          </CardContent>
        </MinimalCard>

        {/* Top Stations */}
        <MinimalCard sx={{ height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                mb: 3,
                color: isDark ? '#ffffff' : 'text.primary',
                fontSize: '1.25rem'
              }}
            >
              Top Stations
            </Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary',
                  fontSize: '0.875rem'
                }}
              >
                No station data yet
              </Typography>
            </Box>
          </CardContent>
        </MinimalCard>
      </Box>
    </Box>
  );
};

export default DashboardOverview;