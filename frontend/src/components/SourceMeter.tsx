import React from 'react';
import { Globe, Lock, ShieldCheck, AlertTriangle, Calendar, Award, Building2 } from 'lucide-react';
import type { SourceIntelligence } from '../types';

export const SourceMeter: React.FC<{ source: SourceIntelligence }> = ({ source }) => {
  const getReliabilityColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-base font-mono">
            {source.domain.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">{source.name}</h4>
              {source.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Registry
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-slate-400">{source.domain}</p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-xl border text-right ${getReliabilityColor(source.reliability_score)}`}>
          <div className="text-sm font-black font-mono">{Math.round(source.reliability_score)}%</div>
          <div className="text-[10px] uppercase font-semibold">Reliability</div>
        </div>
      </div>

      {source.description && (
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
          {source.description}
        </p>
      )}

      {/* Grid of metadata tags */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-1">HTTPS Encryption</span>
          <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>{source.https_valid ? 'Valid SSL/TLS' : 'Unsecured HTTP'}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-1">Domain Age</span>
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{source.domain_age_years} Years Active</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-1">Editorial Bias Index</span>
          <div className="flex items-center gap-1.5 font-semibold text-indigo-300">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate">{source.bias_rating}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-1">Historical Spam Rate</span>
          <div className="flex items-center gap-1.5 font-semibold text-slate-200 font-mono">
            <span>{Math.round(source.spam_ratio * 100)}%</span>
            <span className="text-[10px] text-slate-500 font-normal">({source.total_analyzed} scanned)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
