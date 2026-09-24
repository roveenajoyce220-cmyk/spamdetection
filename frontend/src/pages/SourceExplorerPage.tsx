import React, { useEffect, useState } from 'react';
import { 
  Globe2, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Lock, 
  Info
} from 'lucide-react';
import { api } from '../services/api';
import type { SourceIntelligence } from '../types';

export const SourceExplorerPage: React.FC = () => {
  const [sources, setSources] = useState<SourceIntelligence[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [trustTier, setTrustTier] = useState<string>('ALL');

  const fetchSources = () => {
    setLoading(true);
    api.getSources({
      search: searchQuery.trim() || undefined,
      trust_tier: trustTier !== 'ALL' ? trustTier : undefined
    })
      .then((data) => {
        setSources(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSources();
  }, [trustTier]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSources();
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
            <Globe2 className="w-4 h-4" />
            <span>Domain Reputation Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Publisher & Source Intelligence Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Inspect verified media publishers, international wire agencies, and flagged disinformation domains.
          </p>
        </div>
      </div>

      {/* Search & Trust Tier Filter */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by publisher name or domain (e.g. reuters.com, bbc.com)..."
            className="w-full pl-10 pr-24 py-2 rounded-xl bg-slate-900 text-white placeholder-slate-500 text-xs border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-lg transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs shrink-0 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Sources' },
            { id: 'HIGH', label: 'High Trust (80%+)' },
            { id: 'MEDIUM', label: 'Mixed / Caution' },
            { id: 'LOW', label: 'High Risk / Flagged' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTrustTier(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                trustTier === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Assessment Notice Banner */}
      <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-slate-300 flex items-center gap-3">
        <Info className="w-4 h-4 text-blue-400 shrink-0" />
        <span>
          <strong>Methodology Note:</strong> Source scores are probabilistic indicators calculated from historical article analyses, domain SSL compliance, and editorial byline attribution rates.
        </span>
      </div>

      {/* Sources Catalog Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading publisher profiles...</p>
        </div>
      ) : sources.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl border border-slate-800 space-y-3 max-w-lg mx-auto">
          <Globe2 className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Publishers Found</h3>
          <p className="text-xs text-slate-400">Try modifying your domain search query or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sources.map((source) => {
            const isHigh = source.reliability_score >= 80;
            const isLow = source.reliability_score < 50;
            const Icon = isHigh ? ShieldCheck : (isLow ? ShieldAlert : AlertTriangle);

            return (
              <div
                key={source.domain}
                className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 shrink-0 ${isHigh ? 'text-emerald-400' : isLow ? 'text-rose-400' : 'text-amber-400'}`} />
                        <h3 className="text-base font-bold text-white">{source.name}</h3>
                        {source.verified && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-slate-400">{source.domain}</p>
                    </div>

                    <div
                      className={`px-2.5 py-1 rounded-lg border text-right font-mono font-bold text-xs ${
                        isHigh
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isLow
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {Math.round(source.reliability_score)}%
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {source.description || 'Automated behavioral and linguistic telemetry profile.'}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Category: <strong className="text-white">{source.category}</strong></span>
                    <span>Origin: <strong className="text-white">{source.country}</strong></span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      {source.https_valid ? 'Secure HTTPS' : 'HTTP Only'}
                    </span>
                    <span className="font-mono text-slate-300">
                      {source.total_analyzed} scanned • {Math.round(source.spam_ratio * 100)}% spam
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
