import { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, Search, X, Factory, ClipboardList,
  Truck, Info, Globe, Instagram, Mail, Phone, ExternalLink,
  Percent, DollarSign, CheckCircle2, ChevronRight, Eye, Users
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusBadge } from '../components/StatusBadge';
import type { Vendor, VendorProduct, VendorOrder, VendorCategory, VendorOrderStatus } from '../types';

export default function VendorsManager() {
  const { state, addVendor, updateVendor, deleteVendor, addVendorOrder, updateVendorOrder, deleteVendorOrder } = useAdmin();

  const PARTNER_CATEGORIES = ['Event Planner', 'Wedding Planner', 'Corporate Planner'];
  const isPartner = (category: string) => PARTNER_CATEGORIES.includes(category);

  const [mainTab, setMainTab] = useState<'vendors' | 'partners'>('vendors');
  const [activeTab, setActiveTab] = useState<'vendors' | 'margins' | 'orders'>('vendors');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<VendorCategory | 'all'>('all');

  // Vendor modals
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendorName, setVendorName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [socialId, setSocialId] = useState('');
  const [website, setWebsite] = useState('');
  const [vendorCategory, setVendorCategory] = useState<VendorCategory>('Printed Stationery');
  const [servicesInput, setServicesInput] = useState(''); // Comma-separated
  const [vendorStatus, setVendorStatus] = useState<'Deal' | 'Closed' | 'Paused'>('Deal');

  // Product cost modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [productVendorId, setProductVendorId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<VendorProduct | null>(null);
  const [productName, setProductName] = useState('');
  const [costPrice, setCostPrice] = useState(0);
  const [retailPrice, setRetailPrice] = useState(0);
  const [pricingType, setPricingType] = useState<'Product' | 'Package' | 'Fixed Price'>('Product');

  // Vendor order modals
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);
  const [clientOrderId, setClientOrderId] = useState('');
  const [orderProductName, setOrderProductName] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderVendorId, setOrderVendorId] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderStatus, setOrderStatus] = useState<VendorOrderStatus>('Design Given');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Delete dialogs
  const [deleteVendorId, setDeleteVendorId] = useState<string | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<{ vendorId: string; productId: string } | null>(null);

  // Detailed view dialog
  const [detailVendor, setDetailVendor] = useState<Vendor | null>(null);

  // ── Calculate Metrics summary ────────────────────────────────
  const metrics = useMemo(() => {
    const filteredVnds = state.vendors.filter(v => mainTab === 'partners' ? isPartner(v.category) : !isPartner(v.category));
    const totalVendors = filteredVnds.length;
    
    const activeSourcedOrders = state.vendorOrders.filter(o => {
      const targetVendor = state.vendors.find(v => v.id === o.vendorId);
      const isEventPlannerOrder = targetVendor && isPartner(targetVendor.category);
      const matchesMainTab = mainTab === 'partners' ? isEventPlannerOrder : !isEventPlannerOrder;
      return matchesMainTab && o.status !== 'Delivered';
    }).length;
    
    // Profit margin calculations
    let totalMarginSum = 0;
    let totalProductCount = 0;
    filteredVnds.forEach(v => {
      v.products.forEach(p => {
        if (p.retailPrice > 0) {
          const margin = ((p.retailPrice - p.costPrice) / p.retailPrice) * 100;
          totalMarginSum += margin;
          totalProductCount++;
        }
      });
    });

    const avgMargin = totalProductCount > 0 ? Math.round(totalMarginSum / totalProductCount) : 0;
    return { totalVendors, activeSourcedOrders, totalProductCount, avgMargin };
  }, [state.vendors, state.vendorOrders, mainTab]);

  // ── Filtering & Searches ──────────────────────────────────────
  const filteredVendors = useMemo(() => {
    return state.vendors.filter(v => {
      const matchesMainTab = mainTab === 'partners' ? isPartner(v.category) : !isPartner(v.category);
      const matchSearch =
        !searchQuery ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'all' || v.category === categoryFilter;
      return matchesMainTab && matchSearch && matchCat;
    });
  }, [state.vendors, searchQuery, categoryFilter, mainTab]);

  const allVendorProducts = useMemo(() => {
    const list: { vendor: Vendor; product: VendorProduct }[] = [];
    state.vendors.forEach(v => {
      v.products.forEach(p => {
        list.push({ vendor: v, product: p });
      });
    });

    return list.filter(item => {
      const matchesMainTab = mainTab === 'partners' ? isPartner(item.vendor.category) : !isPartner(item.vendor.category);
      const matchSearch =
        !searchQuery ||
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vendor.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'all' || item.vendor.category === categoryFilter;
      return matchesMainTab && matchSearch && matchCat;
    });
  }, [state.vendors, searchQuery, categoryFilter, mainTab]);

  const filteredOrders = useMemo(() => {
    return state.vendorOrders.filter(o => {
      const targetVendor = state.vendors.find(v => v.id === o.vendorId);
      const isEventPlannerOrder = targetVendor && isPartner(targetVendor.category);
      const matchesMainTab = mainTab === 'partners' ? isEventPlannerOrder : !isEventPlannerOrder;

      const matchSearch =
        !searchQuery ||
        o.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.clientOrderId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMainTab && matchSearch;
    });
  }, [state.vendorOrders, state.vendors, searchQuery, mainTab]);

  // ── Save Handlers ─────────────────────────────────────────────
  const handleVendorSave = (e: React.FormEvent) => {
    e.preventDefault();
    const servicesList = servicesInput.split(',').map(s => s.trim()).filter(Boolean);
    const categoryToSave = vendorCategory;

    if (selectedVendor) {
      // Edit mode
      updateVendor(selectedVendor.id, {
        name: vendorName,
        companyName,
        email,
        phone,
        socialId,
        website,
        category: categoryToSave,
        services: servicesList,
        status: vendorStatus
      });
    } else {
      // Create mode
      const newVendor: Vendor = {
        id: `vnd-${Date.now()}`,
        name: vendorName,
        companyName,
        email,
        phone,
        socialId,
        website,
        category: categoryToSave,
        services: servicesList,
        products: [],
        status: vendorStatus
      };
      addVendor(newVendor);
    }
    setShowVendorModal(false);
    resetVendorForm();
  };

  const resetVendorForm = () => {
    setSelectedVendor(null);
    setVendorName('');
    setCompanyName('');
    setEmail('');
    setPhone('');
    setSocialId('');
    setWebsite('');
    setVendorCategory(mainTab === 'partners' ? 'Event Planner' : 'Printed Stationery');
    setServicesInput('');
    setVendorStatus('Deal');
  };

  const openVendorEdit = (v: Vendor) => {
    setSelectedVendor(v);
    setVendorName(v.name);
    setCompanyName(v.companyName);
    setEmail(v.email);
    setPhone(v.phone);
    setSocialId(v.socialId || '');
    setWebsite(v.website || '');
    setVendorCategory(v.category);
    setServicesInput(v.services.join(', '));
    setVendorStatus(v.status || 'Deal');
    setShowVendorModal(true);
  };

  // Product Sourcing Margin Handlers
  const handleProductSave = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVendor = state.vendors.find(v => v.id === productVendorId);
    if (!targetVendor) return;

    if (selectedProduct) {
      // Edit mode
      const updatedProducts = targetVendor.products.map(p =>
        p.id === selectedProduct.id
          ? { ...p, name: productName, costPrice, retailPrice, pricingType }
          : p
      );
      updateVendor(productVendorId, { products: updatedProducts });
    } else {
      // Create mode
      const newProduct: VendorProduct = {
        id: `vp-${Date.now()}`,
        name: productName,
        costPrice,
        retailPrice,
        pricingType
      };
      updateVendor(productVendorId, { products: [...targetVendor.products, newProduct] });
    }
    setShowProductModal(false);
    resetProductForm();
  };

  const resetProductForm = () => {
    setSelectedProduct(null);
    setProductVendorId('');
    setProductName('');
    setCostPrice(0);
    setRetailPrice(0);
    setPricingType('Product');
  };

  const openProductEdit = (vId: string, p: VendorProduct) => {
    setSelectedProduct(p);
    setProductVendorId(vId);
    setProductName(p.name);
    setCostPrice(p.costPrice);
    setRetailPrice(p.retailPrice);
    setPricingType(p.pricingType || 'Product');
    setShowProductModal(true);
  };

  // Vendor order Handlers
  const handleOrderSave = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVendor = state.vendors.find(v => v.id === orderVendorId);
    const vName = targetVendor ? targetVendor.companyName : 'Unknown Vendor';

    if (selectedOrder) {
      // Edit mode
      updateVendorOrder(selectedOrder.id, {
        status: orderStatus,
        trackingNumber,
        notes: orderNotes
      });
    } else {
      // Create mode
      const newOrder: VendorOrder = {
        id: `vo-${Date.now()}`,
        clientOrderId,
        productName: orderProductName,
        quantity: orderQuantity,
        vendorId: orderVendorId,
        vendorName: vName,
        status: 'Design Given',
        sentDate: new Date().toISOString().split('T')[0],
        notes: orderNotes
      };
      addVendorOrder(newOrder);
    }
    setShowOrderModal(false);
    resetOrderForm();
  };

  const resetOrderForm = () => {
    setSelectedOrder(null);
    setClientOrderId('');
    setOrderProductName('');
    setOrderQuantity(1);
    setOrderVendorId('');
    setOrderNotes('');
    setOrderStatus('Design Given');
    setTrackingNumber('');
  };

  const openOrderEdit = (o: VendorOrder) => {
    setSelectedOrder(o);
    setClientOrderId(o.clientOrderId);
    setOrderProductName(o.productName);
    setOrderQuantity(o.quantity);
    setOrderVendorId(o.vendorId);
    setOrderNotes(o.notes || '');
    setOrderStatus(o.status);
    setTrackingNumber(o.trackingNumber || '');
    setShowOrderModal(true);
  };

  // Confirm delete methods
  const handleDeleteVendor = () => {
    if (deleteVendorId) {
      deleteVendor(deleteVendorId);
      setDeleteVendorId(null);
    }
  };

  const handleDeleteOrder = () => {
    if (deleteOrderId) {
      deleteVendorOrder(deleteOrderId);
      setDeleteOrderId(null);
    }
  };

  const handleDeleteProduct = () => {
    if (deleteProductId) {
      const v = state.vendors.find(x => x.id === deleteProductId.vendorId);
      if (v) {
        const remaining = v.products.filter(p => p.id !== deleteProductId.productId);
        updateVendor(deleteProductId.vendorId, { products: remaining });
      }
      setDeleteProductId(null);
    }
  };

  return (
    <div className="space-y-6 admin-animate-in">
      {/* ── Main Tab Switcher (Vendors vs Partners) ── */}
      <div className="inline-flex bg-[#f5f0e8] p-1 rounded-xl shadow-sm border border-gray-200/50">
        <button
          onClick={() => { setMainTab('vendors'); setCategoryFilter('all'); setActiveTab('vendors'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            mainTab === 'vendors'
              ? 'bg-[#8B4949] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#8B4949]'
          }`}
        >
          <Factory size={16} />
          Vendors
        </button>
        <button
          onClick={() => { setMainTab('partners'); setCategoryFilter('all'); setActiveTab('vendors'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            mainTab === 'partners'
              ? 'bg-[#8B4949] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#8B4949]'
          }`}
        >
          <Users size={16} />
          Partners
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-card flex items-center justify-between p-5">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              {mainTab === 'partners' ? 'Total Partners' : 'Total Vendors'}
            </p>
            <p className="text-2xl font-extrabold text-[#1a1410] mt-1">{metrics.totalVendors}</p>
          </div>
          <div className="w-10 h-10 bg-[#8B4949]/10 rounded-xl flex items-center justify-center text-[#8B4949]">
            <Factory size={20} />
          </div>
        </div>

        <div className="admin-card flex items-center justify-between p-5">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              {mainTab === 'partners' ? 'Active Partner Orders' : 'Active Sourced Orders'}
            </p>
            <p className="text-2xl font-extrabold text-[#1a1410] mt-1">{metrics.activeSourcedOrders}</p>
          </div>
          <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center text-[#D4AF37]">
            <Truck size={20} />
          </div>
        </div>

        <div className="admin-card flex items-center justify-between p-5">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              {mainTab === 'partners' ? 'Tracked Packages' : 'Tracked Products'}
            </p>
            <p className="text-2xl font-extrabold text-[#1a1410] mt-1">{metrics.totalProductCount}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <ClipboardList size={20} />
          </div>
        </div>

        <div className="admin-card flex items-center justify-between p-5">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Avg Margin %</p>
            <p className="text-2xl font-extrabold text-[#1a1410] mt-1">{metrics.avgMargin}%</p>
          </div>
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <Percent size={20} />
          </div>
        </div>
      </div>

      {/* ── Toolbar Actions & Navigation Tabs ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Pill Switching Tabs */}
        <div className="flex bg-[#f5f0e8] p-1 rounded-xl self-start">
          <button
            onClick={() => { setActiveTab('vendors'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'vendors' ? 'bg-[#8B4949] text-white shadow' : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            {mainTab === 'partners' ? 'Partners Directory' : 'Vendors Directory'}
          </button>
          <button
            onClick={() => { setActiveTab('margins'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'margins' ? 'bg-[#8B4949] text-white shadow' : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            {mainTab === 'partners' ? 'Partner Pricing Tracker' : 'Cost & Margin Tracker'}
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'orders' ? 'bg-[#8B4949] text-white shadow' : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            {mainTab === 'partners' ? 'Partner Orders' : 'Sourcing Orders'}
          </button>
        </div>

        {/* Global Toolbar actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search box */}
          <div className="flex items-center gap-2 bg-white border border-[#e5e5e5] rounded-xl px-3.5 py-2 w-full sm:w-64 focus-within:border-[#8B4949] transition-all">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'vendors'
                  ? (mainTab === 'partners' ? 'Search partners...' : 'Search vendors...')
                  : activeTab === 'margins'
                  ? 'Search items...'
                  : 'Search orders...'
              }
              className="bg-transparent border-none outline-none text-sm text-[#4a4a4a] placeholder-gray-400 w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X size={13} className="text-gray-405" />
              </button>
            )}
          </div>

          {/* Sourcing Category filters (Vendors & Margin tabs only) */}
          {activeTab !== 'orders' && mainTab !== 'partners' && (
            <div className="bg-white border border-[#e5e5e5] rounded-xl px-3 py-2 text-sm text-[#4a4a4a] focus-within:border-[#8B4949]">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="all">All Sourcing Types</option>
                <option value="Printed Stationery">Printed Stationery</option>
                <option value="Printed Invites">Printed Invites</option>
                <option value="Gifts">Gifts</option>
              </select>
            </div>
          )}

          {/* Tab specific Add buttons */}
          {activeTab === 'vendors' && (
            <button onClick={() => { resetVendorForm(); setShowVendorModal(true); }} className="admin-btn admin-btn-primary">
              <Plus size={15} /> {mainTab === 'partners' ? 'Add Partner' : 'Add Vendor'}
            </button>
          )}
          {activeTab === 'margins' && (
            <button onClick={() => { resetProductForm(); setShowProductModal(true); }} className="admin-btn admin-btn-primary">
              <Plus size={15} /> {mainTab === 'partners' ? 'Add Partner Pricing' : 'Link Product Cost'}
            </button>
          )}
          {activeTab === 'orders' && (
            <button onClick={() => { resetOrderForm(); setShowOrderModal(true); }} className="admin-btn admin-btn-primary">
              <Plus size={15} /> {mainTab === 'partners' ? 'Dispatch Partner Order' : 'Dispatch Sourcing Order'}
            </button>
          )}
        </div>
      </div>

      {/* ── TAB 1: Vendors Directory ── */}
      {activeTab === 'vendors' && (
        <div className="admin-card !p-0 overflow-hidden w-full max-w-full">
          <div className="overflow-x-auto w-full">
            <table className="admin-table w-full">
              <thead>
                <tr>
                  <th>{mainTab === 'partners' ? 'Partner' : 'Vendor'}</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Contact</th>
                  <th>Services</th>
                  <th>Linked</th>
                  <th style={{ width: 110 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">No {mainTab === 'partners' ? 'partners' : 'vendors'} found matching criteria</td>
                  </tr>
                ) : (
                  filteredVendors.map(v => (
                    <tr key={v.id}>
                      <td>
                        <div>
                          <p className="font-bold text-sm text-[#1a1410]">{v.companyName}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Rep: {v.name}</p>
                        </div>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-info text-xs">{v.category}</span>
                      </td>
                      <td>
                        {(() => {
                          const status = v.status || 'Deal';
                          let badgeClass = 'bg-green-50 text-green-700 border-green-200';
                          if (status === 'Paused') {
                            badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                          } else if (status === 'Closed') {
                            badgeClass = 'bg-red-50 text-red-700 border-red-200';
                          }
                          return (
                            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold inline-flex items-center gap-1 whitespace-nowrap ${badgeClass}`}>
                              {status}
                            </span>
                          );
                        })()}
                      </td>
                      <td>
                        <div className="text-xs space-y-0.5 whitespace-nowrap">
                          <p className="flex items-center gap-1.5 text-gray-600">
                            <Mail size={12} className="text-gray-400 flex-shrink-0" /> {v.email}
                          </p>
                          <p className="flex items-center gap-1.5 text-gray-600">
                            <Phone size={12} className="text-gray-400 flex-shrink-0" /> {v.phone}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {v.services.slice(0, 3).map(s => (
                            <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#faf8f5] border border-gray-200 text-gray-600 whitespace-nowrap">
                              {s}
                            </span>
                          ))}
                          {v.services.length > 3 && (
                            <span className="text-[10px] text-gray-400 font-bold self-center pl-1 whitespace-nowrap">
                              +{v.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold whitespace-nowrap">
                          {v.products.length} {mainTab === 'partners' ? 'Items' : 'Products'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setDetailVendor(v)} className="admin-btn admin-btn-ghost admin-btn-icon" title="View details">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => openVendorEdit(v)} className="admin-btn admin-btn-ghost admin-btn-icon" title={mainTab === 'partners' ? 'Edit Partner' : 'Edit Vendor'}>
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteVendorId(v.id)} className="admin-btn admin-btn-ghost admin-btn-icon text-red-500 hover:bg-red-50" title={mainTab === 'partners' ? 'Delete Partner' : 'Delete Vendor'}>
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

      {/* ── TAB 2: Cost & Margin Tracker ── */}
      {activeTab === 'margins' && (
        <div className="admin-card !p-0 overflow-hidden w-full max-w-full">
          <div className="overflow-x-auto w-full">
            <table className="admin-table w-full">
              <thead>
                <tr>
                  <th>Product / Package</th>
                  <th>{mainTab === 'partners' ? 'Partner' : 'Vendor'}</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Cost (₹)</th>
                  <th style={{ textAlign: 'right' }}>Price (₹)</th>
                  <th style={{ textAlign: 'right' }}>Margin (₹)</th>
                  <th>Margin %</th>
                  <th style={{ width: 90 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allVendorProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400">No sourcing product costs configured</td>
                  </tr>
                ) : (
                  allVendorProducts.map(({ vendor, product }) => {
                    const marginValue = product.retailPrice - product.costPrice;
                    const marginPercent = product.retailPrice > 0 ? Math.round((marginValue / product.retailPrice) * 100) : 0;
                    
                    // Style markup based on margin %
                    let marginColorClass = 'text-red-600 bg-red-50 border-red-200';
                    let marginLevel = 'Low Profit';
                    if (marginPercent >= 50) {
                      marginColorClass = 'text-green-700 bg-green-50 border-green-200';
                      marginLevel = 'High Profit';
                    } else if (marginPercent >= 30) {
                      marginColorClass = 'text-amber-700 bg-amber-50 border-amber-200';
                      marginLevel = 'Healthy Profit';
                    }

                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-[#1a1410]">{product.name}</span>
                            {product.pricingType === 'Package' && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap">
                                Package
                              </span>
                            )}
                            {product.pricingType === 'Fixed Price' && (
                              <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap">
                                Fixed Price
                              </span>
                            )}
                          </div>
                        </td>
                        <td><p className="text-sm font-medium text-gray-600 whitespace-nowrap">{vendor.companyName}</p></td>
                        <td><span className="admin-badge admin-badge-info text-xs">{vendor.category}</span></td>
                        <td className="font-semibold text-right text-gray-500 whitespace-nowrap">₹{product.costPrice.toLocaleString('en-IN')}</td>
                        <td className="font-semibold text-right text-[#8B4949] whitespace-nowrap">₹{product.retailPrice.toLocaleString('en-IN')}</td>
                        <td className="font-semibold text-right text-green-600 whitespace-nowrap">₹{marginValue.toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold inline-flex items-center gap-1 whitespace-nowrap ${marginColorClass}`}>
                            {marginPercent}% · {marginLevel}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button onClick={() => openProductEdit(vendor.id, product)} className="admin-btn admin-btn-ghost admin-btn-icon" title="Edit cost">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => setDeleteProductId({ vendorId: vendor.id, productId: product.id })} className="admin-btn admin-btn-ghost admin-btn-icon text-red-500 hover:bg-red-50" title="Delete cost link">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: Sourcing Tracker ── */}
      {activeTab === 'orders' && (
        <div className="admin-card !p-0 overflow-hidden w-full max-w-full">
          <div className="overflow-x-auto w-full">
            <table className="admin-table w-full">
              <thead>
                <tr>
                  <th>Sourcing ID</th>
                  <th>Client ID</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>{mainTab === 'partners' ? 'Partner' : 'Vendor'}</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Tracking</th>
                  <th style={{ width: 90 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-400">No vendor sourcing orders placed</td>
                  </tr>
                ) : (
                  filteredOrders.map(o => (
                    <tr key={o.id}>
                      <td className="font-mono text-xs text-gray-400 font-bold whitespace-nowrap">{o.id}</td>
                      <td><span className="font-bold text-sm text-[#8B4949] whitespace-nowrap">{o.clientOrderId}</span></td>
                      <td><p className="font-bold text-sm text-[#1a1410]">{o.productName}</p></td>
                      <td><span className="px-2.5 py-0.5 rounded-lg bg-gray-100 text-xs font-bold text-gray-600 whitespace-nowrap">{o.quantity} pcs</span></td>
                      <td><p className="text-sm font-medium text-gray-600 whitespace-nowrap">{o.vendorName}</p></td>
                      <td className="text-xs text-gray-500 whitespace-nowrap">{o.sentDate}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border capitalize whitespace-nowrap ${
                          o.status === 'Delivered'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : o.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : o.status === 'Printed'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td>
                        {o.trackingNumber ? (
                          <div className="text-xs space-y-0.5 whitespace-nowrap">
                            <p className="font-semibold text-gray-700">{o.trackingNumber}</p>
                            <p className="text-[10px] text-gray-400">Shipped</p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic whitespace-nowrap">Not Shipped Yet</span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => openOrderEdit(o)} className="admin-btn admin-btn-ghost admin-btn-icon" title="Update status">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteOrderId(o.id)} className="admin-btn admin-btn-ghost admin-btn-icon text-red-500 hover:bg-red-50" title="Delete sourced order">
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

      {/* ── MODAL: Add/Edit Vendor ── */}
      {showVendorModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowVendorModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 admin-scale-in">
            <button onClick={() => setShowVendorModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-[#1a1410] mb-4">
              {selectedVendor 
                ? (mainTab === 'partners' ? 'Edit Partner' : 'Edit Sourcing Vendor') 
                : (mainTab === 'partners' ? 'Add Partner' : 'Add Sourcing Vendor')}
            </h3>
            <form onSubmit={handleVendorSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Representative Name</label>
                  <input type="text" required value={vendorName} onChange={(e) => setVendorName(e.target.value)} placeholder="e.g. Rajesh Kumar" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Company Name</label>
                  <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Apex Prints" className="admin-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Email Address</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rep@company.in" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">WhatsApp Calling No.</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 99887 76655" className="admin-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Social / Instagram ID</label>
                  <input type="text" value={socialId} onChange={(e) => setSocialId(e.target.value)} placeholder="@apex_prints" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Website URL</label>
                  <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://apexprints.in" className="admin-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Category</label>
                  <select 
                    value={vendorCategory} 
                    onChange={(e) => setVendorCategory(e.target.value as any)} 
                    className="admin-input"
                  >
                    {mainTab === 'partners' ? (
                      <>
                        <option value="Event Planner">Event Planner</option>
                        <option value="Wedding Planner">Wedding Planner</option>
                        <option value="Corporate Planner">Corporate Planner</option>
                      </>
                    ) : (
                      <>
                        <option value="Printed Stationery">Printed Stationery</option>
                        <option value="Printed Invites">Printed Invites</option>
                        <option value="Gifts">Gifts</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Partnership Status</label>
                  <select value={vendorStatus} onChange={(e) => setVendorStatus(e.target.value as any)} className="admin-input">
                    <option value="Deal">Deal</option>
                    <option value="Paused">Paused</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="admin-label">Services Offered (comma-separated)</label>
                <input type="text" value={servicesInput} onChange={(e) => setServicesInput(e.target.value)} placeholder="Screen Printing, Matte Lamination, Gold Foil Stamping" className="admin-input" />
              </div>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowVendorModal(false)} className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-gray-500 font-bold text-xs hover:bg-[#faf8f5]">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#8B4949] text-white rounded-xl font-bold text-xs hover:bg-[#723b3b]">
                  {mainTab === 'partners' ? 'Save Partner' : 'Save Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Configure Product & Package Cost ── */}
      {showProductModal && (() => {
        const selectedVendorForProd = state.vendors.find(v => v.id === productVendorId);
        const isEventPlanner = selectedVendorForProd?.category === 'Event Planner';
        
        return (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowProductModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 admin-scale-in">
              <button onClick={() => setShowProductModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
              <h3 className="text-lg font-bold text-[#1a1410] mb-4">
                {selectedProduct 
                  ? (isEventPlanner ? 'Update Partner Pricing' : 'Update Product Cost Link') 
                  : isEventPlanner 
                  ? 'Configure Partner Product & Package' 
                  : 'Link Product Sourcing Cost'}
              </h3>
              <form onSubmit={handleProductSave} className="space-y-4">
                <div>
                  <label className="admin-label">{isEventPlanner ? 'B2B Partner Company' : 'Sourcing Vendor'}</label>
                  <select required disabled={!!selectedProduct} value={productVendorId} onChange={(e) => setProductVendorId(e.target.value)} className="admin-input">
                    <option value="">-- Choose {mainTab === 'partners' ? 'Partner' : 'Vendor'} --</option>
                    {state.vendors
                      .filter(v => mainTab === 'partners' ? v.category === 'Event Planner' : v.category !== 'Event Planner')
                      .map(v => (
                        <option key={v.id} value={v.id}>{v.companyName} ({v.category})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="admin-label">{isEventPlanner ? 'Product / Package Name' : 'Product / Service Name'}</label>
                  <input type="text" required value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={isEventPlanner ? "e.g. B2B Stationery Package" : "e.g. Laser Cut Wedding Box"} className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Pricing / Item Type</label>
                  <select value={pricingType} onChange={(e) => setPricingType(e.target.value as any)} className="admin-input">
                    <option value="Product">Standard Product</option>
                    <option value="Package">Fixed Package</option>
                    <option value="Fixed Price">Fixed Price</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">{isEventPlanner ? 'Actual Production Cost (₹)' : 'Wholesale Cost Price (₹)'}</label>
                    <input type="number" required min={0} value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">{isEventPlanner ? 'Selling Price to Partner (₹)' : 'Client Retail Price (₹)'}</label>
                    <input type="number" required min={0} value={retailPrice} onChange={(e) => setRetailPrice(Number(e.target.value))} className="admin-input" />
                  </div>
                </div>

                {costPrice > 0 && retailPrice > 0 && (
                  <div className="p-3 bg-[#faf8f5] rounded-xl border border-gray-150 text-xs space-y-1">
                    <p className="font-bold text-[#8B4949] uppercase tracking-wider text-[10px]">
                      {isEventPlanner ? 'Partner Margin Analysis' : 'Calculated Margin Analysis'}
                    </p>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{isEventPlanner ? 'Partner Markup Margin (₹):' : 'Gross Profit Margin (₹):'}</span>
                      <span className="font-bold text-green-600">₹{(retailPrice - costPrice).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Profit Percentage (%):</span>
                      <span className="font-bold text-[#8B4949]">{Math.round(((retailPrice - costPrice) / retailPrice) * 100)}%</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-3">
                  <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-gray-500 font-bold text-xs hover:bg-[#faf8f5]">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#8B4949] text-white rounded-xl font-bold text-xs hover:bg-[#723b3b]">
                    {selectedProduct ? 'Save Changes' : isEventPlanner ? 'Add Partner Item' : 'Link Cost'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* ── MODAL: Dispatch / Edit Vendor Sourcing Order ── */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowOrderModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 admin-scale-in">
            <button onClick={() => setShowOrderModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-[#1a1410] mb-4">
              {selectedOrder ? 'Update Sourcing Status' : 'Dispatch New Vendor Sourcing Order'}
            </h3>
            <form onSubmit={handleOrderSave} className="space-y-4">
              {!selectedOrder ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="admin-label">Client Order ID</label>
                      <input type="text" required value={clientOrderId} onChange={(e) => setClientOrderId(e.target.value)} placeholder="e.g. ORD-004" className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Sourcing Quantity</label>
                      <input type="number" required min={1} value={orderQuantity} onChange={(e) => setOrderQuantity(Number(e.target.value))} className="admin-input" />
                    </div>
                  </div>
                  <div>
                    <label className="admin-label">Product Name</label>
                    <input type="text" required value={orderProductName} onChange={(e) => setOrderProductName(e.target.value)} placeholder="e.g. Gold Foil Envelope" className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">{mainTab === 'partners' ? 'Sourcing Partner' : 'Sourcing Vendor'}</label>
                    <select required value={orderVendorId} onChange={(e) => setOrderVendorId(e.target.value)} className="admin-input">
                      <option value="">-- Choose {mainTab === 'partners' ? 'Partner' : 'Vendor'} --</option>
                      {state.vendors
                        .filter(v => mainTab === 'partners' ? v.category === 'Event Planner' : v.category !== 'Event Planner')
                        .map(v => (
                          <option key={v.id} value={v.id}>{v.companyName} ({v.category})</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="admin-label">Fulfillment Status</label>
                    <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value as any)} className="admin-input">
                      <option value="Design Given">Design Given</option>
                      <option value="Printed">Printed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">Courier Tracking Number</label>
                    <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Enter tracking code (optional)" className="admin-input" />
                  </div>
                </>
              )}
              <div>
                <label className="admin-label">Internal notes / source remarks</label>
                <textarea rows={3} value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} placeholder="Enter instructions for the vendor..." className="admin-input resize-none" />
              </div>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowOrderModal(false)} className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-gray-500 font-bold text-xs hover:bg-[#faf8f5]">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#8B4949] text-white rounded-xl font-bold text-xs hover:bg-[#723b3b]">Save Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DRAWER: Detailed Vendor profile ── */}
      {detailVendor && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setDetailVendor(null)} />
          <div className="relative w-full max-w-md bg-white h-screen shadow-2xl p-6 flex flex-col justify-between admin-animate-slide-in">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-bold text-lg text-[#1a1410] flex items-center gap-2">
                  <Factory size={18} className="text-[#8B4949]" /> {mainTab === 'partners' ? 'Partner Details' : 'Vendor Details'}
                </h3>
                <button onClick={() => setDetailVendor(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>

              {/* General details */}
              <div className="mt-5 space-y-4">
                <div className="text-center pb-4 border-b border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-tr from-[#8B4949] to-[#D4AF37] text-white font-bold text-xl rounded-2xl flex items-center justify-center mx-auto mb-2">
                    {detailVendor.companyName.charAt(0)}
                  </div>
                  <h4 className="font-bold text-[#1a1410] text-base">{detailVendor.companyName}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Sourcing Category: {detailVendor.category}</p>
                  <div className="mt-2">
                    {(() => {
                      const status = detailVendor.status || 'Deal';
                      let badgeClass = 'bg-green-50 text-green-700 border-green-200';
                      if (status === 'Paused') {
                        badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                      } else if (status === 'Closed') {
                        badgeClass = 'bg-red-50 text-red-700 border-red-200';
                      }
                      return (
                        <span className={`px-2.5 py-0.5 rounded-full border text-xs font-bold inline-flex items-center gap-1 ${badgeClass}`}>
                          Status: {status}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Representative:</span>
                    <span className="font-semibold text-gray-700">{detailVendor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="font-semibold text-gray-700 flex items-center gap-1.5">{detailVendor.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">WhatsApp/Phone:</span>
                    <span className="font-semibold text-gray-700 flex items-center gap-1.5">{detailVendor.phone}</span>
                  </div>
                  {detailVendor.socialId && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Instagram Handle:</span>
                      <span className="font-semibold text-[#8B4949] flex items-center gap-1">
                        <Instagram size={13} /> {detailVendor.socialId}
                      </span>
                    </div>
                  )}
                  {detailVendor.website && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Website Address:</span>
                      <a href={detailVendor.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#8B4949] hover:underline flex items-center gap-1">
                        {detailVendor.website.replace(/^https?:\/\//, '')} <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>

                {/* Services list */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="font-bold text-xs text-[#8B4949] uppercase tracking-wider mb-2">Capabilities / Services</p>
                  <div className="flex flex-wrap gap-1.5">
                    {detailVendor.services.map(s => (
                      <span key={s} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#faf8f5] border border-gray-200 text-gray-600">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Associated Products list */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="font-bold text-xs text-[#8B4949] uppercase tracking-wider mb-2">Associated wholesale cost catalogs ({detailVendor.products.length})</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto admin-scrollbar pr-1">
                    {detailVendor.products.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No cost items linked to this vendor</p>
                    ) : (
                      detailVendor.products.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-2 bg-[#faf8f5] rounded-xl border border-gray-150 text-xs">
                          <span className="font-medium text-gray-700 truncate max-w-[180px]">{p.name}</span>
                          <span className="text-gray-400">
                            Cost: <strong className="text-gray-600">₹{p.costPrice}</strong> · Margin: <strong className="text-green-600">{Math.round(((p.retailPrice - p.costPrice) / p.retailPrice) * 100)}%</strong>
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => { openVendorEdit(detailVendor); setDetailVendor(null); }} className="admin-btn admin-btn-primary w-full justify-center mt-6">
              <Pencil size={14} /> Edit {mainTab === 'partners' ? 'Partner' : 'Vendor'} details
            </button>
          </div>
        </div>
      )}

      {/* ── Dialogs: Confirm Delete actions ── */}
      <ConfirmDialog
        open={!!deleteVendorId}
        title={mainTab === 'partners' ? 'Remove Partner' : 'Remove Sourcing Vendor'}
        message={
          mainTab === 'partners'
            ? 'Are you sure you want to remove this partner? All linked product pricing data will remain but they will lose this association.'
            : 'Are you sure you want to remove this sourcing vendor? All linked product cost data will remain but they will lose this vendor association.'
        }
        confirmLabel={mainTab === 'partners' ? 'Remove Partner' : 'Remove Vendor'}
        onConfirm={handleDeleteVendor}
        onCancel={() => setDeleteVendorId(null)}
        danger
      />

      <ConfirmDialog
        open={!!deleteOrderId}
        title="Delete Sourcing Order"
        message="Are you sure you want to delete this vendor sourcing order? This action cannot be undone."
        confirmLabel="Delete Order"
        onConfirm={handleDeleteOrder}
        onCancel={() => setDeleteOrderId(null)}
        danger
      />

      <ConfirmDialog
        open={!!deleteProductId}
        title="Unlink Product Cost"
        message="Are you sure you want to unlink and delete this product's cost tracking information?"
        confirmLabel="Unlink Cost"
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeleteProductId(null)}
        danger
      />
    </div>
  );
}
