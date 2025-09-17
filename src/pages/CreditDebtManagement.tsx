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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountBalance as CreditIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Payment as PaymentIcon,
  Assessment as ReportIcon,
} from '@mui/icons-material';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import dayjs from 'dayjs';

interface CreditProfile {
  id: string;
  agentId: string;
  creditLimit: number;
  currentDebt: number;
  availableCredit: number;
  creditScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastAssessment: Date;
}

interface PaymentRecord {
  id: string;
  agentId: string;
  amount: number;
  type: 'payment' | 'credit' | 'debit' | 'refund';
  description: string;
  date: Date;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference: string;
  method: 'cash' | 'bank_transfer' | 'check' | 'other';
  processedBy: string;
  notes?: string;
}

interface CreditAlert {
  id: string;
  agentId: string;
  alertType: 'overdue_payment' | 'credit_limit_exceeded' | 'payment_missed' | 'credit_score_drop' | 'high_risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  createdAt: Date;
  status: 'active' | 'acknowledged' | 'resolved';
}

const mockCreditProfiles: CreditProfile[] = [
  {
    id: '1',
    agentId: '1',
    creditLimit: 50000000,
    currentDebt: 15000000,
    availableCredit: 35000000,
    creditScore: 750,
    riskLevel: 'medium',
    lastAssessment: new Date('2024-01-15'),
  },
  {
    id: '2',
    agentId: '2',
    creditLimit: 30000000,
    currentDebt: 5000000,
    availableCredit: 25000000,
    creditScore: 850,
    riskLevel: 'low',
    lastAssessment: new Date('2024-01-10'),
  },
  {
    id: '3',
    agentId: '3',
    creditLimit: 20000000,
    currentDebt: 18000000,
    availableCredit: 2000000,
    creditScore: 600,
    riskLevel: 'high',
    lastAssessment: new Date('2024-01-20'),
  },
];

const mockPayments: PaymentRecord[] = [
  {
    id: '1',
    agentId: '1',
    amount: 5000000,
    type: 'payment',
    description: 'Thanh toán nợ tháng 1',
    date: new Date('2024-01-15'),
    status: 'completed',
    reference: 'PAY001',
    method: 'bank_transfer',
    processedBy: 'admin',
  },
  {
    id: '2',
    agentId: '2',
    amount: 2000000,
    type: 'payment',
    description: 'Thanh toán hoa hồng',
    date: new Date('2024-01-20'),
    status: 'completed',
    reference: 'PAY002',
    method: 'cash',
    processedBy: 'admin',
  },
  {
    id: '3',
    agentId: '3',
    amount: 10000000,
    type: 'debit',
    description: 'Mua vé số mới',
    date: new Date('2024-01-25'),
    status: 'completed',
    reference: 'DEB001',
    method: 'other',
    processedBy: 'admin',
  },
];

const mockAlerts: CreditAlert[] = [
  {
    id: '1',
    agentId: '3',
    alertType: 'high_risk',
    severity: 'high',
    message: 'Đại lý có tỷ lệ sử dụng tín dụng cao (90%)',
    createdAt: new Date('2024-01-25'),
    status: 'active',
  },
  {
    id: '2',
    agentId: '1',
    alertType: 'overdue_payment',
    severity: 'medium',
    message: 'Thanh toán trễ 5 ngày',
    createdAt: new Date('2024-01-20'),
    status: 'acknowledged',
  },
];

const CreditDebtManagement: React.FC = () => {
  const [creditProfiles, setCreditProfiles] = useState<CreditProfile[]>(mockCreditProfiles);
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPayments);
  const [alerts, setAlerts] = useState<CreditAlert[]>(mockAlerts);
  const [tabValue, setTabValue] = useState(0);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openCreditDialog, setOpenCreditDialog] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    agentId: '',
    amount: 0,
    type: 'payment' as 'payment' | 'credit' | 'debit' | 'refund',
    description: '',
    method: 'cash' as 'cash' | 'bank_transfer' | 'check' | 'other',
    reference: '',
    notes: '',
  });
  const [creditForm, setCreditForm] = useState({
    agentId: '',
    creditLimit: 0,
    reason: '',
  });

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getRiskText = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'Thấp';
      case 'medium': return 'Trung bình';
      case 'high': return 'Cao';
      case 'critical': return 'Nghiêm trọng';
      default: return riskLevel;
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'info';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getAlertTypeText = (type: string) => {
    switch (type) {
      case 'overdue_payment': return 'Thanh toán trễ';
      case 'credit_limit_exceeded': return 'Vượt hạn mức';
      case 'payment_missed': return 'Bỏ lỡ thanh toán';
      case 'credit_score_drop': return 'Điểm tín dụng giảm';
      case 'high_risk': return 'Rủi ro cao';
      default: return type;
    }
  };

  const getPaymentTypeText = (type: string) => {
    switch (type) {
      case 'payment': return 'Thanh toán';
      case 'credit': return 'Tín dụng';
      case 'debit': return 'Ghi nợ';
      case 'refund': return 'Hoàn tiền';
      default: return type;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash': return 'Tiền mặt';
      case 'bank_transfer': return 'Chuyển khoản';
      case 'check': return 'Séc';
      case 'other': return 'Khác';
      default: return method;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'pending': return 'Chờ xử lý';
      case 'failed': return 'Thất bại';
      case 'cancelled': return 'Hủy bỏ';
      default: return status;
    }
  };

  const handleAddPayment = () => {
    setPaymentForm({
      agentId: '',
      amount: 0,
      type: 'payment',
      description: '',
      method: 'cash',
      reference: '',
      notes: '',
    });
    setOpenPaymentDialog(true);
  };

  const handleSavePayment = () => {
    if (!paymentForm.agentId || paymentForm.amount <= 0) {
      setAlert({ type: 'error', message: 'Vui lòng nhập đầy đủ thông tin' });
      return;
    }

    const newPayment: PaymentRecord = {
      id: Date.now().toString(),
      agentId: paymentForm.agentId,
      amount: paymentForm.amount,
      type: paymentForm.type,
      description: paymentForm.description,
      date: new Date(),
      status: 'completed',
      reference: paymentForm.reference || `PAY${Date.now()}`,
      method: paymentForm.method,
      processedBy: 'admin',
      notes: paymentForm.notes,
    };

    setPayments(prev => [newPayment, ...prev]);
    setAlert({ type: 'success', message: 'Thêm giao dịch thành công' });
    setOpenPaymentDialog(false);
  };

  const handleAdjustCredit = () => {
    setCreditForm({
      agentId: '',
      creditLimit: 0,
      reason: '',
    });
    setOpenCreditDialog(true);
  };

  const handleSaveCreditAdjustment = () => {
    if (!creditForm.agentId || creditForm.creditLimit <= 0) {
      setAlert({ type: 'error', message: 'Vui lòng nhập đầy đủ thông tin' });
      return;
    }

    setCreditProfiles(prev => prev.map(profile => 
      profile.agentId === creditForm.agentId 
        ? { ...profile, creditLimit: creditForm.creditLimit, availableCredit: creditForm.creditLimit - profile.currentDebt }
        : profile
    ));
    setAlert({ type: 'success', message: 'Điều chỉnh hạn mức tín dụng thành công' });
    setOpenCreditDialog(false);
  };

  const creditColumns: GridColDef[] = [
    { field: 'agentId', headerName: 'Mã đại lý', width: 120, flex: 1 },
    { 
      field: 'creditLimit', 
      headerName: 'Hạn mức tín dụng', 
      width: 150, 
      renderCell: (params) => (
        <span className="font-semibold">
          {params.value.toLocaleString('vi-VN')} VNĐ
        </span>
      )
    },
    { 
      field: 'currentDebt', 
      headerName: 'Nợ hiện tại', 
      width: 150, 
      renderCell: (params) => (
        <span className="font-semibold text-red-600">
          {params.value.toLocaleString('vi-VN')} VNĐ
        </span>
      )
    },
    { 
      field: 'availableCredit', 
      headerName: 'Tín dụng khả dụng', 
      width: 150, 
      renderCell: (params) => (
        <span className="font-semibold text-green-600">
          {params.value.toLocaleString('vi-VN')} VNĐ
        </span>
      )
    },
    { 
      field: 'creditScore', 
      headerName: 'Điểm tín dụng', 
      width: 120, 
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <span className="font-semibold">{params.value}</span>
          <LinearProgress 
            variant="determinate" 
            value={params.value} 
            className="w-16"
            color={params.value >= 800 ? 'success' : params.value >= 600 ? 'warning' : 'error'}
          />
        </Box>
      )
    },
    { 
      field: 'riskLevel', 
      headerName: 'Mức rủi ro', 
      width: 120, 
      renderCell: (params) => (
        <Chip 
          label={getRiskText(params.value)} 
          color={getRiskColor(params.value)} 
          size="small" 
        />
      )
    },
    { 
      field: 'lastAssessment', 
      headerName: 'Đánh giá cuối', 
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
          {params.value.toLocaleString('vi-VN')} VNĐ
        </span>
      )
    },
    { 
      field: 'type', 
      headerName: 'Loại', 
      width: 120, 
      renderCell: (params) => getPaymentTypeText(params.value)
    },
    { field: 'description', headerName: 'Mô tả', width: 200, flex: 2 },
    { 
      field: 'method', 
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
          label={getStatusText(params.value)} 
          color={getStatusColor(params.value)} 
          size="small" 
        />
      )
    },
    { 
      field: 'date', 
      headerName: 'Ngày', 
      width: 120, 
      renderCell: (params) => dayjs(params.value).format('DD/MM/YYYY')
    },
  ];

  const stats = {
    totalCreditLimit: creditProfiles.reduce((sum, p) => sum + p.creditLimit, 0),
    totalDebt: creditProfiles.reduce((sum, p) => sum + p.currentDebt, 0),
    availableCredit: creditProfiles.reduce((sum, p) => sum + p.availableCredit, 0),
    highRiskAgents: creditProfiles.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length,
    averageCreditScore: creditProfiles.length > 0 ? 
      Math.round(creditProfiles.reduce((sum, p) => sum + p.creditScore, 0) / creditProfiles.length) : 0,
    activeAlerts: alerts.filter(a => a.status === 'active').length,
    totalPayments: payments.length,
    totalPaymentAmount: payments.reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <Box className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <CreditIcon className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Quản lý tín dụng & công nợ</h1>
              <p className="text-sm sm:text-base text-purple-100">Theo dõi tín dụng và công nợ của đại lý</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="contained"
              startIcon={<PaymentIcon />}
              onClick={handleAddPayment}
              className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-4 py-2 rounded-lg"
            >
              Thêm giao dịch
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleAdjustCredit}
              className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-4 py-2 rounded-lg"
            >
              Điều chỉnh tín dụng
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
                  Tổng hạn mức
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {(stats.totalCreditLimit / 1000000).toFixed(0)}M
                </Typography>
              </div>
              <CreditIcon className="text-blue-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Tín dụng khả dụng
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {(stats.availableCredit / 1000000).toFixed(0)}M
                </Typography>
              </div>
              <CheckIcon className="text-green-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Tổng nợ
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {(stats.totalDebt / 1000000).toFixed(0)}M
                </Typography>
              </div>
              <TrendingDownIcon className="text-yellow-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-error">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Rủi ro cao
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.highRiskAgents}
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
            <Tab label="Hồ sơ tín dụng" />
            <Tab label="Giao dịch" />
            <Tab label="Cảnh báo" />
            <Tab label="Báo cáo" />
          </Tabs>
        </Box>

        {/* Credit Profiles Tab */}
        {tabValue === 0 && (
          <CardContent className="p-0">
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={creditProfiles}
                columns={creditColumns}
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
        {tabValue === 1 && (
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

        {/* Alerts Tab */}
        {tabValue === 2 && (
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Đại lý</TableCell>
                    <TableCell>Loại cảnh báo</TableCell>
                    <TableCell>Mức độ</TableCell>
                    <TableCell>Thông báo</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>{alert.agentId}</TableCell>
                      <TableCell>{getAlertTypeText(alert.alertType)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={alert.severity} 
                          color={getAlertSeverityColor(alert.severity)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{alert.message}</TableCell>
                      <TableCell>
                        <Chip 
                          label={alert.status} 
                          color={alert.status === 'active' ? 'error' : 'success'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{dayjs(alert.createdAt).format('DD/MM/YYYY')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
                      Tổng quan tín dụng
                    </Typography>
                    <Box className="space-y-2">
                      <div className="flex justify-between">
                        <span>Điểm tín dụng TB:</span>
                        <span className="font-semibold">{stats.averageCreditScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tỷ lệ sử dụng:</span>
                        <span className="font-semibold">
                          {((stats.totalDebt / stats.totalCreditLimit) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cảnh báo hoạt động:</span>
                        <span className="font-semibold text-red-600">{stats.activeAlerts}</span>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Giao dịch tháng này
                    </Typography>
                    <Box className="space-y-2">
                      <div className="flex justify-between">
                        <span>Tổng giao dịch:</span>
                        <span className="font-semibold">{stats.totalPayments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tổng số tiền:</span>
                        <span className="font-semibold">
                          {(stats.totalPaymentAmount / 1000000).toFixed(1)}M VNĐ
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

      {/* Add Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Thêm giao dịch mới</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Mã đại lý"
                  value={paymentForm.agentId}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, agentId: e.target.value }))}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Số tiền (VNĐ)"
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Loại giao dịch</InputLabel>
                  <Select
                    value={paymentForm.type}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, type: e.target.value as any }))}
                    label="Loại giao dịch"
                  >
                    <MenuItem value="payment">Thanh toán</MenuItem>
                    <MenuItem value="credit">Tín dụng</MenuItem>
                    <MenuItem value="debit">Ghi nợ</MenuItem>
                    <MenuItem value="refund">Hoàn tiền</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Phương thức</InputLabel>
                  <Select
                    value={paymentForm.method}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, method: e.target.value as any }))}
                    label="Phương thức"
                  >
                    <MenuItem value="cash">Tiền mặt</MenuItem>
                    <MenuItem value="bank_transfer">Chuyển khoản</MenuItem>
                    <MenuItem value="check">Séc</MenuItem>
                    <MenuItem value="other">Khác</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Mã tham chiếu"
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, reference: e.target.value }))}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>Hủy</Button>
          <Button onClick={handleSavePayment} variant="contained">
            Thêm giao dịch
          </Button>
        </DialogActions>
      </Dialog>

      {/* Adjust Credit Dialog */}
      <Dialog open={openCreditDialog} onClose={() => setOpenCreditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Điều chỉnh hạn mức tín dụng</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <TextField
              fullWidth
              label="Mã đại lý"
              value={creditForm.agentId}
              onChange={(e) => setCreditForm(prev => ({ ...prev, agentId: e.target.value }))}
              required
            />
            <TextField
              fullWidth
              label="Hạn mức tín dụng mới (VNĐ)"
              type="number"
              value={creditForm.creditLimit}
              onChange={(e) => setCreditForm(prev => ({ ...prev, creditLimit: Number(e.target.value) }))}
              required
            />
            <TextField
              fullWidth
              label="Lý do điều chỉnh"
              value={creditForm.reason}
              onChange={(e) => setCreditForm(prev => ({ ...prev, reason: e.target.value }))}
              multiline
              rows={3}
              required
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreditDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveCreditAdjustment} variant="contained">
            Điều chỉnh
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreditDebtManagement;
