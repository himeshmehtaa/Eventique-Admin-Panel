import type { OrderProductType } from '../types';

const TYPE_CONFIG: Record<OrderProductType, { label: string; bg: string; text: string; dot: string }> = {
  'Video Invites':   { label: 'Video Invites',   bg: '#FFF0F0', text: '#C0392B', dot: '#E74C3C' },
  'PDF Invites':     { label: 'PDF Invites',      bg: '#FFF5E0', text: '#B7770D', dot: '#F39C12' },
  'Event Websites':  { label: 'Event Websites',   bg: '#EEF2FF', text: '#3730A3', dot: '#6366F1' },
  'Printed Invites': { label: 'Printed Invites',  bg: '#F0FDF4', text: '#166534', dot: '#22C55E' },
  'Stationery':      { label: 'Stationery',       bg: '#FDF4FF', text: '#6B21A8', dot: '#A855F7' },
  'Gifts':           { label: 'Gifts',            bg: '#FFF0F9', text: '#9D174D', dot: '#EC4899' },
};

interface TypeBadgeProps {
  type: OrderProductType;
  size?: 'sm' | 'md';
}

export function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const config = TYPE_CONFIG[type] || { label: type, bg: '#f5f0e8', text: '#4a4a4a', dot: '#8B4949' };
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full whitespace-nowrap ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
      style={{ background: config.bg, color: config.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: config.dot }} />
      {config.label}
    </span>
  );
}
