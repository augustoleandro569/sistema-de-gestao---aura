import React from 'react';

export const SkeletonLoading: React.FC = () => {
  return (
    <div id="booking-skeleton-loading" className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE3DA]">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-[#EAE3DA] rounded-md"></div>
          <div className="h-8 w-64 bg-[#DFD6CB] rounded-lg"></div>
          <div className="h-4 w-80 bg-[#EAE3DA] rounded-md"></div>
        </div>
        <div className="h-10 w-36 bg-[#EAE3DA] rounded-xl"></div>
      </div>

      {/* Progress / Step bar skeleton */}
      <div className="grid grid-cols-3 gap-3">
        <div className="h-14 bg-[#FAF6F0] border border-[#EAE3DA] rounded-2xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EAE3DA]"></div>
          <div className="space-y-1.5 flex-1">
            <div className="h-3 w-16 bg-[#EAE3DA] rounded"></div>
            <div className="h-3 w-24 bg-[#DFD6CB] rounded"></div>
          </div>
        </div>
        <div className="h-14 bg-[#FAF6F0] border border-[#EAE3DA] rounded-2xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EAE3DA]"></div>
          <div className="space-y-1.5 flex-1">
            <div className="h-3 w-16 bg-[#EAE3DA] rounded"></div>
            <div className="h-3 w-24 bg-[#DFD6CB] rounded"></div>
          </div>
        </div>
        <div className="h-14 bg-[#FAF6F0] border border-[#EAE3DA] rounded-2xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EAE3DA]"></div>
          <div className="space-y-1.5 flex-1">
            <div className="h-3 w-16 bg-[#EAE3DA] rounded"></div>
            <div className="h-3 w-24 bg-[#DFD6CB] rounded"></div>
          </div>
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar / Date picker skeleton */}
        <div className="lg:col-span-8 bg-white border border-[#EAE3DA] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-36 bg-[#EAE3DA] rounded-md"></div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-[#EAE3DA] rounded-lg"></div>
              <div className="w-8 h-8 bg-[#EAE3DA] rounded-lg"></div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 pt-2">
            {[...Array(7)].map((_, i) => (
              <div key={`head-${i}`} className="h-6 bg-[#FAF6F0] rounded"></div>
            ))}
            {[...Array(28)].map((_, i) => (
              <div key={`cell-${i}`} className="h-14 bg-[#FAF8F5] border border-[#F2ECE4] rounded-xl"></div>
            ))}
          </div>

          {/* Time slot skeleton */}
          <div className="pt-4 border-t border-[#EAE3DA] space-y-3">
            <div className="h-4 w-40 bg-[#EAE3DA] rounded"></div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {[...Array(12)].map((_, i) => (
                <div key={`slot-${i}`} className="h-10 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Summary Skeleton */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#EAE3DA] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="h-5 w-32 bg-[#EAE3DA] rounded"></div>
            <div className="space-y-3 pt-2">
              <div className="h-16 bg-[#FAF8F5] rounded-2xl p-3 border border-[#EAE3DA]"></div>
              <div className="h-16 bg-[#FAF8F5] rounded-2xl p-3 border border-[#EAE3DA]"></div>
              <div className="h-16 bg-[#FAF8F5] rounded-2xl p-3 border border-[#EAE3DA]"></div>
            </div>
            <div className="pt-4 border-t border-[#EAE3DA] space-y-2">
              <div className="h-4 w-full bg-[#FAF8F5] rounded"></div>
              <div className="h-4 w-3/4 bg-[#FAF8F5] rounded"></div>
            </div>
            <div className="h-12 w-full bg-[#DFD6CB] rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
