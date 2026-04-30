import { NextRequest, NextResponse } from 'next/server';
import { birdeyeAPI } from '@/lib/birdeye/endpoints';
import { securityAnalyzer } from '@/lib/security/analyzer';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: tokenId } = params;
    
    // Get token data from Birdeye
    const [security, metadata] = await Promise.all([
      birdeyeAPI.getTokenSecurity(tokenId),
      birdeyeAPI.getTokenMetadata(tokenId),
    ]);

    if (!security || !metadata) {
      return NextResponse.json({
        success: false,
        error: 'Token data not found',
        tokenId,
      }, { status: 404 });
    }

    // Perform security analysis
    const analysis = securityAnalyzer.analyzeToken(security, metadata, 0); // liquidity will be added later

    return NextResponse.json({
      success: true,
      data: {
        tokenId,
        analysis,
        security,
        metadata,
      },
    });
  } catch (error) {
    console.error('Error analyzing token:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze token',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: tokenId } = params;
    const body = await request.json();
    const { forceRefresh } = body;

    // For now, just return the GET analysis result
    // In a real implementation, this would trigger a fresh analysis
    const [security, metadata] = await Promise.all([
      birdeyeAPI.getTokenSecurity(tokenId),
      birdeyeAPI.getTokenMetadata(tokenId),
    ]);

    if (!security || !metadata) {
      return NextResponse.json({
        success: false,
        error: 'Token data not found',
        tokenId,
      }, { status: 404 });
    }

    const analysis = securityAnalyzer.analyzeToken(security, metadata, 0);

    return NextResponse.json({
      success: true,
      data: {
        tokenId,
        analysis,
        security,
        metadata,
        forceRefresh,
      },
    });
  } catch (error) {
    console.error('Error starting analysis:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to start analysis',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
