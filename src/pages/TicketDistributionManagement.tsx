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
  LocalShipping as ShippingIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
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

interface TicketDistribution {
  id: string;
  agentId: string;
  provinceId: string;
  ticketType: 'regular' | 'special' | 'vip';
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  distributionDate: Date;
  expectedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  trackingNumber?: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DistributionRequest {
  id: string;
  agentId: string;
  provinceId: string;
  ticketType: 'regular' | 'special' | 'vip';
  requestedQuantity: number;
  requestedDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface InventoryLevel {
  id: string;
  provinceId: string;
  ticketType: 'regular' | 'special' | 'vip';
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  distributedQuantity: number;
  lastUpdated: Date;
  reorderLevel: number;
  maxLevel: number;
}

const mockDistributions: TicketDistribution[] = [
  {
    id: '1',
    agentId: '1',
    provinceId: '2',
    ticketType: 'regular',
    quantity: 1000,
    unitPrice: 10000,
    totalAmount: 10000000,
    distributionDate: new Date('2024-01-15'),
    expectedDeliveryDate: new Date('2024-01-16'),
    actualDeliveryDate: new Date('2024-01-16'),
    status: 'delivered',
    trackingNumber: 'TRK001',
    notes: 'Giao hàng đúng hạn',
    createdBy: 'admin',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '2',
    agentId: '2',
    provinceId: '1',
    ticketType: 'special',
    quantity: 500,
    unitPrice: 15000,
    totalAmount: 7500000,
    distributionDate: new Date('2024-01-20'),
    expectedDeliveryDate: new Date('2024-01-21'),
    status: 'shipped',
    trackingNumber: 'TRK002',
    notes: 'Đang vận chuyển',
    createdBy: 'admin',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    agentId: '3',
    provinceId: '3',
    ticketType: 'vip',
    quantity: 200,
    unitPrice: 20000,
    totalAmount: 4000000,
    distributionDate: new Date('2024-01-25'),
    expectedDeliveryDate: new Date('2024-01-26'),
    status: 'pending',
    notes: 'Chờ xử lý',
    createdBy: 'admin',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
];

const mockRequests: DistributionRequest[] = [
  {
    id: '1',
    agentId: '1',
    provinceId: '2',
    ticketType: 'regular',
    requestedQuantity: 1500,
    requestedDate: new Date('2024-01-30'),
    priority: 'high',
    reason: 'Hết vé, cần bổ sung gấp',
    status: 'pending',
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28'),
  },
  {
    id: '2',
    agentId: '2',
    provinceId: '1',
    ticketType: 'special',
    requestedQuantity: 300,
    requestedDate: new Date('2024-02-01'),
    priority: 'medium',
    reason: 'Chuẩn bị cho sự kiện đặc biệt',
    status: 'approved',
    approvedBy: 'admin',
    approvedAt: new Date('2024-01-29'),
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-29'),
  },
];

const mockInventory: InventoryLevel[] = [
  {
    id: '1',
    provinceId: '2',
    ticketType: 'regular',
    totalQuantity: 10000,
    availableQuantity: 7500,
    reservedQuantity: 1000,
    distributedQuantity: 1500,
    lastUpdated: new Date('2024-01-25'),
    reorderLevel: 2000,
    maxLevel: 15000,
  },
  {
    id: '2',
    provinceId: '1',
    ticketType: 'special',
    totalQuantity: 5000,
    availableQuantity: 3000,
    reservedQuantity: 500,
    distributedQuantity: 1500,
    lastUpdated: new Date('2024-01-25'),
    reorderLevel: 1000,
    maxLevel: 8000,
  },
];

const TicketDistributionManagement: React.FC = () => {
  const [distributions, setDistributions] = useState<TicketDistribution[]>(mockDistributions);
  const [requests, setRequests] = useState<DistributionRequest[]>(mockRequests);
  const [inventory] = useState<InventoryLevel[]>(mockInventory);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [editingDistribution, setEditingDistribution] = useState<TicketDistribution | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState({
    agentId: '',
    provinceId: '',
    ticketType: 'regular' as 'regular' | 'special' | 'vip',
    quantity: 0,
    unitPrice: 10000,
    expectedDeliveryDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    trackingNumber: '',
    notes: '',
  });
  const [requestForm, setRequestForm] = useState({
    agentId: '',
    provinceId: '',
    ticketType: 'regular' as 'regular' | 'special' | 'vip',
    requestedQuantity: 0,
    requestedDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    reason: '',
  });

  const getTicketTypeText = (type: string) => {
    switch (type) {
      case 'regular': return 'Thường';
      case 'special': return 'Đặc biệt';
      case 'vip': return 'VIP';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'shipped': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      case 'returned': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'shipped': return 'Đã gửi';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      case 'returned': return 'Đã trả';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'info';
      case 'high': return 'warning';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return 'Thấp';
      case 'medium': return 'Trung bình';
      case 'high': return 'Cao';
      case 'urgent': return 'Khẩn cấp';
      default: return priority;
    }
  };

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'fulfilled': return 'info';
      default: return 'default';
    }
  };

  const getRequestStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      case 'fulfilled': return 'Đã thực hiện';
      default: return status;
    }
  };

  const handleAddDistribution = () => {
    setEditingDistribution(null);
    setFormData({
      agentId: '',
      provinceId: '',
      ticketType: 'regular',
      quantity: 0,
      unitPrice: 10000,
      expectedDeliveryDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      trackingNumber: '',
      notes: '',
    });
    setOpenDialog(true);
  };

  const handleEditDistribution = (distribution: TicketDistribution) => {
    setEditingDistribution(distribution);
    setFormData({
      agentId: distribution.agentId,
      provinceId: distribution.provinceId,
      ticketType: distribution.ticketType,
      quantity: distribution.quantity,
      unitPrice: distribution.unitPrice,
      expectedDeliveryDate: dayjs(distribution.expectedDeliveryDate).format('YYYY-MM-DD'),
      trackingNumber: distribution.trackingNumber || '',
      notes: distribution.notes || '',
    });
    setOpenDialog(true);
  };

  const handleSaveDistribution = () => {
    if (!formData.agentId || !formData.provinceId || formData.quantity <= 0) {
      setAlert({ type: 'error', message: 'Vui lòng nhập đầy đủ thông tin' });
      return;
    }

    const distributionData: TicketDistribution = {
      id: editingDistribution?.id || Date.now().toString(),
      agentId: formData.agentId,
      provinceId: formData.provinceId,
      ticketType: formData.ticketType,
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
      totalAmount: formData.quantity * formData.unitPrice,
      distributionDate: new Date(),
      expectedDeliveryDate: new Date(formData.expectedDeliveryDate),
      status: 'pending',
      trackingNumber: formData.trackingNumber,
      notes: formData.notes,
      createdBy: 'admin',
      createdAt: editingDistribution?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (editingDistribution) {
      setDistributions(prev => prev.map(d => d.id === editingDistribution.id ? distributionData : d));
      setAlert({ type: 'success', message: 'Cập nhật phân phối thành công' });
    } else {
      setDistributions(prev => [distributionData, ...prev]);
      setAlert({ type: 'success', message: 'Thêm phân phối mới thành công' });
    }

    setOpenDialog(false);
  };

  const handleDeleteDistribution = (id: string) => {
    setDistributions(prev => prev.filter(d => d.id !== id));
    setAlert({ type: 'success', message: 'Xóa phân phối thành công' });
  };

  const handleUpdateStatus = (id: string, status: string) => {
    setDistributions(prev => prev.map(d => 
      d.id === id 
        ? { 
            ...d, 
            status: status as any,
            actualDeliveryDate: status === 'delivered' ? new Date() : d.actualDeliveryDate,
            updatedAt: new Date()
          }
        : d
    ));
    setAlert({ type: 'success', message: 'Cập nhật trạng thái thành công' });
  };

  const handleAddRequest = () => {
    setRequestForm({
      agentId: '',
      provinceId: '',
      ticketType: 'regular',
      requestedQuantity: 0,
      requestedDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      priority: 'medium',
      reason: '',
    });
    setOpenRequestDialog(true);
  };

  const handleSaveRequest = () => {
    if (!requestForm.agentId || !requestForm.provinceId || requestForm.requestedQuantity <= 0) {
      setAlert({ type: 'error', message: 'Vui lòng nhập đầy đủ thông tin' });
      return;
    }

    const requestData: DistributionRequest = {
      id: Date.now().toString(),
      agentId: requestForm.agentId,
      provinceId: requestForm.provinceId,
      ticketType: requestForm.ticketType,
      requestedQuantity: requestForm.requestedQuantity,
      requestedDate: new Date(requestForm.requestedDate),
      priority: requestForm.priority,
      reason: requestForm.reason,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setRequests(prev => [requestData, ...prev]);
    setAlert({ type: 'success', message: 'Gửi yêu cầu thành công' });
    setOpenRequestDialog(false);
  };

  const distributionColumns: GridColDef[] = [
    { field: 'id', headerName: 'Mã phân phối', width: 120, flex: 1 },
    { field: 'agentId', headerName: 'Mã đại lý', width: 120, flex: 1 },
    { 
      field: 'provinceId', 
      headerName: 'Tỉnh', 
      width: 120, 
      renderCell: (params) => {
        const provinceMap: Record<string, string> = {
          '1': 'Hà Nội',
          '2': 'TP.HCM',
          '3': 'Đà Nẵng',
        };
        return provinceMap[params.value] || params.value;
      }
    },
    { 
      field: 'ticketType', 
      headerName: 'Loại vé', 
      width: 100, 
      renderCell: (params) => getTicketTypeText(params.value)
    },
    { 
      field: 'quantity', 
      headerName: 'Số lượng', 
      width: 100, 
      type: 'number'
    },
    { 
      field: 'totalAmount', 
      headerName: 'Tổng tiền', 
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
          label={getStatusText(params.value)} 
          color={getStatusColor(params.value)} 
          size="small" 
        />
      )
    },
    { 
      field: 'expectedDeliveryDate', 
      headerName: 'Ngày giao dự kiến', 
      width: 150, 
      renderCell: (params) => dayjs(params.value).format('DD/MM/YYYY')
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Thao tác',
      width: 200,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Sửa"
          onClick={() => handleEditDistribution(params.row)}
        />,
        <GridActionsCellItem
          icon={<ShippingIcon />}
          label="Gửi hàng"
          onClick={() => handleUpdateStatus(params.row.id, 'shipped')}
          disabled={params.row.status !== 'pending'}
        />,
        <GridActionsCellItem
          icon={<CheckCircleIcon />}
          label="Xác nhận giao"
          onClick={() => handleUpdateStatus(params.row.id, 'delivered')}
          disabled={params.row.status !== 'shipped'}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Xóa"
          onClick={() => handleDeleteDistribution(params.row.id)}
        />,
      ],
    },
  ];

  const requestColumns: GridColDef[] = [
    { field: 'id', headerName: 'Mã yêu cầu', width: 120, flex: 1 },
    { field: 'agentId', headerName: 'Mã đại lý', width: 120, flex: 1 },
    { 
      field: 'provinceId', 
      headerName: 'Tỉnh', 
      width: 120, 
      renderCell: (params) => {
        const provinceMap: Record<string, string> = {
          '1': 'Hà Nội',
          '2': 'TP.HCM',
          '3': 'Đà Nẵng',
        };
        return provinceMap[params.value] || params.value;
      }
    },
    { 
      field: 'ticketType', 
      headerName: 'Loại vé', 
      width: 100, 
      renderCell: (params) => getTicketTypeText(params.value)
    },
    { 
      field: 'requestedQuantity', 
      headerName: 'Số lượng yêu cầu', 
      width: 150, 
      type: 'number'
    },
    { 
      field: 'priority', 
      headerName: 'Ưu tiên', 
      width: 100, 
      renderCell: (params) => (
        <Chip 
          label={getPriorityText(params.value)} 
          color={getPriorityColor(params.value)} 
          size="small" 
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Trạng thái', 
      width: 120, 
      renderCell: (params) => (
        <Chip 
          label={getRequestStatusText(params.value)} 
          color={getRequestStatusColor(params.value)} 
          size="small" 
        />
      )
    },
    { 
      field: 'requestedDate', 
      headerName: 'Ngày yêu cầu', 
      width: 120, 
      renderCell: (params) => dayjs(params.value).format('DD/MM/YYYY')
    },
  ];

  const stats = {
    totalDistributions: distributions.length,
    pendingDistributions: distributions.filter(d => d.status === 'pending').length,
    shippedDistributions: distributions.filter(d => d.status === 'shipped').length,
    deliveredDistributions: distributions.filter(d => d.status === 'delivered').length,
    totalValue: distributions.reduce((sum, d) => sum + d.totalAmount, 0),
    totalQuantity: distributions.reduce((sum, d) => sum + d.quantity, 0),
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    approvedRequests: requests.filter(r => r.status === 'approved').length,
    lowInventoryItems: inventory.filter(i => i.availableQuantity <= i.reorderLevel).length,
  };

  // Chart data
  const distributionChartData = distributions.map(d => ({
    date: dayjs(d.distributionDate).format('MM/DD'),
    quantity: d.quantity,
    value: d.totalAmount / 1000000,
  }));

  const inventoryChartData = inventory.map(i => ({
    province: i.provinceId,
    available: i.availableQuantity,
    reserved: i.reservedQuantity,
    distributed: i.distributedQuantity,
  }));

  return (
    <Box className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <ShippingIcon className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Quản lý phân phối vé</h1>
              <p className="text-sm sm:text-base text-cyan-100">Phân phối và vận chuyển vé số đến đại lý</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddDistribution}
              className="bg-white text-cyan-600 hover:bg-cyan-50 font-semibold px-4 py-2 rounded-lg"
            >
              Thêm phân phối
            </Button>
            <Button
              variant="contained"
              startIcon={<ScheduleIcon />}
              onClick={handleAddRequest}
              className="bg-white text-cyan-600 hover:bg-cyan-50 font-semibold px-4 py-2 rounded-lg"
            >
              Yêu cầu vé
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
                  Tổng phân phối
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.totalDistributions}
                </Typography>
              </div>
              <ShippingIcon className="text-blue-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Đã giao
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.deliveredDistributions}
                </Typography>
              </div>
              <CheckCircleIcon className="text-green-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Chờ xử lý
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.pendingDistributions}
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
                  Tồn kho thấp
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.lowInventoryItems}
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
            <Tab label="Phân phối" />
            <Tab label="Yêu cầu" />
            <Tab label="Tồn kho" />
            <Tab label="Báo cáo" />
          </Tabs>
        </Box>

        {/* Distributions Tab */}
        {tabValue === 0 && (
          <CardContent className="p-0">
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={distributions}
                columns={distributionColumns}
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

        {/* Requests Tab */}
        {tabValue === 1 && (
          <CardContent className="p-0">
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={requests}
                columns={requestColumns}
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

        {/* Inventory Tab */}
        {tabValue === 2 && (
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tỉnh</TableCell>
                    <TableCell>Loại vé</TableCell>
                    <TableCell>Tổng</TableCell>
                    <TableCell>Khả dụng</TableCell>
                    <TableCell>Đã đặt</TableCell>
                    <TableCell>Đã phân phối</TableCell>
                    <TableCell>Mức đặt lại</TableCell>
                    <TableCell>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.provinceId === '1' ? 'Hà Nội' : 
                         item.provinceId === '2' ? 'TP.HCM' : 'Đà Nẵng'}
                      </TableCell>
                      <TableCell>{getTicketTypeText(item.ticketType)}</TableCell>
                      <TableCell>{item.totalQuantity.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">
                          {item.availableQuantity.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>{item.reservedQuantity.toLocaleString()}</TableCell>
                      <TableCell>{item.distributedQuantity.toLocaleString()}</TableCell>
                      <TableCell>{item.reorderLevel.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.availableQuantity <= item.reorderLevel ? 'Cần bổ sung' : 'Đủ hàng'} 
                          color={item.availableQuantity <= item.reorderLevel ? 'error' : 'success'} 
                          size="small" 
                        />
                      </TableCell>
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
                      Xu hướng phân phối
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={distributionChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="quantity" stroke="#8884d8" name="Số lượng" />
                        <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Giá trị (M)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tình trạng tồn kho
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={inventoryChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="province" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="available" stackId="a" fill="#82ca9d" name="Khả dụng" />
                        <Bar dataKey="reserved" stackId="a" fill="#ffc658" name="Đã đặt" />
                        <Bar dataKey="distributed" stackId="a" fill="#8884d8" name="Đã phân phối" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tổng quan phân phối
                    </Typography>
                    <Box className="space-y-2">
                      <div className="flex justify-between">
                        <span>Tổng giá trị phân phối:</span>
                        <span className="font-semibold text-blue-600">
                          {(stats.totalValue / 1000000).toFixed(1)}M VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tổng số vé phân phối:</span>
                        <span className="font-semibold">{stats.totalQuantity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tỷ lệ giao hàng thành công:</span>
                        <span className="font-semibold text-green-600">
                          {stats.totalDistributions > 0 ? 
                            ((stats.deliveredDistributions / stats.totalDistributions) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Yêu cầu chờ duyệt:</span>
                        <span className="font-semibold text-yellow-600">{stats.pendingRequests}</span>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}
      </Card>

      {/* Add/Edit Distribution Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingDistribution ? 'Sửa phân phối vé' : 'Thêm phân phối vé mới'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Đại lý</InputLabel>
                  <Select
                    value={formData.agentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, agentId: e.target.value }))}
                    label="Đại lý"
                    required
                  >
                    <MenuItem value="1">Đại lý 1</MenuItem>
                    <MenuItem value="2">Đại lý 2</MenuItem>
                    <MenuItem value="3">Đại lý 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Tỉnh</InputLabel>
                  <Select
                    value={formData.provinceId}
                    onChange={(e) => setFormData(prev => ({ ...prev, provinceId: e.target.value }))}
                    label="Tỉnh"
                    required
                  >
                    <MenuItem value="1">Hà Nội</MenuItem>
                    <MenuItem value="2">TP.HCM</MenuItem>
                    <MenuItem value="3">Đà Nẵng</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Loại vé</InputLabel>
                  <Select
                    value={formData.ticketType}
                    onChange={(e) => setFormData(prev => ({ ...prev, ticketType: e.target.value as any }))}
                    label="Loại vé"
                  >
                    <MenuItem value="regular">Thường</MenuItem>
                    <MenuItem value="special">Đặc biệt</MenuItem>
                    <MenuItem value="vip">VIP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Số lượng"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Đơn giá (VNĐ)"
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: Number(e.target.value) }))}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Ngày giao dự kiến"
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Mã vận đơn"
                  value={formData.trackingNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveDistribution} variant="contained">
            {editingDistribution ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Request Dialog */}
      <Dialog open={openRequestDialog} onClose={() => setOpenRequestDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yêu cầu phân phối vé</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Đại lý</InputLabel>
                  <Select
                    value={requestForm.agentId}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, agentId: e.target.value }))}
                    label="Đại lý"
                    required
                  >
                    <MenuItem value="1">Đại lý 1</MenuItem>
                    <MenuItem value="2">Đại lý 2</MenuItem>
                    <MenuItem value="3">Đại lý 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Tỉnh</InputLabel>
                  <Select
                    value={requestForm.provinceId}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, provinceId: e.target.value }))}
                    label="Tỉnh"
                    required
                  >
                    <MenuItem value="1">Hà Nội</MenuItem>
                    <MenuItem value="2">TP.HCM</MenuItem>
                    <MenuItem value="3">Đà Nẵng</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Loại vé</InputLabel>
                  <Select
                    value={requestForm.ticketType}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, ticketType: e.target.value as any }))}
                    label="Loại vé"
                  >
                    <MenuItem value="regular">Thường</MenuItem>
                    <MenuItem value="special">Đặc biệt</MenuItem>
                    <MenuItem value="vip">VIP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Số lượng yêu cầu"
                  type="number"
                  value={requestForm.requestedQuantity}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, requestedQuantity: Number(e.target.value) }))}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Ngày cần"
                  type="date"
                  value={requestForm.requestedDate}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, requestedDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Ưu tiên</InputLabel>
                  <Select
                    value={requestForm.priority}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, priority: e.target.value as any }))}
                    label="Ưu tiên"
                  >
                    <MenuItem value="low">Thấp</MenuItem>
                    <MenuItem value="medium">Trung bình</MenuItem>
                    <MenuItem value="high">Cao</MenuItem>
                    <MenuItem value="urgent">Khẩn cấp</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Lý do yêu cầu"
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, reason: e.target.value }))}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRequestDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveRequest} variant="contained">
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketDistributionManagement;
