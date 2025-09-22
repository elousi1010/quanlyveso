import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Switch,
  Chip,
  Paper,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { 
  Save, 
  Cancel, 
  Person, 
  Security,
  SelectAll,
  ClearAll
} from '@mui/icons-material';
import { useBasePermissions } from '../hooks/useBasePermissions';
import { usePermissions } from '../hooks/usePermissions';
import type { User, Permission, BasePermissionsResponse, SetPermissionsForUserDto } from '../types';

interface AssignPermissionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (permissionId: string, data: SetPermissionsForUserDto) => Promise<void>;
  onSuccess?: () => void;
  user: User | null;
  loading?: boolean;
}

const AssignPermissionDialog: React.FC<AssignPermissionDialogProps> = ({
  open,
  onClose,
  onSave,
  onSuccess,
  user,
  loading = false,
}) => {
  const { data: basePermissions, isLoading: basePermissionsLoading } = useBasePermissions();
  const { data: permissionsData } = usePermissions();
  
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize selected permissions when user changes
  useEffect(() => {
    if (user && open) {
      // Get user's current permissions from user.permissions or user.permission_ids
      const userPermissionIds = user.permissions?.map(p => p.id) || [];
      setSelectedPermissions(userPermissionIds);
    } else if (!user && open) {
      setSelectedPermissions([]);
    }
  }, [user, open]);

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    setSelectedPermissions(prev => {
      if (checked) {
        return [...prev, permissionId];
      } else {
        return prev.filter(id => id !== permissionId);
      }
    });
  };

  const selectAllPermissions = () => {
    if (permissionsData?.data) {
      const allPermissionIds = permissionsData.data.map(p => p.id);
      setSelectedPermissions(allPermissionIds);
    }
  };

  const clearAllPermissions = () => {
    setSelectedPermissions([]);
  };


  const hasPermission = (permissionId: string): boolean => {
    return selectedPermissions.includes(permissionId);
  };


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (selectedPermissions.length === 0) {
      newErrors.permissions = 'Vui lòng chọn ít nhất một quyền hạn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!user || !validateForm()) return;

    try {
      // Call API for each selected permission sequentially
      for (const permissionId of selectedPermissions) {
        const submitData: SetPermissionsForUserDto = {
          user_id: user.id
        };
        await onSave(permissionId, submitData);
      }
      
      // Success - call success callback and close dialog
      if (onSuccess) {
        onSuccess();
      } else {
        handleClose();
      }
    } catch (error) {
      // Error will be handled by parent component
      console.error('Error assigning permissions:', error);
    }
  };

  const handleClose = () => {
    setSelectedPermissions([]);
    setErrors({});
    onClose();
  };

  if (basePermissionsLoading) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ pb: 1, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Gán quyền hạn
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Đang tải dữ liệu...
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
          minHeight: '700px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }
      }}
    >
      <DialogTitle sx={{ pb: 2, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <Person sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Gán quyền hạn
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Gán quyền hạn cho người dùng: <strong>{user?.name}</strong>
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {errors.permissions && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.permissions}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 3, background: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark' }}>
              Chọn quyền hạn
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                startIcon={<SelectAll />}
                onClick={selectAllPermissions}
                sx={{ borderRadius: 2 }}
              >
                Chọn tất cả
              </Button>
              <Button
                size="small"
                startIcon={<ClearAll />}
                onClick={clearAllPermissions}
                sx={{ borderRadius: 2 }}
              >
                Bỏ chọn tất cả
              </Button>
            </Box>
          </Box>
          
          <Grid container spacing={3}>
            {permissionsData?.data && permissionsData.data.map((permission) => (
              <Grid item xs={12} sm={6} md={4} key={permission.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: hasPermission(permission.id)
                      ? 'linear-gradient(145deg, #e3f2fd 0%, #bbdefb 100%)'
                      : '#f5f5f5',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: hasPermission(permission.id)
                        ? '0 8px 16px rgba(33, 150, 243, 0.2)'
                        : '0 4px 8px rgba(0,0,0,0.1)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: hasPermission(permission.id) ? '#1976d2' : '#616161' }}>
                        {permission.name}
                      </Typography>
                      <Chip
                        label={permission.code}
                        size="small"
                        sx={{
                          backgroundColor: hasPermission(permission.id) ? '#1976d2' : '#9e9e9e',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Quyền hạn:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {Object.entries(permission.actions || {}).map(([module, value]) => {
                          if (value === 0) return null;
                          const permissions = [];
                          if (value & 1) permissions.push('Đọc');
                          if (value & 2) permissions.push('Tạo');
                          if (value & 4) permissions.push('Cập nhật');
                          if (value & 8) permissions.push('Xóa');
                          
                          return (
                            <Chip
                              key={module}
                              label={`${module.toUpperCase()}: ${permissions.join(', ')}`}
                              size="small"
                              sx={{ fontSize: '10px', height: 20 }}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', p: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Switch
                      checked={hasPermission(permission.id)}
                      onChange={(e) => handlePermissionToggle(permission.id, e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#1976d2',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#1976d2',
                        },
                      }}
                    />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
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
          Gán quyền
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export { AssignPermissionDialog };
