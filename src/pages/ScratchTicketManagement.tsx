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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Casino as CasinoIcon,
  EmojiEvents as TrophyIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import dayjs from 'dayjs';

interface ScratchTicket {
  id: string;
  ticketCode: string;
  ticketType: 'instant' | 'daily' | 'weekly' | 'monthly';
  price: number;
  status: 'unscratched' | 'scratched' | 'won' | 'lost';
  purchaseDate: Date;
  scratchDate?: Date;
  prizeValue?: number;
  prizeType?: string;
  notes?: string;
  sellerId?: string;
}

const mockScratchTickets: ScratchTicket[] = [
  {
    id: '1',
    ticketCode: 'ST001234567',
    ticketType: 'instant',
    price: 10000,
    status: 'unscratched',
    purchaseDate: new Date('2024-01-15'),
    notes: 'Vé số cào giải thưởng lớn',
  },
  {
    id: '2',
    ticketCode: 'ST001234568',
    ticketType: 'daily',
    price: 5000,
    status: 'scratched',
    purchaseDate: new Date('2024-01-14'),
    scratchDate: new Date('2024-01-15'),
    prizeValue: 0,
    prizeType: 'Không trúng',
    notes: 'Đã cào, không trúng',
  },
  {
    id: '3',
    ticketCode: 'ST001234569',
    ticketType: 'weekly',
    price: 20000,
    status: 'won',
    purchaseDate: new Date('2024-01-13'),
    scratchDate: new Date('2024-01-14'),
    prizeValue: 100000,
    prizeType: 'Giải 3',
    notes: 'Trúng giải 3',
  },
];

const ticketTypes = [
  { value: 'instant', label: 'Tức thời', price: 10000 },
  { value: 'daily', label: 'Hàng ngày', price: 5000 },
  { value: 'weekly', label: 'Hàng tuần', price: 20000 },
  { value: 'monthly', label: 'Hàng tháng', price: 50000 },
];

const prizeTypes = [
  'Không trúng',
  'Giải khuyến khích',
  'Giải 3',
  'Giải 2',
  'Giải 1',
  'Giải đặc biệt',
];

const ScratchTicketManagement: React.FC = () => {
  const [tickets, setTickets] = useState<ScratchTicket[]>(mockScratchTickets);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTicket, setEditingTicket] = useState<ScratchTicket | null>(null);
  const [formData, setFormData] = useState({
    ticketCode: '',
    ticketType: 'instant' as 'instant' | 'daily' | 'weekly' | 'monthly',
    price: 10000,
    notes: '',
  });
  const [scratchData, setScratchData] = useState({
    prizeValue: 0,
    prizeType: 'Không trúng',
    notes: '',
  });
  const [openScratchDialog, setOpenScratchDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ScratchTicket | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedTickets = localStorage.getItem('scratchTickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('scratchTickets', JSON.stringify(tickets));
  }, [tickets]);

  const handleAddTicket = () => {
    setEditingTicket(null);
    setFormData({
      ticketCode: '',
      ticketType: 'instant',
      price: 10000,
      notes: '',
    });
    setOpenDialog(true);
  };

  const handleEditTicket = (ticket: ScratchTicket) => {
    setEditingTicket(ticket);
    setFormData({
      ticketCode: ticket.ticketCode,
      ticketType: ticket.ticketType,
      price: ticket.price,
      notes: ticket.notes || '',
    });
    setOpenDialog(true);
  };

  const handleScratchTicket = (ticket: ScratchTicket) => {
    setSelectedTicket(ticket);
    setScratchData({
      prizeValue: ticket.prizeValue || 0,
      prizeType: ticket.prizeType || 'Không trúng',
      notes: ticket.notes || '',
    });
    setOpenScratchDialog(true);
  };

  const handleSaveTicket = () => {
    if (!formData.ticketCode.trim()) {
      setAlert({ type: 'error', message: 'Vui lòng nhập mã vé' });
      return;
    }

    const ticketData: ScratchTicket = {
      id: editingTicket?.id || Date.now().toString(),
      ticketCode: formData.ticketCode.trim(),
      ticketType: formData.ticketType,
      price: formData.price,
      status: 'unscratched',
      purchaseDate: editingTicket?.purchaseDate || new Date(),
      notes: formData.notes,
    };

    if (editingTicket) {
      setTickets(prev => prev.map(t => t.id === editingTicket.id ? { ...t, ...ticketData } : t));
      setAlert({ type: 'success', message: 'Cập nhật vé thành công' });
    } else {
      setTickets(prev => [...prev, ticketData]);
      setAlert({ type: 'success', message: 'Thêm vé mới thành công' });
    }

    setOpenDialog(false);
    setFormData({ ticketCode: '', ticketType: 'instant', price: 10000, notes: '' });
  };

  const handleSaveScratch = () => {
    if (!selectedTicket) return;

    const updatedTicket: ScratchTicket = {
      ...selectedTicket,
      status: scratchData.prizeValue > 0 ? 'won' : 'lost',
      scratchDate: new Date(),
      prizeValue: scratchData.prizeValue,
      prizeType: scratchData.prizeType,
      notes: scratchData.notes,
    };

    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setAlert({ type: 'success', message: 'Cập nhật kết quả cào vé thành công' });
    setOpenScratchDialog(false);
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    setAlert({ type: 'success', message: 'Xóa vé thành công' });
  };

  const handleTicketTypeChange = (ticketType: string) => {
    const type = ticketTypes.find(t => t.value === ticketType);
    if (type) {
      setFormData(prev => ({ ...prev, ticketType: ticketType as 'instant' | 'daily' | 'weekly' | 'monthly', price: type.price }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unscratched': return 'default';
      case 'scratched': return 'info';
      case 'won': return 'success';
      case 'lost': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'unscratched': return 'Chưa cào';
      case 'scratched': return 'Đã cào';
      case 'won': return 'Trúng thưởng';
      case 'lost': return 'Không trúng';
      default: return status;
    }
  };

  const getTicketTypeText = (type: string) => {
    const ticketType = ticketTypes.find(t => t.value === type);
    return ticketType ? ticketType.label : type;
  };

  const columns: GridColDef[] = [
    { field: 'ticketCode', headerName: 'Mã vé', width: 150, flex: 1 },
    { field: 'ticketType', headerName: 'Loại vé', width: 120, renderCell: (params) => getTicketTypeText(params.value) },
    { field: 'price', headerName: 'Giá vé', width: 100, renderCell: (params) => `${params.value.toLocaleString()}đ` },
    { field: 'status', headerName: 'Trạng thái', width: 120, renderCell: (params) => (
      <Chip label={getStatusText(params.value)} color={getStatusColor(params.value)} size="small" />
    )},
    { field: 'prizeValue', headerName: 'Giá trị thưởng', width: 140, renderCell: (params) => 
      params.value ? `${params.value.toLocaleString()}đ` : '-'
    },
    { field: 'prizeType', headerName: 'Loại giải', width: 120, renderCell: (params) => params.value || '-' },
    { field: 'purchaseDate', headerName: 'Ngày mua', width: 120, renderCell: (params) => 
      dayjs(params.value).format('DD/MM/YYYY')
    },
    { field: 'scratchDate', headerName: 'Ngày cào', width: 120, renderCell: (params) => 
      params.value ? dayjs(params.value).format('DD/MM/YYYY') : '-'
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Thao tác',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ViewIcon />}
          label="Xem chi tiết"
          onClick={() => handleScratchTicket(params.row)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Sửa"
          onClick={() => handleEditTicket(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Xóa"
          onClick={() => handleDeleteTicket(params.row.id)}
        />,
      ],
    },
  ];

  const stats = {
    totalTickets: tickets.length,
    unscratchedTickets: tickets.filter(t => t.status === 'unscratched').length,
    wonTickets: tickets.filter(t => t.status === 'won').length,
    totalPrizeValue: tickets.filter(t => t.status === 'won').reduce((sum, t) => sum + (t.prizeValue || 0), 0),
    totalRevenue: tickets.reduce((sum, t) => sum + t.price, 0),
    profit: tickets.filter(t => t.status === 'won').reduce((sum, t) => sum + (t.prizeValue || 0), 0) - 
            tickets.reduce((sum, t) => sum + t.price, 0),
  };

  return (
    <Box className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <CasinoIcon className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Quản lý vé số cào</h1>
              <p className="text-sm sm:text-base text-purple-100">Quản lý vé số cào và theo dõi kết quả</p>
            </div>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTicket}
            className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-4 py-2 rounded-lg"
          >
            Thêm vé mới
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
                  Tổng số vé
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.totalTickets}
                </Typography>
              </div>
              <CasinoIcon className="text-blue-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Chưa cào
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.unscratchedTickets}
                </Typography>
              </div>
              <ScheduleIcon className="text-yellow-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Vé trúng
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.wonTickets}
                </Typography>
              </div>
              <TrophyIcon className="text-green-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-error">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Tổng thưởng
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.totalPrizeValue.toLocaleString()}đ
                </Typography>
              </div>
              <MoneyIcon className="text-red-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="card">
        <div className="card-header">
          <Typography variant="h6" className="font-semibold text-gray-900">
            Danh sách vé số cào
          </Typography>
        </div>
        <CardContent className="p-0">
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={tickets}
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTicket ? 'Sửa vé số cào' : 'Thêm vé số cào mới'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <TextField
              fullWidth
              label="Mã vé"
              value={formData.ticketCode}
              onChange={(e) => setFormData(prev => ({ ...prev, ticketCode: e.target.value }))}
              placeholder="Nhập mã vé số cào"
            />
            <FormControl fullWidth>
              <InputLabel>Loại vé</InputLabel>
              <Select
                value={formData.ticketType}
                onChange={(e) => handleTicketTypeChange(e.target.value)}
                label="Loại vé"
              >
                {ticketTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label} - {type.price.toLocaleString()}đ
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Giá vé"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
            />
            <TextField
              fullWidth
              label="Ghi chú"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Ghi chú về vé số cào"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveTicket} variant="contained">
            {editingTicket ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Scratch Dialog */}
      <Dialog open={openScratchDialog} onClose={() => setOpenScratchDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Cào vé: {selectedTicket?.ticketCode}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <FormControl fullWidth>
              <InputLabel>Loại giải</InputLabel>
              <Select
                value={scratchData.prizeType}
                onChange={(e) => setScratchData(prev => ({ ...prev, prizeType: e.target.value }))}
                label="Loại giải"
              >
                {prizeTypes.map((prize) => (
                  <MenuItem key={prize} value={prize}>
                    {prize}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Giá trị thưởng"
              type="number"
              value={scratchData.prizeValue}
              onChange={(e) => setScratchData(prev => ({ ...prev, prizeValue: Number(e.target.value) }))}
              placeholder="Nhập giá trị thưởng (0 nếu không trúng)"
            />
            <TextField
              fullWidth
              label="Ghi chú"
              multiline
              rows={3}
              value={scratchData.notes}
              onChange={(e) => setScratchData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Ghi chú về kết quả cào vé"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenScratchDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveScratch} variant="contained">
            Cập nhật kết quả
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScratchTicketManagement;
