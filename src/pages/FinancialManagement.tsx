import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Box,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';

interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
  reference: string;
  status: 'completed' | 'pending' | 'cancelled';
}


const FinancialManagement = () => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('financialTransactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [tabValue, setTabValue] = useState(0);
  
  const [formData, setFormData] = useState({
    type: 'income',
    category: '',
    amount: '',
    description: '',
    paymentMethod: '',
    reference: '',
  });

  const incomeCategories = [
    'Bán vé số',
    'Hoa hồng đại lý',
    'Lãi ngân hàng',
    'Thu khác',
  ];

  const expenseCategories = [
    'Mua vé từ đài',
    'Lương nhân viên',
    'Chi phí vận hành',
    'Thuế',
    'Chi phí khác',
  ];

  const paymentMethods = [
    'Tiền mặt',
    'Chuyển khoản',
    'Thẻ tín dụng',
    'Ví điện tử',
  ];

  const handleOpenDialog = (transaction?: FinancialTransaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount.toString(),
        description: transaction.description,
        paymentMethod: transaction.paymentMethod,
        reference: transaction.reference,
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        type: 'income',
        category: '',
        amount: '',
        description: '',
        paymentMethod: '',
        reference: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTransaction(null);
    setFormData({
      type: 'income',
      category: '',
      amount: '',
      description: '',
      paymentMethod: '',
      reference: '',
    });
  };

  const handleSave = () => {
    if (!formData.category || !formData.amount || !formData.description) {
      setSnackbar({ open: true, message: 'Vui lòng điền đầy đủ thông tin', severity: 'error' });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setSnackbar({ open: true, message: 'Số tiền phải lớn hơn 0', severity: 'error' });
      return;
    }

    if (editingTransaction) {
      // Cập nhật
      const updatedTransactions = transactions.map(transaction => 
        transaction.id === editingTransaction.id 
          ? {
              ...transaction,
              type: formData.type as 'income' | 'expense',
              category: formData.category,
              amount: amount,
              description: formData.description,
              paymentMethod: formData.paymentMethod,
              reference: formData.reference,
            }
          : transaction
      );
      setTransactions(updatedTransactions);
      localStorage.setItem('financialTransactions', JSON.stringify(updatedTransactions));
      setSnackbar({ open: true, message: 'Cập nhật giao dịch thành công', severity: 'success' });
    } else {
      // Thêm mới
      const newTransaction: FinancialTransaction = {
        id: Date.now().toString(),
        type: formData.type as 'income' | 'expense',
        category: formData.category,
        amount: amount,
        description: formData.description,
        date: dayjs().format('YYYY-MM-DD'),
        paymentMethod: formData.paymentMethod,
        reference: formData.reference,
        status: 'completed',
      };
      
      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      localStorage.setItem('financialTransactions', JSON.stringify(updatedTransactions));
      setSnackbar({ open: true, message: 'Thêm giao dịch thành công', severity: 'success' });
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
    localStorage.setItem('financialTransactions', JSON.stringify(updatedTransactions));
    setSnackbar({ open: true, message: 'Xóa giao dịch thành công', severity: 'success' });
  };

  // Tính toán thống kê
  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;


  const StatCard = ({ title, value, icon, color, trend, subtitle }: any) => (
    <Card className="stat-card">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${color} truncate`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ml-2 ${color === 'text-green-600' ? 'bg-green-100' : color === 'text-red-600' ? 'bg-red-100' : 'bg-blue-100'}`}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className="flex items-center mt-2">
            {trend > 0 ? (
              <TrendingUpIcon className="text-green-500 text-sm mr-1" />
            ) : (
              <TrendingDownIcon className="text-red-500 text-sm mr-1" />
            )}
            <span className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(trend)}% so với kỳ trước
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-100 to-green-50 rounded-xl shadow-sm">
                <MoneyIcon className="text-green-600 text-xl sm:text-2xl" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Quản lý tài chính
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Theo dõi thu chi và dòng tiền</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                className="text-gray-600 border-gray-300"
              >
                In báo cáo
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                className="text-gray-600 border-gray-300"
              >
                Xuất Excel
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Thêm giao dịch
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <StatCard
              title="Tổng thu nhập"
              value={`${totalIncome.toLocaleString('vi-VN')} VNĐ`}
              icon={<TrendingUpIcon className="text-green-600 text-lg sm:text-xl lg:text-2xl" />}
              color="text-green-600"
              trend={8.5}
              subtitle="Tăng 8.5% so với kỳ trước"
            />
          </div>
          <div>
            <StatCard
              title="Tổng chi phí"
              value={`${totalExpense.toLocaleString('vi-VN')} VNĐ`}
              icon={<TrendingDownIcon className="text-red-600 text-lg sm:text-xl lg:text-2xl" />}
              color="text-red-600"
              trend={-5.2}
              subtitle="Giảm 5.2% so với kỳ trước"
            />
          </div>
          <div>
            <StatCard
              title="Lợi nhuận ròng"
              value={`${netProfit.toLocaleString('vi-VN')} VNĐ`}
              icon={<MoneyIcon className="text-blue-600 text-lg sm:text-xl lg:text-2xl" />}
              color="text-blue-600"
              trend={15.8}
              subtitle={`Biên lợi nhuận: ${profitMargin.toFixed(1)}%`}
            />
          </div>
          <div>
            <StatCard
              title="Số giao dịch"
              value={`${transactions.length}`}
              icon={<ReceiptIcon className="text-purple-600 text-lg sm:text-xl lg:text-2xl" />}
              color="text-purple-600"
              trend={12.3}
              subtitle="Tăng 12.3% so với kỳ trước"
            />
          </div>
        </div>

        {/* Tabs */}
        <Card className="card">
          <Box className="card-header">
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Dòng tiền" />
              <Tab label="Giao dịch" />
              <Tab label="Phân tích thu chi" />
              <Tab label="Báo cáo thuế" />
            </Tabs>
          </Box>
          <CardContent className="p-4 sm:p-6">
            {tabValue === 0 && (
              <div className="space-y-6">
                <Typography variant="h6" className="font-semibold text-gray-900 mb-4">
                  Biểu đồ dòng tiền 30 ngày qua
                </Typography>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Typography variant="subtitle1" className="font-medium text-gray-700 mb-3">
                        Thu chi theo ngày
                      </Typography>
                      <div className="h-64 flex items-center justify-center text-gray-500">
                        Biểu đồ dòng tiền (cần tích hợp Recharts)
                      </div>
                    </div>
                  </div>
                  <div>
                    <Typography variant="subtitle1" className="font-medium text-gray-700 mb-3">
                      Tổng quan dòng tiền
                    </Typography>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-green-700 font-medium">Thu nhập TB/ngày</span>
                        <span className="text-green-600 font-bold">
                          {Math.round(totalIncome / 30).toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-red-700 font-medium">Chi phí TB/ngày</span>
                        <span className="text-red-600 font-bold">
                          {Math.round(totalExpense / 30).toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-700 font-medium">Lợi nhuận TB/ngày</span>
                        <span className="text-blue-600 font-bold">
                          {Math.round(netProfit / 30).toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tabValue === 1 && (
              <div className="space-y-6">
                <Typography variant="h6" className="font-semibold text-gray-900 mb-4">
                  Danh sách giao dịch ({transactions.length} giao dịch)
                </Typography>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <ReceiptIcon className="text-gray-400 text-6xl mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Chưa có giao dịch nào</p>
                    <p className="text-gray-400 text-sm">Nhấn "Thêm giao dịch" để bắt đầu</p>
                  </div>
                ) : (
                  <TableContainer component={Paper} className="shadow-sm">
                    <Table>
                      <TableHead>
                        <TableRow className="bg-gray-50">
                          <TableCell className="font-semibold">Ngày</TableCell>
                          <TableCell className="font-semibold">Loại</TableCell>
                          <TableCell className="font-semibold">Danh mục</TableCell>
                          <TableCell className="font-semibold">Mô tả</TableCell>
                          <TableCell className="font-semibold">Số tiền</TableCell>
                          <TableCell className="font-semibold">Phương thức</TableCell>
                          <TableCell className="font-semibold">Trạng thái</TableCell>
                          <TableCell className="font-semibold">Thao tác</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id} className="hover:bg-gray-50">
                            <TableCell className="text-gray-600 text-sm">
                              {dayjs(transaction.date).format('DD/MM/YYYY')}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={transaction.type === 'income' ? 'Thu' : 'Chi'}
                                color={transaction.type === 'income' ? 'success' : 'error'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell className="font-medium">{transaction.category}</TableCell>
                            <TableCell className="text-gray-600 text-sm max-w-xs truncate">
                              {transaction.description}
                            </TableCell>
                            <TableCell className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.amount.toLocaleString('vi-VN')} VNĐ
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm">
                              {transaction.paymentMethod}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={transaction.status === 'completed' ? 'Hoàn thành' : transaction.status === 'pending' ? 'Chờ xử lý' : 'Đã hủy'}
                                color={transaction.status === 'completed' ? 'success' : transaction.status === 'pending' ? 'warning' : 'default'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog(transaction)}
                                  className="text-blue-600 hover:bg-blue-50"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(transaction.id)}
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
            )}

            {tabValue === 2 && (
              <div className="space-y-6">
                <Typography variant="h6" className="font-semibold text-gray-900 mb-4">
                  Phân tích thu chi theo danh mục
                </Typography>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Typography variant="subtitle1" className="font-medium text-gray-700 mb-3">
                      Thu nhập theo danh mục
                    </Typography>
                    <div className="space-y-2">
                      {incomeCategories.map((category) => {
                        const amount = transactions
                          .filter(t => t.type === 'income' && t.category === category && t.status === 'completed')
                          .reduce((sum, t) => sum + t.amount, 0);
                        const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
                        return (
                          <div key={category} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="font-medium text-green-700">{category}</span>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">
                                {amount.toLocaleString('vi-VN')} VNĐ
                              </p>
                              <p className="text-xs text-green-500">{percentage.toFixed(1)}%</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <Typography variant="subtitle1" className="font-medium text-gray-700 mb-3">
                      Chi phí theo danh mục
                    </Typography>
                    <div className="space-y-2">
                      {expenseCategories.map((category) => {
                        const amount = transactions
                          .filter(t => t.type === 'expense' && t.category === category && t.status === 'completed')
                          .reduce((sum, t) => sum + t.amount, 0);
                        const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
                        return (
                          <div key={category} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <span className="font-medium text-red-700">{category}</span>
                            <div className="text-right">
                              <p className="font-semibold text-red-600">
                                {amount.toLocaleString('vi-VN')} VNĐ
                              </p>
                              <p className="text-xs text-red-500">{percentage.toFixed(1)}%</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tabValue === 3 && (
              <div className="space-y-6">
                <Typography variant="h6" className="font-semibold text-gray-900 mb-4">
                  Báo cáo thuế
                </Typography>
                <Alert severity="info" className="mb-4">
                  Báo cáo thuế sẽ được tự động tính toán dựa trên các giao dịch thu nhập.
                </Alert>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <Typography variant="subtitle1" className="font-medium text-gray-700 mb-4">
                      Tổng quan thuế
                    </Typography>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tổng thu nhập chịu thuế:</span>
                        <span className="font-semibold">{totalIncome.toLocaleString('vi-VN')} VNĐ</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Thuế suất (10%):</span>
                        <span className="font-semibold text-red-600">
                          {(totalIncome * 0.1).toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-3">
                        <span className="text-gray-600 font-medium">Thu nhập sau thuế:</span>
                        <span className="font-bold text-green-600">
                          {(totalIncome * 0.9).toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <Typography variant="subtitle1" className="font-medium text-gray-700 mb-4">
                      Hướng dẫn kê khai
                    </Typography>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Thu nhập từ bán vé số: {totalIncome.toLocaleString('vi-VN')} VNĐ</p>
                      <p>• Thuế TNCN (10%): {(totalIncome * 0.1).toLocaleString('vi-VN')} VNĐ</p>
                      <p>• Kê khai theo quý: Q{Math.ceil(dayjs().month() / 3)}/{dayjs().year()}</p>
                      <p>• Hạn nộp: 30 ngày sau khi kết thúc quý</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle className="bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center space-x-2">
            <MoneyIcon className="text-green-600" />
            <span>{editingTransaction ? 'Sửa giao dịch' : 'Thêm giao dịch mới'}</span>
          </div>
        </DialogTitle>
        <DialogContent className="p-6">
          <div className="space-y-4">
            <FormControl fullWidth>
              <InputLabel>Loại giao dịch</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                label="Loại giao dịch"
              >
                <MenuItem value="income">Thu nhập</MenuItem>
                <MenuItem value="expense">Chi phí</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                label="Danh mục"
              >
                {(formData.type === 'income' ? incomeCategories : expenseCategories).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Số tiền (VNĐ)"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              fullWidth
              placeholder="Nhập số tiền"
            />

            <TextField
              label="Mô tả"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
              placeholder="Mô tả giao dịch"
            />

            <FormControl fullWidth>
              <InputLabel>Phương thức thanh toán</InputLabel>
              <Select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                label="Phương thức thanh toán"
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Mã tham chiếu"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              fullWidth
              placeholder="Mã giao dịch, số hóa đơn..."
            />
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
            {editingTransaction ? 'Cập nhật' : 'Thêm'}
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

export default FinancialManagement;
