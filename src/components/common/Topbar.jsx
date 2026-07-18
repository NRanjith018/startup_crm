import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, LogOut, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Topbar Component
 * Renders the top navigation header bar across pages.
 * Features:
 * - Dynamic page titles and sub-descriptions.
 * - Live notifications bell popover hub.
 * - Session sign-out.
 */
export default function Topbar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Seed mock notifications list
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Sales Lead Sarah Jenkins Won!',
      desc: 'Deal of ₹12,000 values successfully closed.',
      type: 'won',
      time: '10m ago',
      read: false,
      icon: CheckCircle2,
      iconColor: 'text-green-600 bg-green-50 dark:bg-green-950/20'
    },
    {
      id: '2',
      title: 'Meeting Scheduled: Michael Chen',
      desc: 'Sales conversation presentation booked for tomorrow at 2:00 PM.',
      type: 'meeting',
      time: '2h ago',
      read: false,
      icon: Calendar,
      iconColor: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20'
    },
    {
      id: '3',
      title: 'New Lead Added: Elena Rostova',
      desc: 'Acquired through Website contact query form.',
      type: 'new',
      time: '1d ago',
      read: true,
      icon: Clock,
      iconColor: 'text-slate-500 bg-slate-50 dark:bg-slate-800'
    }
  ]);

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Resolve current route page title
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/leads':
        return 'Leads';
      case '/analytics':
        return 'Analytics';
      case '/settings':
        return 'Settings';
      default:
        return 'CRM Admin';
    }
  };

  // Close notifications panel on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Helper to extract initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-16 sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 transition-colors duration-200">
      
      {/* Left: Mobile Brand Header, Desktop welcome breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Desktop Title Header */}
        <div className="hidden md:flex flex-col text-left">
          <span className="text-sm font-extrabold uppercase tracking-widest text-blue-600">
            {getPageTitle()}
          </span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            Overview of Startup CRM Lite workspace
          </span>
        </div>

        {/* Mobile Brand Name */}
        <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-50 select-none md:hidden">
          CRM<span className="text-blue-600 dark:text-blue-400">Lite</span>
        </span>
      </div>

      {/* Right: Notification Indicator, Profile & Logout */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Notifications Popover Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleNotifications}
            className="p-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer relative min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none"
            aria-label="Toggle notifications panel"
            title="Recent Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel popup */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-55 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Notifications ({unreadCount} new)
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications Listing */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[320px] overflow-y-auto">
                {notifications.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 flex gap-3 text-left transition-colors ${
                        item.read ? 'bg-white dark:bg-slate-900' : 'bg-blue-50/20 dark:bg-blue-950/5'
                      }`}
                    >
                      <div className={`p-2 h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-800 ${item.iconColor}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                          {item.desc}
                        </p>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold block pt-1">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 text-center border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase select-none">
                  SaaS CRM Notifications Centre
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-855 dark:bg-slate-800" />

        {/* User initials avatar guide */}
        <div className="flex items-center gap-3">
          <div 
            className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-xs flex items-center justify-center select-none"
            title={`${user?.name || 'Dev Raj'} (${user?.email || 'devaraj.b@mits.ac.in'})`}
          >
            {getInitials(user?.name)}
          </div>

          {/* Quick Signout button directly in top header */}
          <button
            onClick={logout}
            className="p-2.5 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none"
            title="Sign Out Session"
            aria-label="Logout session"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>

      </div>
    </header>
  );
}
