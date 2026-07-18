import React, { Suspense } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Users, TrendingUp, Settings } from 'lucide-react';
import Sidebar from './components/common/Sidebar';
import Topbar from './components/common/Topbar';
import AppRoutes from './routes';

/**
 * App Component
 * Integrates responsive design frameworks:
 * 1. Collapsible visual left sidebar navigation (hidden on mobile).
 * 2. Header Topbar with dynamic page title, live notification bell panel, and signout.
 * 3. Mobile bottom tab switcher bar.
 */
function App() {
  const location = useLocation();

  // Check if viewing public pages (Landing, Login, Register) where navigation is hidden
  const isPublicPage = ['/landing', '/login', '/register'].includes(location.pathname);

  const renderFallback = () => (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );

  // Render minimal full-page view for public routes
  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200">
        <Toaster position="top-right" />
        <Suspense fallback={renderFallback()}>
          <AppRoutes />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200">
      
      {/* Left docked Sidebar (Handles desktop collapsible layouts, hidden on mobile) */}
      <Sidebar />

      {/* Main page viewer viewport pane */}
      <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0">
        
        {/* Unified Topbar containing dynamic page titles, notifications, and profile logout */}
        <Topbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Toaster position="top-right" />
            <Suspense fallback={renderFallback()}>
              <AppRoutes />
            </Suspense>
          </div>
        </main>
      </div>

      {/* Mobile Bottom tab nav switch rail (visible only on mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around z-40 md:hidden shadow-lg transition-colors duration-200">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[10px] font-bold w-16 h-12 rounded-lg transition-colors min-h-[44px] ${
              isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/leads"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[10px] font-bold w-16 h-12 rounded-lg transition-colors min-h-[44px] ${
              isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
            }`
          }
        >
          <Users className="h-5 w-5" />
          <span>Leads</span>
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[10px] font-bold w-16 h-12 rounded-lg transition-colors min-h-[44px] ${
              isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
            }`
          }
        >
          <TrendingUp className="h-5 w-5" />
          <span>Charts</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[10px] font-bold w-16 h-12 rounded-lg transition-colors min-h-[44px] ${
              isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
            }`
          }
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default App;
