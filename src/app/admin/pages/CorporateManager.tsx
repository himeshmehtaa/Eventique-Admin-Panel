import { useState, useMemo } from 'react';
import {
  Briefcase, Search, Plus, Edit2, Trash2, Building,
  Phone, Mail, FileText, CheckCircle2, Calendar, TrendingUp,
  Percent, ChevronRight, X, IndianRupee, Layers, ShoppingBag
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusBadge } from '../components/StatusBadge';
import type { CorporateLead, CorporateOrder, CorporateLeadStatus, CorporateOrderStatus } from '../types';

export default function CorporateManager() {
  const {
    state,
    addCorporateLead,
    updateCorporateLead,
    deleteCorporateLead,
    addCorporateOrder,
    updateCorporateOrder,
    deleteCorporateOrder,
    convertCorporateLeadToOrder
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'leads' | 'orders'>('leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<CorporateLeadStatus | 'All'>('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState<CorporateOrderStatus | 'All'>('All');

  // Modals state
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<CorporateLead | null>(null);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CorporateOrder | null>(null);

  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertLeadId, setConvertLeadId] = useState<string | null>(null);

  // Lead Form Fields
  const [leadCompany, setLeadCompany] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadProduct, setLeadProduct] = useState('');
  const [leadQty, setLeadQty] = useState(100);
  const [leadBudget, setLeadBudget] = useState(50000);
  const [leadStatus, setLeadStatus] = useState<CorporateLeadStatus>('New');
  const [leadNotes, setLeadNotes] = useState('');

  // Order Form Fields
  const [orderCompany, setOrderCompany] = useState('');
  const [orderContact, setOrderContact] = useState('');
  const [orderEmail, setOrderEmail] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderProduct, setOrderProduct] = useState('');
  const [orderQty, setOrderQty] = useState(100);
  const [orderPrice, setOrderPrice] = useState(150);
  const [orderGst, setOrderGst] = useState('');
  const [orderStatus, setOrderStatus] = useState<CorporateOrderStatus>('Planning');
  const [orderDate, setOrderDate] = useState('');

  // Conversion Form Fields
  const [convertPrice, setConvertPrice] = useState(150);
  const [convertGst, setConvertGst] = useState('');

  // Delete dialogs
  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);

  // ── Metrics ──────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const activeLeadsVal = state.corporateLeads
      .filter(l => l.status !== 'Lost')
      .reduce((sum, l) => sum + l.budget, 0);

    const activeOrdersVal = state.corporateOrders
      .reduce((sum, o) => sum + o.total, 0);

    const totalOrdersQty = state.corporateOrders
      .reduce((sum, o) => sum + o.qty, 0);

    return {
      activeLeadsVal,
      activeOrdersVal,
      totalOrdersQty,
      leadsCount: state.corporateLeads.length,
      ordersCount: state.corporateOrders.length
    };
  }, [state.corporateLeads, state.corporateOrders]);

  // ── Filters & Search ─────────────────────────────────────────
  const filteredLeads = useMemo(() => {
    return state.corporateLeads.filter(l => {
      const matchSearch =
        l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.product.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = leadStatusFilter === 'All' || l.status === leadStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [state.corporateLeads, searchQuery, leadStatusFilter]);

  const filteredOrders = useMemo(() => {
    return state.corporateOrders.filter(o => {
      const matchSearch =
        o.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.product.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [state.corporateOrders, searchQuery, orderStatusFilter]);

  // ── Save Handlers ────────────────────────────────────────────
  const handleLeadSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLead) {
      updateCorporateLead(selectedLead.id, {
        company: leadCompany,
        contact: leadContact,
        email: leadEmail,
        phone: leadPhone,
        product: leadProduct,
        qty: leadQty,
        budget: leadBudget,
        status: leadStatus,
        notes: leadNotes
      });
    } else {
      addCorporateLead({
        id: `CL-${Math.floor(Math.random() * 900 + 100)}`,
        company: leadCompany,
        contact: leadContact,
        email: leadEmail,
        phone: leadPhone,
        product: leadProduct,
        qty: leadQty,
        budget: leadBudget,
        status: leadStatus,
        notes: leadNotes,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    setShowLeadModal(false);
    resetLeadForm();
  };

  const handleOrderSave = (e: React.FormEvent) => {
    e.preventDefault();
    const total = orderQty * orderPrice;
    if (selectedOrder) {
      updateCorporateOrder(selectedOrder.id, {
        company: orderCompany,
        contact: orderContact,
        email: orderEmail,
        phone: orderPhone,
        product: orderProduct,
        qty: orderQty,
        pricePerUnit: orderPrice,
        total,
        gst: orderGst,
        status: orderStatus
      });
    } else {
      addCorporateOrder({
        id: `CO-${Math.floor(Math.random() * 900 + 100)}`,
        company: orderCompany,
        contact: orderContact,
        email: orderEmail,
        phone: orderPhone,
        product: orderProduct,
        qty: orderQty,
        pricePerUnit: orderPrice,
        total,
        gst: orderGst,
        status: orderStatus,
        date: orderDate || new Date().toISOString().split('T')[0]
      });
    }
    setShowOrderModal(false);
    resetOrderForm();
  };

  const handleConversionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (convertLeadId) {
      convertCorporateLeadToOrder(convertLeadId, convertPrice, convertGst);
      setConvertLeadId(null);
      setShowConvertModal(false);
    }
  };

  const openLeadEdit = (l: CorporateLead) => {
    setSelectedLead(l);
    setLeadCompany(l.company);
    setLeadContact(l.contact);
    setLeadEmail(l.email);
    setLeadPhone(l.phone);
    setLeadProduct(l.product);
    setLeadQty(l.qty);
    setLeadBudget(l.budget);
    setLeadStatus(l.status);
    setLeadNotes(l.notes);
    setShowLeadModal(true);
  };

  const openOrderEdit = (o: CorporateOrder) => {
    setSelectedOrder(o);
    setOrderCompany(o.company);
    setOrderContact(o.contact);
    setOrderEmail(o.email);
    setOrderPhone(o.phone);
    setOrderProduct(o.product);
    setOrderQty(o.qty);
    setOrderPrice(o.pricePerUnit);
    setOrderGst(o.gst);
    setOrderStatus(o.status);
    setOrderDate(o.date);
    setShowOrderModal(true);
  };

  const openConvertModal = (leadId: string, leadQty: number, leadBudget: number) => {
    setConvertLeadId(leadId);
    setConvertPrice(leadQty > 0 ? Math.round(leadBudget / leadQty) : 100);
    setConvertGst('');
    setShowConvertModal(true);
  };

  const resetLeadForm = () => {
    setSelectedLead(null);
    setLeadCompany('');
    setLeadContact('');
    setLeadEmail('');
    setLeadPhone('');
    setLeadProduct('');
    setLeadQty(100);
    setLeadBudget(50000);
    setLeadStatus('New');
    setLeadNotes('');
  };

  const resetOrderForm = () => {
    setSelectedOrder(null);
    setOrderCompany('');
    setOrderContact('');
    setOrderEmail('');
    setOrderPhone('');
    setOrderProduct('');
    setOrderQty(100);
    setOrderPrice(150);
    setOrderGst('');
    setOrderStatus('Planning');
    setOrderDate('');
  };

  return (
    <div className="space-y-6 admin-animate-in">
      {/* ── Tabs and Headers ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="inline-flex bg-[#f5f0e8] p-1 rounded-xl shadow-sm border border-gray-200/50">
          <button
            onClick={() => { setActiveTab('leads'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'leads' ? 'bg-[#8B4949] text-white shadow-sm' : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            <Briefcase size={16} />
            B2B Leads ({metrics.leadsCount})
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'orders' ? 'bg-[#8B4949] text-white shadow-sm' : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            <ShoppingBag size={16} />
            Bulk Orders ({metrics.ordersCount})
          </button>
        </div>

        <button
          onClick={() => {
            if (activeTab === 'leads') { resetLeadForm(); setShowLeadModal(true); }
            else { resetOrderForm(); setShowOrderModal(true); }
          }}
          className="admin-btn admin-btn-primary flex items-center gap-2 self-end"
        >
          <Plus size={16} />
          {activeTab === 'leads' ? 'Add B2B Lead' : 'Create Bulk Order'}
        </button>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-card flex items-center justify-between p-5">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Pipeline Value</p>
            <p className="text-2xl font-extrabold text-[#1a1410] mt-1">₹{metrics.activeLeadsVal.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-10 h-10 bg-[#8B4949]/10 rounded-xl flex items-center justify-center text-[#8B4949]">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="admin-card flex items-center justify-between p-5">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Bulk Order Value</p>
            <p className="text-2xl font-extrabold text-[#1a1410] mt-1">₹{metrics.activeOrdersVal.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center text-[#D4AF37]">
            <IndianRupee size={20} />
          </div>
        </div>

        <div className="admin-card flex items-center justify-between p-5">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Bulk Quantity</p>
            <p className="text-2xl font-extrabold text-[#1a1410] mt-1">{metrics.totalOrdersQty.toLocaleString('en-IN')} pcs</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Layers size={20} />
          </div>
        </div>

        <div className="admin-card flex items-center justify-between p-5">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Conversion Ratio</p>
            <p className="text-2xl font-extrabold text-[#1a1410] mt-1">
              {metrics.leadsCount > 0 ? Math.round((metrics.ordersCount / (metrics.leadsCount + metrics.ordersCount)) * 100) : 0}%
            </p>
          </div>
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <Percent size={20} />
          </div>
        </div>
      </div>

      {/* ── Toolbar / Filter deck ── */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-150 shadow-sm">
        <div className="flex items-center gap-2 bg-[#faf8f5] border border-gray-250 rounded-xl px-3 py-2 w-full sm:w-80 focus-within:border-[#8B4949] transition-all">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder={activeTab === 'leads' ? "Search B2B leads..." : "Search bulk orders..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs w-full focus:outline-none text-[#1a1410]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <label className="text-xs text-gray-400 font-bold uppercase tracking-wider flex-shrink-0">Filter Status:</label>
          {activeTab === 'leads' ? (
            <select
              value={leadStatusFilter}
              onChange={(e) => setLeadStatusFilter(e.target.value as any)}
              className="admin-input !py-1.5 !px-3 !w-auto text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Lost">Lost</option>
            </select>
          ) : (
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value as any)}
              className="admin-input !py-1.5 !px-3 !w-auto text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="Sourcing">Sourcing</option>
              <option value="Printing">Printing</option>
              <option value="Packaging">Packaging</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
            </select>
          )}
        </div>
      </div>

      {/* ── Tab 1: Leads Directory ── */}
      {activeTab === 'leads' && (
        <div className="admin-card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Lead Details</th>
                  <th>Contact Details</th>
                  <th>Product & Quantity</th>
                  <th>Target Budget</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No corporate B2B leads found.</td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#faf8f5]/50 transition-colors">
                      <td>
                        <p className="font-extrabold text-[#8B4949] text-sm">{lead.company}</p>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">{lead.contact}</p>
                      </td>
                      <td>
                        <div className="space-y-0.5 text-xs text-gray-600 font-medium">
                          <p className="flex items-center gap-1.5"><Mail size={12} className="text-gray-400" /> {lead.email}</p>
                          <p className="flex items-center gap-1.5"><Phone size={12} className="text-gray-400" /> {lead.phone}</p>
                        </div>
                      </td>
                      <td>
                        <p className="font-bold text-[#1a1410] text-xs">{lead.product}</p>
                        <p className="text-xs text-[#D4AF37] font-bold mt-0.5">{lead.qty.toLocaleString('en-IN')} pcs</p>
                      </td>
                      <td>
                        <p className="font-extrabold text-[#1a1410] text-sm">₹{lead.budget.toLocaleString('en-IN')}</p>
                      </td>
                      <td>
                        <StatusBadge status={lead.status} />
                      </td>
                      <td>
                        <span className="text-xs text-gray-400 font-medium">{lead.createdAt}</span>
                      </td>
                      <td className="text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {lead.status !== 'Lost' && (
                            <button
                              onClick={() => openConvertModal(lead.id, lead.qty, lead.budget)}
                              className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-[10px] font-bold shadow-sm transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 size={12} /> Convert
                            </button>
                          )}
                          <button
                            onClick={() => openLeadEdit(lead)}
                            className="p-1.5 text-gray-400 hover:text-[#8B4949] hover:bg-[#8B4949]/5 rounded-lg transition-colors"
                            title="Edit Lead"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteLeadId(lead.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Lead"
                          >
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
        </div>
      )}

      {/* ── Tab 2: Bulk Orders Directory ── */}
      {activeTab === 'orders' && (
        <div className="admin-card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Client Company</th>
                  <th>Contact</th>
                  <th>Product Details</th>
                  <th>Volume / Total</th>
                  <th>GSTIN</th>
                  <th>Fulfillment</th>
                  <th>Order Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-400 text-sm">No corporate bulk orders found.</td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#faf8f5]/50 transition-colors">
                      <td className="font-extrabold text-[#8B4949] text-xs">{order.id}</td>
                      <td>
                        <p className="font-extrabold text-[#1a1410] text-sm">{order.company}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{order.email}</p>
                      </td>
                      <td className="text-xs text-gray-600 font-medium">
                        <p>{order.contact}</p>
                        <p className="text-[10px] text-gray-400">{order.phone}</p>
                      </td>
                      <td>
                        <p className="font-bold text-[#1a1410] text-xs">{order.product}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">₹{order.pricePerUnit}/unit</p>
                      </td>
                      <td>
                        <p className="font-bold text-xs text-[#1a1410]">{order.qty.toLocaleString('en-IN')} units</p>
                        <p className="font-extrabold text-[#8B4949] text-sm mt-0.5">₹{order.total.toLocaleString('en-IN')}</p>
                      </td>
                      <td>
                        <span className="font-mono text-xs text-gray-500">{order.gst || 'N/A'}</span>
                      </td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => updateCorporateOrder(order.id, { status: e.target.value as CorporateOrderStatus })}
                          className="admin-input !py-1 !px-2 !w-auto text-[11px] font-bold border-gray-250 cursor-pointer"
                        >
                          <option value="Planning">Planning</option>
                          <option value="Sourcing">Sourcing</option>
                          <option value="Printing">Printing</option>
                          <option value="Packaging">Packaging</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td>
                        <span className="text-xs text-gray-400 font-medium">{order.date}</span>
                      </td>
                      <td className="text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openOrderEdit(order)}
                            className="p-1.5 text-gray-400 hover:text-[#8B4949] hover:bg-[#8B4949]/5 rounded-lg transition-colors"
                            title="Edit Order"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteOrderId(order.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Order"
                          >
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
        </div>
      )}

      {/* ── MODAL: Create / Edit B2B Lead ── */}
      {showLeadModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLeadModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 admin-scale-in">
            <button onClick={() => setShowLeadModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-[#1a1410] mb-4">
              {selectedLead ? 'Edit B2B Corporate Lead' : 'Add New B2B Lead'}
            </h3>
            <form onSubmit={handleLeadSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Company Name *</label>
                  <input type="text" required value={leadCompany} onChange={(e) => setLeadCompany(e.target.value)} placeholder="e.g. Infosys" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Contact Person *</label>
                  <input type="text" required value={leadContact} onChange={(e) => setLeadContact(e.target.value)} placeholder="Full Name" className="admin-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Email Address *</label>
                  <input type="email" required value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} placeholder="e.g. admin@infosys.com" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Phone Number *</label>
                  <input type="text" required value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="admin-input" />
                </div>
              </div>

              <div>
                <label className="admin-label">Product / Packaging Type *</label>
                <input type="text" required value={leadProduct} onChange={(e) => setLeadProduct(e.target.value)} placeholder="e.g. Silver Trim Stationery Sets" className="admin-input" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Inquiry Qty (pcs)</label>
                  <input type="number" required min={1} value={leadQty} onChange={(e) => setLeadQty(Number(e.target.value))} className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Target Budget (₹)</label>
                  <input type="number" required min={1} value={leadBudget} onChange={(e) => setLeadBudget(Number(e.target.value))} className="admin-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Status</label>
                  <select value={leadStatus} onChange={(e) => setLeadStatus(e.target.value as CorporateLeadStatus)} className="admin-input">
                    <option value="New">New</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="admin-label">Deal / Interaction Notes</label>
                <textarea rows={2} value={leadNotes} onChange={(e) => setLeadNotes(e.target.value)} placeholder="Key inquiries, requirements..." className="admin-textarea" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowLeadModal(false)} className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-gray-500 font-bold text-xs hover:bg-[#faf8f5] transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#8B4949] text-white rounded-xl font-bold text-xs hover:bg-[#723b3b] shadow-sm transition-colors">
                  {selectedLead ? 'Save Changes' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Create / Edit Bulk Order ── */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowOrderModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 admin-scale-in">
            <button onClick={() => setShowOrderModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-[#1a1410] mb-4">
              {selectedOrder ? 'Edit Corporate Bulk Order' : 'Create Bulk Order Manual Entry'}
            </h3>
            <form onSubmit={handleOrderSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Client Company *</label>
                  <input type="text" required value={orderCompany} onChange={(e) => setOrderCompany(e.target.value)} placeholder="Company Name" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Contact Person *</label>
                  <input type="text" required value={orderContact} onChange={(e) => setOrderContact(e.target.value)} placeholder="Full Name" className="admin-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Email Address</label>
                  <input type="email" required value={orderEmail} onChange={(e) => setOrderEmail(e.target.value)} placeholder="email@address.com" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Phone Number</label>
                  <input type="text" required value={orderPhone} onChange={(e) => setOrderPhone(e.target.value)} placeholder="Phone" className="admin-input" />
                </div>
              </div>

              <div>
                <label className="admin-label">Bulk Product Item Description *</label>
                <input type="text" required value={orderProduct} onChange={(e) => setOrderProduct(e.target.value)} placeholder="e.g. Printed Luxury Gift Boxes" className="admin-input" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="admin-label">Qty (pcs) *</label>
                  <input type="number" required min={1} value={orderQty} onChange={(e) => setOrderQty(Number(e.target.value))} className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Unit Cost (₹) *</label>
                  <input type="number" required min={0} value={orderPrice} onChange={(e) => setOrderPrice(Number(e.target.value))} className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">GSTIN (15-char)</label>
                  <input type="text" maxLength={15} value={orderGst} onChange={(e) => setOrderGst(e.target.value.toUpperCase())} placeholder="e.g. 27AAA..." className="admin-input font-mono uppercase" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Fulfillment Status</label>
                  <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value as CorporateOrderStatus)} className="admin-input">
                    <option value="Planning">Planning</option>
                    <option value="Sourcing">Sourcing</option>
                    <option value="Printing">Printing</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                {!selectedOrder && (
                  <div>
                    <label className="admin-label">Order Date</label>
                    <input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} className="admin-input" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowOrderModal(false)} className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-gray-500 font-bold text-xs hover:bg-[#faf8f5]">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#8B4949] text-white rounded-xl font-bold text-xs hover:bg-[#723b3b] shadow-sm">
                  {selectedOrder ? 'Save Changes' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Convert B2B Lead to Bulk Order ── */}
      {showConvertModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConvertModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 admin-scale-in">
            <button onClick={() => setShowConvertModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-[#1a1410] mb-2 flex items-center gap-2">
              <CheckCircle2 className="text-green-500" size={20} />
              Convert B2B Lead to Order
            </h3>
            <p className="text-xs text-gray-400 mb-4">Specify closing unit pricing and company GST details below.</p>
            <form onSubmit={handleConversionSubmit} className="space-y-4">
              <div>
                <label className="admin-label">Negotiated Price Per Unit (₹) *</label>
                <input type="number" required min={0} value={convertPrice} onChange={(e) => setConvertPrice(Number(e.target.value))} className="admin-input font-bold text-green-600" />
              </div>

              <div>
                <label className="admin-label">GSTIN Identification Code</label>
                <input type="text" maxLength={15} value={convertGst} onChange={(e) => setConvertGst(e.target.value.toUpperCase())} placeholder="e.g. 27AAACT1234F1Z9" className="admin-input font-mono uppercase" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowConvertModal(false)} className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-gray-500 font-bold text-xs hover:bg-[#faf8f5]">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-bold text-xs hover:bg-green-600 shadow-sm">
                  Convert Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Lead Dialog */}
      <ConfirmDialog
        open={!!deleteLeadId}
        title="Delete B2B Corporate Lead"
        message="Are you sure you want to delete this lead? This action is permanent."
        confirmLabel="Delete Lead"
        onConfirm={() => { if (deleteLeadId) { deleteCorporateLead(deleteLeadId); setDeleteLeadId(null); } }}
        onCancel={() => setDeleteLeadId(null)}
        danger
      />

      {/* Delete Order Dialog */}
      <ConfirmDialog
        open={!!deleteOrderId}
        title="Delete Bulk Order Entry"
        message="Are you sure you want to delete this corporate order entry? This action is permanent."
        confirmLabel="Delete Order"
        onConfirm={() => { if (deleteOrderId) { deleteCorporateOrder(deleteOrderId); setDeleteOrderId(null); } }}
        onCancel={() => setDeleteOrderId(null)}
        danger
      />
    </div>
  );
}
