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
import { mockPartners } from '../../../data/mockData';
import type { Partner, PartnerListResponse } from '../types';

interface PartnerDataGridProps {
  data: PartnerListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  onRefresh: () => void;
  onViewDetail: (partner: Partner) => void;
}

const PartnerDataGrid: React.FC<PartnerDataGridProps> = ({
  data,
  isLoading,
  error,
  onRefresh,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getTypeConfig = (type: string) => {
    const typeConfig = {
      agent: { label: 'Đại lý', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.1)' },
      seller: { label: 'Người bán', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.1)' },
      customer: { label: 'Khách hàng', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.1)' },
      supplier: { label: 'Nhà cung cấp', color: '#9C27B0', bgColor: 'rgba(156, 39, 176, 0.1)' },
      other: { label: 'Khác', color: '#607D8B', bgColor: 'rgba(96, 125, 139, 0.1)' },
    };
    return typeConfig[type as keyof typeof typeConfig] || typeConfig.other;
  };

  if (isLoading) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)', opacity: 1 },
                '50%': { transform: 'scale(1.1)', opacity: 0.7 },
                '100%': { transform: 'scale(1)', opacity: 1 },
              }
            }}
          >
            <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '1.2rem' }}>P</Typography>
          </Box>
          <Typography variant="h6" color="text.primary" fontWeight={600}>
            Đang tải danh sách đối tác...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vui lòng chờ trong giây lát
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Extract partners array from API response
  // API returns { data: { data: Partner[], total: number } } or { data: Partner[] }
  const displayPartners = Array.isArray(data?.data) 
    ? data.data 
    : (data?.data && typeof data.data === 'object' && 'data' in data.data) 
      ? (data.data as { data: Partner[] }).data 
      : []; 
  
  // Debug logging
  console.log('Partners API Debug:', {
    isLoading,
    error,
    data,
    dataData: data?.data, // This might be { data: Partner[], total: number } or Partner[]
    isArray: Array.isArray(data?.data),
    displayPartners, // This should be Partner[]
    partnersCount: displayPartners.length
  });

  // If no data and not loading, show mock data for testing
  const finalDisplayPartners = displayPartners.length > 0 ? displayPartners : mockPartners;

  return (
    <Box>
      {/* Show error message if API fails, but still show the UI */}
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Không thể tải dữ liệu từ API. Đang hiển thị dữ liệu mẫu để test.
          <Button onClick={() => onRefresh()} sx={{ ml: 2 }}>
            Thử lại
          </Button>
        </Alert>
      )}

      {/* Show info when using mock data */}
      {!error && !isLoading && displayPartners.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Không có dữ liệu từ API. Đang hiển thị dữ liệu mẫu để test.
        </Alert>
      )}

      {/* Table with horizontal scroll */}
      <Paper 
        elevation={0}
        sx={{ 
          width: '100%',
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          overflow: 'hidden'
        }}
      >
        <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ 
                '& .MuiTableCell-head': {
                  fontWeight: 600,
                  color: '#495057',
                  fontSize: '0.875rem',
                  backgroundColor: '#f8f9fa',
                  borderBottom: '2px solid #dee2e6',
                  whiteSpace: 'nowrap'
                }
              }}>
                <TableCell>Tên đối tác</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Cấp độ</TableCell>
                <TableCell>Nợ (VNĐ)</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="center" sx={{ minWidth: 120 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {finalDisplayPartners
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((partner) => {
                  const typeConfig = getTypeConfig(partner.type);
                  return (
                    <TableRow
                      key={partner.id}
                      sx={{
                        '&:nth-of-type(even)': {
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(33, 150, 243, 0.04)',
                        },
                        '& .MuiTableCell-root': {
                          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                          fontSize: '0.875rem',
                          py: 1.5
                        }
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ fontSize: '0.875rem' }}>
                            {partner.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            {partner.organization?.name || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ 
                          fontFamily: 'monospace',
                          color: 'text.secondary',
                          fontSize: '0.875rem'
                        }}>
                          {partner.phone_number}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          fontSize: '0.875rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {partner.address}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={typeConfig.label}
                          size="small"
                          sx={{
                            background: typeConfig.bgColor,
                            color: typeConfig.color,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 24
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`Cấp ${partner.level}`}
                          size="small"
                          sx={{
                            background: 'rgba(33, 150, 243, 0.1)',
                            color: '#1976D2',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 24
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: partner.debt > 0 ? '#F44336' : '#4CAF50',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            fontFamily: 'monospace'
                          }}
                        >
                          {partner.debt.toLocaleString('vi-VN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={partner.is_active ? 'Hoạt động' : 'Không hoạt động'}
                          size="small"
                          sx={{
                            background: partner.is_active 
                              ? 'rgba(76, 175, 80, 0.1)' 
                              : 'rgba(244, 67, 54, 0.1)',
                            color: partner.is_active ? '#2E7D32' : '#C62828',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 24
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          {formatDate(partner.created_at, 'DD/MM/YYYY')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <Tooltip title="Xem chi tiết">
                            <IconButton
                              size="small"
                              onClick={() => onViewDetail(partner)}
                              sx={{ 
                                color: '#2196F3',
                                '&:hover': { background: 'rgba(33, 150, 243, 0.1)' }
                              }}
                            >
                              <ViewIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              size="small"
                              onClick={() => onEdit(partner)}
                              sx={{ 
                                color: '#FF9800',
                                '&:hover': { background: 'rgba(255, 152, 0, 0.1)' }
                              }}
                            >
                              <EditIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              onClick={() => onDelete(partner)}
                              sx={{ 
                                color: '#F44336',
                                '&:hover': { background: 'rgba(244, 67, 54, 0.1)' }
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={finalDisplayPartners.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #dee2e6'
          }}
        />
      </Paper>
    </Box>
  );
};

export default PartnerDataGrid;
