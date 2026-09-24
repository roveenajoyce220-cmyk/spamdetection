import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import type { ClassificationVerdict, RiskLevel } from '../types';

interface CredibilityGaugeProps {
  score: number;             // 0 - 100
  classification: ClassificationVerdict; // NOT SPAM, SUSPICIOUS, SPAM
  confidence: number;        // 0 - 100
  riskLevel: RiskLevel;      // LOW, MEDIUM, HIGH
  size?: number;             // px
}

export const CredibilityGauge: React.FC<CredibilityGaugeProps> = ({
  score,
  classification,
  confidence,
  riskLevel,
  size = 240
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColorConfig = () => {
    switch (classification) {
      case 'NOT SPAM':
        return {
          stroke: '#16A34A',
          strokeGlow: 'rgba(22, 163, 74, 0.4)',
          bgBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: ShieldCheck,
          label: 'NOT SPAM / CREDIBLE',
          textClass: 'text-emerald-400',
          gradientId: 'emeraldGrad'
        };
      case 'SUSPICIOUS':
        return {
          stroke: '#F59E0B',
          strokeGlow: 'rgba(245, 158, 11, 0.4)',
          bgBadge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: AlertTriangle,
          label: 'SUSPICIOUS / NEEDS REVIEW',
          textClass: 'text-amber-400',
          gradientId: 'amberGrad'
        };
      case 'SPAM':
      default:
        return {
          stroke: '#DC2626',
          strokeGlow: 'rgba(220, 38, 38, 0.4)',
          bgBadge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: ShieldAlert,
          label: 'SPAM / MISLEADING',
          textClass: 'text-rose-400',
          gradientId: 'roseGrad'
        };
    }
  };

  const config = getColorConfig();
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card rounded-2xl border border-slate-800 relative overflow-hidden">
      {/* Background radial highlight */}
      <div
        className="absolute w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none -top-10"
        style={{ backgroundColor: config.stroke }}
      />

      {/* Main Circular SVG Gauge */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <defs>
            <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
            <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated Value Stroke */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${config.gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 8px ${config.strokeGlow})`
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Icon className={`w-8 h-8 mb-1 ${config.textClass}`} />
          <div className="flex items-baseline">
            <motion.span
              className="text-4xl font-black text-white font-mono tracking-tight"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {Math.round(score)}
            </motion.span>
            <span className="text-sm font-bold text-slate-400 ml-0.5">%</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            Credibility Score
          </span>
        </div>
      </div>

      {/* Primary Classification Text Banner */}
      <div className="mt-4 text-center space-y-2 w-full">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider ${config.bgBadge}`}>
          <Icon className="w-4 h-4" />
          <span>{config.label}</span>
        </div>

        {/* Confidence & Risk Pills */}
        <div className="flex items-center justify-center gap-3 pt-2 text-xs">
          <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">AI Confidence:</span>
            <span className="font-bold text-white font-mono">{Math.round(confidence)}%</span>
          </div>

          <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <span className="text-slate-400">Risk Level:</span>
            <span
              className={`font-bold font-mono ${
                riskLevel === 'LOW'
                  ? 'text-emerald-400'
                  : riskLevel === 'MEDIUM'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {riskLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
