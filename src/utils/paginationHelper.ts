import { DEFAULT_PAGINATION, type PaginationParams } from '@/types/pagination';

/**
 * Helper function to apply default pagination to search params
 */
export const withDefaultPagination = <T extends Record<string, unknown>>(
  params?: Partial<T & PaginationParams>
): T & PaginationParams => {
  return {
    page: params?.page || DEFAULT_PAGINATION.page,
    limit: params?.limit || DEFAULT_PAGINATION.limit,
    ...params,
  } as T & PaginationParams;
};

/**
 * Helper function to extract search params without pagination
 */
export const withoutPagination = <T extends Record<string, unknown>>(
  params: T & Partial<PaginationParams>
): Omit<T, 'page' | 'limit'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { page, limit, ...searchOnlyParams } = params;
  return searchOnlyParams;
};

/**
 * Helper function to combine search params with pagination params
 */
export const combineSearchAndPagination = <T extends Record<string, unknown>>(
  searchParams: T,
  paginationParams: PaginationParams
): T & PaginationParams => {
  return {
    ...searchParams,
    ...paginationParams,
  } as T & PaginationParams;
};
