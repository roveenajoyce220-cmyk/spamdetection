import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  ExternalLink, 
  Calendar, 
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import type { AnalysisResult, ClassificationVerdict } from '../types';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [classificationFilter, setClassificationFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchHistory = () => {
    setLoading(true);
    api.getHistory({
      classification: classificationFilter !== 'ALL' ? classificationFilter : undefined,
      category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
      search: searchQuery.trim() || undefined
    })
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
  }, [classificationFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Archive & Audit Trail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Analysis History & Public Archive
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search, filter, and inspect verified credibility dossiers and historical news assessments.
          </p>
        </div>

        <button
          onClick={() => navigate('/analyzer')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Analyze New Article
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search archive by headline, source domain, or keywords..."
            className="w-full pl-10 pr-24 py-2 rounded-xl bg-slate-900 text-white placeholder-slate-500 text-xs border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-lg transition-colors"
          >
            Search
          </button>
        </form>

        {/* Classification Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs shrink-0 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'NOT SPAM', label: 'Credible' },
            { id: 'SUSPICIOUS', label: 'Suspicious' },
            { id: 'SPAM', label: 'Spam' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setClassificationFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                classificationFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="shrink-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Categories</option>
            {['World', 'Politics', 'Technology', 'Science', 'Health', 'Business', 'Sports', 'Entertainment', 'Education'].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* History Items List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Filtering intelligence archive...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl border border-slate-800 space-y-3 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Analysis Reports Found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            No records matched your search filters. Try resetting the classification or search query.
          </p>
          <button
            onClick={() => {
              setClassificationFilter('ALL');
              setCategoryFilter('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {history.map((item) => {
            const isCredible = item.classification === 'NOT SPAM';
            const isSpam = item.classification === 'SPAM';
            const Icon = isCredible ? ShieldCheck : (isSpam ? ShieldAlert : AlertTriangle);

            return (
              <div
                key={item.id}
                onClick={() => navigate(`/result/${item.id}`, { state: { resultData: item } })}
                className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-blue-500/40 hover:bg-slate-800/40 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {item.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isCredible
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isSpam
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {item.classification}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Credibility Score</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {Math.round(item.credibility_score)}%
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Domain / Source</span>
                    <span className="font-mono text-slate-300 text-xs truncate max-w-[130px] inline-block">
                      {item.source_domain || 'Direct Text'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
