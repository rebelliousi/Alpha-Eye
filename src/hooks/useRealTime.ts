import { useEffect, useState, useCallback } from 'react';

interface RealTimeData<T> {
  data: T;
  timestamp: number;
}

export function useRealTimeUpdates<T>(
  endpoint: string,
  initialData?: T,
  interval: number = 30000 // 30 seconds default
) {
  const [data, setData] = useState<RealTimeData<T> | undefined>(
    initialData ? { data: initialData, timestamp: Date.now() } : undefined
  );
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newData = await response.json();
      setData({ data: newData, timestamp: Date.now() });
      setError(null);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsConnected(false);
    }
  }, [endpoint]);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up interval for polling
    const intervalId = setInterval(fetchData, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchData, interval]);

  return {
    data: data?.data,
    lastUpdate: data?.timestamp,
    isConnected,
    error,
    refetch: fetchData,
  };
}

export function useServerSentEvents<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(endpoint);

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data) as T;
        setData(parsedData);
      } catch (err) {
        setError('Failed to parse server data');
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      setError('Connection lost');
    };

    return () => {
      eventSource.close();
    };
  }, [endpoint]);

  return { data, isConnected, error };
}
