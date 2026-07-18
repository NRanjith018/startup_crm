import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

/**
 * Register Component
 * Renders the registration form to create a new session profile.
 */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: 'Bhojanapu Devaraj',
    email: 'devaraj.b@mits.ac.in',
    company: 'MITS Enterprise Group',
    registerNo: '25695A0514',
    password: 'password123',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Name, email, and password are required fields.');
      return;
    }

    const success = register(formData);
    if (success) {
      toast.success('Registration successful! Session loaded.');
      navigate('/');
    } else {
      toast.error('Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            CRM<span className="text-blue-600">Lite</span>
          </span>
          <h2 className="text-xl font-extrabold text-slate-900">Create your account</h2>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-350 px-3.5 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-350 px-3.5 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="company" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-350 px-3.5 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="registerNo" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Register Number
              </label>
              <input
                type="text"
                id="registerNo"
                name="registerNo"
                value={formData.registerNo}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-350 px-3.5 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-350 px-3.5 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 shadow-md transition-all cursor-pointer"
          >
            Register Profile
          </button>
        </form>

        {/* Redirect */}
        <div className="text-center text-xs text-slate-400">
          <span>Already have an account? </span>
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
