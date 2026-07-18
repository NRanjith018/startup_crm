import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFound Component
 * Displays a clean 404 error page for unresolved routes.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-50">Page Not Found</h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Sorry, we couldn't find the page you are looking for.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
      >
        Go back to Dashboard
      </Link>
    </div>
  );
}
