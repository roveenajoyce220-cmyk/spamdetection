import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, AlertCircle, Heart, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { DOCS_URL, REDOC_URL, HEALTH_URL } from '../services/api';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-slate-800/80 mt-20 bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white tracking-tight text-lg">TRUTHLENS AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-powered news credibility, spam detection, and claim verification platform designed for journalists, researchers, and global citizens.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Independent & Non-Partisan</span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/analyzer" className="hover:text-blue-400 transition-colors">News Analyzer</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Intelligence Dashboard</Link></li>
              <li><Link to="/trends" className="hover:text-blue-400 transition-colors">Global Spam Trends</Link></li>
              <li><Link to="/sources" className="hover:text-blue-400 transition-colors">Source Reputation Directory</Link></li>
              <li><Link to="/history" className="hover:text-blue-400 transition-colors">Public Analysis Archive</Link></li>
            </ul>
          </div>

          {/* Col 3: AI & Standards */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Methodology & AI</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">8-Stage AI Pipeline</Link></li>
              <li><Link to="/about#signals" className="hover:text-blue-400 transition-colors">14 Detection Signals</Link></li>
              <li><Link to="/about#ethics" className="hover:text-blue-400 transition-colors">Ethics & Transparency Pledge</Link></li>
              <li><a href={DOCS_URL} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">API Docs (Swagger UI) ↗</a></li>
              <li><a href={REDOC_URL} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">API Reference (ReDoc) ↗</a></li>
              <li><a href={HEALTH_URL} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Backend Health Status ↗</a></li>
            </ul>
          </div>

          {/* Col 4: Important Ethics Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Responsible AI Notice</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              TruthLens AI computes probabilistic credibility assessments based on linguistic cues, source history, and claim logic. It is a decision-support tool and should be complemented with professional editorial fact-checking.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TruthLens AI Intelligence Systems. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              256-Bit Encrypted
            </span>
            <span>GDPR & CCPA Compliant</span>
            <span>v2.4.0 (Production)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
