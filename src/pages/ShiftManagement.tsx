import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { mockShifts, mockShiftPerformances, mockEmployees, mockShiftAssignments } from '../data/mockData';
import type { Shift } from '../types/employee';
import dayjs from 'dayjs';

const ShiftManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [shifts, setShifts] = useState(mockShifts);
  const [shiftPerformances] = useState(mockShiftPerformances);
  const [tabValue, setTabValue] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    startTime: '08:00',
    endTime: '17:00',
    description: '',
  });

  const handleOpenDialog = (shift?: Shift) => {
    if (shift) {
      setEditingShift(shift);
      setFormData({
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        description: '',
      });
    } else {
      setEditingShift(null);
      setFormData({
        name: '',
        startTime: '08:00',
        endTime: '17:00',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingShift(null);
  };

  const handleSaveShift = () => {
    if (editingShift) {
      setShifts(shifts.map(s =>
        s.id === editingShift.id
          ? { ...s, ...formData }
          : s
      ));
    } else {
      const newShift: Shift = {
        id: Date.now().toString(),
        name: formData.name,
        startTime: formData.startTime,
        endTime: formData.endTime,
        isActive: true,
      };
      setShifts([...shifts, newShift]);
    }
    handleCloseDialog();
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const shiftColumns: GridColDef[] = [
    { field: 'name', headerName: 'Tên ca', width: 200, flex: 1 },
    { 
      field: 'startTime', 
      headerName: 'Giờ bắt đầu', 
      width: 120,
      renderCell: (params) => (
        <span className="font-semibold text-blue-600 text-sm">
          {params.value}
        </span>
      )
    },
    { 
      field: 'endTime', 
      headerName: 'Giờ kết thúc', 
      width: 120,
      renderCell: (params) => (
        <span className="font-semibold text-red-600 text-sm">
          {params.value}
        </span>
      )
    },
    { 
      field: 'assignedEmployee', 
      headerName: 'Người trực', 
      width: 200,
      flex: 1,
      renderCell: (params) => {
        // Tìm nhân viên được phân công cho ca này hôm nay
        const today = dayjs().format('YYYY-MM-DD');
        const assignment = mockShiftAssignments.find(
          a => a.shiftId === params.row.id && 
               dayjs(a.date).format('YYYY-MM-DD') === today
        );
        
        if (assignment) {
          const employee = mockEmployees.find(e => e.id === assignment.employeeId);
          return (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <PersonIcon className="text-blue-600 text-sm" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{employee?.fullName || 'N/A'}</p>
                <p className="text-xs text-gray-500">{employee?.position || ''}</p>
              </div>
            </div>
          );
        } else {
          return (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <PersonIcon className="text-gray-400 text-sm" />
              </div>
              <div>
                <p className="text-gray-500 text-sm italic">Chưa phân công</p>
              </div>
            </div>
          );
        }
      }
    },
    { 
      field: 'status', 
      headerName: 'Trạng thái', 
      width: 120,
      renderCell: (params) => {
        const today = dayjs().format('YYYY-MM-DD');
        const assignment = mockShiftAssignments.find(
          a => a.shiftId === params.row.id && 
               dayjs(a.date).format('YYYY-MM-DD') === today
        );
        
        if (assignment) {
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              assignment.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : assignment.status === 'scheduled'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {assignment.status === 'completed' ? 'Hoàn thành' : 
               assignment.status === 'scheduled' ? 'Đang làm' : 'Chờ bắt đầu'}
            </span>
          );
        } else {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              Chưa phân công
            </span>
          );
        }
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Thao tác',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Sửa"
          onClick={() => handleOpenDialog(params.row)}
        />,
      ],
    },
  ];

  const performanceColumns: GridColDef[] = [
    { 
      field: 'employeeId', 
      headerName: 'Nhân viên', 
      width: 200,
      renderCell: (params) => {
        const employee = mockEmployees.find(e => e.id === params.value);
        return employee?.fullName || params.value;
      }
    },
    { 
      field: 'shiftId', 
      headerName: 'Ca làm việc', 
      width: 150,
      renderCell: (params) => {
        const shift = shifts.find(s => s.id === params.value);
        return shift?.name || params.value;
      }
    },
    { 
      field: 'date', 
      headerName: 'Ngày', 
      width: 120,
      renderCell: (params) => dayjs(params.value).format('DD/MM/YYYY')
    },
    { 
      field: 'revenue', 
      headerName: 'Doanh số', 
      width: 150,
      renderCell: (params) => (
        <span className="font-semibold text-green-600">
          {params.value.toLocaleString('vi-VN')} VNĐ
        </span>
      )
    },
    { 
      field: 'profit', 
      headerName: 'Lợi nhuận', 
      width: 150,
      renderCell: (params) => (
        <span className={`font-semibold ${params.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {params.value.toLocaleString('vi-VN')} VNĐ
        </span>
      )
    },
    { 
      field: 'ticketsSold', 
      headerName: 'Vé bán được', 
      width: 120,
      type: 'number'
    },
  ];

  const totalShifts = shifts.length;
  const totalPerformance = shiftPerformances.length;
  const totalSales = shiftPerformances.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const totalProfit = shiftPerformances.reduce((sum, p) => sum + p.profit, 0);
  const averageProfit = totalProfit / shiftPerformances.length;

  return (
    <div className="min-h-screen bg-gray-50 mt-2">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-100 to-cyan-50 rounded-xl shadow-sm">
                <ScheduleIcon className="text-cyan-600 text-xl sm:text-2xl" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Quản lý ca làm việc
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Quản lý ca làm việc và hiệu suất nhân viên</p>
              </div>
            </div>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-4 sm:px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Thêm ca mới
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
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng ca làm việc</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalShifts}</p>
              </div>
              <div className="p-2 sm:p-3 bg-cyan-100 rounded-full flex-shrink-0 ml-2">
                <ScheduleIcon className="text-cyan-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="stat-card-success">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng hiệu suất</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">{totalPerformance}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0 ml-2">
                <AssessmentIcon className="text-blue-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="stat-card-success">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng doanh số</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 truncate">
                  {totalSales.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0 ml-2">
                <TrendingUpIcon className="text-green-600 text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className={`${averageProfit >= 0 ? 'stat-card-success' : 'stat-card-error'}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Lợi nhuận TB</p>
                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold truncate ${averageProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.round(averageProfit).toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ml-2 ${averageProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <PersonIcon className={`text-lg sm:text-xl lg:text-2xl ${averageProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="card-header">
            <Tabs value={tabValue} onChange={handleTabChange} className="min-h-0">
              <Tab 
                label={`Ca làm việc (${shifts.length})`} 
                className="text-sm sm:text-base"
              />
              <Tab 
                label={`Hiệu suất (${shiftPerformances.length})`} 
                className="text-sm sm:text-base"
              />
            </Tabs>
          </div>
          <div className="p-6">
            {tabValue === 0 ? (
              <DataGrid
                rows={shifts}
                columns={shiftColumns}
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
            ) : (
              <DataGrid
                rows={shiftPerformances}
                columns={performanceColumns}
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
            )}
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
          {editingShift ? 'Sửa ca làm việc' : 'Thêm ca mới'}
        </DialogTitle>
        <DialogContent className="space-y-4">
          <TextField
            fullWidth
            label="Tên ca"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Giờ bắt đầu"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Giờ kết thúc"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
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
            onClick={handleSaveShift} 
            variant="contained"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            {editingShift ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShiftManagement;