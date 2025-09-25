import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Switch,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { 
  Save, 
  Cancel, 
  Security, 
  Close
} from '@mui/icons-material';
import CommonDrawer from '@/components/common/CommonDrawer';
import { useBasePermissions } from '../hooks/useBasePermissions';
import type { Permission, CreatePermissionDto } from '../types';

interface PermissionFormDrawerSimpleProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreatePermissionDto) => void;
  title: string;
  permission?: Permission | null;
  loading?: boolean;
  mode?: 'view' | 'edit';
  onEdit?: () => void;
}

const PermissionFormDrawerSimple: React.FC<PermissionFormDrawerSimpleProps> = ({
  open,
  onClose,
  onSave,
  title,
  permission,
  loading = false,
  mode = 'edit',
  onEdit,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: basePermissions, isLoading: basePermissionsLoading } = useBasePermissions();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    actions: {} as Record<string, Record<string, boolean>>
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (permission) {
      setFormData({
        name: permission.name || '',
        code: permission.code || '',
        actions: convertActionsToBoolean(permission.actions || {})
      });
    } else {
      setFormData({
        name: '',
        code: '',
        actions: {}
      });
    }
  }, [permission]);

  const convertActionsToBoolean = (actions: Record<string, number>) => {
    const result: Record<string, Record<string, boolean>> = {};
    
    Object.entries(actions).forEach(([module, value]) => {
      result[module] = {
        read: !!(value & 1),
        create: !!(value & 2),
        update: !!(value & 4),
        delete: !!(value & 8)
      };
    });
    
    return result;
  };

  const convertActionsToStringArray = (actions: Record<string, Record<string, boolean>>) => {
    const result: Record<string, string[]> = {};
    
    Object.entries(actions).forEach(([module, perms]) => {
      const permissionList: string[] = [];
      if (perms.read) permissionList.push('read');
      if (perms.create) permissionList.push('create');
      if (perms.update) permissionList.push('update');
      if (perms.delete) permissionList.push('delete');
      result[module] = permissionList;
    });
    
    return result;
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePermission = (module: string, action: string) => {
    setFormData(prev => ({
      ...prev,
      actions: {
        ...prev.actions,
        [module]: {
          ...prev.actions[module],
          [action]: !prev.actions[module]?.[action]
        }
      }
    }));
  };

  const hasPermission = (module: string, action: string) => {
    return formData.actions[module]?.[action] || false;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên quyền là bắt buộc';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Mã quyền là bắt buộc';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const submitData: CreatePermissionDto = {
      name: formData.name,
      code: formData.code,
      actions: convertActionsToStringArray(formData.actions)
    };

    onSave(submitData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      code: '',
      actions: {}
    });
    setErrors({});
    onClose();
  };

  if (basePermissionsLoading) {
    return (
      <CommonDrawer
        open={open}
        onClose={handleClose}
        title={title}
        width={isMobile ? '100%' : 800}
        loading={basePermissionsLoading}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Đang tải base permissions...
          </Typography>
        </Box>
      </CommonDrawer>
    );
  }

  return (
    <CommonDrawer
      open={open}
      onClose={handleClose}
      title={title}
      width={isMobile ? '100%' : 800}
      loading={loading}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {/* Basic Information */}
          <Paper 
            elevation={1}
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2,
              background: 'white',
              border: '1px solid #e0e0e0'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
              Thông tin cơ bản
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label="Tên quyền"
                placeholder="Tên quyền"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                size="small"
                disabled={mode === 'view'}
              />
              <TextField
                fullWidth
                label="Mã quyền"
                placeholder="Mã quyền"
                value={formData.code}
                onChange={(e) => handleFieldChange('code', e.target.value)}
                error={!!errors.code}
                helperText={errors.code}
                size="small"
                disabled={mode === 'view'}
              />
            </Box>
          </Paper>

          {/* Permissions Matrix */}
          <Paper 
            elevation={1}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: 'white',
              border: '1px solid #e0e0e0'
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
              Phân quyền chi tiết
            </Typography>
            
            {basePermissions && (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                {Object.entries(basePermissions).map(([module, actions]) => {
                  const modulePermissions = Object.values(formData.actions[module] || {});
                  const hasAnyPermission = modulePermissions.some(Boolean);
                  
                  return (
                    <Card 
                      key={module}
                      elevation={1}
                      sx={{ 
                        borderRadius: 2,
                        background: hasAnyPermission ? '#f5f5f5' : '#fafafa',
                        border: '1px solid #e0e0e0',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        {/* Module Header */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 2,
                          pb: 1,
                          borderBottom: '1px solid #e0e0e0'
                        }}>
                          <Security sx={{ 
                            mr: 1, 
                            fontSize: 20, 
                            color: 'text.secondary' 
                          }} />
                          <Typography variant="h6" sx={{ 
                            fontWeight: 700, 
                            textTransform: 'uppercase',
                            color: 'text.primary',
                            fontSize: '14px'
                          }}>
                            {module}
                          </Typography>
                        </Box>
                        
                        {/* Permission Toggles */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {Object.entries(actions).map(([action, value]) => (
                            <Box 
                              key={action}
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                p: 1.5,
                                borderRadius: 1,
                                background: hasPermission(module, action) 
                                  ? 'rgba(25, 118, 210, 0.05)' 
                                  : 'transparent',
                                border: '1px solid',
                                borderColor: hasPermission(module, action) 
                                  ? 'primary.main' 
                                  : 'divider',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontWeight: 500,
                                    color: hasPermission(module, action) ? 'primary.main' : 'text.primary',
                                    textTransform: 'capitalize',
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  {action}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: 'text.secondary',
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                  }}
                                >
                                  {value}
                                </Typography>
                              </Box>
                              
                              <Switch
                                checked={hasPermission(module, action)}
                                onChange={() => togglePermission(module, action)}
                                size="small"
                                color="primary"
                                disabled={mode === 'view'}
                              />
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}
          </Paper>
        </Box>

        {/* Actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 2, 
          pt: 3, 
          borderTop: '1px solid #e0e0e0',
          mt: 3
        }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            startIcon={<Cancel />}
            disabled={loading}
          >
            {mode === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          {mode === 'view' && onEdit ? (
            <Button
              variant="contained"
              onClick={onEdit}
              startIcon={<Save />}
            >
              Chỉnh sửa
            </Button>
          ) : (
            <LoadingButton
              variant="contained"
              onClick={handleSave}
              loading={loading}
              startIcon={<Save />}
            >
              Lưu
            </LoadingButton>
          )}
        </Box>
      </Box>
    </CommonDrawer>
  );
};

export default PermissionFormDrawerSimple;
