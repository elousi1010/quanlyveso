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

export interface TableColumn {
  key: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
  onClick: (row: any) => void;
}

interface CommonDataTableProps<T = any> {
  data: T[] | undefined;
  columns: TableColumn[];
  actions?: TableAction[];
  isLoading: boolean;
  error: unknown;
  onRefresh: () => void;
  emptyMessage?: string;
  emptyDescription?: string;
  page?: number;
  rowsPerPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

const CommonDataTable = <T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  isLoading,
  error,
  onRefresh,
  emptyMessage = 'Không có dữ liệu',
  emptyDescription = 'Chưa có dữ liệu nào trong hệ thống',
  page = 0,
  rowsPerPage = 10,
  total = 0,
  onPageChange,
  onRowsPerPageChange,
}: CommonDataTableProps<T>) => {
  const [internalPage, setInternalPage] = React.useState(0);
  const [internalRowsPerPage, setInternalRowsPerPage] = React.useState(10);

  const currentPage = onPageChange !== undefined ? page : internalPage;
  const currentRowsPerPage = onRowsPerPageChange !== undefined ? rowsPerPage : internalRowsPerPage;

  const handleChangePage = (event: unknown, newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (onRowsPerPageChange) {
      onRowsPerPageChange(newRowsPerPage);
    } else {
      setInternalRowsPerPage(newRowsPerPage);
    }
    if (onPageChange) {
      onPageChange(0);
    } else {
      setInternalPage(0);
    }
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
          Không thể tải dữ liệu: {(error as Error).message}
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

  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {emptyMessage}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {emptyDescription}
        </Typography>
        <Button variant="outlined" onClick={onRefresh}>
          Làm mới
        </Button>
      </Box>
    );
  }

  // Debug logging
  console.log('CommonDataTable data:', data);
  console.log('CommonDataTable data type:', typeof data);
  console.log('CommonDataTable isArray:', Array.isArray(data));

  // Pagination
  const startIndex = currentPage * currentRowsPerPage;
  const endIndex = startIndex + currentRowsPerPage;
  const safeData = Array.isArray(data) ? data : [];
  const paginatedData = safeData.slice(startIndex, endIndex);
  const totalCount = total || safeData.length;

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight: 600, mt: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.key}
                  sx={{ 
                    fontWeight: 'bold', 
                    minWidth: column.minWidth || 120,
                    textAlign: column.align || 'left'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell sx={{ fontWeight: 'bold', minWidth: 120, textAlign: 'center' }}>
                  Thao tác
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow 
                key={row.id || index} 
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={column.key}
                    sx={{ textAlign: column.align || 'left' }}
                  >
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      {actions.map((action) => (
                        <Tooltip key={action.key} title={action.label}>
                          <IconButton
                            size="small"
                            onClick={() => action.onClick(row)}
                            sx={{ color: action.color || 'primary.main' }}
                          >
                            {action.icon}
                          </IconButton>
                        </Tooltip>
                      ))}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={currentRowsPerPage}
        page={currentPage}
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

export default CommonDataTable;
