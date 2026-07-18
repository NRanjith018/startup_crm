import React, { useState, useEffect } from 'react';
import { LEAD_STATUSES, LEAD_SOURCES } from '../../constants/leads';

/**
 * LeadForm Component
 * Provides a dynamic input layout supporting create and edit pipeline states.
 * Formulates structured input fields and validation alerts with dark mode support.
 * Pulls selection lists from centralized leads constants.
 *
 * @param {Object} props
 * @param {Object} props.initialData - Current record details if form is in edit state.
 * @param {Function} props.onSubmit - Submission callback returning raw lead form state.
 * @param {Function} props.onCancel - Discard/Cancel handler callback.
 */
export default function LeadForm({ initialData = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    source: 'Website',
  });

  const [errors, setErrors] = useState({});

  // Effect to load initial record data when updating
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        company: initialData.company || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        status: initialData.status || 'New',
        source: initialData.source || 'Website',
      });
    } else {
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        status: 'New',
        source: 'Website',
      });
    }
  }, [initialData]);

  // Handle keyboard/text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Proactively clear validation warnings
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Form submission and validation execution
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Standard field presence validations
    if (!formData.name.trim()) newErrors.name = 'Lead Name is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1">
          Lead Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${
            errors.name
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-950/40'
              : 'border-slate-300 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900/40'
          }`}
          placeholder="E.g., Sarah Jenkins"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
      </div>

      {/* Company Input */}
      <div>
        <label htmlFor="company" className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1">
          Company *
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${
            errors.company
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-950/40'
              : 'border-slate-300 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900/40'
          }`}
          placeholder="E.g., Acme Corp"
        />
        {errors.company && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.company}</p>}
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${
            errors.email
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-950/40'
              : 'border-slate-300 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900/40'
          }`}
          placeholder="e.g. sarah@acme.com"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
      </div>

      {/* Phone Input */}
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1">
          Phone Number
        </label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors"
          placeholder="E.g., +1 (555) 019-2834"
        />
      </div>

      {/* Status & Source split row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Status Select */}
        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors"
          >
            {LEAD_STATUSES.map((opt) => (
              <option key={opt} value={opt} className="dark:bg-slate-900">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Source Select */}
        <div>
          <label htmlFor="source" className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1">
            Source
          </label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors"
          >
            {LEAD_SOURCES.map((opt) => (
              <option key={opt} value={opt} className="dark:bg-slate-900">
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overlay modal action bottom bar */}
      <div className="flex justify-end gap-3 pt-5 mt-6 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[38px]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-colors cursor-pointer min-h-[38px]"
        >
          {initialData ? 'Save Changes' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
}
