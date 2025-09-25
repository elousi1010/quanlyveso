import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

export interface SimpleTableColumn {
  key: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: unknown) => React.ReactNode;
}

export interface SimpleTableAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  onClick: (row: unknown) => void;
}

interface SimpleTableProps {
  data: unknown[] | undefined;
  columns: SimpleTableColumn[];
  actions?: SimpleTableAction[];
  loading?: boolean;
  error?: unknown;
  onRefresh?: () => void;
  emptyMessage?: string;
  // Pagination
  page?: number;
  rowsPerPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  // Styling
  maxHeight?: number;
  stickyHeader?: boolean;
}

const SimpleTable: React.FC<SimpleTableProps> = ({
  data = [],
  columns,
  actions = [],
  loading = false,
  error,
  onRefresh,
  emptyMessage = 'Không có dữ liệu',
  page = 0,
  rowsPerPage = 10,
  total = 0,
  onPageChange,
  onRowsPerPageChange,
  maxHeight = 600,
  stickyHeader = true,
}) => {
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

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            onRefresh ? (
              <Button color="inherit" size="small" onClick={onRefresh} startIcon={<RefreshIcon />}>
                Thử lại
              </Button>
            ) : undefined
          }
        >
          Không thể tải dữ liệu: {(error as Error).message}
        </Alert>
      </Box>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography component="span">Đang tải...</Typography>
      </Box>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {emptyMessage}
        </Typography>
        {onRefresh && (
          <Button variant="outlined" onClick={onRefresh} startIcon={<RefreshIcon />} sx={{ mt: 1 }}>
            Làm mới
          </Button>
        )}
      </Box>
    );
  }

  // Pagination
  const startIndex = currentPage * currentRowsPerPage;
  const endIndex = startIndex + currentRowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);
  const totalCount = total || data.length;

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight, mt: 2 }}>
        <Table stickyHeader={stickyHeader}>
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
            {paginatedData.map((row, index) => {
              // Try to get a unique identifier from the row, fallback to index
              const rowKey = (row as Record<string, unknown>).id || 
                            (row as Record<string, unknown>).key || 
                            `row-${index}`;
              
              return (
                <TableRow 
                  key={String(rowKey)} 
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                {columns.map((column) => (
                  <TableCell 
                    key={column.key}
                    sx={{ textAlign: column.align || 'left' }}
                  >
                    {column.render 
                      ? column.render((row as Record<string, unknown>)[column.key], row) as React.ReactNode
                      : ((row as Record<string, unknown>)[column.key] as React.ReactNode) || '-'
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
                            color={action.color || 'primary'}
                          >
                            {action.icon}
                          </IconButton>
                        </Tooltip>
                      ))}
                    </Box>
                  </TableCell>
                )}
                </TableRow>
              );
            })}
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

export default SimpleTable;
