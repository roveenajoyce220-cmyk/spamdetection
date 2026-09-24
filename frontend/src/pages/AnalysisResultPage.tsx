import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Share2, 
  Bookmark, 
  Printer, 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  Globe2, 
  Cpu, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import type { AnalysisResult } from '../types';
import { CredibilityGauge } from '../components/CredibilityGauge';
import { SignalGrid } from '../components/SignalGrid';
import { ClaimCard } from '../components/ClaimCard';
import { SourceMeter } from '../components/SourceMeter';
import { useAuth } from '../context/AuthContext';

export const AnalysisResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [result, setResult] = useState<AnalysisResult | null>(
    location.state?.resultData || null
  );
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!result && id) {
      setLoading(true);
      api.getAnalysisById(id)
        .then((data) => {
          setResult(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Failed to load analysis report.');
          setLoading(false);
        });
    }
  }, [id, result]);

  // Trigger celebratory confetti for high-credibility results
  useEffect(() => {
    if (result && result.classification === 'NOT SPAM' && result.credibility_score >= 85) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [result]);

  const handleCopyReportLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveArticle = async () => {
    if (!result) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await api.saveArticle(result.id, { notes: 'Saved from analysis report' });
      setSaved(true);
    } catch {
      // Handled
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Retrieving intelligence dossier...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-[70vh] max-w-lg mx-auto flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Analysis Report Not Found</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          {error || "The requested analysis report could not be found or has expired."}
        </p>
        <Link
          to="/analyzer"
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors"
        >
          Analyze a New Article
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 print:p-0 print:bg-white print:text-black">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 print:hidden">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/analyzer')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Analyzer</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Dossier ID: #{result.id}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">
              {new Date(result.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
            {result.title}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleSaveArticle}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              saved
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'glass-card hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{saved ? 'Saved in Collection' : 'Bookmark'}</span>
          </button>

          <button
            onClick={handleCopyReportLink}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold glass-card hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share Report'}</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="p-2 rounded-xl glass-card hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all"
            title="Print or Export PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Credibility Metric Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Gauge Showcase (5 cols) */}
        <div className="lg:col-span-5">
          <CredibilityGauge
            score={result.credibility_score}
            classification={result.classification}
            confidence={result.confidence}
            riskLevel={result.risk_level}
          />
        </div>

        {/* Multi-Vector Sub-Scores & Summary (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Executive Summary */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Executive Assessment
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {result.model_metadata.model_name}
              </span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {result.summary}
            </p>
          </div>

          {/* Sub-Score Progress Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Source Reliability', val: result.source_reliability, color: 'bg-blue-500' },
              { label: 'Claim Consistency', val: result.claim_consistency, color: 'bg-emerald-500' },
              { label: 'Clickbait Probability', val: result.clickbait_probability, color: 'bg-amber-500', isRisk: true },
              { label: 'Sensationalism Score', val: result.sensationalism_score, color: 'bg-rose-500', isRisk: true }
            ].map((metric, idx) => (
              <div key={idx} className="p-3.5 rounded-xl glass-card border border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block truncate">
                  {metric.label}
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-white">
                    {Math.round(metric.val)}%
                  </span>
                  <span className={`text-[10px] font-semibold ${metric.isRisk && metric.val > 50 ? 'text-rose-400' : 'text-slate-500'}`}>
                    {metric.isRisk ? (metric.val > 50 ? 'High' : 'Low') : (metric.val > 70 ? 'High' : 'Moderate')}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`${metric.color} h-full rounded-full`}
                    style={{ width: `${metric.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explainable AI Reasoning (Key Reasons vs Potential Concerns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Affirmative Reasons */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Key Affirmative Reasons</span>
          </div>
          <ul className="space-y-2.5">
            {result.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Potential Concerns */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Potential Flags & Verification Items</span>
          </div>
          <ul className="space-y-2.5">
            {result.concerns.map((concern, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="text-amber-400 font-bold mt-0.5">⚠</span>
                <span>{concern}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Extracted Claims Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>Extracted Claims & Proposition Analysis</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {result.claims.length} Claims Identified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.claims.map((claim, idx) => (
            <ClaimCard key={claim.id} claim={claim} index={idx} />
          ))}
        </div>
      </div>

      {/* Source Intelligence Section */}
      {result.source_analysis && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Globe2 className="w-5 h-5 text-indigo-400" />
            <span>Publisher & Domain Intelligence</span>
          </div>
          <SourceMeter source={result.source_analysis} />
        </div>
      )}

      {/* 14 Detection Signals Matrix */}
      <div className="pt-2">
        <SignalGrid signals={result.signals} />
      </div>

      {/* Model Metadata & Transparency Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-3">
        <div className="flex items-center justify-between text-slate-300 font-semibold">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Model Transparency & Pipeline Specifications</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">v{result.model_metadata.version}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1">
          <div>
            <span className="text-slate-500 block">Classifier Architecture</span>
            <span className="text-slate-200 font-medium">{result.model_metadata.model_name}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Evaluated Feature Vectors</span>
            <span className="text-slate-200 font-medium">{result.model_metadata.evaluated_features_count} Signals & Propositions</span>
          </div>
          <div>
            <span className="text-slate-500 block">Benchmark Accuracy & F1</span>
            <span className="text-emerald-400 font-mono font-bold">{result.model_metadata.benchmark_accuracy} (F1: {result.model_metadata.benchmark_f1_score})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
