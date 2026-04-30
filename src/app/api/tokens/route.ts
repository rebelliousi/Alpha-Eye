import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  const response = await axios.get('https://public-api.birdeye.so/defi/v2/tokens/new_listing?limit=20&meme_platform_enabled=true', {
    headers: { 'X-API-KEY': process.env.BIRDEYE_API_KEY, 'x-chain': 'solana' },
    proxy: false
  });
  console.log("FULL_RAW_RESPONSE:", JSON.stringify(response.data, null, 2));
  return NextResponse.json(response.data.data.items);
}
