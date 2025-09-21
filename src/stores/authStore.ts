import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { decodeJWT, isTokenExpired } from '../utils/jwt';
import type { UserFromToken } from '../api/authApi';

interface AuthState {
  // State
  isAuthenticated: boolean;
  user: UserFromToken | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: UserFromToken) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  
  // Computed
  isTokenValid: () => boolean;
  isTokenExpiringSoon: (withinMinutes?: number) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      // Actions
      setTokens: (accessToken: string, refreshToken: string) => {
        // Xóa tokens cũ trước
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Set tokens mới
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        
        // Chỉ cập nhật tokens, không ghi đè user data
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
          error: null,
        });
      },

      setUser: (user: UserFromToken) => {
        set({ user, isAuthenticated: true, error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearAuth: () => {
        // Xóa localStorage trước
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Xóa Zustand store
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          error: null,
        });
      },

      updateTokens: (accessToken: string, refreshToken: string) => {
        console.log('Updating tokens in store...', {
          accessTokenLength: accessToken.length,
          refreshTokenLength: refreshToken.length,
          currentAccessToken: localStorage.getItem('access_token')?.substring(0, 20) + '...',
          newAccessToken: accessToken.substring(0, 20) + '...'
        });
        
        // Xóa tokens cũ trước
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Set tokens mới
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        
        // Decode JWT để lấy thông tin user mới
        const jwtPayload = decodeJWT(accessToken);
        
        // Cập nhật tokens và user data nếu có
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
          error: null,
          // Cập nhật user data từ JWT payload nếu có
          ...(jwtPayload && {
            user: {
              sub: jwtPayload.sub || '',
              name: jwtPayload.name || '',
              phone_number: jwtPayload.phone_number || '',
              role: jwtPayload.role || '',
              organization_id: jwtPayload.organization_id || '',
              permission: jwtPayload.permission || null,
              iat: jwtPayload.iat || 0,
              exp: jwtPayload.exp || 0,
            }
          })
        });
        
        console.log('Tokens updated successfully in store', {
          storedAccessToken: localStorage.getItem('access_token')?.substring(0, 20) + '...',
          storedRefreshToken: localStorage.getItem('refresh_token')?.substring(0, 20) + '...',
          userUpdated: !!jwtPayload
        });
      },

      // Computed
      isTokenValid: () => {
        const { accessToken } = get();
        return !!accessToken && !isTokenExpired(accessToken);
      },

      isTokenExpiringSoon: (withinMinutes = 5) => {
        const { accessToken } = get();
        if (!accessToken) return false;
        
        const user = decodeJWT(accessToken);
        if (!user || !user.exp) return true;
        
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = user.exp - now;
        const withinSeconds = withinMinutes * 60;
        
        return timeUntilExpiry <= withinSeconds;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Chỉ persist user và isAuthenticated, tokens được quản lý riêng
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
