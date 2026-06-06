import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Video, Printer, Globe, FileText, Gift, Zap } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DragDropList } from '../components/DragDropList';
import type { Service } from '../types';

const ICON_OPTIONS = ['Video', 'Printer', 'Globe', 'FileText', 'Gift', 'Zap', 'Star', 'Image', 'ShoppingBag'];
const IconMap: Record<string, React.FC<{ size?: number }>> = {
  Video, Printer, Globe, FileText, Gift, Zap,
};

function ServiceIcon({ name, size = 20 }: { name: string; size?: number }) {
  const Icon = IconMap[name];
  return Icon ? <Icon size={size} /> : <Zap size={size} />;
}

function ServiceModal({ service, onClose }: { service?: Service | null; onClose: () => void }) {
  const { addService, updateService } = useAdmin();
  const isEdit = !!service;
  const [form, setForm] = useState({
    title: service?.title || '',
    description: service?.description || '',
    iconName: service?.iconName || 'Zap',
    link: service?.link || '/',
  });
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (isEdit && service) updateService(service.id, form);
    else addService({ ...form, id: `svc-${Date.now()}` });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md admin-scale-in">
        <div className="border-b border-[#e5e5e5] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1a1410]">{isEdit ? 'Edit Service' : 'Add Service'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="admin-label">Service Title *</label>
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Digital Invites" className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className="admin-textarea" placeholder="Brief description..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Icon</label>
              <select value={form.iconName} onChange={(e) => set('iconName', e.target.value)} className="admin-select">
                {ICON_OPTIONS.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
              <div className="mt-2 w-10 h-10 rounded-full bg-[#8B4949]/10 flex items-center justify-center text-[#8B4949]">
                <ServiceIcon name={form.iconName} size={18} />
              </div>
            </div>
            <div>
              <label className="admin-label">Link URL</label>
              <input type="text" value={form.link} onChange={(e) => set('link', e.target.value)} placeholder="/explore" className="admin-input" />
            </div>
          </div>
        </div>
        <div className="border-t border-[#e5e5e5] px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} className="admin-btn admin-btn-ghost border border-[#e5e5e5]">Cancel</button>
          <button onClick={handleSave} className="admin-btn admin-btn-primary"><Save size={15} /> {isEdit ? 'Save' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}

export default function ServicesManager() {
  const { state, deleteService, reorderServices } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => { if (deleteId) { deleteService(deleteId); setDeleteId(null); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{state.services.length} services</p>
        <button onClick={() => { setEditItem(null); setShowForm(true); }} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {state.services.map((svc) => (
          <div key={svc.id} className="admin-card group text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-[#8B4949]/10 rounded-full flex items-center justify-center text-[#8B4949]">
              <ServiceIcon name={svc.iconName} size={20} />
            </div>
            <h3 className="font-semibold text-[#1a1410] text-sm mb-1">{svc.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{svc.description}</p>
            <p className="text-xs text-[#8B4949] mt-2">{svc.link}</p>
            <div className="flex gap-2 justify-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditItem(svc); setShowForm(true); }} className="admin-btn admin-btn-ghost admin-btn-icon admin-btn-sm"><Pencil size={13} /></button>
              <button onClick={() => setDeleteId(svc.id)} className="admin-btn admin-btn-ghost admin-btn-icon admin-btn-sm text-red-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Reorder */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="font-semibold text-[#1a1410]">Drag to Reorder Services</h3>
        </div>
        <DragDropList
          items={state.services}
          onReorder={reorderServices}
          type="SERVICE"
          renderItem={(s) => (
            <div className="flex items-center gap-3 py-2 px-3 bg-[#faf8f5] rounded-lg border border-[#e5e5e5]">
              <div className="w-8 h-8 rounded-full bg-[#8B4949]/10 flex items-center justify-center text-[#8B4949] flex-shrink-0">
                <ServiceIcon name={s.iconName} size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1a1410]">{s.title}</p>
                <p className="text-xs text-gray-400 truncate">{s.link}</p>
              </div>
            </div>
          )}
        />
      </div>

      {showForm && <ServiceModal service={editItem} onClose={() => { setShowForm(false); setEditItem(null); }} />}
      <ConfirmDialog open={!!deleteId} title="Delete Service" message="Delete this service?" confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} danger />
    </div>
  );
}
