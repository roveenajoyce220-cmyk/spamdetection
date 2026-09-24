import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import type { DetectionSignal } from '../types';

export const SignalBadge: React.FC<{ status: 'Clean' | 'Caution' | 'Risk' }> = ({ status }) => {
  if (status === 'Clean') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <ShieldCheck className="w-3 h-3" />
        Clean
      </span>
    );
  }
  if (status === 'Caution') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <AlertTriangle className="w-3 h-3" />
        Caution
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
      <AlertCircle className="w-3 h-3" />
      High Risk
    </span>
  );
};

export const SignalCard: React.FC<{ signal: DetectionSignal }> = ({ signal }) => {
  const [expanded, setExpanded] = useState(false);

  const getBorderColor = () => {
    if (signal.status === 'Risk') return 'border-rose-500/30 hover:border-rose-500/50 bg-rose-950/10';
    if (signal.status === 'Caution') return 'border-amber-500/30 hover:border-amber-500/50 bg-amber-950/10';
    return 'border-slate-800 hover:border-slate-700 bg-slate-900/40';
  };

  return (
    <div className={`p-4 rounded-xl border transition-all duration-200 ${getBorderColor()}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {signal.category}
            </span>
            <SignalBadge status={signal.status} />
          </div>
          <h4 className="text-sm font-bold text-white leading-snug">{signal.name}</h4>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-400 shrink-0">
          Score: {signal.score}
        </span>
      </div>

      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
        {signal.description}
      </p>

      {signal.flagged_snippet && (
        <div className="mt-3 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-[11px] font-medium text-slate-300 hover:text-white"
          >
            <span>Evidence / Extracted Match</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {expanded && (
            <div className="mt-2 p-2 rounded bg-slate-950/90 border border-slate-800 font-mono text-[11px] text-amber-300/90 break-words">
              {signal.flagged_snippet}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const SignalGrid: React.FC<{ signals: DetectionSignal[] }> = ({ signals }) => {
  const [filter, setFilter] = useState<'ALL' | 'Risk' | 'Caution' | 'Clean'>('ALL');

  const filtered = filter === 'ALL' ? signals : signals.filter(s => s.status === filter);

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Detection Signals Matrix</span>
            <span className="text-xs font-normal text-slate-400">({signals.length} vectors analyzed)</span>
          </h3>
          <p className="text-xs text-slate-400">Heuristic, linguistic, structural, and domain safety monitors</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          {(['ALL', 'Risk', 'Caution', 'Clean'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filter === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'ALL' ? 'All (14)' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Signal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((sig) => (
          <SignalCard key={sig.id} signal={sig} />
        ))}
      </div>
    </div>
  );
};
