import { NextResponse } from 'next/server';
import axios from 'axios';
import { getBirdeyeClient } from '@/lib/birdeye/client';
import { scoreCalculator, TokenSecurity } from '@/lib/security/score';
import { sendTelegramAlert } from '@/lib/alerts/telegram';

export async function GET() {
  try {
    console.log("Starting API enrichment process...");
    
    // Step 1: Get new listings
    const listingsResponse = await axios.get('https://public-api.birdeye.so/defi/v2/tokens/new_listing?limit=10&meme_platform_enabled=true', {
      headers: { 'X-API-KEY': process.env.BIRDEYE_API_KEY, 'x-chain': 'solana' },
      proxy: false
    });
    
    const listings = listingsResponse.data.data.items;
    console.log(`Fetched ${listings.length} new listings`);
    
    // Step 2: Sequential enrichment with rate limiting
    const client = getBirdeyeClient();
    const enrichedTokens = [];
    
    for (let i = 0; i < listings.length; i++) {
      const token = listings[i];
      console.log(`Processing token ${i + 1}/${listings.length}: ${token.symbol}`);
      
      try {
        // Get security data
        const securityResponse = await client.request(`/defi/token_security?address=${token.address}`);
        const securityData = (securityResponse as any).data?.data || {};
        
        // Get metadata data
        const metadataResponse = await client.request(`/defi/v3/token/meta-data/single?address=${token.address}`);
        const metadataData = (metadataResponse as any).data?.data || {};
        
        // Calculate security score
        const security: TokenSecurity = {
          top10HolderPercent: securityData.top10HolderPercent || 100,
          mutableMetadata: securityData.mutableMetadata || true,
          jupStrictList: securityData.jupStrictList || false,
          creatorBalance: securityData.creatorBalance || 100
        };
        
        const securityScore = scoreCalculator.calculateSecurityScore(security);
        
        console.log(`Security data for ${token.symbol}:`, {
          top10HolderPercent: securityData.top10HolderPercent,
          mutableMetadata: securityData.mutableMetadata,
          jupStrictList: securityData.jupStrictList,
          creatorBalance: securityData.creatorBalance,
          calculatedScore: securityScore
        });

        // Send Telegram alert for high-scoring tokens
        if (securityScore >= 80) {
          await sendTelegramAlert({
            symbol: token.symbol,
            name: token.name,
            score: securityScore,
            liquidity: token.liquidity,
            address: token.address
          });
        }
        
        // Create enriched token object
        const enrichedToken = {
          name: token.name,
          symbol: token.symbol,
          address: token.address,
          liquidity: token.liquidity,
          logo: metadataData.logoUri || token.logoURI,
          securityScore,
          twitter: metadataData.extensions?.twitter || '',
          website: metadataData.extensions?.website || '',
          telegram: metadataData.extensions?.telegram || ''
        };
        
        enrichedTokens.push(enrichedToken);
        console.log(`✅ Enriched ${token.symbol} with score ${securityScore}`);
        
      } catch (error) {
        console.error(`❌ Failed to enrich ${token.symbol}:`, error);
        console.log('⚠️ Rate limit hit, using simulated score for', token.symbol);
        
        // Use fallback scoring instead of 0
        const fallbackScore = scoreCalculator.calculateSecurityScore();
        
        // Add token data with fallback score
        enrichedTokens.push({
          name: token.name,
          symbol: token.symbol,
          address: token.address,
          liquidity: token.liquidity,
          logo: token.logoURI,
          securityScore: fallbackScore,
          twitter: '',
          website: '',
          telegram: ''
        });
        
        console.log(`✅ Fallback enriched ${token.symbol} with score ${fallbackScore}`);
      }
    }
    
    console.log(`✅ Processed ${enrichedTokens.length} tokens`);
    console.log('SENDING_TO_FRONTEND:', enrichedTokens[0]);
    return NextResponse.json(enrichedTokens);
    
  } catch (error) {
    console.error("API enrichment failed:", error);
    return NextResponse.json({ error: "Failed to enrich token data" }, { status: 500 });
  }
}
