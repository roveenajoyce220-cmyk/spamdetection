import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { NewsAnalyzerPage } from './pages/NewsAnalyzerPage';
import { AnalysisResultPage } from './pages/AnalysisResultPage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { TrendsPage } from './pages/TrendsPage';
import { SourceExplorerPage } from './pages/SourceExplorerPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Layout Controller
const MainLayout: React.FC = () => {
  const location = useLocation();

  // Pages that should show the sidebar in desktop console mode
  const isDashboardRoute = [
    '/dashboard',
    '/analyzer',
    '/history',
    '/trends',
    '/sources',
    '/profile',
    '/settings',
    '/saved'
  ].some((path) => location.pathname.startsWith(path));

  const isAuthRoute = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex w-full">
        {isDashboardRoute && <Sidebar />}

        <main className={`flex-1 ${isDashboardRoute ? 'p-0 min-w-0' : 'w-full'}`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analyzer" element={<NewsAnalyzerPage />} />
            <Route path="/result/:id" element={<AnalysisResultPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/trends" element={<TrendsPage />} />
            <Route path="/sources" element={<SourceExplorerPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/saved" element={<Navigate to="/history?filter=saved" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Footer (hidden on auth pages and result pages to keep focus) */}
      {!isAuthRoute && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
