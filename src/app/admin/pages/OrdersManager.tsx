import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import {
  Upload, Package, Truck, FileText, Download, X, CheckCircle,
  Search, FileVideo, FileBadge, Globe, Printer, Gift,
  AlertCircle, RefreshCw, ExternalLink, Clock, Eye,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { TypeBadge } from '../components/TypeBadge';
import { StatusBadge } from '../components/StatusBadge';
import type { Order, OrderStatus, OrderProductType } from '../types';

// ── Constants ─────────────────────────────────────────────────

const DIGITAL_TYPES: OrderProductType[] = ['Video Invites', 'PDF Invites', 'Event Websites'];
const PHYSICAL_TYPES: OrderProductType[] = ['Printed Invites', 'Stationery', 'Gifts'];
const ORDER_STATUSES: OrderStatus[] = ['Processing', 'Completed', 'Shipped', 'Cancelled', 'Refunded'];

const STATUS_TABS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Processing', label: 'Processing' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'Refunded', label: 'Refunded' },
];

const PRODUCT_ICON: Record<OrderProductType, React.ReactNode> = {
  'Video Invites':   <FileVideo size={14} />,
  'PDF Invites':     <FileText size={14} />,
  'Event Websites':  <Globe size={14} />,
  'Printed Invites': <Printer size={14} />,
  'Stationery':      <FileBadge size={14} />,
  'Gifts':           <Gift size={14} />,
};

function formatINR(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

const isWithinTimeRange = (createdAtStr: string, range: 'all' | 'today' | 'weekly' | 'monthly' | 'yearly') => {
  if (range === 'all') return true;

  const parts = createdAtStr.split('-');
  if (parts.length !== 3) return true;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const orderDate = new Date(year, month, day);
  orderDate.setHours(0, 0, 0, 0);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = todayStart.getTime() - orderDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (range === 'today') {
    return orderDate.getFullYear() === todayStart.getFullYear() &&
           orderDate.getMonth() === todayStart.getMonth() &&
           orderDate.getDate() === todayStart.getDate();
  }
  if (range === 'weekly') {
    return diffDays <= 7;
  }
  if (range === 'monthly') {
    return diffDays <= 30;
  }
  if (range === 'yearly') {
    return diffDays <= 365;
  }
  return true;
};

const formatTimeAgo = (isoString?: string) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

// ── Upload Modal ───────────────────────────────────────────────

interface UploadModalProps {
  order: Order;
  onClose: () => void;
  onSave: (orderId: string, fileName: string, fileUrl: string, status: OrderStatus) => void;
}

function UploadModal({ order, onClose, onSave }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const ALLOWED = ['.pdf', '.mp4', '.zip', '.mov', '.mp3'];

  const validateFile = (file: File): boolean => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED.includes(ext)) {
      setError('Only PDF, MP4, MOV, MP3, ZIP files allowed');
      return false;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be under 100 MB');
      return false;
    }
    setError('');
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) setSelectedFile(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleSave = () => {
    if (!selectedFile) { setError('Please select a file to upload'); return; }
    const objectUrl = URL.createObjectURL(selectedFile);
    onSave(order.id, selectedFile.name, objectUrl, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg admin-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0]">
          <div>
            <h2 className="text-base font-bold text-[#1a1410]">
              {order.uploadedFileName ? 'Re-upload File' : 'Upload File'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{order.id} · {order.customerName}</p>
          </div>
          <button onClick={onClose} className="admin-btn admin-btn-ghost admin-btn-icon">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Order info */}
          <div className="flex items-center gap-3 p-3 bg-[#faf8f5] rounded-xl border border-[#e5e5e5]">
            <div className="w-9 h-9 rounded-lg bg-[#8B4949]/10 flex items-center justify-center text-[#8B4949]">
              {PRODUCT_ICON[order.productType]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1a1410] truncate">{order.productName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <TypeBadge type={order.productType} size="sm" />
              </div>
            </div>
          </div>

          {/* Existing file */}
          {order.uploadedFileName && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100">
              <CheckCircle size={15} className="text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-green-700">Current file</p>
                <p className="text-xs text-green-600 truncate">{order.uploadedFileName}</p>
              </div>
            </div>
          )}

          {/* Drop zone */}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`upload-zone ${isDragging ? 'active' : ''} ${selectedFile ? 'has-file' : ''}`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.mp4,.zip,.mov,.mp3"
              className="hidden"
              onChange={handleChange}
            />
            <div className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isDragging ? 'bg-[#8B4949]/10' : selectedFile ? 'bg-green-50' : 'bg-[#f5f0e8]'
              }`}>
                {selectedFile
                  ? <CheckCircle size={22} className="text-green-600" />
                  : <Upload size={22} className={isDragging ? 'text-[#8B4949]' : 'text-gray-400'} />
                }
              </div>
              {selectedFile ? (
                <div className="text-center">
                  <p className="text-sm font-semibold text-green-700">{selectedFile.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-[#4a4a4a]">
                    {isDragging ? 'Drop to upload' : 'Drag & drop or click'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">PDF, MP4, ZIP, MOV, MP3 — max 100 MB</p>
                </div>
              )}
            </div>
          </div>

          {selectedFile && (
            <button
              onClick={() => { setSelectedFile(null); if (fileRef.current) fileRef.current.value = ''; }}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <X size={11} /> Remove file
            </button>
          )}

          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1.5">
              <AlertCircle size={13} /> {error}
            </p>
          )}

          {/* Status select */}
          <div>
            <label className="admin-label">Order Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="admin-select"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#f0f0f0] bg-[#faf8f5]">
          <button onClick={onClose} className="admin-btn admin-btn-ghost border border-[#e5e5e5]">Cancel</button>
          <button onClick={handleSave} className="admin-btn admin-btn-primary">
            <Upload size={15} /> Save & Upload
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Shipping Modal ─────────────────────────────────────────────

interface ShippingModalProps {
  order: Order;
  onClose: () => void;
  onSave: (orderId: string, patch: Partial<Order>) => void;
}

function ShippingModal({ order, onClose, onSave }: ShippingModalProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [courier, setCourier] = useState(order.courierName || '');
  const [tracking, setTracking] = useState(order.trackingId || '');
  const [shippingStatus, setShippingStatus] = useState(order.shippingStatus || '');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSave = () => {
    onSave(order.id, {
      status,
      courierName: courier,
      trackingId: tracking,
      shippingStatus,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md admin-scale-in overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0]">
          <div>
            <h2 className="text-base font-bold text-[#1a1410]">Update Shipping</h2>
            <p className="text-xs text-gray-400 mt-0.5">{order.id} · {order.customerName}</p>
          </div>
          <button onClick={onClose} className="admin-btn admin-btn-ghost admin-btn-icon">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Product info */}
          <div className="flex items-center gap-3 p-3 bg-[#faf8f5] rounded-xl border border-[#e5e5e5]">
            <div className="w-9 h-9 rounded-lg bg-[#8B4949]/10 flex items-center justify-center text-[#8B4949]">
              {PRODUCT_ICON[order.productType]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1a1410] truncate">{order.productName}</p>
              <TypeBadge type={order.productType} size="sm" />
            </div>
            <span className="text-sm font-bold text-[#8B4949] flex-shrink-0">{formatINR(order.amount)}</span>
          </div>

          <div>
            <label className="admin-label">Order Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className="admin-select">
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="admin-label">Shipping Status</label>
            <select
              value={shippingStatus}
              onChange={(e) => setShippingStatus(e.target.value)}
              className="admin-select"
            >
              <option value="">— Select —</option>
              <option value="Packed">Packed</option>
              <option value="Dispatched">Dispatched</option>
              <option value="In Transit">In Transit</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          <div>
            <label className="admin-label">Courier Name</label>
            <input
              type="text"
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              placeholder="e.g. Delhivery, BlueDart"
              className="admin-input"
            />
          </div>

          <div>
            <label className="admin-label">Tracking ID</label>
            <input
              type="text"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. DL89034521"
              className="admin-input"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#f0f0f0] bg-[#faf8f5]">
          <button onClick={onClose} className="admin-btn admin-btn-ghost border border-[#e5e5e5]">Cancel</button>
          <button onClick={handleSave} className="admin-btn admin-btn-primary">
            <Truck size={15} /> Save Shipping
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Customer Download Preview Modal ───────────────────────────

interface DownloadPreviewModalProps {
  order: Order;
  fileExpiry: number;
  onClose: () => void;
}

function DownloadPreviewModal({ order, fileExpiry, onClose }: DownloadPreviewModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleDownload = () => {
    if (order.uploadedFileUrl) {
      const link = document.createElement('a');
      link.href = order.uploadedFileUrl;
      link.download = order.uploadedFileName || 'invitation';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const mockContent = `Eventique Digital Invitation\n----------------------------\nOrder ID: ${order.id}\nProduct: ${order.productName}\nCustomer: ${order.customerName}\n\nThis is a simulation download of your digital invitation files.`;
      const blob = new Blob([mockContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${order.id}-invitation-preview.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#faf8f5] rounded-2xl shadow-2xl w-full max-w-md admin-scale-in overflow-hidden border border-[#e5e5e5]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0] bg-white">
          <div>
            <h2 className="text-base font-bold text-[#1a1410]">Customer Portal Preview</h2>
            <p className="text-xs text-gray-400 mt-0.5">Live simulation of the customer experience</p>
          </div>
          <button onClick={onClose} className="admin-btn admin-btn-ghost admin-btn-icon">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Device Container simulating customer view */}
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5 shadow-sm space-y-5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-5" style={{ border: '12px solid #D4AF37' }} />
            
            {/* Simulated Brand Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-[#f0f0f0]">
              <div className="w-6 h-6 rounded-full bg-[#8B4949] flex items-center justify-center">
                <span className="text-[10px] text-white font-bold font-serif">E</span>
              </div>
              <span className="text-xs font-semibold text-[#8B4949] uppercase tracking-wider font-serif">Eventique Portal</span>
              <span className="ml-auto text-[9px] text-[#D4AF37] px-2 py-0.5 bg-[#FDFAF5] rounded-full border border-[#D4AF3730] font-medium">Customer View</span>
            </div>

            {/* Simulated Portal Content */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{order.id}</span>
                  <div className="flex items-center gap-1">
                    <TypeBadge type={order.productType} size="sm" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[#1a1410] mt-1 leading-snug">{order.productName}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Ordered by: {order.customerName}</p>
              </div>

              {/* Order status logic matching Profile.tsx */}
              {order.status === 'Completed' && (order.uploadedFileName || order.productType === 'Event Websites') ? (
                <div className="space-y-3">
                  {order.productType === 'Event Websites' ? (
                    <div className="p-4 rounded-xl bg-[#FDFAF5] border border-[#D4AF3730] text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mx-auto">
                        <Globe size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#1a1410]">Your Wedding Website is Live!</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Click below to open and preview your site.</p>
                      </div>
                      <a
                        href={order.uploadedFileUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn-primary w-full justify-center text-xs py-2 inline-flex items-center gap-1.5"
                      >
                        <ExternalLink size={13} /> Visit Live Website
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-[#f5f0e8] border border-[#e5d5c5] flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-[#8B4949] flex-shrink-0">
                          {PRODUCT_ICON[order.productType] || <FileText size={18} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#1a1410] truncate">{order.uploadedFileName}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Clock size={10} className="text-gray-400" />
                            <p className="text-[10px] text-gray-400">Available for {fileExpiry} days</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleDownload}
                        className="admin-btn admin-btn-primary w-full justify-center flex items-center gap-2 text-xs py-2.5 shadow-md shadow-[#8B4949]/10"
                      >
                        <Download size={14} /> Download File
                      </button>
                    </div>
                  )}
                </div>
              ) : order.status === 'Cancelled' ? (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-center space-y-2">
                  <AlertCircle size={20} className="text-red-500 mx-auto" />
                  <p className="text-xs font-semibold text-red-700">Order Cancelled</p>
                  <p className="text-[10px] text-red-500">This digital order was cancelled. Please contact support if this was an error.</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-center space-y-2">
                  <RefreshCw size={20} className="text-amber-500 animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-amber-700">Being Prepared</p>
                  <p className="text-[10px] text-amber-600">Our design team is crafting your assets. We will email you once they are uploaded and ready to download!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Close Button / Info Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#f0f0f0] bg-white">
          <p className="text-[10px] text-gray-400">Testing Mode · Interactive Buttons</p>
          <button onClick={onClose} className="admin-btn admin-btn-primary px-5 py-2">
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────

export default function OrdersManager() {
  const { state, updateOrder, uploadOrderFile } = useAdmin();
  const { orders, settings } = state;

  const [activeTab, setActiveTab] = useState<'digital' | 'physical'>('digital');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'weekly' | 'monthly' | 'yearly'>('all');
  const [recencyFilter, setRecencyFilter] = useState<'all' | 'recent'>('all');
  const [uploadOrder, setUploadOrder] = useState<Order | null>(null);
  const [shippingOrder, setShippingOrder] = useState<Order | null>(null);
  const [previewOrder, setPreviewOrder] = useState<Order | null>(null);

  // ── Derived counts ──────────────────────────────────────────
  let timeFilteredOrders = orders.filter((o) => isWithinTimeRange(o.createdAt, timeFilter));

  if (recencyFilter === 'recent') {
    timeFilteredOrders = timeFilteredOrders
      .filter((o) => !!o.updatedAt)
      .sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  const digitalOrders = timeFilteredOrders.filter((o) => DIGITAL_TYPES.includes(o.productType));
  const physicalOrders = timeFilteredOrders.filter((o) => PHYSICAL_TYPES.includes(o.productType));
  const pendingUpload = digitalOrders.filter((o) => !o.uploadedFileName && o.paymentStatus === 'Paid').length;
  const shippedCount = physicalOrders.filter((o) => o.status === 'Shipped' || o.shippingStatus === 'Delivered').length;

  // ── Filtered lists ──────────────────────────────────────────
  const filterOrders = (list: Order[]) =>
    list.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });

  const filteredDigital = filterOrders(digitalOrders);
  const filteredPhysical = filterOrders(physicalOrders);

  // ── Handlers ────────────────────────────────────────────────
  const handleUploadSave = (orderId: string, fileName: string, fileUrl: string, status: OrderStatus) => {
    uploadOrderFile(orderId, fileName, fileUrl);
    if (status !== 'Completed') updateOrder(orderId, { status });
  };

  const handleShippingSave = (orderId: string, patch: Partial<Order>) => {
    updateOrder(orderId, patch);
  };

  // ── Shared toolbar ──────────────────────────────────────────
  const Toolbar = () => (
    <div className="flex flex-wrap items-center gap-4 bg-white border border-[#e5e5e5] rounded-2xl px-5 py-4">
      {/* Search */}
      <div className="flex items-center gap-2 bg-[#faf8f5] border border-[#e5e5e5] rounded-xl px-3.5 py-2 min-w-[220px] focus-within:border-[#8B4949] transition-colors">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders…"
          className="bg-transparent border-none outline-none text-sm text-[#4a4a4a] placeholder-gray-400 w-full"
        />
        {search && (
          <button onClick={() => setSearch('')}>
            <X size={13} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Time Filter Select */}
      <div className="flex items-center gap-2 bg-[#faf8f5] border border-[#e5e5e5] rounded-xl px-3 py-1.5 focus-within:border-[#8B4949] transition-colors h-[38px]">
        <Clock size={13} className="text-gray-400 flex-shrink-0" />
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as any)}
          className="bg-transparent border-none outline-none text-xs font-semibold text-[#4a4a4a] cursor-pointer"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Recency Filter Select */}
      <div className="flex items-center gap-2 bg-[#faf8f5] border border-[#e5e5e5] rounded-xl px-3 py-1.5 focus-within:border-[#8B4949] transition-colors h-[38px]">
        <RefreshCw size={13} className="text-gray-400 flex-shrink-0" />
        <select
          value={recencyFilter}
          onChange={(e) => setRecencyFilter(e.target.value as any)}
          className="bg-transparent border-none outline-none text-xs font-semibold text-[#4a4a4a] cursor-pointer"
        >
          <option value="all">All Orders</option>
          <option value="recent">Recently Updated</option>
        </select>
      </div>

      {/* Status Filter Pill Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap flex-1">
        {STATUS_TABS
          .filter(({ value }) => activeTab !== 'digital' || value !== 'Shipped')
          .map(({ value, label }) => {
            const isActive = statusFilter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#8B4949] text-white shadow-md shadow-[#8B4949]/20'
                    : 'bg-[#f5f0e8] text-[#4a4a4a] hover:bg-[#ece5d8] hover:text-[#1a1410]'
                }`}
              >
                {label}
              </button>
            );
          })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* ── Summary Bar ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Orders', value: orders.length, icon: <Package size={16} />, color: '#8B4949' },
          { label: 'Digital', value: digitalOrders.length, icon: <FileText size={16} />, color: '#6366F1' },
          { label: 'Physical', value: physicalOrders.length, icon: <Truck size={16} />, color: '#4A7C59' },
          { label: 'Pending Upload', value: pendingUpload, icon: <Upload size={16} />, color: '#B7770D', highlight: pendingUpload > 0 },
          { label: 'Shipped', value: shippedCount, icon: <CheckCircle size={16} />, color: '#166534' },
        ].map((item) => (
          <div
            key={item.label}
            className="admin-card !p-4 flex items-center gap-3"
            style={item.highlight ? { borderColor: '#FFC107', background: '#FFFBEB' } : {}}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: item.color + '15', color: item.color }}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-[#1a1410]">{item.value}</p>
              <p className="text-xs text-gray-400 leading-tight">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pill Tab Switcher ────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 p-1 bg-[#f5f0e8] rounded-xl">
          <button
            onClick={() => { setActiveTab('digital'); setStatusFilter('all'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'digital'
                ? 'bg-[#8B4949] text-white shadow-sm'
                : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            <Upload size={15} />
            Upload Files
            {pendingUpload > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === 'digital' ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-700'
              }`}>
                {pendingUpload}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('physical'); setStatusFilter('all'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'physical'
                ? 'bg-[#8B4949] text-white shadow-sm'
                : 'text-gray-500 hover:text-[#8B4949]'
            }`}
          >
            <Truck size={15} />
            Shipped Orders
          </button>
        </div>
      </div>

      {/* ── Tab 1: Upload Files (Digital) ───────────────────── */}
      {activeTab === 'digital' && (
        <div className="space-y-5 admin-animate-in">
          <Toolbar />

          {/* Full-width Table Card */}
          <div className="admin-card !p-0 overflow-hidden w-full">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>File</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDigital.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-400">
                        No digital orders found
                      </td>
                    </tr>
                  )}
                  {filteredDigital.map((order) => (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-gray-50/50"
                    >
                      {/* Order ID */}
                      <td className="whitespace-nowrap">
                        <span className="font-bold text-[#8B4949] text-sm">{order.id}</span>
                        {order.updatedAt && (
                          <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-0.5 whitespace-nowrap" title={`Last updated: ${new Date(order.updatedAt).toLocaleString()}`}>
                            <Clock size={10} />
                            <span>Updated {formatTimeAgo(order.updatedAt)}</span>
                          </div>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="whitespace-nowrap">
                        <div className="whitespace-nowrap">
                          <p className="font-medium text-[#1a1410] text-sm">{order.customerName}</p>
                          <p className="text-[11px] text-gray-400">{order.customerEmail}</p>
                        </div>
                      </td>

                      {/* Product */}
                      <td>
                        <div className="whitespace-nowrap">
                          <p className="text-sm font-medium text-[#1a1410] truncate max-w-[200px]">{order.productName}</p>
                          <div className="mt-1">
                            <TypeBadge type={order.productType} size="sm" />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap"><StatusBadge status={order.status} /></td>

                      {/* Payment */}
                      <td className="whitespace-nowrap"><StatusBadge status={order.paymentStatus} /></td>

                      {/* Uploaded File */}
                      <td className="whitespace-nowrap">
                        {order.uploadedFileName ? (
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <div className="w-5 h-5 rounded bg-green-50 flex items-center justify-center flex-shrink-0">
                              <CheckCircle size={11} className="text-green-600" />
                            </div>
                            <span className="text-xs text-green-700 font-medium max-w-[120px] truncate whitespace-nowrap" title={order.uploadedFileName}>
                              {order.uploadedFileName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic whitespace-nowrap">Not uploaded</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="font-semibold text-[#8B4949] whitespace-nowrap">{formatINR(order.amount)}</td>

                      {/* Action */}
                      <td className="whitespace-nowrap">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          {order.uploadedFileName ? (
                            <button
                              onClick={() => setUploadOrder(order)}
                              className="admin-btn admin-btn-outline admin-btn-sm flex items-center gap-1.5 whitespace-nowrap"
                            >
                              <RefreshCw size={12} /> Re-upload
                            </button>
                          ) : (
                            <button
                              onClick={() => setUploadOrder(order)}
                              className="admin-btn admin-btn-primary admin-btn-sm flex items-center gap-1.5 whitespace-nowrap"
                            >
                              <Upload size={12} /> Upload File
                            </button>
                          )}
                          <button
                            onClick={() => setPreviewOrder(order)}
                            className="admin-btn admin-btn-outline admin-btn-sm flex items-center gap-1.5 text-gray-600 border-[#e5e5e5] hover:border-[#8B4949] hover:text-[#8B4949] whitespace-nowrap"
                            title="Preview customer view"
                          >
                            <Eye size={12} /> Preview
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Shipped Orders (Physical) ────────────────── */}
      {activeTab === 'physical' && (
        <div className="space-y-5 admin-animate-in">
          <Toolbar />

          <div className="admin-card !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Shipping Status</th>
                    <th>Courier / Tracking</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPhysical.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-400">
                        No physical orders found
                      </td>
                    </tr>
                  )}
                  {filteredPhysical.map((order) => (
                    <tr key={order.id}>
                      {/* Order ID */}
                      <td className="whitespace-nowrap">
                        <span className="font-bold text-[#8B4949] text-sm">{order.id}</span>
                        {order.updatedAt && (
                          <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-0.5 whitespace-nowrap" title={`Last updated: ${new Date(order.updatedAt).toLocaleString()}`}>
                            <Clock size={10} />
                            <span>Updated {formatTimeAgo(order.updatedAt)}</span>
                          </div>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="whitespace-nowrap">
                        <div className="whitespace-nowrap">
                          <p className="font-medium text-[#1a1410] text-sm">{order.customerName}</p>
                          <p className="text-[11px] text-gray-400">{order.customerEmail}</p>
                        </div>
                      </td>

                      {/* Product */}
                      <td>
                        <div className="whitespace-nowrap">
                          <p className="text-sm font-medium text-[#1a1410] max-w-[160px] truncate">{order.productName}</p>
                          <div className="mt-1">
                            <TypeBadge type={order.productType} size="sm" />
                          </div>
                        </div>
                      </td>

                      {/* Shipping Status */}
                      <td className="whitespace-nowrap">
                        {order.shippingStatus ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                            style={
                              order.shippingStatus === 'Delivered'
                                ? { background: '#F0FDF4', color: '#166534' }
                                : order.shippingStatus === 'In Transit' || order.shippingStatus === 'Out for Delivery'
                                ? { background: '#EEF2FF', color: '#3730A3' }
                                : { background: '#FFF5E0', color: '#B7770D' }
                            }
                          >
                            <Truck size={10} />
                            {order.shippingStatus}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic whitespace-nowrap">Not Shipped</span>
                        )}
                      </td>

                      {/* Courier / Tracking */}
                      <td className="whitespace-nowrap">
                        {order.courierName || order.trackingId ? (
                          <div className="whitespace-nowrap">
                            {order.courierName && (
                              <p className="text-sm font-medium text-[#1a1410] whitespace-nowrap">{order.courierName}</p>
                            )}
                            {order.trackingId && (
                              <p className="text-[11px] text-gray-400 font-mono whitespace-nowrap">{order.trackingId}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300 whitespace-nowrap">—</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="font-semibold text-[#8B4949] whitespace-nowrap">{formatINR(order.amount)}</td>

                      {/* Action */}
                      <td className="whitespace-nowrap">
                        <button
                          onClick={() => setShippingOrder(order)}
                          className="admin-btn admin-btn-outline admin-btn-sm flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Truck size={12} /> Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Upload Modal ───────────────────────────────────── */}
      {uploadOrder && (
        <UploadModal
          order={uploadOrder}
          onClose={() => setUploadOrder(null)}
          onSave={handleUploadSave}
        />
      )}

      {/* ── Shipping Modal ─────────────────────────────────── */}
      {shippingOrder && (
        <ShippingModal
          order={shippingOrder}
          onClose={() => setShippingOrder(null)}
          onSave={handleShippingSave}
        />
      )}

      {/* ── Customer Download Preview Modal ───────────────── */}
      {previewOrder && (
        <DownloadPreviewModal
          order={previewOrder}
          fileExpiry={settings.downloads.fileExpiry}
          onClose={() => setPreviewOrder(null)}
        />
      )}
    </div>
  );
}
