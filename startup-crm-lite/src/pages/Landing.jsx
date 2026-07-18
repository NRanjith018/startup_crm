import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BarChart3, Users, Zap } from 'lucide-react';

/**
 * Landing Component
 * Displays the SaaS Landing page with MITS branding.
 */
export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Navigation Top bar */}
      <header className="h-16 px-8 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            CRM<span className="text-blue-600">Lite</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm transition-all"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 flex flex-col items-center justify-center text-center space-y-10">
        <div className="space-y-4">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
            MITS CSE Internship 2026
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl max-w-2xl">
            Enterprise Sales & <span className="text-blue-600">Lead Management</span> System
          </h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto">
            A modern client relationship platform engineered using React 19 and Tailwind CSS. Track deals value, monitor funnels, and boost conversions.
          </p>
        </div>

        {/* Buttons CTA */}
        <div className="flex gap-4">
          <Link
            to="/login"
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 shadow-md transition-all"
          >
            Launch System Login
          </Link>
          <Link
            to="/register"
            className="rounded-lg border border-slate-350 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
          >
            Create New Account
          </Link>
        </div>

        {/* Features Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left w-full">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="p-2 w-fit rounded-lg bg-blue-50 text-blue-600 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Lead CRUD</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Create, update, search, and delete leads records with a single unified workspace.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="p-2 w-fit rounded-lg bg-indigo-50 text-indigo-600 mb-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Funnel Analytics</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Visualize sales pipelines, deal stages, and conversion ratios using dynamic charts.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="p-2 w-fit rounded-lg bg-green-50 text-green-600 mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Session Secure</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Maintains secure state scopes with automatic storage backups.
            </p>
          </div>
        </div>
      </main>

      {/* Footer MITS Branding */}
      <footer className="py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-400">
        <p>© 2026 Madanapalle Institute of Technology & Science. All rights reserved.</p>
        <p className="mt-1 text-slate-350 font-medium">B.Tech Computer Science & Engineering — N Ranjith (25695A0514)</p>
      </footer>
    </div>
  );
}
