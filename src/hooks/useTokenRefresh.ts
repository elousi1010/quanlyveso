import { useEffect, useRef, useCallback } from 'react';
import { useRefreshToken } from './useAuthApi';
import { useAuthStore } from '../stores/authStore';
import { isTokenExpiringSoon, isTokenExpired, decodeJWT } from '../utils/jwt';

/**
 * Hook để tự động refresh token mỗi 1 phút
 */
export const useTokenRefresh = () => {
  const refreshTokenMutation = useRefreshToken();
  const { clearAuth, isAuthenticated } = useAuthStore();
  const intervalRef = useRef<number | null>(null);
  const isRefreshingRef = useRef(false);

  const refreshTokens = useCallback(async () => {
    // Prevent multiple simultaneous refresh calls
    if (isRefreshingRef.current) {
      console.log('Token refresh already in progress, skipping...');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping token refresh');
      return;
    }

    const refreshTokenFromStorage = localStorage.getItem('refresh_token');
    if (!refreshTokenFromStorage) {
      console.log('No refresh token available');
      clearAuth();
      return;
    }

    try {
      isRefreshingRef.current = true;
      console.log('Refreshing tokens proactively...');
      
      // Use mutateAsync để đợi kết quả
      await refreshTokenMutation.mutateAsync({ refresh_token: refreshTokenFromStorage });
      console.log('Token refresh completed successfully');
      
    } catch (error) {
      console.error('Failed to refresh tokens:', error);
      clearAuth();
    } finally {
      isRefreshingRef.current = false;
    }
  }, [refreshTokenMutation, clearAuth, isAuthenticated]);

  const checkAndRefreshTokens = useCallback(() => {
    const now = new Date().toLocaleTimeString();
    console.log(`[${now}] Token refresh check started...`);
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      console.log(`[${now}] User not authenticated, skipping token check`);
      return;
    }

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.log(`[${now}] No access token found`);
      clearAuth();
      return;
    }
    
    // Decode token to get expiry info
    const tokenPayload = decodeJWT(accessToken);
    const timeUntilExpiry = tokenPayload?.exp ? Math.max(0, tokenPayload.exp - Math.floor(Date.now() / 1000)) : 0;
    const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60);
    
    console.log(`[${now}] Token info:`, {
      exp: tokenPayload?.exp,
      timeUntilExpiry: `${minutesUntilExpiry} minutes`,
      isExpired: isTokenExpired(accessToken),
      isExpiringSoon: isTokenExpiringSoon(accessToken, 2 * 60)
    });
    
    // Check if token is expired
    if (isTokenExpired(accessToken)) {
      console.log(`[${now}] Token is expired, refreshing...`);
      refreshTokens();
      return;
    }
    
    // For test tokens, refresh if expiring within 10 seconds
    const isTestToken = accessToken.includes('test-signature');
    const expiryThreshold = isTestToken ? 10 : 120; // 10 seconds for test, 2 minutes for real
    
    // Check if token is expiring soon
    const isExpiringSoon = isTokenExpiringSoon(accessToken, expiryThreshold);
    
    if (isExpiringSoon && !isRefreshingRef.current) {
      console.log(`[${now}] Token is expiring soon (${minutesUntilExpiry} minutes left), refreshing...`);
      refreshTokens();
    } else {
      console.log(`[${now}] Token is still valid (${minutesUntilExpiry} minutes left), no refresh needed`);
    }
  }, [refreshTokens, isAuthenticated, clearAuth]);

  useEffect(() => {
    // Reset refreshing flag when mutation completes
    if (!refreshTokenMutation.isPending) {
      isRefreshingRef.current = false;
    }
  }, [refreshTokenMutation.isPending]);

  useEffect(() => {
    // Only start token refresh if user is authenticated
    if (!isAuthenticated) {
      return;
    }

    // Refresh immediately if needed
    checkAndRefreshTokens();

    // Set up interval to check every 1 minute (60000 ms)
    intervalRef.current = window.setInterval(checkAndRefreshTokens, 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkAndRefreshTokens, isAuthenticated]);

  // Add immediate check when token is updated
  useEffect(() => {
    const handleTokenUpdate = () => {
      console.log('Token updated, checking immediately...');
      checkAndRefreshTokens();
    };

    window.addEventListener('tokenUpdated', handleTokenUpdate);
    return () => window.removeEventListener('tokenUpdated', handleTokenUpdate);
  }, [checkAndRefreshTokens]);

  // Force immediate refresh (for testing)
  const forceRefresh = useCallback(() => {
    console.log('Force refresh triggered...');
    checkAndRefreshTokens();
  }, [checkAndRefreshTokens]);

  // Expose force refresh for testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).forceTokenRefresh = forceRefresh;
    }
  }, [forceRefresh]);

  return {
    isRefreshing: refreshTokenMutation.isPending || isRefreshingRef.current,
    refreshError: refreshTokenMutation.error,
    forceRefresh,
  };
};
