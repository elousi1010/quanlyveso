import { api } from '../utils/api';

// Types cho auth
export interface LoginRequest {
  phone_number: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  error: string;
  statusCode: number;
  data: {
    access_token: string;
    refresh_token: string;
    profile: {
      id: string;
      name: string;
      phone_number: string;
      role: string;
      organization_id: string;
      permissions: {
        user: number;
        ticket: number;
        partner: number;
        permission: number;
        transaction: number;
      };
    };
  };
}

export interface SignupRequest {
  name: string;
  phone_number: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  error: string;
  statusCode: number;
  data: {
    access_token: string;
    refresh_token: string;
    profile: {
      id: string;
      name: string;
      phone_number: string;
      role: string;
      organization_id: string;
      permissions: {
        user: number;
        ticket: number;
        partner: number;
        permission: number;
        transaction: number;
      };
    };
  };
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  message: string;
  error: string;
  statusCode: number;
  data: {
    access_token: string;
    refresh_token: string;
  };
}

export interface LogoutResponse {
  message: string;
}

// User data from JWT token
export interface UserFromToken {
  sub: string; // user id
  name: string;
  permission: {
    id: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string | null;
    deleted_at: string | null;
    is_active: boolean;
    code: string;
    name: string;
    actions: {
      user: number;
      ticket: number;
      partner: number;
      permission: number;
      transaction: number;
    };
    organization_id: string;
  } | null;
  phone_number: string;
  role: string;
  organization_id: string;
  iat: number; // issued at
  exp: number; // expires at
}

// Auth API functions
export const authApi = {
  // Login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/login', data);
  },

  // Signup
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    return api.post<SignupResponse>('/auth/signup', data);
  },

  // Refresh token
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    return api.post<RefreshTokenResponse>('/auth/refresh-token', data);
  },

  // Logout
  logout: async (): Promise<LogoutResponse> => {
    return api.post<LogoutResponse>('/auth/logout');
  },
};


