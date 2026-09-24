import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Globe2, 
  Languages, 
  Search, 
  ArrowRight, 
  Layers, 
  Activity,
  Plus
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';
import { api } from '../services/api';
import type { DashboardStats } from '../types';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const timelineData = [
    { name: 'Mon', credible: 180, suspicious: 45, spam: 20 },
    { name: 'Tue', credible: 210, suspicious: 50, spam: 28 },
    { name: 'Wed', credible: 195, suspicious: 42, spam: 18 },
    { name: 'Thu', credible: 240, suspicious: 60, spam: 34 },
    { name: 'Fri', credible: 280, suspicious: 65, spam: 30 },
    { name: 'Sat', credible: 220, suspicious: 48, spam: 22 },
    { name: 'Sun', credible: 260, suspicious: 52, spam: 25 },
  ];

  if (loading || !stats) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading intelligence telemetry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Welcome & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Telemetry & Surveillance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Global News Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time aggregate credibility statistics, spam velocity monitoring, and verification logs.
          </p>
        </div>

        <button
          onClick={() => navigate('/analyzer')}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Analyze New Article
        </button>
      </div>

      {/* Top Telemetry KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Articles Analyzed"
          value={stats.total_articles.toLocaleString()}
          subtitle="Indexed across global feeds"
          icon={Layers}
          trend={{ value: '+14% this week', isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Credibility Rate"
          value={`${stats.credible_rate}%`}
          subtitle={`${stats.credible_count} verified high integrity`}
          icon={ShieldCheck}
          trend={{ value: '+2.4% baseline', isPositive: true }}
          color="emerald"
        />
        <StatCard
          title="Suspicious & Flagged"
          value={stats.suspicious_count.toLocaleString()}
          subtitle="Requires secondary review"
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          title="Spam / Misleading"
          value={stats.spam_count.toLocaleString()}
          subtitle="High risk disinformation"
          icon={ShieldAlert}
          color="rose"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Timeline Area Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Weekly Analysis Volume & Spam Velocity</h3>
              <p className="text-xs text-slate-400">7-day rolling volume by classification verdict</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Credible
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Suspicious
              </span>
              <span className="flex items-center gap-1 text-rose-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Spam
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="credGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="spamGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="credible" stroke="#16A34A" fillOpacity={1} fill="url(#credGrad)" />
                <Area type="monotone" dataKey="spam" stroke="#DC2626" fillOpacity={1} fill="url(#spamGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Credibility Distribution Donut (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl glass-card border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Credibility Breakdown</h3>
            <p className="text-xs text-slate-400">Total proportion of scanned content</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.credibility_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.credibility_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {stats.credibility_distribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-mono font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Detected Risk Signals Bar Chart & Coverage Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Signals Bar Chart (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Top Detected Spam & Misinformation Signals</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.top_signals_detected} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={10} width={140} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Regional Coverage (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-card border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Global Monitoring Footprint</h3>
            <p className="text-xs text-slate-400">Live surveillance coverage across international publishing networks</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <Globe2 className="w-5 h-5 text-blue-400 mx-auto" />
              <div className="text-xl font-bold font-mono text-white">{stats.countries_covered}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Countries</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <Languages className="w-5 h-5 text-indigo-400 mx-auto" />
              <div className="text-xl font-bold font-mono text-white">{stats.languages_count}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Languages</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
              <div className="text-xl font-bold font-mono text-white">{stats.monitored_sources}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Sources</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-xs text-blue-300 flex items-center justify-between">
            <span>Explore regional country breakdown and topic heatmaps</span>
            <Link to="/trends" className="font-bold underline hover:text-white flex items-center gap-1">
              View Trends <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Intelligence Verifications Table */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Intelligence Reports</h3>
            <p className="text-xs text-slate-400">Latest analyzed news submissions and verdicts</p>
          </div>
          <Link
            to="/history"
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            View Complete Archive <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 pl-2">Headline / Subject</th>
                <th className="pb-3">Source Domain</th>
                <th className="pb-3">Verdict</th>
                <th className="pb-3">Score</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats.recent_activity.map((item) => {
                const isCredible = item.classification === 'NOT SPAM';
                const isSpam = item.classification === 'SPAM';
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pl-2 font-medium text-white max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-3 font-mono text-slate-400">
                      {item.source}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isCredible
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : isSpam
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {item.classification}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-white">
                      {Math.round(item.credibility_score)}%
                    </td>
                    <td className="py-3 text-slate-500 font-mono text-[11px]">
                      {item.created_at}
                    </td>
                    <td className="py-3 text-right pr-2">
                      <Link
                        to={`/result/${item.id}`}
                        className="text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        Open Dossier
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
