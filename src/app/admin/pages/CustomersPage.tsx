import { useState, useMemo } from 'react';
import { Search, X, Check, EyeOff, Trash2, Users, Star, ShoppingBag, TrendingUp, Reply, Sparkles, AlertCircle, UserCheck } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Customer, CustomerStatus, ReviewStatus } from '../types';

// ── Star Rating ───────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-base leading-none tracking-tight">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= rating ? '#D4AF37' : '#e0e0e0' }}>★</span>
      ))}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const hue = name.charCodeAt(0) % 360;
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      style={{ background: `linear-gradient(135deg, hsl(${hue},55%,40%), hsl(${(hue + 40) % 360},55%,55%))` }}
    >
      {initials}
    </div>
  );
}

// ── Summary Stat Card ─────────────────────────────────────────
function StatBox({ label, value, icon, iconColor }: { label: string; value: string | number; icon?: React.ReactNode; iconColor?: string }) {
  return (
    <div className="admin-card flex-1 min-w-[200px] flex items-center justify-between p-6">
      <div className="min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-bold">{label}</p>
        <p className="text-2xl font-black text-[#1a1410]">{value}</p>
      </div>
      {icon && (
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${iconColor || '#8B4949'}12`, color: iconColor || '#8B4949' }}
        >
          {icon}
        </div>
      )}
    </div>
  );
}

// ── Customer Drawer ───────────────────────────────────────────
interface DrawerProps {
  customer: Customer | null;
  onClose: () => void;
}

function CustomerDrawer({ customer, onClose }: DrawerProps) {
  const { state, updateCustomer } = useAdmin();

  if (!customer) return null;

  const orders = state.orders.filter((o) => o.customerId === customer.id);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col admin-animate-in overflow-hidden"
        style={{ borderRadius: '1rem 0 0 1rem' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f0f0]">
          <h3 className="font-bold text-[#1a1410] text-lg">Customer Detail</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto admin-scrollbar px-6 py-5 space-y-6">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <Avatar name={customer.name} />
            <div>
              <p className="font-semibold text-[#1a1410]">{customer.name}</p>
              <p className="text-xs text-gray-400">{customer.email}</p>
              <p className="text-xs text-gray-400">{customer.phone}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-[#faf8f5] rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Joined</p>
              <p className="font-medium text-[#1a1410]">
                {new Date(customer.joinedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-[#faf8f5] rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Status</p>
              <StatusBadge status={customer.status} size="sm" />
            </div>
            <div className="bg-[#faf8f5] rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Orders</p>
              <p className="font-bold text-[#8B4949] text-lg">{customer.ordersCount}</p>
            </div>
            <div className="bg-[#faf8f5] rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Total Spent</p>
              <p className="font-bold text-[#8B4949] text-lg">₹{customer.totalSpent.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Status Change */}
          <div>
            <label className="admin-label">Change Status</label>
            <select
              className="admin-select"
              value={customer.status}
              onChange={(e) => updateCustomer(customer.id, { status: e.target.value as CustomerStatus })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          {/* Recent Orders */}
          <div>
            <p className="admin-label mb-3">Recent Orders</p>
            {orders.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No orders yet</p>
            ) : (
              <div className="space-y-2">
                {orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between p-3 bg-[#faf8f5] rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-[#1a1410]">{o.productName}</p>
                      <p className="text-xs text-gray-400">{o.id} · {o.createdAt}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#8B4949]">₹{o.amount.toLocaleString('en-IN')}</p>
                      <StatusBadge status={o.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function CustomersPage() {
  const { state, updateReview, deleteReview } = useAdmin();
  const [activeTab, setActiveTab] = useState<'customers' | 'reviews'>('customers');

  // Customers tab state
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerStatus, setCustomerStatus] = useState<'All' | CustomerStatus>('All');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Reviews tab state
  const [reviewStatusFilter, setReviewStatusFilter] = useState<'All' | ReviewStatus>('All');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // ── Customer Stats ──────────────────────────────────────────
  const totalRevenue = state.customers.reduce((s, c) => s + c.totalSpent, 0);
  const totalOrders  = state.customers.reduce((s, c) => s + c.ordersCount, 0);
  const avgOrder     = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const activeCount  = state.customers.filter((c) => c.status === 'Active').length;

  // ── Review Stats ─────────────────────────────────────────────
  const avgRating = state.reviews.length
    ? (state.reviews.reduce((s, r) => s + r.rating, 0) / state.reviews.length).toFixed(1)
    : '0.0';
  const pendingCount  = state.reviews.filter((r) => r.status === 'Pending').length;
  const approvedCount = state.reviews.filter((r) => r.status === 'Approved').length;

  // ── Filtered Customers ────────────────────────────────────────
  const filteredCustomers = useMemo(() => {
    return state.customers.filter((c) => {
      const matchStatus = customerStatus === 'All' || c.status === customerStatus;
      const q = customerSearch.toLowerCase();
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
      return matchStatus && matchSearch;
    });
  }, [state.customers, customerSearch, customerStatus]);

  // ── Filtered Reviews ─────────────────────────────────────────
  const filteredReviews = useMemo(() => {
    return state.reviews.filter((r) => reviewStatusFilter === 'All' || r.status === reviewStatusFilter);
  }, [state.reviews, reviewStatusFilter]);

  const tabCls = (tab: string) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
      activeTab === tab
        ? 'bg-[#8B4949] text-white shadow-sm'
        : 'text-gray-500 hover:text-[#8B4949] hover:bg-[#f5f0e8]'
    }`;

  return (
    <div className="space-y-6 admin-animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1410]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Customers
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage customers & moderate reviews</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white border border-[#e5e5e5] rounded-xl p-1.5 w-fit">
        <button className={tabCls('customers')} onClick={() => setActiveTab('customers')}>
          <span className="flex items-center gap-2"><Users size={14} /> Customers</span>
        </button>
        <button className={tabCls('reviews')} onClick={() => setActiveTab('reviews')}>
          <span className="flex items-center gap-2"><Star size={14} /> Reviews & Ratings</span>
        </button>
      </div>

      {/* ── TAB 1: CUSTOMERS ─────────────────────────────────────── */}
      {activeTab === 'customers' && (
        <>
          {/* Summary Row */}
          <div className="flex gap-4 flex-wrap">
            <StatBox label="Total Customers" value={state.customers.length} icon={<Users size={22} />} iconColor="#8B4949" />
            <StatBox label="Active" value={activeCount} icon={<UserCheck size={22} />} iconColor="#4A7C59" />
            <StatBox label="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={<TrendingUp size={22} />} iconColor="#D4AF37" />
            <StatBox label="Avg Order Value" value={`₹${avgOrder.toLocaleString('en-IN')}`} icon={<ShoppingBag size={22} />} iconColor="#6366F1" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="admin-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search customers…"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
              />
            </div>

            {/* Customer Status Filter Sub-Tabs */}
            <div className="flex gap-1.5 bg-[#faf8f5] border border-[#e5e5e5] rounded-xl p-1 w-fit">
              {(['All', 'Active', 'Inactive', 'Blocked'] as const).map((status) => {
                const isActive = customerStatus === status;
                return (
                  <button
                    key={status}
                    onClick={() => setCustomerStatus(status)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#8B4949] text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-700 hover:bg-[#f5f0e8]/50'
                    }`}
                  >
                    {status === 'All' ? 'All Status' : status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="admin-card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-400">
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <Avatar name={c.name} />
                            <span className="font-medium text-[#1a1410]">{c.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="text-xs text-gray-400">{c.email}</span>
                        </td>
                        <td>{c.phone}</td>
                        <td>
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#f5f0e8] text-[#8B4949] text-xs font-bold">
                            {c.ordersCount}
                          </span>
                        </td>
                        <td>
                          <span className="font-bold text-[#1a1410]">₹{c.totalSpent.toLocaleString('en-IN')}</span>
                        </td>
                        <td>
                          <StatusBadge status={c.status} />
                        </td>
                        <td>
                          <button
                            className="admin-btn admin-btn-outline admin-btn-sm"
                            onClick={() => setSelectedCustomer(c)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── TAB 2: REVIEWS ───────────────────────────────────────── */}
      {activeTab === 'reviews' && (
        <>
          {/* Summary Row */}
          <div className="flex gap-4 flex-wrap">
            <StatBox label="Total Reviews" value={state.reviews.length} icon={<Star size={22} />} iconColor="#8B4949" />
            <StatBox label="Pending" value={pendingCount} icon={<AlertCircle size={22} />} iconColor="#D4AF37" />
            <StatBox label="Approved" value={approvedCount} icon={<Check size={22} />} iconColor="#4A7C59" />
            <StatBox label="Avg Rating" value={`${avgRating} ★`} icon={<Sparkles size={22} />} iconColor="#D4AF37" />
          </div>

          {/* Filters & Legend Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Status Filter Sub-Tabs */}
            <div className="flex gap-1.5 bg-[#faf8f5] border border-[#e5e5e5] rounded-xl p-1 w-fit">
              {(['All', 'Approved', 'Pending', 'Hidden'] as const).map((status) => {
                const isActive = reviewStatusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setReviewStatusFilter(status)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#8B4949] text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-700 hover:bg-[#f5f0e8]/50'
                    }`}
                  >
                    {status === 'All' ? 'All Status' : status}
                  </button>
                );
              })}
            </div>

            {/* Icon Legend / Guide */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-[#faf8f5]/80 border border-[#e5e5e5]/65 px-4 py-2 rounded-xl text-[11px] text-gray-500 font-medium select-none shadow-sm">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mr-1">Legend:</span>
              <span className="flex items-center gap-1.5 text-green-600"><Check size={13} className="stroke-[2.5]" /> Approve</span>
              <span className="flex items-center gap-1.5 text-blue-600"><Reply size={13} className="stroke-[2.5]" /> Reply</span>
              <span className="flex items-center gap-1.5 text-amber-500"><Sparkles size={13} className="stroke-[2.5]" /> Feature</span>
              <span className="flex items-center gap-1.5 text-orange-500"><EyeOff size={13} className="stroke-[2.5]" /> Hide</span>
              <span className="flex items-center gap-1.5 text-gray-500"><AlertCircle size={13} className="stroke-[2.5]" /> Investigate</span>
              <span className="flex items-center gap-1.5 text-red-500"><Trash2 size={13} className="stroke-[2.5]" /> Remove</span>
            </div>
          </div>

          {/* Table */}
          <div className="admin-card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Rating</th>
                    <th>Review</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-400">
                        No reviews found
                      </td>
                    </tr>
                  ) : (
                    filteredReviews.map((r) => (
                      <tr key={r.id}>
                        <td className="font-medium text-[#1a1410]">{r.customerName}</td>
                        <td className="text-sm text-gray-600 max-w-[140px] truncate">{r.productName}</td>
                        <td>
                          <StarRating rating={r.rating} />
                        </td>
                        <td className="text-sm text-gray-500 max-w-[200px]">
                          {r.text.length > 60 ? r.text.slice(0, 60) + '…' : r.text}
                        </td>
                        <td>
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="text-sm text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            {r.status === 'Pending' && (
                              <>
                                {/* Approve */}
                                <button
                                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-green-50 text-green-600 transition-colors cursor-pointer"
                                  title="Approve"
                                  onClick={() => {
                                    updateReview(r.id, { status: 'Approved' });
                                    alert('Review approved successfully!');
                                  }}
                                >
                                  <Check size={15} />
                                </button>
                                {/* Flag / Hide */}
                                <button
                                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-orange-50 text-orange-500 transition-colors cursor-pointer"
                                  title="Flag"
                                  onClick={() => {
                                    updateReview(r.id, { status: 'Hidden' });
                                    alert('Review flagged and hidden.');
                                  }}
                                >
                                  <EyeOff size={15} />
                                </button>
                                {/* Remove */}
                                <button
                                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                                  title="Remove"
                                  onClick={() => setDeleteTarget(r.id)}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </>
                            )}
                            {r.status === 'Approved' && (
                              <>
                                {/* Already Approved */}
                                <button
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 border border-green-200/50 transition-colors cursor-default"
                                  title="Approved"
                                  onClick={() => {
                                    alert('This review is already approved.');
                                  }}
                                >
                                  <Check size={15} />
                                </button>
                                {/* Reply */}
                                <button
                                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-600 transition-colors cursor-pointer"
                                  title="Reply"
                                  onClick={() => {
                                    const reply = prompt(`Reply to ${r.customerName}'s review of ${r.productName}:`);
                                    if (reply && reply.trim() !== '') {
                                      alert('Reply submitted successfully!');
                                    }
                                  }}
                                >
                                  <Reply size={15} />
                                </button>
                                {/* Feature */}
                                <button
                                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-50 text-amber-500 transition-colors cursor-pointer"
                                  title="Feature"
                                  onClick={() => {
                                    alert('Review featured on homepage!');
                                  }}
                                >
                                  <Sparkles size={15} />
                                </button>
                                {/* Hide */}
                                <button
                                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-orange-50 text-orange-500 transition-colors cursor-pointer"
                                  title="Hide"
                                  onClick={() => {
                                    updateReview(r.id, { status: 'Hidden' });
                                    alert('Review hidden successfully.');
                                  }}
                                >
                                  <EyeOff size={15} />
                                </button>
                                {/* Remove */}
                                <button
                                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                                  title="Remove"
                                  onClick={() => setDeleteTarget(r.id)}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </>
                            )}
                            {r.status === 'Hidden' && (
                              <>
                                {/* Investigate */}
                                <button
                                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
                                  title="Investigate"
                                  onClick={() => {
                                    alert('Investigation details logged for this review.');
                                  }}
                                >
                                  <AlertCircle size={15} />
                                </button>
                                {/* Approve */}
                                <button
                                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-green-50 text-green-600 transition-colors cursor-pointer"
                                  title="Approve"
                                  onClick={() => {
                                    updateReview(r.id, { status: 'Approved' });
                                    alert('Review approved successfully!');
                                  }}
                                >
                                  <Check size={15} />
                                </button>
                                {/* Remove */}
                                <button
                                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                                  title="Remove"
                                  onClick={() => setDeleteTarget(r.id)}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Customer Drawer */}
      <CustomerDrawer
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Review"
        message="This review will be permanently removed. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteTarget) deleteReview(deleteTarget);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
    </div>
  );
}
