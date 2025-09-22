import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Switch,
  Chip,
  Paper,
} from '@mui/material';
import { 
  Security,
  CheckCircle,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useBasePermissions } from '../hooks/useBasePermissions';
import type { Permission, BasePermissionsResponse } from '../types';

interface PermissionDetailViewProps {
  permission: Permission;
}

export const PermissionDetailView: React.FC<PermissionDetailViewProps> = ({ permission }) => {
  const { data: basePermissions, isLoading: basePermissionsLoading } = useBasePermissions();

  const hasPermission = (module: string, action: string): boolean => {
    if (!basePermissions) return false;
    const moduleValue = permission.actions?.[module] || 0;
    const actionValue = basePermissions[module as keyof BasePermissionsResponse]?.[action as keyof typeof basePermissions.user] || 0;
    return (moduleValue & actionValue) !== 0;
  };

  const getModulePermissions = (module: string) => {
    if (!basePermissions) return [];
    const moduleValue = permission.actions?.[module] || 0;
    const moduleActions = basePermissions[module as keyof BasePermissionsResponse];
    if (!moduleActions) return [];
    
    return Object.entries(moduleActions).filter(([action, value]) => 
      (moduleValue & value) !== 0
    ).map(([action]) => action);
  };

  if (basePermissionsLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Đang tải base permissions...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Basic Information */}
      <Paper 
        elevation={2}
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          border: '1px solid #e0e0e0'
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
          <Security sx={{ mr: 1, fontSize: 20 }} />
          Thông tin cơ bản
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Tên quyền
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {permission.name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Mã quyền
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: 'monospace',
                backgroundColor: '#f5f5f5',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '16px'
              }}
            >
              {permission.code}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Trạng thái
            </Typography>
            <Chip
              label={permission.is_active ? 'Hoạt động' : 'Không hoạt động'}
              color={permission.is_active ? 'success' : 'error'}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Ngày tạo
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {permission.created_at ? new Date(permission.created_at).toLocaleDateString('vi-VN') : '-'}
            </Typography>
          </Grid>
        </Grid>
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
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
          <Security sx={{ mr: 1, fontSize: 20 }} />
          Phân quyền chi tiết
        </Typography>
        
        {basePermissions && (
          <Grid container spacing={3}>
            {Object.entries(basePermissions).map(([module, actions]) => {
              const modulePermissions = getModulePermissions(module);
              const hasAnyPermission = modulePermissions.length > 0;
              
              return (
                <Grid item xs={12} sm={6} md={4} key={module}>
                  <Card 
                    elevation={hasAnyPermission ? 4 : 1}
                    sx={{ 
                      height: '100%',
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
                        mb: 2,
                        pb: 1,
                        borderBottom: '1px solid rgba(0,0,0,0.1)'
                      }}>
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
                                label={value} 
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
                                disabled
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
                </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};
