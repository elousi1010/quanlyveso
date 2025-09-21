import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, type LoginRequest, type SignupRequest, type RefreshTokenRequest, type UserFromToken } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { decodeJWT, isTokenExpired } from '../utils/jwt';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Hook cho login
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setTokens, setError, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      // Decode JWT token để lấy permission và timing info
      const jwtPayload = decodeJWT(response.data.access_token);
      
      // Merge profile data với JWT payload
      const userData = {
        sub: response.data.profile.id,
        name: response.data.profile.name,
        phone_number: response.data.profile.phone_number,
        role: response.data.profile.role,
        organization_id: response.data.profile.organization_id,
        permission: jwtPayload?.permission || null,
        iat: jwtPayload?.iat || 0,
        exp: jwtPayload?.exp || 0,
      };
      
      // Lưu user data vào store
      setUser(userData);
      
      // Lưu tokens vào store
      setTokens(response.data.access_token, response.data.refresh_token);
      
      // Invalidate và refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
    onError: (error) => {
      console.error('Login failed:', error);
      setError(error.message);
    },
  });
};

// Hook cho signup
export const useSignup = () => {
  const queryClient = useQueryClient();
  const { setTokens, setError, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: SignupRequest) => authApi.signup(data),
    onSuccess: (response) => {
      // Decode JWT token để lấy permission và timing info
      const jwtPayload = decodeJWT(response.data.access_token);
      
      // Merge profile data với JWT payload
      const userData = {
        sub: response.data.profile.id,
        name: response.data.profile.name,
        phone_number: response.data.profile.phone_number,
        role: response.data.profile.role,
        organization_id: response.data.profile.organization_id,
        permission: jwtPayload?.permission || null,
        iat: jwtPayload?.iat || 0,
        exp: jwtPayload?.exp || 0,
      };
      
      // Lưu user data vào store
      setUser(userData);
      
      // Lưu tokens vào store
      setTokens(response.data.access_token, response.data.refresh_token);
      
      // Invalidate và refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
    onError: (error) => {
      console.error('Signup failed:', error);
      setError(error.message);
    },
  });
};

// Hook cho refresh token
export const useRefreshToken = () => {
  const { updateTokens, clearAuth, setError } = useAuthStore();

  return useMutation({
    mutationFn: (data: RefreshTokenRequest) => {
      console.log('Calling refresh token API...', {
        refreshTokenLength: data.refresh_token.length,
        refreshTokenPreview: data.refresh_token.substring(0, 20) + '...'
      });
      return authApi.refreshToken(data);
    },
    onSuccess: (response) => {
      console.log('Refresh token API success:', {
        accessTokenLength: response.data.access_token.length,
        refreshTokenLength: response.data.refresh_token.length,
        accessTokenPreview: response.data.access_token.substring(0, 20) + '...',
        refreshTokenPreview: response.data.refresh_token.substring(0, 20) + '...'
      });
      
      // Cập nhật token mới trong Zustand store
      updateTokens(response.data.access_token, response.data.refresh_token);
      
      console.log('Token refresh completed successfully');
    },
    onError: (error) => {
      console.error('Refresh token failed:', error);
      setError(error.message);
      // Xóa auth state nếu refresh thất bại
      clearAuth();
    },
  });
};

// Hook cho logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Xóa auth state từ Zustand store
      clearAuth();
      
      // Clear tất cả queries
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Vẫn clear auth state ngay cả khi API call thất bại
      clearAuth();
      
      // Clear tất cả queries
      queryClient.clear();
    },
  });
};

// Hook để lấy thông tin user hiện tại
export const useCurrentUser = () => {
  const { user, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: (): UserFromToken => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken || !user || !isAuthenticated) {
        throw new Error('User not authenticated or token invalid');
      }
      
      // Check if token is valid
      const payload = decodeJWT(accessToken);
      if (!payload || isTokenExpired(accessToken)) {
        throw new Error('Token invalid or expired');
      }
      
      return user;
    },
    enabled: isAuthenticated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry, Zustand store handles token validation
  });
};

// Hook để check authentication status
export const useIsAuthenticated = () => {
  const { isAuthenticated, user, isLoading, error } = useAuthStore();
  
  return {
    isAuthenticated,
    user,
    isLoading,
    error,
  };
};
