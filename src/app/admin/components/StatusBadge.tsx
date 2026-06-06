type StatusVariant = 
  | 'Processing' | 'Completed' | 'Shipped' | 'Cancelled' | 'Refunded'
  | 'Paid' | 'Pending' | 'Failed'
  | 'Active' | 'Paused' | 'Expired'
  | 'Approved' | 'Hidden'
  | 'Published' | 'Draft'
  | 'Success';

const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  // Order
  Processing:  { bg: '#FFF5E0', text: '#B7770D' },
  Completed:   { bg: '#F0FDF4', text: '#166534' },
  Shipped:     { bg: '#EEF2FF', text: '#3730A3' },
  Cancelled:   { bg: '#FFF0F0', text: '#C0392B' },
  Refunded:    { bg: '#F5F5F5', text: '#6B7280' },
  // Payment
  Paid:        { bg: '#F0FDF4', text: '#166534' },
  Success:     { bg: '#F0FDF4', text: '#166534' },
  Pending:     { bg: '#FFF5E0', text: '#B7770D' },
  Failed:      { bg: '#FFF0F0', text: '#C0392B' },
  // Promotion
  Active:      { bg: '#F0FDF4', text: '#166534' },
  Paused:      { bg: '#FFF5E0', text: '#B7770D' },
  Expired:     { bg: '#F5F5F5', text: '#6B7280' },
  // Review
  Approved:    { bg: '#F0FDF4', text: '#166534' },
  Hidden:      { bg: '#F5F5F5', text: '#6B7280' },
  // Product
  Published:   { bg: '#F0FDF4', text: '#166534' },
  Draft:       { bg: '#FFF5E0', text: '#B7770D' },
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { bg: '#f5f0e8', text: '#4a4a4a' };
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full whitespace-nowrap ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
      style={{ background: config.bg, color: config.text }}
    >
      {status}
    </span>
  );
}
