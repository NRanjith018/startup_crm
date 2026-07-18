import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

/**
 * Login Component
 * Renders the Login page with database credentials validation.
 * Features:
 * - Real API-driven session authentication.
 * - Loading spinner buttons during request transfers.
 * - Dark mode class support.
 */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('ranjith.n@mits.ac.in');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Successfully signed in! Welcome back.');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email or password.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6 py-12 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl p-8 space-y-6 transition-colors duration-200">
        
        {/* Brand / Branding */}
        <div className="text-center space-y-1">
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            CRM<span className="text-blue-600 dark:text-blue-400">Lite</span>
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Sign In to your account</h2>
        </div>

        {/* Info panel showing developer credentials helper (Must register first in local db) */}
        <div className="rounded-lg bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-4 text-xs text-blue-800 dark:text-blue-450 dark:text-blue-400 space-y-1">
          <p className="font-semibold text-slate-900 dark:text-slate-205 dark:text-slate-200">Student Developer Details:</p>
          <p>Email: <span className="font-bold">ranjith.n@mits.ac.in</span></p>
          <p>Password: <span className="font-bold">password123</span></p>
          <p className="text-[10px] text-slate-500 pt-1">Note: If loading on a fresh database, please click "Register new profile" below first to initialize your account credentials.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/30 transition-colors"
              placeholder="name@company.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/30 transition-colors"
              placeholder="••••••••"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[44px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing In...
              </span>
            ) : (
              'Login to Workspace'
            )}
          </button>
        </form>

        {/* Redirection Links */}
        <div className="text-center text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Register new profile
          </Link>
        </div>
      </div>
    </div>
  );
}
