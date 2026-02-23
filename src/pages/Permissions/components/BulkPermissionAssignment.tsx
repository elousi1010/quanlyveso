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
    Radio,
    RadioGroup,
    FormControl,
} from '@mui/material';
import {
    Search,
    Security,
    People,
    CheckCircle,
    Cancel,
    FlashOn,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import CommonDrawer from '@/components/common/CommonDrawer';
import { usePermissions } from '../hooks/usePermissions';
import { usePermissionMutations } from '../hooks/usePermissionMutations';
import type { Permission, User, BulkPermissionAssignment as BulkAssignDto } from '../types';

interface BulkPermissionAssignmentProps {
    open: boolean;
    onClose: () => void;
    selectedUsers: User[];
    onSuccess?: () => void;
}

const BulkPermissionAssignment: React.FC<BulkPermissionAssignmentProps> = ({
    open,
    onClose,
    selectedUsers,
    onSuccess,
}) => {
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

    const handleExecute = async () => {
        if (selectedUsers.length === 0 || selectedPermissions.length === 0) return;

        setIsLoading(true);
        try {
            const dto: BulkAssignDto = {
                user_ids: selectedUsers.map(u => u.id),
                permission_ids: selectedPermissions,
                operation,
            };

            await bulkAssignMutation.mutateAsync(dto);

            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error in bulk permission assignment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedPermissions([]);
        onClose();
    };

    return (
        <CommonDrawer
            open={open}
            onClose={handleClose}
            title="Gán quyền hàng loạt"
            width={650}
        >
            <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Selection Info */}
                <Paper sx={{ p: 2, mb: 3, bgcolor: '#f0f7ff', borderRadius: 2, border: '1px border #cce3ff' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <People color="primary" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            Đang chọn {selectedUsers.length} người dùng
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedUsers.slice(0, 10).map(user => (
                            <Chip
                                key={user.id}
                                label={user.name}
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{ bgcolor: 'white' }}
                            />
                        ))}
                        {selectedUsers.length > 10 && (
                            <Chip label={`+${selectedUsers.length - 10} người khác`} size="small" variant="outlined" />
                        )}
                    </Box>
                </Paper>

                {/* Operation Mode */}
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                    Thao tác thực hiện
                </Typography>
                <FormControl sx={{ mb: 3 }}>
                    <RadioGroup
                        row
                        value={operation}
                        onChange={(e) => setOperation(e.target.value as any)}
                    >
                        <FormControlLabel
                            value="assign"
                            control={<Radio size="small" />}
                            label={<Typography variant="body2">Gán thêm</Typography>}
                        />
                        <FormControlLabel
                            value="remove"
                            control={<Radio size="small" />}
                            label={<Typography variant="body2">Gỡ bỏ</Typography>}
                        />
                        <FormControlLabel
                            value="replace"
                            control={<Radio size="small" />}
                            label={<Typography variant="body2">Thay thế tất cả</Typography>}
                        />
                    </RadioGroup>
                </FormControl>

                <Divider sx={{ mb: 3 }} />

                {/* Search Permissions */}
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm kiếm quyền hạn để gán..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 2 }}
                />

                {/* Permissions List */}
                <Box sx={{ flex: 1, overflow: 'auto', pr: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        Chọn quyên hạn bạn muốn thực hiện thao tác trên {selectedUsers.length} người dùng đã chọn.
                    </Typography>

                    {permissionsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <LoadingButton loading variant="text">Đang tải...</LoadingButton>
                        </Box>
                    ) : (
                        Object.entries(groupedPermissions).map(([category, permissions]) => (
                            <Box key={category} sx={{ mb: 3 }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 1,
                                    bgcolor: '#f5f5f5',
                                    p: 0.5,
                                    pl: 1,
                                    borderRadius: 1
                                }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={permissions.every(p => selectedPermissions.includes(p.id))}
                                                indeterminate={
                                                    permissions.some(p => selectedPermissions.includes(p.id)) &&
                                                    !permissions.every(p => selectedPermissions.includes(p.id))
                                                }
                                                onChange={() => handleSelectAll(permissions)}
                                            />
                                        }
                                        label={
                                            <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', fontWeight: 700 }}>
                                                {category} ({permissions.length})
                                            </Typography>
                                        }
                                    />
                                </Box>

                                <Box sx={{ ml: 3, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
                                    {permissions.map(permission => (
                                        <FormControlLabel
                                            key={permission.id}
                                            control={
                                                <Checkbox
                                                    size="small"
                                                    checked={selectedPermissions.includes(permission.id)}
                                                    onChange={() => handlePermissionToggle(permission.id)}
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{permission.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                                        {permission.code}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    ))}
                                </Box>
                            </Box>
                        ))
                    )}
                </Box>

                {/* Warnings */}
                {operation === 'replace' && (
                    <Alert severity="warning" sx={{ mt: 2, mb: 1 }}>
                        Lưu ý: Thao tác <strong>Thay thế tất cả</strong> sẽ xóa hết quyền hiện có của các user và chỉ giữ lại những quyền bạn vừa chọn.
                    </Alert>
                )}

                {/* Footer Actions */}
                <Box sx={{
                    display: 'flex',
                    gap: 1.5,
                    pt: 1.5,
                    borderTop: '1px solid #eee',
                    mt: 2
                }}>
                    <Button
                        startIcon={<Cancel />}
                        onClick={handleClose}
                        disabled={isLoading}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    >
                        Hủy
                    </Button>
                    <LoadingButton
                        startIcon={<FlashOn />}
                        onClick={handleExecute}
                        loading={isLoading}
                        disabled={selectedPermissions.length === 0}
                        variant="contained"
                        sx={{
                            borderRadius: 2,
                            flex: 1,
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                        }}
                    >
                        Thực hiện cho {selectedUsers.length} người dùng
                    </LoadingButton>
                </Box>
            </Box>
        </CommonDrawer>
    );
};

export default BulkPermissionAssignment;
