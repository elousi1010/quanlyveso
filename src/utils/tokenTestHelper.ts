import { decodeJWT } from './jwt';

/**
 * Helper functions for testing token refresh functionality
 */

/**
 * Create a test token that expires in the specified number of seconds
 * This is for testing purposes only
 */
export const createTestToken = (expiresInSeconds: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + expiresInSeconds;
  
  // Create a mock JWT payload
  const payload = {
    sub: 'test-user-id',
    name: 'Test User',
    phone_number: '0123456789',
    role: 'admin',
    organization_id: 'test-org',
    permission: {
      id: 'test-permission-id',
      created_at: new Date().toISOString(),
      created_by: 'test-user',
      updated_at: new Date().toISOString(),
      updated_by: null,
      deleted_at: null,
      is_active: true,
      code: 'all',
      name: 'All Permissions',
      actions: {
        user: 1,
        ticket: 1,
        partner: 1,
        permission: 1,
        transaction: 1
      },
      organization_id: 'test-org'
    },
    iat: now,
    exp: exp
  };
  
  // Create a mock JWT (this is just for testing, not a real JWT)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadEncoded = btoa(JSON.stringify(payload));
  const signature = 'test-signature';
  
  const token = `${header}.${payloadEncoded}.${signature}`;
  
  console.log('Created test token:', {
    expiresInSeconds,
    exp,
    now,
    tokenPreview: token.substring(0, 50) + '...'
  });
  
  return token;
};

/**
 * Set a test token in localStorage for testing
 */
export const setTestToken = (expiresInSeconds: number): void => {

  const testToken = createTestToken(expiresInSeconds);
  
  // Store only access token, keep existing refresh token
  const existingRefreshToken = localStorage.getItem('refresh_token');
  localStorage.setItem('access_token', testToken);
  
  // Only set refresh token if none exists
  if (!existingRefreshToken) {
    localStorage.setItem('refresh_token', 'test-refresh-token');

  } else {
    console.log('Keeping existing refresh token:', existingRefreshToken.substring(0, 20) + '...');
  }
  
  // Verify storage
  const storedToken = localStorage.getItem('access_token');
  const storedRefreshToken = localStorage.getItem('refresh_token');
  
  console.log('Tokens stored:', {
    accessTokenStored: !!storedToken,
    refreshTokenStored: !!storedRefreshToken,
    accessTokenLength: storedToken?.length || 0,
    refreshTokenLength: storedRefreshToken?.length || 0,
    refreshTokenPreview: storedRefreshToken?.substring(0, 20) + '...'
  });
  
  // Decode and verify
  const payload = decodeJWT(testToken);

  if (payload) {
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = Math.max(0, payload.exp - now);
    console.log(`Token will expire in ${timeUntilExpiry} seconds (${Math.floor(timeUntilExpiry / 60)}m ${timeUntilExpiry % 60}s)`);
  } else {
    console.error('Failed to decode test token!');
  }
  
  // Trigger a custom event to notify components
  window.dispatchEvent(new CustomEvent('tokenUpdated'));
  
  // Also trigger immediate refresh check
  setTimeout(() => {
    if ((window as any).forceTokenRefresh) {

      (window as any).forceTokenRefresh();
    }
  }, 100);
};

/**
 * Get current token expiry info
 */
export const getTokenExpiryInfo = () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    return { error: 'No token found' };
  }
  
  const payload = decodeJWT(accessToken);
  if (!payload) {
    return { error: 'Invalid token' };
  }
  
  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = Math.max(0, payload.exp - now);
  const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60);
  const secondsUntilExpiry = timeUntilExpiry % 60;
  
  return {
    exp: payload.exp,
    now: now,
    timeUntilExpiry: timeUntilExpiry,
    minutesUntilExpiry: minutesUntilExpiry,
    secondsUntilExpiry: secondsUntilExpiry,
    formatted: `${minutesUntilExpiry}m ${secondsUntilExpiry}s`
  };
};

/**
 * Clear test tokens and restore original tokens if available
 */
export const clearTestTokens = (): void => {

  // Check if we have original tokens stored
  const originalAccessToken = localStorage.getItem('original_access_token');
  const originalRefreshToken = localStorage.getItem('original_refresh_token');
  
  if (originalAccessToken && originalRefreshToken) {

    localStorage.setItem('access_token', originalAccessToken);
    localStorage.setItem('refresh_token', originalRefreshToken);
    localStorage.removeItem('original_access_token');
    localStorage.removeItem('original_refresh_token');
  } else {

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
  
  // Trigger update event
  window.dispatchEvent(new CustomEvent('tokenUpdated'));
};

/**
 * Store original tokens before testing
 */
export const storeOriginalTokens = (): void => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (accessToken && refreshToken) {
    localStorage.setItem('original_access_token', accessToken);
    localStorage.setItem('original_refresh_token', refreshToken);

  } else {

  }
};

/**
 * Test functions for console
 */
if (typeof window !== 'undefined') {
  (window as any).tokenTestHelper = {
    setTestToken,
    getTokenExpiryInfo,
    createTestToken,
    clearTestTokens,
    storeOriginalTokens
  };

  console.log('- tokenTestHelper.setTestToken(seconds) - Set token to expire in X seconds');
  console.log('- tokenTestHelper.getTokenExpiryInfo() - Get current token expiry info');
  console.log('- tokenTestHelper.createTestToken(seconds) - Create test token');
  console.log('- tokenTestHelper.clearTestTokens() - Clear test tokens and restore originals');
  console.log('- tokenTestHelper.storeOriginalTokens() - Store current tokens as originals');
}
