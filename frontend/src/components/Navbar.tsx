import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, Activity, Globe, Compass, LogIn, User as UserIcon, Menu, X, CheckCircle2, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DOCS_URL } from '../services/api';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Analyze News', path: '/analyzer', badge: 'AI Live' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Global Trends', path: '/trends' },
    { name: 'Source Explorer', path: '/sources' },
    { name: 'How It Works', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-[2px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                  TRUTHLENS
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  AI
                </span>
              </div>
              <p className="text-[10px] tracking-wide text-slate-400 font-medium">GLOBAL VERIFICATION</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 flex items-center gap-1"
              title="Open FastAPI Swagger Interactive Documentation"
            >
              <span>API Docs</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Swagger
              </span>
            </a>
          </div>

          {/* Right Action Buttons / User Profile */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg glass-card hover:bg-slate-800 transition-colors border border-slate-700/60"
                >
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
                    alt={user.full_name || 'User'}
                    className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700"
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white leading-tight">{user.full_name || 'Analyst'}</p>
                    <p className="text-[10px] text-slate-400">{user.role || 'Member'}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-dropdown rounded-xl shadow-2xl py-2 z-50 border border-slate-700/80">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        Live Engine Access
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                      User Profile & API Key
                    </Link>
                    <Link
                      to="/history"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60"
                    >
                      <Activity className="w-3.5 h-3.5 text-indigo-400" />
                      My Analysis History
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60"
                    >
                      <Compass className="w-3.5 h-3.5 text-violet-400" />
                      Platform Settings
                    </Link>
                    <div className="border-t border-slate-800 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Started Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(link.path)
                  ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <span>API Docs (FastAPI Swagger)</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Docs
            </span>
          </a>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-slate-300 hover:text-white"
                >
                  Profile & Settings
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="px-3 py-2 text-sm text-rose-400 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-slate-200 bg-slate-800 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
