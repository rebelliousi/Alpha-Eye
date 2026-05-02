"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Header } from "./header"
import { KPICards } from "./kpi-cards"
import { TokenTable } from "./token-table"
import { TokenDetail } from "./token-detail"
import { AlertFeed } from "./alert-feed"
import { useTokens } from "@/hooks/useTokens" // BİZİM GERÇEK VERİ KANCAMIZ
import type { Token, Alert, KPIData } from "@/lib/types"

export function Dashboard() {
  const { data: rawTokens = [], isLoading, refetch } = useTokens()
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  
  // API'den gelen ham veriyi v0 tasarımının beklediği zengin formata dönüştürelim
  const tokens = useMemo(() => {
    return (Array.isArray(rawTokens) ? rawTokens : []).map((t: any) => ({
      ...t,
      id: t.address,
      listedAt: new Date(), // API'den tarih gelirse buraya bağlanabilir
      liquidityTrend: [10, 25, 20, 35, 30, 45, 40], // Şık grafikler için örnek trend
      securityBreakdown: {
        contractSecurity: t.securityScore || 0,
        holderDistribution: t.isFullAudit ? 85 : 40,
        liquidityHealth: t.liquidity > 1000 ? 90 : 30,
        socialPresence: t.twitter ? 95 : 0,
        metadataIntegrity: t.isFullAudit ? 100 : 50,
      },
      auditStatus: t.isFullAudit ? 'full' : 'limited',
      socials: {
        twitter: t.twitter,
        website: t.website,
        telegram: t.telegram
      },
      alertSent: (t.securityScore || 0) >= 80,
      riskExplanation: t.securityScore >= 80 
        ? "Strong fundamentals with verified contract." 
        : "Limited data available or high concentration detected."
    })) as Token[]
  }, [rawTokens])

  // Otomatik seçim: Veri geldiğinde ilk token'ı seç
  useEffect(() => {
    if (tokens.length > 0 && !selectedToken) {
      setSelectedToken(tokens[0])
    }
  }, [tokens, selectedToken])

  // Üstteki 4'lü kart için verileri hesapla
  const kpiData: KPIData = {
    newListings: tokens.length,
    safeTokens: tokens.filter(t => t.securityScore >= 80).length,
    alertsSentToday: tokens.filter(t => t.securityScore >= 80).length,
    averageSecurityScore: Math.floor(tokens.reduce((acc, t) => acc + (t.securityScore || 0), 0) / (tokens.length || 1))
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header onRefresh={refetch} isRefreshing={isLoading} />

      <main className="flex-1 p-4 lg:p-6">
        <div className="mx-auto max-w-[1600px] space-y-4 lg:space-y-6">
          <KPICards data={kpiData} isLoading={isLoading} />

          <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:gap-6 xl:grid-cols-[1fr_360px]">
            <div className="order-2 lg:order-1">
              <TokenTable
                tokens={tokens}
                selectedToken={selectedToken}
                onSelectToken={setSelectedToken}
                isLoading={isLoading}
              />
            </div>

            <div className="order-1 lg:order-2 lg:sticky lg:top-4 lg:self-start">
              <TokenDetail
                token={selectedToken}
                onClose={() => setSelectedToken(null)}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Telegram bildirim kutusu */}
      <AlertFeed 
        alerts={tokens.filter(t => t.securityScore >= 80).map(t => ({
          id: t.id,
          tokenName: t.name,
          tokenSymbol: t.symbol,
          score: t.securityScore,
          status: 'sent',
          timeSent: 'Just now',
          note: 'Alpha detected'
        }))} 
        isLoading={isLoading} 
      />
    </div>
  )
}