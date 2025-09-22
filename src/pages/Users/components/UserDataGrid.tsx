import React from 'react';
import { 
  Box, 
  Alert, 
  Button, 
  Typography, 
  Chip, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as ViewIcon
} from '@mui/icons-material';
import { formatDate } from '../../../utils/format';
import type { User, UserListResponse } from '../types';
import { USER_ROLES } from '../constants';

interface UserDataGridProps {
  data: UserListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  onRefresh: () => void;
  onViewDetail: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserDataGrid: React.FC<UserDataGridProps> = ({
  data,
  isLoading,
  error,
  onRefresh,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  console.log('UserDataGrid rendered with Table component');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRoleLabel = (role: string) => {
    const roleOption = USER_ROLES.find(r => r.value === role);
    return roleOption ? roleOption.label : role;
  };

  const getRoleColor = (role: string): 'primary' | 'secondary' | 'success' | 'warning' | 'default' => {
    switch (role) {
      case 'admin': return 'primary';
      case 'user': return 'secondary';
      case 'owner': return 'success';
      case 'employee': return 'warning';
      case 'seller': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (isActive: boolean): 'success' | 'error' => {
    return isActive ? 'success' : 'error';
  };

  const getStatusLabel = (isActive: boolean): string => {
    return isActive ? 'Hoạt động' : 'Không hoạt động';
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={onRefresh}>
              Thử lại
            </Button>
          }
        >
          Không thể tải danh sách người dùng: {(error as Error).message}
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  if (!data?.data?.data || data.data.data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Không có dữ liệu
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Chưa có người dùng nào trong hệ thống
        </Typography>
        <Button variant="outlined" onClick={onRefresh}>
          Làm mới
        </Button>
      </Box>
    );
  }

  const users = data.data.data;
  const total = data.data.total;

  // Pagination
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight: 600, mt: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>
                Tên người dùng
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>
                Số điện thoại
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>
                Vai trò
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>
                Tổ chức
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>
                Ngày tạo
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 120, textAlign: 'center' }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow 
                key={user.id} 
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {user.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.phone_number}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getRoleLabel(user.role)}
                    color={getRoleColor(user.role)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.organization?.name || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(user.is_active)}
                    color={getStatusColor(user.is_active)}
                    size="small"
                    variant="filled"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(user.created_at, 'DD/MM/YYYY')}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => onViewDetail(user)}
                        sx={{ color: 'primary.main' }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(user)}
                        sx={{ color: 'warning.main' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(user)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} của ${count !== -1 ? count : `nhiều hơn ${to}`}`
        }
      />
    </Box>
  );
};

export default UserDataGrid;