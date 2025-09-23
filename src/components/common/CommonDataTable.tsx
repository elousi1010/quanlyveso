import React from 'react';
import { 
  Box, 
  Alert, 
  Button, 
  Typography, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Checkbox
} from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon } from '@mui/icons-material';
import { CommonDetailDrawer, CommonViewEditDrawer, type DetailField, type FormField } from './index';

export interface TableColumn {
  key: string;
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: unknown) => React.ReactNode;
}

export interface TableAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
  onClick: (row: unknown) => void;
}

interface CommonDataTableProps<T = unknown> {
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
  onRowClick?: (row: unknown) => void;
  onEdit?: (row: unknown) => void;
  onDelete?: (row: unknown) => void;
  selectedRows?: unknown[];
  onSelectionChange?: (rows: unknown[]) => void;
  config?: Record<string, unknown>;
  enableCheckbox?: boolean;
  getRowId?: (row: T) => string | number;
  // Drawer props
  detailFields?: DetailField[];
  editFields?: FormField[];
  onSave?: (data: Record<string, any>) => Promise<void>;
  enableViewDetail?: boolean;
  enableEdit?: boolean;
  detailTitle?: string;
  editTitle?: string;
}

const CommonDataTable = <T extends Record<string, unknown>>({
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
  selectedRows = [],
  onSelectionChange,
  enableCheckbox = false,
  getRowId = (row: T) => (row as { id?: string | number }).id || Math.random().toString(),
  config,
  // Drawer props
  detailFields = [],
  editFields = [],
  onSave,
  enableViewDetail = false,
  enableEdit = false,
  detailTitle = 'Chi tiết',
  editTitle = 'Chỉnh sửa',
}: CommonDataTableProps<T>) => {
  const [internalPage, setInternalPage] = React.useState(0);
  const [internalRowsPerPage, setInternalRowsPerPage] = React.useState(10);
  
  // Drawer states
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerMode, setDrawerMode] = React.useState<'view' | 'edit'>('view');
  const [selectedRow, setSelectedRow] = React.useState<T | null>(null);
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

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

  // Drawer handlers
  const handleViewDetail = (row: T) => {
    setSelectedRow(row);
    setDrawerMode('view');
    setDrawerOpen(true);
    setSaveError(null);
  };

  const handleEdit = (row: T) => {
    setSelectedRow(row);
    setDrawerMode('edit');
    setDrawerOpen(true);
    setSaveError(null);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedRow(null);
    setSaveError(null);
  };

  const handleSave = async (data: Record<string, any>) => {
    if (!onSave) return;
    
    try {
      setSaveLoading(true);
      setSaveError(null);
      await onSave(data);
      setDrawerOpen(false);
      setSelectedRow(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu dữ liệu');
    } finally {
      setSaveLoading(false);
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


  // Pagination
  const startIndex = currentPage * currentRowsPerPage;
  const endIndex = startIndex + currentRowsPerPage;
  const safeData = Array.isArray(data) ? data : [];
  const paginatedData = safeData.slice(startIndex, endIndex);
  const totalCount = total || safeData.length;

  // Checkbox handling
  const isSelected = (row: T) => {
    const rowId = getRowId(row);
    return selectedRows.some(selectedRow => getRowId(selectedRow as T) === rowId);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = paginatedData.filter(row => !isSelected(row));
      if (onSelectionChange) {
        onSelectionChange([...selectedRows, ...newSelected]);
      }
    } else {
      const newSelected = selectedRows.filter(selectedRow => 
        !paginatedData.some(row => getRowId(row) === getRowId(selectedRow as T))
      );
      if (onSelectionChange) {
        onSelectionChange(newSelected);
      }
    }
  };

  const handleRowSelect = (event: React.ChangeEvent<HTMLInputElement>, row: T) => {
    if (event.target.checked) {
      if (onSelectionChange) {
        onSelectionChange([...selectedRows, row]);
      }
    } else {
      if (onSelectionChange) {
        onSelectionChange(selectedRows.filter(selectedRow => 
          getRowId(selectedRow as T) !== getRowId(row)
        ));
      }
    }
  };

  const numSelected = paginatedData.filter(row => isSelected(row)).length;
  const isAllSelected = paginatedData.length > 0 && numSelected === paginatedData.length;
  const isIndeterminate = numSelected > 0 && numSelected < paginatedData.length;

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight: 600, mt: 2 }}>
        <Table stickyHeader {...config}>
          <TableHead>
            <TableRow>
              {enableCheckbox && (
                <TableCell padding="checkbox" sx={{ minWidth: 50 }}>
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all items' }}
                  />
                </TableCell>
              )}
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
              {(actions.length > 0 || enableViewDetail || enableEdit) && (
                <TableCell sx={{ fontWeight: 'bold', minWidth: 120, textAlign: 'center' }}>
                  Thao tác
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow 
                key={index} 
                hover
                selected={isSelected(row)}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {enableCheckbox && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected(row)}
                      onChange={(event) => handleRowSelect(event, row)}
                      inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${index}` }}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell 
                    key={column.key}
                    sx={{ textAlign: column.align || 'left' }}
                  >
                    {column.render 
                      ? column.render(row[column.key], row) as React.ReactNode
                      : (row[column.key] as React.ReactNode) || '-'
                    }
                  </TableCell>
                ))}
                {(actions.length > 0 || enableViewDetail || enableEdit) && (
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      {enableViewDetail && (
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetail(row)}
                            sx={{ color: 'primary.main' }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {enableEdit && (
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(row)}
                            sx={{ color: 'warning.main' }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {actions.map((action) => (
                        <Tooltip key={action.key} title={action.label}>
                          <IconButton
                            size="small"
                            onClick={() => action.onClick(row as unknown)}
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

      {/* Drawer Components */}
      {enableViewDetail && detailFields.length > 0 && selectedRow && (
        <CommonDetailDrawer
          open={drawerOpen && drawerMode === 'view'}
          onClose={handleCloseDrawer}
          title={detailTitle}
          data={selectedRow}
          fields={detailFields}
        />
      )}

      {enableEdit && editFields.length > 0 && selectedRow && onSave && (
        <CommonViewEditDrawer
          open={drawerOpen && drawerMode === 'edit'}
          onClose={handleCloseDrawer}
          title={editTitle}
          data={selectedRow}
          viewFields={detailFields}
          editFields={editFields}
          onSave={handleSave}
          loading={saveLoading}
          error={saveError}
        />
      )}
    </Box>
  );
};

export default CommonDataTable;
