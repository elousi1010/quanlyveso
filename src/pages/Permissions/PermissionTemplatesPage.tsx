import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PermissionTemplates from './components/PermissionTemplates';

const PermissionTemplatesPage: React.FC = () => {
  return (
    <Box sx={{ mt: 0 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Template quyền hạn
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quản lý template quyền hạn theo role để gán nhanh cho user
        </Typography>
      </Paper>

      <PermissionTemplates />
    </Box>
  );
};

export default PermissionTemplatesPage;
