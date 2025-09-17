import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  AdminPanelSettings as AdminIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { mockEmployees } from '../data/mockData';
import type { Employee } from '../types/employee';

const EmployeeManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState(mockEmployees);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'employee',
    position: '',
    salary: 0,
    hireDate: new Date(),
    status: 'active',
  });

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone,
        role: 'employee',
        position: employee.position || 'cashier',
        salary: employee.salary,
        hireDate: employee.hireDate,
        status: employee.isActive ? 'active' : 'inactive',
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        role: 'employee',
        position: '',
        salary: 0,
        hireDate: new Date(),
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEmployee(null);
  };

  const handleSaveEmployee = () => {
    if (editingEmployee) {
      setEmployees(employees.map(e =>
        e.id === editingEmployee.id
          ? { 
              ...e, 
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              position: formData.position as 'cashier' | 'manager' | 'supervisor',
              salary: formData.salary,
              hireDate: formData.hireDate,
              isActive: formData.status === 'active'
            }
          : e
      ));
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position as 'cashier' | 'manager' | 'supervisor',
        salary: formData.salary,
        hireDate: formData.hireDate,
        isActive: formData.status === 'active',
        commission: 0.1,
      };
      setEmployees([...employees, newEmployee]);
    }
    handleCloseDialog();
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  const columns: GridColDef[] = [
    { field: 'fullName', headerName: 'Họ tên', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Số điện thoại', width: 150 },
    { 
      field: 'role', 
      headerName: 'Vai trò', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value === 'owner' ? 'Chủ' : 'Nhân viên'}
          color={params.value === 'owner' ? 'error' : 'primary'}
          size="small"
          icon={params.value === 'owner' ? <AdminIcon /> : <WorkIcon />}
        />
      )
    },
    { field: 'position', headerName: 'Chức vụ', width: 150 },
    { 
      field: 'salary', 
      headerName: 'Lương', 
      width: 150,
      renderCell: (params) => (
        <span className="font-semibold text-green-600">
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
          onClick={() => handleDeleteEmployee(params.row.id)}
        />,
      ],
    },
  ];

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.isActive).length;
  const owners = employees.filter(e => e.position === 'manager').length;
  const totalSalary = employees.reduce((sum, e) => sum + e.salary, 0);

  return (
    <div className="min-h-screen bg-gray-50 mt-2">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <PersonIcon className="text-teal-600 text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý nhân viên</h1>
                <p className="text-gray-600">Quản lý thông tin nhân viên và phân quyền</p>
              </div>
            </div>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg"
            >
              Thêm nhân viên mới
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
                <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
                <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-full">
                <PersonIcon className="text-teal-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-3xl font-bold text-green-600">{activeEmployees}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <WorkIcon className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chủ sở hữu</p>
                <p className="text-3xl font-bold text-red-600">{owners}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AdminIcon className="text-red-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng lương</p>
                <p className="text-3xl font-bold text-blue-600">
                  {totalSalary.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <PersonAddIcon className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Danh sách nhân viên</h3>
            <p className="text-gray-600 text-sm mt-1">
              Quản lý thông tin chi tiết về nhân viên và quyền hạn
            </p>
          </div>
          <div className="p-6">
            <DataGrid
              rows={employees}
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
          {editingEmployee ? 'Sửa nhân viên' : 'Thêm nhân viên mới'}
        </DialogTitle>
        <DialogContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Họ tên"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Số điện thoại"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={formData.role}
                label="Vai trò"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="owner">Chủ sở hữu</MenuItem>
                <MenuItem value="employee">Nhân viên</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Chức vụ"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
            <TextField
              fullWidth
              label="Lương"
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
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
            onClick={handleSaveEmployee} 
            variant="contained"
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            {editingEmployee ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;