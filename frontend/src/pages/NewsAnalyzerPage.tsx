import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Heading, 
  Link as LinkIcon, 
  Sparkles, 
  Search, 
  Trash2, 
  Globe, 
  Tag, 
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { ScanningAnimation } from '../components/ScanningAnimation';
import { SampleNewsModal } from '../components/SampleNewsModal';
import type { SampleNewsItem } from '../components/SampleNewsModal';

export const NewsAnalyzerPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [inputType, setInputType] = useState<'text' | 'headline' | 'url'>('text');
  const [newsText, setNewsText] = useState('');
  const [headline, setHeadline] = useState('');
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('English');
  const [category, setCategory] = useState('World');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  // Initialize from router navigation state if provided (e.g. from Landing Page)
  useEffect(() => {
    if (location.state) {
      if (location.state.inputType) setInputType(location.state.inputType);
      if (location.state.initialInput) {
        if (location.state.inputType === 'url') {
          setUrl(location.state.initialInput);
        } else if (location.state.inputType === 'headline') {
          setHeadline(location.state.initialInput);
        } else {
          setNewsText(location.state.initialInput);
        }
      }
      if (location.state.initialHeadline) {
        setHeadline(location.state.initialHeadline);
      }
    }
  }, [location.state]);

  const handleSelectSample = (sample: SampleNewsItem) => {
    setInputType('text');
    setHeadline(sample.title);
    setNewsText(sample.content);
    setUrl(sample.source);
    setCategory(sample.category);
    setError(null);
  };

  const handleClear = () => {
    setNewsText('');
    setHeadline('');
    setUrl('');
    setError(null);
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (inputType === 'url' && !url.trim()) {
      setError('Please provide a valid news article URL.');
      return;
    }
    if (inputType === 'headline' && !headline.trim()) {
      setError('Please provide a news headline to analyze.');
      return;
    }
    if (inputType === 'text' && !newsText.trim() && !headline.trim()) {
      setError('Please provide article content or headline.');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Allow the scanning animation stages to be displayed nicely
      const startTime = Date.now();
      
      const res = await api.analyzeNews({
        input_type: inputType,
        text: inputType === 'text' ? newsText : (inputType === 'headline' ? headline : undefined),
        headline: headline || undefined,
        url: url || undefined,
        language,
        category
      });

      const elapsed = Date.now() - startTime;
      const minAnimationTime = 1800; // Guarantee UX scan feedback
      const remainingTime = Math.max(0, minAnimationTime - elapsed);

      setTimeout(() => {
        setIsAnalyzing(false);
        navigate(`/result/${res.id}`, { state: { resultData: res } });
      }, remainingTime);

    } catch (err: any) {
      setIsAnalyzing(false);
      setError(err.message || 'Unable to complete AI analysis. Please verify your input and try again.');
    }
  };

  const activeContent = inputType === 'url' ? url : (inputType === 'headline' ? headline : newsText);
  const characterCount = activeContent.length;
  const wordCount = activeContent.trim() ? activeContent.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI News Analysis Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            News Credibility & Spam Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Input news text, headlines, or live URLs to generate multi-vector credibility verdicts and claim evidence.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSampleModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 glass-card hover:bg-slate-800 border border-slate-700 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Load Benchmark Sample
        </button>
      </div>

      {isAnalyzing ? (
        <div className="py-16">
          <ScanningAnimation />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Input Console (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleRunAnalysis} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
              
              {/* Input Mode Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Analysis Mode
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
                  {[
                    { type: 'text', label: 'News Text', icon: FileText },
                    { type: 'headline', label: 'Headline Only', icon: Heading },
                    { type: 'url', label: 'Article URL', icon: LinkIcon }
                  ].map((mode) => {
                    const Icon = mode.icon;
                    const isActive = inputType === mode.type;
                    return (
                      <button
                        key={mode.type}
                        type="button"
                        onClick={() => {
                          setInputType(mode.type as any);
                          setError(null);
                        }}
                        className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conditional Inputs */}
              {inputType === 'url' ? (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Live News Article URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.reuters.com/world/article-example..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-800 font-mono"
                    />
                    <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    TruthLens will automatically fetch the headline, body text, byline, and domain intelligence.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inputType === 'text' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Article Headline (Optional)
                      </label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g. Clean Energy Research Yields Record Efficiency"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-800"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">
                        {inputType === 'headline' ? 'News Headline to Verify' : 'Article Body Content'}
                      </label>
                      <span className="text-[11px] font-mono text-slate-500">
                        {characterCount} chars • {wordCount} words
                      </span>
                    </div>
                    <textarea
                      value={inputType === 'headline' ? headline : newsText}
                      onChange={(e) => {
                        if (inputType === 'headline') setHeadline(e.target.value);
                        else setNewsText(e.target.value);
                      }}
                      placeholder={
                        inputType === 'headline'
                          ? 'Paste headline here (e.g. Scientists announce major discovery...)'
                          : 'Paste full news article content, excerpt, or social post text here...'
                      }
                      rows={inputType === 'headline' ? 3 : 8}
                      className="w-full p-4 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-800 resize-none font-sans leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Categorization & Language Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-400" />
                    <span>News Category</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {['World', 'Politics', 'Technology', 'Science', 'Health', 'Business', 'Sports', 'Entertainment', 'Education'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Language</span>
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {['English', 'Spanish', 'French', 'German', 'Hindi', 'Japanese', 'Other'].map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Error Message if any */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs font-semibold text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Input
                </button>

                <button
                  type="submit"
                  disabled={isAnalyzing || (!activeContent.trim() && !headline.trim())}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Analyze with AI
                </button>
              </div>
            </form>
          </div>

          {/* Right Live Input Preview & Intelligence Context (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Analysis Input Preview
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Ready to Scan
                </span>
              </div>

              {activeContent.trim() ? (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Title / Headline</span>
                    <p className="text-sm font-bold text-white line-clamp-2">
                      {headline || (inputType === 'headline' ? headline : 'Auto-detected from text content')}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Target Domain</span>
                    <p className="font-mono text-slate-300">
                      {url ? url.split('/')[2] || url : 'Direct User Input (No Domain)'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Content Summary</span>
                    <p className="text-slate-300 line-clamp-4 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      {activeContent}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Category: <strong className="text-white">{category}</strong></span>
                    <span>Language: <strong className="text-white">{language}</strong></span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-300">Awaiting News Input</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Paste content on the left or select a sample article to view real-time structure preview.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
              <span className="font-semibold text-slate-200 block">Pro Tips for Best Accuracy:</span>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Paste full paragraphs rather than single sentences when possible.</li>
                <li>Including the canonical URL allows domain registration and SSL verification.</li>
                <li>Articles with dates and bylines score higher on author transparency.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <SampleNewsModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        onSelect={handleSelectSample}
      />
    </div>
  );
};
