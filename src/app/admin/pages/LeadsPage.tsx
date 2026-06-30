import { useState, useMemo } from 'react';
import {
  Users, Search, Plus, Edit2, Trash2, Phone, Mail,
  Sparkles, CheckCircle2, X, TrendingUp, BarChart3,
  Percent, ArrowRight, UserCheck, Megaphone, Inbox
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusBadge } from '../components/StatusBadge';
import type { ClientLead, VendorLead, PlannerLead, ClientLeadStatus, ClientLeadTag, VendorLeadStatus, PlannerLeadStatus } from '../types';

export default function LeadsPage() {
  const {
    state,
    addClientLead,
    updateClientLead,
    deleteClientLead,
    addVendorLead,
    updateVendorLead,
    deleteVendorLead,
    addPlannerLead,
    updatePlannerLead,
    deletePlannerLead,
    simulateLiveInquiry
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'client' | 'vendor' | 'planner'>('client');
  const [searchQuery, setSearchQuery] = useState('');

  // Client leads filters
  const [tagFilter, setTagFilter] = useState<ClientLeadTag | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<ClientLeadStatus | 'All'>('All');

  // Vendor leads filters
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState<'All' | 'Printed Stationery' | 'Printed Invites' | 'Gifts'>('All');
  const [vendorStatusFilter, setVendorStatusFilter] = useState<VendorLeadStatus | 'All'>('All');

  // Planner leads filters
  const [plannerStatusFilter, setPlannerStatusFilter] = useState<PlannerLeadStatus | 'All'>('All');

  // Modals state
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClientLead, setSelectedClientLead] = useState<ClientLead | null>(null);

  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendorLead, setSelectedVendorLead] = useState<VendorLead | null>(null);

  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [selectedPlannerLead, setSelectedPlannerLead] = useState<PlannerLead | null>(null);

  // Client form fields
  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cEventType, setCEventType] = useState<ClientLead['eventType']>('Wedding');
  const [cProduct, setCProduct] = useState('');
  const [cBudget, setCBudget] = useState(15000);
  const [cSource, setCSource] = useState<ClientLead['source']>('Website Form');
  const [cStatus, setCStatus] = useState<ClientLeadStatus>('New');
  const [cAssigned, setCAssigned] = useState('Rohan Verma');
  const [cNotes, setCNotes] = useState('');
  const [cTag, setCTag] = useState<ClientLeadTag>('Invitations');

  // Vendor form fields
  const [vCompany, setVCompany] = useState('');
  const [vContact, setVContact] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vEmail, setVEmail] = useState('');
  const [vCategory, setVCategory] = useState<'Printed Stationery' | 'Printed Invites' | 'Gifts'>('Printed Stationery');
  const [vStatus, setVStatus] = useState<VendorLeadStatus>('Deal');
  const [vMargin, setVMargin] = useState(40);
  const [vNotes, setVNotes] = useState('');

  // Planner form fields
  const [pAgency, setPAgency] = useState('');
  const [pContact, setPContact] = useState('');
  const [pPhone, setPPhone] = useState('');
  const [pEmail, setPEmail] = useState('');
  const [pRate, setPRate] = useState(10);
  const [pStatus, setPStatus] = useState<PlannerLeadStatus>('Prospect');
  const [pNotes, setPNotes] = useState('');

  // Delete confirmations
  const [deleteClientLeadId, setDeleteClientLeadId] = useState<string | null>(null);
  const [deleteVendorLeadId, setDeleteVendorLeadId] = useState<string | null>(null);
  const [deletePlannerLeadId, setDeletePlannerLeadId] = useState<string | null>(null);

  // ── Metrics ──────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const totalClientBudget = state.clientLeads
      .filter(l => l.status !== 'Lost')
      .reduce((sum, l) => sum + l.budget, 0);

    const clientConversions = state.clientLeads.filter(l => l.status === 'Converted').length;
    const clientConversionRate = state.clientLeads.length > 0
      ? Math.round((clientConversions / state.clientLeads.length) * 100)
      : 0;

    const activeVendorDeals = state.vendorLeads.filter(vl => vl.status === 'Deal').length;
    const activePlannerPartners = state.plannerLeads.filter(pl => pl.status === 'Active Partnership').length;

    return {
      totalClientBudget,
      clientConversionRate,
      activeVendorDeals,
      activePlannerPartners,
      clientCount: state.clientLeads.length,
      vendorCount: state.vendorLeads.length,
      plannerCount: state.plannerLeads.length
    };
  }, [state.clientLeads, state.vendorLeads, state.plannerLeads]);

  // ── Filters & Searches ───────────────────────────────────────
  const filteredClientLeads = useMemo(() => {
    return state.clientLeads.filter(l => {
      const matchSearch =
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.phone.includes(searchQuery) ||
        l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.interestedProduct.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTag = tagFilter === 'All' || l.tag === tagFilter;
      const matchStatus = statusFilter === 'All' || l.status === statusFilter;
      return matchSearch && matchTag && matchStatus;
    });
  }, [state.clientLeads, searchQuery, tagFilter, statusFilter]);

  const filteredVendorLeads = useMemo(() => {
    return state.vendorLeads.filter(l => {
      const matchSearch =
        l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = vendorCategoryFilter === 'All' || l.category === vendorCategoryFilter;
      const matchStatus = vendorStatusFilter === 'All' || l.status === vendorStatusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [state.vendorLeads, searchQuery, vendorCategoryFilter, vendorStatusFilter]);

  const filteredPlannerLeads = useMemo(() => {
    return state.plannerLeads.filter(l => {
      const matchSearch =
        l.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = plannerStatusFilter === 'All' || l.status === plannerStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [state.plannerLeads, searchQuery, plannerStatusFilter]);

  // ── Save Handlers ────────────────────────────────────────────
  const handleClientSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClientLead) {
      updateClientLead(selectedClientLead.id, {
        name: cName,
        phone: cPhone,
        email: cEmail,
        eventType: cEventType,
        interestedProduct: cProduct,
        budget: cBudget,
        source: cSource,
        status: cStatus,
        assignedTo: cAssigned,
        notes: cNotes,
        tag: cTag
      });
    } else {
      addClientLead({
        id: `L-${Math.floor(Math.random() * 900 + 100)}`,
        name: cName,
        phone: cPhone,
        email: cEmail,
        eventType: cEventType,
        interestedProduct: cProduct,
        budget: cBudget,
        source: cSource,
        status: cStatus,
        assignedTo: cAssigned,
        notes: cNotes,
        tag: cTag,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    setShowClientModal(false);
    resetClientForm();
  };

  const handleVendorSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVendorLead) {
      updateVendorLead(selectedVendorLead.id, {
        companyName: vCompany,
        contactName: vContact,
        phone: vPhone,
        email: vEmail,
        category: vCategory,
        status: vStatus,
        expectedMargin: vMargin,
        notes: vNotes
      });
    } else {
      addVendorLead({
        id: `VL-${Math.floor(Math.random() * 900 + 100)}`,
        companyName: vCompany,
        contactName: vContact,
        phone: vPhone,
        email: vEmail,
        category: vCategory,
        status: vStatus,
        expectedMargin: vMargin,
        notes: vNotes,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    setShowVendorModal(false);
    resetVendorForm();
  };

  const handlePlannerSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlannerLead) {
      updatePlannerLead(selectedPlannerLead.id, {
        agencyName: pAgency,
        contactName: pContact,
        phone: pPhone,
        email: pEmail,
        commissionRate: pRate,
        status: pStatus,
        notes: pNotes
      });
    } else {
      addPlannerLead({
        id: `PL-${Math.floor(Math.random() * 900 + 100)}`,
        agencyName: pAgency,
        contactName: pContact,
        phone: pPhone,
        email: pEmail,
        commissionRate: pRate,
        status: pStatus,
        notes: pNotes,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    setShowPlannerModal(false);
    resetPlannerForm();
  };

  // Form loaders
  const openClientEdit = (l: ClientLead) => {
    setSelectedClientLead(l);
    setCName(l.name);
    setCPhone(l.phone);
    setCEmail(l.email);
    setCEventType(l.eventType);
    setCProduct(l.interestedProduct);
    setCBudget(l.budget);
    setCSource(l.source);
    setCStatus(l.status);
    setCAssigned(l.assignedTo);
    setCNotes(l.notes);
    setCTag(l.tag);
    setShowClientModal(true);
  };

  const openVendorEdit = (vl: VendorLead) => {
    setSelectedVendorLead(vl);
    setVCompany(vl.companyName);
    setVContact(vl.contactName);
    setVPhone(vl.phone);
    setVEmail(vl.email);
    setVCategory(vl.category);
    setVStatus(vl.status);
    setVMargin(vl.expectedMargin);
    setVNotes(vl.notes);
    setShowVendorModal(true);
  };

  const openPlannerEdit = (pl: PlannerLead) => {
    setSelectedPlannerLead(pl);
    setPAgency(pl.agencyName);
    setPContact(pl.contactName);
    setPAphone(pl.phone);
    setPEmail(pl.email);
    setPRate(pl.commissionRate);
    setPStatus(pl.status);
    setPNotes(pl.notes);
    setShowPlannerModal(true);
  };

  // Helper form resets
  const resetClientForm = () => {
    setSelectedClientLead(null);
    setCName('');
    setCPhone('');
    setCEmail('');
    setCEventType('Wedding');
    setCProduct('');
    setCBudget(15000);
    setCSource('Website Form');
    setCStatus('New');
    setCAssigned('Rohan Verma');
    setCNotes('');
    setCTag('Invitations');
  };

  const resetVendorForm = () => {
    setSelectedVendorLead(null);
    setVCompany('');
    setVContact('');
    setVPhone('');
    setVEmail('');
    setVCategory('Printed Stationery');
    setVStatus('Deal');
    setVMargin(40);
    setVNotes('');
  };

  const resetPlannerForm = () => {
    setSelectedPlannerLead(null);
    setPAgency('');
    setPContact('');
    setPAphone('');
    setPEmail('');
    setPRate(10);
    setPStatus('Prospect');
    setPNotes('');
  };

  // Helper for text inputs
  const setPAphone = (val: string) => setPPhone(val);

  return (
    <div className="space-y-6 admin-animate-in">
      {/* ── Top Tabs & Action Switchers ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="inline-flex bg-[#f5f0e8] p-1 rounded-xl shadow-sm border border-gray-200/50">
          <button
            onClick={() => { setActiveTab('client'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'client' ? 'bg-[#8B4949] text-white shadow-sm' : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            <Users size={16} />
            Client Inquiries ({metrics.clientCount})
          </button>
          <button
            onClick={() => { setActiveTab('vendor'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'vendor' ? 'bg-[#8B4949] text-white shadow-sm' : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            <Inbox size={16} />
            Vendor Deals ({metrics.vendorCount})
          </button>
          <button
            onClick={() => { setActiveTab('planner'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'planner' ? 'bg-[#8B4949] text-white shadow-sm' : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            <UserCheck size={16} />
            Event Planners ({metrics.plannerCount})
          </button>
        </div>

        <div className="flex items-center gap-2 self-end">
          {activeTab === 'client' && (
            <button
              onClick={() => simulateLiveInquiry()}
              className="admin-btn bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center gap-1.5"
              title="Simulate incoming client enquiry from the website contact page"
            >
              <Sparkles size={14} /> Simulate Inquiry
            </button>
          )}
          <button
            onClick={() => {
              if (activeTab === 'client') { resetClientForm(); setShowClientModal(true); }
              else if (activeTab === 'vendor') { resetVendorForm(); setShowVendorModal(true); }
              else { resetPlannerForm(); setShowPlannerModal(true); }
            }}
            className="admin-btn admin-btn-primary flex items-center gap-1.5"
          >
            <Plus size={16} /> Add Lead
          </button>
        </div>
      </div>

      {/* ── KPI Deck ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-card flex items-center justify-between p-5">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Client Pipeline Value</p>
            <p className="text-2xl font-extrabold text-[#1a1410] mt-1">₹{metrics.totalClientBudget.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-10 h-10 bg-[#8B4949]/10 rounded-xl flex items-center justify-center text-[#8B4949]">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="admin-card flex items-center justify-between p-5">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Inquiry Conversion</p>
            <p className="text-2xl font-extrabold text-[#1a1410] mt-1">{metrics.clientConversionRate}%</p>
          </div>
          <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center text-[#D4AF37]">
            <Percent size={20} />
          </div>
        </div>

        <div className="admin-card flex items-center justify-between p-5">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Vendor Deals</p>
            <p className="text-2xl font-extrabold text-[#1a1410] mt-1">{metrics.activeVendorDeals}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Inbox size={20} />
          </div>
        </div>

        <div className="admin-card flex items-center justify-between p-5">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Planner Ties</p>
            <p className="text-2xl font-extrabold text-[#1a1410] mt-1">{metrics.activePlannerPartners}</p>
          </div>
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <UserCheck size={20} />
          </div>
        </div>
      </div>

      {/* ── Toolbar: Search & KPI Tag Filters ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-150 shadow-sm">
        <div className="flex items-center gap-2 bg-[#faf8f5] border border-gray-250 rounded-xl px-3 py-2 w-full md:w-80 focus-within:border-[#8B4949] transition-all">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'client' ? "Search by client name, product..." :
              activeTab === 'vendor' ? "Search B2B vendors, contact person..." :
              "Search planner agencies..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs w-full focus:outline-none text-[#1a1410]"
          />
        </div>

        {/* Dynamic filters based on Tab */}
        <div className="flex items-center gap-3 flex-wrap w-full md:w-auto justify-end">
          {activeTab === 'client' && (
            <>
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">KPI Tag:</label>
                <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value as any)} className="admin-input !py-1.5 !px-3 !w-auto text-xs">
                  <option value="All">All Categories</option>
                  <option value="Invitations">Invitations</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Gifts">Gifts</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status:</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="admin-input !py-1.5 !px-3 !w-auto text-xs">
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'vendor' && (
            <>
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Sourcing:</label>
                <select value={vendorCategoryFilter} onChange={(e) => setVendorCategoryFilter(e.target.value as any)} className="admin-input !py-1.5 !px-3 !w-auto text-xs">
                  <option value="All">All Categories</option>
                  <option value="Printed Stationery">Stationery</option>
                  <option value="Printed Invites">Printed Invites</option>
                  <option value="Gifts">Gifts</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Deal Stage:</label>
                <select value={vendorStatusFilter} onChange={(e) => setVendorStatusFilter(e.target.value as any)} className="admin-input !py-1.5 !px-3 !w-auto text-xs">
                  <option value="All">All Deals</option>
                  <option value="Deal">In Discussion (Deal)</option>
                  <option value="Closed">Closed Partnership</option>
                  <option value="Paused">Paused Negotiations</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'planner' && (
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status:</label>
              <select value={plannerStatusFilter} onChange={(e) => setPlannerStatusFilter(e.target.value as any)} className="admin-input !py-1.5 !px-3 !w-auto text-xs">
                <option value="All">All Statuses</option>
                <option value="Prospect">Prospect</option>
                <option value="Active Partnership">Active Partnership</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ── Client Leads Tab View ── */}
      {activeTab === 'client' && (
        <div className="admin-card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Contact Info</th>
                  <th>Tag (KPI)</th>
                  <th>Interested Design</th>
                  <th>Budget</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-450 text-sm">No client inquiries found.</td>
                  </tr>
                ) : (
                  filteredClientLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-[#faf8f5]/50 transition-colors">
                      <td>
                        <p className="font-extrabold text-[#1a1410] text-sm">{lead.name}</p>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{lead.eventType}</span>
                      </td>
                      <td className="text-xs font-semibold text-gray-600 space-y-0.5">
                        <p className="flex items-center gap-1"><Mail size={12} className="text-gray-400" /> {lead.email}</p>
                        <p className="flex items-center gap-1"><Phone size={12} className="text-gray-400" /> {lead.phone}</p>
                      </td>
                      <td>
                        <span className={`admin-badge text-[10px] font-bold py-1 px-2.5 rounded-full ${
                          lead.tag === 'Invitations' ? 'bg-[#8B4949]/10 text-[#8B4949]' :
                          lead.tag === 'Stationery' ? 'bg-purple-50 text-purple-600' :
                          lead.tag === 'Gifts' ? 'bg-pink-50 text-pink-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {lead.tag}
                        </span>
                      </td>
                      <td>
                        <span className="font-bold text-xs text-[#1a1410]">{lead.interestedProduct}</span>
                      </td>
                      <td className="font-extrabold text-[#8B4949] text-sm">
                        ₹{lead.budget.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className="text-xs text-gray-400 font-semibold">{lead.source}</span>
                      </td>
                      <td>
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="text-right">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => openClientEdit(lead)}
                            className="p-1.5 text-gray-400 hover:text-[#8B4949] hover:bg-[#8B4949]/5 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteClientLeadId(lead.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* ── Vendor Leads Tab View ── */}
      {activeTab === 'vendor' && (
        <div className="admin-card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Vendor Mill / Studio</th>
                  <th>Contact Person</th>
                  <th>Supplied Category</th>
                  <th>Expected Margin</th>
                  <th>Deal Stage</th>
                  <th>Created</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendorLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-450 text-sm">No vendor partner leads found.</td>
                  </tr>
                ) : (
                  filteredVendorLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-[#faf8f5]/50 transition-colors">
                      <td>
                        <p className="font-extrabold text-[#8B4949] text-sm">{lead.companyName}</p>
                        <div className="flex gap-2.5 text-[10px] text-gray-400 font-medium mt-0.5">
                          <span>{lead.email}</span>
                          <span>•</span>
                          <span>{lead.phone}</span>
                        </div>
                      </td>
                      <td className="text-xs text-[#1a1410] font-semibold">{lead.contactName}</td>
                      <td>
                        <span className="text-xs text-gray-500 font-bold">{lead.category}</span>
                      </td>
                      <td className="font-extrabold text-green-600 text-sm">
                        {lead.expectedMargin}% profit
                      </td>
                      <td>
                        <span className={`admin-badge text-[10px] font-bold ${
                          lead.status === 'Closed' ? 'admin-badge-success' :
                          lead.status === 'Deal' ? 'admin-badge-warning' :
                          'admin-badge-danger'
                        }`}>
                          {lead.status === 'Deal' ? 'Negotiating' : lead.status === 'Closed' ? 'Partnered' : 'On Hold'}
                        </span>
                      </td>
                      <td>
                        <span className="text-xs text-gray-400 font-medium">{lead.createdAt}</span>
                      </td>
                      <td className="text-right">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => openVendorEdit(lead)}
                            className="p-1.5 text-gray-400 hover:text-[#8B4949] hover:bg-[#8B4949]/5 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteVendorLeadId(lead.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* ── Planner Leads Tab View ── */}
      {activeTab === 'planner' && (
        <div className="admin-card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Planner Agency</th>
                  <th>Contact Coordinator</th>
                  <th>Contact Details</th>
                  <th>Referral Commission</th>
                  <th>Ties Status</th>
                  <th>Created</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlannerLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-450 text-sm">No event planner leads found.</td>
                  </tr>
                ) : (
                  filteredPlannerLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-[#faf8f5]/50 transition-colors">
                      <td>
                        <p className="font-extrabold text-[#1a1410] text-sm">{lead.agencyName}</p>
                      </td>
                      <td className="text-xs text-[#1a1410] font-semibold">{lead.contactName}</td>
                      <td className="text-xs text-gray-500 space-y-0.5">
                        <p>{lead.email}</p>
                        <p>{lead.phone}</p>
                      </td>
                      <td className="font-extrabold text-[#8B4949] text-sm">
                        {lead.commissionRate}% comm.
                      </td>
                      <td>
                        <span className={`admin-badge text-[10px] font-bold ${
                          lead.status === 'Active Partnership' ? 'admin-badge-success' :
                          lead.status === 'Prospect' ? 'admin-badge-warning' :
                          'admin-badge-danger'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td>
                        <span className="text-xs text-gray-400 font-medium">{lead.createdAt}</span>
                      </td>
                      <td className="text-right">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => openPlannerEdit(lead)}
                            className="p-1.5 text-gray-400 hover:text-[#8B4949] hover:bg-[#8B4949]/5 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeletePlannerLeadId(lead.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* ── MODAL: Client Lead ── */}
      {showClientModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowClientModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 admin-scale-in">
            <button onClick={() => setShowClientModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-[#1a1410] mb-4">
              {selectedClientLead ? 'Edit Client Inquiry' : 'Add Client Inquiry'}
            </h3>
            <form onSubmit={handleClientSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Client Name *</label>
                  <input type="text" required value={cName} onChange={(e) => setCName(e.target.value)} placeholder="Full Name" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Tag (KPI category)</label>
                  <select value={cTag} onChange={(e) => setCTag(e.target.value as ClientLeadTag)} className="admin-input">
                    <option value="Invitations">Invitations</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Gifts">Gifts</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Phone Number *</label>
                  <input type="text" required value={cPhone} onChange={(e) => setCPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Email Address *</label>
                  <input type="email" required value={cEmail} onChange={(e) => setCEmail(e.target.value)} placeholder="e.g. client@gmail.com" className="admin-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Interested design / product *</label>
                  <input type="text" required value={cProduct} onChange={(e) => setCProduct(e.target.value)} placeholder="e.g. Royal Video Invite" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Event Type</label>
                  <select value={cEventType} onChange={(e) => setCEventType(e.target.value as any)} className="admin-input">
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Target Budget (₹) *</label>
                  <input type="number" required min={1} value={cBudget} onChange={(e) => setCBudget(Number(e.target.value))} className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Lead Source</label>
                  <select value={cSource} onChange={(e) => setCSource(e.target.value as any)} className="admin-input">
                    <option value="Website Form">Website Form</option>
                    <option value="WhatsApp">WhatsApp Link</option>
                    <option value="Instagram">Instagram DM</option>
                    <option value="Facebook">Facebook Ads</option>
                    <option value="Referral">Friend Referral</option>
                    <option value="Direct Call">Direct Call</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Pipeline Stage</label>
                  <select value={cStatus} onChange={(e) => setCStatus(e.target.value as ClientLeadStatus)} className="admin-input">
                    <option value="New">New Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Assigned Representative</label>
                  <input type="text" value={cAssigned} onChange={(e) => setCAssigned(e.target.value)} className="admin-input" />
                </div>
              </div>

              <div>
                <label className="admin-label">Notes & Requirements</label>
                <textarea rows={2} value={cNotes} onChange={(e) => setCNotes(e.target.value)} placeholder="Theme colors, customizations requested..." className="admin-textarea" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowClientModal(false)} className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-gray-500 font-bold text-xs hover:bg-[#faf8f5] transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#8B4949] text-white rounded-xl font-bold text-xs hover:bg-[#723b3b] shadow-sm transition-colors">
                  {selectedClientLead ? 'Save Changes' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Vendor Lead ── */}
      {showVendorModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowVendorModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 admin-scale-in">
            <button onClick={() => setShowVendorModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-[#1a1410] mb-4">
              {selectedVendorLead ? 'Edit Vendor Deal Negotiation' : 'Add New Vendor Partner Deal'}
            </h3>
            <form onSubmit={handleVendorSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Company Name *</label>
                  <input type="text" required value={vCompany} onChange={(e) => setVCompany(e.target.value)} placeholder="Mill / Studio Name" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Contact Person *</label>
                  <input type="text" required value={vContact} onChange={(e) => setVContact(e.target.value)} placeholder="Full Name" className="admin-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Phone Number *</label>
                  <input type="text" required value={vPhone} onChange={(e) => setVPhone(e.target.value)} placeholder="Phone" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Email Address *</label>
                  <input type="email" required value={vEmail} onChange={(e) => setVEmail(e.target.value)} placeholder="email@vendor.com" className="admin-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Sourcing Category</label>
                  <select value={vCategory} onChange={(e) => setVCategory(e.target.value as any)} className="admin-input">
                    <option value="Printed Stationery">Printed Stationery</option>
                    <option value="Printed Invites">Printed Invites</option>
                    <option value="Gifts">Gifts</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Target Profit Margin (%)</label>
                  <input type="number" required min={0} max={100} value={vMargin} onChange={(e) => setVMargin(Number(e.target.value))} className="admin-input" />
                </div>
              </div>

              <div>
                <label className="admin-label">Deal Stage</label>
                <select value={vStatus} onChange={(e) => setVStatus(e.target.value as VendorLeadStatus)} className="admin-input">
                  <option value="Deal">Negotiating Rate List</option>
                  <option value="Closed">Closed Partnership (Signed)</option>
                  <option value="Paused">Paused Negotiations</option>
                </select>
              </div>

              <div>
                <label className="admin-label">Interaction Notes</label>
                <textarea rows={2} value={vNotes} onChange={(e) => setVNotes(e.target.value)} placeholder="Paper samples sent, margin targets..." className="admin-textarea" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowVendorModal(false)} className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-gray-500 font-bold text-xs hover:bg-[#faf8f5]">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#8B4949] text-white rounded-xl font-bold text-xs hover:bg-[#723b3b] shadow-sm">
                  {selectedVendorLead ? 'Save Changes' : 'Record Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Planner Lead ── */}
      {showPlannerModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPlannerModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 admin-scale-in">
            <button onClick={() => setShowPlannerModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-[#1a1410] mb-4">
              {selectedPlannerLead ? 'Edit Planner Collaboration' : 'Add Event Planner Collaboration'}
            </h3>
            <form onSubmit={handlePlannerSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Agency / Coordinator Name *</label>
                  <input type="text" required value={pAgency} onChange={(e) => setPAgency(e.target.value)} placeholder="Agency Name" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Primary Coordinator *</label>
                  <input type="text" required value={pContact} onChange={(e) => setPContact(e.target.value)} placeholder="Full Name" className="admin-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Phone Number *</label>
                  <input type="text" required value={pPhone} onChange={(e) => setPPhone(e.target.value)} placeholder="Phone" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Email Address *</label>
                  <input type="email" required value={pEmail} onChange={(e) => setPEmail(e.target.value)} placeholder="email@planner.com" className="admin-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Referral Commission (%)</label>
                  <input type="number" required min={0} max={100} value={pRate} onChange={(e) => setPRate(Number(e.target.value))} className="admin-input font-bold" />
                </div>
                <div>
                  <label className="admin-label">Ties Status</label>
                  <select value={pStatus} onChange={(e) => setPStatus(e.target.value as PlannerLeadStatus)} className="admin-input">
                    <option value="Prospect">Prospect</option>
                    <option value="Active Partnership">Active Partnership</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="admin-label">Partnership Notes</label>
                <textarea rows={2} value={pNotes} onChange={(e) => setPNotes(e.target.value)} placeholder="Referral commission agreements, active inquiries..." className="admin-textarea" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowPlannerModal(false)} className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-gray-500 font-bold text-xs hover:bg-[#faf8f5]">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#8B4949] text-white rounded-xl font-bold text-xs hover:bg-[#723b3b] shadow-sm">
                  {selectedPlannerLead ? 'Save Changes' : 'Establish Partnership'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Client Dialog */}
      <ConfirmDialog
        open={!!deleteClientLeadId}
        title="Delete Client Inquiry"
        message="Are you sure you want to delete this B2C inquiry entry? This action is permanent."
        confirmLabel="Delete"
        onConfirm={() => { if (deleteClientLeadId) { deleteClientLead(deleteClientLeadId); setDeleteClientLeadId(null); } }}
        onCancel={() => setDeleteClientLeadId(null)}
        danger
      />

      {/* Delete Vendor Dialog */}
      <ConfirmDialog
        open={!!deleteVendorLeadId}
        title="Delete Vendor Partnership Deal"
        message="Are you sure you want to delete this vendor deal negotiation record?"
        confirmLabel="Delete"
        onConfirm={() => { if (deleteVendorLeadId) { deleteVendorLead(deleteVendorLeadId); setDeleteVendorLeadId(null); } }}
        onCancel={() => setDeleteVendorLeadId(null)}
        danger
      />

      {/* Delete Planner Dialog */}
      <ConfirmDialog
        open={!!deletePlannerLeadId}
        title="Delete Event Planner Tie-up"
        message="Are you sure you want to delete this coordinator collaboration record?"
        confirmLabel="Delete"
        onConfirm={() => { if (deletePlannerLeadId) { deletePlannerLead(deletePlannerLeadId); setDeletePlannerLeadId(null); } }}
        onCancel={() => setDeletePlannerLeadId(null)}
        danger
      />
    </div>
  );
}
