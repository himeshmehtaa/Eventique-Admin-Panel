import { useMemo, useState } from 'react';
import {
  TrendingUp, Award, AlertTriangle, BarChart3, IndianRupee, ShoppingCart,
  Film, FileText, Globe, Printer, BookOpen, Gift, ArrowUpRight, Info, PieChart,
  Calendar, ArrowDownRight, MoreVertical, Edit2
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { StatsCard } from '../components/StatsCard';
import { TypeBadge } from '../components/TypeBadge';
import type { OrderProductType, OccasionType } from '../types';

// ── All subcategories to analyze ─────────────────────────────
const PRODUCT_TYPES: OrderProductType[] = [
  'Video Invites',
  'PDF Invites',
  'Event Websites',
  'Printed Invites',
  'Stationery',
  'Gifts',
];

// ── Map product types to Order productType labels ─────────────
const PRODUCT_TYPE_MAP: Record<string, OrderProductType> = {
  'video-invite':    'Video Invites',
  'pdf-invite':      'PDF Invites',
  'e-invitation':    'PDF Invites',
  'wedding-website': 'Event Websites',
  'website':         'Event Websites',
  'stationery':      'Stationery',
  'printed-invite':  'Printed Invites',
};

// ── Type accent colors ────────────────────────────────────────
const TYPE_COLORS: Record<OrderProductType, string> = {
  'Video Invites':   '#8B4949', // primary brand color
  'PDF Invites':     '#D4AF37', // secondary gold
  'Event Websites':  '#4F46E5', // indigo
  'Printed Invites': '#10B981', // emerald
  'Stationery':      '#8B5CF6', // violet
  'Gifts':           '#EC4899', // pink
};

const TYPE_GRADIENTS: Record<OrderProductType, string> = {
  'Video Invites':   'linear-gradient(90deg,#5C2E2E,#8B4949)',
  'PDF Invites':     'linear-gradient(90deg,#C4902A,#D4AF37)',
  'Event Websites':  'linear-gradient(90deg,#4F46E5,#6366F1)',
  'Printed Invites': 'linear-gradient(90deg,#15803D,#10B981)',
  'Stationery':      'linear-gradient(90deg,#7C3AED,#8B5CF6)',
  'Gifts':           'linear-gradient(90deg,#DB2777,#EC4899)',
};

const TYPE_ICONS: Record<OrderProductType, React.ReactNode> = {
  'Video Invites':   <Film size={15} />,
  'PDF Invites':     <FileText size={15} />,
  'Event Websites':  <Globe size={15} />,
  'Printed Invites': <Printer size={15} />,
  'Stationery':      <BookOpen size={15} />,
  'Gifts':           <Gift size={15} />,
};

// ── SVG Donut Chart Component ─────────────────────────────────
interface DonutChartProps {
  data: { type: string; revenue: number }[];
  total: number;
}

function DonutChart({ data, total }: DonutChartProps) {
  const radius = 35;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius; // ~219.91
  
  let accumulatedPercent = 0;
  
  return (
    <div className="relative w-56 h-56 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="#f5f0e8"
          strokeWidth={strokeWidth}
        />
        {data.map((item) => {
          const percent = total > 0 ? (item.revenue / total) * 100 : 0;
          if (percent <= 0) return null;
          
          const strokeLength = (percent / 100) * circumference;
          const strokeOffset = circumference - (accumulatedPercent / 100) * circumference;
          accumulatedPercent += percent;
          
          const color = TYPE_COLORS[item.type as OrderProductType] || '#8B4949';
          
          return (
            <circle
              key={item.type}
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${strokeLength} ${circumference}`}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out hover:stroke-[10px] cursor-pointer"
              style={{ transformOrigin: 'center' }}
            >
              <title>{item.type}: {percent.toFixed(1)}% (₹{item.revenue.toLocaleString('en-IN')})</title>
            </circle>
          );
        })}
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-6">
        <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Sales</span>
        <span className="text-xl font-black text-[#1a1410] mt-1">₹{total.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}

// ── SVG Order Status Donut Component ──────────────────────────
interface StatusDonutChartProps {
  data: { name: string; count: number; color: string; pct: number }[];
  total: number;
}

function StatusDonutChart({ data, total }: StatusDonutChartProps) {
  const radius = 35;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius; // ~219.91
  let accumulatedPercent = 0;

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f5f0e8" strokeWidth={strokeWidth} />
        {data.map((item) => {
          if (item.pct <= 0) return null;
          const strokeLength = (item.pct / 100) * circumference;
          const strokeOffset = circumference - (accumulatedPercent / 100) * circumference;
          accumulatedPercent += item.pct;

          return (
            <circle
              key={item.name}
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${strokeLength} ${circumference}`}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out hover:stroke-[10px] cursor-pointer"
            >
              <title>{item.name}: {item.pct}% ({item.count} orders)</title>
            </circle>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-2">
        <span className="text-xl font-black text-[#1a1410]">{total}</span>
        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Orders</span>
      </div>
    </div>
  );
}

// ── SVG Target Progress Gauge Component ───────────────────────
function TargetGaugeChart({ percent }: { percent: number }) {
  const strokeWidth = 8;
  const targetPct = Math.min(Math.max(percent, 0), 100);

  return (
    <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
      <svg viewBox="0 0 100 55" className="w-full h-full">
        {/* Background Arc */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="#f5f0e8"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength="100"
        />
        {/* Progress Arc */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="#8B4949"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset={100 - targetPct}
          pathLength="100"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-1 pointer-events-none">
        <span className="text-xl font-black text-[#1a1410]">{percent.toFixed(1)}%</span>
        <span className="text-[9px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full mt-0.5 flex items-center gap-0.5">
          ↗ +12%
        </span>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function AnalyticsPage() {
  const { state } = useAdmin();

  // ── Build per-type metrics ─────────────────────────────────
  const typeMetrics = useMemo(() => {
    const ordersPerType: Record<OrderProductType, number> = {} as Record<OrderProductType, number>;
    const revenuePerType: Record<OrderProductType, number> = {} as Record<OrderProductType, number>;
    PRODUCT_TYPES.forEach((t) => { ordersPerType[t] = 0; revenuePerType[t] = 0; });

    state.orders.forEach((o) => {
      const t = o.productType;
      if (PRODUCT_TYPES.includes(t)) {
        ordersPerType[t] = (ordersPerType[t] || 0) + 1;
        revenuePerType[t] = (revenuePerType[t] || 0) + o.amount;
      }
    });

    const productsPerType: Record<OrderProductType, number> = {} as Record<OrderProductType, number>;
    PRODUCT_TYPES.forEach((t) => { productsPerType[t] = 0; });
    state.products.forEach((p) => {
      const mapped = PRODUCT_TYPE_MAP[p.type];
      if (mapped) {
        productsPerType[mapped] = (productsPerType[mapped] || 0) + 1;
      }
    });

    return PRODUCT_TYPES.map((type) => ({
      type,
      orders:   ordersPerType[type],
      revenue:  revenuePerType[type],
      products: productsPerType[type],
      avgValue: ordersPerType[type] > 0
        ? Math.round(revenuePerType[type] / ordersPerType[type])
        : 0,
    }));
  }, [state.orders, state.products]);

  // ── Top-level stats ────────────────────────────────────────
  const totalRevenue   = typeMetrics.reduce((s, m) => s + m.revenue, 0);
  const totalOrders    = typeMetrics.reduce((s, m) => s + m.orders, 0);
  const avgOrderValue  = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const [revenueTimeframe, setRevenueTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [monthlyTarget, setMonthlyTarget] = useState(() => {
    const saved = localStorage.getItem('eventique_monthly_target');
    return saved ? parseFloat(saved) : 50000;
  });
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(() => {
    const saved = localStorage.getItem('eventique_monthly_target');
    return saved || '50000';
  });

  // Compute revenue dataset based on timeframe
  const revenueData = useMemo(() => {
    if (revenueTimeframe === 'weekly') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const values = [12000, 15400, 9800, 18500, totalRevenue, 0, 0];
      const orders = [3, 4, 2, 5, totalOrders, 0, 0];
      const maxVal = Math.max(...values, 1000);
      return days.map((day, i) => ({
        label: day,
        value: values[i],
        orders: orders[i],
        pct: (values[i] / maxVal) * 100,
      }));
    } else if (revenueTimeframe === 'yearly') {
      const years = ['22', '23', '24', '25', '26'];
      const values = [185000, 224000, 298000, 345000, 345000 + totalRevenue];
      const orders = [62, 78, 94, 112, 112 + totalOrders];
      const maxVal = Math.max(...values, 1000);
      return years.map((yr, i) => ({
        label: yr,
        value: values[i],
        orders: orders[i],
        pct: (values[i] / maxVal) * 100,
      }));
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const values = [45000, 32000, 18000, 42000, 28000, totalRevenue, 38000, 48000, 35000, 29000, 22000, 52000];
      const orders = [12, 10, 6, 14, 9, totalOrders, 11, 15, 12, 8, 7, 16];
      const maxVal = Math.max(...values, 1000);
      return months.map((mon, i) => ({
        label: mon,
        value: values[i],
        orders: orders[i],
        pct: (values[i] / maxVal) * 100,
      }));
    }
  }, [revenueTimeframe, totalRevenue, totalOrders]);

  const activeTimeframeRevenue = useMemo(() => {
    return revenueData.reduce((sum, item) => sum + item.value, 0);
  }, [revenueData]);

  // Order status counts
  const orderStatusData = useMemo(() => {
    const counts: Record<string, number> = {
      Completed: 0,
      Processing: 0,
      Shipped: 0,
      Cancelled: 0,
    };
    state.orders.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status] += 1;
      } else {
        if (o.status === 'Refunded' || o.status === 'Returned') {
          counts['Cancelled'] += 1;
        } else {
          counts['Processing'] += 1;
        }
      }
    });

    const hasOrders = state.orders.length > 0;
    const finalCounts = hasOrders ? counts : { Completed: 5, Processing: 2, Shipped: 1, Cancelled: 1 };
    const total = Object.values(finalCounts).reduce((a, b) => a + b, 0);

    return {
      counts: finalCounts,
      total,
      list: [
        { name: 'Completed', count: finalCounts.Completed, color: '#22C55E', pct: total > 0 ? Math.round((finalCounts.Completed / total) * 100) : 0 },
        { name: 'Processing', count: finalCounts.Processing, color: '#F39C12', pct: total > 0 ? Math.round((finalCounts.Processing / total) * 100) : 0 },
        { name: 'Shipped', count: finalCounts.Shipped, color: '#6366F1', pct: total > 0 ? Math.round((finalCounts.Shipped / total) * 100) : 0 },
        { name: 'Cancelled', count: finalCounts.Cancelled, color: '#E74C3C', pct: total > 0 ? Math.round((finalCounts.Cancelled / total) * 100) : 0 },
      ]
    };
  }, [state.orders]);

  const targetPercentage = useMemo(() => {
    return (totalRevenue / monthlyTarget) * 100;
  }, [totalRevenue, monthlyTarget]);

  const targetMessage = useMemo(() => {
    if (targetPercentage >= 100) {
      return `Target achieved! You've exceeded your monthly goal of ₹${monthlyTarget.toLocaleString('en-IN')} by ${Math.max(0, targetPercentage - 100).toFixed(1)}%.`;
    } else {
      const remaining = Math.max(0, monthlyTarget - totalRevenue);
      return `You've completed ${targetPercentage.toFixed(1)}% of your target. You need ₹${remaining.toLocaleString('en-IN')} more to hit this month's goal.`;
    }
  }, [targetPercentage, monthlyTarget, totalRevenue]);

  // ── Digital vs Physical Channel Split Analysis ──────────────
  const channelData = useMemo(() => {
    let digitalRevenue = 0;
    let digitalOrders = 0;
    let physicalRevenue = 0;
    let physicalOrders = 0;

    state.orders.forEach((o) => {
      const isDigital = ['Video Invites', 'PDF Invites', 'Event Websites'].includes(o.productType);
      if (isDigital) {
        digitalRevenue += o.amount;
        digitalOrders += 1;
      } else {
        physicalRevenue += o.amount;
        physicalOrders += 1;
      }
    });

    const totalOrdersCount = digitalOrders + physicalOrders;
    const totalRev = digitalRevenue + physicalRevenue;

    return {
      digital: {
        revenue: digitalRevenue,
        orders: digitalOrders,
        avgValue: digitalOrders > 0 ? Math.round(digitalRevenue / digitalOrders) : 0,
        pct: totalRev > 0 ? Math.round((digitalRevenue / totalRev) * 100) : 0,
      },
      physical: {
        revenue: physicalRevenue,
        orders: physicalOrders,
        avgValue: physicalOrders > 0 ? Math.round(physicalRevenue / physicalOrders) : 0,
        pct: totalRev > 0 ? Math.round((physicalRevenue / totalRev) * 100) : 0,
      }
    };
  }, [state.orders]);

  // ── Occasion Popularity breakdown ──────────────────────────
  const occasionData = useMemo(() => {
    const revenueMap: Record<OccasionType, number> = {
      wedding: 0,
      engagement: 0,
      birthday: 0,
      'baby-shower': 0,
      pooja: 0,
      anniversary: 0,
      all: 0,
    };
    const ordersMap: Record<OccasionType, number> = {
      wedding: 0,
      engagement: 0,
      birthday: 0,
      'baby-shower': 0,
      pooja: 0,
      anniversary: 0,
      all: 0,
    };

    const filteredOrders = state.orders.filter((o) => {
      if (projectFilter === 'all') return true;
      if (projectFilter === 'digital') return ['Video Invites', 'PDF Invites'].includes(o.productType);
      if (projectFilter === 'printed') return o.productType === 'Printed Invites';
      if (projectFilter === 'websites') return o.productType === 'Event Websites';
      if (projectFilter === 'stationery') return o.productType === 'Stationery';
      if (projectFilter === 'gifts') return o.productType === 'Gifts';
      return true;
    });

    filteredOrders.forEach((o) => {
      const matchedProd = state.products.find(
        (p) => p.name.toLowerCase() === o.productName.toLowerCase()
      );
      
      let occasion: OccasionType = 'all';
      if (matchedProd) {
        occasion = matchedProd.occasion;
      } else {
        const nameLower = o.productName.toLowerCase();
        if (nameLower.includes('wedding') || nameLower.includes('royal') || nameLower.includes('floral') || nameLower.includes('stationery') || nameLower.includes('printed')) {
          occasion = 'wedding';
        } else if (nameLower.includes('anniversary')) {
          occasion = 'anniversary';
        } else if (nameLower.includes('birthday') || nameLower.includes('gift') || nameLower.includes('hamper')) {
          occasion = 'birthday';
        } else if (nameLower.includes('baby') || nameLower.includes('shower')) {
          occasion = 'baby-shower';
        } else if (nameLower.includes('pooja') || nameLower.includes('ethnic') || nameLower.includes('festival')) {
          occasion = 'pooja';
        } else if (nameLower.includes('engagement') || nameLower.includes('ring') || nameLower.includes('roka')) {
          occasion = 'engagement';
        }
      }

      revenueMap[occasion] += o.amount;
      ordersMap[occasion] += 1;
    });

    const totalOrdersCount = filteredOrders.length || 1;
    const totalRev = Object.values(revenueMap).reduce((a, b) => a + b, 0);

    const OCCASION_NAMES: Record<OccasionType, { name: string; color: string }> = {
      wedding:       { name: 'Wedding Invites',     color: '#8B4949' },
      engagement:    { name: 'Engagement & Roka',   color: '#D4AF37' },
      birthday:      { name: 'Birthdays & Parties', color: '#4F46E5' },
      'baby-shower': { name: 'Baby Showers',        color: '#10B981' },
      pooja:         { name: 'Pooja & Festivals',   color: '#EC4899' },
      anniversary:   { name: 'Anniversaries',       color: '#8B5CF6' },
      all:           { name: 'General / Others',    color: '#9CA3AF' },
    };

    return (Object.keys(OCCASION_NAMES) as OccasionType[])
      .map((key) => {
        const rev = revenueMap[key];
        const ords = ordersMap[key];
        return {
          key,
          name: OCCASION_NAMES[key].name,
          color: OCCASION_NAMES[key].color,
          revenue: rev,
          orders: ords,
          pct: totalOrdersCount > 0 ? Math.round((ords / totalOrdersCount) * 100) : 0,
          revPct: totalRev > 0 ? (rev / totalRev) * 100 : 0,
        };
      })
      .filter(item => item.orders > 0)
      .sort((a, b) => b.revenue - a.revenue);
  }, [state.orders, state.products, projectFilter]);

  const sortedByRevenue = [...typeMetrics].sort((a, b) => b.revenue - a.revenue);
  const best  = sortedByRevenue[0];
  const worst = sortedByRevenue[sortedByRevenue.length - 1];

  // ── Conversion Ratio Calculation ──────────────────────────
  const conversionRatioWarning = useMemo(() => {
    const activeTypes = typeMetrics.filter((m) => m.products > 0);
    if (activeTypes.length === 0) return null;
    const sorted = [...activeTypes].sort((a, b) => (a.orders / a.products) - (b.orders / b.products));
    return sorted[0];
  }, [typeMetrics]);

  // ── Table data (sorted desc by revenue) ───────────────────
  const tableRows = sortedByRevenue.map((m, i) => ({
    ...m,
    share: totalRevenue > 0 ? ((m.revenue / totalRevenue) * 100).toFixed(1) : '0.0',
    rank: i,
  }));

  return (
    <div className="space-y-8 admin-animate-in">

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={20} className="text-[#8B4949]" />
            <h1
              className="text-xl font-bold text-[#1a1410]"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Analytics
            </h1>
          </div>
          <p className="text-xs text-gray-400">Detailed commercial insights by product subcategory</p>
        </div>
      </div>

      {/* ── Interactive KPI Widgets Row ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Revenue Overview Bar Chart */}
        <div className="admin-card !p-6 flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-sm text-gray-500 uppercase tracking-wider">Revenue Overview</span>
              {/* Date Select Dropdown Selector */}
              <div className="flex items-center gap-1.5 bg-[#faf8f5] border border-[#e5e5e5] px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600">
                <Calendar size={13} className="text-[#8B4949]" />
                <span>
                  {revenueTimeframe === 'weekly' ? 'Week 23 - 2026' : revenueTimeframe === 'monthly' ? 'Jun - 2026' : 'Year 2026'}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-2.5 mb-4">
              <span className="text-3xl font-black text-[#1a1410]">
                ₹{activeTimeframeRevenue.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                ↗ {revenueTimeframe === 'weekly' ? '8.2%' : revenueTimeframe === 'monthly' ? '12.4%' : '15.1%'}
              </span>
            </div>

            {/* Timeframe selector tabs */}
            <div className="flex bg-[#faf8f5] p-1 rounded-xl gap-1 mb-5 border border-[#e5e5e5]/50">
              {(['weekly', 'monthly', 'yearly'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setRevenueTimeframe(tf)}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 capitalize cursor-pointer ${
                    revenueTimeframe === tf
                      ? 'bg-[#8B4949] text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-[#faf8f5]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Bar chart grid */}
          <div className="flex items-end justify-between h-40 pt-4 px-1 gap-1.5 relative border-b border-[#e5e5e5]/50 pb-1">
            {revenueData.map((item) => (
              <div key={item.label} className="flex flex-col items-center flex-1 group relative h-full justify-end">
                {/* Custom absolute hover tooltip */}
                <div className="absolute bottom-full mb-2 bg-[#1a1410] text-white text-[9px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30 shadow-md">
                  {item.orders} Sales · ₹{item.value.toLocaleString('en-IN')}
                </div>
                
                {/* Bar Capsule */}
                <div className="bg-[#f5f0e8] w-full rounded-full h-[80%] flex flex-col justify-end relative overflow-hidden">
                  <div
                    className="w-full rounded-full transition-all duration-500 bg-gradient-to-t from-[#8B4949] to-[#c46262] group-hover:from-[#D4AF37] group-hover:to-[#f1d77a]"
                    style={{ height: `${item.pct}%` }}
                  />
                </div>
                {/* Label */}
                <span className="text-[9px] text-gray-400 font-bold uppercase mt-1.5 select-none">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Order Status Donut */}
        <div className="admin-card !p-6 flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-sm text-gray-500 uppercase tracking-wider">Order Status</span>
              <div className="flex items-center gap-1.5 bg-[#faf8f5] border border-[#e5e5e5] px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600">
                <Calendar size={13} className="text-[#D4AF37]" />
                <span>Jun - 2026</span>
              </div>
            </div>
            
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-3xl font-black text-[#1a1410]">
                {orderStatusData.total}
              </span>
              <span className="text-xs font-medium text-gray-400 ml-1.5">Total Orders</span>
            </div>
          </div>

          <div className="flex justify-center my-4">
            <StatusDonutChart data={orderStatusData.list} total={orderStatusData.total} />
          </div>

          {/* Status legend 2x2 Grid */}
          <div className="grid grid-cols-2 gap-2 mt-auto">
            {orderStatusData.list.map((item) => (
              <div key={item.name} className="bg-[#faf8f5] border border-[#f0ece4] py-1.5 px-2.5 rounded-xl flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-500 truncate text-[11px]">{item.name}</span>
                </div>
                <div className="flex items-baseline gap-1 flex-shrink-0">
                  <span className="text-[#1a1410] text-[11px] font-bold">{item.count}</span>
                  <span className="text-[9px] text-gray-400 font-medium">({item.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Monthly Target Progress Arc */}
        <div className="admin-card !p-6 flex flex-col justify-between min-h-[360px] relative">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-gray-500 uppercase tracking-wider">Monthly Target</span>
              <button 
                onClick={() => {
                  setTempTarget(monthlyTarget.toString());
                  setIsEditingTarget(!isEditingTarget);
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isEditingTarget ? 'text-[#8B4949] bg-[#8B4949]/10' : 'text-gray-400 hover:text-[#8B4949] hover:bg-[#8B4949]/10'}`}
                title="Edit Target"
              >
                <Edit2 size={14} />
              </button>
            </div>
            <p className="text-[11px] text-gray-400">Target you've set for each month</p>
          </div>

          {isEditingTarget ? (
            <div className="my-auto p-4 bg-[#faf8f5] border border-[#f0ece4] rounded-2xl flex flex-col gap-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Set Monthly Target (₹)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={tempTarget}
                  onChange={(e) => setTempTarget(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = parseFloat(tempTarget);
                      if (!isNaN(val) && val > 0) {
                        setMonthlyTarget(val);
                        localStorage.setItem('eventique_monthly_target', val.toString());
                      }
                      setIsEditingTarget(false);
                    } else if (e.key === 'Escape') {
                      setIsEditingTarget(false);
                    }
                  }}
                  className="admin-input !py-1.5 !px-3 text-xs font-semibold"
                  placeholder="Target amount"
                  autoFocus
                />
                <button
                  onClick={() => {
                    const val = parseFloat(tempTarget);
                    if (!isNaN(val) && val > 0) {
                      setMonthlyTarget(val);
                      localStorage.setItem('eventique_monthly_target', val.toString());
                    }
                    setIsEditingTarget(false);
                  }}
                  className="admin-btn admin-btn-primary admin-btn-sm !py-1.5 !px-3 font-bold text-xs"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingTarget(false)}
                  className="admin-btn admin-btn-ghost admin-btn-sm !py-1.5 !px-3 font-semibold text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-center my-3 cursor-pointer" onClick={() => {
                setTempTarget(monthlyTarget.toString());
                setIsEditingTarget(true);
              }} title="Click to edit target">
                <TargetGaugeChart percent={targetPercentage} />
              </div>

              {/* Subtitle Message */}
              <div className="text-center px-2 mb-3">
                <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                  {targetMessage}
                </p>
              </div>
            </>
          )}

          {/* Target / Revenue / AOV footer row */}
          <div className="grid grid-cols-3 gap-2 border-t border-[#f0ece4] pt-4 mt-auto">
            <div className="text-center cursor-pointer" onClick={() => {
              setTempTarget(monthlyTarget.toString());
              setIsEditingTarget(true);
            }} title="Click to edit target">
              <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Target</p>
              <div className="flex items-center justify-center gap-0.5 text-xs font-black text-red-600">
                <span>₹{(monthlyTarget / 1000).toFixed(0)}k</span>
                <ArrowDownRight size={11} className="flex-shrink-0" />
              </div>
            </div>
            
            <div className="text-center border-x border-[#f0ece4]/70">
              <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Revenue</p>
              <div className="flex items-center justify-center gap-0.5 text-xs font-black text-green-600">
                <span>₹{(totalRevenue / 1000).toFixed(1)}k</span>
                <ArrowUpRight size={11} className="flex-shrink-0" />
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">AOV</p>
              <div className="flex items-center justify-center gap-0.5 text-xs font-black text-green-600">
                <span>₹{(avgOrderValue / 1000).toFixed(1)}k</span>
                <ArrowUpRight size={11} className="flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mid-Section: Channel Split & Order Value Distribution ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Sales Channel Split */}
        <div className="admin-card !p-6 flex flex-col justify-between min-h-[340px]">
          <div>
            <div className="admin-card-header w-full border-b border-[#f0f0f0] pb-3 mb-4">
              <div className="flex flex-col">
                <h3 className="font-bold text-[#1a1410] text-sm">Sales Channel Split</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Digital Product vs Physical Product</p>
              </div>
            </div>

            {/* Split Progress Bar */}
            <div className="mb-6 mt-4">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-[#8B4949]">Digital: {channelData.digital.pct}%</span>
                <span className="text-[#D4AF37]">Physical: {channelData.physical.pct}%</span>
              </div>
              <div className="h-4 bg-[#f5f0e8] rounded-full overflow-hidden p-0.5 flex border border-[#e5e5e5]/20 shadow-inner">
                <div 
                  className="h-full rounded-l-full bg-gradient-to-r from-[#8B4949] to-[#a25656] transition-all duration-500" 
                  style={{ width: `${channelData.digital.pct}%` }} 
                  title={`Digital: ${channelData.digital.pct}%`}
                />
                <div 
                  className="h-full rounded-r-full bg-gradient-to-r from-[#c49a2c] to-[#D4AF37] transition-all duration-500" 
                  style={{ width: `${channelData.physical.pct}%` }} 
                  title={`Physical: ${channelData.physical.pct}%`}
                />
              </div>
            </div>

            {/* Metrics Side-by-Side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Digital Metrics Box */}
              <div className="bg-[#faf8f5] border border-[#f0ece4] p-4 rounded-2xl flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B4949]" />
                  <span className="text-xs font-bold text-[#1a1410]">Digital Product</span>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#8B4949]">₹{channelData.digital.revenue.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Total Revenue</p>
                </div>
                <div className="grid grid-cols-2 gap-1 border-t border-[#f0ece4]/70 pt-2.5">
                  <div>
                    <p className="text-sm font-extrabold text-[#1a1410]">{channelData.digital.orders}</p>
                    <p className="text-[9px] text-gray-400 uppercase font-medium">Orders</p>
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[#1a1410]">₹{channelData.digital.avgValue.toLocaleString('en-IN')}</p>
                    <p className="text-[9px] text-gray-400 uppercase font-medium">Avg Ticket</p>
                  </div>
                </div>
              </div>

              {/* Physical Metrics Box */}
              <div className="bg-[#faf8f5] border border-[#f0ece4] p-4 rounded-2xl flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                  <span className="text-xs font-bold text-[#1a1410]">Physical Product</span>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#D4AF37]">₹{channelData.physical.revenue.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Total Revenue</p>
                </div>
                <div className="grid grid-cols-2 gap-1 border-t border-[#f0ece4]/70 pt-2.5">
                  <div>
                    <p className="text-sm font-extrabold text-[#1a1410]">{channelData.physical.orders}</p>
                    <p className="text-[9px] text-gray-400 uppercase font-medium">Orders</p>
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[#1a1410]">₹{channelData.physical.avgValue.toLocaleString('en-IN')}</p>
                    <p className="text-[9px] text-gray-400 uppercase font-medium">Avg Ticket</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Occasion Breakdown */}
        <div className="admin-card !p-6 flex flex-col justify-between min-h-[340px]">
          <div>
            <div className="admin-card-header w-full border-b border-[#f0f0f0] pb-3 mb-4 flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="font-bold text-[#1a1410] text-sm">Occasion Breakdown</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Revenue and order volume by event occasion</p>
              </div>
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="bg-[#faf8f5] border border-[#e5e5e5] px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 focus:outline-none focus:border-[#8B4949] cursor-pointer"
              >
                <option value="all">All Projects</option>
                <option value="digital">Digital Invites</option>
                <option value="printed">Printed Invites</option>
                <option value="websites">Event Websites</option>
                <option value="stationery">Stationery</option>
                <option value="gifts">Gifts</option>
              </select>
            </div>

            {/* Occasion Rows */}
            <div className="space-y-4.5 mt-2">
              {occasionData.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xs text-gray-400 font-bold">No orders found for this project type</p>
                </div>
              ) : (
                occasionData.map((occ) => {
                  return (
                    <div key={occ.key} className="flex flex-col">
                      <div className="flex justify-between items-baseline text-xs font-semibold text-gray-600 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: occ.color }} />
                          <span className="text-[#1a1410] font-bold">{occ.name}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-extrabold text-[#1a1410]">{occ.orders} {occ.orders === 1 ? 'Order' : 'Orders'}</span>
                          <span className="text-gray-400 text-[10px]">·</span>
                          <span className="font-bold text-[#8B4949]">₹{occ.revenue.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-[#f5f0e8] rounded-full overflow-hidden p-0.5 border border-[#e5e5e5]/20">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${occ.revPct}%`, 
                            backgroundColor: occ.color 
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Performance Table ──────────────────────────────────── */}
      <div className="admin-card !p-0 overflow-hidden">
        <div className="admin-card-header px-6 py-4 border-b border-[#f0f0f0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={15} className="text-[#8B4949]" />
            <h3 className="font-semibold text-[#1a1410]">Performance Leaderboard</h3>
          </div>
          <span className="text-[10px] text-gray-400">Sorted by revenue desc ↓</span>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="w-[80px] text-center">Rank</th>
                <th>Category</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Avg Value</th>
                <th>Designs</th>
                <th>Share %</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => {
                const isBest  = row.rank === 0;
                const isWorst = row.rank === tableRows.length - 1;
                
                let rankLabel: string | React.ReactNode = `${row.rank + 1}`;
                if (row.rank === 0) rankLabel = '🥇';
                else if (row.rank === 1) rankLabel = '🥈';
                else if (row.rank === 2) rankLabel = '🥉';

                return (
                  <tr
                    key={row.type}
                    className="transition-all duration-150 hover:bg-[#8B4949]/5"
                  >
                    <td className="text-center font-bold text-gray-500">
                      <span className="text-sm">{rankLabel}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {isWorst && <span title="Needs Attention" className="text-xs">⚠️</span>}
                        <TypeBadge type={row.type} size="sm" />
                      </div>
                    </td>
                    <td className="font-bold text-[#1a1410]">{row.orders}</td>
                    <td className="font-bold text-[#8B4949]">
                      ₹{row.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="text-gray-600 font-medium">
                      {row.avgValue > 0 ? `₹${row.avgValue.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="text-gray-500 font-medium">{row.products}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-[#f5f0e8] rounded-full overflow-hidden flex-shrink-0">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${row.share}%`,
                              background: TYPE_GRADIENTS[row.type],
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-[#1a1410]">{row.share}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Insights Section ───────────────────────────────────── */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          AI Business Insights
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Best Performing */}
          <div
            className="admin-card border-l-4 transition-all hover:shadow-md"
            style={{ borderLeftColor: '#10B981' }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}
              >
                <Award size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                  Top Revenue Driver
                </p>
                <p className="text-sm font-extrabold text-[#1a1410] leading-tight truncate">
                  {best?.type ?? '—'}
                </p>
                <p className="text-xs font-bold text-[#10B981] mt-1">
                  ₹{best?.revenue.toLocaleString('en-IN') ?? '0'} ({(best ? (best.revenue / totalRevenue) * 100 : 0).toFixed(1)}% share)
                </p>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Leading subcategory. Consider expanding templates and variations to maximize seasonal demand.
                </p>
              </div>
            </div>
          </div>

          {/* Needs Attention */}
          <div
            className="admin-card border-l-4 transition-all hover:shadow-md"
            style={{ borderLeftColor: '#EF4444' }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
              >
                <AlertTriangle size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                  Underperforming Alert
                </p>
                <p className="text-sm font-extrabold text-[#1a1410] leading-tight truncate">
                  {worst?.type ?? '—'}
                </p>
                <p className="text-xs font-bold text-[#EF4444] mt-1">
                  ₹{worst?.revenue.toLocaleString('en-IN') ?? '0'} ({(worst ? (worst.revenue / totalRevenue) * 100 : 0).toFixed(1)}% share)
                </p>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Lowest performer. Recommend reviewing catalog design, pricing thresholds, or running custom discounts.
                </p>
              </div>
            </div>
          </div>

          {/* Bloated Catalog Conversion Warning */}
          <div
            className="admin-card border-l-4 transition-all hover:shadow-md"
            style={{ borderLeftColor: '#F59E0B' }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}
              >
                <Info size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                  Catalog Conversion
                </p>
                <p className="text-sm font-extrabold text-[#1a1410] leading-tight truncate">
                  {conversionRatioWarning?.type ?? '—'}
                </p>
                <p className="text-xs font-bold text-[#F59E0B] mt-1">
                  {conversionRatioWarning?.products ?? 0} Designs · {conversionRatioWarning?.orders ?? 0} Orders
                </p>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Low catalog turn rate. Consider auditing thumbnail appeal, reducing template prices, or lowering MOQs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
