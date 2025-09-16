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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  Radio as RadioIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import dayjs from 'dayjs';

interface Price {
  id: string;
  broadcasterId: string;
  broadcasterName: string;
  ticketType: 'traditional' | 'scratch' | 'online';
  buyPrice: number; // Giá mua vào
  sellPrice: number; // Giá bán ra
  profit: number; // Lợi nhuận
  profitMargin: number; // Tỷ lệ lợi nhuận (%)
  effectiveDate: Date; // Ngày áp dụng
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data cho broadcasters (sẽ được load từ localStorage)
const mockBroadcasters = [
  { id: '1', name: 'Xổ số Kiến thiết TP.HCM', code: 'HCM' },
  { id: '2', name: 'Xổ số Kiến thiết Hà Nội', code: 'HN' },
  { id: '3', name: 'Xổ số Kiến thiết Cần Thơ', code: 'CT' },
];

const mockPrices: Price[] = [
  {
    id: '1',
    broadcasterId: '1',
    broadcasterName: 'Xổ số Kiến thiết TP.HCM',
    ticketType: 'traditional',
    buyPrice: 8000,
    sellPrice: 10000,
    profit: 2000,
    profitMargin: 25,
    effectiveDate: new Date('2024-01-01'),
    status: 'active',
    notes: 'Giá vé truyền thống HCM',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    broadcasterId: '1',
    broadcasterName: 'Xổ số Kiến thiết TP.HCM',
    ticketType: 'scratch',
    buyPrice: 5000,
    sellPrice: 10000,
    profit: 5000,
    profitMargin: 100,
    effectiveDate: new Date('2024-01-01'),
    status: 'active',
    notes: 'Giá vé cào HCM',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    broadcasterId: '2',
    broadcasterName: 'Xổ số Kiến thiết Hà Nội',
    ticketType: 'traditional',
    buyPrice: 8000,
    sellPrice: 10000,
    profit: 2000,
    profitMargin: 25,
    effectiveDate: new Date('2024-01-01'),
    status: 'active',
    notes: 'Giá vé truyền thống HN',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const ticketTypes = [
  { value: 'traditional', label: 'Vé truyền thống' },
  { value: 'scratch', label: 'Vé số cào' },
  { value: 'online', label: 'Vé online' },
];

const PriceManagement: React.FC = () => {
  const [prices, setPrices] = useState<Price[]>(mockPrices);
  const [broadcasters, setBroadcasters] = useState(mockBroadcasters);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPrice, setEditingPrice] = useState<Price | null>(null);
  const [formData, setFormData] = useState({
    broadcasterId: '',
    ticketType: 'traditional' as 'traditional' | 'scratch' | 'online',
    buyPrice: 0,
    sellPrice: 0,
    effectiveDate: dayjs().format('YYYY-MM-DD'),
    status: 'active' as 'active' | 'inactive',
    notes: '',
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedPrices = localStorage.getItem('prices');
    const savedBroadcasters = localStorage.getItem('broadcasters');
    
    if (savedPrices) {
      setPrices(JSON.parse(savedPrices));
    }
    if (savedBroadcasters) {
      const broadcasterData = JSON.parse(savedBroadcasters);
      setBroadcasters(broadcasterData.map((b: any) => ({ id: b.id, name: b.name, code: b.code })));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('prices', JSON.stringify(prices));
  }, [prices]);

  const calculateProfit = (buyPrice: number, sellPrice: number) => {
    return sellPrice - buyPrice;
  };

  const calculateProfitMargin = (buyPrice: number, sellPrice: number) => {
    if (buyPrice === 0) return 0;
    return Math.round(((sellPrice - buyPrice) / buyPrice) * 100);
  };

  const handleAddPrice = () => {
    setEditingPrice(null);
    setFormData({
      broadcasterId: '',
      ticketType: 'traditional',
      buyPrice: 0,
      sellPrice: 0,
      effectiveDate: dayjs().format('YYYY-MM-DD'),
      status: 'active',
      notes: '',
    });
    setOpenDialog(true);
  };

  const handleEditPrice = (price: Price) => {
    setEditingPrice(price);
    setFormData({
      broadcasterId: price.broadcasterId,
      ticketType: price.ticketType,
      buyPrice: price.buyPrice,
      sellPrice: price.sellPrice,
      effectiveDate: dayjs(price.effectiveDate).format('YYYY-MM-DD'),
      status: price.status,
      notes: price.notes || '',
    });
    setOpenDialog(true);
  };

  const handleSavePrice = () => {
    if (!formData.broadcasterId || formData.buyPrice <= 0 || formData.sellPrice <= 0) {
      setAlert({ type: 'error', message: 'Vui lòng nhập đầy đủ thông tin và giá trị hợp lệ' });
      return;
    }

    if (formData.sellPrice <= formData.buyPrice) {
      setAlert({ type: 'error', message: 'Giá bán phải lớn hơn giá mua' });
      return;
    }

    const selectedBroadcaster = broadcasters.find(b => b.id === formData.broadcasterId);
    if (!selectedBroadcaster) {
      setAlert({ type: 'error', message: 'Nhà đài không tồn tại' });
      return;
    }

    const profit = calculateProfit(formData.buyPrice, formData.sellPrice);
    const profitMargin = calculateProfitMargin(formData.buyPrice, formData.sellPrice);

    const priceData: Price = {
      id: editingPrice?.id || Date.now().toString(),
      broadcasterId: formData.broadcasterId,
      broadcasterName: selectedBroadcaster.name,
      ticketType: formData.ticketType,
      buyPrice: formData.buyPrice,
      sellPrice: formData.sellPrice,
      profit,
      profitMargin,
      effectiveDate: new Date(formData.effectiveDate),
      status: formData.status,
      notes: formData.notes.trim(),
      createdAt: editingPrice?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (editingPrice) {
      setPrices(prev => prev.map(p => p.id === editingPrice.id ? priceData : p));
      setAlert({ type: 'success', message: 'Cập nhật giá vé thành công' });
    } else {
      setPrices(prev => [...prev, priceData]);
      setAlert({ type: 'success', message: 'Thêm giá vé mới thành công' });
    }

    setOpenDialog(false);
    setFormData({
      broadcasterId: '',
      ticketType: 'traditional',
      buyPrice: 0,
      sellPrice: 0,
      effectiveDate: dayjs().format('YYYY-MM-DD'),
      status: 'active',
      notes: '',
    });
  };

  const handleDeletePrice = (id: string) => {
    setPrices(prev => prev.filter(p => p.id !== id));
    setAlert({ type: 'success', message: 'Xóa giá vé thành công' });
  };

  const handlePriceChange = (field: 'buyPrice' | 'sellPrice', value: number) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'buyPrice' && newData.sellPrice > 0) {
        // Auto calculate profit when buy price changes
        // const profit = calculateProfit(value, newData.sellPrice);
        // const profitMargin = calculateProfitMargin(value, newData.sellPrice);
        // You could show these in the UI if needed
      }
      return newData;
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'error';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động';
  };

  const getTicketTypeText = (type: string) => {
    const ticketType = ticketTypes.find(t => t.value === type);
    return ticketType ? ticketType.label : type;
  };

  const getProfitIcon = (profitMargin: number) => {
    if (profitMargin > 30) return <TrendingUpIcon className="text-green-500" />;
    if (profitMargin < 15) return <TrendingDownIcon className="text-red-500" />;
    return <span className="text-blue-500">=</span>;
  };

  const columns: GridColDef[] = [
    { field: 'broadcasterName', headerName: 'Nhà đài', width: 200, flex: 2 },
    { field: 'ticketType', headerName: 'Loại vé', width: 120, renderCell: (params) => getTicketTypeText(params.value) },
    { field: 'buyPrice', headerName: 'Giá mua', width: 120, renderCell: (params) => `${params.value.toLocaleString()}đ` },
    { field: 'sellPrice', headerName: 'Giá bán', width: 120, renderCell: (params) => `${params.value.toLocaleString()}đ` },
    { field: 'profit', headerName: 'Lợi nhuận', width: 120, renderCell: (params) => `${params.value.toLocaleString()}đ` },
    { field: 'profitMargin', headerName: 'Tỷ lệ LN', width: 120, renderCell: (params) => (
      <div className="flex items-center space-x-1">
        <span>{params.value}%</span>
        {getProfitIcon(params.value)}
      </div>
    )},
    { field: 'effectiveDate', headerName: 'Ngày áp dụng', width: 120, renderCell: (params) => 
      dayjs(params.value).format('DD/MM/YYYY')
    },
    { field: 'status', headerName: 'Trạng thái', width: 120, renderCell: (params) => (
      <Chip label={getStatusText(params.value)} color={getStatusColor(params.value)} size="small" />
    )},
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Thao tác',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Sửa"
          onClick={() => handleEditPrice(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Xóa"
          onClick={() => handleDeletePrice(params.row.id)}
        />,
      ],
    },
  ];

  const stats = {
    totalPrices: prices.length,
    activePrices: prices.filter(p => p.status === 'active').length,
    averageProfit: prices.length > 0 ? 
      Math.round(prices.reduce((sum, p) => sum + p.profit, 0) / prices.length) : 0,
    averageProfitMargin: prices.length > 0 ? 
      Math.round(prices.reduce((sum, p) => sum + p.profitMargin, 0) / prices.length) : 0,
    highProfitPrices: prices.filter(p => p.profitMargin > 30).length,
  };

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
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Quản lý giá vé</h1>
              <p className="text-sm sm:text-base text-orange-100">Quản lý giá mua, giá bán và lợi nhuận</p>
            </div>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPrice}
            className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-4 py-2 rounded-lg"
          >
            Thêm giá vé
          </Button>
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
                  Tổng giá vé
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.totalPrices}
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
                  Đang áp dụng
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.activePrices}
                </Typography>
              </div>
              <RadioIcon className="text-green-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Lợi nhuận TB
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.averageProfit.toLocaleString()}đ
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
                  Tỷ lệ LN TB
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.averageProfitMargin}%
                </Typography>
              </div>
              <TrendingDownIcon className="text-red-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="card">
        <div className="card-header">
          <Typography variant="h6" className="font-semibold text-gray-900">
            Danh sách giá vé
          </Typography>
        </div>
        <CardContent className="p-0">
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={prices}
              columns={columns}
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
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPrice ? 'Sửa giá vé' : 'Thêm giá vé mới'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel>Nhà đài</InputLabel>
                <Select
                  value={formData.broadcasterId}
                  onChange={(e) => setFormData(prev => ({ ...prev, broadcasterId: e.target.value }))}
                  label="Nhà đài"
                  required
                >
                  {broadcasters.map((broadcaster) => (
                    <MenuItem key={broadcaster.id} value={broadcaster.id}>
                      {broadcaster.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Loại vé</InputLabel>
                <Select
                  value={formData.ticketType}
                  onChange={(e) => setFormData(prev => ({ ...prev, ticketType: e.target.value as any }))}
                  label="Loại vé"
                >
                  {ticketTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="Giá mua vào"
                type="number"
                value={formData.buyPrice}
                onChange={(e) => handlePriceChange('buyPrice', Number(e.target.value))}
                placeholder="Giá mua vào"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                fullWidth
                label="Giá bán ra"
                type="number"
                value={formData.sellPrice}
                onChange={(e) => handlePriceChange('sellPrice', Number(e.target.value))}
                placeholder="Giá bán ra"
                required
                inputProps={{ min: 0 }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="Ngày áp dụng"
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  label="Trạng thái"
                >
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
                </Select>
              </FormControl>
            </div>
            <TextField
              fullWidth
              label="Ghi chú"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Ghi chú về giá vé"
            />
            {/* Profit Preview */}
            {formData.buyPrice > 0 && formData.sellPrice > 0 && (
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <Typography variant="h6" className="mb-2">Xem trước lợi nhuận:</Typography>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Typography variant="body2" className="text-gray-600">Lợi nhuận:</Typography>
                      <Typography variant="h6" className="text-green-600">
                        {calculateProfit(formData.buyPrice, formData.sellPrice).toLocaleString()}đ
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body2" className="text-gray-600">Tỷ lệ lợi nhuận:</Typography>
                      <Typography variant="h6" className="text-blue-600">
                        {calculateProfitMargin(formData.buyPrice, formData.sellPrice)}%
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSavePrice} variant="contained">
            {editingPrice ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PriceManagement;
