import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Save, Cancel } from '@mui/icons-material';
import type { Permission, CreatePermissionDto } from '../types';

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
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    user_read: false,
    user_create: false,
    user_update: false,
    user_delete: false,
    organization_read: false,
    organization_create: false,
    organization_update: false,
    organization_delete: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (permission) {
        // Edit mode - populate form with existing data
        setFormData({
          name: permission.name || '',
          code: permission.code || '',
          user_read: permission.actions?.user?.includes('read') || false,
          user_create: permission.actions?.user?.includes('create') || false,
          user_update: permission.actions?.user?.includes('update') || false,
          user_delete: permission.actions?.user?.includes('delete') || false,
          organization_read: permission.actions?.organization?.includes('read') || false,
          organization_create: permission.actions?.organization?.includes('create') || false,
          organization_update: permission.actions?.organization?.includes('update') || false,
          organization_delete: permission.actions?.organization?.includes('delete') || false,
        });
      } else {
        // Create mode - reset form
        setFormData({
          name: '',
          code: '',
          user_read: false,
          user_create: false,
          user_update: false,
          user_delete: false,
          organization_read: false,
          organization_create: false,
          organization_update: false,
          organization_delete: false,
        });
      }
      setErrors({});
    }
  }, [open, permission]);

  const handleFieldChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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

  const handleSubmit = () => {
    if (validateForm()) {
      // Transform form data to API format
      const actions: Record<string, string[]> = {};
      
      // User permissions
      const userActions: string[] = [];
      if (formData.user_read) userActions.push('read');
      if (formData.user_create) userActions.push('create');
      if (formData.user_update) userActions.push('update');
      if (formData.user_delete) userActions.push('delete');
      if (userActions.length > 0) actions.user = userActions;
      
      // Organization permissions
      const organizationActions: string[] = [];
      if (formData.organization_read) organizationActions.push('read');
      if (formData.organization_create) organizationActions.push('create');
      if (formData.organization_update) organizationActions.push('update');
      if (formData.organization_delete) organizationActions.push('delete');
      if (organizationActions.length > 0) actions.organization = organizationActions;
      
      const createData: CreatePermissionDto = {
        name: formData.name,
        code: formData.code,
        actions: actions,
      };
      
      onSave(createData);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      code: '',
      user_read: false,
      user_create: false,
      user_update: false,
      user_delete: false,
      organization_read: false,
      organization_create: false,
      organization_update: false,
      organization_delete: false,
    });
    setErrors({});
    onClose();
  };

  const getSelectedPermissions = (type: 'user' | 'organization') => {
    const permissions: string[] = [];
    if (type === 'user') {
      if (formData.user_read) permissions.push('Đọc');
      if (formData.user_create) permissions.push('Tạo');
      if (formData.user_update) permissions.push('Cập nhật');
      if (formData.user_delete) permissions.push('Xóa');
    } else {
      if (formData.organization_read) permissions.push('Đọc');
      if (formData.organization_create) permissions.push('Tạo');
      if (formData.organization_update) permissions.push('Cập nhật');
      if (formData.organization_delete) permissions.push('Xóa');
    }
    return permissions;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '600px',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ mt: 1 }}>
          {/* Basic Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                Thông tin cơ bản
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tên quyền"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    placeholder="Nhập tên quyền (VD: Permission 1)"
                    size="small"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mã quyền"
                    value={formData.code}
                    onChange={(e) => handleFieldChange('code', e.target.value)}
                    error={!!errors.code}
                    helperText={errors.code}
                    placeholder="Nhập mã quyền (VD: permission_1)"
                    size="small"
                    required
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Grid container spacing={2}>
            {/* User Permissions */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Quyền User
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.user_read}
                          onChange={(e) => handleFieldChange('user_read', e.target.checked)}
                          size="small"
                        />
                      }
                      label="Đọc (Read)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.user_create}
                          onChange={(e) => handleFieldChange('user_create', e.target.checked)}
                          size="small"
                        />
                      }
                      label="Tạo (Create)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.user_update}
                          onChange={(e) => handleFieldChange('user_update', e.target.checked)}
                          size="small"
                        />
                      }
                      label="Cập nhật (Update)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.user_delete}
                          onChange={(e) => handleFieldChange('user_delete', e.target.checked)}
                          size="small"
                        />
                      }
                      label="Xóa (Delete)"
                    />
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {getSelectedPermissions('user').map((permission) => (
                      <Chip
                        key={permission}
                        label={permission}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {getSelectedPermissions('user').length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Chưa chọn quyền nào
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Organization Permissions */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Quyền Organization
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.organization_read}
                          onChange={(e) => handleFieldChange('organization_read', e.target.checked)}
                          size="small"
                        />
                      }
                      label="Đọc (Read)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.organization_create}
                          onChange={(e) => handleFieldChange('organization_create', e.target.checked)}
                          size="small"
                        />
                      }
                      label="Tạo (Create)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.organization_update}
                          onChange={(e) => handleFieldChange('organization_update', e.target.checked)}
                          size="small"
                        />
                      }
                      label="Cập nhật (Update)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.organization_delete}
                          onChange={(e) => handleFieldChange('organization_delete', e.target.checked)}
                          size="small"
                        />
                      }
                      label="Xóa (Delete)"
                    />
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {getSelectedPermissions('organization').map((permission) => (
                      <Chip
                        key={permission}
                        label={permission}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                    {getSelectedPermissions('organization').length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Chưa chọn quyền nào
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ textTransform: 'none' }}
          startIcon={<Cancel />}
        >
          Hủy
        </Button>
        <LoadingButton
          onClick={handleSubmit}
          loading={loading}
          variant="contained"
          sx={{ textTransform: 'none' }}
          startIcon={<Save />}
        >
          {permission ? 'Cập nhật' : 'Tạo'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export { PermissionFormDialog };
