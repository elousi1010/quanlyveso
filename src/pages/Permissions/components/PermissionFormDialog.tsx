import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Switch,
  Chip,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { 
  Save, 
  Cancel, 
  Security, 
  CheckCircle,
  Cancel as CancelIcon,
  SelectAll,
  ClearAll
} from '@mui/icons-material';
import { useBasePermissions } from '../hooks/useBasePermissions';
import type { Permission, CreatePermissionDto, BasePermissionsResponse } from '../types';

interface PermissionFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreatePermissionDto) => void;
  title: string;
  permission?: Permission | null;
  loading?: boolean;
}

const PermissionFormDialog: React.FC<PermissionFormDialogProps> = ({
  open,
  onClose,
  onSave,
  title,
  permission,
  loading = false,
}) => {
  const { data: basePermissions, isLoading: basePermissionsLoading } = useBasePermissions();
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    actions: {} as Record<string, number>
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data
  useEffect(() => {
    if (permission && open) {
      setFormData({
        name: permission.name || '',
        code: permission.code || '',
        actions: permission.actions || {}
      });
    } else if (!permission && open) {
      setFormData({
        name: '',
        code: '',
        actions: {}
      });
    }
  }, [permission, open]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePermissionChange = (module: string, action: string, checked: boolean) => {
    setFormData(prev => {
      const currentModuleValue = prev.actions[module] || 0;
      const actionValue = (basePermissions?.[module as keyof BasePermissionsResponse] as Record<string, number>)?.[action] || 0;
      
      let newModuleValue: number;
      if (checked) {
        newModuleValue = currentModuleValue | actionValue;
      } else {
        newModuleValue = currentModuleValue & ~actionValue;
      }
      
      return {
        ...prev,
        actions: {
          ...prev.actions,
          [module]: newModuleValue
        }
      };
    });
  };

  const hasPermission = (module: string, action: string): boolean => {
    if (!basePermissions) return false;
    const moduleValue = formData.actions[module] || 0;
    const actionValue = (basePermissions[module as keyof BasePermissionsResponse] as Record<string, number>)?.[action] || 0;
    return (moduleValue & actionValue) !== 0;
  };

  const getModulePermissions = (module: string) => {
    if (!basePermissions) return [];
    const moduleValue = formData.actions[module] || 0;
    const moduleActions = basePermissions[module as keyof BasePermissionsResponse];
    if (!moduleActions) return [];
    
    return Object.entries(moduleActions).filter(([, value]) => 
      (moduleValue & (value as number)) !== 0
    ).map(([action]) => action);
  };

  const selectAllModulePermissions = (module: string) => {
    if (!basePermissions) return;
    const moduleActions = basePermissions[module as keyof BasePermissionsResponse];
    if (!moduleActions) return;

    let totalValue = 0;
    Object.values(moduleActions).forEach(value => {
      totalValue += (value as number);
    });

    setFormData(prev => ({
      ...prev,
      actions: {
        ...prev.actions,
        [module]: totalValue
      }
    }));
  };

  const clearAllModulePermissions = (module: string) => {
    setFormData(prev => ({
      ...prev,
      actions: {
        ...prev.actions,
        [module]: 0
      }
    }));
  };

  const validateForm = (): boolean => {
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

  const convertActionsToStringArray = (actions: Record<string, number>): Record<string, string[]> => {
    const result: Record<string, string[]> = {};
    
    if (!basePermissions) return result;
    
    Object.entries(actions).forEach(([module, value]) => {
      if (value === 0) return; // Skip modules with no permissions
      
      const moduleActions = basePermissions[module as keyof BasePermissionsResponse];
      if (!moduleActions) return;
      
      const selectedActions: string[] = [];
      Object.entries(moduleActions).forEach(([action, actionValue]) => {
        if ((value & (actionValue as number)) !== 0) {
          selectedActions.push(action);
        }
      });
      
      if (selectedActions.length > 0) {
        result[module] = selectedActions;
      }
    });
    
    return result;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const submitData: CreatePermissionDto = {
      name: formData.name.trim(),
      code: formData.code.trim(),
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
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ pb: 1, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Đang tải base permissions...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '600px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }
      }}
    >
      <DialogTitle sx={{ pb: 2, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <Security sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Cấu hình quyền hạn cho các module
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* Basic Information */}
        <Paper 
          elevation={2}
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Tên quyền"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Mã quyền"
              value={formData.code}
              onChange={(e) => handleFieldChange('code', e.target.value)}
              error={!!errors.code}
              helperText={errors.code}
              sx={{ mb: 2 }}
            />
          </Box>
        </Paper>

        {/* Permissions Matrix */}
        <Paper 
          elevation={2}
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
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
              {Object.entries(basePermissions).map(([module, actions]) => {
                const modulePermissions = getModulePermissions(module);
                const hasAnyPermission = modulePermissions.length > 0;
                
                return (
                  <Card 
                    key={module}
                    elevation={hasAnyPermission ? 4 : 1}
                    sx={{ 
                      borderRadius: 3,
                      background: hasAnyPermission 
                        ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' 
                        : 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
                      border: hasAnyPermission 
                        ? '2px solid #1976d2' 
                        : '1px solid #e0e0e0',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      {/* Module Header */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        mb: 2,
                        pb: 1,
                        borderBottom: '1px solid rgba(0,0,0,0.1)'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Security sx={{ 
                            mr: 1, 
                            fontSize: 24, 
                            color: hasAnyPermission ? 'primary.main' : 'text.secondary' 
                          }} />
                          <Typography variant="h6" sx={{ 
                            fontWeight: 700, 
                            textTransform: 'uppercase',
                            color: hasAnyPermission ? 'primary.main' : 'text.primary',
                            fontSize: '16px'
                          }}>
                            {module}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Chọn tất cả">
                            <IconButton 
                              size="small" 
                              onClick={() => selectAllModulePermissions(module)}
                              sx={{ 
                                backgroundColor: hasAnyPermission ? 'primary.main' : 'grey.300',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: hasAnyPermission ? 'primary.dark' : 'grey.400',
                                }
                              }}
                            >
                              <SelectAll fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Bỏ chọn tất cả">
                            <IconButton 
                              size="small" 
                              onClick={() => clearAllModulePermissions(module)}
                              sx={{ 
                                backgroundColor: hasAnyPermission ? 'error.main' : 'grey.300',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: hasAnyPermission ? 'error.dark' : 'grey.400',
                                }
                              }}
                            >
                              <ClearAll fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      
                      {/* Permission Toggles */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {Object.entries(actions).map(([action, value]) => (
                          <Box 
                            key={action}
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              p: 1.5,
                              borderRadius: 2,
                              background: hasPermission(module, action) 
                                ? 'rgba(25, 118, 210, 0.1)' 
                                : 'rgba(0,0,0,0.02)',
                              border: hasPermission(module, action) 
                                ? '1px solid rgba(25, 118, 210, 0.3)' 
                                : '1px solid transparent',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                              {hasPermission(module, action) ? (
                                <CheckCircle sx={{ mr: 1, fontSize: 16, color: 'success.main' }} />
                              ) : (
                                <CancelIcon sx={{ mr: 1, fontSize: 16, color: 'text.disabled' }} />
                              )}
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  textTransform: 'capitalize',
                                  fontWeight: hasPermission(module, action) ? 600 : 400,
                                  color: hasPermission(module, action) ? 'primary.main' : 'text.secondary'
                                }}
                              >
                                {action}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip 
                                label={value as number} 
                                size="small" 
                                sx={{ 
                                  fontSize: '10px',
                                  height: '20px',
                                  backgroundColor: hasPermission(module, action) ? '#1976d2' : '#9e9e9e',
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                              <Switch
                                checked={hasPermission(module, action)}
                                onChange={(e) => handlePermissionChange(module, action, e.target.checked)}
                                size="small"
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#1976d2',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#1976d2',
                                  },
                                }}
                              />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                      
                      {/* Module Summary */}
                      {hasAnyPermission && (
                        <Box sx={{ 
                          mt: 2, 
                          pt: 2, 
                          borderTop: '1px solid rgba(0,0,0,0.1)',
                          textAlign: 'center'
                        }}>
                          <Chip
                            label={`${modulePermissions.length}/${Object.keys(actions).length} quyền được chọn`}
                            size="small"
                            sx={{ 
                              backgroundColor: 'primary.main',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '11px'
                            }}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          startIcon={<Cancel />}
          size="large"
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          Hủy
        </Button>
        <LoadingButton
          onClick={handleSubmit}
          loading={loading}
          loadingPosition="start"
          startIcon={<Save />}
          variant="contained"
          size="large"
          sx={{ 
            borderRadius: 2,
            px: 4,
            py: 1,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
            }
          }}
        >
          Lưu
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export { PermissionFormDialog };