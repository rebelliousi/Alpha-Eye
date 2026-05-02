export interface Token {
  id: string
  name: string
  symbol: string
  address: string
  logo?: string
  avatar?: string
  liquidity: number
  securityScore: number
  isFullAudit: boolean
  listedAt: Date
  liquidityTrend: number[]
  holderConcentration: number
  metadataQuality: 'complete' | 'partial' | 'poor'
  contractStatus: 'verified' | 'unverified'
  dexScreenerUrl?: string
  birdeyeUrl?: string
  alertSent: boolean
  riskExplanation: string
  socials: {
    twitter?: string
    website?: string
    telegram?: string
  }
  securityBreakdown: {
    contractSecurity: number
    holderDistribution: number
    liquidityHealth: number
    socialPresence: number
    metadataIntegrity: number
  }
}

export interface Alert {
  id: string
  tokenName: string
  tokenSymbol: string
  score: number
  status: 'sent' | 'pending' | 'failed'
  timeSent: string
  note: string
}

export interface KPIData {
  newListings: number
  safeTokens: number
  alertsSentToday: number
  averageSecurityScore: number
}
