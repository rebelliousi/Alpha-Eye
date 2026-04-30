'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NewListing } from '@/lib/birdeye/types';

export default function Home() {
  const [tokens, setTokens] = useState<NewListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tokens');
      const result = await response.json();
      
      console.log('Frontend API Response:', result);
      console.log("FRONTEND_GET:", result);
      
      // Handle direct array response from API
      const tokens = Array.isArray(result) ? result : [];
      console.log("FRONTEND_FINAL:", tokens);
      setTokens(tokens);
    } catch {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchTokens();
    return () => controller.abort();
  }, []);

  const formatLiquidity = (liquidity: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(liquidity);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">AlphaEye Dashboard</h1>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">Loading tokens...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">AlphaEye Dashboard</h1>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-red-600">Error: {error}</div>
              <button 
                onClick={fetchTokens}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">AlphaEye Dashboard</h1>
          <button 
            onClick={fetchTokens}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Token Listings ({tokens.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {tokens.length === 0 && !error ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  Loading tokens from Birdeye API...
                </div>
                <div className="text-sm text-gray-400">
                  Please wait a moment
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Liquidity</TableHead>
                    <TableHead>Liquidity Added</TableHead>
                    <TableHead>Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token, index) => (
                    <TableRow key={`${token.address}-${index}`}>
                      <TableCell className="font-medium">{token.name}</TableCell>
                      <TableCell className="font-mono text-sm">{token.symbol}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatLiquidity(token.liquidity)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(token.liquidityAddedAt)}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-500 max-w-50 truncate">
                        {token.address}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
