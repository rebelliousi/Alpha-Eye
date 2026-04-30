'use client';

import { useState } from 'react';
import { useAnalysis } from '@/hooks/useAnalysis';
import { Card, CardContent } from '@/components/ui/card';

export default function AnalysisPage() {
  const [tokenId, setTokenId] = useState<string>('');
  const { data: analysis, isLoading, error } = useAnalysis(tokenId);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Security Analysis</h1>
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter token address..."
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {tokenId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Security Score</h3>
              <div className="text-center">
                <div className="text-4xl font-bold">
                  {analysis?.analysis?.score || 0}/100
                </div>
                <div className={`text-sm font-medium ${
                  (analysis?.analysis?.score || 0) >= 80 ? 'text-green-600' : 
                  (analysis?.analysis?.score || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {(analysis?.analysis?.score || 0) >= 80 ? 'Low Risk' : 
                   (analysis?.analysis?.score || 0) >= 60 ? 'Medium Risk' : 'High Risk'}
                </div>
              </div>
              {analysis?.analysis?.details && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Liquidity</span>
                    <span>{analysis?.analysis?.details.liquidity}/25</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Holder Distribution</span>
                    <span>{analysis?.analysis?.details.holderDistribution}/25</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Contract Audit</span>
                    <span>{analysis?.analysis?.details.contractAudit}/25</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Metadata</span>
                    <span>{analysis?.analysis?.details.metadata}/25</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Analysis Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm">Risk Level</h4>
                  <p className="text-gray-600">{analysis?.analysis?.riskLevel}</p>
                </div>
                {analysis?.analysis?.recommendations && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {analysis?.analysis?.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">Error: {String(error)}</div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Analyzing token...</div>
          </CardContent>
        </Card>
      )}

      {!tokenId && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              Enter a token address to view security analysis
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
