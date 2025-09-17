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
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as ContractIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import dayjs from 'dayjs';

interface AgentContract {
  id: string;
  agentId: string;
  contractNumber: string;
  contractType: 'exclusive' | 'non-exclusive' | 'temporary';
  startDate: Date;
  endDate: Date;
  renewalDate?: Date;
  status: 'active' | 'expired' | 'terminated' | 'pending';
  commissionRate: number;
  creditLimit: number;
  territory: string[];
  minimumSalesTarget: number;
  paymentTerms: number;
  legalRepresentative: string;
  businessLicense: string;
  taxCode: string;
  terms: string;
  specialConditions?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

const mockContracts: AgentContract[] = [
  {
    id: '1',
    agentId: '1',
    contractNumber: 'HD001/2024',
    contractType: 'exclusive',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    status: 'active',
    commissionRate: 15,
    creditLimit: 50000000,
    territory: ['2', '7'],
    minimumSalesTarget: 100000000,
    paymentTerms: 30,
    legalRepresentative: 'Nguyễn Văn A',
    businessLicense: '0123456789',
    taxCode: '0123456789',
    terms: 'Hợp đồng độc quyền bán vé số khu vực TP.HCM và BR-VT',
    specialConditions: 'Ưu tiên cung cấp vé số mới',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    lastModifiedBy: 'admin',
  },
  {
    id: '2',
    agentId: '2',
    contractNumber: 'HD002/2024',
    contractType: 'non-exclusive',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-11-30'),
    status: 'active',
    commissionRate: 10,
    creditLimit: 30000000,
    territory: ['1', '3'],
    minimumSalesTarget: 50000000,
    paymentTerms: 15,
    legalRepresentative: 'Trần Thị B',
    businessLicense: '0987654321',
    taxCode: '0987654321',
    terms: 'Hợp đồng không độc quyền bán vé số khu vực Hà Nội và Đà Nẵng',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    createdBy: 'admin',
    lastModifiedBy: 'admin',
  },
];

const ContractManagement: React.FC = () => {
  const [contracts, setContracts] = useState<AgentContract[]>(mockContracts);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContract, setEditingContract] = useState<AgentContract | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState({
    agentId: '',
    contractNumber: '',
    contractType: 'exclusive' as 'exclusive' | 'non-exclusive' | 'temporary',
    startDate: '',
    endDate: '',
    commissionRate: 15,
    creditLimit: 0,
    territory: [] as string[],
    minimumSalesTarget: 0,
    paymentTerms: 30,
    legalRepresentative: '',
    businessLicense: '',
    taxCode: '',
    terms: '',
    specialConditions: '',
  });

  // Load data from localStorage
  useEffect(() => {
    const savedContracts = localStorage.getItem('contracts');
    if (savedContracts) {
      setContracts(JSON.parse(savedContracts));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('contracts', JSON.stringify(contracts));
  }, [contracts]);

  const handleAddContract = () => {
    setEditingContract(null);
    setFormData({
      agentId: '',
      contractNumber: '',
      contractType: 'exclusive',
      startDate: '',
      endDate: '',
      commissionRate: 15,
      creditLimit: 0,
      territory: [],
      minimumSalesTarget: 0,
      paymentTerms: 30,
      legalRepresentative: '',
      businessLicense: '',
      taxCode: '',
      terms: '',
      specialConditions: '',
    });
    setOpenDialog(true);
  };

  const handleEditContract = (contract: AgentContract) => {
    setEditingContract(contract);
    setFormData({
      agentId: contract.agentId,
      contractNumber: contract.contractNumber,
      contractType: contract.contractType,
      startDate: dayjs(contract.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(contract.endDate).format('YYYY-MM-DD'),
      commissionRate: contract.commissionRate,
      creditLimit: contract.creditLimit,
      territory: contract.territory,
      minimumSalesTarget: contract.minimumSalesTarget,
      paymentTerms: contract.paymentTerms,
      legalRepresentative: contract.legalRepresentative,
      businessLicense: contract.businessLicense,
      taxCode: contract.taxCode,
      terms: contract.terms,
      specialConditions: contract.specialConditions || '',
    });
    setOpenDialog(true);
  };

  const handleSaveContract = () => {
    if (!formData.contractNumber.trim() || !formData.agentId.trim()) {
      setAlert({ type: 'error', message: 'Vui lòng nhập đầy đủ thông tin bắt buộc' });
      return;
    }

    const contractData: AgentContract = {
      id: editingContract?.id || Date.now().toString(),
      agentId: formData.agentId,
      contractNumber: formData.contractNumber.trim(),
      contractType: formData.contractType,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      status: 'active',
      commissionRate: formData.commissionRate,
      creditLimit: formData.creditLimit,
      territory: formData.territory,
      minimumSalesTarget: formData.minimumSalesTarget,
      paymentTerms: formData.paymentTerms,
      legalRepresentative: formData.legalRepresentative.trim(),
      businessLicense: formData.businessLicense.trim(),
      taxCode: formData.taxCode.trim(),
      terms: formData.terms.trim(),
      specialConditions: formData.specialConditions.trim(),
      createdAt: editingContract?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: 'admin',
      lastModifiedBy: 'admin',
    };

    if (editingContract) {
      setContracts(prev => prev.map(c => c.id === editingContract.id ? contractData : c));
      setAlert({ type: 'success', message: 'Cập nhật hợp đồng thành công' });
    } else {
      setContracts(prev => [...prev, contractData]);
      setAlert({ type: 'success', message: 'Thêm hợp đồng mới thành công' });
    }

    setOpenDialog(false);
  };

  const handleDeleteContract = (id: string) => {
    setContracts(prev => prev.filter(c => c.id !== id));
    setAlert({ type: 'success', message: 'Xóa hợp đồng thành công' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'expired': return 'error';
      case 'terminated': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'expired': return 'Hết hạn';
      case 'terminated': return 'Chấm dứt';
      case 'pending': return 'Chờ duyệt';
      default: return status;
    }
  };

  const getContractTypeText = (type: string) => {
    switch (type) {
      case 'exclusive': return 'Độc quyền';
      case 'non-exclusive': return 'Không độc quyền';
      case 'temporary': return 'Tạm thời';
      default: return type;
    }
  };

  const isExpiringSoon = (endDate: Date) => {
    const daysUntilExpiry = dayjs(endDate).diff(dayjs(), 'days');
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (endDate: Date) => {
    return dayjs(endDate).isBefore(dayjs());
  };

  const columns: GridColDef[] = [
    { field: 'contractNumber', headerName: 'Số hợp đồng', width: 150, flex: 1 },
    { field: 'agentId', headerName: 'Mã đại lý', width: 120, flex: 1 },
    { 
      field: 'contractType', 
      headerName: 'Loại', 
      width: 120, 
      renderCell: (params) => getContractTypeText(params.value)
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
      renderCell: (params) => {
        const isExp = isExpired(params.value);
        const isExpSoon = isExpiringSoon(params.value);
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <span>{dayjs(params.value).format('DD/MM/YYYY')}</span>
            {isExp && <WarningIcon color="error" fontSize="small" />}
            {isExpSoon && <ScheduleIcon color="warning" fontSize="small" />}
          </Box>
        );
      }
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
      field: 'commissionRate', 
      headerName: 'Hoa hồng (%)', 
      width: 120, 
      type: 'number'
    },
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
      field: 'actions',
      type: 'actions',
      headerName: 'Thao tác',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Sửa"
          onClick={() => handleEditContract(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Xóa"
          onClick={() => handleDeleteContract(params.row.id)}
        />,
      ],
    },
  ];

  const stats = {
    totalContracts: contracts.length,
    activeContracts: contracts.filter(c => c.status === 'active').length,
    expiringSoon: contracts.filter(c => isExpiringSoon(c.endDate)).length,
    expired: contracts.filter(c => isExpired(c.endDate)).length,
    exclusiveContracts: contracts.filter(c => c.contractType === 'exclusive').length,
    totalCreditLimit: contracts.reduce((sum, c) => sum + c.creditLimit, 0),
    averageCommission: contracts.length > 0 ? 
      Math.round(contracts.reduce((sum, c) => sum + c.commissionRate, 0) / contracts.length) : 0,
  };

  return (
    <Box className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <ContractIcon className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Quản lý hợp đồng</h1>
              <p className="text-sm sm:text-base text-blue-100">Quản lý hợp đồng và thỏa thuận với đại lý</p>
            </div>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddContract}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-4 py-2 rounded-lg"
          >
            Thêm hợp đồng
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
                  Tổng hợp đồng
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.totalContracts}
                </Typography>
              </div>
              <ContractIcon className="text-blue-500 text-2xl sm:text-3xl" />
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
                  {stats.activeContracts}
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
                  Sắp hết hạn
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.expiringSoon}
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
                  Đã hết hạn
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.expired}
                </Typography>
              </div>
              <WarningIcon className="text-red-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="card">
        <div className="card-header">
          <Typography variant="h6" className="font-semibold text-gray-900">
            Danh sách hợp đồng
          </Typography>
        </div>
        <CardContent className="p-0">
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={contracts}
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingContract ? 'Sửa thông tin hợp đồng' : 'Thêm hợp đồng mới'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Số hợp đồng"
                  value={formData.contractNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, contractNumber: e.target.value }))}
                  placeholder="VD: HD001/2024"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Mã đại lý"
                  value={formData.agentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, agentId: e.target.value }))}
                  placeholder="Mã đại lý"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Loại hợp đồng</InputLabel>
                  <Select
                    value={formData.contractType}
                    onChange={(e) => setFormData(prev => ({ ...prev, contractType: e.target.value as 'exclusive' | 'non-exclusive' | 'temporary' }))}
                    label="Loại hợp đồng"
                  >
                    <MenuItem value="exclusive">Độc quyền</MenuItem>
                    <MenuItem value="non-exclusive">Không độc quyền</MenuItem>
                    <MenuItem value="temporary">Tạm thời</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Người đại diện pháp luật"
                  value={formData.legalRepresentative}
                  onChange={(e) => setFormData(prev => ({ ...prev, legalRepresentative: e.target.value }))}
                  placeholder="Tên người đại diện"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Ngày bắt đầu"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Ngày kết thúc"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Tỷ lệ hoa hồng (%)"
                  type="number"
                  value={formData.commissionRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, commissionRate: Number(e.target.value) }))}
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Hạn mức tín dụng (VNĐ)"
                  type="number"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: Number(e.target.value) }))}
                  placeholder="0"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Mục tiêu doanh số tối thiểu (VNĐ)"
                  type="number"
                  value={formData.minimumSalesTarget}
                  onChange={(e) => setFormData(prev => ({ ...prev, minimumSalesTarget: Number(e.target.value) }))}
                  placeholder="0"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Điều khoản thanh toán (ngày)"
                  type="number"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: Number(e.target.value) }))}
                  placeholder="30"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Giấy phép kinh doanh"
                  value={formData.businessLicense}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessLicense: e.target.value }))}
                  placeholder="Số giấy phép"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Mã số thuế"
                  value={formData.taxCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, taxCode: e.target.value }))}
                  placeholder="Mã số thuế"
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Điều khoản hợp đồng"
                  multiline
                  rows={3}
                  value={formData.terms}
                  onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                  placeholder="Mô tả điều khoản chính của hợp đồng"
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Điều khoản đặc biệt"
                  multiline
                  rows={2}
                  value={formData.specialConditions}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialConditions: e.target.value }))}
                  placeholder="Các điều khoản đặc biệt (nếu có)"
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveContract} variant="contained">
            {editingContract ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContractManagement;
