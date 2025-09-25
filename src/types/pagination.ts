// Common pagination interfaces
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Pagination state for components
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Default pagination values
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 5,
} as const;

// Pagination helper functions
export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

export const calculateTotalPages = (total: number, limit: number): number => {
  return Math.ceil(total / limit);
};

export const createPaginationMeta = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => {
  const totalPages = calculateTotalPages(total, limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

// Pagination options for dropdowns
export const PAGINATION_LIMITS = [5, 10, 20, 50, 100] as const;

export type PaginationLimit = typeof PAGINATION_LIMITS[number];
