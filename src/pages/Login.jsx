import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

/**
 * Login Component
 * Renders the Login page with simulated credentials validation.
 */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Initial login state pre-filled with student developer details
  const [email, setEmail] = useState('devaraj.b@mits.ac.in');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password.');
      return;
    }

    const success = login(email, password);
    if (success) {
      toast.success('Successfully signed in! Welcome back.');
      navigate('/');
    } else {
      toast.error('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-xl p-8 space-y-6">
        
        {/* Brand/Branding */}
        <div className="text-center space-y-1">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            CRM<span className="text-blue-600">Lite</span>
          </span>
          <h2 className="text-xl font-extrabold text-slate-900">Sign In to your account</h2>
        </div>

        {/* Info panel showing developer credentials */}
        <div className="rounded-lg bg-blue-50/70 border border-blue-100 p-4 text-xs text-blue-800 space-y-1">
          <p className="font-semibold">Student Developer Credentials:</p>
          <p>Email: <span className="font-bold">devaraj.b@mits.ac.in</span></p>
          <p>Password: <span className="font-bold">password123</span></p>
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
              className="w-full rounded-lg border border-slate-350 px-3.5 py-2.5 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              required
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
              className="w-full rounded-lg border border-slate-350 px-3.5 py-2.5 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 shadow-md transition-all cursor-pointer"
          >
            Login to Workspace
          </button>
        </form>

        {/* Redirection Links */}
        <div className="text-center text-xs text-slate-400">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">
            Register new profile
          </Link>
        </div>
      </div>
    </div>
  );
}
