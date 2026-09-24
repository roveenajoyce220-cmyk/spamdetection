import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, ExternalLink } from 'lucide-react';
import type { ExtractedClaim } from '../types';

export const ClaimCard: React.FC<{ claim: ExtractedClaim; index: number }> = ({ claim, index }) => {
  const getStatusBadge = () => {
    switch (claim.status) {
      case 'Supported':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          label: 'Supported Claim'
        };
      case 'Disputed':
        return {
          icon: XCircle,
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          label: 'Disputed Claim'
        };
      case 'Needs Verification':
      default:
        return {
          icon: AlertTriangle,
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          label: 'Needs Verification'
        };
    }
  };

  const badge = getStatusBadge();
  const Icon = badge.icon;

  return (
    <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-800 text-blue-400 text-xs font-mono font-bold flex items-center justify-center border border-slate-700">
            {index + 1}
          </span>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Confidence: </span>
          <span className="text-xs font-mono font-bold text-white">{claim.confidence}%</span>
        </div>
      </div>

      <div className="text-sm font-medium text-slate-100 leading-relaxed pl-1">
        "{claim.claim}"
      </div>

      <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 text-xs text-slate-300 space-y-1">
        <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
          <span>AI Evidence & Reasoning Anchor:</span>
          {claim.source_reference && (
            <span className="text-blue-400 font-mono flex items-center gap-1">
              Ref: {claim.source_reference}
            </span>
          )}
        </div>
        <p className="text-slate-300">{claim.evidence}</p>
      </div>
    </div>
  );
};
