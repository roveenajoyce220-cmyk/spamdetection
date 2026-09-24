import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Search, CheckCircle2, Cpu, Globe, Database } from 'lucide-react';

const SCAN_STEPS = [
  { label: 'Reading article & extracting textual structures...', icon: Search },
  { label: 'Analyzing claims & internal logical consistency...', icon: Sparkles },
  { label: 'Checking 14 linguistic & clickbait detection patterns...', icon: Cpu },
  { label: 'Evaluating source reputation & domain security...', icon: Globe },
  { label: 'Comparing evidence with historical benchmark data...', icon: Database },
  { label: 'Generating multi-factor explainable assessment...', icon: Shield }
];

export const ScanningAnimation: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 glass-card rounded-2xl border border-blue-500/30 max-w-lg mx-auto text-center space-y-6 shadow-2xl shadow-blue-500/10">
      
      {/* Radar Pulsing Rings */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-blue-600/20 animate-ping opacity-60" />
        <div className="absolute inset-2 rounded-full bg-indigo-600/30 animate-pulse-slow" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
          <Shield className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white tracking-tight">
          TruthLens AI is Analyzing This News
        </h3>
        <p className="text-xs text-slate-400">
          Executing deep multi-vector heuristic & neural credibility scan
        </p>
      </div>

      {/* Progress Steps List */}
      <div className="w-full space-y-2.5 text-left bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        {SCAN_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const Icon = step.icon;

          return (
            <motion.div
              key={idx}
              className={`flex items-center gap-3 text-xs transition-colors duration-200 ${
                isDone
                  ? 'text-emerald-400 font-medium'
                  : isCurrent
                  ? 'text-blue-300 font-bold'
                  : 'text-slate-500'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
              ) : (
                <Icon className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span className="truncate">{step.label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Scanning linear bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full"
          initial={{ width: '10%' }}
          animate={{ width: `${((currentStepIndex + 1) / SCAN_STEPS.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
};
