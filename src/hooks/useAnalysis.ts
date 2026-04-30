import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnalysisRequest, AnalysisResponse } from '@/types/analysis';

export function useAnalysis(tokenId: string) {
  return useQuery({
    queryKey: ['analysis', tokenId],
    queryFn: async () => {
      const response = await fetch(`/api/analysis/${tokenId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }
      return response.json() as Promise<AnalysisResponse>;
    },
    enabled: !!tokenId,
    staleTime: 300000, // 5 minutes
  });
}

export function useStartAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tokenId, forceRefresh }: AnalysisRequest) => {
      const response = await fetch(`/api/analysis/${tokenId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ forceRefresh }),
      });

      if (!response.ok) {
        throw new Error('Failed to start analysis');
      }

      return response.json() as Promise<AnalysisResponse>;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch the analysis query
      queryClient.invalidateQueries({
        queryKey: ['analysis', variables.tokenId],
      });
    },
  });
}

export function useAnalysisStats() {
  return useQuery({
    queryKey: ['analysis-stats'],
    queryFn: async () => {
      const response = await fetch('/api/analysis/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch analysis stats');
      }
      return response.json();
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });
}
