import { useState, useMemo } from 'react';
import {
  Coins, IndianRupee, Search, Plus, Pencil, Trash2, X,
  TrendingUp, TrendingDown, Users, Factory, Settings,
  ArrowUpRight, ArrowDownRight, Percent, CreditCard,
  Briefcase, Calendar, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusBadge } from '../components/StatusBadge';
import type { Expense, ExpenseCategory, TeamMember, Vendor, VendorOrder } from '../types';

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

// Get month-year string (e.g. "June 2026") from a date string
function getMonthYearString(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return 'Current Month';
  }
}

export default function FinanceManager() {
  const {
    state,
    addExpense,
    updateExpense,
    deleteExpense,
    updateTeamMember
  } = useAdmin();

  const { expenses, payments, teamMembers, vendors, vendorOrders, roles } = state;

  const [activeTab, setActiveTab] = useState<'ledger' | 'payroll' | 'sourcing'>('ledger');
  
  // LEDGER TAB STATE
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending'>('All');
  
  // MODALS STATE
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  
  // Expense Form Fields
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState(0);
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('Other');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [expRecipient, setExpRecipient] = useState('');
  const [expRecipientId, setExpRecipientId] = useState('');
  const [expMethod, setExpMethod] = useState<'UPI' | 'Card' | 'Bank Transfer' | 'Cash'>('UPI');
  const [expStatus, setExpStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [expNotes, setExpNotes] = useState('');

  // Delete Expense Confirmation
  const [deleteExpId, setDeleteExpId] = useState<string | null>(null);

  // PAYROLL TAB STATE
  const [showPaySalaryModal, setShowPaySalaryModal] = useState(false);
  const [payingMember, setPayingMember] = useState<TeamMember | null>(null);
  const [salaryMonth, setSalaryMonth] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });
  const [payrollMethod, setPayrollMethod] = useState<'Bank Transfer' | 'UPI' | 'Cash'>('Bank Transfer');
  const [payrollNotes, setPayrollNotes] = useState('');

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // ── FINANCIAL KPI CALCULATIONS ──────────────────────────────
  const metrics = useMemo(() => {
    const totalRevenue = payments
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalExpenses = expenses
      .filter(e => e.status === 'Paid')
      .reduce((sum, e) => sum + e.amount, 0);

    const netProfit = totalRevenue - totalExpenses;
    const marginPercent = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      marginPercent
    };
  }, [payments, expenses]);

  // ── EXPENSE CATEGORY DISTRIBUTION (CHART DATA) ────────────────
  const categoryDistribution = useMemo(() => {
    const dist: Record<ExpenseCategory, number> = {
      'Salary': 0,
      'Vendor Sourcing': 0,
      'Marketing': 0,
      'Software': 0,
      'Other': 0
    };

    let total = 0;
    expenses.forEach(e => {
      if (e.status === 'Paid') {
        dist[e.category] += e.amount;
        total += e.amount;
      }
    });

    return {
      distribution: dist,
      total,
      breakdown: Object.keys(dist).map(catKey => {
        const amt = dist[catKey as ExpenseCategory];
        const pct = total > 0 ? Math.round((amt / total) * 100) : 0;
        return {
          category: catKey as ExpenseCategory,
          amount: amt,
          percentage: pct
        };
      }).sort((a, b) => b.amount - a.amount)
    };
  }, [expenses]);

  // ── FILTERED EXPENSES FOR LEDGER ─────────────────────────────
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        e.title.toLowerCase().includes(q) ||
        e.recipientName.toLowerCase().includes(q) ||
        (e.notes && e.notes.toLowerCase().includes(q)) ||
        e.id.toLowerCase().includes(q);
      
      const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || e.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, searchQuery, categoryFilter, statusFilter]);

  // ── PAYROLL MEMBER DATA WITH CURRENT MONTH SALARY STATUS ─────
  const payrollData = useMemo(() => {
    // Current month-year string for matching duplicate salaries
    const currentMonthLabel = salaryMonth;

    return teamMembers.map(m => {
      const memberRole = roles.find(r => r.id === m.roleId)?.name || 'Staff';
      
      // Check if this member has already been paid for the selected salary month
      // An expense matches if it belongs to 'Salary' category, links to member's id,
      // and has a title or note mentioning that specific month.
      const paidExpenses = expenses.filter(e => 
        e.category === 'Salary' &&
        e.recipientId === m.id &&
        e.status === 'Paid' &&
        (e.title.includes(currentMonthLabel) || (e.notes && e.notes.includes(currentMonthLabel)))
      );

      const isPaid = paidExpenses.length > 0;
      const lastPaymentDate = expenses
        .filter(e => e.category === 'Salary' && e.recipientId === m.id && e.status === 'Paid')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date || null;

      return {
        ...m,
        roleName: memberRole,
        isPaid,
        lastPaymentDate,
        paidExpensesCount: expenses.filter(e => e.category === 'Salary' && e.recipientId === m.id && e.status === 'Paid').length
      };
    });
  }, [teamMembers, roles, expenses, salaryMonth]);

  // ── SOURCING SPEND & MARGIN METRICS ──────────────────────────
  const sourcingMetrics = useMemo(() => {
    // Total vendor payments actually made from Expense ledger
    const totalSourcedExpense = expenses
      .filter(e => e.category === 'Vendor Sourcing' && e.status === 'Paid')
      .reduce((sum, e) => sum + e.amount, 0);

    // Vendor specific summary card data
    const vendorSummaries = vendors.map(v => {
      // Sourcing orders dispatched to this vendor
      const orders = vendorOrders.filter(o => o.vendorId === v.id);
      
      // Total amount paid to this vendor from Expenses
      const amountPaid = expenses
        .filter(e => e.category === 'Vendor Sourcing' && e.recipientId === v.id && e.status === 'Paid')
        .reduce((sum, e) => sum + e.amount, 0);

      // Average product cost-to-retail margin configured in catalog
      let totalMargins = 0;
      v.products.forEach(p => {
        if (p.retailPrice > 0) {
          totalMargins += ((p.retailPrice - p.costPrice) / p.retailPrice) * 100;
        }
      });
      const avgCatalogMargin = v.products.length > 0 ? Math.round(totalMargins / v.products.length) : 0;

      return {
        ...v,
        ordersCount: orders.length,
        amountPaid,
        avgCatalogMargin
      };
    });

    // Orders margin details
    const orderMargins = vendorOrders.map(vo => {
      // Look up vendor catalog to find cost price & retail price
      const vendorInfo = vendors.find(v => v.id === vo.vendorId);
      const catalogProduct = vendorInfo?.products.find(p => p.name === vo.productName);

      // Default or calculated costs
      const costPerItem = catalogProduct?.costPrice || 0;
      const retailPerItem = catalogProduct?.retailPrice || 0;

      const totalCost = costPerItem * vo.quantity;
      const totalRetail = retailPerItem * vo.quantity;
      const marginAmt = totalRetail - totalCost;
      const marginPct = totalRetail > 0 ? Math.round((marginAmt / totalRetail) * 100) : 0;

      return {
        ...vo,
        costPerItem,
        retailPerItem,
        totalCost,
        totalRetail,
        marginAmt,
        marginPct
      };
    });

    return {
      totalSourcedExpense,
      vendorSummaries,
      orderMargins
    };
  }, [vendors, vendorOrders, expenses]);

  // ── SAVE LEDGER EXPENSE HANDLER ──────────────────────────────
  const handleExpenseSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (expAmount <= 0) {
      alert('Please enter a valid expense amount.');
      return;
    }

    if (selectedExpense) {
      // Edit
      updateExpense(selectedExpense.id, {
        title: expTitle,
        amount: Number(expAmount),
        category: expCategory,
        date: expDate,
        recipientName: expRecipient,
        recipientId: expRecipientId || undefined,
        paymentMethod: expMethod,
        status: expStatus,
        notes: expNotes || undefined
      });
      showToast('Expense record updated successfully.');
    } else {
      // Create
      const newExp: Expense = {
        id: `exp-${Date.now()}`,
        title: expTitle,
        amount: Number(expAmount),
        category: expCategory,
        date: expDate,
        recipientName: expRecipient,
        recipientId: expRecipientId ? expRecipientId : undefined,
        paymentMethod: expMethod,
        status: expStatus,
        notes: expNotes ? expNotes : undefined
      };
      addExpense(newExp);
      showToast('New expense recorded.');
    }
    setShowExpenseModal(false);
    resetExpenseForm();
  };

  const resetExpenseForm = () => {
    setSelectedExpense(null);
    setExpTitle('');
    setExpAmount(0);
    setExpCategory('Other');
    setExpDate(new Date().toISOString().split('T')[0]);
    setExpRecipient('');
    setExpRecipientId('');
    setExpMethod('UPI');
    setExpStatus('Paid');
    setExpNotes('');
  };

  const openExpenseEdit = (e: Expense) => {
    setSelectedExpense(e);
    setExpTitle(e.title);
    setExpAmount(e.amount);
    setExpCategory(e.category);
    setExpDate(e.date);
    setExpRecipient(e.recipientName);
    setExpRecipientId(e.recipientId || '');
    setExpMethod(e.paymentMethod);
    setExpStatus(e.status);
    setExpNotes(e.notes || '');
    setShowExpenseModal(true);
  };

  const handleDeleteExpense = () => {
    if (deleteExpId) {
      deleteExpense(deleteExpId);
      setDeleteExpId(null);
      showToast('Expense record removed.');
    }
  };

  // ── PAYROLL EXECUTION HANDLER ────────────────────────────────
  const handlePaySalarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingMember || !payingMember.salary) return;

    // Check if duplicate month payout safety check is bypassed (though UI hides/disables it, safeguard here)
    const newSalaryExpense: Expense = {
      id: `exp-sal-${Date.now()}`,
      title: `Monthly Salary - ${payingMember.name} (${salaryMonth})`,
      amount: payingMember.salary,
      category: 'Salary',
      date: new Date().toISOString().split('T')[0],
      recipientName: payingMember.name,
      recipientId: payingMember.id,
      paymentMethod: payrollMethod === 'Bank Transfer' ? 'Bank Transfer' : payrollMethod === 'UPI' ? 'UPI' : 'Cash',
      status: 'Paid',
      notes: `Payroll processed for ${salaryMonth}. ${payrollNotes}`.trim()
    };

    addExpense(newSalaryExpense);
    showToast(`Salary of ${formatAmount(payingMember.salary)} paid to ${payingMember.name}.`);
    setShowPaySalaryModal(false);
    setPayingMember(null);
    setPayrollNotes('');
  };

  return (
    <div className="space-y-6 admin-animate-in relative">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[300] flex items-center gap-2.5 px-4.5 py-3.5 bg-[#1a1410] border border-[#D4AF37]/30 text-white rounded-xl shadow-2xl text-xs font-bold uppercase tracking-wider admin-scale-in">
          <Coins size={14} className="text-[#D4AF37] animate-bounce" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── TOP FINANCIAL METRICS CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="admin-card p-5 bg-[#faf8f5] flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Total Revenue</span>
            <span className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-[#1a1410] leading-none">{formatAmount(metrics.totalRevenue)}</p>
            <p className="text-[10px] text-gray-400 mt-1.5 font-medium">Aggregate Paid Invoice Receipts</p>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="admin-card p-5 bg-[#faf8f5] flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Total Expenses</span>
            <span className="w-8 h-8 rounded-lg bg-[#8B4949]/10 flex items-center justify-center text-[#8B4949]">
              <ArrowDownRight size={16} />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-[#8B4949] leading-none">{formatAmount(metrics.totalExpenses)}</p>
            <p className="text-[10px] text-gray-400 mt-1.5 font-medium">Payroll + Sourcing + Utilities</p>
          </div>
        </div>

        {/* Net Profit */}
        <div className={`admin-card p-5 flex flex-col justify-between relative overflow-hidden border ${
          metrics.netProfit >= 0 ? 'bg-green-50/30 border-green-200/50' : 'bg-red-50/30 border-red-200/50'
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Net Profit</span>
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              metrics.netProfit >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {metrics.netProfit >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            </span>
          </div>
          <div className="mt-4">
            <p className={`text-2xl font-black leading-none ${metrics.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {metrics.netProfit >= 0 ? '' : '-'}{formatAmount(Math.abs(metrics.netProfit))}
            </p>
            <p className="text-[10px] text-gray-400 mt-1.5 font-medium">Net Takeaway Margin</p>
          </div>
        </div>

        {/* Gross Margin % */}
        <div className="admin-card p-5 bg-[#faf8f5] flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Operating Margin</span>
            <span className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <Percent size={16} />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-[#1a1410] leading-none">{metrics.marginPercent.toFixed(1)}%</p>
            <p className="text-[10px] text-gray-400 mt-1.5 font-medium">Gross Return on Capital Spent</p>
          </div>
        </div>
      </div>

      {/* ── EXPENSE SHARE BREAKDOWN VISUAL Stack ── */}
      <div className="admin-card p-5 bg-white">
        <h4 className="text-xs font-bold text-[#1a1410] uppercase tracking-wider mb-3.5">Expense Budget Allocation (Sectors)</h4>
        
        {/* Progress Bar Stack */}
        <div className="h-4 w-full bg-[#f3ede3] rounded-full flex overflow-hidden">
          {categoryDistribution.breakdown.map((item, idx) => {
            if (item.amount <= 0) return null;
            // Distinct colors for each category
            const colors = {
              'Salary': '#8B4949', // Burgundy
              'Vendor Sourcing': '#D4AF37', // Gold
              'Marketing': '#3B82F6', // Blue
              'Software': '#8B5CF6', // Purple
              'Other': '#6B7280' // Gray
            };
            const col = colors[item.category] || '#9CA3AF';
            return (
              <div
                key={item.category}
                style={{ width: `${item.percentage}%`, backgroundColor: col }}
                title={`${item.category}: ${formatAmount(item.amount)} (${item.percentage}%)`}
              />
            );
          })}
        </div>

        {/* Legend pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          {categoryDistribution.breakdown.map(item => {
            const colors = {
              'Salary': 'bg-[#8B4949]',
              'Vendor Sourcing': 'bg-[#D4AF37]',
              'Marketing': 'bg-blue-500',
              'Software': 'bg-purple-500',
              'Other': 'bg-gray-400'
            };
            const colClass = colors[item.category] || 'bg-gray-400';
            return (
              <div key={item.category} className="flex items-center gap-2 text-xs">
                <span className={`w-3 h-3 rounded-md shrink-0 ${colClass}`} />
                <div className="truncate">
                  <p className="font-bold text-[#1a1410] text-[11px]">{item.category}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">{formatAmount(item.amount)} ({item.percentage}%)</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MAIN TABS SWITCHER & TOOLBAR ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Switcher */}
        <div className="flex bg-[#f5f0e8] p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'ledger' ? 'bg-[#8B4949] text-white shadow' : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            Expense Ledger
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'payroll' ? 'bg-[#8B4949] text-white shadow' : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            Payroll &amp; Salaries
          </button>
          <button
            onClick={() => setActiveTab('sourcing')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'sourcing' ? 'bg-[#8B4949] text-white shadow' : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            Sourcing Spend
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {activeTab === 'ledger' && (
            <>
              {/* Search input */}
              <div className="flex items-center gap-2 bg-white border border-[#e5e5e5] rounded-xl px-3.5 py-2 w-full sm:w-60 focus-within:border-[#8B4949] transition-all">
                <Search size={14} className="text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ledger receipts..."
                  className="bg-transparent border-none outline-none text-sm text-[#4a4a4a] placeholder-gray-400 w-full"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}>
                    <X size={13} className="text-gray-400" />
                  </button>
                )}
              </div>

              {/* Category dropdown filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="admin-select"
                style={{ width: 'auto', minWidth: '160px', paddingRight: '2.5rem' }}
              >
                <option value="All">All Categories</option>
                <option value="Salary">Salaries</option>
                <option value="Vendor Sourcing">Vendor Sourcing</option>
                <option value="Marketing">Marketing</option>
                <option value="Software">Software</option>
                <option value="Other">Other Expenses</option>
              </select>

              {/* Status dropdown filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="admin-select"
                style={{ width: 'auto', minWidth: '150px', paddingRight: '2.5rem' }}
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid Only</option>
                <option value="Pending">Pending Payouts</option>
              </select>

              {/* Add Expense Button */}
              <button
                onClick={() => { resetExpenseForm(); setShowExpenseModal(true); }}
                className="admin-btn admin-btn-primary"
              >
                <Plus size={14} /> Record Expense
              </button>
            </>
          )}

          {activeTab === 'payroll' && (
            <div className="flex items-center gap-2 bg-[#faf8f5] border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-500 font-semibold">
              <Calendar size={13} className="text-[#D4AF37]" />
              <span>Current Cycle: {salaryMonth}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── TAB 1: EXPENSE LEDGER ── */}
      {activeTab === 'ledger' && (
        <div className="admin-card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Voucher ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Recipient</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th>Payment Mode</th>
                  <th>Voucher Date</th>
                  <th>Status</th>
                  <th style={{ width: 110 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-400">
                      No expense records matching filter conditions.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map(e => (
                    <tr key={e.id}>
                      <td className="font-mono text-xs text-gray-400 font-bold">{e.id}</td>
                      <td>
                        <div>
                          <p className="font-bold text-sm text-[#1a1410]">{e.title}</p>
                          {e.notes && <p className="text-[10px] text-gray-400 truncate max-w-xs">{e.notes}</p>}
                        </div>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-info text-xs">{e.category}</span>
                      </td>
                      <td>
                        <span className="text-sm font-medium text-gray-600">{e.recipientName}</span>
                      </td>
                      <td className="font-bold text-right text-sm text-[#8B4949]">
                        {formatAmount(e.amount)}
                      </td>
                      <td>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#faf8f5] border border-gray-200 text-gray-600 inline-flex items-center gap-1">
                          <CreditCard size={10} className="text-[#D4AF37]" /> {e.paymentMethod}
                        </span>
                      </td>
                      <td className="text-xs text-gray-500">
                        {formatDate(e.date)}
                      </td>
                      <td>
                        <StatusBadge status={e.status} size="sm" />
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => openExpenseEdit(e)} className="admin-btn admin-btn-ghost admin-btn-icon" title="Edit voucher">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteExpId(e.id)} className="admin-btn admin-btn-ghost admin-btn-icon text-red-500 hover:bg-red-50" title="Delete record">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredExpenses.length > 0 && (
            <div className="px-5 py-4 border-t border-[#f0f0f0] flex justify-between items-center text-xs">
              <span className="text-gray-400">Showing {filteredExpenses.length} transaction entries</span>
              <span className="font-bold text-[#8B4949]">Total Ledger Sum: {formatAmount(filteredExpenses.reduce((s, x) => s + x.amount, 0))}</span>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: PAYROLL & SALARIES ── */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          {/* Payroll settings warning and selector */}
          <div className="admin-card p-4.5 bg-[#FFFDF9] border border-[#D4AF37]/25 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-[#D4AF37] mt-0.5 shrink-0" size={18} />
              <div>
                <h5 className="font-bold text-sm text-[#1a1410]">Monthly Payroll Batch processing</h5>
                <p className="text-xs text-gray-500 mt-1 leading-normal">
                  Salaries are defined directly in the team member profile. Paying salary records a corresponding paid expense under the "Salary" category for the selected team member. Duplicate payment safe-checks are verified before submission.
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase">Pay Run Cycle:</span>
              <select
                value={salaryMonth}
                onChange={(e) => setSalaryMonth(e.target.value)}
                className="bg-white border border-[#e5e5e5] rounded-xl px-3 py-1.5 text-xs text-[#4a4a4a] focus:border-[#8B4949] font-bold outline-none"
              >
                {/* Seed some months */}
                <option value="May 2026">May 2026</option>
                <option value="June 2026">June 2026</option>
                <option value="July 2026">July 2026</option>
                <option value="August 2026">August 2026</option>
              </select>
            </div>
          </div>

          {/* Team salaries list table */}
          <div className="admin-card !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Role Group</th>
                    <th>WhatsApp Contact</th>
                    <th>Payment Frequency</th>
                    <th>Compensation Rate</th>
                    <th>Cycle Payout Status</th>
                    <th>Past Cycles Paid</th>
                    <th style={{ width: 150 }}>Payout Dispatch</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollData.map(m => (
                    <tr key={m.id}>
                      <td>
                        <div>
                          <p className="font-bold text-sm text-[#1a1410]">{m.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">ID: {m.id} · Joined: {m.joinedAt}</p>
                        </div>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-info text-xs">{m.roleName}</span>
                      </td>
                      <td>
                        <span className="text-xs text-gray-600 font-medium">{m.phone || 'Not Configured'}</span>
                      </td>
                      <td>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#faf8f5] border border-gray-200 text-gray-500">
                          {m.paymentFrequency || 'Monthly'}
                        </span>
                      </td>
                      <td>
                        <span className="font-bold text-sm text-[#1a1410]">
                          {m.salary ? formatAmount(m.salary) : '₹0'}
                        </span>
                      </td>
                      <td>
                        {m.isPaid ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 border border-green-200 text-green-700 inline-flex items-center gap-1">
                            <CheckCircle2 size={10} /> Disbursed ({salaryMonth})
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-700 inline-flex items-center gap-1">
                            <AlertCircle size={10} /> Payout Unpaid
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="text-xs font-bold text-gray-400">{m.paidExpensesCount} months logged</span>
                      </td>
                      <td>
                        {m.status === 'Inactive' ? (
                          <span className="text-xs text-gray-400 italic font-medium">Inactive Employee</span>
                        ) : m.isPaid ? (
                          <button
                            disabled
                            className="w-full py-1.5 px-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-400 text-xs font-bold cursor-not-allowed text-center"
                          >
                            Disbursed
                          </button>
                        ) : !m.salary ? (
                          <span className="text-xs text-gray-400 italic">No Salary Defined</span>
                        ) : (
                          <button
                            onClick={() => {
                              setPayingMember(m);
                              setPayrollNotes(`Payout for ${salaryMonth}`);
                              setShowPaySalaryModal(true);
                            }}
                            className="w-full py-1.5 px-3 rounded-lg bg-[#8B4949] hover:bg-[#723b3b] text-white text-xs font-bold transition-all text-center"
                          >
                            Pay Salary
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: SOURCING SPEND & VENDORS ── */}
      {activeTab === 'sourcing' && (
        <div className="space-y-6">
          {/* Vendor lists spend summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Vendor profiles list with aggregation spend */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold text-[#1a1410] uppercase tracking-wider">Vendor Aggregate Sourcing Spend Ledger</h4>
              <div className="admin-card !p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Company Name</th>
                        <th>Sourcing Type</th>
                        <th>Active Orders</th>
                        <th style={{ textAlign: 'right' }}>Total Wholesale Paid</th>
                        <th>Avg catalog Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sourcingMetrics.vendorSummaries.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-6 text-gray-400">No vendor sourcing records.</td>
                        </tr>
                      ) : (
                        sourcingMetrics.vendorSummaries.map(vs => (
                          <tr key={vs.id}>
                            <td>
                              <div>
                                <p className="font-bold text-sm text-[#1a1410]">{vs.companyName}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">Rep: {vs.name} · WhatsApp: {vs.phone}</p>
                              </div>
                            </td>
                            <td>
                              <span className="admin-badge admin-badge-info text-xs">{vs.category}</span>
                            </td>
                            <td>
                              <span className="px-2.5 py-0.5 rounded-lg bg-gray-100 text-xs font-bold text-gray-600">{vs.ordersCount} dispatches</span>
                            </td>
                            <td className="font-bold text-right text-sm text-[#8B4949]">
                              {formatAmount(vs.amountPaid)}
                            </td>
                            <td>
                              <span className="px-2.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold">
                                {vs.avgCatalogMargin}% Margin
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sourcing margins analytics explanation */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#1a1410] uppercase tracking-wider">Margin Tracking Mechanics</h4>
              <div className="admin-card bg-[#faf8f5] p-5 space-y-4">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#8B4949]/10 text-[#8B4949] flex items-center justify-center shrink-0">
                    <Factory size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#1a1410] uppercase tracking-wider">Wholesale Sourcing</h5>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Tracking expenses spent directly on sourcing lets us verify actual net margins relative to client order payments.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center shrink-0">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#1a1410] uppercase tracking-wider">Retail vs Cost Prices</h5>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Individual catalog products (configured in the Vendors panel) track the markup percentage (Retail Price vs Wholesale Cost Price) to maximize product design value.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#8B4949]/5 rounded-xl border border-[#8B4949]/10 text-xs text-[#8B4949] font-medium leading-relaxed">
                  Total Vendor Sourcing Ledger Outflow: <span className="font-black">{formatAmount(sourcingMetrics.totalSourcedExpense)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Sourcing Orders list with margin calculation breakdown */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#1a1410] uppercase tracking-wider">Sourcing orders Margins Breakdown</h4>
            <div className="admin-card !p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sourcing ID</th>
                      <th>Client Order</th>
                      <th>Fulfillment Vendor</th>
                      <th>Product Sourced</th>
                      <th>Quantity</th>
                      <th style={{ textAlign: 'right' }}>Wholesale Cost (Total)</th>
                      <th style={{ textAlign: 'right' }}>Retail Price (Total)</th>
                      <th style={{ textAlign: 'right' }}>Profit Margin</th>
                      <th>Margin %</th>
                      <th>Dispatch Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sourcingMetrics.orderMargins.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-6 text-gray-400">No vendor sourcing order dispatches.</td>
                      </tr>
                    ) : (
                      sourcingMetrics.orderMargins.map(om => (
                        <tr key={om.id}>
                          <td className="font-mono text-xs text-gray-400 font-bold">{om.id}</td>
                          <td><span className="font-bold text-sm text-[#8B4949]">{om.clientOrderId}</span></td>
                          <td><p className="text-sm font-medium text-gray-600">{om.vendorName}</p></td>
                          <td><p className="font-bold text-sm text-[#1a1410]">{om.productName}</p></td>
                          <td><span className="px-2 py-0.5 rounded bg-gray-100 text-xs font-semibold text-gray-600">{om.quantity} pcs</span></td>
                          <td className="font-semibold text-right text-gray-500">
                            {formatAmount(om.totalCost)}
                            <p className="text-[9px] text-gray-400 mt-0.5">{formatAmount(om.costPerItem)}/pc</p>
                          </td>
                          <td className="font-semibold text-right text-[#8B4949]">
                            {formatAmount(om.totalRetail)}
                            <p className="text-[9px] text-gray-400 mt-0.5">{formatAmount(om.retailPerItem)}/pc</p>
                          </td>
                          <td className="font-bold text-right text-green-600">{formatAmount(om.marginAmt)}</td>
                          <td>
                            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                              om.marginPct >= 50
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : om.marginPct >= 35
                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                : 'bg-red-50 border-red-200 text-red-700'
                            }`}>
                              {om.marginPct}%
                            </span>
                          </td>
                          <td>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border capitalize ${
                              om.status === 'Delivered'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : om.status === 'Shipped'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : om.status === 'Printed'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {om.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EXPENSE DIALOG MODAL (ADD / EDIT) ── */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowExpenseModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 admin-scale-in">
            <button onClick={() => setShowExpenseModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-[#1a1410] mb-4">
              {selectedExpense ? 'Edit Expense Record' : 'Record New Expense'}
            </h3>
            
            <form onSubmit={handleExpenseSave} className="space-y-4">
              <div>
                <label className="admin-label">Expense Title / Description</label>
                <input
                  type="text"
                  required
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  placeholder="e.g. Server Hosting Fee, Monthly Utilities"
                  className="admin-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Outflow Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={expAmount}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Expense Category</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                    className="admin-select font-medium"
                  >
                    <option value="Salary">Salary</option>
                    <option value="Vendor Sourcing">Vendor Sourcing</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Software">Software</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Voucher Date</label>
                  <input
                    type="date"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Payment Mode</label>
                  <select
                    value={expMethod}
                    onChange={(e) => setExpMethod(e.target.value as any)}
                    className="admin-select"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Recipient / Payee Name</label>
                  <input
                    type="text"
                    required
                    value={expRecipient}
                    onChange={(e) => setExpRecipient(e.target.value)}
                    placeholder="e.g. AWS Inc., Team Member"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Associated Payee ID (Optional)</label>
                  <select
                    value={expRecipientId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setExpRecipientId(id);
                      // Auto-fill recipient name if team member/vendor is selected
                      if (id) {
                        const m = teamMembers.find(t => t.id === id);
                        const v = vendors.find(vend => vend.id === id);
                        if (m) setExpRecipient(m.name);
                        else if (v) setExpRecipient(v.companyName);
                      }
                    }}
                    className="admin-select"
                  >
                    <option value="">-- No Link --</option>
                    <optgroup label="Team Members">
                      {teamMembers.map(m => (
                        <option key={m.id} value={m.id}>{m.name} (Salary)</option>
                      ))}
                    </optgroup>
                    <optgroup label="Sourcing Vendors">
                      {vendors.map(v => (
                        <option key={v.id} value={v.id}>{v.companyName} (Vendor)</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className="admin-label">Ledger Payment Status</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1410] cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={expStatus === 'Paid'}
                      onChange={() => setExpStatus('Paid')}
                      className="accent-[#8B4949]"
                    />
                    Paid Out
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1410] cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={expStatus === 'Pending'}
                      onChange={() => setExpStatus('Pending')}
                      className="accent-[#8B4949]"
                    />
                    Pending Settlement
                  </label>
                </div>
              </div>

              <div>
                <label className="admin-label">Notes / Remarks</label>
                <textarea
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  placeholder="Additional invoice reference numbers, terms..."
                  className="admin-input min-h-16 py-2"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-gray-500 font-bold text-xs hover:bg-[#faf8f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#8B4949] text-white rounded-xl font-bold text-xs hover:bg-[#723b3b]"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PAYROLL DISPATCH MODAL ── */}
      {showPaySalaryModal && payingMember && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaySalaryModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 admin-scale-in">
            <button onClick={() => setShowPaySalaryModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
            <h3 className="text-base font-bold text-[#1a1410] mb-3">
              Confirm Salary Disbursement
            </h3>
            
            <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#f0ece4] mb-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Employee:</span>
                <span className="font-bold text-[#1a1410]">{payingMember.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Role:</span>
                <span className="font-medium text-gray-600">{payingMember.phone || 'Staff'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Monthly Compensation:</span>
                <span className="font-black text-[#8B4949]">{payingMember.salary ? formatAmount(payingMember.salary) : '₹0'}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-1.5 mt-1">
                <span className="text-gray-400 font-bold">Pay Period Cycle:</span>
                <span className="font-bold text-[#D4AF37]">{salaryMonth}</span>
              </div>
            </div>

            <form onSubmit={handlePaySalarySubmit} className="space-y-4">
              <div>
                <label className="admin-label">Payment Channel</label>
                <select
                  value={payrollMethod}
                  onChange={(e) => setPayrollMethod(e.target.value as any)}
                  className="admin-select"
                >
                  <option value="Bank Transfer">Bank Transfer (IMPS/NEFT)</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash Handout</option>
                </select>
              </div>

              <div>
                <label className="admin-label">Payroll Memo Notes</label>
                <input
                  type="text"
                  value={payrollNotes}
                  onChange={(e) => setPayrollNotes(e.target.value)}
                  placeholder="e.g. Transaction Ref, Bonus added..."
                  className="admin-input"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaySalaryModal(false)}
                  className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-gray-500 font-bold text-xs hover:bg-[#faf8f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#8B4949] text-white rounded-xl font-bold text-xs hover:bg-[#723b3b]"
                >
                  Authorize Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE DIALOG ── */}
      <ConfirmDialog
        isOpen={!!deleteExpId}
        onClose={() => setDeleteExpId(null)}
        onConfirm={handleDeleteExpense}
        title="Delete Expense Record?"
        message="Are you sure you want to permanently delete this expense voucher? This action will immediately remove the record from ledger calculations and cannot be undone."
      />

    </div>
  );
}
