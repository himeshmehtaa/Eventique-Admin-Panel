import { useState, useMemo } from 'react';
import {
  Users, Search, Plus, Edit2, Trash2, Phone, Mail,
  Sparkles, CheckCircle2, X, TrendingUp, BarChart3,
  Percent, ArrowRight, UserCheck, Megaphone, Inbox,
  Briefcase, Layers, IndianRupee, ShoppingBag
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusBadge } from '../components/StatusBadge';
import type {
  ClientLead, VendorLead, PlannerLead, ClientLeadStatus, ClientLeadTag,
  VendorLeadStatus, PlannerLeadStatus, CorporateLead, CorporateOrder,
  CorporateLeadStatus, CorporateOrderStatus
} from '../types';

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
    simulateLiveInquiry,
    addCorporateLead,
    updateCorporateLead,
    deleteCorporateLead,
    addCorporateOrder,
    updateCorporateOrder,
    deleteCorporateOrder,
    convertCorporateLeadToOrder,
    addVendor
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'client' | 'corporate' | 'vendor' | 'planner'>('client');
  const [corporateSubTab, setCorporateSubTab] = useState<'leads' | 'orders'>('leads');
  const [corporateLeadStatusFilter, setCorporateLeadStatusFilter] = useState<CorporateLeadStatus | 'All'>('All');
  const [corporateOrderStatusFilter, setCorporateOrderStatusFilter] = useState<CorporateOrderStatus | 'All'>('All');

  // Corporate Modals state
  const [showCorporateLeadModal, setShowCorporateLeadModal] = useState(false);
  const [selectedCorporateLead, setSelectedCorporateLead] = useState<CorporateLead | null>(null);

  const [showCorporateOrderModal, setShowCorporateOrderModal] = useState(false);
  const [selectedCorporateOrder, setSelectedCorporateOrder] = useState<CorporateOrder | null>(null);

  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertLeadId, setConvertLeadId] = useState<string | null>(null);

  // Corporate Lead Form Fields
  const [clCompany, setClCompany] = useState('');
  const [clContact, setClContact] = useState('');
  const [clEmail, setClEmail] = useState('');
  const [clPhone, setClPhone] = useState('');
  const [clProduct, setClProduct] = useState('');
  const [clQty, setClQty] = useState(100);
  const [clBudget, setClBudget] = useState(50000);
  const [clStatus, setClStatus] = useState<CorporateLeadStatus>('New');
  const [clNotes, setClNotes] = useState('');

  // Corporate Order Form Fields
  const [coCompany, setCoCompany] = useState('');
  const [coContact, setCoContact] = useState('');
  const [coEmail, setCoEmail] = useState('');
  const [coPhone, setCoPhone] = useState('');
  const [coProduct, setCoProduct] = useState('');
  const [coQty, setCoQty] = useState(100);
  const [coPrice, setCoPrice] = useState(150);
  const [coGst, setCoGst] = useState('');
  const [coStatus, setCoStatus] = useState<CorporateOrderStatus>('Planning');
  const [coDate, setCoDate] = useState('');

  // Conversion Form Fields
  const [convertPrice, setConvertPrice] = useState(150);
  const [convertGst, setConvertGst] = useState('');

  // Corporate Delete dialogs
  const [deleteCorporateLeadId, setDeleteCorporateLeadId] = useState<string | null>(null);
  const [deleteCorporateOrderId, setDeleteCorporateOrderId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  // Client leads filters
  const [tagFilter, setTagFilter] = useState<ClientLeadTag | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<ClientLeadStatus | 'All'>('All');

  // Vendor leads filters
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState<'All' | 'Printed Stationery' | 'Printed Invites' | 'Gifts'>('All');
  const [vendorStatusFilter, setVendorStatusFilter] = useState<VendorLeadStatus | 'All'>('All');

  // Planner leads filters
  const [plannerStatusFilter, setPlannerStatusFilter] = useState<PlannerLeadStatus | 'All'>('All');

  const [followUpContact, setFollowUpContact] = useState<{ name: string; phone: string; email: string } | null>(null);

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

    const activeCorporateLeadsVal = state.corporateLeads
      .filter(l => l.status !== 'Lost')
      .reduce((sum, l) => sum + l.budget, 0);

    const activeCorporateOrdersVal = state.corporateOrders
      .reduce((sum, o) => sum + o.total, 0);

    const totalCorporateOrdersQty = state.corporateOrders
      .reduce((sum, o) => sum + o.qty, 0);

    return {
      totalClientBudget,
      clientConversionRate,
      activeVendorDeals,
      activePlannerPartners,
      clientCount: state.clientLeads.length,
      vendorCount: state.vendorLeads.length,
      plannerCount: state.plannerLeads.length,
      activeCorporateLeadsVal,
      activeCorporateOrdersVal,
      totalCorporateOrdersQty,
      corporateLeadsCount: state.corporateLeads.length,
      corporateOrdersCount: state.corporateOrders.length
    };
  }, [state.clientLeads, state.vendorLeads, state.plannerLeads, state.corporateLeads, state.corporateOrders]);

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

  const filteredCorporateLeads = useMemo(() => {
    return state.corporateLeads.filter(l => {
      const matchSearch =
        l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.product.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = corporateLeadStatusFilter === 'All' || l.status === corporateLeadStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [state.corporateLeads, searchQuery, corporateLeadStatusFilter]);

  const filteredCorporateOrders = useMemo(() => {
    return state.corporateOrders.filter(o => {
      const matchSearch =
        o.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.product.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = corporateOrderStatusFilter === 'All' || o.status === corporateOrderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [state.corporateOrders, searchQuery, corporateOrderStatusFilter]);

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

  // Corporate Lead & Order Handlers
  const handleCorporateLeadSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCorporateLead) {
      updateCorporateLead(selectedCorporateLead.id, {
        company: clCompany,
        contact: clContact,
        email: clEmail,
        phone: clPhone,
        product: clProduct,
        qty: clQty,
        budget: clBudget,
        status: clStatus,
        notes: clNotes
      });
    } else {
      addCorporateLead({
        id: `CL-${Math.floor(Math.random() * 900 + 100)}`,
        company: clCompany,
        contact: clContact,
        email: clEmail,
        phone: clPhone,
        product: clProduct,
        qty: clQty,
        budget: clBudget,
        status: clStatus,
        notes: clNotes,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    setShowCorporateLeadModal(false);
    resetCorporateLeadForm();
  };

  const handleCorporateOrderSave = (e: React.FormEvent) => {
    e.preventDefault();
    const total = coQty * coPrice;
    if (selectedCorporateOrder) {
      updateCorporateOrder(selectedCorporateOrder.id, {
        company: coCompany,
        contact: coContact,
        email: coEmail,
        phone: coPhone,
        product: coProduct,
        qty: coQty,
        pricePerUnit: coPrice,
        total,
        gst: coGst,
        status: coStatus
      });
    } else {
      addCorporateOrder({
        id: `CO-${Math.floor(Math.random() * 900 + 100)}`,
        company: coCompany,
        contact: coContact,
        email: coEmail,
        phone: coPhone,
        product: coProduct,
        qty: coQty,
        pricePerUnit: coPrice,
        total,
        gst: coGst,
        status: coStatus,
        date: coDate || new Date().toISOString().split('T')[0]
      });
    }
    setShowCorporateOrderModal(false);
    resetCorporateOrderForm();
  };

  const handleConversionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (convertLeadId) {
      convertCorporateLeadToOrder(convertLeadId, convertPrice, convertGst);
      setConvertLeadId(null);
      setShowConvertModal(false);
    }
  };

  const openCorporateLeadEdit = (l: CorporateLead) => {
    setSelectedCorporateLead(l);
    setClCompany(l.company);
    setClContact(l.contact);
    setClEmail(l.email);
    setClPhone(l.phone);
    setClProduct(l.product);
    setClQty(l.qty);
    setClBudget(l.budget);
    setClStatus(l.status);
    setClNotes(l.notes);
    setShowCorporateLeadModal(true);
  };

  const openCorporateOrderEdit = (o: CorporateOrder) => {
    setSelectedCorporateOrder(o);
    setCoCompany(o.company);
    setCoContact(o.contact);
    setCoEmail(o.email);
    setCoPhone(o.phone);
    setCoProduct(o.product);
    setCoQty(o.qty);
    setCoPrice(o.pricePerUnit);
    setCoGst(o.gst);
    setCoStatus(o.status);
    setCoDate(o.date);
    setShowCorporateOrderModal(true);
  };

  const openConvertModal = (leadId: string, leadQty: number, leadBudget: number) => {
    setConvertLeadId(leadId);
    setConvertPrice(leadQty > 0 ? Math.round(leadBudget / leadQty) : 150);
    setConvertGst('');
    setShowConvertModal(true);
  };

  const resetCorporateLeadForm = () => {
    setSelectedCorporateLead(null);
    setClCompany('');
    setClContact('');
    setClEmail('');
    setClPhone('');
    setClProduct('');
    setClQty(100);
    setClBudget(50000);
    setClStatus('New');
    setClNotes('');
  };

  const resetCorporateOrderForm = () => {
    setSelectedCorporateOrder(null);
    setCoCompany('');
    setCoContact('');
    setCoEmail('');
    setCoPhone('');
    setCoProduct('');
    setCoQty(100);
    setCoPrice(150);
    setCoGst('');
    setCoStatus('Planning');
    setCoDate('');
  };

  // Helper for text inputs
  const setPAphone = (val: string) => setPPhone(val);

  return (
    <div className="space-y-6 admin-animate-in">
      {/* ── Top Tabs & Action Switchers ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="inline-flex bg-[#f5f0e8] p-1 rounded-xl shadow-sm border border-[#e5e5e5]/50 flex-wrap">
          <button
            onClick={() => { setActiveTab('client'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'client' ? 'bg-[#8B4949] text-white shadow-sm' : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            <Users size={14} />
            Client Inquiries ({metrics.clientCount})
          </button>
          <button
            onClick={() => { setActiveTab('corporate'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'corporate' ? 'bg-[#8B4949] text-white shadow-sm' : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            <Briefcase size={14} />
            Corporate B2B ({metrics.corporateLeadsCount + metrics.corporateOrdersCount})
          </button>
          <button
            onClick={() => { setActiveTab('vendor'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'vendor' ? 'bg-[#8B4949] text-white shadow-sm' : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            <Inbox size={14} />
            Vendor Deals ({metrics.vendorCount})
          </button>
          <button
            onClick={() => { setActiveTab('planner'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'planner' ? 'bg-[#8B4949] text-white shadow-sm' : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            <UserCheck size={14} />
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
              else if (activeTab === 'corporate') {
                if (corporateSubTab === 'leads') { resetCorporateLeadForm(); setShowCorporateLeadModal(true); }
                else { resetCorporateOrderForm(); setShowCorporateOrderModal(true); }
              }
              else if (activeTab === 'vendor') { resetVendorForm(); setShowVendorModal(true); }
              else { resetPlannerForm(); setShowPlannerModal(true); }
            }}
            className="admin-btn admin-btn-primary flex items-center gap-1.5"
          >
            <Plus size={16} />
            {activeTab === 'corporate' ? (corporateSubTab === 'leads' ? 'Add B2B Lead' : 'Create Bulk Order') : 'Add Lead'}
          </button>
        </div>
      </div>

      {/* ── KPI Deck ── */}
      {activeTab === 'corporate' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="admin-card flex items-center justify-between p-5">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Pipeline Value</p>
              <p className="text-2xl font-extrabold text-[#1a1410] mt-1">₹{metrics.activeCorporateLeadsVal.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-10 h-10 bg-[#8B4949]/10 rounded-xl flex items-center justify-center text-[#8B4949]">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="admin-card flex items-center justify-between p-5">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Bulk Order Value</p>
              <p className="text-2xl font-extrabold text-[#1a1410] mt-1">₹{metrics.activeCorporateOrdersVal.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center text-[#D4AF37]">
              <IndianRupee size={20} />
            </div>
          </div>

          <div className="admin-card flex items-center justify-between p-5">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Bulk Quantity</p>
              <p className="text-2xl font-extrabold text-[#1a1410] mt-1">{metrics.totalCorporateOrdersQty.toLocaleString('en-IN')} pcs</p>
            </div>
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Layers size={20} />
            </div>
          </div>

          <div className="admin-card flex items-center justify-between p-5">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Conversion Ratio</p>
              <p className="text-2xl font-extrabold text-[#1a1410] mt-1">
                {metrics.corporateLeadsCount > 0 ? Math.round((metrics.corporateOrdersCount / (metrics.corporateLeadsCount + metrics.corporateOrdersCount)) * 100) : 0}%
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <Percent size={20} />
            </div>
          </div>
        </div>
      ) : (
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
      )}

      {/* ── Toolbar: Search & KPI Tag Filters ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#f0ece4] shadow-sm">
        <div className="flex items-center gap-2 bg-[#faf8f5] border border-[#e5e5e5] rounded-xl px-3 py-2 w-full md:w-80 focus-within:border-[#8B4949] transition-all">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'client' ? "Search by client name, product..." :
              activeTab === 'corporate' ? (corporateSubTab === 'leads' ? "Search B2B leads..." : "Search bulk orders...") :
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
                <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value as any)} className="admin-select !py-1.5 !pl-3 !pr-8 !w-auto text-xs">
                  <option value="All">All Categories</option>
                  <option value="Invitations">Invitations</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Gifts">Gifts</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status:</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="admin-select !py-1.5 !pl-3 !pr-8 !w-auto text-xs">
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

          {activeTab === 'corporate' && (
            <>
              {corporateSubTab === 'leads' ? (
                <div className="flex items-center gap-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status:</label>
                  <select value={corporateLeadStatusFilter} onChange={(e) => setCorporateLeadStatusFilter(e.target.value as any)} className="admin-select !py-1.5 !pl-3 !pr-8 !w-auto text-xs">
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status:</label>
                  <select value={corporateOrderStatusFilter} onChange={(e) => setCorporateOrderStatusFilter(e.target.value as any)} className="admin-select !py-1.5 !pl-3 !pr-8 !w-auto text-xs">
                    <option value="All">All Statuses</option>
                    <option value="Planning">Planning</option>
                    <option value="Sourcing">Sourcing</option>
                    <option value="Printing">Printing</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              )}
            </>
          )}

          {activeTab === 'vendor' && (
            <>
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Sourcing:</label>
                <select value={vendorCategoryFilter} onChange={(e) => setVendorCategoryFilter(e.target.value as any)} className="admin-select !py-1.5 !pl-3 !pr-8 !w-auto text-xs">
                  <option value="All">All Categories</option>
                  <option value="Printed Stationery">Stationery</option>
                  <option value="Printed Invites">Printed Invites</option>
                  <option value="Gifts">Gifts</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Deal Stage:</label>
                <select value={vendorStatusFilter} onChange={(e) => setVendorStatusFilter(e.target.value as any)} className="admin-select !py-1.5 !pl-3 !pr-8 !w-auto text-xs">
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
              <select value={plannerStatusFilter} onChange={(e) => setPlannerStatusFilter(e.target.value as any)} className="admin-select !py-1.5 !pl-3 !pr-8 !w-auto text-xs">
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
                      <td className="whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {(() => {
                            const config = {
                              New:         { bg: '#EFF6FF', text: '#1D4ED8' },
                              Contacted:   { bg: '#F5F3FF', text: '#6D28D9' },
                              'Follow-up': { bg: '#FFF7ED', text: '#C2410C' },
                              Converted:   { bg: '#F0FDF4', text: '#166534' },
                              Lost:        { bg: '#FEF2F2', text: '#DC2626' }
                            }[lead.status] || { bg: '#f5f0e8', text: '#4a4a4a' };
                            return (
                              <select
                                value={lead.status}
                                onChange={(e) => {
                                  const val = e.target.value as ClientLeadStatus;
                                  updateClientLead(lead.id, { status: val });
                                  if (val === 'Follow-up') {
                                    setFollowUpContact({ name: lead.name, phone: lead.phone, email: lead.email });
                                  }
                                }}
                                style={{ backgroundColor: config.bg, color: config.text }}
                                className="admin-status-select px-2.5 py-1 text-xs font-bold rounded-full border-none focus:outline-none cursor-pointer"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Converted">Converted</option>
                                <option value="Lost">Lost</option>
                              </select>
                            );
                          })()}
                          {lead.status === 'Follow-up' && (
                            <button
                              onClick={() => setFollowUpContact({ name: lead.name, phone: lead.phone, email: lead.email })}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
                              title="Initiate Follow-up (Call / WhatsApp)"
                            >
                              <Phone size={12} />
                            </button>
                          )}
                        </div>
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

      {/* ── Corporate B2B Tab View ── */}
      {activeTab === 'corporate' && (
        <div className="space-y-4">
          {/* Inner tab deck for Corporate Leads vs Bulk Orders */}
          <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-[#f0ece4] shadow-sm">
            <div className="inline-flex bg-[#f5f0e8] p-1 rounded-xl shadow-sm border border-[#e5e5e5]/50">
              <button
                onClick={() => { setCorporateSubTab('leads'); setSearchQuery(''); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  corporateSubTab === 'leads' ? 'bg-[#8B4949] text-white shadow-sm' : 'text-gray-500 hover:text-[#8B4949]'
                }`}
              >
                <Briefcase size={14} />
                B2B Leads ({metrics.corporateLeadsCount})
              </button>
              <button
                onClick={() => { setCorporateSubTab('orders'); setSearchQuery(''); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  corporateSubTab === 'orders' ? 'bg-[#8B4949] text-white shadow-sm' : 'text-gray-500 hover:text-[#8B4949]'
                }`}
              >
                <ShoppingBag size={14} />
                Bulk Orders ({metrics.corporateOrdersCount})
              </button>
            </div>
          </div>

          {/* Tab 1: B2B Leads Table */}
          {corporateSubTab === 'leads' && (
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
                    {filteredCorporateLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-450 text-sm">No B2B corporate leads found.</td>
                      </tr>
                    ) : (
                      filteredCorporateLeads.map(lead => (
                        <tr key={lead.id} className="hover:bg-[#faf8f5]/50 transition-colors">
                          <td>
                            <p className="font-extrabold text-[#1a1410] text-sm">{lead.company}</p>
                            <span className="text-[10px] text-gray-400 font-bold">{lead.contact}</span>
                          </td>
                          <td className="text-xs font-semibold text-gray-600 space-y-0.5">
                            <p>{lead.email}</p>
                            <p>{lead.phone}</p>
                          </td>
                          <td>
                            <p className="font-bold text-xs text-[#1a1410]">{lead.product}</p>
                            <span className="text-[10px] text-amber-600 font-bold">{lead.qty.toLocaleString('en-IN')} pcs</span>
                          </td>
                          <td className="font-extrabold text-[#8B4949] text-sm">
                            ₹{lead.budget.toLocaleString('en-IN')}
                          </td>
                          <td>
                            {(() => {
                              const config = {
                                New:             { bg: '#EFF6FF', text: '#1D4ED8' },
                                'Proposal Sent': { bg: '#F0FDFA', text: '#0F766E' },
                                Negotiation:     { bg: '#EEF2FF', text: '#4338CA' },
                                Lost:            { bg: '#FEF2F2', text: '#DC2626' }
                              }[lead.status] || { bg: '#f5f0e8', text: '#4a4a4a' };
                              return (
                                <select
                                  value={lead.status}
                                  onChange={(e) => updateCorporateLead(lead.id, { status: e.target.value as CorporateLeadStatus })}
                                  style={{ backgroundColor: config.bg, color: config.text }}
                                  className="admin-status-select px-2.5 py-1 text-xs font-bold rounded-full border-none focus:outline-none cursor-pointer"
                                >
                                  <option value="New">New</option>
                                  <option value="Proposal Sent">Proposal Sent</option>
                                  <option value="Negotiation">Negotiation</option>
                                  <option value="Lost">Lost</option>
                                </select>
                              );
                            })()}
                          </td>
                          <td>
                            <span className="text-xs text-gray-400 font-medium">{lead.createdAt}</span>
                          </td>
                          <td className="text-right">
                            <div className="inline-flex gap-1">
                              {lead.status !== 'Lost' && (
                                <button
                                  onClick={() => openConvertModal(lead.id, lead.qty, lead.budget)}
                                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 shadow-sm transition-colors mr-1"
                                >
                                  <CheckCircle2 size={10} /> Convert
                                </button>
                              )}
                              <button
                                onClick={() => openCorporateLeadEdit(lead)}
                                className="p-1.5 text-gray-400 hover:text-[#8B4949] hover:bg-[#8B4949]/5 rounded-lg transition-colors"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteCorporateLeadId(lead.id)}
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

          {/* Tab 2: Bulk Orders Table */}
          {corporateSubTab === 'orders' && (
            <div className="admin-card !p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order details</th>
                      <th>Contact Info</th>
                      <th>Product details</th>
                      <th>Quantity & Total</th>
                      <th>GSTIN</th>
                      <th>Production State</th>
                      <th>Date</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCorporateOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-gray-450 text-sm">No corporate bulk orders found.</td>
                      </tr>
                    ) : (
                      filteredCorporateOrders.map(order => (
                        <tr key={order.id} className="hover:bg-[#faf8f5]/50 transition-colors">
                          <td>
                            <p className="font-extrabold text-[#8B4949] text-sm">{order.id}</p>
                            <span className="text-[10px] text-gray-700 font-bold">{order.company}</span>
                          </td>
                          <td className="text-xs font-semibold text-gray-600 space-y-0.5">
                            <p>{order.contact}</p>
                            <p>{order.phone}</p>
                          </td>
                          <td>
                            <span className="font-bold text-xs text-[#1a1410]">{order.product}</span>
                          </td>
                          <td>
                            <p className="font-bold text-xs text-[#1a1410]">{order.qty.toLocaleString('en-IN')} units</p>
                            <p className="font-extrabold text-[#8B4949] text-sm mt-0.5">₹{order.total.toLocaleString('en-IN')}</p>
                          </td>
                          <td>
                            <span className="font-mono text-xs text-gray-500">{order.gst || 'N/A'}</span>
                          </td>
                          <td>
                            {(() => {
                              const config = {
                                Planning:   { bg: '#EFF6FF', text: '#1D4ED8' },
                                Sourcing:   { bg: '#FFFBEB', text: '#B45309' },
                                Printing:   { bg: '#FDF2F8', text: '#BE185D' },
                                Packaging:  { bg: '#FFF7ED', text: '#C2410C' },
                                Dispatched: { bg: '#F5F3FF', text: '#6D28D9' },
                                Delivered:  { bg: '#F0FDF4', text: '#166534' }
                              }[order.status] || { bg: '#f5f0e8', text: '#4a4a4a' };
                              return (
                                <select
                                  value={order.status}
                                  onChange={(e) => updateCorporateOrder(order.id, { status: e.target.value as CorporateOrderStatus })}
                                  style={{ backgroundColor: config.bg, color: config.text }}
                                  className="admin-status-select px-2.5 py-1 text-xs font-bold rounded-full border-none focus:outline-none cursor-pointer"
                                >
                                  <option value="Planning">Planning</option>
                                  <option value="Sourcing">Sourcing</option>
                                  <option value="Printing">Printing</option>
                                  <option value="Packaging">Packaging</option>
                                  <option value="Dispatched">Dispatched</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                              );
                            })()}
                          </td>
                          <td>
                            <span className="text-xs text-gray-400 font-medium">{order.date}</span>
                          </td>
                          <td className="text-right">
                            <div className="inline-flex gap-1">
                              <button
                                onClick={() => openCorporateOrderEdit(order)}
                                className="p-1.5 text-gray-400 hover:text-[#8B4949] hover:bg-[#8B4949]/5 rounded-lg transition-colors"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteCorporateOrderId(order.id)}
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
                        {(() => {
                          const config = {
                            Closed: { bg: '#F0FDF4', text: '#166534' },
                            Deal:   { bg: '#FFFBEB', text: '#B45309' },
                            Paused: { bg: '#F3F4F6', text: '#4B5563' }
                          }[lead.status] || { bg: '#f5f0e8', text: '#4a4a4a' };
                          return (
                            <select
                              value={lead.status}
                              onChange={(e) => {
                                const val = e.target.value as VendorLeadStatus;
                                updateVendorLead(lead.id, { status: val });
                                if (val === 'Closed') {
                                  addVendor({
                                    id: `V-${Date.now().toString().slice(-4)}`,
                                    name: lead.contactName,
                                    companyName: lead.companyName,
                                    email: lead.email,
                                    phone: lead.phone,
                                    category: lead.category,
                                    status: 'Active',
                                    services: [lead.category],
                                    website: '',
                                    socialId: '',
                                    rating: 5,
                                    products: [],
                                    orders: []
                                  });
                                }
                              }}
                              style={{ backgroundColor: config.bg, color: config.text }}
                              className="admin-status-select px-2.5 py-1 text-xs font-bold rounded-full border-none focus:outline-none cursor-pointer"
                            >
                              <option value="Deal">Negotiating</option>
                              <option value="Closed">Partnered</option>
                              <option value="Paused">On Hold</option>
                            </select>
                          );
                        })()}
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
                        {(() => {
                          const config = {
                            'Active Partnership': { bg: '#F0FDF4', text: '#166534' },
                            Prospect:             { bg: '#FFFBEB', text: '#B45309' },
                            Inactive:            { bg: '#F3F4F6', text: '#4B5563' }
                          }[lead.status] || { bg: '#f5f0e8', text: '#4a4a4a' };
                          return (
                            <select
                              value={lead.status}
                              onChange={(e) => {
                                const val = e.target.value as PlannerLeadStatus;
                                updatePlannerLead(lead.id, { status: val });
                                if (val === 'Active Partnership') {
                                  addVendor({
                                    id: `V-${Date.now().toString().slice(-4)}`,
                                    name: lead.contactName,
                                    companyName: lead.agencyName,
                                    email: lead.email,
                                    phone: lead.phone,
                                    category: 'Event Planner',
                                    status: 'Active',
                                    services: ['Coordination & Styling'],
                                    website: '',
                                    socialId: '',
                                    rating: 5,
                                    products: [],
                                    orders: []
                                  });
                                }
                              }}
                              style={{ backgroundColor: config.bg, color: config.text }}
                              className="admin-status-select px-2.5 py-1 text-xs font-bold rounded-full border-none focus:outline-none cursor-pointer"
                            >
                              <option value="Prospect">Prospect</option>
                              <option value="Active Partnership">Active Partnership</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          );
                        })()}
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

      {/* Delete Corporate Lead Dialog */}
      <ConfirmDialog
        open={!!deleteCorporateLeadId}
        title="Delete B2B Corporate Lead"
        message="Are you sure you want to delete this B2B corporate lead entry? This action is permanent."
        confirmLabel="Delete"
        onConfirm={() => { if (deleteCorporateLeadId) { deleteCorporateLead(deleteCorporateLeadId); setDeleteCorporateLeadId(null); } }}
        onCancel={() => setDeleteCorporateLeadId(null)}
        danger
      />

      {/* Delete Corporate Order Dialog */}
      <ConfirmDialog
        open={!!deleteCorporateOrderId}
        title="Delete Bulk Order"
        message="Are you sure you want to delete this B2B bulk order? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => { if (deleteCorporateOrderId) { deleteCorporateOrder(deleteCorporateOrderId); setDeleteCorporateOrderId(null); } }}
        onCancel={() => setDeleteCorporateOrderId(null)}
        danger
      />

      {/* B2B Lead Add/Edit Modal */}
      {showCorporateLeadModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCorporateLeadModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 admin-scale-in border border-[#f0ece4]">
            <button onClick={() => setShowCorporateLeadModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-[#1a1410] mb-4">
              {selectedCorporateLead ? 'Edit B2B Corporate Lead' : 'Add B2B Corporate Lead'}
            </h3>
            <form onSubmit={handleCorporateLeadSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Company Name *</label>
                  <input type="text" required value={clCompany} onChange={(e) => setClCompany(e.target.value)} placeholder="e.g. Wipro" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Contact Person *</label>
                  <input type="text" required value={clContact} onChange={(e) => setClContact(e.target.value)} placeholder="Full Name" className="admin-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Phone *</label>
                  <input type="text" required value={clPhone} onChange={(e) => setClPhone(e.target.value)} placeholder="Phone" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Email *</label>
                  <input type="email" required value={clEmail} onChange={(e) => setClEmail(e.target.value)} placeholder="corporate@company.com" className="admin-input" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="admin-label">Interested Product *</label>
                  <input type="text" required value={clProduct} onChange={(e) => setClProduct(e.target.value)} placeholder="e.g. Gift Hampers" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Quantity *</label>
                  <input type="number" required min={1} value={clQty} onChange={(e) => setClQty(Number(e.target.value))} className="admin-input font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Target Budget (₹) *</label>
                  <input type="number" required min={0} value={clBudget} onChange={(e) => setClBudget(Number(e.target.value))} className="admin-input font-bold text-[#8B4949]" />
                </div>
                <div>
                  <label className="admin-label">Pipeline Status</label>
                  <select value={clStatus} onChange={(e) => setClStatus(e.target.value as CorporateLeadStatus)} className="admin-input">
                    <option value="New">New</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="admin-label">Notes & Requirements</label>
                <textarea rows={2} value={clNotes} onChange={(e) => setClNotes(e.target.value)} placeholder="Custom logo engraving, gift card preferences..." className="admin-textarea" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCorporateLeadModal(false)} className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-gray-500 font-bold text-xs hover:bg-[#faf8f5]">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#8B4949] text-white rounded-xl font-bold text-xs hover:bg-[#723b3b]">
                  {selectedCorporateLead ? 'Save Changes' : 'Create B2B Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Order Add/Edit Modal */}
      {showCorporateOrderModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCorporateOrderModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 admin-scale-in border border-[#f0ece4]">
            <button onClick={() => setShowCorporateOrderModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-[#1a1410] mb-4">
              {selectedCorporateOrder ? 'Edit Corporate Bulk Order' : 'Create Bulk Order'}
            </h3>
            <form onSubmit={handleCorporateOrderSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Company Name *</label>
                  <input type="text" required value={coCompany} onChange={(e) => setCoCompany(e.target.value)} placeholder="Company Name" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Contact Person *</label>
                  <input type="text" required value={coContact} onChange={(e) => setCoContact(e.target.value)} placeholder="Full Name" className="admin-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Phone *</label>
                  <input type="text" required value={coPhone} onChange={(e) => setCoPhone(e.target.value)} placeholder="Phone" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Email *</label>
                  <input type="email" required value={coEmail} onChange={(e) => setCoEmail(e.target.value)} placeholder="corporate@company.com" className="admin-input" />
                </div>
              </div>

              <div>
                <label className="admin-label">Product Name *</label>
                <input type="text" required value={coProduct} onChange={(e) => setCoProduct(e.target.value)} placeholder="e.g. Printed Suite Set" className="admin-input" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="admin-label">Quantity *</label>
                  <input type="number" required min={1} value={coQty} onChange={(e) => setCoQty(Number(e.target.value))} className="admin-input font-bold" />
                </div>
                <div>
                  <label className="admin-label">Rate per Unit (₹) *</label>
                  <input type="number" required min={0} value={coPrice} onChange={(e) => setCoPrice(Number(e.target.value))} className="admin-input font-bold text-[#8B4949]" />
                </div>
                <div>
                  <label className="admin-label">GSTIN (15-chars) *</label>
                  <input type="text" required maxLength={15} value={coGst} onChange={(e) => setCoGst(e.target.value.toUpperCase())} placeholder="e.g. 29AAAAA1111A1Z1" className="admin-input font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Fulfillment Status</label>
                  <select value={coStatus} onChange={(e) => setCoStatus(e.target.value as CorporateOrderStatus)} className="admin-input">
                    <option value="Planning">Planning</option>
                    <option value="Sourcing">Sourcing</option>
                    <option value="Printing">Printing</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Order Date</label>
                  <input type="date" value={coDate} onChange={(e) => setCoDate(e.target.value)} className="admin-input" />
                </div>
              </div>

              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#f0ece4] flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold uppercase">Estimated Total Cost:</span>
                <strong className="text-sm font-extrabold text-[#8B4949]">₹{(coQty * coPrice).toLocaleString('en-IN')}</strong>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCorporateOrderModal(false)} className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-gray-500 font-bold text-xs hover:bg-[#faf8f5]">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#8B4949] text-white rounded-xl font-bold text-xs hover:bg-[#723b3b]">
                  {selectedCorporateOrder ? 'Save Changes' : 'Establish Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B2B Conversion Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConvertModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 admin-scale-in border border-[#f0ece4]">
            <button onClick={() => setShowConvertModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-[#1a1410] mb-2">Convert B2B Lead to Order</h3>
            <p className="text-xs text-gray-400 mb-4">Please finalize contract unit rates and client registration details:</p>
            <form onSubmit={handleConversionSubmit} className="space-y-4">
              <div>
                <label className="admin-label">Negotiated Price per Unit (₹) *</label>
                <input type="number" required min={1} value={convertPrice} onChange={(e) => setConvertPrice(Number(e.target.value))} className="admin-input font-bold" />
              </div>
              <div>
                <label className="admin-label">Client GST Identification Number (GSTIN) *</label>
                <input type="text" required maxLength={15} value={convertGst} onChange={(e) => setConvertGst(e.target.value.toUpperCase())} placeholder="e.g. 29AAAAA1111A1Z1" className="admin-input font-mono font-bold" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowConvertModal(false)} className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-gray-500 font-bold text-xs hover:bg-[#faf8f5]">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-bold text-xs hover:bg-green-600">Confirm Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Contact Follow-up ── */}
      {followUpContact && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setFollowUpContact(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 admin-scale-in border border-[#f0ece4]">
            <button onClick={() => setFollowUpContact(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-[#1a1410] mb-2 flex items-center gap-2">
              <Sparkles className="text-amber-500" size={20} />
              Initiate Follow-up
            </h3>
            <p className="text-xs text-gray-500 mb-4">Choose how you want to reach out to <strong>{followUpContact.name}</strong>:</p>
            
            <div className="space-y-3">
              <a
                href={`tel:${followUpContact.phone}`}
                className="flex items-center justify-center gap-3 w-full py-3 bg-[#8B4949] hover:bg-[#723b3b] text-white rounded-xl font-bold text-sm shadow-sm transition-colors"
              >
                <Phone size={16} /> Call {followUpContact.phone}
              </a>
              <a
                href={`https://wa.me/${followUpContact.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm shadow-sm transition-colors"
              >
                <Megaphone size={16} strokeWidth={2} /> WhatsApp Message
              </a>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-400">
              <span>Email: {followUpContact.email}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
