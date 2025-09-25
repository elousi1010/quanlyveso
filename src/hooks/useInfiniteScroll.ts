import { useState, useCallback, useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { DEFAULT_PAGINATION } from '@/types/pagination';

export interface InfiniteScrollParams {
  page?: number;
  limit?: number;
  searchKey?: string;
  [key: string]: unknown;
}

export interface InfiniteScrollOptions<T> {
  queryKey: string[];
  queryFn: (params: InfiniteScrollParams) => Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
  }>;
  initialParams?: InfiniteScrollParams;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

export interface InfiniteScrollResult<T> {
  data: T[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
  search: (searchKey: string) => void;
  clearSearch: () => void;
  currentSearchKey: string;
  isSearching: boolean;
}

export const useInfiniteScroll = <T>({
  queryKey,
  queryFn,
  initialParams = {},
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutes
  cacheTime = 10 * 60 * 1000, // 10 minutes
}: InfiniteScrollOptions<T>): InfiniteScrollResult<T> => {
  const [searchKey, setSearchKey] = useState(initialParams.searchKey || '');
  const [isSearching, setIsSearching] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: [...queryKey, searchKey],
    queryFn: async ({ pageParam = 1 }) => {
      const params = {
        ...initialParams,
        page: pageParam,
        limit: DEFAULT_PAGINATION.limit,
        searchKey,
      };
      return queryFn(params);
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.total / DEFAULT_PAGINATION.limit);
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },
    enabled,
    staleTime,
    cacheTime,
  });

  // Flatten all pages data
  const allData = data?.pages.flatMap(page => page.data) || [];
  const total = data?.pages[0]?.total || 0;

  // Search functionality
  const search = useCallback((newSearchKey: string) => {
    setSearchKey(newSearchKey);
    setIsSearching(true);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchKey('');
    setIsSearching(false);
  }, []);

  // Intersection Observer for infinite scroll
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || isFetchingNextPage) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Reset searching state when data changes
  useEffect(() => {
    if (data && isSearching) {
      setIsSearching(false);
    }
  }, [data, isSearching]);

  return {
    data: allData,
    total,
    isLoading,
    isError,
    error,
    hasNextPage: hasNextPage || false,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    search,
    clearSearch,
    currentSearchKey: searchKey,
    isSearching,
    lastElementRef,
  };
};

export default useInfiniteScroll;
