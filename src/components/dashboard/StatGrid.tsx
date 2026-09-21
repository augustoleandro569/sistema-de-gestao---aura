// src/components/dashboard/StatGrid.tsx
import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  highlightColor?: string;
  badge?: string;
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  highlightColor = '#2D2725',
  badge,
  onClick,
  className = '',
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-aesthetic-bege/70 shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-[#D9CEC2]' : ''
      } ${className}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8F8278] line-clamp-1">
          {title}
        </span>
        {Icon && (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${highlightColor}15`, color: highlightColor }}
          >
            <Icon size={18} strokeWidth={2.1} />
          </div>
        )}
      </div>

      {/* Metric value */}
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2D2725] font-display">
          {value}
        </span>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0ED] text-[#B35848]">
            {badge}
          </span>
        )}
      </div>

      {/* Subtitle & Trend */}
      {(subtitle || trend) && (
        <div className="mt-2.5 pt-2 border-t border-[#F5EFEB] flex items-center justify-between text-xs text-[#7A6E65]">
          {subtitle && <span className="truncate">{subtitle}</span>}
          {trend && (
            <span
              className={`flex items-center gap-1 font-semibold text-[11px] shrink-0 ml-auto ${
                trend.isPositive ? 'text-emerald-700' : 'text-[#B84E3A]'
              }`}
            >
              {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export interface StatGridProps {
  children: React.ReactNode;
  className?: string;
}

export const StatGrid: React.FC<StatGridProps> = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 ${className}`}>
      {children}
    </div>
  );
};

export default StatGrid;
