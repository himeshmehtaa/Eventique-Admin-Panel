import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search, Filter, X, Eye, Package, ShoppingBag, Laptop, Calendar } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DragDropList } from '../components/DragDropList';
import { ProductForm } from '../components/ProductForm';
import { StatsCard } from '../components/StatsCard';
import type { Product, ProductType, OccasionType } from '../../data/products';

const TYPE_LABELS: Record<string, string> = {
  'video-invite': 'Video Invite',
  'pdf-invite': 'PDF Invite',
  'e-invitation': 'Gifts / E-Invitation',
  'wedding-website': 'Event Website',
  'stationery': 'Stationery',
  'website': 'Wedding Website',
  'printed-invite': 'Printed Invite',
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts.map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]} ${y}`;
};

export default function ProductsManager() {
  const { state, deleteProduct, reorderProducts } = useAdmin();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ProductType | 'all'>('all');
  const [occasionFilter, setOccasionFilter] = useState<OccasionType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  // Pill filter tabs
  const TYPE_TABS: { value: ProductType | 'all'; label: string }[] = [
    { value: 'all',             label: 'All' },
    { value: 'video-invite',    label: 'Video Invites' },
    { value: 'pdf-invite',      label: 'PDF Invites' },
    { value: 'wedding-website', label: 'Event Websites' },
    { value: 'printed-invite',  label: 'Printed Invites' },
    { value: 'stationery',      label: 'Stationery' },
    { value: 'e-invitation',    label: 'Gifts' },
  ];

  // ── Calculate catalog stats summary ────────────────────────
  const stats = useMemo(() => {
    const total = state.products.length;
    const digitalTypes = ['video-invite', 'pdf-invite', 'e-invitation', 'wedding-website', 'website'];
    const digital = state.products.filter(p => digitalTypes.includes(p.type)).length;
    const physical = total - digital;

    return { total, digital, physical };
  }, [state.products]);

  // ── Determine top-selling products from order history ──────
  const topProductNames = useMemo(() => {
    const counts: Record<string, number> = {};
    state.orders.forEach((o) => {
      if (o.status !== 'Cancelled') {
        counts[o.productName] = (counts[o.productName] || 0) + o.amount;
      }
    });
    // Return top 3 products by revenue
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);
  }, [state.orders]);

  // Rolling days calculation helpers
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  const filtered = state.products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || p.type === typeFilter || (typeFilter === 'wedding-website' && p.type === 'website');
    const matchOccasion = occasionFilter === 'all' || p.occasion === occasionFilter;

    const matchTime = (() => {
      if (timeFilter === 'all') return true;
      if (!p.createdAt) return false;
      const [year, month, day] = p.createdAt.split('-').map(Number);
      const createdDate = new Date(year, month - 1, day);
      const diffDays = (todayMidnight - createdDate.getTime()) / MS_PER_DAY;
      if (diffDays < 0) return false;
      if (timeFilter === 'week') return diffDays <= 7;
      if (timeFilter === 'month') return diffDays <= 30;
      if (timeFilter === 'year') return diffDays <= 365;
      return true;
    })();

    return matchSearch && matchType && matchOccasion && matchTime;
  });

  const handleEdit = (p: Product) => { setEditProduct(p); setShowForm(true); };
  const handleDelete = () => { if (deleteId) { deleteProduct(deleteId); setDeleteId(null); } };
  const handleFormClose = () => { setShowForm(false); setEditProduct(null); };

  return (
    <div className="space-y-6 admin-animate-in">
      
      {/* ── Stats Summary Row ── */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          label="Total Catalog"
          value={stats.total}
          icon={<Package size={20} />}
          color="primary"
        />
        <StatsCard
          label="Digital Designs"
          value={stats.digital}
          icon={<Laptop size={20} />}
          color="blue"
        />
        <StatsCard
          label="Physical Products"
          value={stats.physical}
          icon={<ShoppingBag size={20} />}
          color="gold"
        />
      </div>

      {/* ── Filter Bar Card ── */}
      <div className="bg-white border border-[#e5e5e5] rounded-2xl p-4 md:p-5 space-y-4 shadow-sm">
        {/* Top Control Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Search */}
            <div className="flex items-center gap-2 bg-[#faf8f5] border border-[#e5e5e5] rounded-xl px-3.5 py-2.5 min-w-[200px] max-w-xs focus-within:border-[#8B4949] focus-within:shadow-[0_0_0_3px_rgba(139,73,73,0.08)] transition-all flex-1">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent border-none outline-none text-sm text-[#4a4a4a] placeholder-gray-400 w-full"
              />
              {search && (
                <button onClick={() => setSearch('')} className="flex-shrink-0">
                  <X size={13} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Time Span Filter Dropdown */}
            <div className="flex items-center gap-2 bg-[#faf8f5] border border-[#e5e5e5] rounded-xl px-3.5 py-2.5 focus-within:border-[#8B4949] transition-all">
              <Calendar size={14} className="text-gray-400 flex-shrink-0" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="bg-transparent border-none outline-none text-sm text-[#4a4a4a] cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="week">Added This Week</option>
                <option value="month">Added This Month</option>
                <option value="year">Added This Year</option>
              </select>
            </div>
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => { setEditProduct(null); setShowForm(true); }}
            className="admin-btn admin-btn-primary justify-center sm:justify-start flex-shrink-0 shadow-sm"
          >
            <Plus size={15} /> Add Product
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-[#ede9e1]" />

        {/* Category Pills Row (Scrolls horizontally on overflow, stays perfectly in a single row) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 -my-1 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {TYPE_TABS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                typeFilter === value
                  ? 'bg-[#8B4949] text-white shadow-sm shadow-[#8B4949]/20'
                  : 'bg-[#faf8f5] text-[#4a4a4a] border border-[#ede9e1] hover:bg-[#ece5d8] hover:text-[#1a1410]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Count + view toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing <span className="font-semibold text-[#1a1410]">{filtered.length}</span> of {state.products.length} products
        </p>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex gap-1 p-1 bg-[#f5f0e8] rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'table' ? 'bg-white text-[#8B4949] shadow-sm cursor-pointer' : 'text-gray-500 hover:text-[#4a4a4a] cursor-pointer'}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'grid' ? 'bg-white text-[#8B4949] shadow-sm cursor-pointer' : 'text-gray-500 hover:text-[#4a4a4a] cursor-pointer'}`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="admin-card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}></th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Occasion</th>
                  <th>Price</th>
                  <th>Delivery</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">No products found</td></tr>
                )}
                {filtered.map((p) => {
                  const isTopSeller = topProductNames.includes(p.name);
                  return (
                    <tr key={p.id}>
                      <td className="py-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-12 h-16 rounded-lg object-cover border border-[#e5e5e5] shadow-sm flex-shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x64?text=Img'; }}
                        />
                      </td>
                      <td>
                        <div className="py-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-[#1a1410] text-sm">{p.name}</p>
                            {p.tier && (
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border inline-flex items-center gap-0.5 whitespace-nowrap uppercase tracking-wider ${
                                p.tier === 'Luxury'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : p.tier === 'Premium'
                                  ? 'bg-[#D4AF37]/10 text-[#b59224] border-[#D4AF37]/30'
                                  : p.tier === 'Standard'
                                  ? 'bg-gray-50 text-gray-600 border-gray-200'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {p.tier}
                              </span>
                            )}
                            {isTopSeller && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#D4AF37]/10 text-[#b59224] border border-[#D4AF37]/30 inline-flex items-center gap-0.5 whitespace-nowrap">
                                🔥 Top Seller
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{p.description}</p>
                          <p className="text-[10px] text-gray-400 mt-1">Added: {formatDate(p.createdAt)}</p>
                        </div>
                      </td>
                      <td><span className="admin-badge admin-badge-info capitalize">{TYPE_LABELS[p.type]}</span></td>
                      <td className="capitalize text-sm">{p.occasion.replace(/-/g, ' ')}</td>
                      <td className="font-semibold text-[#8B4949]">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="text-sm text-gray-500">{p.deliveryTime}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setPreviewProduct(p)} className="admin-btn admin-btn-ghost admin-btn-icon" title="Preview">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => handleEdit(p)} className="admin-btn admin-btn-ghost admin-btn-icon" title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteId(p.id)} className="admin-btn admin-btn-ghost admin-btn-icon text-red-400 hover:text-red-600 hover:bg-red-50" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => {
            const isTopSeller = topProductNames.includes(p.name);
            return (
              <div key={p.id} className="admin-card !p-0 overflow-hidden group">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f0e8]">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button onClick={() => setPreviewProduct(p)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Eye size={15} className="text-[#4a4a4a]" />
                    </button>
                    <button onClick={() => handleEdit(p)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Pencil size={15} className="text-[#8B4949]" />
                    </button>
                    <button onClick={() => setDeleteId(p.id)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Trash2 size={15} className="text-red-500" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                    <span className="admin-badge admin-badge-info text-[10px]">{TYPE_LABELS[p.type]}</span>
                    {p.tier && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border inline-flex items-center gap-0.5 shadow-sm whitespace-nowrap uppercase tracking-wider ${
                        p.tier === 'Luxury'
                          ? 'bg-purple-600 text-white border-purple-600'
                          : p.tier === 'Premium'
                          ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
                          : p.tier === 'Standard'
                          ? 'bg-white text-gray-700 border-gray-200'
                          : 'bg-blue-600 text-white border-blue-600'
                      }`}>
                        {p.tier}
                      </span>
                    )}
                    {isTopSeller && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#D4AF37] text-white shadow-sm inline-flex items-center gap-0.5">
                        🔥 Top Seller
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm text-[#1a1410] truncate">{p.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[#8B4949] font-bold text-sm">₹{p.price.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-gray-400 capitalize">{p.occasion.replace(/-/g, ' ')}</span>
                  </div>
                  <div className="mt-1.5 pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                    <span>Added: {formatDate(p.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full admin-empty">
              <Filter size={32} />
              <p className="font-medium text-[#4a4a4a] mt-2">No products found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}

      {/* Drag-drop reorder (shown only when no filters) */}
      {!search && typeFilter === 'all' && occasionFilter === 'all' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-semibold text-[#1a1410]">Drag to Reorder Products</h3>
            <p className="text-xs text-gray-400">Order affects product listing on the website</p>
          </div>
          <DragDropList
            items={state.products}
            onReorder={reorderProducts}
            type="PRODUCT"
            renderItem={(p) => (
              <div className="flex items-center gap-3 py-2 px-3 bg-[#faf8f5] rounded-lg border border-[#e5e5e5]">
                <img src={p.imageUrl} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/36'; }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1a1410] truncate">{p.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{TYPE_LABELS[p.type]} · {p.occasion.replace(/-/g, ' ')}</p>
                </div>
                <span className="text-sm font-bold text-[#8B4949] flex-shrink-0">₹{p.price.toLocaleString('en-IN')}</span>
              </div>
            )}
          />
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editProduct}
          onClose={handleFormClose}
          defaultType={typeFilter !== 'all' ? typeFilter : undefined}
        />
      )}

      {/* Preview Modal */}
      {previewProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPreviewProduct(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden admin-scale-in">
            <button
              onClick={() => setPreviewProduct(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white text-gray-500"
            >
              <X size={15} />
            </button>
            <div className="overflow-y-auto flex-1 admin-scrollbar">
              <img
                src={previewProduct.imageUrl}
                alt={previewProduct.name}
                className="w-full aspect-video object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="admin-badge admin-badge-info text-xs capitalize inline-block">{TYPE_LABELS[previewProduct.type]}</span>
                      {previewProduct.tier && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border inline-flex items-center gap-0.5 whitespace-nowrap uppercase tracking-wider ${
                          previewProduct.tier === 'Luxury'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : previewProduct.tier === 'Premium'
                            ? 'bg-amber-50 text-[#b59224] border-[#D4AF37]/30'
                            : previewProduct.tier === 'Standard'
                            ? 'bg-gray-50 text-gray-600 border-gray-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>{previewProduct.tier}</span>
                      )}
                      {previewProduct.promoTag && (
                        <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">{previewProduct.promoTag}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-[#1a1410]">{previewProduct.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{previewProduct.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                    <p className="text-2xl font-bold text-[#8B4949]">₹{previewProduct.price.toLocaleString('en-IN')}</p>
                    {previewProduct.originalPrice && previewProduct.originalPrice > previewProduct.price && (
                      <p className="text-xs text-gray-400 line-through">₹{previewProduct.originalPrice.toLocaleString('en-IN')}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {previewProduct.features.map((f) => (
                    <span key={f} className="text-xs px-2 py-1 bg-[#f5f0e8] text-[#4a4a4a] rounded-full">{f}</span>
                  ))}
                </div>

                {/* Dynamic Specifications */}
                {(previewProduct.size || previewProduct.moq || previewProduct.material || previewProduct.paperQuality || previewProduct.shape || previewProduct.color || previewProduct.videoUrl || previewProduct.demoUrl || previewProduct.canPersonalise) && (
                  <div className="mt-4 p-3 bg-[#faf8f5] rounded-xl border border-gray-150 space-y-2 text-xs">
                    <p className="font-bold text-[#8B4949] uppercase tracking-wider text-[10px]">Specifications</p>
                    {previewProduct.size && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Size:</span>
                        <span className="font-medium text-[#1a1410]">{previewProduct.size}</span>
                      </div>
                    )}
                    {previewProduct.moq && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">MOQ:</span>
                        <span className="font-medium text-[#1a1410]">{previewProduct.moq}</span>
                      </div>
                    )}
                    {previewProduct.shape && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Shape:</span>
                        <span className="font-medium text-[#1a1410]">{previewProduct.shape}</span>
                      </div>
                    )}
                    {previewProduct.color && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Colour Theme:</span>
                        <span className="font-medium text-[#1a1410]">{previewProduct.color}</span>
                      </div>
                    )}
                    {previewProduct.paperQuality && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Paper Quality:</span>
                        <span className="font-medium text-[#1a1410]">{previewProduct.paperQuality}</span>
                      </div>
                    )}
                    {previewProduct.material && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Material:</span>
                        <span className="font-medium text-[#1a1410]">{previewProduct.material}</span>
                      </div>
                    )}
                    {previewProduct.canPersonalise && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Customizable:</span>
                        <span className="font-medium text-green-600">Yes</span>
                      </div>
                    )}
                    {previewProduct.videoUrl && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Video Link:</span>
                        <a href={previewProduct.videoUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-[#8B4949] hover:underline truncate max-w-[180px]">{previewProduct.videoUrl}</a>
                      </div>
                    )}
                    {previewProduct.demoUrl && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Demo Link:</span>
                        <a href={previewProduct.demoUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-[#8B4949] hover:underline truncate max-w-[180px]">{previewProduct.demoUrl}</a>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-gray-400 mt-3">
                  <span>⏱ {previewProduct.deliveryTime} delivery</span>
                  <span>Added: {formatDate(previewProduct.createdAt)}</span>
                </div>
                <button
                  onClick={() => { handleEdit(previewProduct); setPreviewProduct(null); }}
                  className="admin-btn admin-btn-primary w-full justify-center mt-4"
                >
                  <Pencil size={14} /> Edit Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        danger
      />
    </div>
  );
}
