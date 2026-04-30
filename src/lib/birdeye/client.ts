// RateLimitedClient implementation following WINDSURF.md requirements
// 1 RPS / 60 RPM limits strictly enforced

interface RequestOptions {
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: unknown;
}

export class RateLimitedClient {
  private requestQueue: Array<() => Promise<unknown>> = [];
  private isProcessing = false;
  private lastRequestTime = 0;
  private requestCount = 0;
  private readonly baseUrl: string;
  private readonly apiKey: string;

  // 1 RPS (1 request per second) - increased to 2 seconds for rate limit protection
  private readonly MIN_INTERVAL = 2000;
  // 60 RPM (60 requests per minute)
  private readonly MAX_REQUESTS_PER_MINUTE = 60;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async request<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await this.makeRequest<T>(endpoint, options);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async makeRequest<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = "https://public-api.birdeye.so/defi/v2/tokens/new_listing?limit=20&meme_platform_enabled=true";
    const headers: Record<string, string> = {
      'X-API-KEY': process.env.BIRDEYE_API_KEY || '',
      'x-chain': 'solana',
      'accept': 'application/json'
    };
    
    console.log("FETCHING URL:", url);

    const response = await fetch(url, {
      method: options?.method || 'GET',
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      // Rate limiting kontrolü - 1 RPS
      if (timeSinceLastRequest < this.MIN_INTERVAL) {
        await this.delay(this.MIN_INTERVAL - timeSinceLastRequest);
      }

      // RPM kontrolü - 60 RPM
      if (this.requestCount >= this.MAX_REQUESTS_PER_MINUTE) {
        const resetTime = this.lastRequestTime + 60000;
        const waitTime = Math.max(0, resetTime - Date.now());
        await this.delay(waitTime);
        this.requestCount = 0;
      }

      const request = this.requestQueue.shift();
      if (request) {
        await request();
        this.lastRequestTime = Date.now();
        this.requestCount++;
      }
    }

    this.isProcessing = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Birdeye API specific methods are now in endpoints.ts
}

// Singleton instance
let birdeyeClient: RateLimitedClient | null = null;

export function getBirdeyeClient(): RateLimitedClient {
  if (!birdeyeClient) {
    const baseUrl = process.env.BIRDEYE_API_URL || 'https://public-api.birdeye.so/defi';
    const apiKey = process.env.BIRDEYE_API_KEY || '';
    
    if (!apiKey) {
      throw new Error('BIRDEYE_API_KEY environment variable is required');
    }
    
    birdeyeClient = new RateLimitedClient(baseUrl, apiKey);
  }
  
  return birdeyeClient;
}
