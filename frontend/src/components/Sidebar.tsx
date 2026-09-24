import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  SearchCheck, 
  History, 
  TrendingUp, 
  Globe2, 
  Bookmark, 
  Sliders, 
  ShieldCheck,
  UserCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const links = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analyze News', path: '/analyzer', icon: SearchCheck, badge: 'New' },
    { name: 'Analysis History', path: '/history', icon: History },
    { name: 'Global Trends', path: '/trends', icon: TrendingUp },
    { name: 'Source Explorer', path: '/sources', icon: Globe2 },
    { name: 'Saved Reports', path: '/saved', icon: Bookmark },
    { name: 'User Profile', path: '/profile', icon: UserCircle },
    { name: 'Settings', path: '/settings', icon: Sliders },
  ];

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] glass-panel border-r border-slate-800/80 p-4 flex flex-col justify-between hidden lg:flex">
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Intelligence Console
          </p>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Engine Status Widget */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold text-slate-200">Neural Engine v2.4</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            14 active signal monitors • 94.6% benchmark credibility accuracy
          </p>
        </div>
      </div>

      {/* User Mini Badge */}
      {user && (
        <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3 px-2">
          <img
            src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
            alt={user.full_name || 'User'}
            className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{user.full_name || 'Analyst'}</p>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
      )}
    </aside>
  );
};
