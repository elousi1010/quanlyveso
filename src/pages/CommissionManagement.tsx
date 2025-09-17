import React, { useState } from 'react';
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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  Calculate as CalculateIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';

interface CommissionRule {
  id: string;
  name: string;
  description: string;
  agentType: 'level1' | 'level2' | 'level3' | 'retail';
  baseRate: number;
  effectiveDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

interface CommissionCalculation {
  id: string;
  agentId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  totalSales: number;
  totalTickets: number;
  averageTicketPrice: number;
  baseCommission: number;
  tierCommission: number;
  bonusCommission: number;
  penaltyAmount: number;
  totalCommission: number;
  appliedRules: string[];
  appliedBonuses: string[];
  appliedPenalties: string[];
  status: 'calculated' | 'reviewed' | 'approved' | 'paid' | 'disputed';
  calculatedAt: Date;
  reviewedAt?: Date;
  approvedAt?: Date;
  paidAt?: Date;
  reviewedBy?: string;
  approvedBy?: string;
  notes?: string;
}

interface CommissionPayment {
  id: string;
  calculationId: string;
  agentId: string;
  amount: number;
  paymentMethod: 'bank_transfer' | 'cash' | 'check' | 'credit';
  paymentDate: Date;
  reference: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  processedBy: string;
  notes?: string;
}

const mockRules: CommissionRule[] = [
  {
    id: '1',
    name: 'Hoa hồng cấp 1 cơ bản',
    description: 'Hoa hồng cơ bản cho đại lý cấp 1',
    agentType: 'level1',
    baseRate: 15,
    effectiveDate: new Date('2024-01-01'),
    isActive: true,
    priority: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
  },
  {
    id: '2',
    name: 'Hoa hồng cấp 2 cơ bản',
    description: 'Hoa hồng cơ bản cho đại lý cấp 2',
    agentType: 'level2',
    baseRate: 10,
    effectiveDate: new Date('2024-01-01'),
    isActive: true,
    priority: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
  },
  {
    id: '3',
    name: 'Thưởng doanh số cao',
    description: 'Thưởng thêm cho đại lý có doanh số > 50M/tháng',
    agentType: 'level1',
    baseRate: 0,
    effectiveDate: new Date('2024-01-01'),
    isActive: true,
    priority: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
  },
];

const mockCalculations: CommissionCalculation[] = [
  {
    id: '1',
    agentId: '1',
    period: 'monthly',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    totalSales: 15000000,
    totalTickets: 1500,
    averageTicketPrice: 10000,
    baseCommission: 2250000,
    tierCommission: 0,
    bonusCommission: 500000,
    penaltyAmount: 0,
    totalCommission: 2750000,
    appliedRules: ['1', '3'],
    appliedBonuses: ['sales_bonus'],
    appliedPenalties: [],
    status: 'paid',
    calculatedAt: new Date('2024-02-01'),
    approvedAt: new Date('2024-02-02'),
    paidAt: new Date('2024-02-05'),
    approvedBy: 'admin',
  },
  {
    id: '2',
    agentId: '2',
    period: 'monthly',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    totalSales: 12000000,
    totalTickets: 1200,
    averageTicketPrice: 10000,
    baseCommission: 1200000,
    tierCommission: 0,
    bonusCommission: 200000,
    penaltyAmount: 50000,
    totalCommission: 1350000,
    appliedRules: ['2'],
    appliedBonuses: ['customer_growth'],
    appliedPenalties: ['late_payment'],
    status: 'approved',
    calculatedAt: new Date('2024-02-01'),
    approvedAt: new Date('2024-02-02'),
    approvedBy: 'admin',
  },
  {
    id: '3',
    agentId: '3',
    period: 'monthly',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    totalSales: 8000000,
    totalTickets: 800,
    averageTicketPrice: 10000,
    baseCommission: 400000,
    tierCommission: 0,
    bonusCommission: 0,
    penaltyAmount: 100000,
    totalCommission: 300000,
    appliedRules: ['2'],
    appliedBonuses: [],
    appliedPenalties: ['complaint_rate'],
    status: 'calculated',
    calculatedAt: new Date('2024-02-01'),
  },
];

const mockPayments: CommissionPayment[] = [
  {
    id: '1',
    calculationId: '1',
    agentId: '1',
    amount: 2750000,
    paymentMethod: 'bank_transfer',
    paymentDate: new Date('2024-02-05'),
    reference: 'PAY001',
    status: 'completed',
    processedBy: 'admin',
  },
  {
    id: '2',
    calculationId: '2',
    agentId: '2',
    amount: 1350000,
    paymentMethod: 'bank_transfer',
    paymentDate: new Date('2024-02-10'),
    reference: 'PAY002',
    status: 'processing',
    processedBy: 'admin',
  },
];

const CommissionManagement: React.FC = () => {
  const [rules, setRules] = useState<CommissionRule[]>(mockRules);
  const [calculations, setCalculations] = useState<CommissionCalculation[]>(mockCalculations);
  const [payments] = useState<CommissionPayment[]>(mockPayments);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<CommissionRule | null>(null);
  const [openCalculationDialog, setOpenCalculationDialog] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    agentType: 'level1' as 'level1' | 'level2' | 'level3' | 'retail',
    baseRate: 0,
    effectiveDate: dayjs().format('YYYY-MM-DD'),
    expiryDate: '',
    isActive: true,
    priority: 1,
  });
  const [calculationForm, setCalculationForm] = useState({
    agentId: '',
    period: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
  });

  const getAgentTypeText = (type: string) => {
    switch (type) {
      case 'level1': return 'Cấp 1';
      case 'level2': return 'Cấp 2';
      case 'level3': return 'Cấp 3';
      case 'retail': return 'Bán lẻ';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'calculated': return 'info';
      case 'reviewed': return 'warning';
      case 'approved': return 'success';
      case 'paid': return 'success';
      case 'disputed': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'calculated': return 'Đã tính';
      case 'reviewed': return 'Đã xem xét';
      case 'approved': return 'Đã duyệt';
      case 'paid': return 'Đã thanh toán';
      case 'disputed': return 'Có tranh chấp';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'completed': return 'Hoàn thành';
      case 'failed': return 'Thất bại';
      case 'cancelled': return 'Hủy bỏ';
      default: return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'bank_transfer': return 'Chuyển khoản';
      case 'cash': return 'Tiền mặt';
      case 'check': return 'Séc';
      case 'credit': return 'Tín dụng';
      default: return method;
    }
  };

  const handleAddRule = () => {
    setEditingRule(null);
    setFormData({
      name: '',
      description: '',
      agentType: 'level1',
      baseRate: 0,
      effectiveDate: dayjs().format('YYYY-MM-DD'),
      expiryDate: '',
      isActive: true,
      priority: 1,
    });
    setOpenDialog(true);
  };

  const handleEditRule = (rule: CommissionRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description,
      agentType: rule.agentType,
      baseRate: rule.baseRate,
      effectiveDate: dayjs(rule.effectiveDate).format('YYYY-MM-DD'),
      expiryDate: rule.expiryDate ? dayjs(rule.expiryDate).format('YYYY-MM-DD') : '',
      isActive: rule.isActive,
      priority: rule.priority,
    });
    setOpenDialog(true);
  };

  const handleSaveRule = () => {
    if (!formData.name.trim()) {
      setAlert({ type: 'error', message: 'Vui lòng nhập tên quy tắc' });
      return;
    }

    const ruleData: CommissionRule = {
      id: editingRule?.id || Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      agentType: formData.agentType,
      baseRate: formData.baseRate,
      effectiveDate: new Date(formData.effectiveDate),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
      isActive: formData.isActive,
      priority: formData.priority,
      createdAt: editingRule?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: 'admin',
    };

    if (editingRule) {
      setRules(prev => prev.map(r => r.id === editingRule.id ? ruleData : r));
      setAlert({ type: 'success', message: 'Cập nhật quy tắc thành công' });
    } else {
      setRules(prev => [...prev, ruleData]);
      setAlert({ type: 'success', message: 'Thêm quy tắc mới thành công' });
    }

    setOpenDialog(false);
  };

  const handleDeleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    setAlert({ type: 'success', message: 'Xóa quy tắc thành công' });
  };

  const handleCalculateCommission = () => {
    setCalculationForm({
      agentId: '',
      period: 'monthly',
      startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
      endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
    });
    setOpenCalculationDialog(true);
  };

  const handleRunCalculation = () => {
    if (!calculationForm.agentId) {
      setAlert({ type: 'error', message: 'Vui lòng chọn đại lý' });
      return;
    }

    // Mock calculation logic
    const newCalculation: CommissionCalculation = {
      id: Date.now().toString(),
      agentId: calculationForm.agentId,
      period: calculationForm.period,
      startDate: new Date(calculationForm.startDate),
      endDate: new Date(calculationForm.endDate),
      totalSales: Math.floor(Math.random() * 20000000) + 5000000,
      totalTickets: Math.floor(Math.random() * 2000) + 500,
      averageTicketPrice: 10000,
      baseCommission: 0,
      tierCommission: 0,
      bonusCommission: 0,
      penaltyAmount: 0,
      totalCommission: 0,
      appliedRules: [],
      appliedBonuses: [],
      appliedPenalties: [],
      status: 'calculated',
      calculatedAt: new Date(),
    };

    // Calculate commission based on rules
    const agentType = calculationForm.agentId === '1' ? 'level1' : calculationForm.agentId === '2' ? 'level2' : 'level3';
    const applicableRules = rules.filter(r => r.agentType === agentType && r.isActive);
    
    if (applicableRules.length > 0) {
      const rule = applicableRules[0];
      newCalculation.baseCommission = (newCalculation.totalSales * rule.baseRate) / 100;
      newCalculation.appliedRules = [rule.id];
    }

    // Add bonus for high sales
    if (newCalculation.totalSales > 10000000) {
      newCalculation.bonusCommission = 500000;
      newCalculation.appliedBonuses = ['sales_bonus'];
    }

    newCalculation.totalCommission = newCalculation.baseCommission + newCalculation.tierCommission + newCalculation.bonusCommission - newCalculation.penaltyAmount;

    setCalculations(prev => [newCalculation, ...prev]);
    setAlert({ type: 'success', message: 'Tính hoa hồng thành công' });
    setOpenCalculationDialog(false);
  };

  const ruleColumns: GridColDef[] = [
    { field: 'name', headerName: 'Tên quy tắc', width: 200, flex: 2 },
    { field: 'description', headerName: 'Mô tả', width: 250, flex: 2 },
    { 
      field: 'agentType', 
      headerName: 'Loại đại lý', 
      width: 120, 
      renderCell: (params) => getAgentTypeText(params.value)
    },
    { 
      field: 'baseRate', 
      headerName: 'Tỷ lệ cơ bản (%)', 
      width: 120, 
      type: 'number'
    },
    { 
      field: 'priority', 
      headerName: 'Ưu tiên', 
      width: 100, 
      type: 'number'
    },
    { 
      field: 'isActive', 
      headerName: 'Trạng thái', 
      width: 100, 
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Hoạt động' : 'Ngừng'} 
          color={params.value ? 'success' : 'error'} 
          size="small" 
        />
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Thao tác',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Sửa"
          onClick={() => handleEditRule(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Xóa"
          onClick={() => handleDeleteRule(params.row.id)}
        />,
      ],
    },
  ];

  const calculationColumns: GridColDef[] = [
    { field: 'agentId', headerName: 'Mã đại lý', width: 120, flex: 1 },
    { 
      field: 'period', 
      headerName: 'Kỳ', 
      width: 100, 
      renderCell: (params) => {
        const periodMap = {
          'daily': 'Ngày',
          'weekly': 'Tuần',
          'monthly': 'Tháng',
          'quarterly': 'Quý',
          'yearly': 'Năm'
        };
        return periodMap[params.value as keyof typeof periodMap] || params.value;
      }
    },
    { 
      field: 'totalSales', 
      headerName: 'Tổng doanh thu', 
      width: 150, 
      renderCell: (params) => (
        <span className="font-semibold text-green-600">
          {(params.value / 1000000).toFixed(1)}M VNĐ
        </span>
      )
    },
    { 
      field: 'totalTickets', 
      headerName: 'Tổng vé', 
      width: 100, 
      type: 'number'
    },
    { 
      field: 'totalCommission', 
      headerName: 'Tổng hoa hồng', 
      width: 150, 
      renderCell: (params) => (
        <span className="font-semibold text-blue-600">
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
          label={getStatusText(params.value)} 
          color={getStatusColor(params.value)} 
          size="small" 
        />
      )
    },
    { 
      field: 'calculatedAt', 
      headerName: 'Ngày tính', 
      width: 120, 
      renderCell: (params) => dayjs(params.value).format('DD/MM/YYYY')
    },
  ];

  const paymentColumns: GridColDef[] = [
    { field: 'reference', headerName: 'Mã tham chiếu', width: 120, flex: 1 },
    { field: 'agentId', headerName: 'Mã đại lý', width: 120, flex: 1 },
    { 
      field: 'amount', 
      headerName: 'Số tiền', 
      width: 150, 
      renderCell: (params) => (
        <span className="font-semibold">
          {(params.value / 1000000).toFixed(1)}M VNĐ
        </span>
      )
    },
    { 
      field: 'paymentMethod', 
      headerName: 'Phương thức', 
      width: 120, 
      renderCell: (params) => getPaymentMethodText(params.value)
    },
    { 
      field: 'status', 
      headerName: 'Trạng thái', 
      width: 120, 
      renderCell: (params) => (
        <Chip 
          label={getPaymentStatusText(params.value)} 
          color={getPaymentStatusColor(params.value)} 
          size="small" 
        />
      )
    },
    { 
      field: 'paymentDate', 
      headerName: 'Ngày thanh toán', 
      width: 120, 
      renderCell: (params) => dayjs(params.value).format('DD/MM/YYYY')
    },
  ];

  const stats = {
    totalRules: rules.length,
    activeRules: rules.filter(r => r.isActive).length,
    totalCalculations: calculations.length,
    pendingCalculations: calculations.filter(c => c.status === 'calculated').length,
    approvedCalculations: calculations.filter(c => c.status === 'approved').length,
    paidCalculations: calculations.filter(c => c.status === 'paid').length,
    totalCommission: calculations.reduce((sum, c) => sum + c.totalCommission, 0),
    totalPayments: payments.reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: payments.filter(p => p.status === 'pending' || p.status === 'processing').length,
  };

  // Chart data
  const commissionChartData = calculations.map(c => ({
    agent: c.agentId,
    base: c.baseCommission / 1000000,
    bonus: c.bonusCommission / 1000000,
    penalty: c.penaltyAmount / 1000000,
    total: c.totalCommission / 1000000,
  }));

  const paymentChartData = payments.map(p => ({
    month: dayjs(p.paymentDate).format('MM/YYYY'),
    amount: p.amount / 1000000,
  }));

  return (
    <Box className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <MoneyIcon className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Quản lý hoa hồng</h1>
              <p className="text-sm sm:text-base text-orange-100">Tính toán và quản lý hoa hồng đại lý</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddRule}
              className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-4 py-2 rounded-lg"
            >
              Thêm quy tắc
            </Button>
            <Button
              variant="contained"
              startIcon={<CalculateIcon />}
              onClick={handleCalculateCommission}
              className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-4 py-2 rounded-lg"
            >
              Tính hoa hồng
            </Button>
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
                  Tổng hoa hồng
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {(stats.totalCommission / 1000000).toFixed(1)}M
                </Typography>
              </div>
              <MoneyIcon className="text-blue-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Đã thanh toán
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {(stats.totalPayments / 1000000).toFixed(1)}M
                </Typography>
              </div>
              <PaymentIcon className="text-green-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Chờ duyệt
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.pendingCalculations}
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
                  Chờ thanh toán
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.pendingPayments}
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
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Quy tắc" />
            <Tab label="Tính toán" />
            <Tab label="Thanh toán" />
            <Tab label="Báo cáo" />
          </Tabs>
        </Box>

        {/* Rules Tab */}
        {tabValue === 0 && (
          <CardContent className="p-0">
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rules}
                columns={ruleColumns}
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

        {/* Calculations Tab */}
        {tabValue === 1 && (
          <CardContent className="p-0">
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={calculations}
                columns={calculationColumns}
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

        {/* Payments Tab */}
        {tabValue === 2 && (
          <CardContent className="p-0">
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={payments}
                columns={paymentColumns}
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

        {/* Reports Tab */}
        {tabValue === 3 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Phân bố hoa hồng theo đại lý
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={commissionChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="agent" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="base" stackId="a" fill="#8884d8" name="Cơ bản" />
                        <Bar dataKey="bonus" stackId="a" fill="#82ca9d" name="Thưởng" />
                        <Bar dataKey="penalty" stackId="a" fill="#ffc658" name="Phạt" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Xu hướng thanh toán
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={paymentChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Thanh toán (M)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tổng quan hoa hồng
                    </Typography>
                    <Box className="space-y-2">
                      <div className="flex justify-between">
                        <span>Tổng hoa hồng đã tính:</span>
                        <span className="font-semibold text-blue-600">
                          {(stats.totalCommission / 1000000).toFixed(1)}M VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tổng đã thanh toán:</span>
                        <span className="font-semibold text-green-600">
                          {(stats.totalPayments / 1000000).toFixed(1)}M VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Còn lại chưa thanh toán:</span>
                        <span className="font-semibold text-orange-600">
                          {((stats.totalCommission - stats.totalPayments) / 1000000).toFixed(1)}M VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tỷ lệ thanh toán:</span>
                        <span className="font-semibold">
                          {stats.totalCommission > 0 ? ((stats.totalPayments / stats.totalCommission) * 100).toFixed(1) : 0}%
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

      {/* Add/Edit Rule Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRule ? 'Sửa quy tắc hoa hồng' : 'Thêm quy tắc hoa hồng mới'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Tên quy tắc"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Loại đại lý</InputLabel>
                  <Select
                    value={formData.agentType}
                    onChange={(e) => setFormData(prev => ({ ...prev, agentType: e.target.value as 'level1' | 'level2' | 'level3' | 'retail' }))}
                    label="Loại đại lý"
                  >
                    <MenuItem value="level1">Cấp 1</MenuItem>
                    <MenuItem value="level2">Cấp 2</MenuItem>
                    <MenuItem value="level3">Cấp 3</MenuItem>
                    <MenuItem value="retail">Bán lẻ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Tỷ lệ cơ bản (%)"
                  type="number"
                  value={formData.baseRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, baseRate: Number(e.target.value) }))}
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Ưu tiên"
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Ngày có hiệu lực"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Ngày hết hạn"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                  }
                  label="Quy tắc hoạt động"
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveRule} variant="contained">
            {editingRule ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Calculation Dialog */}
      <Dialog open={openCalculationDialog} onClose={() => setOpenCalculationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tính hoa hồng cho đại lý</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <FormControl fullWidth>
              <InputLabel>Đại lý</InputLabel>
              <Select
                value={calculationForm.agentId}
                onChange={(e) => setCalculationForm(prev => ({ ...prev, agentId: e.target.value }))}
                label="Đại lý"
                required
              >
                <MenuItem value="1">Đại lý 1</MenuItem>
                <MenuItem value="2">Đại lý 2</MenuItem>
                <MenuItem value="3">Đại lý 3</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Kỳ tính</InputLabel>
              <Select
                value={calculationForm.period}
                onChange={(e) => setCalculationForm(prev => ({ ...prev, period: e.target.value as 'monthly' | 'quarterly' | 'yearly' }))}
                label="Kỳ tính"
              >
                <MenuItem value="daily">Ngày</MenuItem>
                <MenuItem value="weekly">Tuần</MenuItem>
                <MenuItem value="monthly">Tháng</MenuItem>
                <MenuItem value="quarterly">Quý</MenuItem>
                <MenuItem value="yearly">Năm</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Ngày bắt đầu"
              type="date"
              value={calculationForm.startDate}
              onChange={(e) => setCalculationForm(prev => ({ ...prev, startDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Ngày kết thúc"
              type="date"
              value={calculationForm.endDate}
              onChange={(e) => setCalculationForm(prev => ({ ...prev, endDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              required
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCalculationDialog(false)}>Hủy</Button>
          <Button onClick={handleRunCalculation} variant="contained">
            Tính hoa hồng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommissionManagement;
