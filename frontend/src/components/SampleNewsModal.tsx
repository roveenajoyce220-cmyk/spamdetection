import React from 'react';
import { Sparkles, X, CheckCircle2, AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react';

export interface SampleNewsItem {
  id: string;
  category: string;
  type: 'Credible' | 'Suspicious' | 'Spam';
  title: string;
  source: string;
  content: string;
}

export const SAMPLE_ARTICLES: SampleNewsItem[] = [
  {
    id: 'sample-1',
    category: 'Science',
    type: 'Credible',
    title: 'International Consortium Achieves Net Positive Energy Output in Confined Plasma Reactor',
    source: 'https://www.nature.com/articles/fusion-energy-breakthrough-2026',
    content: `Physicists at the International Thermonuclear Experimental Reactor announced a sustained high-density plasma confinement exceeding 400 seconds. According to Dr. Marcus Aris, chief research scientist at the facility, independent verification from peer laboratories in Grenoble and Oak Ridge National Laboratory confirmed net energy stability. The published data in Nuclear Energy Research outlines thermal yields exceeding earlier computational models by 14%, marking a decisive milestone toward commercial fusion prototypes.`
  },
  {
    id: 'sample-2',
    category: 'Health',
    type: 'Spam',
    title: 'SHOCKING TRUTH: Doctors BANNED This Secret Ancient Herb That Cures Everything in 48 Hours!',
    source: 'https://healthmiraclenow.top/shocking-cure-banned',
    content: `You won't believe what Big Pharma is desperately hiding from the public! 100% of all disease is caused by this one secret toxin, and doctors are furious that this miraculous mountain root completely cures every ailment in just two days. Act now before this post gets deleted by authorities! Millions are waking up to this ancient mystery that the elite don't want you to know!`
  },
  {
    id: 'sample-3',
    category: 'Technology',
    type: 'Suspicious',
    title: 'Leaked Documents Allege Secret AI Algorithm Replaced Autonomous Defense Controls',
    source: 'https://techleakinsider.xyz/autonomous-ai-defense-leak',
    content: `Anonymous insiders claim that a major defense contractor secretly deployed a fully autonomous decision matrix across border surveillance networks without congressional oversight. While official spokespersons have denied all allegations, unverified forum transcripts suggest the system experienced an unconfirmed glitch last month.`
  },
  {
    id: 'sample-4',
    category: 'Business',
    type: 'Credible',
    title: 'Central Banks Formulate Cross-Border Liquidity Framework to Support Trade Finance',
    source: 'https://www.reuters.com/markets/central-banks-liquidity-framework-2026',
    content: `In a joint communiqué released this morning, the European Central Bank and the Federal Reserve outlined an enhanced bilateral currency swap arrangement designed to ensure smooth liquidity operations. The initiative comes following quarterly financial stability reviews and aims to mitigate foreign exchange friction across transatlantic commercial credit corridors.`
  }
];

interface SampleNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sample: SampleNewsItem) => void;
}

export const SampleNewsModal: React.FC<SampleNewsModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-dropdown w-full max-w-2xl rounded-2xl border border-slate-700/80 p-6 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Curated Benchmark Samples</span>
          </div>
          <h3 className="text-xl font-bold text-white">Select a Sample News Article</h3>
          <p className="text-xs text-slate-400">
            Test TruthLens AI's detection pipeline with diverse real-world news categories and risk profiles.
          </p>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {SAMPLE_ARTICLES.map((sample) => {
            const isCredible = sample.type === 'Credible';
            const isSpam = sample.type === 'Spam';

            return (
              <div
                key={sample.id}
                onClick={() => {
                  onSelect(sample);
                  onClose();
                }}
                className="p-4 rounded-xl glass-card border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/60 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {sample.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isCredible
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isSpam
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {sample.type}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 group-hover:text-blue-400 flex items-center gap-1 transition-colors">
                    Load Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                  {sample.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {sample.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
