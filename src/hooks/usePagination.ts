import { useState, useCallback, useMemo } from 'react';
import { 
  type PaginationParams, 
  type PaginationState, 
  DEFAULT_PAGINATION,
  calculateOffset,
  calculateTotalPages 
} from '@/types/pagination';

export interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
  total?: number;
}

export interface UsePaginationReturn {
  // Current state
  pagination: PaginationState;
  
  // API params
  paginationParams: PaginationParams;
  
  // Handlers
  handlePageChange: (page: number) => void;
  handleLimitChange: (limit: number) => void;
  handleReset: () => void;
  
  // Computed values
  hasNext: boolean;
  hasPrev: boolean;
  startIndex: number;
  endIndex: number;
}

/**
 * Hook to manage pagination state and provide handlers
 */
export const usePagination = ({
  initialPage = DEFAULT_PAGINATION.page,
  initialLimit = DEFAULT_PAGINATION.limit,
  total = 0,
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  // Calculate derived values
  const totalPages = useMemo(() => calculateTotalPages(total, limit), [total, limit]);
  const offset = useMemo(() => calculateOffset(page, limit), [page, limit]);
  
  const hasNext = useMemo(() => page < totalPages, [page, totalPages]);
  const hasPrev = useMemo(() => page > 1, [page]);
  
  const startIndex = useMemo(() => offset, [offset]);
  const endIndex = useMemo(() => Math.min(offset + limit, total), [offset, limit, total]);

  // Handlers
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    // Reset to first page when limit changes
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  // Return values
  const pagination: PaginationState = {
    page,
    limit,
    total,
    totalPages,
  };

  const paginationParams: PaginationParams = {
    page,
    limit,
  };

  return {
    pagination,
    paginationParams,
    handlePageChange,
    handleLimitChange,
    handleReset,
    hasNext,
    hasPrev,
    startIndex,
    endIndex,
  };
};

/**
 * Hook specifically for MUI TablePagination component
 */
export const useTablePagination = ({
  initialPage = 0, // MUI TablePagination uses 0-based indexing
  initialLimit = DEFAULT_PAGINATION.limit,
}: Omit<UsePaginationProps, 'total'> = {}) => {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialLimit);

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
  }, []);

  // Convert to API format (1-based indexing)
  const apiParams: PaginationParams = {
    page: page + 1, // Convert from 0-based to 1-based
    limit: rowsPerPage,
  };

  return {
    // MUI TablePagination props
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    
    // API params
    apiParams,
    
    // Reset function
    reset: () => {
      setPage(0);
      setRowsPerPage(initialLimit);
    },
  };
};
