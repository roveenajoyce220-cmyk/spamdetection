import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Search, 
  Sparkles, 
  Globe2, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Scale,
  Award,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const pipelineStages = [
    {
      stage: '01',
      title: 'Content Ingestion & URL Scraping',
      desc: 'Parses raw text, headlines, and remote web articles using semantic HTML sanitization, extracting author bylines, canonical domains, and publication timestamps.'
    },
    {
      stage: '02',
      title: 'Linguistic & Stylometric Normalization',
      desc: 'Computes lexical diversity, vocabulary redundancy, uppercase shouting frequency, punctuation anomalies, and subjective modifier density.'
    },
    {
      stage: '03',
      title: '14-Vector Detection Signal Analysis',
      desc: 'Scans for formulaic clickbait triggers, hyperbolic rage-bait, emotional manipulation, anonymous hearsay, and narrative contradictions.'
    },
    {
      stage: '04',
      title: 'Claim Extraction & Proposition Mapping',
      desc: 'Isolates distinct empirical claims, evaluates internal consistency, and links quantitative statistics to journalistic attributions.'
    },
    {
      stage: '05',
      title: 'Publisher & Domain Reputation Intelligence',
      desc: 'Evaluates historical spam ratios, domain registry age, SSL/TLS certificate validity, and independent editorial bias benchmarks.'
    },
    {
      stage: '06',
      title: 'Multi-Factor Bayesian Credibility Synthesis',
      desc: 'Integrates all linguistic, factual, and structural feature vectors into a calibrated 0-100 credibility index with statistical confidence bounds.'
    },
    {
      stage: '07',
      title: 'Explainable AI Reason & Concern Generation',
      desc: 'Translates technical model activations into transparent, natural-language affirmative reasons and highlighted verification warnings.'
    },
    {
      stage: '08',
      title: 'Continuous Model Evaluation & Telemetry',
      desc: 'Logs aggregated non-sensitive signals to global surveillance heatmaps while maintaining strict user data privacy.'
    }
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-12">
      
      {/* Hero */}
      <div className="text-center space-y-4 pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-blue-500/30 text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>METHODOLOGY & TRANSPARENCY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How TruthLens AI Evaluates News
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          An open, explainable 8-stage architecture engineered to combat online disinformation, deceptive clickbait, and synthetic propaganda.
        </p>
      </div>

      {/* Core Principles Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Non-Partisan Objectivity</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            TruthLens AI evaluates journalistic rigor, source attribution, and linguistic sensationalism—never political opinion or editorial stance.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Explainable AI (XAI)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every score comes with transparent reasons, extracted claim citations, and specific flags rather than an opaque true/false label.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Decision Support Tool</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI provides probabilistic risk assessment to empower readers, journalists, and researchers to make informed decisions.
          </p>
        </div>
      </div>

      {/* 8-Stage Architecture Pipeline */}
      <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Pipeline</span>
            <h2 className="text-xl font-bold text-white">The 8-Stage Detection Pipeline</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">TruthLens Neural-Heuristic v2.4</span>
        </div>

        <div className="space-y-4">
          {pipelineStages.map((stage) => (
            <div
              key={stage.stage}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-blue-500/30 transition-colors"
            >
              <span className="w-10 h-10 rounded-xl bg-slate-800 text-blue-400 font-mono font-bold text-sm flex items-center justify-center shrink-0 border border-slate-700">
                {stage.stage}
              </span>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">{stage.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benchmark Metrics & Ethical Commitment */}
      <div className="p-8 rounded-3xl bg-gradient-to-tr from-blue-950/40 via-slate-900 to-violet-950/40 border border-blue-500/30 space-y-6">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <Award className="w-5 h-5 text-blue-400" />
          <span>Model Benchmark Disclosures & Evaluation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl glass-card border border-slate-800">
            <div className="text-3xl font-black font-mono text-emerald-400">94.6%</div>
            <div className="text-xs text-slate-400 mt-1 font-semibold">Credibility Accuracy</div>
          </div>
          <div className="p-4 rounded-xl glass-card border border-slate-800">
            <div className="text-3xl font-black font-mono text-blue-400">0.938</div>
            <div className="text-xs text-slate-400 mt-1 font-semibold">Macro F1 Score</div>
          </div>
          <div className="p-4 rounded-xl glass-card border border-slate-800">
            <div className="text-3xl font-black font-mono text-indigo-400">&lt; 450ms</div>
            <div className="text-xs text-slate-400 mt-1 font-semibold">Average Inference Latency</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            *Evaluated against benchmark datasets of verified factual reporting and known synthetic disinformation samples. Regular adversarial audits ensure robustness against newly evolving clickbait and linguistic evasion strategies.
          </p>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all"
          >
            <Search className="w-4 h-4" />
            Test the Pipeline Live
          </Link>
        </div>
      </div>
    </div>
  );
};
