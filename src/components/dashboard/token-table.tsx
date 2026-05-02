"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, Shield, AlertCircle, X, Globe, MessageCircle } from "lucide-react"
import type { Token } from "@/lib/types"

interface TokenTableProps {
  tokens: Token[]
  selectedToken: Token | null
  onSelectToken: (token: Token) => void
  isLoading: boolean
}

export function TokenTable({ tokens, selectedToken, onSelectToken, isLoading }: TokenTableProps) {
  const formatLiquidity = (liquidity: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(liquidity)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const getSecurityColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getSecurityGrade = (score: number) => {
    if (score >= 90) return 'A+'
    if (score >= 80) return 'A'
    if (score >= 70) return 'B'
    if (score >= 60) return 'C'
    if (score >= 50) return 'D'
    return 'F'
  }

  const Sparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    }).join(' ')

    return (
      <svg width="60" height="20" className="overflow-visible">
        <polyline
          points={points}
          className="sparkline"
          fill="none"
        />
      </svg>
    )
  }

  if (isLoading) {
    return (
      <div className="token-table">
        <div className="p-4">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="token-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Listed</TableHead>
            <TableHead>Liquidity</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Audit</TableHead>
            <TableHead>Socials</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token) => (
            <TableRow
              key={token.id}
              className={`token-row cursor-pointer ${
                selectedToken?.id === token.id ? 'selected' : ''
              } ${token.securityScore >= 80 ? 'safe-glow' : ''}`}
              onClick={() => onSelectToken(token)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8 rounded-full">
                    <AvatarImage src={token.logo} alt={token.name} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {token.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-white">{token.name}</div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="font-mono text-sm text-muted-foreground">{token.symbol}</div>
              </TableCell>
              
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {formatTime(token.listedAt)}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-2">
                  <Sparkline data={token.liquidityTrend || [10, 20, 15, 30, 25, 40, 35]} />
                  <div className="font-mono text-sm text-white">
                    {formatLiquidity(token.liquidity)}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge className={`${getSecurityColor(token.securityScore)} text-white text-xs`}>
                    {getSecurityGrade(token.securityScore)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {token.securityScore}/100
                  </span>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-1">
                  {token.isFullAudit ? (
                    <Shield className="w-4 h-4 text-green-400" title="Full Audit" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-400" title="Limited Audit" />
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-1">
                  {token.socials?.twitter && (
                    <a
                      href={token.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon text-muted-foreground hover:text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <X className="w-4 h-4" />
                    </a>
                  )}
                  {token.socials?.website && (
                    <a
                      href={token.socials.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon text-muted-foreground hover:text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {token.socials?.telegram && (
                    <a
                      href={token.socials.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon text-muted-foreground hover:text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="font-mono text-xs text-muted-foreground">
                  {token.address.slice(0, 6)}...{token.address.slice(-4)}
                </div>
              </TableCell>
              
              <TableCell>
                <button
                  className="text-muted-foreground hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(`https://solscan.io/token/${token.address}`, '_blank')
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
