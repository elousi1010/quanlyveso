import React from 'react';
import { CommonDataTable, type TableColumn } from '@/components/common';
import { 
  Chip, 
  Box, 
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Visibility,
  Edit,
  Delete
} from '@mui/icons-material';
import type { Permission } from '../types';

interface PermissionDataGridProps {
  data: Permission[];
  loading: boolean;
  onEdit: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
  onView: (permission: Permission) => void;
  selectedRows: Permission[];
  onSelectionChange: (permissions: Permission[]) => void;
}

export const PermissionDataGrid: React.FC<PermissionDataGridProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  selectedRows,
  onSelectionChange,
}) => {
  

  const handleRowClick = (permission: Permission) => {
    onView(permission);
  };

  const handleEdit = (permission: Permission) => {
    onEdit(permission);
  };

  const handleDelete = (permission: Permission) => {
    onDelete(permission);
  };

  // Helper function to render permission badges
  const renderPermissionBadges = (actions: Record<string, number>) => {
    return Object.entries(actions || {}).map(([resource, value]) => {
      const permissions = [];
      if (value & 1) permissions.push('Đọc');
      if (value & 2) permissions.push('Tạo');
      if (value & 4) permissions.push('Cập nhật');
      if (value & 8) permissions.push('Xóa');
      
      const hasPermissions = permissions.length > 0;
      
      return (
        <Box key={resource} sx={{ mb: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 0.5,
            p: 1,
            borderRadius: 1,
            background: hasPermissions ? '#f8f9fa' : '#f5f5f5',
            border: `1px solid ${hasPermissions ? '#dee2e6' : '#e9ecef'}`
          }}>
            <Typography sx={{ 
              fontSize: '12px', 
              mr: 0.5,
              fontWeight: 500,
              color: hasPermissions ? 'text.primary' : 'text.secondary'
            }}>
              {resource.toUpperCase()}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: hasPermissions ? 'text.primary' : 'text.secondary',
              fontWeight: 500,
              fontSize: '11px'
            }}>
              {hasPermissions ? `${permissions.length} quyền` : 'Không có quyền'}
            </Typography>
          </Box>
          
          {hasPermissions && (
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 0.5, 
              ml: 1
            }}>
              {permissions.map(perm => (
                <Chip
                  key={perm}
                  label={perm}
                  size="small"
                  sx={{ 
                    fontSize: '10px', 
                    height: '20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    fontWeight: 500
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      );
    });
  };

  // Transform data for CommonDataTable
  const displayData = data?.map((permission, index) => ({
    ...permission,
    id: permission.id || `permission-${index}`,
    actions_display: renderPermissionBadges(permission.actions || {}),
    created_at_display: permission.created_at ? new Date(permission.created_at).toLocaleDateString('vi-VN') : '',
    updated_at_display: permission.updated_at ? new Date(permission.updated_at).toLocaleDateString('vi-VN') : '',
  })) || [];


  // Define columns for the table
  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Tên quyền',
      render: (value) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value as React.ReactNode}
        </Typography>
      )
    },
    {
      key: 'code',
      label: 'Mã quyền',
      render: (value) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontFamily: 'monospace',
            backgroundColor: '#f5f5f5',
            px: 1,
            py: 0.25,
            borderRadius: 0.5,
            fontSize: '12px'
          }}
        >
          {value as React.ReactNode}
        </Typography>
      )
    },
    {
      key: 'actions_display',
      label: 'Quyền hạn',
      render: (value) => value as React.ReactNode
    },
    {
      key: 'is_active',
      label: 'Trạng thái',
      render: (value) => (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 0.5,
          borderRadius: 1,
          background: value ? '#d4edda' : '#f8d7da',
          border: `1px solid ${value ? '#c3e6cb' : '#f5c6cb'}`,
          color: value ? '#155724' : '#721c24',
          fontWeight: 500,
          fontSize: '11px'
        }}>
          <Box sx={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            backgroundColor: value ? '#28a745' : '#dc3545',
            mr: 0.5
          }} />
          {value ? 'Hoạt động' : 'Không hoạt động'}
        </Box>
      )
    },
    {
      key: 'created_at_display',
      label: 'Ngày tạo',
      render: (value) => (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
          {value as React.ReactNode}
        </Typography>
      )
    },
    {
      key: 'updated_at_display',
      label: 'Cập nhật',
      render: (value) => (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
          {value as React.ReactNode}
        </Typography>
      )
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (value, row) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Tooltip title="Xem chi tiết">
            <IconButton 
              size="small" 
              onClick={() => onView(row as Permission)}
              sx={{ 
                border: '1px solid #dee2e6',
                '&:hover': {
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <IconButton 
              size="small" 
              onClick={() => onEdit(row as Permission)}
              sx={{ 
                border: '1px solid #dee2e6',
                '&:hover': {
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton 
              size="small" 
              onClick={() => onDelete(row as Permission)}
              sx={{ 
                border: '1px solid #dee2e6',
                '&:hover': {
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <CommonDataTable
        data={displayData}
        isLoading={loading}
        error={undefined}
        onRefresh={() => {}}
        columns={columns}
        actions={[]}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
        selectedRows={selectedRows}
        onSelectionChange={onSelectionChange}
        emptyMessage="Không có quyền hạn nào"
        emptyDescription="Chưa có quyền hạn nào trong hệ thống"
      />
    </Box>
  );
};