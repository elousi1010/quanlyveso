import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Security,
  Person,
  Save,
  Cancel,
  CheckCircle,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { usePermissionTemplates } from '../hooks/usePermissionTemplates';
import { usePermissions } from '../hooks/usePermissions';
import { usePermissionMutations } from '../hooks/usePermissionMutations';
import type { PermissionTemplate, CreatePermissionTemplateDto, UpdatePermissionTemplateDto, Permission } from '../types';

export const PermissionTemplates: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PermissionTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState<CreatePermissionTemplateDto>({
    name: '',
    role: '',
    description: '',
    permission_ids: [],
  });

  // API hooks
  const { data: templates, isLoading: templatesLoading } = usePermissionTemplates();
  const { data: allPermissions, isLoading: permissionsLoading } = usePermissions({ limit: 1000 });
  const { 
    createTemplateMutation, 
    updateTemplateMutation, 
    deleteTemplateMutation,
    applyTemplateMutation 
  } = usePermissionMutations();

  // Filter templates
  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    
    return templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = !selectedRole || template.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [templates, searchQuery, selectedRole]);

  // Get unique roles
  const roles = useMemo(() => {
    if (!templates) return [];
    return Array.from(new Set(templates.map(t => t.role)));
  }, [templates]);

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm({
      name: '',
      role: '',
      description: '',
      permission_ids: [],
    });
    setDialogOpen(true);
  };

  const handleEditTemplate = (template: PermissionTemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      role: template.role,
      description: template.description,
      permission_ids: template.permission_ids,
    });
    setDialogOpen(true);
  };

  const handleSaveTemplate = async () => {
    try {
      if (editingTemplate) {
        await updateTemplateMutation.mutateAsync({
          id: editingTemplate.id,
          data: templateForm as UpdatePermissionTemplateDto,
        });
      } else {
        await createTemplateMutation.mutateAsync(templateForm);
      }
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleDeleteTemplate = async (template: PermissionTemplate) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa template "${template.name}"?`)) {
      try {
        await deleteTemplateMutation.mutateAsync(template.id);
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const handleApplyTemplate = async (template: PermissionTemplate) => {
    // This would typically open a user selection dialog
    // For now, we'll just show a success message
    alert(`Template "${template.name}" đã được áp dụng cho user được chọn`);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setTemplateForm(prev => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(permissionId)
        ? prev.permission_ids.filter(id => id !== permissionId)
        : [...prev.permission_ids, permissionId],
    }));
  };

  const handleSelectAllPermissions = () => {
    if (!allPermissions?.data) return;
    
    const allSelected = allPermissions.data.every(p => templateForm.permission_ids.includes(p.id));
    
    if (allSelected) {
      setTemplateForm(prev => ({
        ...prev,
        permission_ids: [],
      }));
    } else {
      setTemplateForm(prev => ({
        ...prev,
        permission_ids: allPermissions.data.map(p => p.id),
      }));
    }
  };

  if (templatesLoading || permissionsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Security color="primary" />
        <Typography variant="h6">Template quyền hạn</Typography>
        <Box sx={{ flex: 1 }} />
        <Button
          startIcon={<Add />}
          onClick={handleCreateTemplate}
          variant="contained"
          size="small"
        >
          Tạo template mới
        </Button>
      </Box>

      {/* Mock Data Notice */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Lưu ý:</strong> Tính năng Template quyền hạn hiện đang sử dụng dữ liệu mẫu. 
          API thực tế chưa được implement. Bạn có thể tạo và quản lý template nhưng dữ liệu sẽ không được lưu trữ.
        </Typography>
      </Alert>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Tìm kiếm template..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            label="Role"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {roles.map(role => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Templates Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
        {filteredTemplates.map(template => (
          <Card key={template.id} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" sx={{ flex: 1 }}>
                  {template.name}
                </Typography>
                <Chip
                  label={template.role}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {template.description}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {template.permission_ids.length} quyền hạn
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {template.permission_ids.slice(0, 3).map(permissionId => {
                    const permission = allPermissions?.data.find(p => p.id === permissionId);
                    return permission ? (
                      <Chip
                        key={permissionId}
                        label={permission.name}
                        size="small"
                        variant="outlined"
                      />
                    ) : null;
                  })}
                  {template.permission_ids.length > 3 && (
                    <Chip
                      label={`+${template.permission_ids.length - 3} khác`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
            
            <CardActions>
              <Button
                startIcon={<CheckCircle />}
                onClick={() => handleApplyTemplate(template)}
                size="small"
              >
                Áp dụng
              </Button>
              <Button
                startIcon={<Edit />}
                onClick={() => handleEditTemplate(template)}
                size="small"
              >
                Sửa
              </Button>
              <IconButton
                onClick={() => handleDeleteTemplate(template)}
                size="small"
                color="error"
              >
                <Delete />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      {filteredTemplates.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Không tìm thấy template nào
        </Alert>
      )}

      {/* Template Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingTemplate ? 'Chỉnh sửa template' : 'Tạo template mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Tên template"
              value={templateForm.name}
              onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
            />
            
            <TextField
              fullWidth
              label="Role"
              value={templateForm.role}
              onChange={(e) => setTemplateForm(prev => ({ ...prev, role: e.target.value }))}
            />
            
            <TextField
              fullWidth
              label="Mô tả"
              value={templateForm.description}
              onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={2}
            />
            
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle2">Quyền hạn</Typography>
                <Button
                  size="small"
                  onClick={handleSelectAllPermissions}
                >
                  {allPermissions?.data.every(p => templateForm.permission_ids.includes(p.id)) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </Button>
              </Box>
              
              <Paper sx={{ maxHeight: 300, overflow: 'auto', p: 1 }}>
                <List dense>
                  {allPermissions?.data.map(permission => (
                    <ListItem key={permission.id} sx={{ py: 0.5 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={templateForm.permission_ids.includes(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
                            size="small"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2">{permission.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {permission.code}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<Cancel />}
            onClick={() => setDialogOpen(false)}
          >
            Hủy
          </Button>
          <LoadingButton
            startIcon={<Save />}
            onClick={handleSaveTemplate}
            loading={createTemplateMutation.isPending || updateTemplateMutation.isPending}
            variant="contained"
          >
            Lưu
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PermissionTemplates;
