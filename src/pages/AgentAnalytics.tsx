import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AnalyticsIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
} from 'recharts';
import dayjs from 'dayjs';

interface AgentAnalyticsData {
  id: string;
  agentId: string;
  agentName: string;
  territory: string[];
  contractType: string;
  
  // Performance metrics
  currentScore: number;
  ranking: number;
  totalAgents: number;
  performanceTrend: 'up' | 'down' | 'stable';
  
  // Sales metrics
  totalSales: number;
  salesGrowth: number;
  targetSales: number;
  achievementRate: number;
  
  // Financial metrics
  totalCommission: number;
  commissionGrowth: number;
  averageCommission: number;
  
  // Customer metrics
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerRetention: number;
  
  // Quality metrics
  complaintRate: number;
  returnRate: number;
  onTimeDelivery: number;
  
  // Territory performance
  territoryCoverage: number;
  marketShare: number;
  
  // Trends
  salesHistory: {
    date: string;
    sales: number;
    commission: number;
    customers: number;
  }[];
  
  // Comparisons
  peerComparison: {
    rank: number;
    percentile: number;
    averagePeerSales: number;
    averagePeerCommission: number;
  };
}

const mockAnalyticsData: AgentAnalyticsData[] = [
  {
    id: '1',
    agentId: '1',
    agentName: 'Đại lý cấp 1 HCM',
    territory: ['Quận 1', 'Quận 3', 'Quận 5'],
    contractType: 'exclusive',
    currentScore: 88,
    ranking: 2,
    totalAgents: 15,
    performanceTrend: 'up',
    totalSales: 15000000,
    salesGrowth: 15.5,
    targetSales: 12000000,
    achievementRate: 125,
    totalCommission: 2750000,
    commissionGrowth: 12.3,
    averageCommission: 183333,
    totalCustomers: 145,
    newCustomers: 25,
    returningCustomers: 120,
    customerRetention: 85,
    complaintRate: 0.5,
    returnRate: 2,
    onTimeDelivery: 95,
    territoryCoverage: 90,
    marketShare: 35,
    salesHistory: [
      { date: '2024-01-01', sales: 12000000, commission: 1800000, customers: 120 },
      { date: '2024-01-08', sales: 13500000, commission: 2025000, customers: 130 },
      { date: '2024-01-15', sales: 15000000, commission: 2250000, customers: 140 },
      { date: '2024-01-22', sales: 16000000, commission: 2400000, customers: 145 },
      { date: '2024-01-29', sales: 15000000, commission: 2750000, customers: 145 },
    ],
    peerComparison: {
      rank: 2,
      percentile: 87,
      averagePeerSales: 12000000,
      averagePeerCommission: 2000000,
    },
  },
  {
    id: '2',
    agentId: '2',
    agentName: 'Đại lý cấp 2 Hà Nội',
    territory: ['Quận Ba Đình', 'Quận Hoàn Kiếm'],
    contractType: 'non-exclusive',
    currentScore: 75,
    ranking: 5,
    totalAgents: 15,
    performanceTrend: 'stable',
    totalSales: 12000000,
    salesGrowth: 8.2,
    targetSales: 10000000,
    achievementRate: 120,
    totalCommission: 1200000,
    commissionGrowth: 5.1,
    averageCommission: 100000,
    totalCustomers: 100,
    newCustomers: 15,
    returningCustomers: 85,
    customerRetention: 80,
    complaintRate: 1.2,
    returnRate: 3,
    onTimeDelivery: 88,
    territoryCoverage: 75,
    marketShare: 25,
    salesHistory: [
      { date: '2024-01-01', sales: 10000000, commission: 1000000, customers: 90 },
      { date: '2024-01-08', sales: 11000000, commission: 1100000, customers: 95 },
      { date: '2024-01-15', sales: 12000000, commission: 1200000, customers: 100 },
      { date: '2024-01-22', sales: 11500000, commission: 1150000, customers: 98 },
      { date: '2024-01-29', sales: 12000000, commission: 1200000, customers: 100 },
    ],
    peerComparison: {
      rank: 5,
      percentile: 67,
      averagePeerSales: 12000000,
      averagePeerCommission: 2000000,
    },
  },
  {
    id: '3',
    agentId: '3',
    agentName: 'Đại lý cấp 3 Đà Nẵng',
    territory: ['Quận Hải Châu', 'Quận Thanh Khê'],
    contractType: 'temporary',
    currentScore: 55,
    ranking: 12,
    totalAgents: 15,
    performanceTrend: 'down',
    totalSales: 8000000,
    salesGrowth: -5.2,
    targetSales: 10000000,
    achievementRate: 80,
    totalCommission: 400000,
    commissionGrowth: -8.1,
    averageCommission: 50000,
    totalCustomers: 60,
    newCustomers: 8,
    returningCustomers: 52,
    customerRetention: 70,
    complaintRate: 2.5,
    returnRate: 5,
    onTimeDelivery: 75,
    territoryCoverage: 60,
    marketShare: 15,
    salesHistory: [
      { date: '2024-01-01', sales: 10000000, commission: 500000, customers: 70 },
      { date: '2024-01-08', sales: 9000000, commission: 450000, customers: 65 },
      { date: '2024-01-15', sales: 8000000, commission: 400000, customers: 60 },
      { date: '2024-01-22', sales: 7500000, commission: 375000, customers: 58 },
      { date: '2024-01-29', sales: 8000000, commission: 400000, customers: 60 },
    ],
    peerComparison: {
      rank: 12,
      percentile: 20,
      averagePeerSales: 12000000,
      averagePeerCommission: 2000000,
    },
  },
];

const AgentAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AgentAnalyticsData[]>(mockAnalyticsData);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [timeRange, setTimeRange] = useState('monthly');
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon color="success" />;
      case 'down': return <TrendingDownIcon color="error" />;
      case 'stable': return <TrendingUpIcon color="disabled" />;
      default: return <TrendingUpIcon color="disabled" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'success';
      case 'down': return 'error';
      case 'stable': return 'info';
      default: return 'default';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Xuất sắc';
    if (score >= 60) return 'Tốt';
    return 'Cần cải thiện';
  };

  const filteredData = selectedAgent 
    ? analyticsData.filter(d => d.agentId === selectedAgent)
    : analyticsData;

  const stats = {
    totalAgents: analyticsData.length,
    averageScore: analyticsData.reduce((sum, d) => sum + d.currentScore, 0) / analyticsData.length,
    totalSales: analyticsData.reduce((sum, d) => sum + d.totalSales, 0),
    totalCommission: analyticsData.reduce((sum, d) => sum + d.totalCommission, 0),
    averageAchievementRate: analyticsData.reduce((sum, d) => sum + d.achievementRate, 0) / analyticsData.length,
    topPerformers: analyticsData.filter(d => d.currentScore >= 80).length,
    underPerformers: analyticsData.filter(d => d.currentScore < 60).length,
    totalCustomers: analyticsData.reduce((sum, d) => sum + d.totalCustomers, 0),
    averageCustomerRetention: analyticsData.reduce((sum, d) => sum + d.customerRetention, 0) / analyticsData.length,
  };

  // Chart data
  const performanceChartData = analyticsData.map(d => ({
    agent: d.agentId,
    score: d.currentScore,
    sales: d.totalSales / 1000000,
    commission: d.totalCommission / 1000000,
    customers: d.totalCustomers,
  }));

  const salesTrendData = analyticsData[0]?.salesHistory || [];

  const territoryData = analyticsData.map(d => ({
    agent: d.agentId,
    territory: d.territory.length,
    coverage: d.territoryCoverage,
    marketShare: d.marketShare,
  }));

  const customerData = analyticsData.map(d => ({
    agent: d.agentId,
    total: d.totalCustomers,
    new: d.newCustomers,
    returning: d.returningCustomers,
    retention: d.customerRetention,
  }));

  return (
    <Box className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <AnalyticsIcon className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Phân tích đại lý</h1>
              <p className="text-sm sm:text-base text-purple-100">Báo cáo chi tiết và phân tích hiệu suất đại lý</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <FormControl size="small" className="min-w-32">
              <InputLabel>Chọn đại lý</InputLabel>
              <Select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                label="Chọn đại lý"
              >
                <MenuItem value="">Tất cả</MenuItem>
                {analyticsData.map(d => (
                  <MenuItem key={d.agentId} value={d.agentId}>
                    {d.agentName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" className="min-w-32">
              <InputLabel>Khoảng thời gian</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                label="Khoảng thời gian"
              >
                <MenuItem value="daily">Ngày</MenuItem>
                <MenuItem value="weekly">Tuần</MenuItem>
                <MenuItem value="monthly">Tháng</MenuItem>
                <MenuItem value="quarterly">Quý</MenuItem>
                <MenuItem value="yearly">Năm</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-4 py-2 rounded-lg"
            >
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Điểm TB
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {Math.round(stats.averageScore)}
                </Typography>
              </div>
              <AnalyticsIcon className="text-blue-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Tổng doanh thu
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {(stats.totalSales / 1000000).toFixed(0)}M
                </Typography>
              </div>
              <MoneyIcon className="text-green-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Tỷ lệ đạt mục tiêu TB
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {Math.round(stats.averageAchievementRate)}%
                </Typography>
              </div>
              <TrendingUpIcon className="text-yellow-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card-error">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Cần cải thiện
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.underPerformers}
                </Typography>
              </div>
              <WarningIcon className="text-red-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="card">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Tổng quan" />
            <Tab label="Hiệu suất" />
            <Tab label="Doanh thu" />
            <Tab label="Khách hàng" />
            <Tab label="Khu vực" />
            <Tab label="So sánh" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        {tabValue === 0 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Xếp hạng hiệu suất
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={performanceChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="agent" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="score" fill="#8884d8" name="Điểm hiệu suất" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Phân bố doanh thu
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={performanceChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(props: any) => `ĐL${props.agent}: ${props.sales}M`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="sales"
                        >
                          {performanceChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Danh sách đại lý
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Đại lý</TableCell>
                            <TableCell>Điểm hiệu suất</TableCell>
                            <TableCell>Xếp hạng</TableCell>
                            <TableCell>Doanh thu</TableCell>
                            <TableCell>Tỷ lệ đạt mục tiêu</TableCell>
                            <TableCell>Xu hướng</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredData.map((agent) => (
                            <TableRow key={agent.agentId}>
                              <TableCell>
                                <Box>
                                  <Typography variant="subtitle2" className="font-semibold">
                                    {agent.agentName}
                                  </Typography>
                                  <Typography variant="caption" className="text-gray-500">
                                    {agent.territory.join(', ')}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Chip 
                                    label={agent.currentScore} 
                                    color={getScoreColor(agent.currentScore)} 
                                    size="small" 
                                  />
                                  <Typography variant="caption">
                                    {getScoreText(agent.currentScore)}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <StarIcon color="warning" fontSize="small" />
                                  <span className="font-semibold">#{agent.ranking}</span>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <span className="font-semibold text-green-600">
                                  {(agent.totalSales / 1000000).toFixed(1)}M VNĐ
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="font-semibold">
                                  {agent.achievementRate}%
                                </span>
                              </TableCell>
                              <TableCell>
                                {getTrendIcon(agent.performanceTrend)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Performance Tab */}
        {tabValue === 1 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Xu hướng hiệu suất theo thời gian
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={salesTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Doanh thu (VNĐ)" />
                        <Line type="monotone" dataKey="commission" stroke="#82ca9d" name="Hoa hồng (VNĐ)" />
                        <Line type="monotone" dataKey="customers" stroke="#ffc658" name="Khách hàng" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Revenue Tab */}
        {tabValue === 2 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      So sánh doanh thu
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={performanceChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="agent" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="sales" fill="#8884d8" name="Doanh thu (M)" />
                        <Bar dataKey="commission" fill="#82ca9d" name="Hoa hồng (M)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tăng trưởng doanh thu
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={salesTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" name="Doanh thu" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Customers Tab */}
        {tabValue === 3 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Phân tích khách hàng
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={customerData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="agent" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="total" stackId="a" fill="#8884d8" name="Tổng KH" />
                        <Bar dataKey="new" stackId="a" fill="#82ca9d" name="KH mới" />
                        <Bar dataKey="returning" stackId="a" fill="#ffc658" name="KH cũ" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tỷ lệ giữ chân khách hàng
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={customerData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="agent" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="retention" fill="#8884d8" name="Tỷ lệ giữ chân (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Territory Tab */}
        {tabValue === 4 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Phân tích khu vực
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={territoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="agent" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="territory" fill="#8884d8" name="Số khu vực" />
                        <Bar dataKey="coverage" fill="#82ca9d" name="Độ phủ (%)" />
                        <Bar dataKey="marketShare" fill="#ffc658" name="Thị phần (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Thị phần theo đại lý
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={territoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(props: any) => `ĐL${props.agent}: ${props.marketShare}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="marketShare"
                        >
                          {territoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 120}, 70%, 50%)`} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Comparison Tab */}
        {tabValue === 5 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      So sánh với đồng nghiệp
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Đại lý</TableCell>
                            <TableCell>Xếp hạng</TableCell>
                            <TableCell>Phần trăm</TableCell>
                            <TableCell>Doanh thu vs TB</TableCell>
                            <TableCell>Hoa hồng vs TB</TableCell>
                            <TableCell>Đánh giá</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredData.map((agent) => (
                            <TableRow key={agent.agentId}>
                              <TableCell>
                                <Typography variant="subtitle2" className="font-semibold">
                                  {agent.agentName}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <span className="font-semibold">#{agent.peerComparison.rank}</span>
                                  <span className="text-gray-500">/ {agent.totalAgents}</span>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={`Top ${100 - agent.peerComparison.percentile}%`} 
                                  color={agent.peerComparison.percentile >= 80 ? 'success' : 
                                         agent.peerComparison.percentile >= 60 ? 'warning' : 'error'} 
                                  size="small" 
                                />
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  {agent.totalSales > agent.peerComparison.averagePeerSales ? (
                                    <TrendingUpIcon color="success" fontSize="small" />
                                  ) : (
                                    <TrendingDownIcon color="error" fontSize="small" />
                                  )}
                                  <span className="font-semibold">
                                    {((agent.totalSales / agent.peerComparison.averagePeerSales - 1) * 100).toFixed(1)}%
                                  </span>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  {agent.totalCommission > agent.peerComparison.averagePeerCommission ? (
                                    <TrendingUpIcon color="success" fontSize="small" />
                                  ) : (
                                    <TrendingDownIcon color="error" fontSize="small" />
                                  )}
                                  <span className="font-semibold">
                                    {((agent.totalCommission / agent.peerComparison.averagePeerCommission - 1) * 100).toFixed(1)}%
                                  </span>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={agent.peerComparison.percentile >= 80 ? 'Xuất sắc' : 
                                         agent.peerComparison.percentile >= 60 ? 'Tốt' : 'Cần cải thiện'} 
                                  color={agent.peerComparison.percentile >= 80 ? 'success' : 
                                         agent.peerComparison.percentile >= 60 ? 'warning' : 'error'} 
                                  size="small" 
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}
      </Card>
    </Box>
  );
};

export default AgentAnalytics;
