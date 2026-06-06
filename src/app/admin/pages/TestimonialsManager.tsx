import { useState } from 'react';
import { Plus, Pencil, Trash2, Star as StarIcon, X, Save, CheckCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DragDropList } from '../components/DragDropList';
import type { Testimonial } from '../../data/products';

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-125"
        >
          <StarIcon
            size={24}
            className={`transition-colors ${star <= (hover || value) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );
}

function TestimonialModal({ testimonial, onClose }: { testimonial?: Testimonial | null; onClose: () => void }) {
  const { addTestimonial, updateTestimonial } = useAdmin();
  const isEdit = !!testimonial;
  const [form, setForm] = useState({
    name: testimonial?.name || '',
    event: testimonial?.event || '',
    rating: testimonial?.rating || 5,
    comment: testimonial?.comment || '',
    image: testimonial?.image || '',
    date: testimonial?.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    videoUrl: testimonial?.videoUrl || '',
  });
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim() || !form.comment.trim()) return;
    if (isEdit && testimonial) {
      updateTestimonial(testimonial.id, form);
    } else {
      addTestimonial({ ...form, id: `t-${Date.now()}` });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg admin-scale-in overflow-y-auto max-h-[90vh]">
        <div className="sticky top-0 bg-white border-b border-[#e5e5e5] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1a1410]">{isEdit ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Client Name *</label>
              <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Priya & Rahul" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Event Type</label>
              <input type="text" value={form.event} onChange={(e) => set('event', e.target.value)} placeholder="Wedding" className="admin-input" />
            </div>
          </div>
          <div>
            <label className="admin-label">Rating</label>
            <StarRating value={form.rating} onChange={(v) => set('rating', v)} />
          </div>
          <div>
            <label className="admin-label">Review *</label>
            <textarea value={form.comment} onChange={(e) => set('comment', e.target.value)} placeholder="Share your experience..." rows={4} className="admin-textarea" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Date</label>
              <input type="text" value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="March 2026" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Image URL (optional)</label>
              <input type="url" value={form.image || ''} onChange={(e) => set('image', e.target.value)} placeholder="https://..." className="admin-input" />
            </div>
          </div>
          <div>
            <label className="admin-label">Video URL (optional, e.g. YouTube Shorts, Vimeo, or direct MP4 link)</label>
            <input type="url" value={form.videoUrl || ''} onChange={(e) => set('videoUrl', e.target.value)} placeholder="https://youtube.com/shorts/..." className="admin-input" />
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

export default function TestimonialsManager() {
  const { state, deleteTestimonial, reorderTestimonials } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => { if (deleteId) { deleteTestimonial(deleteId); setDeleteId(null); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{state.testimonials.length} testimonials</p>
        <button onClick={() => { setEditItem(null); setShowForm(true); }} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.testimonials.map((t) => (
          <div key={t.id} className="admin-card group">
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map((s) => (
                <StarIcon key={s} size={14} className={s <= t.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-200 fill-gray-200'} />
              ))}
            </div>
            <p className="text-sm text-gray-600 italic mb-3 line-clamp-3">"{t.comment}"</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#1a1410] text-sm">{t.name}</p>
                <p className="text-xs text-gray-400">{t.event} · {t.date}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditItem(t); setShowForm(true); }} className="admin-btn admin-btn-ghost admin-btn-icon"><Pencil size={13} /></button>
                <button onClick={() => setDeleteId(t.id)} className="admin-btn admin-btn-ghost admin-btn-icon text-red-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reorder */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="font-semibold text-[#1a1410]">Drag to Reorder</h3>
          <p className="text-xs text-gray-400">Controls display order on website</p>
        </div>
        <DragDropList
          items={state.testimonials}
          onReorder={reorderTestimonials}
          type="TESTIMONIAL"
          renderItem={(t) => (
            <div className="flex items-center gap-3 py-2 px-3 bg-[#faf8f5] rounded-lg border border-[#e5e5e5]">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => <StarIcon key={s} size={10} className={s <= t.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-200 fill-gray-200'} />)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1a1410] truncate">{t.name}</p>
                <p className="text-xs text-gray-400 truncate">{t.event} · {t.date}</p>
              </div>
              <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
            </div>
          )}
        />
      </div>

      {showForm && <TestimonialModal testimonial={editItem} onClose={() => { setShowForm(false); setEditItem(null); }} />}
      <ConfirmDialog open={!!deleteId} title="Delete Testimonial" message="Delete this testimonial permanently?" confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} danger />
    </div>
  );
}
