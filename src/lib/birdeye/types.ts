// Birdeye API types based on WINDSURF.md Reference Data

export interface NewListing {
  address: string;           // Token contract address
  symbol: string;            // Token symbol (e.g., "PEPE")
  name: string;              // Token name (e.g., "Pepe Token")
  liquidity: number;         // Liquidity amount in USD
  liquidityAddedAt: string;  // Timestamp when liquidity was added
  logoURI?: string;          // Token logo URL
  decimals?: number;         // Token decimals
}

export interface TokenSecurity {
  creatorAddress: string;     // Token creator wallet address
  top10HolderPercent: number; // Percentage held by top 10 holders
  mutableMetadata: boolean;   // Whether metadata can be changed
  jupStrictList: boolean;     // Jupiter strict list status
}

export interface TokenMetadata {
  logo_uri: string;          // Token logo URL
  extensions: {
    website?: string;         // Project website
    twitter?: string;         // Twitter handle
    discord?: string;         // Discord invite link
  };
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  liquidity: number;
  liquidityAddedAt: string;
  security?: TokenSecurity;
  metadata?: TokenMetadata;
  securityScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
