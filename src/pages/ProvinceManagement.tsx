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
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { mockProvinces } from '../data/mockData';
import type { Province } from '../types';

const ProvinceManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProvince, setEditingProvince] = useState<Province | null>(null);
  const [provinces, setProvinces] = useState(mockProvinces);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    price: 0,
    description: '',
  });

  const handleOpenDialog = (province?: Province) => {
    if (province) {
      setEditingProvince(province);
      setFormData({
        name: province.name,
        code: province.code,
        price: province.ticketPrice,
        description: province.commission.toString() || '',
      });
    } else {
      setEditingProvince(null);
      setFormData({
        name: '',
        code: '',
        price: 0,
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProvince(null);
  };

  const handleSaveProvince = () => {
    if (editingProvince) {
      setProvinces(provinces.map(p => 
        p.id === editingProvince.id 
          ? { 
              ...p, 
              name: formData.name,
              code: formData.code,
              ticketPrice: formData.price,
              commission: parseFloat(formData.description) || 0.1,
            }
          : p
      ));
    } else {
      const newProvince: Province = {
        id: Date.now().toString(),
        name: formData.name,
        code: formData.code,
        ticketPrice: formData.price,
        commission: parseFloat(formData.description) || 0.1,
      };
      setProvinces([...provinces, newProvince]);
    }
    handleCloseDialog();
  };

  const handleDeleteProvince = (id: string) => {
    setProvinces(provinces.filter(p => p.id !== id));
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Tên tỉnh', width: 200 },
    { field: 'code', headerName: 'Mã', width: 100 },
    { 
      field: 'ticketPrice', 
      headerName: 'Giá vé', 
      width: 120,
      renderCell: (params) => (
        <span className="font-semibold text-green-600">
          {params.value.toLocaleString('vi-VN')} VNĐ
        </span>
      )
    },
    { 
      field: 'commission', 
      headerName: 'Hoa hồng', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={`${(params.value * 100).toFixed(1)}%`}
          color="primary"
          size="small"
        />
      )
    },
    { field: 'description', headerName: 'Mô tả', width: 300 },
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
          onClick={() => handleDeleteProvince(params.row.id)}
        />,
      ],
    },
  ];

  const totalProvinces = provinces.length;
  const averagePrice = provinces.reduce((sum, p) => sum + p.ticketPrice, 0) / provinces.length;
  const totalCommission = provinces.reduce((sum, p) => sum + p.commission, 0);
  const averageCommission = totalCommission / provinces.length;

  return (
    <div className="min-h-screen bg-gray-50 mt-2">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <LocationIcon className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý tỉnh thành</h1>
                <p className="text-gray-600">Quản lý thông tin tỉnh thành và giá vé</p>
              </div>
            </div>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg"
            >
              Thêm tỉnh mới
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng tỉnh thành</p>
                <p className="text-3xl font-bold text-gray-900">{totalProvinces}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <LocationIcon className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Giá vé trung bình</p>
                <p className="text-3xl font-bold text-green-600">
                  {averagePrice.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-green-600 text-2xl font-bold">₫</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoa hồng trung bình</p>
                <p className="text-3xl font-bold text-purple-600">
                  {(averageCommission * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-purple-600 text-2xl font-bold">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Danh sách tỉnh thành</h3>
            <p className="text-gray-600 text-sm mt-1">
              Quản lý thông tin chi tiết về các tỉnh thành và giá vé
            </p>
          </div>
          <div className="p-6">
            <DataGrid
              rows={provinces}
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
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          className: 'rounded-xl shadow-2xl'
        }}
      >
        <DialogTitle className="text-xl font-semibold text-gray-900 pb-4">
          {editingProvince ? 'Sửa tỉnh thành' : 'Thêm tỉnh mới'}
        </DialogTitle>
        <DialogContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Tên tỉnh"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="Mã tỉnh"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="rounded-lg"
            />
          </div>
          <TextField
            fullWidth
            label="Giá vé"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="rounded-lg"
          />
          <TextField
            fullWidth
            label="Hoa hồng (%)"
            type="number"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="rounded-lg"
            helperText="Nhập phần trăm hoa hồng (ví dụ: 10 cho 10%)"
          />
        </DialogContent>
        <DialogActions className="p-6 pt-4">
          <Button 
            onClick={handleCloseDialog}
            className="text-gray-600 hover:text-gray-800"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSaveProvince} 
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            {editingProvince ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProvinceManagement;