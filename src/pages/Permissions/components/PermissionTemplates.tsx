import React, { useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Chip,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Security,
    People,
    AssignmentTurnedIn,
    AutoFixHigh
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { permissionApi } from '../api';
import type { PermissionTemplate } from '../types';

const PermissionTemplates: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<PermissionTemplate | null>(null);
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);

    // Fetch templates (Mocked in the API)
    const { data: templates, isLoading } = useQuery({
        queryKey: ['permission-templates'],
        queryFn: () => permissionApi.getTemplates(),
    });

    const handleApplyTemplate = (template: PermissionTemplate) => {
        setSelectedTemplate(template);
        setApplyDialogOpen(true);
    };

    const handleApplyConfirm = async () => {
        if (selectedTemplate) {
            await permissionApi.applyTemplateToUser('all', selectedTemplate.id);
            setApplyDialogOpen(false);
        }
    };

    if (isLoading) {
        return <Typography>Đang tải templates...</Typography>;
    }

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Danh sách Template ({templates?.length || 0})
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{ borderRadius: 2 }}
                >
                    Tạo Template Mới
                </Button>
            </Box>

            <Grid container spacing={3}>
                {(templates || []).map((template) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
                        <Card
                            elevation={2}
                            sx={{
                                borderRadius: 3,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-4px)' }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <AvatarGradient icon={<Security />} />
                                    <Box>
                                        <IconButton size="small"><Edit fontSize="small" /></IconButton>
                                        <IconButton size="small" color="error"><Delete fontSize="small" /></IconButton>
                                    </Box>
                                </Box>

                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    {template.name}
                                </Typography>
                                <Chip
                                    label={`Role: ${template.role.toUpperCase()}`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ mb: 2, fontWeight: 600 }}
                                />

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                                    {template.description || 'Không có mô tả cho template này.'}
                                </Typography>

                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AssignmentTurnedIn fontSize="small" color="action" />
                                    <Typography variant="caption" color="text.secondary">
                                        {template.permission_ids.length} quyền hạn được gán
                                    </Typography>
                                </Box>
                            </CardContent>

                            <Box sx={{ p: 2, pt: 0 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<AutoFixHigh />}
                                    onClick={() => handleApplyTemplate(template)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Áp dụng cho User
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Apply Template Dialog */}
            <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Áp dụng Template</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Bạn có chắc chắn muốn áp dụng template <strong>{selectedTemplate?.name}</strong> cho các người dùng được chọn?
                    </Typography>
                    <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
                        * Thao tác này sẽ cập nhật lại toàn bộ quyền hạn theo template này.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setApplyDialogOpen(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleApplyConfirm} autoFocus>Xác nhận</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

// Helper component for styled avatar
const AvatarGradient: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
    <Box sx={{
        width: 40,
        height: 40,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #03a9f4 100%)',
        color: 'white',
        boxShadow: '0 4px 10px rgba(3, 169, 244, 0.3)'
    }}>
        {icon}
    </Box>
);

export default PermissionTemplates;
