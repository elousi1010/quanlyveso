import type { UserFromToken } from '../api/authApi';

/**
 * Decode JWT token and return payload
 */
export const decodeJWT = (token: string): UserFromToken | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const payload = JSON.parse(atob(parts[1])) as UserFromToken;
    return payload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};

/**
 * Get time until token expires (in seconds)
 */
export const getTokenExpiryTime = (token: string): number | null => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
};

/**
 * Check if token will expire soon (within given seconds)
 */
export const isTokenExpiringSoon = (token: string, withinSeconds: number = 300): boolean => {
  const timeUntilExpiry = getTokenExpiryTime(token);
  if (timeUntilExpiry === null) {
    return true;
  }

  return timeUntilExpiry <= withinSeconds;
};
