import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Search,
  Group,
  Security,
  CheckCircle,
  Cancel,
  Save,
  Add,
  Remove,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import CommonDrawer from '@/components/common/CommonDrawer';
import { usePermissions } from '../hooks/usePermissions';
import { usePermissionMutations } from '../hooks/usePermissionMutations';
import type { Permission, User, BulkPermissionAssignment } from '../types';

interface BulkPermissionAssignmentProps {
  open: boolean;
  onClose: () => void;
  selectedUsers: User[];
  onSuccess?: () => void;
}

export const BulkPermissionAssignment: React.FC<BulkPermissionAssignmentProps> = ({
  open,
  onClose,
  selectedUsers,
  onSuccess,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [operation, setOperation] = useState<'assign' | 'remove' | 'replace'>('assign');
  const [isLoading, setIsLoading] = useState(false);

  // API hooks
  const { data: allPermissions, isLoading: permissionsLoading } = usePermissions({ limit: 1000 });
  const { bulkAssignMutation } = usePermissionMutations();

  // Filter permissions based on search query
  const filteredPermissions = useMemo(() => {
    if (!allPermissions?.data) return [];
    
    return allPermissions.data.filter(permission =>
      permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allPermissions, searchQuery]);

  // Group permissions by category
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    
    filteredPermissions.forEach(permission => {
      const category = permission.code.split('_')[0] || 'other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });
    
    return groups;
  }, [filteredPermissions]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = (permissions: Permission[]) => {
    const allSelected = permissions.every(p => selectedPermissions.includes(p.id));
    
    if (allSelected) {
      // Deselect all in this group
      setSelectedPermissions(prev => 
        prev.filter(id => !permissions.some(p => p.id === id))
      );
    } else {
      // Select all in this group
      setSelectedPermissions(prev => [
        ...prev,
        ...permissions.map(p => p.id).filter(id => !prev.includes(id))
      ]);
    }
  };

  const handleSave = async () => {
    if (selectedUsers.length === 0 || selectedPermissions.length === 0) return;
    
    setIsLoading(true);
    try {
      const data: BulkPermissionAssignment = {
        user_ids: selectedUsers.map(u => u.id),
        permission_ids: selectedPermissions,
        operation,
      };
      
      await bulkAssignMutation.mutateAsync(data);
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error bulk assigning permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedPermissions([]);
    setOperation('assign');
    onClose();
  };

  const getOperationDescription = () => {
    switch (operation) {
      case 'assign':
        return 'Thêm các quyền đã chọn vào tất cả user';
      case 'remove':
        return 'Xóa các quyền đã chọn khỏi tất cả user';
      case 'replace':
        return 'Thay thế tất cả quyền hiện tại bằng các quyền đã chọn';
      default:
        return '';
    }
  };

  return (
    <CommonDrawer
      open={open}
      onClose={handleCancel}
      title={`Gán quyền hàng loạt cho ${selectedUsers.length} user`}
      width={isMobile ? '100%' : 700}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Selected Users */}
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.50' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Group color="primary" />
        <Typography variant="h6">
          {selectedUsers.length} user được chọn
        </Typography>
      </Box>

      {/* Mock Data Notice */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Lưu ý:</strong> Tính năng gán quyền hàng loạt hiện đang sử dụng mock implementation. 
          API thực tế chưa được implement. Bạn có thể thực hiện thao tác nhưng dữ liệu sẽ không được lưu trữ.
        </Typography>
      </Alert>
          <Box sx={{ maxHeight: 120, overflow: 'auto' }}>
            <List dense>
              {selectedUsers.map(user => (
                <ListItem key={user.id} sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={user.name}
                    secondary={`${user.phone_number} • ${user.role}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>

        {/* Operation Selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Thao tác</InputLabel>
          <Select
            value={operation}
            onChange={(e) => setOperation(e.target.value as 'assign' | 'remove' | 'replace')}
            label="Thao tác"
          >
            <MenuItem value="assign">
              <Box>
                <Typography>Gán thêm quyền</Typography>
                <Typography variant="caption" color="text.secondary">
                  Thêm các quyền đã chọn vào user
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem value="remove">
              <Box>
                <Typography>Xóa quyền</Typography>
                <Typography variant="caption" color="text.secondary">
                  Xóa các quyền đã chọn khỏi user
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem value="replace">
              <Box>
                <Typography>Thay thế quyền</Typography>
                <Typography variant="caption" color="text.secondary">
                  Thay thế tất cả quyền hiện tại
                </Typography>
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        <Alert severity="info" sx={{ mb: 2 }}>
          {getOperationDescription()}
        </Alert>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Tìm kiếm quyền hạn..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Current Selection Summary */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Đã chọn {selectedPermissions.length} quyền hạn
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selectedPermissions.slice(0, 5).map(permissionId => {
              const permission = allPermissions?.data.find(p => p.id === permissionId);
              return permission ? (
                <Chip
                  key={permissionId}
                  label={permission.name}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ) : null;
            })}
            {selectedPermissions.length > 5 && (
              <Chip
                label={`+${selectedPermissions.length - 5} khác`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Permissions List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {permissionsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <Box key={category} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={permissions.every(p => selectedPermissions.includes(p.id))}
                          indeterminate={
                            permissions.some(p => selectedPermissions.includes(p.id)) &&
                            !permissions.every(p => selectedPermissions.includes(p.id))
                          }
                          onChange={() => handleSelectAll(permissions)}
                        />
                      }
                      label={
                        <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                          {category} ({permissions.length})
                        </Typography>
                      }
                    />
                  </Box>
                  
                  <Box sx={{ ml: 4, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {permissions.map(permission => (
                      <FormControlLabel
                        key={permission.id}
                        control={
                          <Checkbox
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
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
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            startIcon={<Cancel />}
            onClick={handleCancel}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <LoadingButton
            startIcon={<Save />}
            onClick={handleSave}
            loading={isLoading}
            disabled={selectedUsers.length === 0 || selectedPermissions.length === 0}
            variant="contained"
          >
            Thực hiện ({selectedUsers.length} user, {selectedPermissions.length} quyền)
          </LoadingButton>
        </Box>
      </Box>
    </CommonDrawer>
  );
};

export default BulkPermissionAssignment;
