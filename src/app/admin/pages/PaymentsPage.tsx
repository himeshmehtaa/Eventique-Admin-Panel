import { useState, useMemo } from 'react';
import {
  Search, Download, IndianRupee, Clock, XCircle, RefreshCw,
  CreditCard, Filter,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { StatusBadge } from '../components/StatusBadge';
import type { Payment, PaymentStatus, PaymentMethod } from '../types';

// ── Helpers ──────────────────────────────────────────────────
function formatAmount(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ── Method Badge ─────────────────────────────────────────────
const METHOD_CONFIG: Record<PaymentMethod, { bg: string; text: string; label: string }> = {
  Razorpay: { bg: '#EDE9FE', text: '#5B21B6', label: 'Razorpay' },
  UPI:      { bg: '#DBEAFE', text: '#1D4ED8', label: 'UPI'       },
  Card:     { bg: '#E0E7FF', text: '#3730A3', label: 'Card'      },
  Manual:   { bg: '#F3F4F6', text: '#374151', label: 'Manual'    },
};

function MethodBadge({ method }: { method: PaymentMethod }) {
  const cfg = METHOD_CONFIG[method] || { bg: '#f5f0e8', text: '#4a4a4a', label: method };
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </span>
  );
}

// ── Summary Cards ─────────────────────────────────────────────
function SummaryCards({ payments }: { payments: Payment[] }) {
  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);
  const refunded = payments.filter(p => p.status === 'Refunded').length;
  const failed = payments.filter(p => p.status === 'Failed').length;

  const cards = [
    {
      label: 'Total Revenue',
      value: formatAmount(totalRevenue),
      icon: <IndianRupee size={18} />,
      color: '#166534',
      iconBg: 'rgba(22,101,52,0.10)',
      cardBg: '#F0FDF4',
    },
    {
      label: 'Pending',
      value: formatAmount(pending),
      icon: <Clock size={18} />,
      color: '#B7770D',
      iconBg: 'rgba(183,119,13,0.10)',
      cardBg: '#FFF5E0',
    },
    {
      label: 'Refunded',
      value: refunded,
      icon: <RefreshCw size={18} />,
      color: '#6B7280',
      iconBg: 'rgba(107,114,128,0.10)',
      cardBg: '#F9FAFB',
    },
    {
      label: 'Failed',
      value: failed,
      icon: <XCircle size={18} />,
      color: '#C0392B',
      iconBg: 'rgba(192,57,43,0.10)',
      cardBg: '#FFF0F0',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="admin-card flex items-center gap-4"
          style={{ background: c.cardBg }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: c.iconBg, color: c.color }}
          >
            {c.icon}
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{c.label}</p>
            <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const show = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 2500);
  };
  return { msg, show };
}

// ── Main Page ─────────────────────────────────────────────────
const STATUS_OPTIONS: (PaymentStatus | 'All')[] = ['All', 'Paid', 'Pending', 'Failed', 'Refunded'];
const METHOD_OPTIONS: (PaymentMethod | 'All')[] = ['All', 'Razorpay', 'UPI', 'Card', 'Manual'];

export default function PaymentsPage() {
  const { state } = useAdmin();
  const { payments } = state;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'All'>('All');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'All'>('All');

  const { msg: toastMsg, show: showToast } = useToast();

  // ── Filter ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return payments.filter((p) => {
      const matchSearch =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.orderId.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchMethod = methodFilter === 'All' || p.method === methodFilter;

      return matchSearch && matchStatus && matchMethod;
    });
  }, [payments, search, statusFilter, methodFilter]);

  const handleDownloadInvoice = (p: Payment) => {
    showToast(`Invoice for ${p.id} downloaded`);
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast */}
      {toastMsg && (
        <div
          className="fixed top-6 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium admin-scale-in"
          style={{ background: '#1a1410', color: '#fff', minWidth: 220 }}
        >
          <Download size={14} className="text-[#D4AF37]" />
          {toastMsg}
        </div>
      )}

      {/* Summary */}
      <SummaryCards payments={payments} />

      {/* Filter Bar */}
      <div className="admin-card p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Payment ID, Order, Customer…"
              className="admin-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Filter size={14} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'All')}
              className="admin-select"
              style={{ minWidth: 130 }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
              ))}
            </select>
          </div>

          {/* Method Filter */}
          <div className="flex-shrink-0">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as PaymentMethod | 'All')}
              className="admin-select"
              style={{ minWidth: 130 }}
            >
              {METHOD_OPTIONS.map((m) => (
                <option key={m} value={m}>{m === 'All' ? 'All Methods' : m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count */}
        {(search || statusFilter !== 'All' || methodFilter !== 'All') && (
          <p className="text-xs text-gray-400 mt-2">
            {filtered.length} of {payments.length} payments
          </p>
        )}
      </div>

      {/* Table */}
      <div className="admin-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ width: 72 }}>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="admin-empty">
                      <CreditCard size={32} />
                      <p className="mt-2 font-medium text-gray-500">No payments found</p>
                      <p className="text-xs mt-1">Try adjusting filters or search terms.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    {/* Payment ID */}
                    <td className="whitespace-nowrap">
                      <span className="text-xs text-gray-400 font-mono">{p.id}</span>
                    </td>

                    {/* Order ID */}
                    <td className="whitespace-nowrap">
                      <span
                        className="text-sm font-medium cursor-pointer hover:underline"
                        style={{ color: '#8B4949' }}
                        title={`View order ${p.orderId}`}
                      >
                        #{p.orderId}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="whitespace-nowrap">
                      <span className="text-sm text-[#1a1410]">{p.customerName}</span>
                    </td>

                    {/* Amount */}
                    <td className="whitespace-nowrap">
                      <span className="font-bold text-sm" style={{ color: '#8B4949' }}>
                        {formatAmount(p.amount)}
                      </span>
                    </td>

                    {/* Method */}
                    <td className="whitespace-nowrap">
                      <MethodBadge method={p.method} />
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap">
                      <StatusBadge status={p.status} size="sm" />
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap">
                      <span className="text-sm text-gray-500">{formatDate(p.date)}</span>
                    </td>

                    {/* Invoice */}
                    <td className="whitespace-nowrap">
                      <button
                        onClick={() => handleDownloadInvoice(p)}
                        title="Download Invoice"
                        className="admin-btn admin-btn-ghost admin-btn-icon text-[#8B4949] hover:bg-[#f5f0e8]"
                      >
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer row */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-[#f0f0f0] flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {filtered.length} record{filtered.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs font-semibold text-[#8B4949]">
              Total shown: {formatAmount(filtered.reduce((s, p) => s + p.amount, 0))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
