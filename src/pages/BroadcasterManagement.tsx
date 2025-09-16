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
  Radio as RadioIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import dayjs from 'dayjs';

interface Broadcaster {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  defaultTicketPrice: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const mockBroadcasters: Broadcaster[] = [
  {
    id: '1',
    code: 'HCM',
    name: 'Xổ số Kiến thiết TP.HCM',
    address: '123 Nguyễn Huệ, Q.1, TP.HCM',
    phone: '028 3822 1234',
    email: 'contact@xskt-hcm.com',
    status: 'active',
    defaultTicketPrice: 10000,
    description: 'Nhà đài chính thức TP.HCM',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    code: 'HN',
    name: 'Xổ số Kiến thiết Hà Nội',
    address: '456 Lê Duẩn, Q.Hai Bà Trưng, Hà Nội',
    phone: '024 3822 5678',
    email: 'contact@xskt-hn.com',
    status: 'active',
    defaultTicketPrice: 10000,
    description: 'Nhà đài chính thức Hà Nội',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    code: 'CT',
    name: 'Xổ số Kiến thiết Cần Thơ',
    address: '789 Nguyễn Văn Cừ, Q.Ninh Kiều, Cần Thơ',
    phone: '0292 3822 9999',
    email: 'contact@xskt-ct.com',
    status: 'active',
    defaultTicketPrice: 10000,
    description: 'Nhà đài chính thức Cần Thơ',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const BroadcasterManagement: React.FC = () => {
  const [broadcasters, setBroadcasters] = useState<Broadcaster[]>(mockBroadcasters);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBroadcaster, setEditingBroadcaster] = useState<Broadcaster | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    status: 'active' as 'active' | 'inactive',
    defaultTicketPrice: 10000,
    description: '',
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedBroadcasters = localStorage.getItem('broadcasters');
    if (savedBroadcasters) {
      setBroadcasters(JSON.parse(savedBroadcasters));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('broadcasters', JSON.stringify(broadcasters));
  }, [broadcasters]);

  const handleAddBroadcaster = () => {
    setEditingBroadcaster(null);
    setFormData({
      code: '',
      name: '',
      address: '',
      phone: '',
      email: '',
      status: 'active',
      defaultTicketPrice: 10000,
      description: '',
    });
    setOpenDialog(true);
  };

  const handleEditBroadcaster = (broadcaster: Broadcaster) => {
    setEditingBroadcaster(broadcaster);
    setFormData({
      code: broadcaster.code,
      name: broadcaster.name,
      address: broadcaster.address,
      phone: broadcaster.phone,
      email: broadcaster.email,
      status: broadcaster.status,
      defaultTicketPrice: broadcaster.defaultTicketPrice,
      description: broadcaster.description || '',
    });
    setOpenDialog(true);
  };

  const handleSaveBroadcaster = () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      setAlert({ type: 'error', message: 'Vui lòng nhập mã và tên nhà đài' });
      return;
    }

    // Check for duplicate code
    const existingBroadcaster = broadcasters.find(b => b.code === formData.code && b.id !== editingBroadcaster?.id);
    if (existingBroadcaster) {
      setAlert({ type: 'error', message: 'Mã nhà đài đã tồn tại' });
      return;
    }

    const broadcasterData: Broadcaster = {
      id: editingBroadcaster?.id || Date.now().toString(),
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      status: formData.status,
      defaultTicketPrice: formData.defaultTicketPrice,
      description: formData.description.trim(),
      createdAt: editingBroadcaster?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (editingBroadcaster) {
      setBroadcasters(prev => prev.map(b => b.id === editingBroadcaster.id ? broadcasterData : b));
      setAlert({ type: 'success', message: 'Cập nhật nhà đài thành công' });
    } else {
      setBroadcasters(prev => [...prev, broadcasterData]);
      setAlert({ type: 'success', message: 'Thêm nhà đài mới thành công' });
    }

    setOpenDialog(false);
    setFormData({
      code: '',
      name: '',
      address: '',
      phone: '',
      email: '',
      status: 'active',
      defaultTicketPrice: 10000,
      description: '',
    });
  };

  const handleDeleteBroadcaster = (id: string) => {
    setBroadcasters(prev => prev.filter(b => b.id !== id));
    setAlert({ type: 'success', message: 'Xóa nhà đài thành công' });
  };


  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'error';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động';
  };

  const columns: GridColDef[] = [
    { field: 'code', headerName: 'Mã nhà đài', width: 120, flex: 1 },
    { field: 'name', headerName: 'Tên nhà đài', width: 200, flex: 2 },
    { field: 'address', headerName: 'Địa chỉ', width: 200, flex: 2 },
    { field: 'phone', headerName: 'Số điện thoại', width: 150, flex: 1 },
    { field: 'email', headerName: 'Email', width: 200, flex: 2 },
    { field: 'defaultTicketPrice', headerName: 'Giá vé mặc định', width: 150, renderCell: (params) => 
      `${params.value.toLocaleString()}đ`
    },
    { field: 'status', headerName: 'Trạng thái', width: 120, renderCell: (params) => (
      <Chip label={getStatusText(params.value)} color={getStatusColor(params.value)} size="small" />
    )},
    { field: 'createdAt', headerName: 'Ngày tạo', width: 120, renderCell: (params) => 
      dayjs(params.value).format('DD/MM/YYYY')
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
          onClick={() => handleEditBroadcaster(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Xóa"
          onClick={() => handleDeleteBroadcaster(params.row.id)}
        />,
      ],
    },
  ];

  const stats = {
    totalBroadcasters: broadcasters.length,
    activeBroadcasters: broadcasters.filter(b => b.status === 'active').length,
    inactiveBroadcasters: broadcasters.filter(b => b.status === 'inactive').length,
    averagePrice: broadcasters.length > 0 ? 
      Math.round(broadcasters.reduce((sum, b) => sum + b.defaultTicketPrice, 0) / broadcasters.length) : 0,
  };

  return (
    <Box className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <RadioIcon className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Quản lý nhà đài</h1>
              <p className="text-sm sm:text-base text-blue-100">Quản lý thông tin nhà đài và giá vé</p>
            </div>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddBroadcaster}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-4 py-2 rounded-lg"
          >
            Thêm nhà đài
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
                  Tổng nhà đài
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.totalBroadcasters}
                </Typography>
              </div>
              <RadioIcon className="text-blue-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Đang hoạt động
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.activeBroadcasters}
                </Typography>
              </div>
              <LocationIcon className="text-green-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-error">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Ngừng hoạt động
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.inactiveBroadcasters}
                </Typography>
              </div>
              <PhoneIcon className="text-red-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Giá vé TB
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.averagePrice.toLocaleString()}đ
                </Typography>
              </div>
              <MoneyIcon className="text-yellow-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="card">
        <div className="card-header">
          <Typography variant="h6" className="font-semibold text-gray-900">
            Danh sách nhà đài
          </Typography>
        </div>
        <CardContent className="p-0">
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={broadcasters}
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
          {editingBroadcaster ? 'Sửa thông tin nhà đài' : 'Thêm nhà đài mới'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="Mã nhà đài"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="VD: HCM, HN, CT"
                required
              />
              <TextField
                fullWidth
                label="Tên nhà đài"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Tên đầy đủ của nhà đài"
                required
              />
            </div>
            <TextField
              fullWidth
              label="Địa chỉ"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Địa chỉ đầy đủ của nhà đài"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="Số điện thoại"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Số điện thoại liên hệ"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email liên hệ"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="Giá vé mặc định"
                type="number"
                value={formData.defaultTicketPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultTicketPrice: Number(e.target.value) }))}
                placeholder="Giá vé mặc định"
              />
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                  label="Trạng thái"
                >
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
                </Select>
              </FormControl>
            </div>
            <TextField
              fullWidth
              label="Mô tả"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Mô tả thêm về nhà đài"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveBroadcaster} variant="contained">
            {editingBroadcaster ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BroadcasterManagement;
