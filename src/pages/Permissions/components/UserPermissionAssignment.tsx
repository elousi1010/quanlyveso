import React, { useState, useEffect, useMemo } from 'react';
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
} from '@mui/material';
import {
  Search,
  Security,
  Person,
  CheckCircle,
  Cancel,
  Save,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import CommonDrawer from '@/components/common/CommonDrawer';
import { usePermissions } from '../hooks/usePermissions';
import { useUserPermissions } from '../hooks/useUserPermissions';
import { usePermissionMutations } from '../hooks/usePermissionMutations';
import type { Permission, User } from '../types';

interface UserPermissionAssignmentProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess?: () => void;
}

export const UserPermissionAssignment: React.FC<UserPermissionAssignmentProps> = ({
  open,
  onClose,
  user,
  onSuccess,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // API hooks
  const { data: allPermissions, isLoading: permissionsLoading } = usePermissions({ limit: 1000 });
  const { data: userPermissions, isLoading: userPermissionsLoading } = useUserPermissions(user?.id || '');
  const { setForUserMutation } = usePermissionMutations();

  // Initialize selected permissions when user changes
  useEffect(() => {
    if (userPermissions) {
      setSelectedPermissions(userPermissions.map(p => p.id));
    }
  }, [userPermissions]);

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
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Gán từng quyền cho user
      const promises = selectedPermissions.map(permissionId =>
        setForUserMutation.mutateAsync({
          permissionId: permissionId,
          data: { user_id: user.id }
        })
      );
      
      await Promise.all(promises);
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error assigning permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (userPermissions) {
      setSelectedPermissions(userPermissions.map(p => p.id));
    }
    onClose();
  };

  const hasChanges = useMemo(() => {
    if (!userPermissions) return false;
    const currentIds = userPermissions.map(p => p.id).sort();
    const selectedIds = [...selectedPermissions].sort();
    return JSON.stringify(currentIds) !== JSON.stringify(selectedIds);
  }, [userPermissions, selectedPermissions]);

  if (!user) return null;

  return (
    <CommonDrawer
      open={open}
      onClose={handleCancel}
      title={`Gán quyền cho ${user.name}`}
      width={isMobile ? '100%' : 600}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* User Info */}
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.50' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person color="primary" />
            <Box>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user.phone_number} • {user.role}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Mock Data Notice */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Lưu ý:</strong> Tính năng gán quyền cho user hiện đang sử dụng mock implementation. 
            API thực tế chưa được implement. Bạn có thể thực hiện thao tác nhưng dữ liệu sẽ không được lưu trữ.
          </Typography>
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
          {permissionsLoading || userPermissionsLoading ? (
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
            disabled={!hasChanges}
            variant="contained"
          >
            Lưu thay đổi
          </LoadingButton>
        </Box>

        {hasChanges && (
          <Alert severity="info" sx={{ mt: 1 }}>
            Bạn có thay đổi chưa được lưu
          </Alert>
        )}
      </Box>
    </CommonDrawer>
  );
};

export default UserPermissionAssignment;
