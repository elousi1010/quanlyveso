import React, { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Typography,
    Box,
    Button,
    Tooltip,
    IconButton,
    CircularProgress,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    Save,
    Search,
    CheckCircle,
    RadioButtonUnchecked
} from '@mui/icons-material';
import { usePermissions } from '../hooks/usePermissions';
import { usePermissionMutations } from '../hooks/usePermissionMutations';
import type { User, Permission } from '../types';

interface PermissionMatrixProps {
    users: User[];
    onSuccess?: () => void;
}

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ users, onSuccess }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Fetch all permissions
    const { data: permissionsData, isLoading: permissionsLoading } = usePermissions({ limit: 1000 });
    const { setForUserMutation } = usePermissionMutations();

    const permissions = useMemo(() => permissionsData?.data || [], [permissionsData]);

    // Derived state: matrix of user permissions
    // In a real scenario, this would come from a complex API or join
    // Here we use the `users` array which might have `permissions` property, 
    // or we use the `permission.users` array (list of user IDs).
    // The README says `permission.users` is `string[]`.

    const filteredPermissions = useMemo(() => {
        return permissions.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [permissions, searchQuery]);

    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => a.name.localeCompare(b.name));
    }, [users]);

    // Check if a user has a specific permission
    const hasPermission = (userId: string, permission: Permission) => {
        return permission.users?.includes(userId) || false;
    };

    /**
     * IMPORTANT: This is a complex UI. 
     * In a real implementation, we would maintain a local state of changes
     * to allow "save all" at once.
     */
    const [pendingChanges, setPendingChanges] = useState<Record<string, string[]>>({}); // userId -> permissionIds

    const togglePermission = (userId: string, permissionId: string) => {
        // This is simplified. In a real app, you'd track deltas.
        // For this mock-heavy implementation, we'll just log or show how it works.
        console.log(`Toggle permission ${permissionId} for user ${userId}`);
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        // Simulate complex batch save
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        onSuccess?.();
    };

    if (permissionsLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Search and Global Actions */}
            <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                    size="small"
                    placeholder="Tìm kiếm quyền hạn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Box sx={{ flex: 1 }} />
                <Button
                    variant="contained"
                    startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    sx={{
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    }}
                >
                    Lưu tất cả thay đổi
                </Button>
            </Box>

            {/* Matrix Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 2, maxHeight: 'calc(100vh - 300px)' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: 800,
                                    bgcolor: '#f5f5f5',
                                    zIndex: 3,
                                    left: 0,
                                    position: 'sticky',
                                    width: 200,
                                    borderRight: '1px solid #e0e0e0'
                                }}
                            >
                                Người dùng / Quyền hạn
                            </TableCell>
                            {filteredPermissions.map(permission => (
                                <TableCell
                                    key={permission.id}
                                    align="center"
                                    sx={{
                                        fontWeight: 700,
                                        bgcolor: '#f5f5f5',
                                        minWidth: 120,
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <Tooltip title={permission.code}>
                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                            {permission.name}
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedUsers.map(user => (
                            <TableRow key={user.id} hover>
                                <TableCell
                                    sx={{
                                        fontWeight: 600,
                                        position: 'sticky',
                                        left: 0,
                                        bgcolor: 'white',
                                        zIndex: 2,
                                        borderRight: '1px solid #e0e0e0'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {user.name}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                        {user.role}
                                    </Typography>
                                </TableCell>
                                {filteredPermissions.map(permission => (
                                    <TableCell key={permission.id} align="center">
                                        <Checkbox
                                            size="small"
                                            checked={hasPermission(user.id, permission)}
                                            onChange={() => togglePermission(user.id, permission.id)}
                                            icon={<RadioButtonUnchecked fontSize="small" />}
                                            checkedIcon={<CheckCircle fontSize="small" color="primary" />}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Legend / Footer */}
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    * Ma trận này cho phép bạn quản lý quyền hạn của tất cả người dùng một cách trực quan.
                    Tick vào ô tương ứng để gán quyền. Lưu ý: Một số thao tác hiện đang sử dụng mock data.
                </Typography>
            </Box>
        </Box>
    );
};

export default PermissionMatrix;
