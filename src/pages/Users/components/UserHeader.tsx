import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Refresh as RefreshIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';

interface UserHeaderProps {
  onAddUser: () => void;
  onRefresh: () => void;
  loading: boolean;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  onAddUser,
  onRefresh,
  loading,
}) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        mb: 2, 
        background: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: 2
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
            Quản lý người dùng
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quản lý thông tin và quyền hạn của các người dùng trong hệ thống
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={loading}
            size="small"
            sx={{ 
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={onAddUser}
            disabled={loading}
            size="small"
            sx={{ 
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Thêm người dùng
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserHeader;
