import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TokenCardProps {
  token: {
    address: string;
    symbol: string;
    name: string;
    liquidity: number;
    securityScore?: number;
  };
}

export default function TokenCard({ token }: TokenCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{token.symbol}</span>
          {token.securityScore && (
            <span className="text-sm font-normal">
              Score: {token.securityScore}/100
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">{token.name}</p>
          <p className="text-sm">Liquidity: ${token.liquidity.toLocaleString()}</p>
          <p className="text-xs text-gray-500 truncate">{token.address}</p>
        </div>
      </CardContent>
    </Card>
  );
}
