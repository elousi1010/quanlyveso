import { decodeJWT } from './jwt';

/**
 * Debug JWT token để xem nội dung thực tế
 */
export const debugJWT = () => {
  const token = localStorage.getItem('access_token');
  if (!token) {

    return;
  }

  const payload = decodeJWT(token);
  if (payload) {

    if (payload.permission) {

    }
    console.log('Expires at:', new Date(payload.exp * 1000));
  } else {

  }

};

/**
 * Log JWT token info to console
 */
export const logJWTInfo = () => {
  const token = localStorage.getItem('access_token');
  if (!token) {

    return;
  }

  try {
    const parts = token.split('.');
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

  } catch (error) {
    console.error('Error parsing JWT:', error);
  }
};
