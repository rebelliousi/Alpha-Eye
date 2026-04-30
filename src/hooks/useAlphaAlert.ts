import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface EnrichedToken {
  name: string;
  symbol: string;
  address: string;
  liquidity: number;
  logo: string;
  securityScore: number;
  twitter: string;
  website: string;
  telegram: string;
}

export function useAlphaAlert(tokens: EnrichedToken[]) {
  const alertedTokens = useRef<Set<string>>(new Set());

  useEffect(() => {
    tokens.forEach(token => {
      if (token.securityScore >= 80 && !alertedTokens.current.has(token.address)) {
        // Alert this token
        toast.success(`🚀 ALPHA DETECTED: ${token.name}`, {
          description: `Security Score: ${token.securityScore}/100 | Symbol: ${token.symbol}`,
          duration: 5000,
          position: 'top-right',
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: '1px solid #4c1d95',
            color: 'white',
            fontWeight: 'bold',
          },
        });

        // Play cyberpunk beep sound (optional)
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE');
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Ignore audio errors (browser may block autoplay)
        });

        // Mark as alerted
        alertedTokens.current.add(token.address);
      }
    });
  }, [tokens]);
}
