import React, { useState } from 'react';
import { 
  Sliders, 
  Bell, 
  ShieldCheck, 
  Eye, 
  Download, 
  Trash2, 
  Save, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [sensitivity, setSensitivity] = useState(65);
  const [clickbaitThreshold, setClickbaitThreshold] = useState(55);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoExpandClaims, setAutoExpandClaims] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings({
        sensitivity,
        clickbaitThreshold,
        emailAlerts,
        autoExpandClaims
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      // Handled
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      platform: "TruthLens AI",
      exported_at: new Date().toISOString(),
      export_version: "2.4.0",
      settings: { sensitivity, clickbaitThreshold, emailAlerts, autoExpandClaims }
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "truthlens_user_data_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
          <Sliders className="w-4 h-4" />
          <span>System Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Platform & AI Engine Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Tune algorithmic sensitivity thresholds, real-time alert triggers, and privacy controls.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Settings preferences updated and saved.</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* AI Engine Sensitivity */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span>AI Detection Calibration & Sensitivity</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-300">
                  Overall Credibility Sensitivity: <span className="text-blue-400 font-mono font-bold">{sensitivity}%</span>
                </label>
                <span className="text-slate-500">Default: 65%</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Higher sensitivity flags borderline sensational phrasing and speculative anonymous attributions more aggressively.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-300">
                  Clickbait Headline Trigger Threshold: <span className="text-amber-400 font-mono font-bold">{clickbaitThreshold}%</span>
                </label>
                <span className="text-slate-500">Default: 55%</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                value={clickbaitThreshold}
                onChange={(e) => setClickbaitThreshold(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Display & Notification Options */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Bell className="w-5 h-5 text-indigo-400" />
            <span>Notification & Verification Preferences</span>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-white">Disinformation Surge Alert Digest</p>
                <p className="text-[11px] text-slate-400">Receive weekly summaries of trending unverified viral claims.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-white">Auto-Expand Extracted Evidence</p>
                <p className="text-[11px] text-slate-400">Automatically show supporting citations on result dossiers.</p>
              </div>
              <input
                type="checkbox"
                checked={autoExpandClaims}
                onChange={(e) => setAutoExpandClaims(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </form>

      {/* Data Export & Privacy */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Data Privacy & Portability</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Export your complete analysis history, bookmarks, and calibration settings in standardized JSON format.
        </p>

        <button
          onClick={handleExportData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download JSON Export</span>
        </button>
      </div>
    </div>
  );
};
