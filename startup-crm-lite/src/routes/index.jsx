import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Lazy load page components to improve initial loading speed of the application
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Settings = lazy(() => import('../pages/Settings'));

/**
 * ProtectedRoute Component
 * Route wrapper that redirects unauthenticated users to the Login page.
 * Uses <Outlet /> to render nested child routes.
 */
function ProtectedRoute() {
  const { token, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

/**
 * AppRoutes Component
 * Centralizes all navigation mapping configurations for Startup CRM Lite.
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private Pages protected by ProtectedRoute nesting */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch-All Route for 404 Pages */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
