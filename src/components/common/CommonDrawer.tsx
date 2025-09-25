import React from 'react';
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface CommonDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number | string;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  loading?: boolean;
}

const CommonDrawer: React.FC<CommonDrawerProps> = ({
  open,
  onClose,
  title,
  children,
  width = 400,
  anchor = 'right',
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Adjust width for mobile screens
  const drawerWidth = isMobile ? '100%' : width;

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          maxWidth: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          minHeight: 64,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 0,
        }}
      >
        {children}
      </Box>
    </Drawer>
  );
};

export default CommonDrawer;