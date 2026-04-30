import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { Token } from '@/types/token';

interface UseTokensOptions {
  page?: number;
  limit?: number;
  sortBy?: 'liquidity' | 'securityScore' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export function useTokens(options: UseTokensOptions = {}) {
  const {
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  return useQuery({
    queryKey: ['tokens', page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/tokens?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tokens');
      }

      return response.json() as Promise<{
        data: Token[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
}

export function useInfiniteTokens(options: Omit<UseTokensOptions, 'page'> = {}) {
  const { limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = options;

  return useInfiniteQuery({
    queryKey: ['tokens', 'infinite', limit, sortBy, sortOrder],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/tokens?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tokens');
      }

      return response.json() as Promise<{
        data: Token[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
}
