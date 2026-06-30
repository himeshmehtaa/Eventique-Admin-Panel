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
  // Client & B2B Leads
  New:               { bg: '#EFF6FF', text: '#1D4ED8' },
  Contacted:         { bg: '#F5F3FF', text: '#6D28D9' },
  'Follow-up':       { bg: '#FFF7ED', text: '#C2410C' },
  Converted:         { bg: '#F0FDF4', text: '#166534' },
  Lost:              { bg: '#FEF2F2', text: '#DC2626' },
  // Corporate Lead / Order statuses
  'Proposal Sent':   { bg: '#F0FDFA', text: '#0F766E' },
  Negotiation:       { bg: '#EEF2FF', text: '#4338CA' },
  Planning:          { bg: '#EFF6FF', text: '#1D4ED8' },
  Sourcing:          { bg: '#FFFBEB', text: '#B45309' },
  Printing:          { bg: '#FDF2F8', text: '#BE185D' },
  Packaging:         { bg: '#FFF7ED', text: '#C2410C' },
  Dispatched:        { bg: '#F5F3FF', text: '#6D28D9' },
  Delivered:         { bg: '#F0FDF4', text: '#166534' },
  // Vendor / Planner statuses
  Deal:              { bg: '#FFFBEB', text: '#B45309' },
  Closed:            { bg: '#F0FDF4', text: '#166534' },
  Prospect:          { bg: '#FFFBEB', text: '#B45309' },
  'Active Partnership': { bg: '#F0FDF4', text: '#166534' },
  Inactive:          { bg: '#F3F4F6', text: '#4B5563' }
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
