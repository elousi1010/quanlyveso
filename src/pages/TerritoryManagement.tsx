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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Map as MapIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import dayjs from 'dayjs';

interface Territory {
  id: string;
  name: string;
  code: string;
  type: 'province' | 'district' | 'ward' | 'custom';
  parentId?: string;
  area: number;
  population?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AgentTerritory {
  id: string;
  agentId: string;
  territoryId: string;
  territoryType: 'primary' | 'secondary' | 'exclusive' | 'shared';
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  assignedBy: string;
  assignedAt: Date;
  notes?: string;
}

interface TerritoryConflict {
  id: string;
  territoryId: string;
  agentIds: string[];
  conflictType: 'overlap' | 'exclusive_violation' | 'boundary_dispute';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  reportedBy: string;
  reportedAt: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
  resolution?: string;
}

const mockTerritories: Territory[] = [
  {
    id: '1',
    name: 'TP. Hồ Chí Minh',
    code: 'HCM',
    type: 'province',
    area: 2095.5,
    population: 8993000,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Quận 1',
    code: 'Q1',
    type: 'district',
    parentId: '1',
    area: 7.7,
    population: 142000,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Quận 7',
    code: 'Q7',
    type: 'district',
    parentId: '1',
    area: 35.7,
    population: 360000,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'Hà Nội',
    code: 'HN',
    type: 'province',
    area: 3324.5,
    population: 8200000,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const mockAgentTerritories: AgentTerritory[] = [
  {
    id: '1',
    agentId: '1',
    territoryId: '2',
    territoryType: 'exclusive',
    startDate: new Date('2024-01-01'),
    isActive: true,
    assignedBy: 'admin',
    assignedAt: new Date('2024-01-01'),
    notes: 'Đại lý độc quyền Quận 1',
  },
  {
    id: '2',
    agentId: '2',
    territoryId: '3',
    territoryType: 'primary',
    startDate: new Date('2024-01-01'),
    isActive: true,
    assignedBy: 'admin',
    assignedAt: new Date('2024-01-01'),
    notes: 'Đại lý chính Quận 7',
  },
  {
    id: '3',
    agentId: '3',
    territoryId: '4',
    territoryType: 'exclusive',
    startDate: new Date('2024-01-01'),
    isActive: true,
    assignedBy: 'admin',
    assignedAt: new Date('2024-01-01'),
    notes: 'Đại lý độc quyền Hà Nội',
  },
];

const mockConflicts: TerritoryConflict[] = [
  {
    id: '1',
    territoryId: '2',
    agentIds: ['1', '4'],
    conflictType: 'overlap',
    description: 'Xung đột khu vực giữa đại lý 1 và 4 tại Quận 1',
    severity: 'medium',
    status: 'open',
    reportedBy: 'admin',
    reportedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    territoryId: '3',
    agentIds: ['2', '5'],
    conflictType: 'exclusive_violation',
    description: 'Đại lý 5 vi phạm quyền độc quyền của đại lý 2',
    severity: 'high',
    status: 'investigating',
    reportedBy: 'admin',
    reportedAt: new Date('2024-01-20'),
  },
];

const TerritoryManagement: React.FC = () => {
  const [territories, setTerritories] = useState<Territory[]>(mockTerritories);
  const [agentTerritories, setAgentTerritories] = useState<AgentTerritory[]>(mockAgentTerritories);
  const [conflicts] = useState<TerritoryConflict[]>(mockConflicts);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTerritory, setEditingTerritory] = useState<Territory | null>(null);
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'province' as 'province' | 'district' | 'ward' | 'custom',
    parentId: '',
    area: 0,
    population: 0,
    isActive: true,
  });
  const [assignmentForm, setAssignmentForm] = useState({
    agentId: '',
    territoryId: '',
    territoryType: 'primary' as 'primary' | 'secondary' | 'exclusive' | 'shared',
    startDate: '',
    endDate: '',
    notes: '',
  });

  const getTypeText = (type: string) => {
    switch (type) {
      case 'province': return 'Tỉnh/Thành phố';
      case 'district': return 'Quận/Huyện';
      case 'ward': return 'Phường/Xã';
      case 'custom': return 'Tùy chỉnh';
      default: return type;
    }
  };

  const getTerritoryTypeText = (type: string) => {
    switch (type) {
      case 'primary': return 'Chính';
      case 'secondary': return 'Phụ';
      case 'exclusive': return 'Độc quyền';
      case 'shared': return 'Chia sẻ';
      default: return type;
    }
  };

  const getConflictTypeText = (type: string) => {
    switch (type) {
      case 'overlap': return 'Chồng lấn';
      case 'exclusive_violation': return 'Vi phạm độc quyền';
      case 'boundary_dispute': return 'Tranh chấp ranh giới';
      default: return type;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'error';
      case 'investigating': return 'warning';
      case 'resolved': return 'success';
      case 'dismissed': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Mở';
      case 'investigating': return 'Đang điều tra';
      case 'resolved': return 'Đã giải quyết';
      case 'dismissed': return 'Bỏ qua';
      default: return status;
    }
  };

  const handleAddTerritory = () => {
    setEditingTerritory(null);
    setFormData({
      name: '',
      code: '',
      type: 'province',
      parentId: '',
      area: 0,
      population: 0,
      isActive: true,
    });
    setOpenDialog(true);
  };

  const handleEditTerritory = (territory: Territory) => {
    setEditingTerritory(territory);
    setFormData({
      name: territory.name,
      code: territory.code,
      type: territory.type,
      parentId: territory.parentId || '',
      area: territory.area,
      population: territory.population || 0,
      isActive: territory.isActive,
    });
    setOpenDialog(true);
  };

  const handleSaveTerritory = () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      setAlert({ type: 'error', message: 'Vui lòng nhập đầy đủ thông tin bắt buộc' });
      return;
    }

    const territoryData: Territory = {
      id: editingTerritory?.id || Date.now().toString(),
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      type: formData.type,
      parentId: formData.parentId || undefined,
      area: formData.area,
      population: formData.population || undefined,
      isActive: formData.isActive,
      createdAt: editingTerritory?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (editingTerritory) {
      setTerritories(prev => prev.map(t => t.id === editingTerritory.id ? territoryData : t));
      setAlert({ type: 'success', message: 'Cập nhật khu vực thành công' });
    } else {
      setTerritories(prev => [...prev, territoryData]);
      setAlert({ type: 'success', message: 'Thêm khu vực mới thành công' });
    }

    setOpenDialog(false);
  };

  const handleDeleteTerritory = (id: string) => {
    setTerritories(prev => prev.filter(t => t.id !== id));
    setAlert({ type: 'success', message: 'Xóa khu vực thành công' });
  };

  const handleAddAssignment = () => {
    setAssignmentForm({
      agentId: '',
      territoryId: '',
      territoryType: 'primary',
      startDate: dayjs().format('YYYY-MM-DD'),
      endDate: '',
      notes: '',
    });
    setOpenAssignmentDialog(true);
  };

  const handleSaveAssignment = () => {
    if (!assignmentForm.agentId || !assignmentForm.territoryId) {
      setAlert({ type: 'error', message: 'Vui lòng chọn đại lý và khu vực' });
      return;
    }

    const assignmentData: AgentTerritory = {
      id: Date.now().toString(),
      agentId: assignmentForm.agentId,
      territoryId: assignmentForm.territoryId,
      territoryType: assignmentForm.territoryType,
      startDate: new Date(assignmentForm.startDate),
      endDate: assignmentForm.endDate ? new Date(assignmentForm.endDate) : undefined,
      isActive: true,
      assignedBy: 'admin',
      assignedAt: new Date(),
      notes: assignmentForm.notes,
    };

    setAgentTerritories(prev => [...prev, assignmentData]);
    setAlert({ type: 'success', message: 'Phân công khu vực thành công' });
    setOpenAssignmentDialog(false);
  };

  const territoryColumns: GridColDef[] = [
    { field: 'code', headerName: 'Mã', width: 100, flex: 1 },
    { field: 'name', headerName: 'Tên khu vực', width: 200, flex: 2 },
    { 
      field: 'type', 
      headerName: 'Loại', 
      width: 120, 
      renderCell: (params) => getTypeText(params.value)
    },
    { 
      field: 'area', 
      headerName: 'Diện tích (km²)', 
      width: 120, 
      type: 'number',
      renderCell: (params) => params.value.toLocaleString()
    },
    { 
      field: 'population', 
      headerName: 'Dân số', 
      width: 120, 
      renderCell: (params) => params.value ? params.value.toLocaleString() : '-'
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
          onClick={() => handleEditTerritory(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Xóa"
          onClick={() => handleDeleteTerritory(params.row.id)}
        />,
      ],
    },
  ];

  const assignmentColumns: GridColDef[] = [
    { field: 'agentId', headerName: 'Mã đại lý', width: 120, flex: 1 },
    { 
      field: 'territoryId', 
      headerName: 'Khu vực', 
      width: 150, 
      renderCell: (params) => {
        const territory = territories.find(t => t.id === params.value);
        return territory?.name || params.value;
      }
    },
    { 
      field: 'territoryType', 
      headerName: 'Loại phân công', 
      width: 120, 
      renderCell: (params) => (
        <Chip 
          label={getTerritoryTypeText(params.value)} 
          color={params.value === 'exclusive' ? 'success' : 'info'} 
          size="small" 
        />
      )
    },
    { 
      field: 'startDate', 
      headerName: 'Ngày bắt đầu', 
      width: 120, 
      renderCell: (params) => dayjs(params.value).format('DD/MM/YYYY')
    },
    { 
      field: 'endDate', 
      headerName: 'Ngày kết thúc', 
      width: 120, 
      renderCell: (params) => params.value ? dayjs(params.value).format('DD/MM/YYYY') : '-'
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
  ];

  const stats = {
    totalTerritories: territories.length,
    activeTerritories: territories.filter(t => t.isActive).length,
    totalAssignments: agentTerritories.length,
    activeAssignments: agentTerritories.filter(a => a.isActive).length,
    exclusiveAssignments: agentTerritories.filter(a => a.territoryType === 'exclusive').length,
    openConflicts: conflicts.filter(c => c.status === 'open').length,
    highSeverityConflicts: conflicts.filter(c => c.severity === 'high' || c.severity === 'critical').length,
    totalArea: territories.reduce((sum, t) => sum + t.area, 0),
    totalPopulation: territories.reduce((sum, t) => sum + (t.population || 0), 0),
  };

  return (
    <Box className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <MapIcon className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Quản lý khu vực</h1>
              <p className="text-sm sm:text-base text-teal-100">Phân vùng và quản lý khu vực hoạt động đại lý</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTerritory}
              className="bg-white text-teal-600 hover:bg-teal-50 font-semibold px-4 py-2 rounded-lg"
            >
              Thêm khu vực
            </Button>
            <Button
              variant="contained"
              startIcon={<AssignmentIcon />}
              onClick={handleAddAssignment}
              className="bg-white text-teal-600 hover:bg-teal-50 font-semibold px-4 py-2 rounded-lg"
            >
              Phân công
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
                  Tổng khu vực
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.totalTerritories}
                </Typography>
              </div>
              <MapIcon className="text-blue-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Phân công hoạt động
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.activeAssignments}
                </Typography>
              </div>
              <AssignmentIcon className="text-green-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Xung đột mở
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.openConflicts}
                </Typography>
              </div>
              <WarningIcon className="text-yellow-500 text-2xl sm:text-3xl" />
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
                  {stats.highSeverityConflicts}
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
            <Tab label="Khu vực" />
            <Tab label="Phân công" />
            <Tab label="Xung đột" />
            <Tab label="Thống kê" />
          </Tabs>
        </Box>

        {/* Territories Tab */}
        {tabValue === 0 && (
          <CardContent className="p-0">
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={territories}
                columns={territoryColumns}
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

        {/* Assignments Tab */}
        {tabValue === 1 && (
          <CardContent className="p-0">
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={agentTerritories}
                columns={assignmentColumns}
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

        {/* Conflicts Tab */}
        {tabValue === 2 && (
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Khu vực</TableCell>
                    <TableCell>Đại lý liên quan</TableCell>
                    <TableCell>Loại xung đột</TableCell>
                    <TableCell>Mức độ</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ngày báo cáo</TableCell>
                    <TableCell>Mô tả</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {conflicts.map((conflict) => (
                    <TableRow key={conflict.id}>
                      <TableCell>
                        {territories.find(t => t.id === conflict.territoryId)?.name || conflict.territoryId}
                      </TableCell>
                      <TableCell>{conflict.agentIds.join(', ')}</TableCell>
                      <TableCell>{getConflictTypeText(conflict.conflictType)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={conflict.severity} 
                          color={getSeverityColor(conflict.severity)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusText(conflict.status)} 
                          color={getStatusColor(conflict.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{dayjs(conflict.reportedAt).format('DD/MM/YYYY')}</TableCell>
                      <TableCell>{conflict.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        )}

        {/* Statistics Tab */}
        {tabValue === 3 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tổng quan khu vực
                    </Typography>
                    <Box className="space-y-2">
                      <div className="flex justify-between">
                        <span>Tổng diện tích:</span>
                        <span className="font-semibold">{stats.totalArea.toLocaleString()} km²</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tổng dân số:</span>
                        <span className="font-semibold">{stats.totalPopulation.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Khu vực hoạt động:</span>
                        <span className="font-semibold text-green-600">{stats.activeTerritories}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phân công độc quyền:</span>
                        <span className="font-semibold text-blue-600">{stats.exclusiveAssignments}</span>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tình trạng xung đột
                    </Typography>
                    <Box className="space-y-2">
                      <div className="flex justify-between">
                        <span>Xung đột mở:</span>
                        <span className="font-semibold text-red-600">{stats.openConflicts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rủi ro cao:</span>
                        <span className="font-semibold text-red-600">{stats.highSeverityConflicts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Đang điều tra:</span>
                        <span className="font-semibold text-yellow-600">
                          {conflicts.filter(c => c.status === 'investigating').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Đã giải quyết:</span>
                        <span className="font-semibold text-green-600">
                          {conflicts.filter(c => c.status === 'resolved').length}
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

      {/* Add/Edit Territory Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTerritory ? 'Sửa thông tin khu vực' : 'Thêm khu vực mới'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Tên khu vực"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Mã khu vực"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Loại khu vực</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    label="Loại khu vực"
                  >
                    <MenuItem value="province">Tỉnh/Thành phố</MenuItem>
                    <MenuItem value="district">Quận/Huyện</MenuItem>
                    <MenuItem value="ward">Phường/Xã</MenuItem>
                    <MenuItem value="custom">Tùy chỉnh</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Khu vực cha</InputLabel>
                  <Select
                    value={formData.parentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                    label="Khu vực cha"
                  >
                    <MenuItem value="">Không có</MenuItem>
                    {territories.map(t => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Diện tích (km²)"
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: Number(e.target.value) }))}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Dân số"
                  type="number"
                  value={formData.population}
                  onChange={(e) => setFormData(prev => ({ ...prev, population: Number(e.target.value) }))}
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
                  label="Khu vực hoạt động"
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveTerritory} variant="contained">
            {editingTerritory ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={openAssignmentDialog} onClose={() => setOpenAssignmentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Phân công khu vực cho đại lý</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Đại lý</InputLabel>
                  <Select
                    value={assignmentForm.agentId}
                    onChange={(e) => setAssignmentForm(prev => ({ ...prev, agentId: e.target.value }))}
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
                  <InputLabel>Khu vực</InputLabel>
                  <Select
                    value={assignmentForm.territoryId}
                    onChange={(e) => setAssignmentForm(prev => ({ ...prev, territoryId: e.target.value }))}
                    label="Khu vực"
                    required
                  >
                    {territories.map(t => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Loại phân công</InputLabel>
                  <Select
                    value={assignmentForm.territoryType}
                    onChange={(e) => setAssignmentForm(prev => ({ ...prev, territoryType: e.target.value as any }))}
                    label="Loại phân công"
                  >
                    <MenuItem value="primary">Chính</MenuItem>
                    <MenuItem value="secondary">Phụ</MenuItem>
                    <MenuItem value="exclusive">Độc quyền</MenuItem>
                    <MenuItem value="shared">Chia sẻ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Ngày bắt đầu"
                  type="date"
                  value={assignmentForm.startDate}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, startDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Ngày kết thúc"
                  type="date"
                  value={assignmentForm.endDate}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  value={assignmentForm.notes}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, notes: e.target.value }))}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignmentDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveAssignment} variant="contained">
            Phân công
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TerritoryManagement;
