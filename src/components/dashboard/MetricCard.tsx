import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  highlightColor?: string;
  badge?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  highlightColor = '#2D2725',
  badge,
  onClick,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE7DF] shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden ${
        onClick ? 'cursor-pointer hover:border-[#D9CEC2]' : ''
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8F8278] line-clamp-1">
          {title}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${highlightColor}15`, color: highlightColor }}
        >
          <Icon size={18} strokeWidth={2.1} />
        </div>
      </div>

      {/* Metric value */}
      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#2D2725] font-display">
          {value}
        </span>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0ED] text-[#B35848]">
            {badge}
          </span>
        )}
      </div>

      {/* Subtitle & Trend */}
      <div className="mt-2 flex items-center justify-between text-xs text-[#7A6E65]">
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
    </div>
  );
};
