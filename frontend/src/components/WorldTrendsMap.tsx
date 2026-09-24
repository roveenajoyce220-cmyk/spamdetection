import React, { useState } from 'react';
import { Globe2, ShieldCheck, AlertTriangle, ChevronRight, Activity } from 'lucide-react';

interface CountryData {
  code: string;
  country: string;
  volume: number;
  credibility_index: number;
  spam_rate: number;
  flagged_topics: string[];
}

export const WorldTrendsMap: React.FC<{ countries: CountryData[] }> = ({ countries }) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(countries[0] || null);

  const getStatusColor = (index: number) => {
    if (index >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (index >= 65) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 rounded-2xl glass-card border border-slate-800">
      
      {/* Country List Explorer */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Globe2 className="w-5 h-5 text-blue-400" />
            <span>Global Credibility by Region</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {countries.length} Regional Nodes Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
          {countries.map((c) => {
            const isSelected = selectedCountry?.code === c.code;
            return (
              <div
                key={c.code}
                onClick={() => setSelectedCountry(c)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center border border-slate-700">
                      {c.code}
                    </span>
                    <span className="text-xs font-bold text-white truncate max-w-[110px]">{c.country}</span>
                  </div>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${getStatusColor(c.credibility_index)}`}>
                    {c.credibility_index.toFixed(1)}%
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{c.volume.toLocaleString()} articles</span>
                  <span className="text-rose-400 font-semibold">{c.spam_rate}% spam</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Country Details Card */}
      {selectedCountry && (
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Regional Intelligence Node
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-black text-white">{selectedCountry.country}</h3>
              <span className="text-xs font-mono text-blue-400 font-bold">[{selectedCountry.code}]</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Credibility Index</span>
                <span className="font-mono font-bold text-emerald-400">{selectedCountry.credibility_index}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${selectedCountry.credibility_index}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Detected Spam Velocity</span>
                <span className="font-mono font-bold text-rose-400">{selectedCountry.spam_rate}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${selectedCountry.spam_rate * 3}%` }}
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Frequently Flagged Narratives:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCountry.flagged_topics.map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              Live Telemetry Active
            </span>
            <span>Refreshed hourly</span>
          </div>
        </div>
      )}
    </div>
  );
};
