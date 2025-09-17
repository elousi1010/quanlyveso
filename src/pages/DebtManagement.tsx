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
  AccountBalance as DebtIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { mockDebts, mockAgents, mockSellers } from '../data/mockData';
import type { Debt } from '../types';
import dayjs from 'dayjs';

const DebtManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [debts, setDebts] = useState(mockDebts);

  const [formData, setFormData] = useState({
    debtorId: '',
    debtorType: 'agent',
    amount: 0,
    type: 'debit',
    description: '',
    dueDate: dayjs().add(30, 'day'),
    status: 'pending',
  });

  const handleOpenDialog = (debt?: Debt) => {
    if (debt) {
      setEditingDebt(debt);
      setFormData({
        debtorId: debt.agentId,
        debtorType: 'agent',
        amount: debt.amount,
        type: debt.type,
        description: debt.description,
        dueDate: dayjs(debt.dueDate),
        status: debt.status,
      });
    } else {
      setEditingDebt(null);
      setFormData({
        debtorId: '',
        debtorType: 'agent',
        amount: 0,
        type: 'debit',
        description: '',
        dueDate: dayjs().add(30, 'day'),
        status: 'pending',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDebt(null);
  };

  const handleSaveDebt = () => {
    if (editingDebt) {
      setDebts(debts.map(d =>
        d.id === editingDebt.id
          ? {
              ...d,
              agentId: formData.debtorId,
              amount: formData.amount,
              type: formData.type as 'debit' | 'credit',
              description: formData.description,
              dueDate: formData.dueDate.toDate(),
              status: formData.status as 'pending' | 'paid' | 'overdue'
            }
          : d
      ));
    } else {
      const newDebt: Debt = {
        id: Date.now().toString(),
        agentId: formData.debtorId,
        amount: formData.amount,
        type: formData.type as 'debit' | 'credit',
        description: formData.description,
        dueDate: formData.dueDate.toDate(),
        status: formData.status as 'pending' | 'paid' | 'overdue',
        createdAt: new Date(),
      };
      setDebts([...debts, newDebt]);
    }
    handleCloseDialog();
  };

  const handleDeleteDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const columns: GridColDef[] = [
    { 
      field: 'debtorId', 
      headerName: 'Người nợ', 
      width: 200,
      renderCell: (params) => {
        const debtor = formData.debtorType === 'agent' 
          ? mockAgents.find(a => a.id === params.value)
          : mockSellers.find(s => s.id === params.value);
        return debtor?.name || params.value;
      }
    },
    { 
      field: 'type', 
      headerName: 'Loại', 
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value === 'debit' ? 'Nợ' : 'Có'}
          color={params.value === 'debit' ? 'error' : 'success'}
          size="small"
        />
      )
    },
    { 
      field: 'amount', 
      headerName: 'Số tiền', 
      width: 150,
      renderCell: (params) => (
        <span className={`font-semibold ${params.row.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
          {params.value.toLocaleString('vi-VN')} VNĐ
        </span>
      )
    },
    { 
      field: 'status', 
      headerName: 'Trạng thái', 
      width: 120,
      renderCell: (params) => {
        const statusConfig = {
          pending: { label: 'Chờ thanh toán', color: 'warning' as const, icon: <WarningIcon /> },
          paid: { label: 'Đã thanh toán', color: 'success' as const, icon: <CheckCircleIcon /> },
          overdue: { label: 'Quá hạn', color: 'error' as const, icon: <WarningIcon /> },
        };
        const config = statusConfig[params.value as keyof typeof statusConfig];
        return (
          <Chip 
            label={config.label}
            color={config.color}
            size="small"
            icon={config.icon}
          />
        );
      }
    },
    { 
      field: 'dueDate', 
      headerName: 'Hạn thanh toán', 
      width: 150,
      renderCell: (params) => dayjs(params.value).format('DD/MM/YYYY')
    },
    { field: 'description', headerName: 'Mô tả', width: 200 },
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
          onClick={() => handleDeleteDebt(params.row.id)}
        />,
      ],
    },
  ];

  const totalDebt = debts.filter(d => d.type === 'debit').reduce((sum, d) => sum + d.amount, 0);
  const totalCredit = debts.filter(d => d.type === 'credit').reduce((sum, d) => sum + d.amount, 0);
  const overdueDebts = debts.filter(d => d.status === 'overdue').length;
  const pendingDebts = debts.filter(d => d.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 mt-2">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-red-100 to-red-50 rounded-xl shadow-sm">
                <DebtIcon className="text-red-600 text-xl sm:text-2xl" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Quản lý công nợ
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Theo dõi và quản lý các khoản nợ và tín dụng</p>
              </div>
            </div>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 sm:px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Thêm công nợ mới
            </Button>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="stat-card-error">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng nợ</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 truncate">
                  {totalDebt.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-full flex-shrink-0 ml-2">
                <TrendingUpIcon className="text-red-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="stat-card-success">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng tín dụng</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 truncate">
                  {totalCredit.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0 ml-2">
                <CheckCircleIcon className="text-green-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="stat-card-warning">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Quá hạn</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600">{overdueDebts}</p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-100 rounded-full flex-shrink-0 ml-2">
                <WarningIcon className="text-orange-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Chờ thanh toán</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">{pendingDebts}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0 ml-2">
                <span className="text-blue-600 text-lg sm:text-xl lg:text-2xl font-bold">⏳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Danh sách công nợ</h3>
            <p className="text-gray-600 text-sm mt-1">
              Quản lý chi tiết các khoản nợ và tín dụng
            </p>
          </div>
          <div className="p-6">
            <DataGrid
              rows={debts}
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
          {editingDebt ? 'Sửa công nợ' : 'Thêm công nợ mới'}
        </DialogTitle>
        <DialogContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth>
              <InputLabel>Loại người nợ</InputLabel>
              <Select
                value={formData.debtorType}
                label="Loại người nợ"
                onChange={(e) => setFormData({ ...formData, debtorType: e.target.value })}
              >
                <MenuItem value="agent">Đại lý</MenuItem>
                <MenuItem value="seller">Người bán</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Người nợ</InputLabel>
              <Select
                value={formData.debtorId}
                label="Người nợ"
                onChange={(e) => setFormData({ ...formData, debtorId: e.target.value })}
              >
                {(formData.debtorType === 'agent' ? mockAgents : mockSellers).map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Số tiền"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            />
            <FormControl fullWidth>
              <InputLabel>Loại</InputLabel>
              <Select
                value={formData.type}
                label="Loại"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="debit">Nợ</MenuItem>
                <MenuItem value="credit">Tín dụng</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              label="Hạn thanh toán"
              value={formData.dueDate}
              onChange={(newValue) => newValue && setFormData({ ...formData, dueDate: newValue })}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                label="Trạng thái"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="pending">Chờ thanh toán</MenuItem>
                <MenuItem value="paid">Đã thanh toán</MenuItem>
                <MenuItem value="overdue">Quá hạn</MenuItem>
              </Select>
            </FormControl>
          </div>
          <TextField
            fullWidth
            label="Mô tả"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            onClick={handleSaveDebt} 
            variant="contained"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            {editingDebt ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DebtManagement;