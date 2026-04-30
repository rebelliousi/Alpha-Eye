import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SecurityScoreProps {
  score: number;
  details?: {
    liquidity: number;
    holderDistribution: number;
    contractAudit: number;
    metadata: number;
  };
}

export default function SecurityScore({ score, details }: SecurityScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Low Risk';
    if (score >= 60) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Security Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}/100
            </div>
            <div className={`text-sm font-medium ${getScoreColor(score)}`}>
              {getScoreLabel(score)}
            </div>
          </div>
          
          {details && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Liquidity</span>
                <span>{details.liquidity}/25</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Holder Distribution</span>
                <span>{details.holderDistribution}/25</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Contract Audit</span>
                <span>{details.contractAudit}/25</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Metadata</span>
                <span>{details.metadata}/25</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
