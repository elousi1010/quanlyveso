import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Refresh as RefreshIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';

interface CommonHeaderProps {
  title: string;
  subtitle: string;
  onRefresh: () => void;
  onCreate: () => void;
  refreshButtonText?: string;
  createButtonText?: string;
  createButtonIcon?: React.ReactNode;
  loading?: boolean;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
  title,
  subtitle,
  onRefresh,
  onCreate,
  refreshButtonText = 'Làm mới',
  createButtonText = 'Thêm mới',
  createButtonIcon = <PersonAddIcon />,
  loading = false,
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
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
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
            {refreshButtonText}
          </Button>
          <Button
            variant="contained"
            startIcon={createButtonIcon}
            onClick={onCreate}
            disabled={loading}
            size="small"
            sx={{ 
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            {createButtonText}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CommonHeader;
