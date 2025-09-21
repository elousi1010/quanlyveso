import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import TokenRefreshTest from '../components/TokenRefreshTest';

const TokenTest: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Token Refresh Test Page
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Trang này để test chức năng refresh token mỗi 1 phút. 
          Mở Developer Console để xem logs chi tiết.
        </Typography>
        
        <TokenRefreshTest />
      </Box>
    </Container>
  );
};

export default TokenTest;
