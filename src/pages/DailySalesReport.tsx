import { useState } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
} from '@mui/icons-material';
import { mockProvinces, mockTickets } from '../data/mockData';
import type { Ticket } from '../types';
import dayjs from 'dayjs';

interface DailySale {
  id: string;
  provinceId: string;
  provinceName: string;
  ticketCount: number;
  ticketPrice: number;
  totalAmount: number;
  date: string;
  shift: string;
  notes?: string;
}

const DailySalesReport = () => {
  const [sales, setSales] = useState<DailySale[]>(() => {
    const saved = localStorage.getItem('dailySales');
    return saved ? JSON.parse(saved) : [];
  });
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('tickets');
    return saved ? JSON.parse(saved) : mockTickets;
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSale, setEditingSale] = useState<DailySale | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const [formData, setFormData] = useState({
    provinceId: '',
    ticketCount: '',
    ticketPrice: '',
    shift: 'Ca sáng',
    notes: '',
  });

  const shifts = ['Ca sáng', 'Ca chiều', 'Ca đêm'];

  const handleOpenDialog = (sale?: DailySale) => {
    if (sale) {
      setEditingSale(sale);
      setFormData({
        provinceId: sale.provinceId,
        ticketCount: sale.ticketCount.toString(),
        ticketPrice: sale.ticketPrice.toString(),
        shift: sale.shift,
        notes: sale.notes || '',
      });
    } else {
      setEditingSale(null);
      setFormData({
        provinceId: '',
        ticketCount: '',
        ticketPrice: '',
        shift: 'Ca sáng',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSale(null);
    setFormData({
      provinceId: '',
      ticketCount: '',
      ticketPrice: '',
      shift: 'Ca sáng',
      notes: '',
    });
  };

  const handleSave = () => {
    if (!formData.provinceId || !formData.ticketCount || !formData.ticketPrice) {
      setSnackbar({ open: true, message: 'Vui lòng điền đầy đủ thông tin', severity: 'error' });
      return;
    }

    const province = mockProvinces.find(p => p.id === formData.provinceId);
    const ticketCount = parseInt(formData.ticketCount);
    const ticketPrice = parseInt(formData.ticketPrice);
    const totalAmount = ticketCount * ticketPrice;

    if (editingSale) {
      // Cập nhật
      const updatedSales = sales.map(sale => 
        sale.id === editingSale.id 
          ? {
              ...sale,
              provinceId: formData.provinceId,
              provinceName: province?.name || '',
              ticketCount,
              ticketPrice,
              totalAmount,
              shift: formData.shift,
              notes: formData.notes,
            }
          : sale
      );
      setSales(updatedSales);
      localStorage.setItem('dailySales', JSON.stringify(updatedSales));
      setSnackbar({ open: true, message: 'Cập nhật báo cáo thành công', severity: 'success' });
    } else {
      // Thêm mới
      const newSale: DailySale = {
        id: Date.now().toString(),
        provinceId: formData.provinceId,
        provinceName: province?.name || '',
        ticketCount,
        ticketPrice,
        totalAmount,
        date: dayjs().format('YYYY-MM-DD'),
        shift: formData.shift,
        notes: formData.notes,
      };
      
      // Cập nhật kho vé - tạo vé mới hoặc cập nhật số lượng
      const newTickets = [...tickets];
      const existingTicketIndex = newTickets.findIndex(
        ticket => ticket.provinceId === formData.provinceId && 
                 ticket.price === ticketPrice && 
                 ticket.status === 'available'
      );

      if (existingTicketIndex >= 0) {
        // Cập nhật số lượng vé có sẵn
        newTickets[existingTicketIndex].quantity += ticketCount;
      } else {
        // Tạo vé mới
        const newTicket: Ticket = {
          id: Date.now().toString(),
          provinceId: formData.provinceId,
          agentId: '1', // Mặc định agent
          ticketNumber: `T${Date.now()}`,
          price: ticketPrice,
          quantity: ticketCount,
          status: 'available',
          purchaseDate: new Date(),
        };
        newTickets.push(newTicket);
      }

      setTickets(newTickets);
      localStorage.setItem('tickets', JSON.stringify(newTickets));
      
      const updatedSales = [...sales, newSale];
      setSales(updatedSales);
      localStorage.setItem('dailySales', JSON.stringify(updatedSales));
      
      setSnackbar({ 
        open: true, 
        message: `Thêm báo cáo thành công! Đã nhập ${ticketCount} vé ${province?.name} vào kho`, 
        severity: 'success' 
      });
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    const updatedSales = sales.filter(sale => sale.id !== id);
    setSales(updatedSales);
    localStorage.setItem('dailySales', JSON.stringify(updatedSales));
    setSnackbar({ open: true, message: 'Xóa báo cáo thành công', severity: 'success' });
  };

  const totalTickets = sales.reduce((sum, sale) => sum + sale.ticketCount, 0);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const averagePrice = totalTickets > 0 ? totalRevenue / totalTickets : 0;

  const salesByProvince = sales.reduce((acc, sale) => {
    if (!acc[sale.provinceId]) {
      acc[sale.provinceId] = {
        provinceName: sale.provinceName,
        ticketCount: 0,
        totalAmount: 0,
      };
    }
    acc[sale.provinceId].ticketCount += sale.ticketCount;
    acc[sale.provinceId].totalAmount += sale.totalAmount;
    return acc;
  }, {} as Record<string, { provinceName: string; ticketCount: number; totalAmount: number }>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-100 to-green-50 rounded-xl shadow-sm">
                <AssessmentIcon className="text-green-600 text-xl sm:text-2xl" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Báo cáo bán vé hàng ngày
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Nhập và theo dõi doanh số bán vé theo tỉnh</p>
              </div>
            </div>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 sm:px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Thêm báo cáo
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
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng vé bán</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalTickets.toLocaleString()}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0 ml-2">
                <TrendingUpIcon className="text-blue-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="stat-card-success">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng doanh thu</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 truncate">
                  {totalRevenue.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0 ml-2">
                <MoneyIcon className="text-green-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Giá vé TB</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 truncate">
                  {Math.round(averagePrice).toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 rounded-full flex-shrink-0 ml-2">
                <LocationIcon className="text-purple-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="stat-card-success">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Số tỉnh</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600">
                  {Object.keys(salesByProvince).length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-100 rounded-full flex-shrink-0 ml-2">
                <LocationIcon className="text-orange-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Inventory Status */}
        <div className="card">
          <div className="card-header">
            <Typography variant="h6" className="font-semibold text-gray-900">
              Trạng thái kho vé
            </Typography>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tickets.filter(ticket => ticket.status === 'available').map((ticket) => {
                const province = mockProvinces.find(p => p.id === ticket.provinceId);
                return (
                  <div key={ticket.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{province?.name || 'N/A'}</h3>
                      <Chip 
                        label={`${ticket.quantity} vé`} 
                        size="small" 
                        className="bg-green-100 text-green-800"
                      />
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {ticket.price.toLocaleString('vi-VN')} VNĐ/vé
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Tổng giá trị: {(ticket.quantity * ticket.price).toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Mã vé: {ticket.ticketNumber}
                    </p>
                  </div>
                );
              })}
            </div>
            {tickets.filter(ticket => ticket.status === 'available').length === 0 && (
              <div className="text-center py-8">
                <ConfirmationNumberIcon className="text-gray-400 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Chưa có vé nào trong kho</p>
                <p className="text-gray-400 text-sm">Nhập báo cáo bán vé để thêm vé vào kho</p>
              </div>
            )}
          </div>
        </div>

        {/* Sales by Province */}
        {Object.keys(salesByProvince).length > 0 && (
          <div className="card">
            <div className="card-header">
              <Typography variant="h6" className="font-semibold text-gray-900">
                Tổng kết theo tỉnh
              </Typography>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(salesByProvince).map(([provinceId, data]) => (
                  <div key={provinceId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{data.provinceName}</h3>
                      <Chip 
                        label={`${data.ticketCount} vé`} 
                        size="small" 
                        className="bg-blue-100 text-blue-800"
                      />
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {data.totalAmount.toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      TB: {Math.round(data.totalAmount / data.ticketCount).toLocaleString('vi-VN')} VNĐ/vé
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sales Table */}
        <div className="card">
          <div className="card-header">
            <Typography variant="h6" className="font-semibold text-gray-900">
              Chi tiết báo cáo ({sales.length} bản ghi)
            </Typography>
          </div>
          <div className="p-4 sm:p-6">
            {sales.length === 0 ? (
              <div className="text-center py-8">
                <AssessmentIcon className="text-gray-400 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Chưa có báo cáo nào</p>
                <p className="text-gray-400 text-sm">Nhấn "Thêm báo cáo" để bắt đầu</p>
              </div>
            ) : (
              <TableContainer component={Paper} className="shadow-sm">
                <Table>
                  <TableHead>
                    <TableRow className="bg-gray-50">
                      <TableCell className="font-semibold">Tỉnh</TableCell>
                      <TableCell className="font-semibold">Ca</TableCell>
                      <TableCell className="font-semibold">Số vé</TableCell>
                      <TableCell className="font-semibold">Giá vé</TableCell>
                      <TableCell className="font-semibold">Tổng tiền</TableCell>
                      <TableCell className="font-semibold">Ghi chú</TableCell>
                      <TableCell className="font-semibold">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <LocationIcon className="text-blue-500 text-sm" />
                            <span className="font-medium">{sale.provinceName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={sale.shift} 
                            size="small" 
                            className="bg-cyan-100 text-cyan-800"
                          />
                        </TableCell>
                        <TableCell className="font-semibold text-blue-600">
                          {sale.ticketCount.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-semibold text-purple-600">
                          {sale.ticketPrice.toLocaleString('vi-VN')} VNĐ
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {sale.totalAmount.toLocaleString('vi-VN')} VNĐ
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {sale.notes || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(sale)}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(sale.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle className="bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center space-x-2">
            <AssessmentIcon className="text-green-600" />
            <span>{editingSale ? 'Sửa báo cáo' : 'Thêm báo cáo mới'}</span>
          </div>
        </DialogTitle>
        <DialogContent className="p-6">
          <div className="space-y-4">
            <FormControl fullWidth>
              <InputLabel>Tỉnh</InputLabel>
              <Select
                value={formData.provinceId}
                onChange={(e) => setFormData({ ...formData, provinceId: e.target.value })}
                label="Tỉnh"
              >
                {mockProvinces.map((province) => (
                  <MenuItem key={province.id} value={province.id}>
                    {province.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Số vé"
                type="number"
                value={formData.ticketCount}
                onChange={(e) => setFormData({ ...formData, ticketCount: e.target.value })}
                fullWidth
                placeholder="Ví dụ: 1000"
              />
              <TextField
                label="Giá vé (VNĐ)"
                type="number"
                value={formData.ticketPrice}
                onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                fullWidth
                placeholder="Ví dụ: 8000"
              />
            </div>

            <FormControl fullWidth>
              <InputLabel>Ca làm việc</InputLabel>
              <Select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                label="Ca làm việc"
              >
                {shifts.map((shift) => (
                  <MenuItem key={shift} value={shift}>
                    {shift}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Ghi chú"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              fullWidth
              multiline
              rows={2}
              placeholder="Ghi chú thêm (tùy chọn)"
            />

            {formData.ticketCount && formData.ticketPrice && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Tổng tiền:</strong> {(parseInt(formData.ticketCount) * parseInt(formData.ticketPrice)).toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions className="p-6 bg-gray-50">
          <Button onClick={handleCloseDialog} className="text-gray-600">
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {editingSale ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DailySalesReport;
