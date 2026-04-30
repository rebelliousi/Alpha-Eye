import { getBirdeyeClient } from './client';
import { NewListing, TokenSecurity, TokenMetadata } from './types';

export class BirdeyeAPI {
  private client = getBirdeyeClient();

  async getNewListings(): Promise<NewListing[]> {
    try {
      const response = await this.client.request('/defi/v2/tokens/new_listing?limit=50&meme_platform_enabled=true');
      return (response as { data: { items: NewListing[] } }).data?.items || [];
    } catch (error) {
      console.error('Error fetching new listings:', error);
      throw error;
    }
  }

  async getTokenSecurity(address: string): Promise<TokenSecurity | null> {
    try {
      const response = await this.client.request(`/defi/token_security?address=${address}`);
      return (response as { data: TokenSecurity }).data || null;
    } catch (error) {
      console.error('Error fetching token security:', error);
      throw error;
    }
  }

  async getTokenMetadata(address: string): Promise<TokenMetadata | null> {
    try {
      const response = await this.client.request(`/defi/v3/token/meta-data/single?address=${address}`);
      return (response as { data: TokenMetadata }).data || null;
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      throw error;
    }
  }

  async getCompleteTokenData(address: string) {
    const [security, metadata] = await Promise.all([
      this.getTokenSecurity(address),
      this.getTokenMetadata(address),
    ]);

    return {
      address,
      security,
      metadata,
    };
  }
}

export const birdeyeAPI = new BirdeyeAPI();
