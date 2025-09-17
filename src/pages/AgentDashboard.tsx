import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  ConfirmationNumber as TicketIcon,
  People as PeopleIcon,
  Assessment as PerformanceIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  AccountBalance as CreditIcon,
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
} from 'recharts';
import dayjs from 'dayjs';

interface AgentDashboardData {
  id: string;
  agentId: string;
  agentName: string;
  territory: string[];
  contractType: 'exclusive' | 'non-exclusive' | 'temporary';
  contractEndDate: Date;
  
  // Performance metrics
  currentScore: number;
  ranking: number;
  totalAgents: number;
  
  // Sales data
  todaySales: number;
  weekSales: number;
  monthSales: number;
  targetSales: number;
  achievementRate: number;
  
  // Financial data
  totalCommission: number;
  pendingCommission: number;
  creditLimit: number;
  currentDebt: number;
  availableCredit: number;
  
  // Recent activities
  recentTickets: {
    id: string;
    number: string;
    amount: number;
    soldAt: Date;
  }[];
  
  // Alerts
  alerts: {
    id: string;
    type: 'warning' | 'info' | 'error' | 'success';
    message: string;
    createdAt: Date;
  }[];
  
  // Performance trends
  performanceHistory: {
    date: string;
    score: number;
    sales: number;
    commission: number;
  }[];
}

const mockAgentData: AgentDashboardData = {
  id: '1',
  agentId: '1',
  agentName: 'Đại lý cấp 1 HCM',
  territory: ['Quận 1', 'Quận 3', 'Quận 5'],
  contractType: 'exclusive',
  contractEndDate: new Date('2024-12-31'),
  
  currentScore: 88,
  ranking: 2,
  totalAgents: 15,
  
  todaySales: 500000,
  weekSales: 3500000,
  monthSales: 15000000,
  targetSales: 12000000,
  achievementRate: 125,
  
  totalCommission: 2750000,
  pendingCommission: 500000,
  creditLimit: 50000000,
  currentDebt: 15000000,
  availableCredit: 35000000,
  
  recentTickets: [
    { id: '1', number: '123456', amount: 10000, soldAt: new Date() },
    { id: '2', number: '123457', amount: 10000, soldAt: new Date() },
    { id: '3', number: '123458', amount: 10000, soldAt: new Date() },
  ],
  
  alerts: [
    {
      id: '1',
      type: 'warning',
      message: 'Hợp đồng sẽ hết hạn trong 30 ngày',
      createdAt: new Date(),
    },
    {
      id: '2',
      type: 'info',
      message: 'Hoa hồng tháng 1 đã được tính toán',
      createdAt: new Date(),
    },
  ],
  
  performanceHistory: [
    { date: '2024-01-01', score: 85, sales: 12000000, commission: 1800000 },
    { date: '2024-01-08', score: 87, sales: 13500000, commission: 2025000 },
    { date: '2024-01-15', score: 88, sales: 15000000, commission: 2250000 },
    { date: '2024-01-22', score: 90, sales: 16000000, commission: 2400000 },
    { date: '2024-01-29', score: 88, sales: 15000000, commission: 2750000 },
  ],
};

const AgentDashboard: React.FC = () => {
  const [data, setData] = useState<AgentDashboardData>(mockAgentData);
  const [tabValue, setTabValue] = useState(0);

  const getContractTypeText = (type: string) => {
    switch (type) {
      case 'exclusive': return 'Độc quyền';
      case 'non-exclusive': return 'Không độc quyền';
      case 'temporary': return 'Tạm thời';
      default: return type;
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'exclusive': return 'success';
      case 'non-exclusive': return 'info';
      case 'temporary': return 'warning';
      default: return 'default';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return 'success';
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckIcon />;
      case 'info': return <ScheduleIcon />;
      case 'warning': return <WarningIcon />;
      case 'error': return <WarningIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const isContractExpiringSoon = (endDate: Date) => {
    const daysUntilExpiry = dayjs(endDate).diff(dayjs(), 'days');
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isContractExpired = (endDate: Date) => {
    return dayjs(endDate).isBefore(dayjs());
  };

  return (
    <Box className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <PerformanceIcon className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Dashboard Đại lý</h1>
              <p className="text-sm sm:text-base text-green-100">
                {data.agentName} - {getContractTypeText(data.contractType)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Chip
              label={`#${data.ranking}/${data.totalAgents}`}
              color="secondary"
              icon={<StarIcon />}
              className="bg-white text-green-600"
            />
            <Chip
              label={`${data.currentScore} điểm`}
              color="primary"
              className="bg-white text-green-600"
            />
          </div>
        </div>
      </div>

      {/* Alerts */}
      {data.alerts.length > 0 && (
        <div className="space-y-2">
          {data.alerts.map((alert) => (
            <Alert
              key={alert.id}
              severity={getAlertColor(alert.type)}
              icon={getAlertIcon(alert.type)}
              className="rounded-lg"
            >
              {alert.message}
            </Alert>
          ))}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Doanh thu hôm nay
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {(data.todaySales / 1000000).toFixed(1)}M
                </Typography>
              </div>
              <MoneyIcon className="text-green-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Tỷ lệ đạt mục tiêu
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {data.achievementRate}%
                </Typography>
              </div>
              <TrendingUpIcon className="text-green-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Hoa hồng chờ
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {(data.pendingCommission / 1000000).toFixed(1)}M
                </Typography>
              </div>
              <ScheduleIcon className="text-yellow-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card-error">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Tín dụng khả dụng
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {(data.availableCredit / 1000000).toFixed(0)}M
                </Typography>
              </div>
              <CreditIcon className="text-red-500 text-2xl sm:text-3xl" />
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
            <Tab label="Tài chính" />
            <Tab label="Hoạt động" />
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
                      Thông tin hợp đồng
                    </Typography>
                    <Box className="space-y-2">
                      <div className="flex justify-between">
                        <span>Loại hợp đồng:</span>
                        <Chip 
                          label={getContractTypeText(data.contractType)} 
                          color={getContractTypeColor(data.contractType)} 
                          size="small" 
                        />
                      </div>
                      <div className="flex justify-between">
                        <span>Khu vực:</span>
                        <span className="font-semibold">{data.territory.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ngày hết hạn:</span>
                        <Box display="flex" alignItems="center" gap={1}>
                          <span className="font-semibold">
                            {dayjs(data.contractEndDate).format('DD/MM/YYYY')}
                          </span>
                          {isContractExpiringSoon(data.contractEndDate) && (
                            <WarningIcon color="warning" fontSize="small" />
                          )}
                          {isContractExpired(data.contractEndDate) && (
                            <WarningIcon color="error" fontSize="small" />
                          )}
                        </Box>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Hiệu suất hiện tại
                    </Typography>
                    <Box className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Điểm hiệu suất:</span>
                        <Box display="flex" alignItems="center" gap={1}>
                          <span className="font-semibold">{data.currentScore}</span>
                          <LinearProgress 
                            variant="determinate" 
                            value={data.currentScore} 
                            className="w-16"
                            color={data.currentScore >= 80 ? 'success' : data.currentScore >= 60 ? 'warning' : 'error'}
                          />
                        </Box>
                      </div>
                      <div className="flex justify-between">
                        <span>Xếp hạng:</span>
                        <span className="font-semibold">#{data.ranking}/{data.totalAgents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Doanh thu tháng:</span>
                        <span className="font-semibold text-green-600">
                          {(data.monthSales / 1000000).toFixed(1)}M VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mục tiêu tháng:</span>
                        <span className="font-semibold">
                          {(data.targetSales / 1000000).toFixed(1)}M VNĐ
                        </span>
                      </div>
                    </Box>
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
                      Xu hướng hiệu suất
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={data.performanceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="score" stroke="#8884d8" name="Điểm hiệu suất" />
                        <Line type="monotone" dataKey="sales" stroke="#82ca9d" name="Doanh thu (M)" />
                        <Line type="monotone" dataKey="commission" stroke="#ffc658" name="Hoa hồng (M)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Financial Tab */}
        {tabValue === 2 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tình hình tài chính
                    </Typography>
                    <Box className="space-y-3">
                      <div className="flex justify-between">
                        <span>Tổng hoa hồng:</span>
                        <span className="font-semibold text-green-600">
                          {(data.totalCommission / 1000000).toFixed(1)}M VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chờ thanh toán:</span>
                        <span className="font-semibold text-yellow-600">
                          {(data.pendingCommission / 1000000).toFixed(1)}M VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hạn mức tín dụng:</span>
                        <span className="font-semibold">
                          {(data.creditLimit / 1000000).toFixed(0)}M VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nợ hiện tại:</span>
                        <span className="font-semibold text-red-600">
                          {(data.currentDebt / 1000000).toFixed(1)}M VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tín dụng khả dụng:</span>
                        <span className="font-semibold text-blue-600">
                          {(data.availableCredit / 1000000).toFixed(0)}M VNĐ
                        </span>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tỷ lệ sử dụng tín dụng
                    </Typography>
                    <Box className="space-y-3">
                      <div className="flex justify-between">
                        <span>Đã sử dụng:</span>
                        <span className="font-semibold">
                          {((data.currentDebt / data.creditLimit) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <LinearProgress 
                        variant="determinate" 
                        value={(data.currentDebt / data.creditLimit) * 100}
                        color={(data.currentDebt / data.creditLimit) > 0.8 ? 'error' : (data.currentDebt / data.creditLimit) > 0.6 ? 'warning' : 'success'}
                        className="h-3 rounded"
                      />
                      <div className="text-sm text-gray-600">
                        {data.availableCredit > 0 ? 'Còn khả dụng' : 'Đã hết hạn mức'}
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Activities Tab */}
        {tabValue === 3 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Vé bán gần đây
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Số vé</TableCell>
                            <TableCell>Giá trị</TableCell>
                            <TableCell>Thời gian</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.recentTickets.map((ticket) => (
                            <TableRow key={ticket.id}>
                              <TableCell>{ticket.number}</TableCell>
                              <TableCell>
                                <span className="font-semibold text-green-600">
                                  {ticket.amount.toLocaleString()} VNĐ
                                </span>
                              </TableCell>
                              <TableCell>
                                {dayjs(ticket.soldAt).format('HH:mm')}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Thống kê nhanh
                    </Typography>
                    <Box className="space-y-3">
                      <div className="flex justify-between">
                        <span>Vé bán hôm nay:</span>
                        <span className="font-semibold">{data.recentTickets.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Doanh thu tuần:</span>
                        <span className="font-semibold text-green-600">
                          {(data.weekSales / 1000000).toFixed(1)}M VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trung bình/ngày:</span>
                        <span className="font-semibold">
                          {(data.weekSales / 7 / 1000000).toFixed(1)}M VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Khu vực phụ trách:</span>
                        <span className="font-semibold">{data.territory.length}</span>
                      </div>
                    </Box>
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

export default AgentDashboard;
