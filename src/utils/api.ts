import axios, { type AxiosInstance, type AxiosRequestConfig, type  AxiosResponse } from 'axios';

// Base URL cho API
const BASE_URL = 'https://api.ohna12.netlify.app';

// Tạo axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
  },
});

// Request interceptor để thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Chỉ xử lý 401 error và chưa retry, và không phải logout request
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/logout')) {
      // Đánh dấu request này đã retry
      originalRequest._retry = true;
      
      // Kiểm tra xem có refresh token không
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          // Gọi refresh token API
          const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refresh_token: refreshToken
          });
          
          // Cập nhật token mới
          const { access_token, refresh_token: newRefreshToken } = response.data.data;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', newRefreshToken);
          
          // Cập nhật header cho request gốc
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          
          // Retry request gốc với token mới
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          // Nếu refresh thất bại, chỉ clear auth, không redirect
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }

    return Promise.reject(error);
  }
);

// Generic API functions
export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get(url, config).then(response => response.data);
  },

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post(url, data, config).then(response => response.data);
  },

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.put(url, data, config).then(response => response.data);
  },

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.delete(url, config).then(response => response.data);
  },

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.patch(url, data, config).then(response => response.data);
  },
};

export default apiClient;
