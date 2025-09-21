import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Refresh as RefreshIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';

interface PartnerHeaderProps {
  onRefresh: () => void;
  onCreate: () => void;
}

const PartnerHeader: React.FC<PartnerHeaderProps> = ({ onRefresh, onCreate }) => {
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
            Quản lý đối tác
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quản lý thông tin và cấp độ của các đối tác trong hệ thống
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
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
            onClick={onCreate}
            size="small"
            sx={{ 
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Thêm đối tác
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default PartnerHeader;
