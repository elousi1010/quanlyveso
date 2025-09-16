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
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { mockSellers } from '../data/mockData';
import type { Seller } from '../types';

const SellerManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [sellers, setSellers] = useState(mockSellers);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    averageTicketsPerDay: 0,
    debt: 0,
    status: 'active',
  });

  const handleOpenDialog = (seller?: Seller) => {
    if (seller) {
      setEditingSeller(seller);
      setFormData({
        name: seller.name,
        phone: seller.phone,
        address: '',
        averageTicketsPerDay: seller.averageTicketsPerDay,
        debt: seller.totalDebt,
        status: seller.isActive ? 'active' : 'inactive',
      });
    } else {
      setEditingSeller(null);
      setFormData({
        name: '',
        phone: '',
        address: '',
        averageTicketsPerDay: 0,
        debt: 0,
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSeller(null);
  };

  const handleSaveSeller = () => {
    if (editingSeller) {
      setSellers(sellers.map(s =>
        s.id === editingSeller.id
          ? { ...s, ...formData, status: formData.status as 'active' | 'inactive' }
          : s
      ));
    } else {
      const newSeller: Seller = {
        id: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        agentId: '',
        averageTicketsPerDay: formData.averageTicketsPerDay,
        totalDebt: formData.debt,
        isActive: formData.status === 'active',
        createdAt: new Date(),
      };
      setSellers([...sellers, newSeller]);
    }
    handleCloseDialog();
  };

  const handleDeleteSeller = (id: string) => {
    setSellers(sellers.filter(s => s.id !== id));
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Tên người bán', width: 200 },
    { field: 'phone', headerName: 'Số điện thoại', width: 150 },
    { field: 'address', headerName: 'Địa chỉ', width: 250 },
    { 
      field: 'averageTicketsPerDay', 
      headerName: 'Vé TB/ngày', 
      width: 120,
      renderCell: (params) => (
        <span className="font-semibold text-blue-600">
          {params.value} vé
        </span>
      )
    },
    { 
      field: 'totalDebt', 
      headerName: 'Công nợ', 
      width: 150,
      renderCell: (params) => (
        <span className={`font-semibold ${params.value > 0 ? 'text-red-600' : 'text-green-600'}`}>
          {params.value.toLocaleString('vi-VN')} VNĐ
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
          onClick={() => handleDeleteSeller(params.row.id)}
        />,
      ],
    },
  ];

  const totalSellers = sellers.length;
  const activeSellers = sellers.filter(s => s.isActive).length;
  const totalDebt = sellers.reduce((sum, s) => sum + s.totalDebt, 0);
  const averageTickets = sellers.reduce((sum, s) => sum + s.averageTicketsPerDay, 0) / sellers.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <PersonIcon className="text-green-600 text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý người bán</h1>
                <p className="text-gray-600">Quản lý thông tin người bán vé dạo</p>
              </div>
            </div>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg"
            >
              Thêm người bán mới
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng người bán</p>
                <p className="text-3xl font-bold text-gray-900">{totalSellers}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <PersonIcon className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-3xl font-bold text-green-600">{activeSellers}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUpIcon className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng công nợ</p>
                <p className="text-3xl font-bold text-red-600">
                  {totalDebt.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AccountBalanceIcon className="text-red-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vé TB/ngày</p>
                <p className="text-3xl font-bold text-purple-600">
                  {Math.round(averageTickets)} vé
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <LocationIcon className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Danh sách người bán</h3>
            <p className="text-gray-600 text-sm mt-1">
              Quản lý thông tin chi tiết về người bán vé dạo
            </p>
          </div>
          <div className="p-6">
            <DataGrid
              rows={sellers}
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
          {editingSeller ? 'Sửa người bán' : 'Thêm người bán mới'}
        </DialogTitle>
        <DialogContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Tên người bán"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              label="Vé trung bình/ngày"
              type="number"
              value={formData.averageTicketsPerDay}
              onChange={(e) => setFormData({ ...formData, averageTicketsPerDay: Number(e.target.value) })}
            />
            <TextField
              fullWidth
              label="Công nợ"
              type="number"
              value={formData.debt}
              onChange={(e) => setFormData({ ...formData, debt: Number(e.target.value) })}
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
            onClick={handleSaveSeller} 
            variant="contained"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            {editingSeller ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SellerManagement;