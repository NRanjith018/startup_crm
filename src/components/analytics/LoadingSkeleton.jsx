import React from 'react';

/**
 * LoadingSkeleton Component
 * Renders pulsing loading blocks to match the dashboard's layout during loads.
 */
export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 1. Header skeleton */}
      <div className="flex justify-between items-center pb-2">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-72 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="h-10 w-60 bg-slate-200 rounded-lg"></div>
      </div>

      {/* 2. KPI cards row skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <div className="h-4 w-20 bg-slate-200 rounded"></div>
            <div className="h-8 w-16 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* 3. Primary Charts skeletons */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-96 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="h-6 w-32 bg-slate-200 rounded"></div>
            <div className="h-72 w-full bg-slate-100 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* 4. Secondary Trend Skeletons */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-80 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="h-6 w-40 bg-slate-200 rounded"></div>
            <div className="h-56 w-full bg-slate-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
