import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  ShoppingBag, Upload, ClipboardList, Tag, FileEdit, Users,
  CreditCard, Image, IndianRupee, Package, UserCheck, ArrowRight,
  ExternalLink, TrendingUp, Award, BarChart3, Factory, Coins,
  TrendingDown, Calendar, Sparkles, FolderEdit, Rocket, BookOpen
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { StatsCard } from '../components/StatsCard';
import { StatusBadge } from '../components/StatusBadge';
import { TypeBadge } from '../components/TypeBadge';
import type { OrderProductType } from '../types';

// ── Order status dot colors ──────────────────────────────────
const STATUS_DOTS: Record<string, string> = {
  Processing: '#F39C12',
  Completed:  '#22C55E',
  Shipped:    '#6366F1',
  Cancelled:  '#E74C3C',
  Refunded:   '#9CA3AF',
};

// ── Payment status dot colors ─────────────────────────────────
const PAY_DOTS: Record<string, string> = {
  Paid:     '#22C55E',
  Pending:  '#F39C12',
  Refunded: '#9CA3AF',
  Failed:   '#E74C3C',
};

// ── Type color map for revenue segments and legend dots ───────
const TYPE_COLORS: Record<string, string> = {
  'Video Invites':   '#8B4949', // burgundy
  'PDF Invites':     '#D4AF37', // gold
  'Event Websites':  '#6366F1', // indigo
  'Printed Invites': '#4A7C59', // forest green
  'Stationery':      '#A855F7', // purple
  'Gifts':           '#EC4899', // pink
};

const QUICK_ACTIONS = [
  { label: 'Add Product',     icon: ShoppingBag,   to: '/admin/products',    color: '#8B4949', permission: 'products' },
  { label: 'Upload Files',    icon: Upload,         to: '/admin/orders',      color: '#6366F1', permission: 'upload_files' },
  { label: 'Add Order',       icon: ClipboardList,  to: '/admin/orders',      color: '#D4AF37', permission: 'orders' },
  { label: 'Create Promo',    icon: Tag,            to: '/admin/promotions',  color: '#4A7C59', permission: 'promotions' },
  { label: 'Edit Contents',   icon: FileEdit,       to: '/admin/contents',    color: '#EC4899', permission: 'contents' },
  { label: 'View Customers',  icon: Users,          to: '/admin/customers',   color: '#F59E0B', permission: 'customers' },
  { label: 'Payments',        icon: CreditCard,     to: '/admin/payments',    color: '#14B8A6', permission: 'payments' },
  { label: 'Media Library',   icon: Image,          to: '/admin/settings?tab=utilities&sub=media', color: '#8B4949', permission: 'settings' },
];

export default function Dashboard() {
  const { state, hasPermission, currentUser } = useAdmin();
  const [dashboardTab, setDashboardTab] = useState<'orders' | 'leads'>('orders');

  // Find user's role name
  const userRole = currentUser ? state.roles.find(r => r.id === currentUser.roleId) : null;
  const roleName = userRole ? userRole.name : 'Administrator';

  // ── Order status donut details ──────────────────────────────
  const orderStatusDetails = useMemo(() => {
    const total = state.orders.length;
    const counts = {
      Completed: state.orders.filter(o => o.status === 'Completed').length,
      Processing: state.orders.filter(o => o.status === 'Processing').length,
      Shipped: state.orders.filter(o => o.status === 'Shipped').length,
      Cancelled: state.orders.filter(o => o.status === 'Cancelled').length,
    };

    // Calculate percentages
    const pct = {
      Completed: total > 0 ? Math.round((counts.Completed / total) * 100) : 0,
      Processing: total > 0 ? Math.round((counts.Processing / total) * 100) : 0,
      Shipped: total > 0 ? Math.round((counts.Shipped / total) * 100) : 0,
      Cancelled: total > 0 ? Math.round((counts.Cancelled / total) * 100) : 0,
    };

    const segments = [];
    let accumulated = 0;
    if (counts.Completed > 0) {
      const next = accumulated + (counts.Completed / total) * 100;
      segments.push(`#22C55E ${accumulated.toFixed(1)}% ${next.toFixed(1)}%`);
      accumulated = next;
    }
    if (counts.Processing > 0) {
      const next = accumulated + (counts.Processing / total) * 100;
      segments.push(`#F39C12 ${accumulated.toFixed(1)}% ${next.toFixed(1)}%`);
      accumulated = next;
    }
    if (counts.Shipped > 0) {
      const next = accumulated + (counts.Shipped / total) * 100;
      segments.push(`#6366F1 ${accumulated.toFixed(1)}% ${next.toFixed(1)}%`);
      accumulated = next;
    }
    if (counts.Cancelled > 0) {
      const next = Math.min(accumulated + (counts.Cancelled / total) * 100, 100);
      segments.push(`#E74C3C ${accumulated.toFixed(1)}% ${next.toFixed(1)}%`);
      accumulated = next;
    }

    if (segments.length === 0) {
      segments.push('#f5f0e8 0% 100%');
    } else if (accumulated < 100) {
      segments.push(`#f5f0e8 ${accumulated.toFixed(1)}% 100%`);
    }

    const gradientString = `conic-gradient(${segments.join(', ')})`;

    return { counts, pct, gradientString };
  }, [state.orders]);

  // ── Summary stats ──────────────────────────────────────────
  const totalRevenue = state.payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalExpenses = (state.expenses || [])
    .filter((e) => e.status === 'Paid')
    .reduce((sum, e) => sum + e.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  // ── Order overview counts ──────────────────────────────────
  const orderStatusCounts = state.orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  // ── Payment overview counts ────────────────────────────────
  const payStatusCounts = state.orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.paymentStatus] = (acc[o.paymentStatus] || 0) + 1;
    return acc;
  }, {});

  // ── Payment Success Rate calculations ──────────────────────
  const paidCount = payStatusCounts['Paid'] || 0;
  const totalPayCount = Object.values(payStatusCounts).reduce((a, b) => a + b, 0);
  const successRate = totalPayCount > 0 ? Math.round((paidCount / totalPayCount) * 100) : 0;

  // ── Payment method counts ──────────────────────────────────
  const payMethodCounts = useMemo(() => {
    return state.payments.reduce<Record<string, number>>((acc, p) => {
      acc[p.method] = (acc[p.method] || 0) + 1;
      return acc;
    }, {});
  }, [state.payments]);

  // ── Promotion overview ─────────────────────────────────────
  const activePromos   = state.promotions.filter((p) => p.status === 'Active').length;
  const expiredPromos  = state.promotions.filter((p) => p.status === 'Expired').length;
  const totalUsage     = state.promotions.reduce((s, p) => s + p.usageCount, 0);

  // ── Top active promotions (up to 2) ────────────────────────
  const topPromos = useMemo(() => {
    return state.promotions
      .filter((p) => p.status === 'Active')
      .slice(0, 2);
  }, [state.promotions]);

  // ── Recent orders (last 6) ─────────────────────────────────
  const recentOrders = [...state.orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  // ── Recent client leads (last 6) ───────────────────────────
  const recentLeads = useMemo(() => {
    return [...(state.clientLeads || [])]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6);
  }, [state.clientLeads]);

  // ── Calculate top selling products ─────────────────────────
  const topProducts = useMemo(() => {
    const metrics: Record<string, { name: string; type: string; orders: number; revenue: number; imageUrl?: string }> = {};
    state.orders.forEach((o) => {
      if (o.status !== 'Cancelled') {
        if (!metrics[o.productName]) {
          const productInfo = state.products.find((p) => p.name === o.productName);
          metrics[o.productName] = { 
            name: o.productName, 
            type: o.productType, 
            orders: 0, 
            revenue: 0,
            imageUrl: productInfo?.imageUrl
          };
        }
        metrics[o.productName].orders += 1;
        metrics[o.productName].revenue += o.amount;
      }
    });
    return Object.values(metrics)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4);
  }, [state.orders, state.products]);

  // ── Calculate category revenue metrics ─────────────────────
  const categoryMetrics = useMemo(() => {
    const metrics: Record<string, { type: string; revenue: number; orders: number }> = {};
    const categories = ['Video Invites', 'PDF Invites', 'Event Websites', 'Printed Invites', 'Stationery', 'Gifts'];
    categories.forEach((c) => {
      metrics[c] = { type: c, revenue: 0, orders: 0 };
    });

    let totalPaidRevenue = 0;
    state.orders.forEach((o) => {
      if (o.status !== 'Cancelled') {
        totalPaidRevenue += o.amount;
        if (metrics[o.productType]) {
          metrics[o.productType].revenue += o.amount;
          metrics[o.productType].orders += 1;
        } else {
          metrics[o.productType] = { type: o.productType, revenue: o.amount, orders: 1 };
        }
      }
    });

    return Object.values(metrics)
      .map((m) => ({
        ...m,
        share: totalPaidRevenue > 0 ? Math.round((m.revenue / totalPaidRevenue) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [state.orders]);

  // Determine if user has any financial or business analytics access
  const hasFinancialAccess = hasPermission('payments') || hasPermission('finance');
  const hasOrdersAccess = hasPermission('orders');
  const hasCustomersAccess = hasPermission('customers');
  const hasProductsAccess = hasPermission('products');
  const hasPromotionsAccess = hasPermission('promotions');

  // Compute active summary cards
  const summaryCards = useMemo(() => {
    const cards = [];
    if (hasFinancialAccess) {
      cards.push(
        <StatsCard
          key="revenue"
          label="Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          icon={<IndianRupee size={18} />}
          color="primary"
          trend={{ value: 12, label: 'vs last month' }}
        />
      );
    }
    if (hasPermission('finance')) {
      cards.push(
        <StatsCard
          key="expenses"
          label="Expenses"
          value={`₹${totalExpenses.toLocaleString('en-IN')}`}
          icon={<TrendingDown size={18} />}
          color="blue"
        />
      );
    }
    if (hasPermission('finance') && hasPermission('payments')) {
      cards.push(
        <StatsCard
          key="netprofit"
          label="Net Profit"
          value={`₹${netProfit.toLocaleString('en-IN')}`}
          icon={<TrendingUp size={18} />}
          color="green"
        />
      );
    }
    if (hasOrdersAccess) {
      cards.push(
        <StatsCard
          key="orders"
          label="Orders"
          value={state.orders.length}
          icon={<ClipboardList size={18} />}
          color="gold"
          trend={{ value: 8, label: 'this month' }}
        />
      );
    }
    if (hasCustomersAccess) {
      cards.push(
        <StatsCard
          key="customers"
          label="Customers"
          value={state.customers.length}
          icon={<UserCheck size={18} />}
          color="primary"
          trend={{ value: 5, label: 'new this week' }}
        />
      );
    }
    if (hasProductsAccess) {
      cards.push(
        <StatsCard
          key="products"
          label="Products"
          value={state.products.length}
          icon={<Package size={18} />}
          color="blue"
        />
      );
    }
    return cards;
  }, [hasFinancialAccess, hasPermission, hasOrdersAccess, hasCustomersAccess, hasProductsAccess, totalRevenue, totalExpenses, netProfit, state.orders.length, state.customers.length, state.products.length]);

  const summaryGridClass = useMemo(() => {
    const count = summaryCards.length;
    if (count === 1) return 'grid-cols-1 max-w-sm';
    if (count === 2) return 'grid-cols-2 max-w-2xl';
    if (count === 3) return 'grid-cols-2 md:grid-cols-3 max-w-4xl';
    if (count === 4) return 'grid-cols-2 lg:grid-cols-4';
    if (count === 5) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6';
  }, [summaryCards.length]);

  // Filter actions based on permissions
  const visibleActions = useMemo(() => {
    return QUICK_ACTIONS.filter(act => hasPermission(act.permission as any));
  }, [hasPermission]);

  const quickActionsGridClass = useMemo(() => {
    const len = visibleActions.length;
    if (len === 1) return 'grid-cols-1 max-w-xs';
    if (len === 2) return 'grid-cols-2 max-w-md';
    if (len === 3) return 'grid-cols-3 max-w-2xl';
    if (len === 4) return 'grid-cols-2 sm:grid-cols-4 max-w-4xl';
    if (len === 5) return 'grid-cols-2 sm:grid-cols-5 max-w-5xl';
    if (len === 6) return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6';
    if (len === 7) return 'grid-cols-2 sm:grid-cols-4 md:grid-cols-7';
    return 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-8';
  }, [visibleActions.length]);

  const activeOverviewCount = useMemo(() => {
    return [
      hasOrdersAccess,
      hasFinancialAccess,
      hasPromotionsAccess
    ].filter(Boolean).length;
  }, [hasOrdersAccess, hasFinancialAccess, hasPromotionsAccess]);

  const overviewGridClass = useMemo(() => {
    if (activeOverviewCount === 1) return 'grid-cols-1 max-w-md';
    if (activeOverviewCount === 2) return 'grid-cols-1 md:grid-cols-2 max-w-4xl';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  }, [activeOverviewCount]);

  const renderedWorkspaceLinks = useMemo(() => {
    const links = [];
    if (hasPermission('contents')) {
      links.push(
        <Link key="sections" to="/admin/contents" className="p-4 bg-[#faf8f5] border border-[#f0ece4] rounded-2xl hover:border-[#8B4949]/30 transition-all flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#8B4949]/10 text-[#8B4949] flex items-center justify-center flex-shrink-0">
            <FolderEdit size={16} />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-[#1a1410]">Website Sections</p>
            <p className="text-[10px] text-gray-400">Edit banners & lists</p>
          </div>
        </Link>
      );
      links.push(
        <Link key="launch" to="/admin/contents" className="p-4 bg-[#faf8f5] border border-[#f0ece4] rounded-2xl hover:border-[#8B4949]/30 transition-all flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center flex-shrink-0">
            <Rocket size={16} />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-[#1a1410]">Launch Pages</p>
            <p className="text-[10px] text-gray-400">Build new campaigns</p>
          </div>
        </Link>
      );
      links.push(
        <Link key="blog" to="/admin/contents" className="p-4 bg-[#faf8f5] border border-[#f0ece4] rounded-2xl hover:border-[#8B4949]/30 transition-all flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center flex-shrink-0">
            <BookOpen size={16} />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-[#1a1410]">Blog Articles</p>
            <p className="text-[10px] text-gray-400">Write design feeds</p>
          </div>
        </Link>
      );
    }
    return links;
  }, [hasPermission]);

  return (
    <div className="space-y-8 admin-animate-in">

      {/* ── Welcome Banner ─────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl p-6"
        style={{ background: 'linear-gradient(135deg, #1a1410 0%, #2d1f1a 60%, #3d2a20 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)', transform: 'translate(30%,-30%)' }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase mb-1">Welcome back</p>
            <h2
              className="text-white text-2xl font-bold mb-1"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {currentUser ? currentUser.name : 'Eventique Admin'}
            </h2>
            <p className="text-white/40 text-sm">Role assigned: <span className="text-[#D4AF37] font-semibold">{roleName}</span></p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 self-start sm:self-auto"
            style={{ background: '#D4AF37', color: '#1a1410' }}
          >
            <ExternalLink size={13} /> Live Site
          </a>
        </div>
      </div>

      {/* ── Summary Cards (Filtered by permission) ──────────────────────────────────── */}
      {summaryCards.length > 0 && (
        <div className={`grid ${summaryGridClass} gap-4`}>
          {summaryCards}
        </div>
      )}

      {/* Fallback Welcome Workspace Card for Creators (Designer / Editors) */}
      {!hasFinancialAccess && !hasOrdersAccess && (
        <div className="bg-white border border-[#f0ece4] rounded-3xl p-8 shadow-[0_20px_50px_rgba(26,20,16,0.02)] relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#8B4949] via-[#D4AF37] to-[#8B4949]"></div>
          <div className="max-w-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#8B4949]/5 flex items-center justify-center text-[#8B4949]">
              <Sparkles size={22} className="animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-[#1a1410] tracking-tight">Your Creative Studio Workspace</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-light">
              Welcome to the studio content editor portal. Depending on your team role, you have permissions to manage products, customize homepage blocks, write articles, or design product launch campaign pages.
            </p>
            {renderedWorkspaceLinks.length > 0 && (
              <div className={`grid gap-3 pt-2 ${
                renderedWorkspaceLinks.length === 1 ? 'grid-cols-1 max-w-sm' :
                renderedWorkspaceLinks.length === 2 ? 'grid-cols-2 max-w-xl' :
                'grid-cols-1 sm:grid-cols-3'
              }`}>
                {renderedWorkspaceLinks}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Quick Actions (Filtered by permission) ─────────────────────────────────── */}
      {visibleActions.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</h3>
          <div className={`grid ${quickActionsGridClass} gap-4`}>
            {visibleActions.map(({ label, icon: Icon, to, color }) => (
              <Link
                key={label}
                to={to}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white border border-[#e9e5de] hover:border-[#8B4949]/30 transition-all hover:scale-105 hover:shadow-md group"
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors group-hover:scale-110 duration-300"
                  style={{ backgroundColor: `${color}12`, color: color }}
                >
                  <Icon size={18} />
                </div>
                <span className="text-[11px] font-semibold text-[#1a1410]/80 group-hover:text-[#8B4949] transition-colors">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Mini Overview Row (Filtered by permission) ───────────────────────────────── */}
      {(hasOrdersAccess || hasFinancialAccess || hasPromotionsAccess) && (
        <div className={`grid ${overviewGridClass} gap-4`}>
          {/* Order Status Donut Chart Card */}
          {hasOrdersAccess && (
            <div className="admin-card flex flex-col justify-between h-full">
              <div>
                <div className="admin-card-header">
                  <h3 className="font-bold text-[#1a1410] text-xs uppercase tracking-widest">Order Status</h3>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faf8f5] border border-[#ede9e1] text-[10px] font-bold text-gray-500">
                    <Calendar size={13} className="text-gray-400" />
                    <span>{new Date().toLocaleDateString('en-IN', { month: 'short' })} - {new Date().getFullYear()}</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-extrabold text-[#1a1410] tracking-tight">{state.orders.length}</span>
                  <span className="text-xs font-semibold text-gray-400">Total Orders</span>
                </div>

                <div className="relative w-36 h-36 rounded-full flex items-center justify-center mx-auto my-6 shadow-inner"
                     style={{ background: orderStatusDetails.gradientString }}
                >
                  <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center shadow-md">
                    <span className="text-2xl font-black text-[#1a1410]">{state.orders.length}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Orders</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { status: 'Completed', count: orderStatusDetails.counts.Completed || 0, pct: orderStatusDetails.pct.Completed || 0, dot: '#22C55E' },
                  { status: 'Processing', count: orderStatusDetails.counts.Processing || 0, pct: orderStatusDetails.pct.Processing || 0, dot: '#F39C12' },
                  { status: 'Shipped', count: orderStatusDetails.counts.Shipped || 0, pct: orderStatusDetails.pct.Shipped || 0, dot: '#6366F1' },
                  { status: 'Cancelled', count: orderStatusDetails.counts.Cancelled || 0, pct: orderStatusDetails.pct.Cancelled || 0, dot: '#E74C3C' },
                ].map((item) => (
                  <div key={item.status} className="flex items-center justify-between px-3 py-2 rounded-full bg-[#faf8f5] border border-[#ede9e1] text-[11px] font-medium">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.dot }} />
                      <span className="font-semibold text-gray-600 truncate">{item.status}</span>
                    </div>
                    <span className="font-extrabold text-[#1a1410] ml-2 flex-shrink-0">
                      {item.count} <span className="text-[9px] font-bold text-gray-400">({item.pct}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Overview */}
          {hasFinancialAccess && (
            <div className="admin-card flex flex-col justify-between h-full overflow-hidden">
              <div>
                <div className="admin-card-header">
                  <h3 className="font-semibold text-[#1a1410] text-sm">Payment Overview</h3>
                  <Link to="/admin/payments" className="text-[10px] text-[#8B4949] flex items-center gap-1 hover:underline">
                    View all <ArrowRight size={11} />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#faf8f5] border border-[#ede9e1] p-2.5 rounded-xl text-center shadow-sm">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Success Rate</p>
                      <p className="text-xl font-extrabold text-[#4A7C59] mt-0.5">{successRate}%</p>
                    </div>
                    <div className="bg-[#faf8f5] border border-[#ede9e1] p-2.5 rounded-xl text-center shadow-sm">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Transactions</p>
                      <p className="text-xl font-extrabold text-[#1a1410] mt-0.5">{totalPayCount}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      <span>Payment Share</span>
                      <span>{paidCount} of {totalPayCount} Paid</span>
                    </div>
                    <div className="h-2.5 bg-[#f5f0e8] rounded-full overflow-hidden flex shadow-inner">
                      {Object.entries(payStatusCounts).map(([status, count]) => {
                        const color = PAY_DOTS[status] || '#ccc';
                        const pct = totalPayCount > 0 ? (count / totalPayCount) * 100 : 0;
                        return (
                          <div
                            key={status}
                            className="h-full first:rounded-l-full last:rounded-r-full"
                            style={{ width: `${pct}%`, backgroundColor: color }}
                            title={`${status}: ${count}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-dashed border-[#ede9e1] mt-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Payment Methods</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Razorpay', 'UPI', 'Card', 'Manual'].map((method) => {
                        const count = payMethodCounts[method] || 0;
                        return (
                          <div key={method} className="bg-[#faf8f5]/60 border border-[#ede9e1]/60 px-2 py-1.5 rounded-lg flex items-center justify-between text-[10px]">
                            <span className="font-semibold text-gray-500">{method}</span>
                            <span className="font-bold text-gray-700">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-6">
                {Object.entries(payStatusCounts).map(([status, count]) => {
                  const color = PAY_DOTS[status] || '#ccc';
                  return (
                    <div key={status} className="bg-[#faf8f5] border border-[#ede9e1] px-3 py-2 rounded-full flex items-center justify-between text-[11px] font-medium text-gray-500">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <span className="truncate">{status}</span>
                      </div>
                      <strong className="text-[#1a1410] ml-2 flex-shrink-0">{count}</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Promotion Overview */}
          {hasPromotionsAccess && (
            <div className="admin-card flex flex-col justify-between h-full">
              <div>
                <div className="admin-card-header">
                  <h3 className="font-semibold text-[#1a1410] text-sm">Promotion Overview</h3>
                  <Link to="/admin/promotions" className="text-[10px] text-[#8B4949] flex items-center gap-1 hover:underline">
                    Manage <ArrowRight size={11} />
                  </Link>
                </div>
                
                <div className="relative overflow-hidden bg-gradient-to-br from-[#8B4949] to-[#a85858] rounded-xl p-4 text-white flex items-center justify-between shadow-md my-2">
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#ffffff] border-r border-dashed border-[#8B4949]/30" />
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#ffffff] border-l border-dashed border-[#8B4949]/30" />
                  
                  <div className="pl-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]">Total Usage</p>
                    <p className="text-3xl font-extrabold tracking-tight mt-0.5">{totalUsage}</p>
                    <p className="text-[10px] text-white/70 mt-0.5">Coupon uses recorded</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-[#D4AF37]">
                    <Tag size={20} />
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-dashed border-[#ede9e1] mt-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Active Coupons</p>
                  <div className="space-y-1.5">
                    {topPromos.map((promo) => (
                      <div key={promo.id} className="bg-[#faf8f5]/60 border border-[#ede9e1]/60 px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono bg-[#8B4949]/5 text-[#8B4949] px-1.5 py-0.5 rounded font-bold text-[9px]">{promo.couponCode}</span>
                          <span className="text-gray-500 text-[9px] truncate max-w-[80px]">{promo.campaignName}</span>
                        </div>
                        <span className="font-bold text-gray-700">{promo.usageCount} uses</span>
                      </div>
                    ))}
                    {topPromos.length === 0 && (
                      <p className="text-[10px] text-gray-400 italic">No active coupons</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-6">
                <div className="bg-[#faf8f5] border border-[#ede9e1] px-3 py-2 rounded-xl flex items-center gap-2 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Active</p>
                    <p className="text-xs font-extrabold text-[#1a1410]">{activePromos}</p>
                  </div>
                </div>
                <div className="bg-[#faf8f5] border border-[#ede9e1] px-3 py-2 rounded-xl flex items-center gap-2 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Expired</p>
                    <p className="text-xs font-extrabold text-[#1a1410]">{expiredPromos}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── KPI Metrics Row (Filtered by permission) ──────────────────────────────────── */}
      {(hasProductsAccess || hasFinancialAccess) && (
        <div className={`grid gap-6 ${
          hasProductsAccess && hasFinancialAccess 
            ? 'grid-cols-1 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {/* Top Selling Products */}
          {hasProductsAccess && (
            <div className={`admin-card flex flex-col justify-between ${
              hasFinancialAccess ? 'lg:col-span-2' : ''
            }`}>
              <div>
                <div className="admin-card-header">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-[#D4AF37]" />
                    <h3 className="font-semibold text-[#1a1410]">Top Selling Products</h3>
                  </div>
                  <Link to="/admin/products" className="text-xs text-[#8B4949] flex items-center gap-1 hover:underline font-medium">
                    Manage <ArrowRight size={12} />
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {topProducts.map((p, idx) => (
                    <div key={p.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 group transition-all">
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-6 h-6 rounded-full bg-[#f5f0e8] flex items-center justify-center text-xs font-bold text-[#8B4949] flex-shrink-0"
                        >
                          #{idx + 1}
                        </span>
                        {p.imageUrl ? (
                          <img 
                            src={p.imageUrl} 
                            alt={p.name} 
                            className="w-10 h-10 rounded-lg object-cover border border-[#e5e5e5] flex-shrink-0 shadow-sm" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#faf8f5] border border-[#e5e5e5] flex items-center justify-center text-gray-400 flex-shrink-0">
                            <Package size={16} />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm text-[#1a1410] truncate max-w-[160px] sm:max-w-[280px] group-hover:text-[#8B4949] transition-colors">
                            {p.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <TypeBadge type={p.type as any} size="sm" />
                            <span className="text-[10px] text-gray-400 font-medium">
                              {p.orders} {p.orders === 1 ? 'sale' : 'sales'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {hasFinancialAccess ? (
                          <>
                            <p className="font-bold text-[#8B4949] text-sm">
                              ₹{p.revenue.toLocaleString('en-IN')}
                            </p>
                            <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">Revenue</p>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Financial data restricted</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {topProducts.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-6">No sales data available yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Revenue Breakdown by Category */}
          {hasFinancialAccess && (
            <div className="admin-card flex flex-col justify-between">
              <div>
                <div className="admin-card-header">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={16} className="text-[#8B4949]" />
                    <h3 className="font-semibold text-[#1a1410]">Revenue by Category</h3>
                  </div>
                  <Link to="/admin/analytics" className="text-xs text-[#8B4949] flex items-center gap-1 hover:underline font-medium">
                    Details <ArrowRight size={12} />
                  </Link>
                </div>

                <div className="h-3 bg-[#f5f0e8] rounded-full overflow-hidden flex mb-5 shadow-inner">
                  {categoryMetrics
                    .filter((m) => m.revenue > 0)
                    .map((m) => (
                      <div
                        key={m.type}
                        className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 hover:opacity-90 relative group"
                        style={{
                          width: `${m.share}%`,
                          backgroundColor: TYPE_COLORS[m.type] || '#ccc',
                        }}
                        title={`${m.type}: ${m.share}% (₹${m.revenue.toLocaleString('en-IN')})`}
                      />
                    ))}
                  {categoryMetrics.filter((m) => m.revenue > 0).length === 0 && (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[9px] text-gray-400">
                      No revenue data
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {categoryMetrics.map((m) => {
                    const color = TYPE_COLORS[m.type] || '#ccc';
                    return (
                      <div key={m.type} className="flex items-center justify-between text-xs py-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-gray-600 font-medium">{m.type}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-gray-400 font-bold">{m.share}%</span>
                          <span className="font-semibold text-[#1a1410] w-16 text-right">
                            ₹{m.revenue.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Recent Orders Table (Filtered by permission) ─────────────────── */}
      {hasOrdersAccess && (
        <div className="admin-card">
          <div className="admin-card-header !pb-0 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
            <div className="flex gap-4">
              <button
                onClick={() => setDashboardTab('orders')}
                className={`pb-3 text-sm font-extrabold transition-all relative cursor-pointer ${
                  dashboardTab === 'orders'
                    ? 'text-[#8B4949]'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Recent Orders
                {dashboardTab === 'orders' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8B4949] rounded-full" />
                )}
              </button>
              <button
                onClick={() => setDashboardTab('leads')}
                className={`pb-3 text-sm font-extrabold transition-all relative cursor-pointer ${
                  dashboardTab === 'leads'
                    ? 'text-[#8B4949]'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Recent Leads
                {dashboardTab === 'leads' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8B4949] rounded-full" />
                )}
              </button>
            </div>
            
            <Link
              to={dashboardTab === 'orders' ? "/admin/orders" : "/admin/leads"}
              className="pb-3 text-xs text-[#8B4949] flex items-center gap-1 hover:underline font-semibold"
            >
              View all {dashboardTab === 'orders' ? 'orders' : 'leads'} <ArrowRight size={12} />
            </Link>
          </div>

          {dashboardTab === 'orders' ? (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Order Status</th>
                    <th>Payment</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="font-mono text-xs text-[#8B4949] font-semibold">{order.id}</td>
                      <td>
                        <div className="whitespace-nowrap">
                          <p className="font-medium text-[#1a1410] text-sm">{order.customerName}</p>
                          <p className="text-[10px] text-gray-400">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="text-sm text-[#4a4a4a] max-w-[240px] truncate">{order.productName}</td>
                      <td>
                        <TypeBadge type={order.productType as OrderProductType} size="sm" />
                      </td>
                      <td>
                        <StatusBadge status={order.status} size="sm" />
                      </td>
                      <td>
                        <StatusBadge status={order.paymentStatus} size="sm" />
                      </td>
                      <td className="font-semibold text-[#8B4949] whitespace-nowrap">
                        {hasFinancialAccess ? `₹${order.amount.toLocaleString('en-IN')}` : '₹ -'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Inquiry Details</th>
                    <th>KPI Tag</th>
                    <th>Lead Source</th>
                    <th>Status</th>
                    <th>Budget</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => {
                    const statusConfig = {
                      New:         { bg: '#EFF6FF', text: '#1D4ED8' },
                      Contacted:   { bg: '#F5F3FF', text: '#6D28D9' },
                      'Follow-up': { bg: '#FFF7ED', text: '#C2410C' },
                      Converted:   { bg: '#F0FDF4', text: '#166534' },
                      Lost:        { bg: '#FEF2F2', text: '#DC2626' }
                    }[lead.status] || { bg: '#f5f0e8', text: '#4a4a4a' };

                    return (
                      <tr key={lead.id} className="hover:bg-[#faf8f5]/30 transition-colors">
                        <td>
                          <p className="font-extrabold text-[#1a1410] text-sm">{lead.name}</p>
                          <span className="text-[10px] text-gray-400 font-medium">{lead.phone}</span>
                        </td>
                        <td>
                          <p className="text-xs font-semibold text-[#1a1410]">{lead.interestedProduct}</p>
                          <span className="text-[10px] text-gray-400">{lead.email}</span>
                        </td>
                        <td>
                          <TypeBadge type={lead.tag as any} size="sm" />
                        </td>
                        <td className="text-xs text-[#4a4a4a] font-medium">{lead.source}</td>
                        <td>
                          <span
                            style={{ backgroundColor: statusConfig.bg, color: statusConfig.text }}
                            className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="font-semibold text-[#8B4949] whitespace-nowrap">
                          ₹{lead.budget.toLocaleString('en-IN')}
                        </td>
                        <td className="text-[11px] text-gray-400 font-medium">{lead.createdAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
