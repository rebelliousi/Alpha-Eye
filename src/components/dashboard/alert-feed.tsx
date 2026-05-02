"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, X, Send, TrendingUp, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import type { Alert } from "@/lib/types"

interface AlertFeedProps {
  alerts: Alert[]
  isLoading: boolean
}

export function AlertFeed({ alerts, isLoading }: AlertFeedProps) {
  const [visibleAlerts, setVisibleAlerts] = useState<Alert[]>([])

  useEffect(() => {
    if (alerts.length > 0) {
      const newAlert = alerts[alerts.length - 1]
      setVisibleAlerts(prev => [...prev.slice(-2), newAlert])
      
      // Auto-remove alerts after 5 seconds
      const timer = setTimeout(() => {
        setVisibleAlerts(prev => prev.slice(1))
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [alerts])

  const dismissAlert = (id: string) => {
    setVisibleAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const sendTestAlert = async () => {
    try {
      const response = await fetch('/api/tokens/test-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'AlphaEye Test Alert - High Score Token Detected!' })
      })
      
      if (response.ok) {
        // Add a test alert to the feed
        const testAlert: Alert = {
          id: 'test-' + Date.now(),
          type: 'high_score',
          message: 'Test Alert: High Security Score Token Detected!',
          timestamp: new Date(),
          tokenName: 'TEST TOKEN',
          score: 95,
          read: false
        }
        setVisibleAlerts(prev => [...prev.slice(-2), testAlert])
      }
    } catch (err) {
      console.error('Failed to send test alert:', err)
    }
  }

  if (visibleAlerts.length === 0 && !isLoading) {
    return (
      <div className="alert-feed">
        <Card className="border-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Telegram Alerts</span>
              </div>
              <Button variant="ghost" size="sm" onClick={sendTestAlert}>
                <Send className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">No new alerts</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="alert-feed">
      <div className="space-y-2">
        {visibleAlerts.map((alert) => (
          <Card key={alert.id} className="alert-item border-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {alert.type === 'high_score' && (
                    <Shield className="w-4 h-4 text-green-400" />
                  )}
                  {alert.type === 'new_listing' && (
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-4 w-4"
                  onClick={() => dismissAlert(alert.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="mb-2">
                <p className="text-sm text-white font-medium">{alert.message}</p>
                {alert.tokenName && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Token: {alert.tokenName} {alert.score && `(${alert.score}/100)`}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={
                    alert.type === 'high_score' ? 'border-green-500 text-green-400 text-xs' :
                    'border-blue-500 text-blue-400 text-xs'
                  }
                >
                  {alert.type === 'high_score' ? 'High Score' : 'New Listing'}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Telegram
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Test Alert Button */}
        <Card className="border-muted/30">
          <CardContent className="p-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs text-muted-foreground hover:text-white"
              onClick={sendTestAlert}
            >
              <Send className="w-3 h-3 mr-1" />
              Send Test Alert
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
