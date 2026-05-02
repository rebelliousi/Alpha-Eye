"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Shield, Bell, Target } from "lucide-react"
import type { KPIData } from "@/lib/types"

interface KPICardsProps {
  data: KPIData
  isLoading: boolean
}

export function KPICards({ data, isLoading }: KPICardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="kpi-card animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
              </div>
              <div className="w-8 h-8 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="kpi-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">New Listings</p>
            <p className="text-2xl font-bold text-white">{data.newListings}</p>
            <p className="text-xs text-muted-foreground mt-1">Last 24h</p>
          </div>
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Safe Tokens</p>
            <p className="text-2xl font-bold text-green-400">{data.safeTokens}</p>
            <p className="text-xs text-muted-foreground mt-1">80+ Score</p>
          </div>
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Shield className="w-5 h-5 text-green-400" />
          </div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Alerts Sent</p>
            <p className="text-2xl font-bold text-purple-400">{data.alertsSentToday}</p>
            <p className="text-xs text-muted-foreground mt-1">Today</p>
          </div>
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Bell className="w-5 h-5 text-purple-400" />
          </div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Avg Score</p>
            <p className="text-2xl font-bold text-amber-400">{data.averageSecurityScore}</p>
            <p className="text-xs text-muted-foreground mt-1">Security</p>
          </div>
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Target className="w-5 h-5 text-amber-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
