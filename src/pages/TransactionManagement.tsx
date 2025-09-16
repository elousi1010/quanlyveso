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
  Receipt as TransactionIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { mockTransactions, mockAgents, mockSellers } from '../data/mockData';
import type { Transaction } from '../types';
import dayjs from 'dayjs';

const TransactionManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState(mockTransactions);

  const [formData, setFormData] = useState({
    type: 'sale',
    agentId: '',
    sellerId: '',
    totalAmount: 0,
    unitPrice: 0,
    quantity: 1,
    transactionDate: dayjs(),
    description: '',
  });

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        type: transaction.type,
        agentId: transaction.agentId,
        sellerId: '',
        totalAmount: transaction.totalAmount,
        unitPrice: transaction.unitPrice,
        quantity: transaction.quantity,
        transactionDate: dayjs(transaction.createdAt),
        description: transaction.notes || '',
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        type: 'sale',
        agentId: '',
        sellerId: '',
        totalAmount: 0,
        unitPrice: 0,
        quantity: 1,
        transactionDate: dayjs(),
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTransaction(null);
  };

  const handleSaveTransaction = () => {
    if (editingTransaction) {
      setTransactions(transactions.map(t =>
        t.id === editingTransaction.id
          ? {
              ...t,
              type: formData.type as 'sale' | 'purchase' | 'return' | 'exchange',
              agentId: formData.agentId,
              quantity: formData.quantity,
              unitPrice: formData.unitPrice,
              totalAmount: formData.totalAmount,
              notes: formData.description
            }
          : t
      ));
    } else {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: formData.type as 'sale' | 'purchase' | 'return' | 'exchange',
        agentId: formData.agentId,
        provinceId: '',
        quantity: formData.quantity,
        unitPrice: formData.unitPrice,
        totalAmount: formData.totalAmount,
        status: 'completed',
        notes: formData.description,
        createdAt: new Date(),
      };
      setTransactions([...transactions, newTransaction]);
    }
    handleCloseDialog();
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const columns: GridColDef[] = [
    { 
      field: 'type', 
      headerName: 'Loại', 
      width: 120,
      renderCell: (params) => {
        const typeConfig = {
          sale: { label: 'Bán', color: 'success' as const },
          purchase: { label: 'Mua', color: 'primary' as const },
          return: { label: 'Trả lại', color: 'warning' as const },
          exchange: { label: 'Trao đổi', color: 'info' as const },
        };
        const config = typeConfig[params.value as keyof typeof typeConfig];
        return (
          <Chip 
            label={config.label}
            color={config.color}
            size="small"
          />
        );
      }
    },
    { 
      field: 'agentId', 
      headerName: 'Đại lý', 
      width: 150,
      renderCell: (params) => {
        const agent = mockAgents.find(a => a.id === params.value);
        return agent?.name || params.value;
      }
    },
    { 
      field: 'sellerId', 
      headerName: 'Người bán', 
      width: 150,
      renderCell: (params) => {
        if (!params.value) return '-';
        const seller = mockSellers.find(s => s.id === params.value);
        return seller?.name || params.value;
      }
    },
    { 
      field: 'totalAmount', 
      headerName: 'Tổng tiền', 
      width: 150,
      renderCell: (params) => (
        <span className="font-semibold text-green-600">
          {params.value.toLocaleString('vi-VN')} VNĐ
        </span>
      )
    },
    { 
      field: 'quantity', 
      headerName: 'Số lượng', 
      width: 100,
      type: 'number'
    },
    { 
      field: 'transactionDate', 
      headerName: 'Ngày giao dịch', 
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
          onClick={() => handleDeleteTransaction(params.row.id)}
        />,
      ],
    },
  ];

  const totalTransactions = transactions.length;
  const totalRevenue = transactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.totalAmount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.totalAmount, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TransactionIcon className="text-indigo-600 text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý giao dịch</h1>
                <p className="text-gray-600">Theo dõi và quản lý tất cả các giao dịch tài chính</p>
              </div>
            </div>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg"
            >
              Thêm giao dịch mới
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
                <p className="text-sm font-medium text-gray-600">Tổng giao dịch</p>
                <p className="text-3xl font-bold text-gray-900">{totalTransactions}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <TransactionIcon className="text-indigo-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                <p className="text-3xl font-bold text-green-600">
                  {totalRevenue.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUpIcon className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng chi phí</p>
                <p className="text-3xl font-bold text-red-600">
                  {totalExpenses.toLocaleString('vi-VN')} VNĐ
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
                <p className="text-sm font-medium text-gray-600">Lợi nhuận ròng</p>
                <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netProfit.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <CheckCircleIcon className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Danh sách giao dịch</h3>
            <p className="text-gray-600 text-sm mt-1">
              Quản lý chi tiết tất cả các giao dịch tài chính
            </p>
          </div>
          <div className="p-6">
            <DataGrid
              rows={transactions}
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
          {editingTransaction ? 'Sửa giao dịch' : 'Thêm giao dịch mới'}
        </DialogTitle>
        <DialogContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth>
              <InputLabel>Loại giao dịch</InputLabel>
              <Select
                value={formData.type}
                label="Loại giao dịch"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="sale">Bán</MenuItem>
                <MenuItem value="purchase">Mua</MenuItem>
                <MenuItem value="return">Trả lại</MenuItem>
                <MenuItem value="exchange">Trao đổi</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Đại lý</InputLabel>
              <Select
                value={formData.agentId}
                label="Đại lý"
                onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
              >
                {mockAgents.map(agent => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth>
              <InputLabel>Người bán</InputLabel>
              <Select
                value={formData.sellerId}
                label="Người bán"
                onChange={(e) => setFormData({ ...formData, sellerId: e.target.value })}
              >
                <MenuItem value="">Không có</MenuItem>
                {mockSellers.map(seller => (
                  <MenuItem key={seller.id} value={seller.id}>
                    {seller.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Số lượng"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Tổng tiền"
              type="number"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
            />
            <TextField
              fullWidth
              label="Đơn giá"
              type="number"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
            />
          </div>
          <DatePicker
            label="Ngày giao dịch"
            value={formData.transactionDate}
            onChange={(newValue) => newValue && setFormData({ ...formData, transactionDate: newValue })}
            slotProps={{ textField: { fullWidth: true } }}
          />
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
            onClick={handleSaveTransaction} 
            variant="contained"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            {editingTransaction ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TransactionManagement;