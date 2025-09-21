// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://lottery.esimvn.net',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
  },
} as const;

// Token Configuration
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  REFRESH_INTERVAL: 15 * 60 * 1000, // 15 minutes
  EXPIRY_THRESHOLD: 5 * 60 * 1000, // 5 minutes
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  OWNER: 'owner',
  EMPLOYEE: 'employee',
  SELLER: 'seller',
  USER: 'user',
} as const;

// Permission Actions
export const PERMISSION_ACTIONS = {
  CREATE: 1,
  READ: 2,
  UPDATE: 4,
  DELETE: 8,
  FULL_ACCESS: 15, // 1111 binary
} as const;

// UI Configuration
export const UI_CONFIG = {
  DRAWER_WIDTH: 320,
  MOBILE_BREAKPOINT: 768,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Form Validation
export const VALIDATION = {
  PHONE_REGEX: /^[0-9]{10,11}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  UNAUTHORIZED: 'Bạn không có quyền truy cập.',
  FORBIDDEN: 'Truy cập bị từ chối.',
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ.',
  TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn.',
  LOGIN_FAILED: 'Đăng nhập thất bại.',
  LOGOUT_FAILED: 'Đăng xuất thất bại.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  SAVE_SUCCESS: 'Lưu thành công!',
  UPDATE_SUCCESS: 'Cập nhật thành công!',
  DELETE_SUCCESS: 'Xóa thành công!',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_STORAGE: 'auth-storage',
  THEME: 'theme',
  LANGUAGE: 'language',
  USER_PREFERENCES: 'user-preferences',
} as const;

// Query Keys
export const QUERY_KEYS = {
  AUTH: {
    ALL: ['auth'],
    USER: () => [...QUERY_KEYS.AUTH.ALL, 'user'],
    PERMISSIONS: () => [...QUERY_KEYS.AUTH.ALL, 'permissions'],
  },
  TICKETS: {
    ALL: ['tickets'],
    LIST: () => [...QUERY_KEYS.TICKETS.ALL, 'list'],
    DETAIL: (id: string) => [...QUERY_KEYS.TICKETS.ALL, 'detail', id],
  },
  USERS: {
    ALL: ['users'],
    LIST: () => [...QUERY_KEYS.USERS.ALL, 'list'],
    DETAIL: (id: string) => [...QUERY_KEYS.USERS.ALL, 'detail', id],
  },
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
  FULL_DATE: 'FULL_DATE',
  SHORT_DATE: 'SHORT_DATE',
  LONG_DATE: 'LONG_DATE',
  FULL_DATETIME: 'FULL_DATETIME',
} as const;

// Table Configuration
export const TABLE_CONFIG = {
  DEFAULT_ROWS_PER_PAGE: 10,
  ROWS_PER_PAGE_OPTIONS: [5, 10, 25, 50],
  DENSE_PADDING: 40,
  NORMAL_PADDING: 56,
} as const;

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  MODAL: 1300,
  DRAWER: 1200,
  APP_BAR: 1100,
  TOOLTIP: 1000,
  SNACKBAR: 1400,
} as const;

// Color Themes
export const COLORS = {
  PRIMARY: '#1976d2',
  SECONDARY: '#dc004e',
  SUCCESS: '#2e7d32',
  WARNING: '#ed6c02',
  ERROR: '#d32f2f',
  INFO: '#0288d1',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 960,
  LG: 1280,
  XL: 1920,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  MAX_FILES: 5,
} as const;

// Debounce Delays
export const DEBOUNCE = {
  SEARCH: 300,
  INPUT: 500,
  API_CALL: 1000,
} as const;

// Retry Configuration
export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  DELAY: 1000,
  BACKOFF_MULTIPLIER: 2,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  REFETCH_INTERVAL: 30 * 1000, // 30 seconds
} as const;
