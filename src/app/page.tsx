'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, X as TwitterIcon, Globe } from 'lucide-react';

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

export default function Home() {
  const [tokens, setTokens] = useState<EnrichedToken[]>([]);
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

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">AlphaEye | Pro-Grade Token Guard</h1>
          </div>
          <Card className="bg-gray-800 border-gray-700">
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
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">AlphaEye | Pro-Grade Token Guard</h1>
          </div>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="text-center text-red-400">Error: {error}</div>
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">AlphaEye | Pro-Grade Token Guard</h1>
          <button 
            onClick={fetchTokens}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">New Token Listings ({tokens.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {tokens.length === 0 && !error ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  Loading tokens from Birdeye API...
                </div>
                <div className="text-sm text-gray-500">
                  Please wait a moment
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Token</TableHead>
                    <TableHead className="text-white">Symbol</TableHead>
                    <TableHead className="text-white text-right">Liquidity</TableHead>
                    <TableHead className="text-white">Security Score</TableHead>
                    <TableHead className="text-white">Socials</TableHead>
                    <TableHead className="text-white">Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token, index) => (
                    <TableRow key={`${token.address}-${index}`} className="border-gray-700">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {token.logo && (
                            <img 
                              src={token.logo} 
                              alt={token.name}
                              className="w-8 h-8 rounded-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          <span>{token.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{token.symbol}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatLiquidity(token.liquidity)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getSecurityScoreColor(token.securityScore)} text-white`}>
                          {token.securityScore}/100
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {token.twitter && (
                            <a 
                              href={`https://twitter.com/${token.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <TwitterIcon className="w-4 h-4" />
                            </a>
                          )}
                          {token.website && (
                            <a 
                              href={token.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-400 hover:text-green-300"
                            >
                              <Globe className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-400 max-w-50 truncate">
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
