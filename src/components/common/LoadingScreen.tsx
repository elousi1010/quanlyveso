import React from 'react';
import { Box, Typography } from '@mui/material';
import Logo from './Logo';

interface LoadingScreenProps {
  message?: string;
  size?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Đang tải...', 
  size = 60 
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      gap={3}
    >
      {/* Animated Logo */}
      <Logo 
        size={size}
        animated={true}
        variant="icon"
        showText={false}
      />

      {/* Loading message */}
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export { LoadingScreen };
export default LoadingScreen;
