// Redis-based rate limiting implementation
// Following WINDSURF.md requirements for 1 RPS / 60 RPM

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

export class RedisRateLimiter {
  async checkLimit(key: string, limit: number, window: number): Promise<RateLimitResult> {
    // For now, return a mock implementation
    // TODO: Implement Redis client integration
    const now = Date.now();
    
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + window
    };
  }
}

export const redisRateLimiter = new RedisRateLimiter();

// In-memory fallback for development
export class MemoryRateLimiter {
  private requests: Map<string, number[]> = new Map();

  checkLimit(key: string, limit: number, window: number): RateLimitResult {
    const now = Date.now();
    const windowStart = now - window;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const timestamps = this.requests.get(key)!;
    
    // Remove old requests outside the window
    const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);
    this.requests.set(key, validTimestamps);
    
    const currentCount = validTimestamps.length;
    
    if (currentCount < limit) {
      validTimestamps.push(now);
      return {
        allowed: true,
        remaining: limit - currentCount - 1,
        resetTime: now + window
      };
    }
    
    // Find the oldest request to calculate reset time
    const oldestRequest = Math.min(...validTimestamps);
    return {
      allowed: false,
      remaining: 0,
      resetTime: oldestRequest + window
    };
  }
}

export const memoryRateLimiter = new MemoryRateLimiter();
