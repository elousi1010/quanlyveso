import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  AttachMoney as MoneyIcon,
  ConfirmationNumber as TicketIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [tabValue, setTabValue] = useState(0);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [importData, setImportData] = useState<any[]>([]);

  // Mock data - trong thực tế sẽ lấy từ API
  useEffect(() => {
    // Generate mock data for the last 30 days
    const generateMockData = () => {
      const data = [];
      for (let i = 29; i >= 0; i--) {
        const date = dayjs().subtract(i, 'days');
        data.push({
          date: date.format('MM/DD'),
          sales: Math.floor(Math.random() * 1000000) + 500000,
          imports: Math.floor(Math.random() * 800000) + 300000,
          profit: Math.floor(Math.random() * 200000) + 100000,
          tickets: Math.floor(Math.random() * 500) + 100,
        });
      }
      return data;
    };

    setSalesData(generateMockData());
    setImportData(generateMockData());
    // setTicketsData(generateMockData());
  }, [timeRange]);

  const timeRanges = [
    { value: '7days', label: '7 ngày qua' },
    { value: '30days', label: '30 ngày qua' },
    { value: '90days', label: '90 ngày qua' },
    { value: '1year', label: '1 năm qua' },
  ];

  const provinceData = [
    { name: 'TP. Hồ Chí Minh', value: 35, color: '#8884d8' },
    { name: 'Hà Nội', value: 25, color: '#82ca9d' },
    { name: 'Cần Thơ', value: 15, color: '#ffc658' },
    { name: 'Đà Nẵng', value: 12, color: '#ff7300' },
    { name: 'Khác', value: 13, color: '#00ff00' },
  ];

  const ticketTypeData = [
    { name: 'Vé số thường', value: 60, color: '#8884d8' },
    { name: 'Vé số đặc biệt', value: 25, color: '#82ca9d' },
    { name: 'Vé số VIP', value: 15, color: '#ffc658' },
  ];

  const shiftPerformanceData = [
    { name: 'Ca sáng', sales: 2400000, efficiency: 85 },
    { name: 'Ca chiều', sales: 3200000, efficiency: 92 },
    { name: 'Ca đêm', sales: 1800000, efficiency: 78 },
  ];

  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const totalImports = importData.reduce((sum, item) => sum + item.imports, 0);
  const totalProfit = salesData.reduce((sum, item) => sum + item.profit, 0);
  const totalTickets = salesData.reduce((sum, item) => sum + item.tickets, 0);
  const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

  const StatCard = ({ title, value, icon, color, trend, subtitle }: any) => (
    <Card className="stat-card">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${color} truncate`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ml-2 ${color === 'text-green-600' ? 'bg-green-100' : color === 'text-blue-600' ? 'bg-blue-100' : color === 'text-purple-600' ? 'bg-purple-100' : 'bg-orange-100'}`}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className="flex items-center mt-2">
            {trend > 0 ? (
              <TrendingUpIcon className="text-green-500 text-sm mr-1" />
            ) : (
              <TrendingDownIcon className="text-red-500 text-sm mr-1" />
            )}
            <span className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(trend)}% so với kỳ trước
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-100 to-purple-50 rounded-xl shadow-sm">
                <AssessmentIcon className="text-purple-600 text-xl sm:text-2xl" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Phân tích & Báo cáo
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Thống kê chi tiết và xu hướng kinh doanh</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FormControl size="small" className="min-w-32">
                <InputLabel>Thời gian</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  label="Thời gian"
                >
                  {timeRanges.map((range) => (
                    <MenuItem key={range.value} value={range.value}>
                      {range.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <StatCard
              title="Tổng doanh thu"
              value={`${totalSales.toLocaleString('vi-VN')} VNĐ`}
              icon={<MoneyIcon className="text-green-600 text-lg sm:text-xl lg:text-2xl" />}
              color="text-green-600"
              trend={12.5}
              subtitle="Tăng 12.5% so với kỳ trước"
            />
          </div>
          <div>
            <StatCard
              title="Tổng chi phí"
              value={`${totalImports.toLocaleString('vi-VN')} VNĐ`}
              icon={<TrendingDownIcon className="text-red-600 text-lg sm:text-xl lg:text-2xl" />}
              color="text-red-600"
              trend={-8.2}
              subtitle="Giảm 8.2% so với kỳ trước"
            />
          </div>
          <div>
            <StatCard
              title="Lợi nhuận"
              value={`${totalProfit.toLocaleString('vi-VN')} VNĐ`}
              icon={<TrendingUpIcon className="text-blue-600 text-lg sm:text-xl lg:text-2xl" />}
              color="text-blue-600"
              trend={25.8}
              subtitle={`Biên lợi nhuận: ${profitMargin.toFixed(1)}%`}
            />
          </div>
          <div>
            <StatCard
              title="Tổng vé bán"
              value={`${totalTickets.toLocaleString()}`}
              icon={<TicketIcon className="text-purple-600 text-lg sm:text-xl lg:text-2xl" />}
              color="text-purple-600"
              trend={15.3}
              subtitle="Tăng 15.3% so với kỳ trước"
            />
          </div>
        </div>

        {/* Tabs */}
        <Card className="card">
          <Box className="card-header">
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Xu hướng doanh thu" />
              <Tab label="Phân tích theo tỉnh" />
              <Tab label="Hiệu suất ca làm việc" />
              <Tab label="Loại vé" />
            </Tabs>
          </Box>
          <CardContent className="p-4 sm:p-6">
            {tabValue === 0 && (
              <div className="space-y-6">
                <Typography variant="h6" className="font-semibold text-gray-900 mb-4">
                  Biểu đồ xu hướng doanh thu
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value.toLocaleString('vi-VN')} VNĐ`, 
                        name === 'sales' ? 'Doanh thu' : name === 'imports' ? 'Chi phí' : 'Lợi nhuận'
                      ]}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="sales" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="imports" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="profit" stackId="3" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {tabValue === 1 && (
              <div className="space-y-6">
                <Typography variant="h6" className="font-semibold text-gray-900 mb-4">
                  Phân tích theo tỉnh
                </Typography>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Typography variant="subtitle1" className="font-medium text-gray-700 mb-3">
                      Tỷ lệ doanh thu theo tỉnh
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={provinceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {provinceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <Typography variant="subtitle1" className="font-medium text-gray-700 mb-3">
                      Top tỉnh có doanh thu cao
                    </Typography>
                    <div className="space-y-3">
                      {provinceData.map((province) => (
                        <div key={province.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: province.color }}></div>
                            <span className="font-medium">{province.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{province.value}%</p>
                            <p className="text-xs text-gray-500">
                              {Math.floor((province.value / 100) * totalSales).toLocaleString('vi-VN')} VNĐ
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tabValue === 2 && (
              <div className="space-y-6">
                <Typography variant="h6" className="font-semibold text-gray-900 mb-4">
                  Hiệu suất ca làm việc
                </Typography>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Typography variant="subtitle1" className="font-medium text-gray-700 mb-3">
                      Doanh thu theo ca
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={shiftPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value.toLocaleString('vi-VN')} VNĐ`, 'Doanh thu']} />
                        <Bar dataKey="sales" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <Typography variant="subtitle1" className="font-medium text-gray-700 mb-3">
                      Hiệu suất ca làm việc
                    </Typography>
                    <div className="space-y-3">
                      {shiftPerformanceData.map((shift) => (
                        <div key={shift.name} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{shift.name}</span>
                            <Chip 
                              label={`${shift.efficiency}%`} 
                              color={shift.efficiency >= 90 ? 'success' : shift.efficiency >= 80 ? 'warning' : 'error'}
                              size="small"
                            />
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                shift.efficiency >= 90 ? 'bg-green-500' : 
                                shift.efficiency >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${shift.efficiency}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Doanh thu: {shift.sales.toLocaleString('vi-VN')} VNĐ
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tabValue === 3 && (
              <div className="space-y-6">
                <Typography variant="h6" className="font-semibold text-gray-900 mb-4">
                  Phân tích loại vé
                </Typography>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Typography variant="subtitle1" className="font-medium text-gray-700 mb-3">
                      Tỷ lệ bán theo loại vé
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={ticketTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {ticketTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <Typography variant="subtitle1" className="font-medium text-gray-700 mb-3">
                      Chi tiết loại vé
                    </Typography>
                    <div className="space-y-3">
                      {ticketTypeData.map((ticket) => (
                        <div key={ticket.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ticket.color }}></div>
                            <span className="font-medium">{ticket.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{ticket.value}%</p>
                            <p className="text-xs text-gray-500">
                              {Math.floor((ticket.value / 100) * totalTickets).toLocaleString()} vé
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
