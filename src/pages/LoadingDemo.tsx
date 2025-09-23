import React, { useState } from 'react';
import { Box, Button, Typography, Card, CardContent, Stack } from '@mui/material';
import { LoadingScreen, Logo } from '@/components/common';

const LoadingDemo: React.FC = () => {
  const [showLoading, setShowLoading] = useState(false);

  const handleShowLoading = () => {
    setShowLoading(true);
    // Auto hide after 3 seconds for demo
    setTimeout(() => setShowLoading(false), 3000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Loading Animation Demo
      </Typography>
      
      <Stack spacing={3}>
        {/* Demo Controls */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Demo Controls
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleShowLoading}
              disabled={showLoading}
            >
              {showLoading ? 'Loading...' : 'Show Loading Animation'}
            </Button>
          </CardContent>
        </Card>

        {/* Logo Variants */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Logo Variants
            </Typography>
            <Stack direction="row" spacing={4} alignItems="center" flexWrap="wrap" sx={{ gap: 3 }}>
              {/* Static Logo Icon */}
              <Box textAlign="center">
                <Logo size={40} variant="icon" showText={false} />
                <Typography variant="caption" display="block" mt={1}>
                  Static Icon
                </Typography>
              </Box>

              {/* Animated Logo Icon */}
              <Box textAlign="center">
                <Logo size={40} variant="icon" showText={false} animated={true} />
                <Typography variant="caption" display="block" mt={1}>
                  Animated Icon
                </Typography>
              </Box>

              {/* Full Logo */}
              <Box textAlign="center" sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: 2,
                borderRadius: 2
              }}>
                <Logo size={36} variant="full" showText={true} />
                <Typography variant="caption" display="block" mt={1} color="white">
                  Full Logo
                </Typography>
              </Box>

              {/* Collapsed Logo */}
              <Box textAlign="center" sx={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                padding: 2,
                borderRadius: 2
              }}>
                <Logo size={20} variant="collapsed" showText={true} />
                <Typography variant="caption" display="block" mt={1} color="white">
                  Collapsed
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Loading Screen Demo */}
        {showLoading && (
          <Card>
            <CardContent>
              <LoadingScreen message="Đang tải dữ liệu..." size={80} />
            </CardContent>
          </Card>
        )}

        {/* Different Sizes */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Different Sizes (Animated)
            </Typography>
            <Stack direction="row" spacing={4} alignItems="center" flexWrap="wrap" sx={{ gap: 3 }}>
              <Box textAlign="center">
                <Logo size={24} variant="icon" showText={false} animated={true} />
                <Typography variant="caption" display="block" mt={1}>
                  Small (24px)
                </Typography>
              </Box>

              <Box textAlign="center">
                <Logo size={40} variant="icon" showText={false} animated={true} />
                <Typography variant="caption" display="block" mt={1}>
                  Medium (40px)
                </Typography>
              </Box>

              <Box textAlign="center">
                <Logo size={60} variant="icon" showText={false} animated={true} />
                <Typography variant="caption" display="block" mt={1}>
                  Large (60px)
                </Typography>
              </Box>

              <Box textAlign="center">
                <Logo size={80} variant="icon" showText={false} animated={true} />
                <Typography variant="caption" display="block" mt={1}>
                  Extra Large (80px)
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default LoadingDemo;
