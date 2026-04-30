import { useQuery } from '@tanstack/react-query';

interface EnrichedToken {
  name: string;
  symbol: string;
  address: string;
  liquidity: number;
  logo: string;
  securityScore: number;
  twitter: string;
  website: string;
  telegram: string;
}

export function useTokens() {
  return useQuery({
    queryKey: ['tokens'],
    queryFn: async () => {
      const response = await fetch('/api/tokens');
      if (!response.ok) {
        throw new Error('Failed to fetch tokens');
      }

      return response.json() as Promise<EnrichedToken[]>;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

