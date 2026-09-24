import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Sparkles, 
  Search, 
  ArrowRight, 
  FileText, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3, 
  Cpu, 
  Globe2, 
  Lock, 
  Layers, 
  ExternalLink,
  Zap
} from 'lucide-react';
import { SampleNewsModal } from '../components/SampleNewsModal';
import type { SampleNewsItem } from '../components/SampleNewsModal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Detect if input is URL or text
    const isUrl = inputText.trim().startsWith('http://') || inputText.trim().startsWith('https://');
    navigate('/analyzer', {
      state: {
        initialInput: inputText.trim(),
        inputType: isUrl ? 'url' : 'text'
      }
    });
  };

  const handleSelectSample = (sample: SampleNewsItem) => {
    navigate('/analyzer', {
      state: {
        initialInput: sample.content,
        initialHeadline: sample.title,
        inputType: 'text'
      }
    });
  };

  const publisherBadges = [
    { name: 'Reuters', tag: 'International Wire' },
    { name: 'Associated Press', tag: 'News Agency' },
    { name: 'BBC News', tag: 'Public Broadcaster' },
    { name: 'The Guardian', tag: 'Investigative Press' },
    { name: 'Al Jazeera', tag: 'Global Media' },
    { name: 'Nature Journal', tag: 'Scientific Peer-Review' }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 relative overflow-hidden">
      
      {/* Dynamic Background Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[350px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-lg shadow-blue-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>AI-POWERED GLOBAL NEWS VERIFICATION PLATFORM</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-sans leading-tight"
          >
            Is This News Real?
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto"
          >
            Analyze news articles, headlines, and URLs with AI-powered credibility detection, explainable claim verification, and deep source intelligence.
          </motion.p>

          {/* Main Interactive Analyzer Input Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-3 rounded-2xl glass-dropdown border border-slate-700/80 shadow-2xl relative max-w-2xl mx-auto"
          >
            <form onSubmit={handleAnalyze} className="space-y-3">
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste news article, headline, or article URL here..."
                  rows={3}
                  className="w-full p-4 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-800 resize-none font-sans"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setSampleModalOpen(true)}
                  className="text-xs font-semibold text-slate-400 hover:text-blue-400 flex items-center gap-1.5 transition-colors px-2 py-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Try Sample News
                </button>

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Analyze News
                </button>
              </div>
            </form>
          </motion.div>

          <p className="text-xs text-slate-500 font-medium">
            AI-powered analysis • Global coverage • 14 Detection signals • Fully Explainable
          </p>

          {/* Floating Verified Publisher Badges */}
          <div className="pt-10">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4">
              Continuous Intelligence Scanning Against Global Editorial Repositories
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
              {publisherBadges.map((pub, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-1.5 rounded-lg glass-card border border-slate-800/80 flex items-center gap-2 text-xs text-slate-300 hover:border-slate-700 transition-colors"
                >
                  <span className="font-semibold text-white">{pub.name}</span>
                  <span className="text-[10px] text-slate-500">({pub.tag})</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 mt-2">
              *Referenced for benchmark domain categorization. Organizations do not directly endorse the platform.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Workflow</span>
            <h2 className="text-3xl font-extrabold text-white">How TruthLens AI Works</h2>
            <p className="text-sm text-slate-400">
              Four automated stages evaluate journalistic integrity without opaque black-box verdicts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Submit', desc: 'Paste raw news content, headline, or direct article link into the scanner.', icon: FileText },
              { step: '02', title: 'Analyze', desc: '14 signal detectors scan for clickbait, hyperbole, anonymous hearsay, and structural spam.', icon: Cpu },
              { step: '03', title: 'Verify', desc: 'Claims are extracted and cross-referenced with source reliability and empirical benchmarks.', icon: Shield },
              { step: '04', title: 'Understand', desc: 'Receive explainable reasons, credibility percentages, and risk mitigation advice.', icon: CheckCircle2 }
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="p-6 rounded-2xl glass-card border border-slate-800 relative space-y-4 hover:border-blue-500/40 transition-all group">
                  <span className="text-3xl font-black font-mono text-slate-700 group-hover:text-blue-500/40 transition-colors">
                    {st.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{st.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core AI Capabilities Grid */}
      <section className="py-20 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Multi-Factor Analysis</span>
            <h2 className="text-3xl font-extrabold text-white">Powerful AI News Intelligence</h2>
            <p className="text-sm text-slate-400">
              Engineered with specialized modules to unpack every layer of digital information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Claim Extraction',
                desc: 'Isolates verifiable propositions and assesses empirical verifiability.',
                icon: Layers,
                color: 'text-blue-400'
              },
              {
                title: 'Source Intelligence',
                desc: 'Evaluates domain registration age, HTTPS security, and editorial bias history.',
                icon: Globe2,
                color: 'text-indigo-400'
              },
              {
                title: 'Spam & Clickbait Flags',
                desc: 'Detects emotional manipulation, capitalization shouting, and sensational tropes.',
                icon: AlertTriangle,
                color: 'text-amber-400'
              },
              {
                title: 'Evidence Synthesizer',
                desc: 'Generates transparent reasons and potential concerns in clear plain language.',
                icon: Sparkles,
                color: 'text-violet-400'
              }
            ].map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div key={i} className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${cap.color}`} />
                  </div>
                  <h4 className="text-base font-bold text-white">{cap.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-violet-900/40 border border-blue-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Know the Truth Before You Share
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Join thousands of journalists, researchers, and media consumers using TruthLens AI to navigate the modern information landscape.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => navigate('/analyzer')}
                className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Analyze Your First Article
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-xl font-bold text-sm text-slate-200 glass-card hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Explore Global Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      <SampleNewsModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        onSelect={handleSelectSample}
      />
    </div>
  );
};
