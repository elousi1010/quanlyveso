import { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  AttachMoney as MoneyIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockTransactions, mockProvinces } from '../data/mockData';
import type { TimeRange } from '../types';
import dayjs from 'dayjs';

const ProfitCalculation = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');

  // Mock data for charts
  const profitData = [
    { name: 'T2', profit: 1000000, revenue: 1500000, cost: 500000 },
    { name: 'T3', profit: 1200000, revenue: 1800000, cost: 600000 },
    { name: 'T4', profit: 800000, revenue: 1300000, cost: 500000 },
    { name: 'T5', profit: 1500000, revenue: 2000000, cost: 500000 },
    { name: 'T6', profit: 1100000, revenue: 1600000, cost: 500000 },
    { name: 'T7', profit: 1300000, revenue: 1900000, cost: 600000 },
    { name: 'CN', profit: 900000, revenue: 1400000, cost: 500000 },
  ];

  const provinceData = [
    { name: 'Hà Nội', profit: 2000000, revenue: 5000000, cost: 3000000 },
    { name: 'TP.HCM', profit: 1800000, revenue: 4500000, cost: 2700000 },
    { name: 'Đà Nẵng', profit: 1200000, revenue: 3000000, cost: 1800000 },
    { name: 'Hải Phòng', profit: 800000, revenue: 2000000, cost: 1200000 },
    { name: 'Cần Thơ', profit: 600000, revenue: 1500000, cost: 900000 },
  ];

  const recentTransactions = mockTransactions.slice(0, 10);

  return (
    <Box className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <TrendingUpIcon className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Tính lợi nhuận</h1>
              <p className="text-sm sm:text-base text-green-100">Phân tích lợi nhuận theo thời gian và địa điểm</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="contained"
              startIcon={<AssessmentIcon />}
              className="bg-white text-green-600 hover:bg-green-50 font-semibold px-4 py-2 rounded-lg"
            >
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="card">
        <div className="card-header">
          <Typography variant="h6" className="font-semibold text-gray-900">
            Bộ lọc
          </Typography>
        </div>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Khoảng thời gian</InputLabel>
            <Select
              value={timeRange}
              label="Khoảng thời gian"
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            >
              <MenuItem value="day">Theo ngày</MenuItem>
              <MenuItem value="week">Theo tuần</MenuItem>
              <MenuItem value="month">Theo tháng</MenuItem>
              <MenuItem value="year">Theo năm</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Tỉnh thành</InputLabel>
            <Select
              value={selectedProvince}
              label="Tỉnh thành"
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              <MenuItem value="all">Tất cả tỉnh</MenuItem>
              {mockProvinces.map(province => (
                <MenuItem key={province.id} value={province.id}>
                  {province.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="stat-card-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Tổng lợi nhuận
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  8,500,000đ
                </Typography>
              </div>
              <TrendingUpIcon className="text-green-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Tổng doanh thu
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  15,000,000đ
                </Typography>
              </div>
              <MoneyIcon className="text-blue-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-error">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Tổng chi phí
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  6,500,000đ
                </Typography>
              </div>
              <BarChartIcon className="text-red-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Tỷ lệ lợi nhuận
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  56.7%
                </Typography>
              </div>
              <AssessmentIcon className="text-yellow-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Card className="card">
          <div className="card-header">
            <Typography variant="h6" className="font-semibold text-gray-900">
              Biểu đồ lợi nhuận theo thời gian
            </Typography>
          </div>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toLocaleString('vi-VN') + ' VNĐ'} />
                  <Line type="monotone" dataKey="profit" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="cost" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="card">
          <div className="card-header">
            <Typography variant="h6" className="font-semibold text-gray-900">
              Lợi nhuận theo tỉnh
            </Typography>
          </div>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={provinceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toLocaleString('vi-VN') + ' VNĐ'} />
                  <Bar dataKey="profit" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Table */}
      <Card className="card">
        <div className="card-header">
          <Typography variant="h6" className="font-semibold text-gray-900">
            Giao dịch gần đây
          </Typography>
        </div>
        <CardContent className="p-0">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ngày</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Giá trị</TableCell>
                <TableCell>Lợi nhuận</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {dayjs(transaction.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    {transaction.type === 'sale' ? 'Bán vé' : 'Mua vé'}
                  </TableCell>
                  <TableCell>{transaction.quantity} vé</TableCell>
                  <TableCell>
                    {transaction.totalAmount.toLocaleString('vi-VN')} VNĐ
                  </TableCell>
                  <TableCell>
                    <Typography color={transaction.type === 'sale' ? 'success.main' : 'error.main'}>
                      {transaction.type === 'sale' ? '+' : '-'}
                      {(transaction.totalAmount * 0.3).toLocaleString('vi-VN')} VNĐ
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.status === 'completed' ? 'Hoàn thành' : 'Chờ xử lý'} 
                      color={transaction.status === 'completed' ? 'success' : 'warning'}
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
    </Box>
  );
};

export default ProfitCalculation;