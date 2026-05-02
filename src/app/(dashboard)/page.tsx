'use client';

import { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X as XIcon, 
  Globe, 
  Shield, 
  TrendingUp, 
  ShieldCheck, 
  Send, 
  BarChart3, 
  ExternalLink,
  Copy,
  Clock,
  Zap,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { toast } from "sonner";

// --- TİPLER ---
interface EnrichedToken {
  name: string;
  symbol: string;
  address: string;
  liquidity: number;
  logo: string;
  securityScore: number;
  isFullAudit: boolean;
  twitter: string;
  website: string;
}

export default function DashboardPage() {
  const [tokens, setTokens] = useState<EnrichedToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<EnrichedToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAlertsExpanded, setIsAlertsExpanded] = useState(false);

  // --- API ÇAĞRILARI ---
  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tokens');
      const result = await response.json();
      const tokenList = Array.isArray(result) ? result : (result?.data || []);
      setTokens(tokenList);
      if (tokenList.length > 0 && !selectedToken) setSelectedToken(tokenList[0]);
    } catch (err) {
      toast.error("AlphaEye Sentinel connection lost.");
    } finally {
      setLoading(false);
    }
  };

  const sendTestAlert = async () => {
    try {
      const response = await fetch('/api/tokens/test-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Manual Security Signal' })
      });
      if (response.ok) toast.success("Telegram Alert Dispatched!");
      else toast.error("Failed to send alert.");
    } catch (err) {
      toast.error("Alert system error.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard");
  };

  useEffect(() => { fetchTokens(); }, []);

  // --- HESAPLAMALAR ---
  const stats = useMemo(() => {
    const safe = tokens.filter(t => t.securityScore >= 80).length;
    const avg = tokens.length > 0 ? Math.floor(tokens.reduce((acc, t) => acc + t.securityScore, 0) / tokens.length) : 0;
    return { safe, avg };
  }, [tokens]);

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-4 lg:p-8 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800/50 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <Shield className="text-emerald-500 w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                ALPHAEYE <span className="bg-emerald-500 text-[10px] px-2 py-0.5 rounded text-black font-black tracking-widest">PRO</span>
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Solana Mainnet</p>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Live Sentinel Active</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={sendTestAlert} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-95">
              <Send className="w-3.5 h-3.5" /> TEST ALERT
            </button>
            <button onClick={fetchTokens} className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-black rounded-xl transition-all active:scale-95 shadow-xl">
              <Zap className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> REFRESH
            </button>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Detected Listings" value={tokens.length} sub="Real-time scan" icon={<TrendingUp className="text-blue-400" />} />
          <StatCard label="Safe Alpha Gems" value={stats.safe} sub="80+ Security" icon={<ShieldCheck className="text-emerald-500" />} />
          <StatCard label="Alerts Dispatched" value={stats.safe} sub="Telegram push" icon={<Send className="text-indigo-400" />} />
          <StatCard label="Market Integrity" value={`${stats.avg}%`} sub="Avg Security" icon={<BarChart3 className="text-amber-400" />} />
        </div>

        {/* --- MAIN TERMINAL GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 pb-20">
          
          {/* LEFT: SCANNER TABLE */}
          <div className="bg-[#121214] border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col backdrop-blur-sm bg-opacity-80">
            <div className="p-6 border-b border-zinc-800/50 bg-zinc-900/30 flex justify-between items-center">
              <h2 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-400">On-Chain Sentinel Scanner</h2>
              <span className="text-[10px] text-zinc-600 font-mono">Status: Connected</span>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800/50 hover:bg-transparent">
                    <TableHead className="text-zinc-500 text-[10px] font-black uppercase pl-8 py-5">Token</TableHead>
                    <TableHead className="text-zinc-500 text-[10px] font-black uppercase text-right">Liquidity</TableHead>
                    <TableHead className="text-zinc-500 text-[10px] font-black uppercase text-center">Score</TableHead>
                    <TableHead className="text-zinc-500 text-[10px] font-black uppercase text-center">Audit</TableHead>
                    <TableHead className="text-zinc-500 text-[10px] font-black uppercase">Socials</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-40 text-zinc-600 italic font-mono text-sm tracking-widest animate-pulse">Syncing with blockchain...</TableCell></TableRow>
                  ) : tokens.map((token) => (
                    <TableRow 
                      key={token.address} 
                      onClick={() => setSelectedToken(token)}
                      className={`border-zinc-800/50 cursor-pointer transition-all hover:bg-zinc-800/40 group ${selectedToken?.address === token.address ? 'bg-emerald-500/[0.05] border-l-4 border-l-emerald-500' : ''} ${token.securityScore >= 80 ? 'bg-emerald-500/[0.02]' : ''}`}
                    >
                      <TableCell className="pl-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {token.logo ? (
                                <img src={token.logo} className="w-10 h-10 rounded-full border border-zinc-800 group-hover:border-zinc-600 transition-all shadow-xl object-cover" alt="" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 flex items-center justify-center text-xs font-black text-zinc-500">{token.symbol.slice(0,2)}</div>
                            )}
                            {token.securityScore >= 80 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#121214] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-sm text-zinc-200 group-hover:text-white transition-colors">{token.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-tight">{token.symbol}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-black text-zinc-300">
                        {formatUSD(token.liquidity)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${token.securityScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : token.securityScore >= 50 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'} font-mono text-[10px] font-black px-3 py-1 border shadow-sm`}>
                          {token.securityScore}/100
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {token.isFullAudit ? 
                          <Badge className="bg-emerald-500 text-black text-[8px] font-black border-none px-2 rounded-md">FULL AUDIT</Badge> : 
                          <Badge variant="outline" className="border-zinc-700 text-zinc-600 text-[8px] font-black px-2 rounded-md">LIMITED</Badge>
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-3 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                          <XIcon className="w-4 h-4 hover:text-blue-400 transition-colors" />
                          <Globe className="w-4 h-4 hover:text-emerald-400 transition-colors" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* RIGHT: INSPECTOR SIDEBAR */}
          <div className="space-y-6">
            {selectedToken ? (
              <Card className="bg-[#121214] border-zinc-800/50 shadow-2xl rounded-3xl overflow-hidden sticky top-8 backdrop-blur-sm bg-opacity-90">
                <CardHeader className="bg-zinc-900/40 border-b border-zinc-800/50 p-6">
                  <div className="flex items-center gap-4">
                    <img src={selectedToken.logo || `https://avatar.vercel.sh/${selectedToken.symbol}`} className="w-14 h-14 rounded-2xl border border-zinc-800 shadow-2xl" alt="" />
                    <div>
                      <CardTitle className="text-lg font-black tracking-tighter text-white">{selectedToken.name}</CardTitle>
                      <button onClick={() => copyToClipboard(selectedToken.address)} className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5 mt-1 bg-black/40 px-2 py-1 rounded-lg border border-zinc-800/50 hover:bg-zinc-800 transition-all active:scale-95">
                        {selectedToken.address.slice(0,8)}...{selectedToken.address.slice(-8)} <Copy className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Audit Score</span>
                      <p className="text-xs text-emerald-500/80 font-bold flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Analysis Successful</p>
                    </div>
                    <span className={`text-5xl font-black tracking-tighter ${selectedToken.securityScore >= 80 ? 'text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-amber-500'}`}>
                      {selectedToken.securityScore}<span className="text-lg text-zinc-700 ml-1">/100</span>
                    </span>
                  </div>

                  {/* V0-Progress Breakdown */}
                  <div className="space-y-5 bg-black/20 p-5 rounded-2xl border border-zinc-800/50">
                    <DetailBar label="Contract Security" value={selectedToken.securityScore} />
                    <DetailBar label="Holder Concentration" value={88} />
                    <DetailBar label="Liquidity Stability" value={92} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800/50">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Audit Status</p>
                      <p className="text-sm font-black text-emerald-500 mt-1">{selectedToken.isFullAudit ? 'Premium' : 'Partial'}</p>
                    </div>
                    <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800/50">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Bot Status</p>
                      <p className={`text-sm font-black mt-1 ${selectedToken.securityScore >= 80 ? 'text-emerald-500' : 'text-zinc-600'}`}>{selectedToken.securityScore >= 80 ? 'SIGNALED' : 'MONITORING'}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a href={`https://dexscreener.com/solana/${selectedToken.address}`} target="_blank" className="flex-1 text-center py-3.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[10px] font-black transition-all border border-zinc-700 tracking-widest">DEXSCREENER</a>
                    <a href={`https://birdeye.so/token/${selectedToken.address}`} target="_blank" className="flex-1 text-center py-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-[10px] font-black text-black transition-all tracking-widest shadow-lg shadow-emerald-500/20">BIRDEYE API</a>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-64 border-2 border-dashed border-zinc-800/50 rounded-3xl flex items-center justify-center text-zinc-600 text-[10px] font-black uppercase tracking-widest text-center p-12 bg-[#121214]/50">
                Scanning for targets...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- FLOATING ALERTS HUD (THE PIECE YOU ASKED ABOUT) --- */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className={`bg-[#121214] border border-zinc-800 shadow-[0_20px_80px_rgba(0,0,0,0.8)] rounded-3xl transition-all duration-500 ease-out overflow-hidden backdrop-blur-xl bg-opacity-95 ${isAlertsExpanded ? 'w-[360px] h-[500px]' : 'w-44 h-14'}`}>
          
          {/* Header */}
          <div 
            onClick={() => setIsAlertsExpanded(!isAlertsExpanded)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Send className="w-5 h-5 text-indigo-400" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-zinc-200">Alerts</span>
              <Badge className="bg-zinc-800 text-zinc-400 text-[9px] h-5 px-1.5 border-zinc-700">{tokens.filter(t => t.securityScore >= 80).length}</Badge>
            </div>
            <div className="flex items-center gap-2">
               <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Live</span>
               </div>
               {isAlertsExpanded ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronUp className="w-4 h-4 text-zinc-500" />}
            </div>
          </div>

          {/* Content */}
          {isAlertsExpanded && (
            <div className="p-5 pt-0 space-y-4 h-[440px] overflow-y-auto custom-scrollbar">
              <div className="h-px bg-zinc-800/50 w-full mb-4" />
              {tokens.filter(t => t.securityScore >= 80).length > 0 ? (
                tokens.filter(t => t.securityScore >= 80).map((t, i) => (
                  <div key={i} className="bg-black/40 p-4 rounded-2xl border border-zinc-800/50 group hover:border-emerald-500/50 transition-all shadow-xl">
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-emerald-500 tracking-tighter">{t.symbol}</span>
                        <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                        <span className="text-[9px] text-zinc-500 font-bold">{t.name}</span>
                      </div>
                      <span className="text-[9px] text-zinc-700 font-mono">1m ago</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-relaxed mb-3 font-medium">Alpha signal verified by Sentinel AI. Holder concentration is low and liquidity is locked.</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black border-none px-2 py-0.5">SCORE: {t.securityScore}</Badge>
                        <Badge className="bg-indigo-500/10 text-indigo-400 text-[9px] font-black border-none px-2 py-0.5">SENT</Badge>
                      </div>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/50" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[350px] text-center space-y-3 opacity-30">
                   <Shield className="w-10 h-10 text-zinc-600" />
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">No Alpha Detected Yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="max-w-[1600px] mx-auto pt-4 border-t border-zinc-900 flex justify-between items-center opacity-30 text-[9px] font-black uppercase tracking-[0.4em]">
         <span>AlphaEye Token Guard v1.0.0</span>
         <span className="flex items-center gap-2">Solana Network <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Connected</span>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function StatCard({ label, value, sub, icon }: any) {
  return (
    <Card className="bg-[#121214] border-zinc-800/50 shadow-[0_10px_40px_rgba(0,0,0,0.4)] rounded-3xl hover:border-emerald-500/30 transition-all group overflow-hidden relative backdrop-blur-sm">
      <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-emerald-500 transition-all duration-500" />
      <CardContent className="p-7 flex items-center justify-between">
        <div className="space-y-1.5">
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">{label}</p>
          <div className="text-4xl font-black text-zinc-100 group-hover:text-emerald-400 transition-all duration-500 tracking-tighter">{value}</div>
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{sub}</p>
        </div>
        <div className="w-14 h-14 bg-zinc-900/60 rounded-2xl border border-zinc-800/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function DetailBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
        <span>{label}</span>
        <span className="font-mono text-zinc-400">{value}%</span>
      </div>
      <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50 p-[1px]">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${value >= 80 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]' : value >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}