import { TokenSecurity, TokenMetadata } from '@/lib/birdeye/types';

export interface Token {
  id: string;
  address: string;
  symbol: string;
  name: string;
  liquidity: number;
  liquidityAddedAt: Date;
  securityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  securityData: TokenSecurity | null;
  metadata: TokenMetadata | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenListResponse {
  data: Token[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TokenFilters {
  riskLevel?: 'low' | 'medium' | 'high';
  minLiquidity?: number;
  maxLiquidity?: number;
  symbols?: string[];
}

export interface TokenSortOptions {
  field: 'liquidity' | 'securityScore' | 'createdAt' | 'symbol';
  order: 'asc' | 'desc';
}
