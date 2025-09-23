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
import type { DrawerProps } from '@mui/material/Drawer';
import { Close as CloseIcon } from '@mui/icons-material';

export interface CommonDrawerProps extends Omit<DrawerProps, 'open' | 'onClose'> {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number | string;
  showCloseButton?: boolean;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

const CommonDrawer: React.FC<CommonDrawerProps> = ({
  open,
  onClose,
  title,
  children,
  width = 400,
  showCloseButton = true,
  headerContent,
  footerContent,
  ...drawerProps
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: isMobile ? '100%' : width,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      {...drawerProps}
    >
      {/* Header */}
      {(title || headerContent || showCloseButton) && (
        <>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 64,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {headerContent || (
                <Typography variant="h6" noWrap>
                  {title}
                </Typography>
              )}
            </Box>
            {showCloseButton && (
              <IconButton
                onClick={onClose}
                size="small"
                sx={{ ml: 1, flexShrink: 0 }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
          <Divider />
        </>
      )}

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

      {/* Footer */}
      {footerContent && (
        <>
          <Divider />
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            {footerContent}
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default CommonDrawer;
