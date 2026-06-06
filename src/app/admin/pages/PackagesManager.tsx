import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Check } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DragDropList } from '../components/DragDropList';
import type { Package } from '../../data/products';

function PackageModal({ pkg, onClose }: { pkg?: Package | null; onClose: () => void }) {
  const { addPackage, updatePackage } = useAdmin();
  const isEdit = !!pkg;
  const [form, setForm] = useState({
    name: pkg?.name || '',
    description: pkg?.description || '',
    price: pkg?.price || 0,
    savings: pkg?.savings || 0,
    includes: pkg?.includes || [],
    popular: pkg?.popular || false,
  });
  const [newItem, setNewItem] = useState('');
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const addItem = () => {
    if (newItem.trim()) { set('includes', [...form.includes, newItem.trim()]); setNewItem(''); }
  };
  const removeItem = (i: number) => set('includes', form.includes.filter((_, idx) => idx !== i));

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (isEdit && pkg) updatePackage(pkg.id, form);
    else addPackage({ ...form, id: `pkg-${Date.now()}` });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto admin-scrollbar admin-scale-in">
        <div className="sticky top-0 bg-white border-b border-[#e5e5e5] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-[#1a1410]">{isEdit ? 'Edit Package' : 'Add Package'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="admin-label">Package Name *</label>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Premium Kit" className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} className="admin-textarea" placeholder="Brief description..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Price (₹) *</label>
              <input type="number" value={form.price} onChange={(e) => set('price', Number(e.target.value))} min={0} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Savings (₹)</label>
              <input type="number" value={form.savings} onChange={(e) => set('savings', Number(e.target.value))} min={0} className="admin-input" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set('popular', !form.popular)}
              className={`admin-toggle ${form.popular ? 'active' : ''}`}
            />
            <label className="text-sm font-medium text-[#4a4a4a]">Mark as Popular</label>
          </div>
          <div>
            <label className="admin-label">Includes</label>
            <div className="space-y-2 mb-2">
              {form.includes.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm bg-[#faf8f5] px-3 py-2 rounded-lg border border-[#e5e5e5]">
                  <Check size={13} className="text-green-500 flex-shrink-0" />
                  <span className="flex-1">{item}</span>
                  <button onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={13} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
                placeholder="Add an included item..."
                className="admin-input"
              />
              <button onClick={addItem} className="admin-btn admin-btn-primary admin-btn-sm">Add</button>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-[#e5e5e5] px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} className="admin-btn admin-btn-ghost border border-[#e5e5e5]">Cancel</button>
          <button onClick={handleSave} className="admin-btn admin-btn-primary"><Save size={15} /> {isEdit ? 'Save' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}

export default function PackagesManager() {
  const { state, deletePackage, reorderPackages } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Package | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => { if (deleteId) { deletePackage(deleteId); setDeleteId(null); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{state.packages.length} packages</p>
        <button onClick={() => { setEditItem(null); setShowForm(true); }} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Package
        </button>
      </div>

      {/* Package Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {state.packages.map((pkg) => (
          <div key={pkg.id} className={`admin-card relative ${pkg.popular ? 'border-[#D4AF37] border-2' : ''}`}>
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: '#D4AF37' }}>
                ⭐ Most Popular
              </div>
            )}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-[#1a1410] text-lg">{pkg.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{pkg.description}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditItem(pkg); setShowForm(true); }} className="admin-btn admin-btn-ghost admin-btn-icon"><Pencil size={13} /></button>
                <button onClick={() => setDeleteId(pkg.id)} className="admin-btn admin-btn-ghost admin-btn-icon text-red-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={13} /></button>
              </div>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-[#8B4949]">₹{pkg.price.toLocaleString('en-IN')}</span>
              {pkg.savings > 0 && (
                <span className="ml-2 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                  Save ₹{pkg.savings.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <ul className="space-y-1.5">
              {pkg.includes.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={13} className="text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Reorder */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="font-semibold text-[#1a1410]">Drag to Reorder Packages</h3>
        </div>
        <DragDropList
          items={state.packages}
          onReorder={reorderPackages}
          type="PACKAGE"
          renderItem={(pkg) => (
            <div className="flex items-center gap-3 py-2 px-3 bg-[#faf8f5] rounded-lg border border-[#e5e5e5]">
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1a1410]">{pkg.name}</p>
                <p className="text-xs text-gray-400">{pkg.includes.length} items included</p>
              </div>
              <span className="text-sm font-bold text-[#8B4949]">₹{pkg.price.toLocaleString('en-IN')}</span>
              {pkg.popular && <span className="text-xs bg-[#D4AF37]/20 text-[#b8960e] px-2 py-0.5 rounded-full">Popular</span>}
            </div>
          )}
        />
      </div>

      {showForm && <PackageModal pkg={editItem} onClose={() => { setShowForm(false); setEditItem(null); }} />}
      <ConfirmDialog open={!!deleteId} title="Delete Package" message="Delete this package permanently?" confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} danger />
    </div>
  );
}
