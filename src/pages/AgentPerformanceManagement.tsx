import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  Grid,
  IconButton,
  Tooltip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as PerformanceIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  EmojiEvents as TrophyIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  ConfirmationNumber as TicketIcon,
} from '@mui/icons-material';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
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

interface AgentPerformance {
  id: string;
  agentId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  ticketsSold: number;
  revenue: number;
  targetRevenue: number;
  achievementRate: number;
  cost: number;
  profit: number;
  profitMargin: number;
  commissionEarned: number;
  averageTicketPrice: number;
  salesGrowth: number;
  customerRetention: number;
  territoryCoverage: number;
  newCustomers: number;
  returningCustomers: number;
  complaintRate: number;
  returnRate: number;
  onTimeDelivery: number;
  performanceScore: number;
  ranking: number;
  status: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
}

interface PerformanceTarget {
  id: string;
  agentId: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  year: number;
  month?: number;
  quarter?: number;
  revenueTarget: number;
  ticketTarget: number;
  profitTarget: number;
  maxComplaintRate: number;
  maxReturnRate: number;
  minOnTimeDelivery: number;
  salesGrowthTarget: number;
  customerGrowthTarget: number;
  status: 'active' | 'achieved' | 'not_achieved' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const mockPerformances: AgentPerformance[] = [
  {
    id: '1',
    agentId: '1',
    period: 'monthly',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    ticketsSold: 1500,
    revenue: 15000000,
    targetRevenue: 12000000,
    achievementRate: 125,
    cost: 12000000,
    profit: 3000000,
    profitMargin: 20,
    commissionEarned: 2250000,
    averageTicketPrice: 10000,
    salesGrowth: 15,
    customerRetention: 85,
    territoryCoverage: 90,
    newCustomers: 25,
    returningCustomers: 120,
    complaintRate: 0.5,
    returnRate: 2,
    onTimeDelivery: 95,
    performanceScore: 88,
    ranking: 1,
    status: 'excellent',
  },
  {
    id: '2',
    agentId: '2',
    period: 'monthly',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    ticketsSold: 1200,
    revenue: 12000000,
    targetRevenue: 10000000,
    achievementRate: 120,
    cost: 10000000,
    profit: 2000000,
    profitMargin: 16.7,
    commissionEarned: 1200000,
    averageTicketPrice: 10000,
    salesGrowth: 8,
    customerRetention: 80,
    territoryCoverage: 75,
    newCustomers: 15,
    returningCustomers: 100,
    complaintRate: 1.2,
    returnRate: 3,
    onTimeDelivery: 88,
    performanceScore: 75,
    ranking: 2,
    status: 'good',
  },
  {
    id: '3',
    agentId: '3',
    period: 'monthly',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    ticketsSold: 800,
    revenue: 8000000,
    targetRevenue: 10000000,
    achievementRate: 80,
    cost: 7000000,
    profit: 1000000,
    profitMargin: 12.5,
    commissionEarned: 400000,
    averageTicketPrice: 10000,
    salesGrowth: -5,
    customerRetention: 70,
    territoryCoverage: 60,
    newCustomers: 8,
    returningCustomers: 60,
    complaintRate: 2.5,
    returnRate: 5,
    onTimeDelivery: 75,
    performanceScore: 55,
    ranking: 3,
    status: 'below_average',
  },
];

const mockTargets: PerformanceTarget[] = [
  {
    id: '1',
    agentId: '1',
    period: 'monthly',
    year: 2024,
    month: 1,
    revenueTarget: 12000000,
    ticketTarget: 1200,
    profitTarget: 2400000,
    maxComplaintRate: 1,
    maxReturnRate: 3,
    minOnTimeDelivery: 90,
    salesGrowthTarget: 10,
    customerGrowthTarget: 15,
    status: 'achieved',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-31'),
  },
  {
    id: '2',
    agentId: '2',
    period: 'monthly',
    year: 2024,
    month: 1,
    revenueTarget: 10000000,
    ticketTarget: 1000,
    profitTarget: 2000000,
    maxComplaintRate: 1.5,
    maxReturnRate: 4,
    minOnTimeDelivery: 85,
    salesGrowthTarget: 5,
    customerGrowthTarget: 10,
    status: 'achieved',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-31'),
  },
  {
    id: '3',
    agentId: '3',
    period: 'monthly',
    year: 2024,
    month: 1,
    revenueTarget: 10000000,
    ticketTarget: 1000,
    profitTarget: 2000000,
    maxComplaintRate: 2,
    maxReturnRate: 5,
    minOnTimeDelivery: 80,
    salesGrowthTarget: 0,
    customerGrowthTarget: 5,
    status: 'not_achieved',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-31'),
  },
];

const AgentPerformanceManagement: React.FC = () => {
  const [performances, setPerformances] = useState<AgentPerformance[]>(mockPerformances);
  const [targets, setTargets] = useState<PerformanceTarget[]>(mockTargets);
  const [tabValue, setTabValue] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'success';
      case 'good': return 'info';
      case 'average': return 'warning';
      case 'below_average': return 'error';
      case 'poor': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Xuất sắc';
      case 'good': return 'Tốt';
      case 'average': return 'Trung bình';
      case 'below_average': return 'Dưới trung bình';
      case 'poor': return 'Kém';
      default: return status;
    }
  };

  const getTargetStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'success';
      case 'not_achieved': return 'error';
      case 'active': return 'info';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getTargetStatusText = (status: string) => {
    switch (status) {
      case 'achieved': return 'Đạt mục tiêu';
      case 'not_achieved': return 'Không đạt';
      case 'active': return 'Đang thực hiện';
      case 'cancelled': return 'Hủy bỏ';
      default: return status;
    }
  };

  const performanceColumns: GridColDef[] = [
    { field: 'agentId', headerName: 'Mã đại lý', width: 120, flex: 1 },
    { 
      field: 'performanceScore', 
      headerName: 'Điểm hiệu suất', 
      width: 150, 
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <span className="font-semibold">{params.value}</span>
          <LinearProgress 
            variant="determinate" 
            value={params.value} 
            className="w-16"
            color={params.value >= 80 ? 'success' : params.value >= 60 ? 'warning' : 'error'}
          />
        </Box>
      )
    },
    { 
      field: 'ranking', 
      headerName: 'Xếp hạng', 
      width: 100, 
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <TrophyIcon color={params.value <= 3 ? 'warning' : 'disabled'} />
          <span className="font-semibold">#{params.value}</span>
        </Box>
      )
    },
    { 
      field: 'revenue', 
      headerName: 'Doanh thu', 
      width: 150, 
      renderCell: (params) => (
        <span className="font-semibold text-green-600">
          {(params.value / 1000000).toFixed(1)}M VNĐ
        </span>
      )
    },
    { 
      field: 'achievementRate', 
      headerName: 'Tỷ lệ đạt mục tiêu', 
      width: 150, 
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <span className="font-semibold">{params.value}%</span>
          {params.value >= 100 ? (
            <TrendingUpIcon color="success" fontSize="small" />
          ) : (
            <TrendingDownIcon color="error" fontSize="small" />
          )}
        </Box>
      )
    },
    { 
      field: 'ticketsSold', 
      headerName: 'Vé bán được', 
      width: 120, 
      type: 'number'
    },
    { 
      field: 'profitMargin', 
      headerName: 'Tỷ suất lợi nhuận', 
      width: 150, 
      renderCell: (params) => (
        <span className="font-semibold">{params.value}%</span>
      )
    },
    { 
      field: 'status', 
      headerName: 'Trạng thái', 
      width: 120, 
      renderCell: (params) => (
        <Chip 
          label={getStatusText(params.value)} 
          color={getStatusColor(params.value)} 
          size="small" 
        />
      )
    },
  ];

  const targetColumns: GridColDef[] = [
    { field: 'agentId', headerName: 'Mã đại lý', width: 120, flex: 1 },
    { 
      field: 'period', 
      headerName: 'Kỳ', 
      width: 100, 
      renderCell: (params) => {
        const target = targets.find(t => t.id === params.row.id);
        if (target?.month) return `Tháng ${target.month}`;
        if (target?.quarter) return `Q${target.quarter}`;
        return 'Năm';
      }
    },
    { 
      field: 'revenueTarget', 
      headerName: 'Mục tiêu doanh thu', 
      width: 150, 
      renderCell: (params) => (
        <span className="font-semibold">
          {(params.value / 1000000).toFixed(1)}M VNĐ
        </span>
      )
    },
    { 
      field: 'ticketTarget', 
      headerName: 'Mục tiêu vé', 
      width: 120, 
      type: 'number'
    },
    { 
      field: 'profitTarget', 
      headerName: 'Mục tiêu lợi nhuận', 
      width: 150, 
      renderCell: (params) => (
        <span className="font-semibold">
          {(params.value / 1000000).toFixed(1)}M VNĐ
        </span>
      )
    },
    { 
      field: 'status', 
      headerName: 'Trạng thái', 
      width: 120, 
      renderCell: (params) => (
        <Chip 
          label={getTargetStatusText(params.value)} 
          color={getTargetStatusColor(params.value)} 
          size="small" 
        />
      )
    },
  ];

  const stats = {
    totalAgents: performances.length,
    excellentAgents: performances.filter(p => p.status === 'excellent').length,
    goodAgents: performances.filter(p => p.status === 'good').length,
    belowAverageAgents: performances.filter(p => p.status === 'below_average' || p.status === 'poor').length,
    averageScore: performances.length > 0 ? 
      Math.round(performances.reduce((sum, p) => sum + p.performanceScore, 0) / performances.length) : 0,
    totalRevenue: performances.reduce((sum, p) => sum + p.revenue, 0),
    totalProfit: performances.reduce((sum, p) => sum + p.profit, 0),
    totalTicketsSold: performances.reduce((sum, p) => sum + p.ticketsSold, 0),
    averageAchievementRate: performances.length > 0 ? 
      Math.round(performances.reduce((sum, p) => sum + p.achievementRate, 0) / performances.length) : 0,
  };

  // Chart data
  const performanceChartData = performances.map(p => ({
    agent: p.agentId,
    score: p.performanceScore,
    revenue: p.revenue / 1000000,
    profit: p.profit / 1000000,
    tickets: p.ticketsSold,
  }));

  const achievementData = performances.map(p => ({
    agent: p.agentId,
    target: p.targetRevenue / 1000000,
    actual: p.revenue / 1000000,
    achievement: p.achievementRate,
  }));

  return (
    <Box className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <PerformanceIcon className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Quản lý hiệu suất đại lý</h1>
              <p className="text-sm sm:text-base text-indigo-100">Theo dõi và đánh giá hiệu suất đại lý</p>
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
                {performances.map(p => (
                  <MenuItem key={p.agentId} value={p.agentId}>
                    Đại lý {p.agentId}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <Alert 
          severity={alert.type} 
          onClose={() => setAlert(null)}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Điểm TB
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.averageScore}
                </Typography>
              </div>
              <PerformanceIcon className="text-blue-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Xuất sắc
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.excellentAgents}
                </Typography>
              </div>
              <TrophyIcon className="text-green-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Tỷ lệ đạt mục tiêu
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.averageAchievementRate}%
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
                  {stats.belowAverageAgents}
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
            <Tab label="Hiệu suất" />
            <Tab label="Mục tiêu" />
            <Tab label="Biểu đồ" />
            <Tab label="Báo cáo" />
          </Tabs>
        </Box>

        {/* Performance Tab */}
        {tabValue === 0 && (
          <CardContent className="p-0">
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={performances.filter(p => !selectedAgent || p.agentId === selectedAgent)}
                columns={performanceColumns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 },
                  },
                }}
                pageSizeOptions={[10, 25, 50]}
                disableRowSelectionOnClick
                className="border-0"
              />
            </div>
          </CardContent>
        )}

        {/* Targets Tab */}
        {tabValue === 1 && (
          <CardContent className="p-0">
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={targets.filter(t => !selectedAgent || t.agentId === selectedAgent)}
                columns={targetColumns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 },
                  },
                }}
                pageSizeOptions={[10, 25, 50]}
                disableRowSelectionOnClick
                className="border-0"
              />
            </div>
          </CardContent>
        )}

        {/* Charts Tab */}
        {tabValue === 2 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Điểm hiệu suất theo đại lý
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={performanceChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="agent" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="score" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Doanh thu vs Mục tiêu
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={achievementData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="agent" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="target" fill="#82ca9d" name="Mục tiêu" />
                        <Bar dataKey="actual" fill="#8884d8" name="Thực tế" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Xu hướng hiệu suất
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={performanceChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="agent" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="score" stroke="#8884d8" name="Điểm hiệu suất" />
                        <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Doanh thu (M)" />
                        <Line type="monotone" dataKey="profit" stroke="#ffc658" name="Lợi nhuận (M)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Reports Tab */}
        {tabValue === 3 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tổng quan hiệu suất
                    </Typography>
                    <Box className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Tổng doanh thu:</span>
                        <span className="font-semibold text-green-600">
                          {(stats.totalRevenue / 1000000).toFixed(1)}M VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tổng lợi nhuận:</span>
                        <span className="font-semibold text-blue-600">
                          {(stats.totalProfit / 1000000).toFixed(1)}M VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tổng vé bán:</span>
                        <span className="font-semibold">{stats.totalTicketsSold.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Đại lý xuất sắc:</span>
                        <span className="font-semibold text-green-600">{stats.excellentAgents}</span>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Phân bố hiệu suất
                    </Typography>
                    <Box className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Xuất sắc (90+ điểm):</span>
                        <span className="font-semibold text-green-600">
                          {performances.filter(p => p.performanceScore >= 90).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tốt (80-89 điểm):</span>
                        <span className="font-semibold text-blue-600">
                          {performances.filter(p => p.performanceScore >= 80 && p.performanceScore < 90).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Trung bình (60-79 điểm):</span>
                        <span className="font-semibold text-yellow-600">
                          {performances.filter(p => p.performanceScore >= 60 && p.performanceScore < 80).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Dưới trung bình (&lt;60 điểm):</span>
                        <span className="font-semibold text-red-600">
                          {performances.filter(p => p.performanceScore < 60).length}
                        </span>
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

export default AgentPerformanceManagement;
