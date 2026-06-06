import { useState, useCallback, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, X, Save, Copy, Check,
  Play, Pause, Tag, BarChart2, Clock, Zap, Award,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Promotion, PromotionStatus } from '../types';

// ── Helpers ──────────────────────────────────────────────────
const CATEGORIES = ['All', 'Video Invites', 'PDF Invites', 'Event Websites', 'Printed Invites', 'Stationery', 'Gifts'];

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function isExpired(dateStr: string) {
  return new Date(dateStr) < new Date(new Date().toDateString());
}

function formatDiscount(p: Promotion) {
  return p.discountType === 'percent' ? `${p.discountValue}%` : `₹${p.discountValue.toLocaleString('en-IN')} flat`;
}

function formatMinOrder(v: number) {
  return v > 0 ? `₹${v.toLocaleString('en-IN')}` : 'No minimum';
}

// ── Copy Code Cell ───────────────────────────────────────────
function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="font-mono text-xs px-2 py-1 rounded-md border border-[#e5e5e5] bg-[#faf8f5] text-[#4a4a4a] tracking-wide select-all"
      >
        {code}
      </span>
      <button
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy code'}
        className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#f5f0e8] text-gray-400 hover:text-[#8B4949] transition-colors"
      >
        {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
      </button>
    </span>
  );
}

// ── Summary Cards ────────────────────────────────────────────
function SummaryCards({ promotions }: { promotions: Promotion[] }) {
  const active = promotions.filter(p => p.status === 'Active').length;
  const paused = promotions.filter(p => p.status === 'Paused').length;
  const expired = promotions.filter(p => p.status === 'Expired').length;
  const totalUses = promotions.reduce((s, p) => s + p.usageCount, 0);

  const topCoupon = useMemo(() => {
    if (promotions.length === 0) return null;
    const max = promotions.reduce((m, p) => p.usageCount > m.usageCount ? p : m, promotions[0]);
    return max.usageCount > 0 ? max : null;
  }, [promotions]);

  const cards = [
    {
      label: 'Active',
      value: active,
      icon: <Zap size={18} />,
      color: '#166534',
      bg: '#F0FDF4',
      iconBg: 'rgba(22,101,52,0.1)',
    },
    {
      label: 'Total Uses',
      value: totalUses.toLocaleString('en-IN'),
      icon: <BarChart2 size={18} />,
      color: '#8B4949',
      bg: '#fff',
      iconBg: 'rgba(139,73,73,0.08)',
    },
    {
      label: 'Paused / Expired',
      value: `${paused} / ${expired}`,
      icon: <Clock size={18} />,
      color: '#B7770D',
      bg: '#FFF5E0',
      iconBg: 'rgba(183,119,13,0.1)',
    },
    {
      label: 'Top Performer',
      value: topCoupon ? topCoupon.couponCode : 'None',
      subtext: topCoupon ? `${topCoupon.usageCount} uses (${topCoupon.campaignName})` : 'No uses yet',
      icon: <Award size={18} />,
      color: '#3B82F6',
      bg: '#EFF6FF',
      iconBg: 'rgba(59,130,246,0.1)',
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="admin-card flex items-center gap-4"
          style={{ background: c.bg }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: c.iconBg, color: c.color }}
          >
            {c.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-400 font-medium">{c.label}</p>
            <p className="text-2xl font-bold truncate" style={{ color: c.color }}>{c.value}</p>
            {'subtext' in c && c.subtext && (
              <p className="text-[10px] text-gray-500 mt-0.5 truncate" title={c.subtext}>{c.subtext}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────
interface ModalProps {
  promotion?: Promotion | null;
  onClose: () => void;
}

const BLANK: Omit<Promotion, 'id' | 'usageCount'> = {
  campaignName: '',
  couponCode: '',
  discountType: 'percent',
  discountValue: 10,
  validTill: '',
  applicableCategory: 'All',
  minOrderValue: 0,
  status: 'Active',
};

function PromotionModal({ promotion, onClose }: ModalProps) {
  const { addPromotion, updatePromotion } = useAdmin();
  const isEdit = !!promotion;

  const [form, setForm] = useState<Omit<Promotion, 'id' | 'usageCount'>>(
    promotion
      ? {
          campaignName: promotion.campaignName,
          couponCode: promotion.couponCode,
          discountType: promotion.discountType,
          discountValue: promotion.discountValue,
          validTill: promotion.validTill,
          applicableCategory: promotion.applicableCategory,
          minOrderValue: promotion.minOrderValue,
          status: promotion.status,
        }
      : { ...BLANK }
  );

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const valid = form.campaignName.trim() && form.couponCode.trim() && form.validTill;

  const handleSave = () => {
    if (!valid) return;
    if (isEdit && promotion) {
      updatePromotion(promotion.id, form);
    } else {
      addPromotion({ ...form, id: `promo-${Date.now()}`, usageCount: 0 });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg admin-scale-in overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e5e5e5] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f5f0e8] flex items-center justify-center">
              <Tag size={15} className="text-[#8B4949]" />
            </div>
            <h2 className="text-lg font-bold text-[#1a1410]">
              {isEdit ? 'Edit Promotion' : 'New Promotion'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="admin-label">Campaign Name *</label>
            <input
              type="text"
              value={form.campaignName}
              onChange={(e) => set('campaignName', e.target.value)}
              placeholder="Summer Sale 2026"
              className="admin-input"
            />
          </div>

          <div>
            <label className="admin-label">Coupon Code *</label>
            <input
              type="text"
              value={form.couponCode}
              onChange={(e) => set('couponCode', e.target.value.toUpperCase())}
              placeholder="SUMMER25"
              className="admin-input font-mono tracking-widest"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Discount Type</label>
              <select
                value={form.discountType}
                onChange={(e) => set('discountType', e.target.value as 'percent' | 'flat')}
                className="admin-select"
              >
                <option value="percent">Percent (%)</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </div>
            <div>
              <label className="admin-label">
                {form.discountType === 'percent' ? 'Discount %' : 'Discount ₹'}
              </label>
              <input
                type="number"
                min={1}
                value={form.discountValue}
                onChange={(e) => set('discountValue', Number(e.target.value))}
                className="admin-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Valid Till *</label>
              <input
                type="date"
                value={form.validTill}
                onChange={(e) => set('validTill', e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Min Order (₹)</label>
              <input
                type="number"
                min={0}
                value={form.minOrderValue}
                onChange={(e) => set('minOrderValue', Number(e.target.value))}
                placeholder="0 = no minimum"
                className="admin-input"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Applicable Category</label>
            <select
              value={form.applicableCategory}
              onChange={(e) => set('applicableCategory', e.target.value)}
              className="admin-select"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="admin-label">Status</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value as PromotionStatus)}
              className="admin-select"
            >
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#e5e5e5] px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} className="admin-btn admin-btn-ghost border border-[#e5e5e5]">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!valid}
            className="admin-btn admin-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={15} /> {isEdit ? 'Save Changes' : 'Add Promotion'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function PromotionsManager() {
  const { state, updatePromotion, deletePromotion } = useAdmin();
  const { promotions } = state;

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Promotion | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => { setEditItem(null); setShowForm(true); };
  const openEdit = (p: Promotion) => { setEditItem(p); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditItem(null); };

  const handleToggle = useCallback((p: Promotion) => {
    if (p.status === 'Expired') return;
    updatePromotion(p.id, { status: p.status === 'Active' ? 'Paused' : 'Active' });
  }, [updatePromotion]);

  const handleDelete = () => {
    if (deleteId) { deletePromotion(deleteId); setDeleteId(null); }
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{promotions.length} promotions</p>
        <button onClick={openAdd} className="admin-btn admin-btn-primary">
          <Plus size={16} /> New Promotion
        </button>
      </div>

      {/* Summary */}
      <SummaryCards promotions={promotions} />

      {/* Table */}
      <div className="admin-card !p-0 overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full">
          <table className="admin-table w-full">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Code</th>
                <th>Discount</th>
                <th>Valid Till</th>
                <th>Min Order</th>
                <th>Uses</th>
                <th>Status</th>
                <th style={{ width: 110 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="admin-empty">
                      <Tag size={32} />
                      <p className="mt-2 font-medium text-gray-500">No promotions yet</p>
                      <p className="text-xs mt-1">Click "New Promotion" to create one.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                promotions.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <p className="font-semibold text-[#1a1410] text-sm">{p.campaignName}</p>
                      <p className="text-xs text-gray-400">{p.applicableCategory}</p>
                    </td>
                    <td>
                      <CopyCode code={p.couponCode} />
                    </td>
                    <td>
                      <span className="font-semibold text-[#8B4949]">{formatDiscount(p)}</span>
                    </td>
                    <td>
                      <span className={`text-sm font-medium ${isExpired(p.validTill) ? 'text-red-500' : 'text-[#4a4a4a]'}`}>
                        {formatDate(p.validTill)}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm">{formatMinOrder(p.minOrderValue)}</span>
                    </td>
                    <td>
                      <span className="font-semibold text-[#1a1410]">{p.usageCount}</span>
                    </td>
                    <td>
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        {/* Edit */}
                        <button
                          onClick={() => openEdit(p)}
                          title="Edit"
                          className="admin-btn admin-btn-ghost admin-btn-icon"
                        >
                          <Pencil size={13} />
                        </button>
                        {/* Toggle Active/Paused */}
                        <button
                          onClick={() => handleToggle(p)}
                          title={p.status === 'Active' ? 'Pause' : 'Activate'}
                          disabled={p.status === 'Expired'}
                          className={`admin-btn admin-btn-ghost admin-btn-icon disabled:opacity-30 disabled:cursor-not-allowed ${
                            p.status === 'Active'
                              ? 'text-amber-500 hover:bg-amber-50'
                              : 'text-green-500 hover:bg-green-50'
                          }`}
                        >
                          {p.status === 'Active' ? <Pause size={13} /> : <Play size={13} />}
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => setDeleteId(p.id)}
                          title="Delete"
                          className="admin-btn admin-btn-ghost admin-btn-icon text-red-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={13} />
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

      {/* Modal */}
      {showForm && (
        <PromotionModal promotion={editItem} onClose={closeForm} />
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Promotion"
        message="This will permanently delete the promotion and its coupon code."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        danger
      />
    </div>
  );
}
