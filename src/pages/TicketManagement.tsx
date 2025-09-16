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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ConfirmationNumber as TicketIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { mockTickets, mockProvinces, mockAgents } from '../data/mockData';
import type { Ticket } from '../types';
import dayjs from 'dayjs';

const TicketManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState(mockTickets);
  const [tabValue, setTabValue] = useState(0);

  const [formData, setFormData] = useState({
    provinceId: '',
    issueDate: dayjs(),
    quantity: 1,
    unitPrice: 0,
    status: 'available',
    agentId: '',
    sellerId: '',
  });

  const handleOpenDialog = (ticket?: Ticket) => {
    if (ticket) {
      setEditingTicket(ticket);
      setFormData({
        provinceId: ticket.provinceId,
        issueDate: dayjs(ticket.purchaseDate),
        quantity: ticket.quantity,
        unitPrice: ticket.price,
        status: ticket.status,
        agentId: ticket.agentId,
        sellerId: ticket.sellerId || '',
      });
    } else {
      setEditingTicket(null);
      setFormData({
        provinceId: '',
        issueDate: dayjs(),
        quantity: 1,
        unitPrice: 0,
        status: 'available',
        agentId: '',
        sellerId: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTicket(null);
  };

  const handleSaveTicket = () => {
    if (editingTicket) {
      setTickets(tickets.map(t =>
        t.id === editingTicket.id
          ? {
              ...t,
              ...formData,
              purchaseDate: formData.issueDate.toDate(),
              price: formData.unitPrice,
              status: formData.status as 'available' | 'sold' | 'returned'
            }
          : t
      ));
    } else {
      const newTicket: Ticket = {
        id: Date.now().toString(),
        ticketNumber: `T${Date.now()}`,
        provinceId: formData.provinceId,
        price: formData.unitPrice,
        quantity: formData.quantity,
        purchaseDate: formData.issueDate.toDate(),
        status: formData.status as 'available' | 'sold' | 'returned',
        agentId: formData.agentId,
        sellerId: formData.sellerId || undefined,
      };
      setTickets([...tickets, newTicket]);
    }
    handleCloseDialog();
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const columns: GridColDef[] = [
    { field: 'ticketNumber', headerName: 'Mã vé', width: 120 },
    { 
      field: 'provinceId', 
      headerName: 'Tỉnh', 
      width: 150,
      renderCell: (params) => {
        const province = mockProvinces.find(p => p.id === params.value);
        return province?.name || params.value;
      }
    },
    { 
      field: 'price', 
      headerName: 'Giá vé', 
      width: 120,
      renderCell: (params) => (
        <span className="font-semibold text-green-600">
          {params.value.toLocaleString('vi-VN')} VNĐ
        </span>
      )
    },
    { field: 'quantity', headerName: 'Số lượng', width: 100, type: 'number' },
    { 
      field: 'status', 
      headerName: 'Trạng thái', 
      width: 120,
      renderCell: (params) => {
        const statusConfig = {
          available: { label: 'Có sẵn', color: 'success' as const },
          sold: { label: 'Đã bán', color: 'primary' as const },
          returned: { label: 'Trả lại', color: 'warning' as const },
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
      field: 'purchaseDate', 
      headerName: 'Ngày mua', 
      width: 120,
      renderCell: (params) => dayjs(params.value).format('DD/MM/YYYY')
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
          onClick={() => handleDeleteTicket(params.row.id)}
        />,
      ],
    },
  ];

  const availableTickets = tickets.filter(t => t.status === 'available');
  const soldTickets = tickets.filter(t => t.status === 'sold');
  const returnedTickets = tickets.filter(t => t.status === 'returned');
  
  const availableValue = availableTickets.reduce((sum, t) => sum + (t.quantity * t.price), 0);
  const soldValue = soldTickets.reduce((sum, t) => sum + (t.quantity * t.price), 0);

  const getFilteredTickets = () => {
    switch (tabValue) {
      case 0: return tickets;
      case 1: return availableTickets;
      case 2: return soldTickets;
      case 3: return returnedTickets;
      default: return tickets;
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <TicketIcon className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Quản lý vé số</h1>
              <p className="text-sm sm:text-base text-blue-100">Quản lý tồn kho và bán hàng vé số</p>
            </div>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-4 py-2 rounded-lg"
          >
            Thêm vé mới
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 text-xs sm:text-sm">Tổng vé</p>
                <p className="text-3xl font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">{tickets.length}</p>
              </div>
              <TicketIcon className="text-blue-500 text-2xl sm:text-3xl" />
            </div>
          </div>
        </div>

        <div className="stat-card-success">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 text-xs sm:text-sm">Có sẵn</p>
                <p className="text-3xl font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">{availableTickets.length}</p>
                <p className="text-xs text-gray-500">
                  {availableValue.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <InventoryIcon className="text-green-500 text-2xl sm:text-3xl" />
            </div>
          </div>
        </div>

        <div className="stat-card-warning">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 text-xs sm:text-sm">Đã bán</p>
                <p className="text-3xl font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">{soldTickets.length}</p>
                <p className="text-xs text-gray-500">
                  {soldValue.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <TrendingUpIcon className="text-yellow-500 text-2xl sm:text-3xl" />
            </div>
          </div>
        </div>

        <div className="stat-card-error">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 text-xs sm:text-sm">Trả lại</p>
                <p className="text-3xl font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">{returnedTickets.length}</p>
              </div>
              <span className="text-red-500 text-2xl sm:text-3xl font-bold">↩</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="card-header">
          <Tabs value={tabValue} onChange={handleTabChange} className="min-h-0">
            <Tab label={`Tất cả (${tickets.length})`} />
            <Tab label={`Có sẵn (${availableTickets.length})`} />
            <Tab label={`Đã bán (${soldTickets.length})`} />
            <Tab label={`Trả lại (${returnedTickets.length})`} />
          </Tabs>
        </div>
        <div className="p-0">
            <DataGrid
              rows={getFilteredTickets()}
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
          {editingTicket ? 'Sửa vé số' : 'Thêm vé mới'}
        </DialogTitle>
        <DialogContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth>
              <InputLabel>Tỉnh thành</InputLabel>
              <Select
                value={formData.provinceId}
                label="Tỉnh thành"
                onChange={(e) => setFormData({ ...formData, provinceId: e.target.value })}
              >
                {mockProvinces.map(province => (
                  <MenuItem key={province.id} value={province.id}>
                    {province.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DatePicker
              label="Ngày mua"
              value={formData.issueDate}
              onChange={(newValue) => newValue && setFormData({ ...formData, issueDate: newValue })}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Số lượng"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            />
            <TextField
              fullWidth
              label="Giá vé"
              type="number"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                label="Trạng thái"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="available">Có sẵn</MenuItem>
                <MenuItem value="sold">Đã bán</MenuItem>
                <MenuItem value="returned">Trả lại</MenuItem>
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
        </DialogContent>
        <DialogActions className="p-6 pt-4">
          <Button 
            onClick={handleCloseDialog}
            className="text-gray-600 hover:text-gray-800"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSaveTicket} 
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            {editingTicket ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TicketManagement;