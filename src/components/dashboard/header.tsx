"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, Send, Bell } from "lucide-react"

interface HeaderProps {
  onRefresh: () => void
  isRefreshing: boolean
}

export function Header({ onRefresh, isRefreshing }: HeaderProps) {
  const sendTestAlert = async () => {
    try {
      const response = await fetch('/api/tokens/test-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'AlphaEye Test Mesajı' })
      });
      
      if (response.ok) {
        alert('Test alert sent to Telegram!');
      } else {
        alert('Failed to send test alert');
      }
    } catch (err) {
      console.error('Test alert error:', err);
      alert('Error sending test alert');
    }
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-foreground">AlphaEye</h1>
          <span className="text-sm text-muted-foreground">Pro-Grade Token Guard</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={sendTestAlert}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            TEST ALERT
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
