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
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import dayjs from 'dayjs';

interface Agent {
  id: string;
  code: string;
  name: string;
  type: 'level1' | 'level2' | 'level3' | 'retail';
  address: string;
  phone: string;
  email: string;
  commissionRate: number; // Tỷ lệ hoa hồng (%)
  status: 'active' | 'inactive';
  contactPerson: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const mockAgents: Agent[] = [
  {
    id: '1',
    code: 'AG001',
    name: 'Đại lý cấp 1 HCM',
    type: 'level1',
    address: '123 Nguyễn Huệ, Q.1, TP.HCM',
    phone: '0901 234 567',
    email: 'agent1@example.com',
    commissionRate: 15,
    status: 'active',
    contactPerson: 'Nguyễn Văn A',
    description: 'Đại lý chính thức cấp 1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    code: 'AG002',
    name: 'Đại lý cấp 2 Quận 7',
    type: 'level2',
    address: '456 Nguyễn Thị Thập, Q.7, TP.HCM',
    phone: '0902 345 678',
    email: 'agent2@example.com',
    commissionRate: 10,
    status: 'active',
    contactPerson: 'Trần Thị B',
    description: 'Đại lý cấp 2 khu vực Q.7',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    code: 'AG003',
    name: 'Đại lý bán lẻ Bình Thạnh',
    type: 'retail',
    address: '789 Xô Viết Nghệ Tĩnh, Q.Bình Thạnh, TP.HCM',
    phone: '0903 456 789',
    email: 'agent3@example.com',
    commissionRate: 5,
    status: 'active',
    contactPerson: 'Lê Văn C',
    description: 'Đại lý bán lẻ khu vực Bình Thạnh',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const agentTypes = [
  { value: 'level1', label: 'Cấp 1', commissionRate: 15 },
  { value: 'level2', label: 'Cấp 2', commissionRate: 10 },
  { value: 'level3', label: 'Cấp 3', commissionRate: 8 },
  { value: 'retail', label: 'Bán lẻ', commissionRate: 5 },
];

const AgentManagement: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'level1' as 'level1' | 'level2' | 'level3' | 'retail',
    address: '',
    phone: '',
    email: '',
    commissionRate: 15,
    status: 'active' as 'active' | 'inactive',
    contactPerson: '',
    description: '',
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedAgents = localStorage.getItem('agents');
    if (savedAgents) {
      setAgents(JSON.parse(savedAgents));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('agents', JSON.stringify(agents));
  }, [agents]);

  const handleAddAgent = () => {
    setEditingAgent(null);
    setFormData({
      code: '',
      name: '',
      type: 'level1',
      address: '',
      phone: '',
      email: '',
      commissionRate: 15,
      status: 'active',
      contactPerson: '',
      description: '',
    });
    setOpenDialog(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      code: agent.code,
      name: agent.name,
      type: agent.type,
      address: agent.address,
      phone: agent.phone,
      email: agent.email,
      commissionRate: agent.commissionRate,
      status: agent.status,
      contactPerson: agent.contactPerson,
      description: agent.description || '',
    });
    setOpenDialog(true);
  };

  const handleSaveAgent = () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      setAlert({ type: 'error', message: 'Vui lòng nhập mã và tên đại lý' });
      return;
    }

    // Check for duplicate code
    const existingAgent = agents.find(a => a.code === formData.code && a.id !== editingAgent?.id);
    if (existingAgent) {
      setAlert({ type: 'error', message: 'Mã đại lý đã tồn tại' });
      return;
    }

    const agentData: Agent = {
      id: editingAgent?.id || Date.now().toString(),
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      type: formData.type,
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      commissionRate: formData.commissionRate,
      status: formData.status,
      contactPerson: formData.contactPerson.trim(),
      description: formData.description.trim(),
      createdAt: editingAgent?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (editingAgent) {
      setAgents(prev => prev.map(a => a.id === editingAgent.id ? agentData : a));
      setAlert({ type: 'success', message: 'Cập nhật đại lý thành công' });
    } else {
      setAgents(prev => [...prev, agentData]);
      setAlert({ type: 'success', message: 'Thêm đại lý mới thành công' });
    }

    setOpenDialog(false);
    setFormData({
      code: '',
      name: '',
      type: 'level1',
      address: '',
      phone: '',
      email: '',
      commissionRate: 15,
      status: 'active',
      contactPerson: '',
      description: '',
    });
  };

  const handleDeleteAgent = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
    setAlert({ type: 'success', message: 'Xóa đại lý thành công' });
    setAlert({ type: 'success', message: 'Xóa đại lý thành công' });
  };

  const handleTypeChange = (type: string) => {
    const agentType = agentTypes.find(t => t.value === type);
    if (agentType) {
      setFormData(prev => ({ 
        ...prev, 
        type: type as 'level1' | 'level2' | 'level3' | 'retail',
        commissionRate: agentType.commissionRate 
      }));
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'error';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động';
  };

  const columns: GridColDef[] = [
    { field: 'code', headerName: 'Mã đại lý', width: 120, flex: 1 },
    { field: 'name', headerName: 'Tên đại lý', width: 200, flex: 2 },
    { field: 'contactPerson', headerName: 'Người liên hệ', width: 150, flex: 1 },
    { field: 'phone', headerName: 'Số điện thoại', width: 150, flex: 1 },
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
          onClick={() => handleEditAgent(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Xóa"
          onClick={() => handleDeleteAgent(params.row.id)}
        />,
      ],
    },
  ];

  const stats = {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === 'active').length,
    inactiveAgents: agents.filter(a => a.status === 'inactive').length,
    level1Agents: agents.filter(a => a.type === 'level1').length,
    level2Agents: agents.filter(a => a.type === 'level2').length,
    level3Agents: agents.filter(a => a.type === 'level3').length,
    retailAgents: agents.filter(a => a.type === 'retail').length,
    averageCommission: agents.length > 0 ? 
      Math.round(agents.reduce((sum, a) => sum + a.commissionRate, 0) / agents.length) : 0,
  };

  return (
    <Box className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <BusinessIcon className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Quản lý đại lý</h1>
              <p className="text-sm sm:text-base text-green-100">Quản lý thông tin đại lý và tỷ lệ hoa hồng</p>
            </div>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddAgent}
            className="bg-white text-green-600 hover:bg-green-50 font-semibold px-4 py-2 rounded-lg"
          >
            Thêm đại lý
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
                  Tổng đại lý
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.totalAgents}
                </Typography>
              </div>
              <BusinessIcon className="text-blue-500 text-2xl sm:text-3xl" />
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
                  {stats.activeAgents}
                </Typography>
              </div>
              <StarIcon className="text-green-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Cấp 1
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.level1Agents}
                </Typography>
              </div>
              <LocationIcon className="text-yellow-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-error">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Hoa hồng TB
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.averageCommission}%
                </Typography>
              </div>
              <MoneyIcon className="text-red-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="card">
        <div className="card-header">
          <Typography variant="h6" className="font-semibold text-gray-900">
            Danh sách đại lý
          </Typography>
        </div>
        <CardContent className="p-0">
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={agents}
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
          {editingAgent ? 'Sửa thông tin đại lý' : 'Thêm đại lý mới'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="Mã đại lý"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="VD: AG001, AG002"
                required
              />
              <TextField
                fullWidth
                label="Tên đại lý"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Tên đầy đủ của đại lý"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel>Loại đại lý</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  label="Loại đại lý"
                >
                  {agentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label} - {type.commissionRate}%
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Người liên hệ"
                value={formData.contactPerson}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                placeholder="Tên người liên hệ"
              />
            </div>
            <TextField
              fullWidth
              label="Địa chỉ"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Địa chỉ đầy đủ của đại lý"
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
                label="Tỷ lệ hoa hồng (%)"
                type="number"
                value={formData.commissionRate}
                onChange={(e) => setFormData(prev => ({ ...prev, commissionRate: Number(e.target.value) }))}
                placeholder="Tỷ lệ hoa hồng"
                inputProps={{ min: 0, max: 100 }}
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
              placeholder="Mô tả thêm về đại lý"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveAgent} variant="contained">
            {editingAgent ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentManagement;
