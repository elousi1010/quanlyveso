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
  SwapHoriz as ExchangeIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { mockExchanges, mockAgents, mockTickets } from '../data/mockData';
import type { Exchange } from '../types';
import dayjs from 'dayjs';

const ExchangeManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExchange, setEditingExchange] = useState<Exchange | null>(null);
  const [exchanges, setExchanges] = useState(mockExchanges);

  const [formData, setFormData] = useState({
    fromAgentId: '',
    toAgentId: '',
    ticketId: '',
    quantity: 1,
    exchangeDate: dayjs(),
    status: 'pending',
    notes: '',
  });

  const handleOpenDialog = (exchange?: Exchange) => {
    if (exchange) {
      setEditingExchange(exchange);
      setFormData({
        fromAgentId: exchange.fromAgentId,
        toAgentId: exchange.toAgentId,
        ticketId: '',
        quantity: exchange.quantity,
        exchangeDate: dayjs(exchange.createdAt),
        status: exchange.status,
        notes: exchange.notes || '',
      });
    } else {
      setEditingExchange(null);
      setFormData({
        fromAgentId: '',
        toAgentId: '',
        ticketId: '',
        quantity: 1,
        exchangeDate: dayjs(),
        status: 'pending',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingExchange(null);
  };

  const handleSaveExchange = () => {
    if (editingExchange) {
      setExchanges(exchanges.map(e =>
        e.id === editingExchange.id
          ? {
              ...e,
              ...formData,
              exchangeDate: formData.exchangeDate.toDate(),
              status: formData.status as 'pending' | 'completed' | 'cancelled'
            }
          : e
      ));
    } else {
      const newExchange: Exchange = {
        id: Date.now().toString(),
        fromAgentId: formData.fromAgentId,
        toAgentId: formData.toAgentId,
        provinceId: '',
        quantity: formData.quantity,
        unitPrice: 0,
        totalAmount: 0,
        status: formData.status as 'pending' | 'completed' | 'cancelled',
        notes: formData.notes,
        createdAt: new Date(),
      };
      setExchanges([...exchanges, newExchange]);
    }
    handleCloseDialog();
  };

  const handleDeleteExchange = (id: string) => {
    setExchanges(exchanges.filter(e => e.id !== id));
  };

  const columns: GridColDef[] = [
    { 
      field: 'fromAgentId', 
      headerName: 'Từ đại lý', 
      width: 150,
      renderCell: (params) => {
        const agent = mockAgents.find(a => a.id === params.value);
        return agent?.name || params.value;
      }
    },
    { 
      field: 'toAgentId', 
      headerName: 'Đến đại lý', 
      width: 150,
      renderCell: (params) => {
        const agent = mockAgents.find(a => a.id === params.value);
        return agent?.name || params.value;
      }
    },
    { 
      field: 'ticketId', 
      headerName: 'Mã vé', 
      width: 120,
      renderCell: (params) => {
        const ticket = mockTickets.find(t => t.id === params.value);
        return ticket?.ticketNumber || params.value;
      }
    },
    { 
      field: 'quantity', 
      headerName: 'Số lượng', 
      width: 100,
      type: 'number'
    },
    { 
      field: 'status', 
      headerName: 'Trạng thái', 
      width: 120,
      renderCell: (params) => {
        const statusConfig = {
          pending: { label: 'Chờ xử lý', color: 'warning' as const },
          completed: { label: 'Hoàn thành', color: 'success' as const },
          cancelled: { label: 'Đã hủy', color: 'error' as const },
        };
        const config = statusConfig[params.value as keyof typeof statusConfig];
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
      field: 'exchangeDate', 
      headerName: 'Ngày trao đổi', 
      width: 150,
      renderCell: (params) => dayjs(params.value).format('DD/MM/YYYY')
    },
    { field: 'notes', headerName: 'Ghi chú', width: 200 },
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
          onClick={() => handleDeleteExchange(params.row.id)}
        />,
      ],
    },
  ];

  const totalExchanges = exchanges.length;
  const pendingExchanges = exchanges.filter(e => e.status === 'pending').length;
  const completedExchanges = exchanges.filter(e => e.status === 'completed').length;
  const totalQuantity = exchanges.reduce((sum, e) => sum + e.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ExchangeIcon className="text-purple-600 text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý trao đổi vé</h1>
                <p className="text-gray-600">Quản lý việc trao đổi vé giữa các đại lý</p>
              </div>
            </div>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg"
            >
              Thêm trao đổi mới
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
                <p className="text-sm font-medium text-gray-600">Tổng trao đổi</p>
                <p className="text-3xl font-bold text-gray-900">{totalExchanges}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <ExchangeIcon className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
                <p className="text-3xl font-bold text-orange-600">{pendingExchanges}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <InventoryIcon className="text-orange-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                <p className="text-3xl font-bold text-green-600">{completedExchanges}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircleIcon className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng số lượng</p>
                <p className="text-3xl font-bold text-blue-600">{totalQuantity}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUpIcon className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Danh sách trao đổi</h3>
            <p className="text-gray-600 text-sm mt-1">
              Quản lý chi tiết các giao dịch trao đổi vé
            </p>
          </div>
          <div className="p-6">
            <DataGrid
              rows={exchanges}
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
          {editingExchange ? 'Sửa trao đổi' : 'Thêm trao đổi mới'}
        </DialogTitle>
        <DialogContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth>
              <InputLabel>Từ đại lý</InputLabel>
              <Select
                value={formData.fromAgentId}
                label="Từ đại lý"
                onChange={(e) => setFormData({ ...formData, fromAgentId: e.target.value })}
              >
                {mockAgents.map(agent => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Đến đại lý</InputLabel>
              <Select
                value={formData.toAgentId}
                label="Đến đại lý"
                onChange={(e) => setFormData({ ...formData, toAgentId: e.target.value })}
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
              <InputLabel>Mã vé</InputLabel>
              <Select
                value={formData.ticketId}
                label="Mã vé"
                onChange={(e) => setFormData({ ...formData, ticketId: e.target.value })}
              >
                {mockTickets.map(ticket => (
                  <MenuItem key={ticket.id} value={ticket.id}>
                    {ticket.ticketNumber}
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
            <DatePicker
              label="Ngày trao đổi"
              value={formData.exchangeDate}
              onChange={(newValue) => newValue && setFormData({ ...formData, exchangeDate: newValue })}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                label="Trạng thái"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="pending">Chờ xử lý</MenuItem>
                <MenuItem value="completed">Hoàn thành</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </div>
          <TextField
            fullWidth
            label="Ghi chú"
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
            onClick={handleSaveExchange} 
            variant="contained"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            {editingExchange ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExchangeManagement;