import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Handshake as HandshakeIcon,
} from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { mockPartners } from '../data/mockData';
import type { Partner } from '../types/partner';
import dayjs from 'dayjs';

const PartnerManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [partners, setPartners] = useState(mockPartners);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    currentDebt: 0,
    contractStartDate: new Date(),
    status: 'active',
  });

  const handleOpenDialog = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name,
        contactPerson: partner.contactPerson,
        phone: partner.phone,
        email: partner.email,
        address: partner.address,
        currentDebt: partner.currentDebt,
        contractStartDate: partner.contractStartDate,
        status: partner.isActive ? 'active' : 'inactive',
      });
    } else {
      setEditingPartner(null);
      setFormData({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        currentDebt: 0,
        contractStartDate: new Date(),
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPartner(null);
  };

  const handleSavePartner = () => {
    if (editingPartner) {
      setPartners(partners.map(p =>
        p.id === editingPartner.id
          ? { ...p, ...formData, status: formData.status as 'active' | 'inactive' }
          : p
      ));
    } else {
      const newPartner: Partner = {
        id: Date.now().toString(),
        name: formData.name,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        currentDebt: formData.currentDebt,
        contractStartDate: formData.contractStartDate,
        isActive: formData.status === 'active',
        type: 'agent',
        provinces: [],
        commission: 0.1,
        creditLimit: 1000000,
      };
      setPartners([...partners, newPartner]);
    }
    handleCloseDialog();
  };

  const handleDeletePartner = (id: string) => {
    setPartners(partners.filter(p => p.id !== id));
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Tên đối tác', width: 200, flex: 1 },
    { field: 'contactPerson', headerName: 'Người liên hệ', width: 150 },
    { field: 'phone', headerName: 'Số điện thoại', width: 150 },
    { field: 'address', headerName: 'Địa chỉ', width: 200, flex: 1 },
    { 
      field: 'currentDebt', 
      headerName: 'Công nợ hiện tại', 
      width: 150,
      renderCell: (params) => (
        <span className={`font-semibold ${params.value > 0 ? 'text-red-600' : 'text-green-600'}`}>
          {params.value.toLocaleString('vi-VN')} VNĐ
        </span>
      )
    },
    { 
      field: 'debtDate', 
      headerName: 'Ngày nợ', 
      width: 120,
      renderCell: (params) => {
        // Tạo ngày nợ giả lập (7 ngày trước ngày ký hợp đồng)
        const debtDate = dayjs(params.row.contractStartDate).subtract(7, 'days');
        return (
          <span className="text-sm text-gray-600">
            {debtDate.format('DD/MM/YYYY')}
          </span>
        );
      }
    },
    { 
      field: 'paymentDueDate', 
      headerName: 'Ngày hẹn trả nợ', 
      width: 140,
      renderCell: (params) => {
        // Tạo ngày hẹn trả nợ giả lập (30 ngày sau ngày ký hợp đồng)
        const dueDate = dayjs(params.row.contractStartDate).add(30, 'days');
        const isOverdue = dayjs().isAfter(dueDate);
        return (
          <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-blue-600'}`}>
            {dueDate.format('DD/MM/YYYY')}
            {isOverdue && <span className="ml-1 text-xs">(Quá hạn)</span>}
          </span>
        );
      }
    },
    { 
      field: 'contractStartDate', 
      headerName: 'Ngày ký hợp đồng', 
      width: 150,
      renderCell: (params) => (
        <span className="text-sm text-gray-600">
          {dayjs(params.value).format('DD/MM/YYYY')}
        </span>
      )
    },
    { 
      field: 'isActive', 
      headerName: 'Trạng thái', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Hoạt động' : 'Ngừng hoạt động'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Thao tác',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Sửa"
          onClick={() => handleOpenDialog(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Xóa"
          onClick={() => handleDeletePartner(params.row.id)}
        />,
      ],
    },
  ];

  const totalPartners = partners.length;
  const activePartners = partners.filter(p => p.isActive).length;
  const totalDebt = partners.reduce((sum, p) => sum + p.currentDebt, 0);
  const averageDebt = totalDebt / partners.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl shadow-sm">
                <BusinessIcon className="text-amber-600 text-xl sm:text-2xl" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Quản lý đối tác
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Quản lý thông tin các đại lý đối tác</p>
              </div>
            </div>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 sm:px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Thêm đối tác mới
            </Button>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng đối tác</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalPartners}</p>
              </div>
              <div className="p-2 sm:p-3 bg-amber-100 rounded-full flex-shrink-0 ml-2">
                <BusinessIcon className="text-amber-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="stat-card-success">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{activePartners}</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0 ml-2">
                <TrendingUpIcon className="text-green-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="stat-card-error">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng công nợ</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 truncate">
                  {totalDebt.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-full flex-shrink-0 ml-2">
                <AccountBalanceIcon className="text-red-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="stat-card-warning">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Công nợ TB</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 truncate">
                  {Math.round(averageDebt).toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-100 rounded-full flex-shrink-0 ml-2">
                <HandshakeIcon className="text-orange-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Danh sách đối tác</h3>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">
              Quản lý thông tin chi tiết về các đại lý đối tác
            </p>
          </div>
          <div className="p-6">
            <DataGrid
              rows={partners}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              disableRowSelectionOnClick
              sx={{ 
                height: 400,
                border: 'none',
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f3f4f6',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f9fafb',
                  borderBottom: '2px solid #e5e7eb',
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          className: 'rounded-xl shadow-2xl'
        }}
      >
        <DialogTitle className="text-xl font-semibold text-gray-900 pb-4">
          {editingPartner ? 'Sửa đối tác' : 'Thêm đối tác mới'}
        </DialogTitle>
        <DialogContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Tên đối tác"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Người liên hệ"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Số điện thoại"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <TextField
            fullWidth
            label="Địa chỉ"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Công nợ hiện tại"
              type="number"
              value={formData.currentDebt}
              onChange={(e) => setFormData({ ...formData, currentDebt: Number(e.target.value) })}
            />
            <DatePicker
              label="Ngày ký hợp đồng"
              value={dayjs(formData.contractStartDate)}
              onChange={(newValue) => newValue && setFormData({ ...formData, contractStartDate: newValue.toDate() })}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </div>
        </DialogContent>
        <DialogActions className="p-6 pt-4">
          <Button 
            onClick={handleCloseDialog}
            className="text-gray-600 hover:text-gray-800"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSavePartner} 
            variant="contained"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            {editingPartner ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PartnerManagement;