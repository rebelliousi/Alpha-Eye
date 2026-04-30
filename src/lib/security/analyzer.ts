import { TokenSecurity, TokenMetadata } from '../birdeye/types';

export interface SecurityAnalysis {
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  details: {
    liquidity: number;
    holderDistribution: number;
    contractAudit: number;
    metadata: number;
  };
  recommendations: string[];
}

export class SecurityAnalyzer {
  analyzeToken(
    security: TokenSecurity | null,
    metadata: TokenMetadata | null,
    liquidity: number
  ): SecurityAnalysis {
    const scores = {
      liquidity: this.calculateLiquidityScore(liquidity),
      holderDistribution: this.calculateHolderDistributionScore(security),
      contractAudit: this.calculateContractAuditScore(security),
      metadata: this.calculateMetadataScore(metadata),
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const riskLevel = this.getRiskLevel(totalScore);
    const recommendations = this.generateRecommendations(scores, security, metadata);

    return {
      score: totalScore,
      riskLevel,
      details: scores,
      recommendations,
    };
  }

  private calculateLiquidityScore(liquidity: number): number {
    if (liquidity >= 100000) return 25; // $100k+
    if (liquidity >= 50000) return 20;  // $50k-$100k
    if (liquidity >= 10000) return 15;  // $10k-$50k
    if (liquidity >= 1000) return 10;   // $1k-$10k
    return 5; // <$1k
  }

  private calculateHolderDistributionScore(security: TokenSecurity | null): number {
    if (!security) return 0;
    
    const holderPercent = security.top10HolderPercent;
    if (holderPercent <= 30) return 25;  // Well distributed
    if (holderPercent <= 50) return 20;  // Moderately distributed
    if (holderPercent <= 70) return 15;  // Somewhat concentrated
    if (holderPercent <= 85) return 10;  // Highly concentrated
    return 5; // Extremely concentrated
  }

  private calculateContractAuditScore(security: TokenSecurity | null): number {
    if (!security) return 0;
    
    let score = 15; // Base score
    
    // Penalize mutable metadata
    if (security.mutableMetadata) {
      score -= 10;
    }
    
    // Bonus for Jupiter strict list
    if (security.jupStrictList) {
      score += 10;
    }
    
    return Math.max(0, Math.min(25, score));
  }

  private calculateMetadataScore(metadata: TokenMetadata | null): number {
    if (!metadata) return 5;
    
    let score = 10; // Base score
    
    // Bonus for having logo
    if (metadata.logo_uri) {
      score += 5;
    }
    
    // Bonus for having website
    if (metadata.extensions?.website) {
      score += 5;
    }
    
    // Bonus for having twitter
    if (metadata.extensions?.twitter) {
      score += 3;
    }
    
    // Bonus for having discord
    if (metadata.extensions?.discord) {
      score += 2;
    }
    
    return Math.max(0, Math.min(25, score));
  }

  private getRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score >= 80) return 'low';
    if (score >= 60) return 'medium';
    return 'high';
  }

  private generateRecommendations(
    scores: SecurityAnalysis['details'],
    security: TokenSecurity | null,
    metadata: TokenMetadata | null
  ): string[] {
    const recommendations: string[] = [];

    if (scores.liquidity < 15) {
      recommendations.push('Low liquidity - high risk of rug pull');
    }

    if (scores.holderDistribution < 15) {
      recommendations.push('Highly concentrated holdings - potential manipulation risk');
    }

    if (security?.mutableMetadata) {
      recommendations.push('Mutable metadata - team can change token properties');
    }

    if (!metadata?.logo_uri) {
      recommendations.push('No logo - may indicate lack of professionalism');
    }

    if (!metadata?.extensions?.website) {
      recommendations.push('No website - limited project information');
    }

    if (!security?.jupStrictList) {
      recommendations.push('Not on Jupiter strict list - lower credibility');
    }

    if (recommendations.length === 0) {
      recommendations.push('Token appears to have good security fundamentals');
    }

    return recommendations;
  }
}

export const securityAnalyzer = new SecurityAnalyzer();
