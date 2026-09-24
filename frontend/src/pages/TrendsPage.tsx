import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Globe2, 
  BarChart3, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle,
  Flame,
  Activity,
  Calendar,
  Languages
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { api } from '../services/api';
import type { GlobalTrends } from '../types';
import { WorldTrendsMap } from '../components/WorldTrendsMap';

export const TrendsPage: React.FC = () => {
  const [trends, setTrends] = useState<GlobalTrends | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    setLoading(true);
    api.getGlobalTrends({
      category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
      timeframe
    })
      .then((data) => {
        setTrends(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [selectedCategory, timeframe]);

  if (loading || !trends) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Synthesizing global disinformation trends...</p>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1'];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Global Information Velocity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Global News Trends & Spam Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track unverified viral narratives, category credibility ratings, and cross-border disinformation velocity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
        <span className="text-slate-500 font-semibold uppercase text-[11px] shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter Category:
        </span>
        {['ALL', 'Technology', 'Science', 'Health', 'Politics', 'Business', 'World', 'Entertainment', 'Sports', 'Education'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'glass-card text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            {cat === 'ALL' ? 'All Domains' : cat}
          </button>
        ))}
      </div>

      {/* Interactive World Trends Map / Regional Node Selector */}
      <div>
        <WorldTrendsMap countries={trends.countries} />
      </div>

      {/* Category Credibility Comparison & Language Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Credibility Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">News Category Credibility & Spam Index</h3>
              <p className="text-xs text-slate-400">Percentage of credible vs spam/suspicious articles by vertical</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends.categories}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="category" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="credible_pct" name="Credible %" fill="#16A34A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spam_pct" name="Spam %" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Share Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Language Share & Verification Rates</h3>
            <p className="text-xs text-slate-400">Multilingual news scanning distribution</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trends.languages}
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  dataKey="share"
                >
                  {trends.languages.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {trends.languages.map((lang, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-300 font-medium">{lang.language}</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold">{lang.credible_pct}% pass</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Unverified Claims & Disinformation Watchlist */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>Trending Unverified Viral Claims Monitor</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Live Wire Watchlist</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trends.trending_unverified_claims.map((claim) => {
            const isHighRisk = claim.risk === 'HIGH';
            const isLowRisk = claim.risk === 'LOW';

            return (
              <div
                key={claim.id}
                className={`p-4 rounded-xl border space-y-2.5 ${
                  isHighRisk
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : isLowRisk
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-amber-950/20 border-amber-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                    {claim.topic}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      isHighRisk
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : isLowRisk
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>

                <p className="text-xs font-medium text-white leading-relaxed">
                  "{claim.claim}"
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Detected Volume: <strong className="text-white font-mono">{claim.detected_volume}</strong></span>
                  <span className="truncate max-w-[140px]">Origin: {claim.origin_tld}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
