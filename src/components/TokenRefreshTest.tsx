import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Alert } from '@mui/material';
import { useAuthStore } from '../stores/authStore';
import { decodeJWT, isTokenExpired, isTokenExpiringSoon } from '../utils/jwt';

const TokenRefreshTest: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [refreshLogs, setRefreshLogs] = useState<string[]>([]);

  const updateTokenInfo = () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!accessToken) {
      setTokenInfo(null);
      return;
    }

    const payload = decodeJWT(accessToken);
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload?.exp ? Math.max(0, payload.exp - now) : 0;
    const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60);
    const secondsUntilExpiry = timeUntilExpiry % 60;

    setTokenInfo({
      payload,
      isExpired: isTokenExpired(accessToken),
      isExpiringSoon: isTokenExpiringSoon(accessToken, 2 * 60),
      timeUntilExpiry: `${minutesUntilExpiry}m ${secondsUntilExpiry}s`,
      exp: payload?.exp,
      iat: payload?.iat,
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'None',
      refreshTokenLength: refreshToken?.length || 0,
    });
  };

  useEffect(() => {
    updateTokenInfo();
    const interval = setInterval(updateTokenInfo, 1000); // Update every second
    
    // Listen for token updates
    const handleTokenUpdate = () => {
      console.log('Token updated event received, refreshing info...');
      updateTokenInfo();
    };
    
    window.addEventListener('tokenUpdated', handleTokenUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('tokenUpdated', handleTokenUpdate);
    };
  }, []);

  useEffect(() => {
    // Listen for token refresh logs
    const originalLog = console.log;
    console.log = (...args) => {
      if (args[0]?.includes?.('Token refresh') || args[0]?.includes?.('Token info')) {
        setRefreshLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${args.join(' ')}`]);
      }
      originalLog(...args);
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <Paper sx={{ p: 2, m: 2 }}>
        <Alert severity="info">
          Vui lòng đăng nhập để test token refresh
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Token Refresh Test
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Token Information:
        </Typography>
        {tokenInfo ? (
          <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
            <div>User: {user?.name} ({user?.phone_number})</div>
            <div>Role: {user?.role}</div>
            <div>Expires in: {tokenInfo.timeUntilExpiry}</div>
            <div>Is Expired: {tokenInfo.isExpired ? 'Yes' : 'No'}</div>
            <div>Is Expiring Soon: {tokenInfo.isExpiringSoon ? 'Yes' : 'No'}</div>
            <div>Exp: {tokenInfo.exp}</div>
            <div>IAT: {tokenInfo.iat}</div>
            <div>Refresh Token: {tokenInfo.refreshToken}</div>
            <div>Refresh Token Length: {tokenInfo.refreshTokenLength}</div>
          </Box>
        ) : (
          <Typography color="error">No token found</Typography>
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={updateTokenInfo}
          sx={{ mr: 1 }}
        >
          Refresh Info
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => setRefreshLogs([])}
          sx={{ mr: 1 }}
        >
          Clear Logs
        </Button>
        <Button 
          variant="outlined" 
          color="warning"
          onClick={() => {
            if ((window as any).tokenTestHelper) {
              (window as any).tokenTestHelper.setTestToken(30); // 30 seconds
              updateTokenInfo();
            } else {
              alert('Token test helper not loaded. Check console.');
            }
          }}
          sx={{ mr: 1 }}
        >
          Set Test Token (30s)
        </Button>
        <Button 
          variant="outlined" 
          color="error"
          onClick={() => {
            if ((window as any).tokenTestHelper) {
              (window as any).tokenTestHelper.setTestToken(5); // 5 seconds
              updateTokenInfo();
            } else {
              alert('Token test helper not loaded. Check console.');
            }
          }}
          sx={{ mr: 1 }}
        >
          Set Test Token (5s)
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
              alert('No refresh token found! Please login first.');
              return;
            }
            
            // Test refresh token API call
            fetch('/api/auth/refresh-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh_token: refreshToken })
            })
            .then(response => response.json())
            .then(data => {
              console.log('Refresh token API response:', data);
              if (data.data && data.data.access_token) {
                localStorage.setItem('access_token', data.data.access_token);
                localStorage.setItem('refresh_token', data.data.refresh_token);
                updateTokenInfo();
                alert('Refresh token test successful!');
              } else {
                alert('Refresh token test failed: ' + (data.message || 'Unknown error'));
              }
            })
            .catch(error => {
              console.error('Refresh token test error:', error);
              alert('Refresh token test error: ' + error.message);
            });
          }}
          sx={{ mr: 1 }}
        >
          Test Real Refresh Token
        </Button>
        <Button 
          variant="outlined" 
          color="info"
          onClick={() => {
            console.log('=== DEBUG INFO ===');
            console.log('Token test helper available:', !!(window as any).tokenTestHelper);
            console.log('Current access token:', localStorage.getItem('access_token')?.substring(0, 50) + '...');
            console.log('Current refresh token:', localStorage.getItem('refresh_token'));
            console.log('Token expiry info:', (window as any).tokenTestHelper?.getTokenExpiryInfo());
            console.log('==================');
            
            // Test creating a token
            if ((window as any).tokenTestHelper) {
              console.log('Testing token creation...');
              (window as any).tokenTestHelper.setTestToken(10);
            } else {
              alert('Token test helper not loaded!');
            }
          }}
          sx={{ mr: 1 }}
        >
          Debug Info
        </Button>
        <Button 
          variant="outlined" 
          color="warning"
          onClick={() => {
            if ((window as any).tokenTestHelper) {
              (window as any).tokenTestHelper.storeOriginalTokens();
              alert('Original tokens stored! Now you can safely test.');
            } else {
              alert('Token test helper not loaded!');
            }
          }}
          sx={{ mr: 1 }}
        >
          Store Original Tokens
        </Button>
        <Button 
          variant="outlined" 
          color="error"
          onClick={() => {
            if ((window as any).tokenTestHelper) {
              (window as any).tokenTestHelper.clearTestTokens();
              updateTokenInfo();
              alert('Test tokens cleared! Original tokens restored if available.');
            } else {
              alert('Token test helper not loaded!');
            }
          }}
          sx={{ mr: 1 }}
        >
          Clear Test Tokens
        </Button>
        <Button 
          variant="contained" 
          color="secondary"
          onClick={() => {
            if ((window as any).forceTokenRefresh) {
              (window as any).forceTokenRefresh();
              console.log('Force refresh triggered manually');
            } else {
              alert('Force refresh not available!');
            }
          }}
        >
          Force Refresh Now
        </Button>
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Refresh Logs (Last 10):
        </Typography>
        <Box sx={{ 
          maxHeight: 200, 
          overflow: 'auto', 
          fontFamily: 'monospace', 
          fontSize: '0.75rem',
          backgroundColor: '#f5f5f5',
          p: 1,
          borderRadius: 1
        }}>
          {refreshLogs.length === 0 ? (
            <div>No logs yet...</div>
          ) : (
            refreshLogs.map((log, index) => (
              <div key={index}>{log}</div>
            ))
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default TokenRefreshTest;
