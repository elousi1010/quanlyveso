import React from 'react';
import {
  Box,
  Button,
  Typography,
  Chip,
  Paper,
  IconButton,
  Switch,
  FormControlLabel,
  Divider,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
} from '@mui/material';
import { ArrowBack, Edit, ExpandMore, ChevronRight } from '@mui/icons-material';
import type { DetailField } from '@/components/common/types';
import type { Permission } from '../types';

interface PermissionDetailViewProps {
  permission: Permission;
  onBack: () => void;
  onEdit: () => void;
  viewFields: DetailField[];
}

export const PermissionDetailView: React.FC<PermissionDetailViewProps> = ({
  permission,
  onBack,
  onEdit,
  viewFields,
}) => {
  const renderFieldValue = (field: DetailField, data: Record<string, unknown>) => {
    const value = data[field.key];
    
    if (field.type === 'custom' && field.render) {
      return field.render(value, data);
    }
    
    if (field.type === 'date' && value) {
      return new Date(value as string).toLocaleDateString('vi-VN');
    }
    
    if (field.type === 'boolean') {
      return value ? 'Có' : 'Không';
    }
    
    if (field.chip) {
      return (
        <Chip
          label={value as string}
          color={field.chip.color}
          variant={field.chip.variant}
          size="small"
        />
      );
    }
    
    return value ? String(value) : '-';
  };

  const renderPermissions = (actions: Record<string, number>) => {
    const permissionMap = {
      user: 'User',
      ticket: 'Ticket',
      partner: 'Partner',
      inventory: 'Inventory',
      permission: 'Permission',
      transaction: 'Transaction',
      organization: 'Organization'
    };

    const getPermissionDetails = (value: number) => {
      const permissions = [];
      // Decode bit flags: 1=Read, 2=Create, 4=Update, 8=Delete
      // Value 1 = chỉ có quyền Đọc
      // Value 15 = 8+4+2+1 = All permissions
      if (value & 1) permissions.push('Đọc');
      if (value & 2) permissions.push('Tạo');
      if (value & 4) permissions.push('Cập nhật');
      if (value & 8) permissions.push('Xóa');
      return permissions;
    };

    // Chia permissions thành 2 cột
    const permissions = Object.entries(actions);
    const leftColumn = permissions.slice(0, Math.ceil(permissions.length / 2));
    const rightColumn = permissions.slice(Math.ceil(permissions.length / 2));

    const renderColumn = (permissions: [string, number][]) => (
      <Paper 
        sx={{ 
          flex: '1 1 200px',
          minWidth: 200,
          maxHeight: 400,
          overflow: 'auto',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <List dense sx={{ p: 0 }}>
          {permissions.map(([key, value]) => {
            const permissionName = permissionMap[key as keyof typeof permissionMap];
            const permissionDetails = getPermissionDetails(value);
            const hasAnyPermission = permissionDetails.length > 0;
            
            return (
              <ListItem 
                key={key}
                sx={{ 
                  py: 0.5, 
                  px: 2,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Checkbox 
                    size="small" 
                    checked={hasAnyPermission}
                    disabled
                    sx={{ p: 0.5 }}
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {permissionName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                          ({permissionDetails.join(', ')})
                        </Typography>
                        <ChevronRight sx={{ fontSize: 16, color: 'text.secondary' }} />
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    );

    return (
      <Box sx={{ display: 'flex', gap: 2, overflow: 'auto' }}>
        {renderColumn(leftColumn)}
        {renderColumn(rightColumn)}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Chi tiết Quyền hạn
                    </Typography>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={onEdit}
          >
            Chỉnh sửa
          </Button>
                  </Box>
      </Paper>

      {/* Basic Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Thông tin cơ bản
                    </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {viewFields.filter(field => field.key !== 'actions').map((field) => (
            <Box key={field.key} sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: 250 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, fontWeight: 500 }}
              >
                {field.label}
                    </Typography>
              <Box sx={{ minHeight: 24, display: 'flex', alignItems: 'center' }}>
                {renderFieldValue(field, permission as unknown as Record<string, unknown>)}
                  </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Permissions Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Chi tiết Quyền hạn
        </Typography>
        {permission.actions && renderPermissions(permission.actions as Record<string, number>)}
      </Paper>
    </Box>
  );
};