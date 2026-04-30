import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalysisChartProps {
  tokenId: string;
  data?: any;
}

export default function AnalysisChart({ tokenId, data }: AnalysisChartProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Security Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Token ID: {tokenId}
          </p>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Chart component to be implemented</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
