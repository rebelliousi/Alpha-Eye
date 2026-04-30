// Database schema for AlphaEye project
// Following WINDSURF.md architecture

export interface Token {
  id: string;
  address: string;
  symbol: string;
  name: string;
  liquidity: number;
  liquidityAddedAt: Date;
  securityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  securityData: any; // JSON field for TokenSecurity
  metadata: any; // JSON field for TokenMetadata
  createdAt: Date;
  updatedAt: Date;
}

export interface SecurityAnalysis {
  id: string;
  tokenId: string;
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  details: {
    liquidity: number;
    holderDistribution: number;
    contractAudit: number;
    metadata: number;
  };
  recommendations: string[];
  analyzedAt: Date;
}

export interface TokenHistory {
  id: string;
  tokenId: string;
  liquidity: number;
  securityScore: number;
  timestamp: Date;
}

// Prisma schema content for schema.prisma
export const prismaSchema = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Token {
  id              String   @id @default(cuid())
  address         String   @unique
  symbol          String
  name            String
  liquidity       Float
  liquidityAddedAt DateTime
  securityScore   Int
  riskLevel       RiskLevel
  securityData    Json
  metadata        Json
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  analyses        SecurityAnalysis[]
  history         TokenHistory[]

  @@map("tokens")
}

model SecurityAnalysis {
  id              String   @id @default(cuid())
  tokenId         String
  score           Int
  riskLevel       RiskLevel
  details         Json
  recommendations String[]
  analyzedAt      DateTime @default(now())

  token           Token     @relation(fields: [tokenId], references: [id], onDelete: Cascade)

  @@map("security_analyses")
}

model TokenHistory {
  id            String   @id @default(cuid())
  tokenId       String
  liquidity     Float
  securityScore Int
  timestamp     DateTime @default(now())

  token         Token    @relation(fields: [tokenId], references: [id], onDelete: Cascade)

  @@map("token_history")
}

enum RiskLevel {
  low
  medium
  high
}
`;
