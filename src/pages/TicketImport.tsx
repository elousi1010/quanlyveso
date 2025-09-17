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
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  ConfirmationNumber as TicketIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import { mockProvinces } from '../data/mockData';
import type { Ticket } from '../types';
import dayjs from 'dayjs';

interface TicketImport {
  id: string;
  provinceId: string;
  provinceName: string;
  ticketNumber: string;
  quantity: number;
  importPrice: number; // Giá nhập từ đài
  sellPrice: number;   // Giá bán ra
  totalImportValue: number;
  totalSellValue: number;
  profit: number;
  importDate: string;
  supplier: string; // Nguồn nhập (đài nào)
  notes?: string;
}

const TicketImport = () => {
  const [imports, setImports] = useState<TicketImport[]>(() => {
    const saved = localStorage.getItem('ticketImports');
    return saved ? JSON.parse(saved) : [];
  });
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('tickets');
    return saved ? JSON.parse(saved) : [];
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingImport, setEditingImport] = useState<TicketImport | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const [formData, setFormData] = useState({
    provinceId: '',
    ticketNumber: '',
    quantity: '',
    importPrice: '',
    sellPrice: '',
    supplier: '',
    notes: '',
  });

  const suppliers = [
    'Đài TP. Hồ Chí Minh',
    'Đài Cần Thơ', 
    'Đài Hà Nội',
    'Đài Đà Nẵng',
    'Đài Hải Phòng',
    'Đài An Giang',
    'Đài Bà Rịa - Vũng Tàu',
    'Đài Bắc Giang',
    'Đài Bắc Kạn',
    'Đài Bạc Liêu',
  ];

  const handleOpenDialog = (importItem?: TicketImport) => {
    if (importItem) {
      setEditingImport(importItem);
      setFormData({
        provinceId: importItem.provinceId,
        ticketNumber: importItem.ticketNumber,
        quantity: importItem.quantity.toString(),
        importPrice: importItem.importPrice.toString(),
        sellPrice: importItem.sellPrice.toString(),
        supplier: importItem.supplier,
        notes: importItem.notes || '',
      });
    } else {
      setEditingImport(null);
      setFormData({
        provinceId: '',
        ticketNumber: '',
        quantity: '',
        importPrice: '',
        sellPrice: '',
        supplier: '',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingImport(null);
    setFormData({
      provinceId: '',
      ticketNumber: '',
      quantity: '',
      importPrice: '',
      sellPrice: '',
      supplier: '',
      notes: '',
    });
  };

  const handleSave = () => {
    if (!formData.provinceId || !formData.ticketNumber || !formData.quantity || 
        !formData.importPrice || !formData.sellPrice || !formData.supplier) {
      setSnackbar({ open: true, message: 'Vui lòng điền đầy đủ thông tin', severity: 'error' });
      return;
    }

    const province = mockProvinces.find(p => p.id === formData.provinceId);
    const quantity = parseInt(formData.quantity);
    const importPrice = parseInt(formData.importPrice);
    const sellPrice = parseInt(formData.sellPrice);
    const totalImportValue = quantity * importPrice;
    const totalSellValue = quantity * sellPrice;
    const profit = totalSellValue - totalImportValue;

    if (editingImport) {
      // Cập nhật
      const updatedImports = imports.map(importItem => 
        importItem.id === editingImport.id 
          ? {
              ...importItem,
              provinceId: formData.provinceId,
              provinceName: province?.name || '',
              ticketNumber: formData.ticketNumber,
              quantity,
              importPrice,
              sellPrice,
              totalImportValue,
              totalSellValue,
              profit,
              supplier: formData.supplier,
              notes: formData.notes,
            }
          : importItem
      );
      setImports(updatedImports);
      localStorage.setItem('ticketImports', JSON.stringify(updatedImports));
      setSnackbar({ open: true, message: 'Cập nhật nhập vé thành công', severity: 'success' });
    } else {
      // Thêm mới
      const newImport: TicketImport = {
        id: Date.now().toString(),
        provinceId: formData.provinceId,
        provinceName: province?.name || '',
        ticketNumber: formData.ticketNumber,
        quantity,
        importPrice,
        sellPrice,
        totalImportValue,
        totalSellValue,
        profit,
        importDate: dayjs().format('YYYY-MM-DD'),
        supplier: formData.supplier,
        notes: formData.notes,
      };
      
      // Cập nhật kho vé
      const newTickets = [...tickets];
      const existingTicketIndex = newTickets.findIndex(
        ticket => ticket.provinceId === formData.provinceId && 
                 ticket.price === sellPrice && 
                 ticket.status === 'available'
      );

      if (existingTicketIndex >= 0) {
        // Cập nhật số lượng vé có sẵn
        newTickets[existingTicketIndex].quantity += quantity;
      } else {
        // Tạo vé mới
        const newTicket: Ticket = {
          id: Date.now().toString(),
          provinceId: formData.provinceId,
          agentId: '1', // Mặc định agent
          ticketNumber: formData.ticketNumber,
          price: sellPrice,
          quantity: quantity,
          status: 'available',
          purchaseDate: new Date(),
        };
        newTickets.push(newTicket);
      }

      setTickets(newTickets);
      localStorage.setItem('tickets', JSON.stringify(newTickets));
      
      const updatedImports = [...imports, newImport];
      setImports(updatedImports);
      localStorage.setItem('ticketImports', JSON.stringify(updatedImports));
      
      setSnackbar({ 
        open: true, 
        message: `Nhập vé thành công! Đã thêm ${quantity} vé ${province?.name} vào kho`, 
        severity: 'success' 
      });
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    const updatedImports = imports.filter(importItem => importItem.id !== id);
    setImports(updatedImports);
    localStorage.setItem('ticketImports', JSON.stringify(updatedImports));
    setSnackbar({ open: true, message: 'Xóa nhập vé thành công', severity: 'success' });
  };

  const totalImports = imports.reduce((sum, importItem) => sum + importItem.quantity, 0);
  const totalImportValue = imports.reduce((sum, importItem) => sum + importItem.totalImportValue, 0);
  const totalSellValue = imports.reduce((sum, importItem) => sum + importItem.totalSellValue, 0);
  const totalProfit = imports.reduce((sum, importItem) => sum + importItem.profit, 0);
  const averageProfitMargin = totalSellValue > 0 ? (totalProfit / totalSellValue) * 100 : 0;

  const importsByProvince = imports.reduce((acc, importItem) => {
    if (!acc[importItem.provinceId]) {
      acc[importItem.provinceId] = {
        provinceName: importItem.provinceName,
        quantity: 0,
        totalImportValue: 0,
        totalSellValue: 0,
        profit: 0,
      };
    }
    acc[importItem.provinceId].quantity += importItem.quantity;
    acc[importItem.provinceId].totalImportValue += importItem.totalImportValue;
    acc[importItem.provinceId].totalSellValue += importItem.totalSellValue;
    acc[importItem.provinceId].profit += importItem.profit;
    return acc;
  }, {} as Record<string, { provinceName: string; quantity: number; totalImportValue: number; totalSellValue: number; profit: number }>);

  return (
    <div className="min-h-screen bg-gray-50 mt-2">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl shadow-sm">
                <InventoryIcon className="text-blue-600 text-xl sm:text-2xl" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Nhập vé vào kho
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Quản lý việc nhập vé từ đài và giá bán</p>
              </div>
            </div>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Nhập vé mới
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
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng vé nhập</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalImports.toLocaleString()}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0 ml-2">
                <TicketIcon className="text-blue-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="stat-card-error">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng giá nhập</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 truncate">
                  {totalImportValue.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-full flex-shrink-0 ml-2">
                <StoreIcon className="text-red-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="stat-card-success">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng giá bán</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 truncate">
                  {totalSellValue.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0 ml-2">
                <MoneyIcon className="text-green-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className={`${totalProfit >= 0 ? 'stat-card-success' : 'stat-card-error'}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Lợi nhuận</p>
                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold truncate ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalProfit.toLocaleString('vi-VN')} VNĐ
                </p>
                <p className="text-xs text-gray-500">
                  Biên lợi nhuận: {averageProfitMargin.toFixed(1)}%
                </p>
              </div>
              <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ml-2 ${totalProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <TrendingUpIcon className={`text-lg sm:text-xl lg:text-2xl ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Imports by Province */}
        {Object.keys(importsByProvince).length > 0 && (
          <div className="card">
            <div className="card-header">
              <Typography variant="h6" className="font-semibold text-gray-900">
                Tổng kết theo tỉnh
              </Typography>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(importsByProvince).map(([provinceId, data]) => (
                  <div key={provinceId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{data.provinceName}</h3>
                      <Chip 
                        label={`${data.quantity} vé`} 
                        size="small" 
                        className="bg-blue-100 text-blue-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-red-600">
                        <span className="font-medium">Giá nhập:</span> {data.totalImportValue.toLocaleString('vi-VN')} VNĐ
                      </p>
                      <p className="text-sm text-green-600">
                        <span className="font-medium">Giá bán:</span> {data.totalSellValue.toLocaleString('vi-VN')} VNĐ
                      </p>
                      <p className={`text-sm font-bold ${data.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="font-medium">Lợi nhuận:</span> {data.profit.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Imports Table */}
        <div className="card">
          <div className="card-header">
            <Typography variant="h6" className="font-semibold text-gray-900">
              Chi tiết nhập vé ({imports.length} bản ghi)
            </Typography>
          </div>
          <div className="p-4 sm:p-6">
            {imports.length === 0 ? (
              <div className="text-center py-8">
                <InventoryIcon className="text-gray-400 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Chưa có vé nào được nhập</p>
                <p className="text-gray-400 text-sm">Nhấn "Nhập vé mới" để bắt đầu</p>
              </div>
            ) : (
              <TableContainer component={Paper} className="shadow-sm">
                <Table>
                  <TableHead>
                    <TableRow className="bg-gray-50">
                      <TableCell className="font-semibold">Tỉnh</TableCell>
                      <TableCell className="font-semibold">Mã vé</TableCell>
                      <TableCell className="font-semibold">Số lượng</TableCell>
                      <TableCell className="font-semibold">Giá nhập</TableCell>
                      <TableCell className="font-semibold">Giá bán</TableCell>
                      <TableCell className="font-semibold">Lợi nhuận</TableCell>
                      <TableCell className="font-semibold">Nguồn</TableCell>
                      <TableCell className="font-semibold">Ngày nhập</TableCell>
                      <TableCell className="font-semibold">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {imports.map((importItem) => (
                      <TableRow key={importItem.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <LocationIcon className="text-blue-500 text-sm" />
                            <span className="font-medium">{importItem.provinceName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {importItem.ticketNumber}
                        </TableCell>
                        <TableCell className="font-semibold text-blue-600">
                          {importItem.quantity.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-semibold text-red-600">
                          {importItem.importPrice.toLocaleString('vi-VN')} VNĐ
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {importItem.sellPrice.toLocaleString('vi-VN')} VNĐ
                        </TableCell>
                        <TableCell className={`font-semibold ${importItem.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {importItem.profit.toLocaleString('vi-VN')} VNĐ
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={importItem.supplier} 
                            size="small" 
                            className="bg-purple-100 text-purple-800"
                          />
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {dayjs(importItem.importDate).format('DD/MM/YYYY')}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(importItem)}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(importItem.id)}
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center space-x-2">
            <InventoryIcon className="text-blue-600" />
            <span>{editingImport ? 'Sửa nhập vé' : 'Nhập vé mới'}</span>
          </div>
        </DialogTitle>
        <DialogContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <TextField
                label="Mã vé"
                value={formData.ticketNumber}
                onChange={(e) => setFormData({ ...formData, ticketNumber: e.target.value })}
                fullWidth
                placeholder="Ví dụ: T2024001"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TextField
                label="Số lượng"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                fullWidth
                placeholder="Ví dụ: 1000"
              />
              <TextField
                label="Giá nhập (VNĐ)"
                type="number"
                value={formData.importPrice}
                onChange={(e) => setFormData({ ...formData, importPrice: e.target.value })}
                fullWidth
                placeholder="Ví dụ: 8000"
              />
              <TextField
                label="Giá bán (VNĐ)"
                type="number"
                value={formData.sellPrice}
                onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                fullWidth
                placeholder="Ví dụ: 10000"
              />
            </div>

            <FormControl fullWidth>
              <InputLabel>Nguồn nhập</InputLabel>
              <Select
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                label="Nguồn nhập"
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier} value={supplier}>
                    {supplier}
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

            {formData.quantity && formData.importPrice && formData.sellPrice && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-red-600">
                      <strong>Tổng giá nhập:</strong> {(parseInt(formData.quantity) * parseInt(formData.importPrice)).toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                  <div>
                    <p className="text-green-600">
                      <strong>Tổng giá bán:</strong> {(parseInt(formData.quantity) * parseInt(formData.sellPrice)).toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className={`font-bold ${(parseInt(formData.quantity) * (parseInt(formData.sellPrice) - parseInt(formData.importPrice))) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <strong>Lợi nhuận dự kiến:</strong> {(parseInt(formData.quantity) * (parseInt(formData.sellPrice) - parseInt(formData.importPrice))).toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </div>
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
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {editingImport ? 'Cập nhật' : 'Nhập vé'}
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

export default TicketImport;
