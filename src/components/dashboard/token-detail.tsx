"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, AlertCircle, CheckCircle, TrendingUp, Globe, X, MessageCircle, ExternalLink, Copy, Brain } from "lucide-react"
import type { Token } from "@/lib/types"

interface TokenDetailProps {
  token: Token | null
  onClose: () => void
  isLoading: boolean
}

export function TokenDetail({ token, onClose, isLoading }: TokenDetailProps) {
  if (!token) {
    return (
      <div className="detail-panel p-6">
        <div className="text-center text-muted-foreground">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a token to view details</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="detail-panel p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-muted rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  const getSecurityColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getSecurityBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20'
    if (score >= 50) return 'bg-yellow-500/20'
    return 'bg-red-500/20'
  }

  const scorePercentage = (token.securityScore / 100) * 283
  const scoreColor = token.securityScore >= 80 ? '#10b981' : token.securityScore >= 50 ? '#f59e0b' : '#f43f5e'

  return (
    <div className="detail-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Token Details</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>

      {/* Token Header */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="w-12 h-12">
          <AvatarImage src={token.logo} alt={token.name} className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {token.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="text-xl font-bold text-white">{token.name}</h4>
          <p className="text-muted-foreground font-mono text-sm">{token.symbol}</p>
        </div>
      </div>

      {/* Circular Security Score */}
      <div className="flex items-center justify-center mb-6">
        <div className="security-score-ring">
          <svg width="120" height="120">
            <circle
              cx="60"
              cy="60"
              r="45"
              stroke="oklch(0.24 0.008 260)"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="45"
              stroke={scoreColor}
              strokeWidth="10"
              fill="none"
              strokeDasharray={scorePercentage}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getSecurityColor(token.securityScore)}`}>
              {token.securityScore}
            </span>
            <span className="text-xs text-muted-foreground">Score</span>
          </div>
        </div>
      </div>

      {/* Security Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Security Breakdown</h4>
        <div className="space-y-3">
          {token.securityBreakdown && Object.entries(token.securityBreakdown).map(([key, value]) => {
            const labels: Record<string, string> = {
              contractSecurity: 'Contract Security',
              holderDistribution: 'Holder Distribution',
              liquidityHealth: 'Liquidity Health',
              socialPresence: 'Social Presence',
              metadataIntegrity: 'Metadata Integrity'
            }
            
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{labels[key] || key}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        value >= 80 ? 'bg-green-500' : value >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{value}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* AI Summary */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Brain className="w-4 h-4" />
          AI Analysis Summary
        </h4>
        <div className={`p-3 rounded-lg ${getSecurityBgColor(token.securityScore)} border ${
          token.securityScore >= 80 ? 'border-green-500/50' : 
          token.securityScore >= 50 ? 'border-yellow-500/50' : 'border-red-500/50'
        }`}>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {token.securityScore >= 80 
              ? "This token demonstrates strong security fundamentals with verified contract code, healthy liquidity distribution, and active community engagement. Recommended for consideration."
              : token.securityScore >= 50
              ? "This token shows moderate security metrics with some areas requiring attention. Exercise caution and conduct additional research before investing."
              : "This token exhibits significant security risks including potential contract vulnerabilities and concentrated holdings. Not recommended for investment without extensive due diligence."
            }
          </p>
        </div>
      </div>

      {/* Audit Status */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Audit Status</h4>
        <div className="flex items-center gap-2">
          {token.isFullAudit ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Full Audit Completed</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">Limited Analysis</span>
            </>
          )}
        </div>
      </div>

      {/* Social Links */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Social Links</h4>
        <div className="flex gap-2">
          {token.socials?.twitter && (
            <a
              href={token.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 p-2 border rounded hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </a>
          )}
          {token.socials?.website && (
            <a
              href={token.socials.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 p-2 border rounded hover:bg-muted"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
          {token.socials?.telegram && (
            <a
              href={token.socials.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 p-2 border rounded hover:bg-muted"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Contract Address */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Contract Address</h4>
        <div className="flex items-center gap-2 p-2 bg-muted rounded">
          <span className="font-mono text-xs text-muted-foreground flex-1">
            {token.address}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => navigator.clipboard.writeText(token.address)}
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
