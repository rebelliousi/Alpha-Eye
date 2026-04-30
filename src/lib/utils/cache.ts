// Cache utilities for AlphaEye project
// Following WINDSURF.md architecture

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class MemoryCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  set<T>(key: string, data: T, ttl: number = 300000): void { // 5 minutes default TTL
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      return null;
    }
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const memoryCache = new MemoryCache();

// Cache keys for different data types
export const CACHE_KEYS = {
  NEW_LISTINGS: 'new_listings',
  TOKEN_SECURITY: (address: string) => `token_security_${address}`,
  TOKEN_METADATA: (address: string) => `token_metadata_${address}`,
  TOKEN_ANALYSIS: (address: string) => `token_analysis_${address}`,
  DASHBOARD_STATS: 'dashboard_stats',
} as const;
