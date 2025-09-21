import { decodeJWT } from './jwt';

/**
 * Debug JWT token để xem nội dung thực tế
 */
export const debugJWT = () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.log('No access token found');
    return;
  }

  console.log('=== JWT Token Debug ===');
  console.log('Raw token:', token);
  
  const payload = decodeJWT(token);
  if (payload) {
    console.log('Decoded payload:', payload);
    console.log('Role:', payload.role);
    console.log('Name:', payload.name);
    console.log('Phone:', payload.phone_number);
    console.log('Organization ID:', payload.organization_id);
    console.log('Permission:', payload.permission);
    if (payload.permission) {
      console.log('Permission Code:', payload.permission.code);
      console.log('Permission Name:', payload.permission.name);
      console.log('Permission Actions:', payload.permission.actions);
    }
    console.log('Expires at:', new Date(payload.exp * 1000));
  } else {
    console.log('Failed to decode token');
  }
  console.log('========================');
};

/**
 * Log JWT token info to console
 */
export const logJWTInfo = () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.log('No access token found');
    return;
  }

  try {
    const parts = token.split('.');
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    
    console.log('JWT Header:', header);
    console.log('JWT Payload:', payload);
    console.log('Current role from API:', payload.role);
  } catch (error) {
    console.error('Error parsing JWT:', error);
  }
};
