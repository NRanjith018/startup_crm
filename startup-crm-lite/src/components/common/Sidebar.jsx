import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, TrendingUp, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import DarkModeToggle from './DarkModeToggle';

/**
 * Sidebar Component
 * Implements a premium, modern SaaS collapsible sidebar.
 * Features:
 * - Hidden on Mobile screens completely (`hidden md:flex`).
 * - Independent scrollable viewport bounds (h-screen overflow-y-auto).
 * - Floating border expand/collapse chevron button (Notion/Linear style).
 * - Active state indicator bar on the left edge.
 * - Profile avatar card at the bottom which collapses dynamically.
 */
export default function Sidebar() {
  const { logout, user } = useAuth();
  
  // Collapse state persisted under localStorage key crm_sidebar_collapsed
  const [isCollapsed, setIsCollapsed] = useLocalStorage('crm_sidebar_collapsed', false);

  const navigation = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard, desc: 'Pipeline overview' },
    { name: 'Leads', to: '/leads', icon: Users, desc: 'Manage lead database' },
    { name: 'Analytics', to: '/analytics', icon: TrendingUp, desc: 'Insights & forecasts' },
    { name: 'Settings', to: '/settings', icon: Settings, desc: 'Account profile' },
  ];

  // Helper to extract first character of name for avatar initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside
      className={`hidden md:flex sticky top-0 inset-y-0 left-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-all duration-300 flex-col h-screen overflow-y-auto scrollbar-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Floating Border Toggle Pill (Visible only on Desktop for Notion/Linear expand/collapse feel) */}
      <button
        onClick={() => setIsCollapsed((prev) => !prev)}
        className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-transform hover:scale-110 cursor-pointer z-50"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      {/* Top Header / Branding area */}
      <div className={`h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800 pb-0 flex-shrink-0 transition-all ${
        isCollapsed ? 'lg:px-3 lg:justify-center' : ''
      }`}>
        <div className="flex items-center gap-3">
          {/* Styled gradient logo icon */}
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-extrabold text-sm flex-shrink-0 select-none">
            CL
          </div>
          
          {/* Brand Title (Hidden if collapsed or on tablet) */}
          <span className={`text-base font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-none select-none transition-opacity duration-200 ${
            isCollapsed ? '' : 'lg:inline'
          }`}>
            CRM<span className="text-blue-600 dark:text-blue-400">Lite</span>
          </span>
        </div>
      </div>

      {/* Middle Navigation Area */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 md:space-y-4 lg:space-y-1.5">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `group relative flex flex-row md:flex-col lg:flex-row items-center md:justify-center lg:justify-start gap-3 md:gap-1 lg:gap-3 px-3 md:px-2 lg:px-3 py-2.5 rounded-lg text-sm md:text-[10px] lg:text-sm font-semibold transition-all duration-155 ${
                  isCollapsed ? 'lg:justify-center lg:px-2 lg:py-3.5' : ''
                } ${
                  isActive
                    ? 'bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              {/* Active Indicator Line on the left edge */}
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-lg transition-all ${
                      isCollapsed ? 'lg:h-7' : 'lg:h-6'
                    }`} />
                  )}
                  
                  <Icon className="h-4.5 w-4.5 flex-shrink-0 transition-transform duration-150 group-hover:scale-105" />
                  
                  <div className="flex flex-col md:items-center lg:items-start leading-tight">
                    <span className={`md:hidden whitespace-nowrap ${isCollapsed ? '' : 'lg:inline'}`}>
                      {item.name}
                    </span>
                    {/* Sub-label description visible only on expanded desktop */}
                    <span className={`text-[10px] text-slate-400 dark:text-slate-500 hidden font-normal mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px] ${
                      isCollapsed ? '' : 'lg:block'
                    }`}>
                      {item.desc}
                    </span>
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Area: DarkMode + User Profile Info Card */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-4 flex-shrink-0">
        
        {/* Theme switcher */}
        <div className="flex md:justify-center lg:justify-start">
          <DarkModeToggle isCollapsed={isCollapsed} />
        </div>

        {/* User Profile Card Section */}
        <div className={`flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 transition-all ${
          isCollapsed ? 'lg:justify-center lg:p-1.5' : ''
        }`}>
          <div className="flex items-center gap-2.5">
            {/* Initials profile circular avatar with premium gradient */}
            <div 
              className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs select-none flex-shrink-0"
              title={`${user?.name || 'User'} (${user?.email || ''})`}
            >
              {getInitials(user?.name)}
            </div>
            
            {/* Profile texts (hidden if collapsed) */}
            <div className={`flex flex-col text-left leading-none md:hidden ${isCollapsed ? '' : 'lg:flex'}`}>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[120px]">
                {user?.name || 'Ranjith'}
              </span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold mt-1 truncate max-w-[120px]">
                {user?.email || 'ranjith.n@mits.ac.in'}
              </span>
            </div>
          </div>

          {/* Logout button triggers directly from profile panel (hidden if collapsed) */}
          <button
            onClick={logout}
            className={`p-1.5 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-colors md:hidden ${
              isCollapsed ? '' : 'lg:block'
            } cursor-pointer`}
            title="Sign Out"
            aria-label="Sign Out Session"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

      </div>
    </aside>
  );
}
