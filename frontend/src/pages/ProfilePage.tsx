import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Key, 
  Copy, 
  Check, 
  ShieldCheck, 
  Calendar, 
  Mail, 
  Sparkles, 
  Save, 
  RefreshCw,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const ProfilePage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [role, setRole] = useState(user?.role || 'Fact Checker');
  const [copiedKey, setCopiedKey] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  const handleCopyApiKey = () => {
    if (user?.api_key) {
      navigator.clipboard.writeText(user.api_key);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleGenerateNewKey = async () => {
    try {
      await api.generateApiKey();
      await refreshProfile();
      setUpdateMsg('New API key generated successfully.');
      setTimeout(() => setUpdateMsg(null), 3000);
    } catch {
      // Handled
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await api.updateProfile({ full_name: fullName, role });
      await refreshProfile();
      setUpdateMsg('Profile updated successfully.');
      setTimeout(() => setUpdateMsg(null), 3000);
    } catch {
      // Handled
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <p className="text-slate-400">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
          <UserIcon className="w-4 h-4" />
          <span>Account Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          User Profile & Developer API Access
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your verified credentials, editorial role, and live REST API authentication tokens.
        </p>
      </div>

      {updateMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{updateMsg}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
          alt={user.full_name || 'User'}
          className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-blue-500/40 p-1"
        />
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-white">{user.full_name || 'Analyst'}</h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <ShieldCheck className="w-3 h-3" />
              {user.role}
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400">{user.email}</p>
          <p className="text-[11px] text-slate-500 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Member since {new Date(user.created_at).toLocaleDateString()}</span>
          </p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Editorial Details</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Display Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Verification Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Fact Checker">Fact Checker</option>
                <option value="Journalist">Journalist</option>
                <option value="Researcher">Researcher</option>
                <option value="Senior Intelligence Analyst">Senior Intelligence Analyst</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </form>
      </div>

      {/* Developer API Key Manager */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-400" />
              <span>Production REST API Key</span>
            </h3>
            <p className="text-xs text-slate-400">
              Use this bearer key to analyze news and stream credibility signals programmatically.
            </p>
          </div>
          <button
            onClick={handleGenerateNewKey}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate Key</span>
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
          <code className="text-xs font-mono text-blue-400 truncate">
            {user.api_key || 'tl_live_9a87d21f83b1029c87e6a5'}
          </code>
          <button
            onClick={handleCopyApiKey}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1"
          >
            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
          <strong>API Endpoint:</strong> <code className="text-slate-200">POST /api/news/analyze</code> • Includes 5,000 monthly scan requests on the Free Intelligence tier.
        </div>
      </div>
    </div>
  );
};
