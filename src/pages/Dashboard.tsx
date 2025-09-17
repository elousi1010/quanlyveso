import { useState } from 'react';
import {
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockTransactions, mockTickets, mockSellers } from '../data/mockData';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');

  // Calculate statistics
  const totalRevenue = mockTransactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  const totalExpenses = mockTransactions
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const availableTickets = mockTickets.filter(t => t.status === 'available');
  const soldTickets = mockTickets.filter(t => t.status === 'sold');
  const totalTickets = mockTickets.length;

  const activeSellers = mockSellers.filter(s => s.isActive).length;

  // Chart data
  const revenueData = [
    { name: 'T2', revenue: 1200000, profit: 360000 },
    { name: 'T3', revenue: 1500000, profit: 450000 },
    { name: 'T4', revenue: 1800000, profit: 540000 },
    { name: 'T5', revenue: 1600000, profit: 480000 },
    { name: 'T6', revenue: 2000000, profit: 600000 },
    { name: 'T7', revenue: 2200000, profit: 660000 },
    { name: 'CN', revenue: 1900000, profit: 570000 },
  ];

  const ticketStatusData = [
    { name: 'Có sẵn', value: availableTickets.length, color: '#3b82f6' },
    { name: 'Đã bán', value: soldTickets.length, color: '#10b981' },
    { name: 'Trả lại', value: mockTickets.filter(t => t.status === 'returned').length, color: '#f59e0b' },
  ];

  const recentTransactions = mockTransactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 mt-2">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Tổng quan hoạt động kinh doanh</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['day', 'week', 'month'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
                  }`}
                >
                  {range === 'day' ? 'Hôm nay' : range === 'week' ? 'Tuần này' : 'Tháng này'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng doanh thu</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  {totalRevenue.toLocaleString('vi-VN')} VNĐ
                </p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <TrendingUpIcon className="text-green-500 text-xs sm:text-sm mr-1" />
                  <span className="text-xs sm:text-sm text-green-600 font-medium">+12.5%</span>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0 ml-2">
                <MoneyIcon className="text-blue-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="stat-card-success">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Lợi nhuận ròng</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  {netProfit.toLocaleString('vi-VN')} VNĐ
                </p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <span className="text-xs sm:text-sm text-gray-600">Tỷ lệ: {profitMargin.toFixed(1)}%</span>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0 ml-2">
                <TrendingUpIcon className="text-green-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="stat-card-warning">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Vé có sẵn</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{availableTickets.length}</p>
                <div className="mt-1 sm:mt-2">
                  <LinearProgress 
                    variant="determinate" 
                    value={(availableTickets.length / totalTickets) * 100}
                    className="h-1 sm:h-2 rounded-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {totalTickets - availableTickets.length} đã bán
                  </p>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-full flex-shrink-0 ml-2">
                <CartIcon className="text-yellow-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="stat-card-error">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Người bán hoạt động</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{activeSellers}</p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <PeopleIcon className="text-red-500 text-xs sm:text-sm mr-1" />
                  <span className="text-xs sm:text-sm text-gray-600">Tổng: {mockSellers.length}</span>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-full flex-shrink-0 ml-2">
                <PeopleIcon className="text-red-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Revenue Chart */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Doanh thu & Lợi nhuận</h3>
              <Chip label="7 ngày qua" size="small" />
            </div>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${Number(value).toLocaleString('vi-VN')} VNĐ`,
                      name === 'revenue' ? 'Doanh thu' : 'Lợi nhuận'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ticket Status Chart */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Trạng thái vé</h3>
              <Chip label="Tổng quan" size="small" />
            </div>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ticketStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} vé`, 'Số lượng']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Giao dịch gần đây</h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Avatar className={`w-8 h-8 sm:w-10 sm:h-10 ${transaction.type === 'sale' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {transaction.type === 'sale' ? (
                      <TrendingUpIcon className="text-green-600 text-sm sm:text-base" />
                    ) : (
                      <TrendingDownIcon className="text-red-600 text-sm sm:text-base" />
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {transaction.type === 'sale' ? 'Bán vé' : 'Mua vé'} - {transaction.quantity} vé
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:block sm:text-right">
                  <p className={`font-semibold text-sm sm:text-base ${transaction.type === 'sale' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'sale' ? '+' : '-'}{transaction.totalAmount.toLocaleString('vi-VN')} VNĐ
                  </p>
                  <Chip 
                    label={transaction.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'} 
                    size="small"
                    color={transaction.status === 'completed' ? 'success' : 'warning'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;