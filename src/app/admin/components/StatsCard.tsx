import { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  color?: 'primary' | 'gold' | 'green' | 'blue';
  className?: string;
}

const colorMap = {
  primary: { bg: 'rgba(139,73,73,0.08)', icon: '#8B4949', border: 'rgba(139,73,73,0.15)' },
  gold:    { bg: 'rgba(212,175,55,0.1)',  icon: '#D4AF37', border: 'rgba(212,175,55,0.2)' },
  green:   { bg: 'rgba(74,124,89,0.08)',  icon: '#4A7C59', border: 'rgba(74,124,89,0.15)' },
  blue:    { bg: 'rgba(59,130,246,0.08)', icon: '#3B82F6', border: 'rgba(59,130,246,0.15)' },
};

export function StatsCard({ label, value, icon, trend, color = 'primary', className = '' }: StatsCardProps) {
  const c = colorMap[color];
  return (
    <div
      className={`admin-card hover:scale-[1.02] cursor-default h-full !p-3 sm:!p-4 xl:!p-5 ${className}`}
      style={{ borderColor: c.border }}
    >
      <div className="flex items-start justify-between gap-2 h-full">
        <div className="min-w-0 flex-1 flex flex-col justify-between h-full">
          <div>
            <p className="text-[9px] sm:text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5 truncate">{label}</p>
            <p className="text-base sm:text-xl lg:text-[14px] xl:text-[18px] 2xl:text-2xl font-bold text-[#1a1410] whitespace-nowrap" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
            </p>
          </div>
          {trend ? (
            <p className={`text-[9px] sm:text-xs mt-0.5 font-medium truncate ${trend.value >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          ) : (
            <p className="text-[9px] sm:text-xs mt-0.5 font-medium opacity-0 select-none">-</p>
          )}
        </div>
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 stats-icon-container"
          style={{ background: c.bg, color: c.icon }}
        >{icon}</div>
      </div>
    </div>
  );
}
