import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  InputAdornment,
  Chip,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Save,
  Refresh,
  FilterList,
  ViewColumn,
  Person,
  Security,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { usePermissions } from '../hooks/usePermissions';
import { useUserPermissions, useUserPermissionMatrix } from '../hooks/useUserPermissions';
import { usePermissionMutations } from '../hooks/usePermissionMutations';
import type { Permission, User, PermissionMatrixData } from '../types';

interface PermissionMatrixProps {
  users: User[];
  onSuccess?: () => void;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  users,
  onSuccess,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [userPermissions, setUserPermissions] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // API hooks
  const { data: allPermissions, isLoading: permissionsLoading } = usePermissions({ limit: 1000 });
  const { setForUserMutation } = usePermissionMutations();

  // Load user permissions
  const userIds = users.map(u => u.id);
  const { data: matrixData, isLoading: matrixLoading } = useUserPermissionMatrix(userIds);

  // Initialize user permissions when data loads
  React.useEffect(() => {
    if (matrixData) {
      setUserPermissions(matrixData);
    }
  }, [matrixData]);

  // Filter permissions based on search query
  const filteredPermissions = useMemo(() => {
    if (!allPermissions?.data) return [];
    
    return allPermissions.data.filter(permission =>
      permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allPermissions, searchQuery]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone_number.includes(searchQuery) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleUserPermissionToggle = useCallback((userId: string, permissionId: string) => {
    setUserPermissions(prev => {
      const currentPermissions = prev[userId] || [];
      const newPermissions = currentPermissions.includes(permissionId)
        ? currentPermissions.filter(id => id !== permissionId)
        : [...currentPermissions, permissionId];
      
      setHasChanges(true);
      return {
        ...prev,
        [userId]: newPermissions,
      };
    });
  }, []);

  const handlePermissionSelectAll = useCallback((permissionId: string) => {
    const isSelected = selectedPermissions.includes(permissionId);
    
    if (isSelected) {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    } else {
      setSelectedPermissions(prev => [...prev, permissionId]);
    }
  }, [selectedPermissions]);

  const handleUserSelectAll = useCallback((userId: string) => {
    const userCurrentPermissions = userPermissions[userId] || [];
    const allSelected = filteredPermissions.every(p => userCurrentPermissions.includes(p.id));
    
    if (allSelected) {
      // Deselect all permissions for this user
      setUserPermissions(prev => ({
        ...prev,
        [userId]: userCurrentPermissions.filter(id => !filteredPermissions.some(p => p.id === id)),
      }));
    } else {
      // Select all permissions for this user
      setUserPermissions(prev => ({
        ...prev,
        [userId]: [
          ...userCurrentPermissions,
          ...filteredPermissions.map(p => p.id).filter(id => !userCurrentPermissions.includes(id)),
        ],
      }));
    }
    setHasChanges(true);
  }, [userPermissions, filteredPermissions]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Tạo danh sách các promise để gán từng quyền cho từng user
      const promises: Promise<void>[] = [];
      
      Object.entries(userPermissions).forEach(([userId, permissionIds]) => {
        permissionIds.forEach(permissionId => {
          promises.push(
            setForUserMutation.mutateAsync({
              permissionId: permissionId,
              data: { user_id: userId }
            })
          );
        });
      });
      
      await Promise.all(promises);
      setHasChanges(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving permission matrix:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setUserPermissions(matrixData || {});
    setHasChanges(false);
  };

  if (permissionsLoading || matrixLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Security color="primary" />
        <Typography variant="h6">Ma trận quyền hạn</Typography>
        <Box sx={{ flex: 1 }} />
        <LoadingButton
          startIcon={<Save />}
          onClick={handleSave}
          loading={isLoading}
          disabled={!hasChanges}
          variant="contained"
          size="small"
        >
          Lưu thay đổi
        </LoadingButton>
        <Button
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={isLoading}
          size="small"
        >
          Làm mới
        </Button>
      </Box>

      {/* Mock Data Notice */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Lưu ý:</strong> Tính năng ma trận quyền hạn hiện đang sử dụng API thật để gán quyền cho user. 
          Mỗi lần tick/untick sẽ gọi API PUT /api/v1/permissions/set-for-user/permissionId với body user_id.
        </Typography>
      </Alert>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Tìm kiếm user hoặc quyền hạn..."
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

      {/* Matrix Table */}
      <Paper sx={{ width: '100%', overflow: 'auto' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 200, position: 'sticky', left: 0, bgcolor: 'background.paper', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person color="primary" />
                    <Typography variant="subtitle2">User</Typography>
                  </Box>
                </TableCell>
                {filteredPermissions.map(permission => (
                  <TableCell
                    key={permission.id}
                    align="center"
                    sx={{ minWidth: 120, position: 'sticky', top: 0, bgcolor: 'background.paper' }}
                  >
                    <Tooltip title={permission.name}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                          {permission.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {permission.code}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map(user => {
                const userCurrentPermissions = userPermissions[user.id] || [];
                const allSelected = filteredPermissions.every(p => userCurrentPermissions.includes(p.id));
                const someSelected = filteredPermissions.some(p => userCurrentPermissions.includes(p.id));
                
                return (
                  <TableRow key={user.id} hover>
                    <TableCell sx={{ position: 'sticky', left: 0, bgcolor: 'background.paper', zIndex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox
                          checked={allSelected}
                          indeterminate={someSelected && !allSelected}
                          onChange={() => handleUserSelectAll(user.id)}
                          size="small"
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.role} • {user.phone_number}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    {filteredPermissions.map(permission => (
                      <TableCell key={permission.id} align="center">
                        <Checkbox
                          checked={userCurrentPermissions.includes(permission.id)}
                          onChange={() => handleUserPermissionToggle(user.id, permission.id)}
                          size="small"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Summary */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Hiển thị {filteredUsers.length} user và {filteredPermissions.length} quyền hạn
        </Typography>
        {hasChanges && (
          <Alert severity="warning" sx={{ py: 0 }}>
            Có thay đổi chưa được lưu
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default PermissionMatrix;
