import { SecurityAnalysis } from '@/lib/security/analyzer';

export interface AnalysisRequest {
  tokenId: string;
  forceRefresh?: boolean;
}

export interface AnalysisResponse {
  id: string;
  tokenId: string;
  analysis: SecurityAnalysis;
  analyzedAt: Date;
}

export interface AnalysisHistory {
  id: string;
  tokenId: string;
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  analyzedAt: Date;
}

export interface AnalysisStats {
  totalTokens: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
  averageScore: number;
  latestAnalysis: Date;
}
