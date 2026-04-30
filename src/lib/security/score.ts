import { SecurityAnalysis } from './analyzer';

export interface ScoreHistory {
  tokenId: string;
  score: number;
  timestamp: Date;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface TokenSecurity {
  top10HolderPercent: number;
  mutableMetadata: boolean;
  jupStrictList: boolean;
  creatorBalance: number;
}

export class ScoreCalculator {
  calculateSecurityScore(security: TokenSecurity): number {
    let score = 0;
    
    // top10HolderPercent < 30% => +40 puan
    if (security.top10HolderPercent < 30) {
      score += 40;
    }
    
    // mutableMetadata === false => +20 puan
    if (!security.mutableMetadata) {
      score += 20;
    }
    
    // jupStrictList === true => +30 puan
    if (security.jupStrictList) {
      score += 30;
    }
    
    // creatorBalance < 10 SOL => +10 puan
    if (security.creatorBalance < 10) {
      score += 10;
    }
    
    return Math.min(score, 100); // Max 100 puan
  }

  calculateWeightedScore(analysis: SecurityAnalysis): number {
    const weights = {
      liquidity: 0.3,
      holderDistribution: 0.25,
      contractAudit: 0.25,
      metadata: 0.2,
    };

    const weightedScore = 
      analysis.details.liquidity * weights.liquidity +
      analysis.details.holderDistribution * weights.holderDistribution +
      analysis.details.contractAudit * weights.contractAudit +
      analysis.details.metadata * weights.metadata;

    return Math.round(weightedScore * 4); // Scale to 0-100
  }

  calculateTrend(scores: ScoreHistory[]): 'improving' | 'declining' | 'stable' {
    if (scores.length < 2) return 'stable';

    const recent = scores.slice(-3);
    const averageRecent = recent.reduce((sum, s) => sum + s.score, 0) / recent.length;
    const previous = scores.slice(-6, -3);
    
    if (previous.length === 0) return 'stable';
    
    const averagePrevious = previous.reduce((sum, s) => sum + s.score, 0) / previous.length;
    
    const difference = averageRecent - averagePrevious;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  getScoreGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    if (score >= 45) return 'D+';
    if (score >= 40) return 'D';
    if (score >= 35) return 'D-';
    return 'F';
  }
}

export const scoreCalculator = new ScoreCalculator();
