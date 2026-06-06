import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Save, X, Monitor, Image as ImageIcon } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DragDropList } from '../components/DragDropList';
import { FileUploadZone } from '../components/FileUploadZone';
import type { HeroSlide } from '../types';

function SlideModal({ slide, onClose, sectionId }: { slide?: HeroSlide | null; onClose: () => void; sectionId?: string }) {
  const { addHeroSlide, updateHeroSlide, state } = useAdmin();
  const isEdit = !!slide;
  const [form, setForm] = useState<Omit<HeroSlide, 'id'>>({
    badge: slide?.badge || '🌺 Your Badge Text',
    title: slide?.title || 'Your Hero Title',
    highlight: slide?.highlight || 'Highlight Word',
    subtitle: slide?.subtitle || 'Subtitle text...',
    cta1: slide?.cta1 || { text: 'Primary CTA', link: '/explore' },
    cta2: slide?.cta2 || { text: 'Secondary CTA', link: '/packages' },
    tag: slide?.tag || null,
    accentBg: slide?.accentBg || 'from-[#faf8f5] via-white to-[#fff5f0]',
    sectionId: slide?.sectionId || sectionId || 'Hero',
    images: slide?.images || [],
  });
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const slideFileInputRef = useRef<HTMLInputElement>(null);
  const imagesInMedia = state.mediaFiles.filter(f => f.type === 'image');

  const handleSlideImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        urls.push(URL.createObjectURL(files[i]));
      }
      set('images', [...(form.images || []), ...urls]);
    }
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (isEdit && slide) updateHeroSlide(slide.id, form);
    else addHeroSlide({ ...form, id: `slide-${Date.now()}` });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto admin-scrollbar admin-scale-in">
        <div className="sticky top-0 bg-white border-b border-[#e5e5e5] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-[#1a1410]">{isEdit ? 'Edit Hero Slide' : 'Add Hero Slide'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="admin-label">Badge Text (with emoji)</label>
            <input type="text" value={form.badge} onChange={(e) => set('badge', e.target.value)} placeholder="🌺 Badge text" className="admin-input" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Title</label>
              <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Highlighted Word (in primary color)</label>
              <input type="text" value={form.highlight} onChange={(e) => set('highlight', e.target.value)} className="admin-input" />
            </div>
          </div>
          <div>
            <label className="admin-label">Subtitle</label>
            <textarea value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} rows={3} className="admin-textarea" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Primary CTA Text</label>
              <input type="text" value={form.cta1.text} onChange={(e) => set('cta1', { ...form.cta1, text: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Primary CTA Link</label>
              <input type="text" value={form.cta1.link} onChange={(e) => set('cta1', { ...form.cta1, link: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Secondary CTA Text</label>
              <input type="text" value={form.cta2.text} onChange={(e) => set('cta2', { ...form.cta2, text: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Secondary CTA Link</label>
              <input type="text" value={form.cta2.link} onChange={(e) => set('cta2', { ...form.cta2, link: e.target.value })} className="admin-input" />
            </div>
          </div>
          <div>
            <label className="admin-label">Top Tag (optional, e.g. 🆕 New Launch)</label>
            <input
              type="text"
              value={form.tag || ''}
              onChange={(e) => set('tag', e.target.value || null)}
              placeholder="Leave empty for none"
              className="admin-input"
            />
          </div>

          {/* Slide Image Gallery */}
          <div className="bg-[#faf8f5] rounded-2xl p-5 border border-[#e5e5e5]/50 space-y-4">
            <div>
              <label className="admin-label !mb-1 text-sm font-semibold text-[#1a1410]">Slide Image Gallery (Multiple Images)</label>
              <p className="text-xs text-gray-400">Configure slide-specific photos. If specified, this slide carousel will cycle these photos.</p>
            </div>
            
            {/* Thumbnail grid */}
            {form.images && form.images.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square border border-[#e5e5e5] rounded-xl overflow-hidden bg-white shadow-sm">
                    <img src={img} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => set('images', form.images!.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                      title="Remove image"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No images configured for this slide yet.</p>
            )}
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => slideFileInputRef.current?.click()}
                className="admin-btn admin-btn-outline admin-btn-sm flex items-center gap-1.5 text-xs py-1.5 px-3 cursor-pointer"
              >
                <Plus size={12} /> Upload File
              </button>
              <input
                ref={slideFileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleSlideImageUpload}
              />
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="admin-btn admin-btn-outline admin-btn-sm flex items-center gap-1.5 text-xs py-1.5 px-3 cursor-pointer"
              >
                <ImageIcon size={12} /> Pick from Media
              </button>
            </div>
          </div>

          {/* Media Picker Modal inside SlideModal */}
          {showMediaPicker && (
            <>
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[300]" onClick={() => setShowMediaPicker(false)} />
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-3xl shadow-2xl z-[350] overflow-hidden border border-[#e5e5e5] admin-scale-in">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0]">
                  <div>
                    <h3 className="font-bold text-[#1a1410] text-sm">Select Slide Image</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Pick an image from the Media Library</p>
                  </div>
                  <button type="button" onClick={() => setShowMediaPicker(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400"><X size={14} /></button>
                </div>
                <div className="p-6 max-h-[300px] overflow-y-auto admin-scrollbar">
                  {imagesInMedia.length === 0 ? (
                    <p className="text-center py-6 text-xs text-gray-400">No images in Media Library</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-3">
                      {imagesInMedia.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => {
                            set('images', [...(form.images || []), f.url]);
                            setShowMediaPicker(false);
                          }}
                          className="border border-[#e5e5e5] rounded-xl overflow-hidden aspect-square hover:border-[#8B4949] transition-all relative group bg-gray-50 flex items-center justify-center cursor-pointer"
                        >
                          <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="sticky bottom-0 bg-white border-t border-[#e5e5e5] px-6 py-4 flex gap-3 justify-end z-10">
          <button onClick={onClose} className="admin-btn admin-btn-ghost border border-[#e5e5e5]">Cancel</button>
          <button onClick={handleSave} className="admin-btn admin-btn-primary"><Save size={15} /> {isEdit ? 'Save' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}

export default function HeroSlidesManager({ sectionId = 'Hero' }: { sectionId?: string }) {
  const { state, deleteHeroSlide, reorderHeroSlides } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<HeroSlide | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewIdx, setPreviewIdx] = useState(0);

  const handleDelete = () => { if (deleteId) { deleteHeroSlide(deleteId); setDeleteId(null); } };

  // Filter slides by sectionId
  const sectionSlides = state.heroSlides.filter(s => (s.sectionId || 'Hero') === sectionId);

  // Safe index constraint
  const activeIdx = Math.min(previewIdx, Math.max(0, sectionSlides.length - 1));
  const preview = sectionSlides[activeIdx];

  const handleReorder = (items: HeroSlide[]) => {
    reorderHeroSlides(items, sectionId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{sectionSlides.length} slides</p>
        <button onClick={() => { setEditItem(null); setShowForm(true); }} className="admin-btn admin-btn-primary cursor-pointer">
          <Plus size={16} /> Add Slide
        </button>
      </div>

      {/* Live Preview */}
      {preview && (
        <div className="admin-card overflow-hidden !p-0 border border-[#e5e5e5]">
          <div className="bg-white border-b border-[#e5e5e5] px-4 py-3 flex items-center gap-2">
            <Monitor size={14} className="text-gray-400" />
            <span className="text-gray-500 text-xs font-medium">Preview — Slide {activeIdx + 1} of {sectionSlides.length}</span>
          </div>
          <div className={`p-8 bg-gradient-to-br ${preview.accentBg}`}>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-4 py-2 bg-[#8B4949]/10 text-[#8B4949] rounded-full text-sm border border-[#8B4949]/20">
                {preview.badge}
              </span>
              {preview.tag && (
                <span className="px-3 py-1 bg-[#D4AF37] text-white rounded-full text-xs font-semibold">{preview.tag}</span>
              )}
            </div>
            <h2 className="text-3xl font-bold text-[#1a1410] mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              {preview.title} <em className="text-[#8B4949]">{preview.highlight}</em>
            </h2>
            <p className="text-gray-500 mb-5 max-w-lg text-sm">{preview.subtitle}</p>
            <div className="flex gap-3 flex-wrap">
              <span className="px-5 py-2.5 bg-[#8B4949] text-white rounded-full text-sm font-medium">{preview.cta1.text}</span>
              <span className="px-5 py-2.5 bg-white text-[#4a4a4a] border border-[#8B4949]/20 rounded-full text-sm">{preview.cta2.text}</span>
            </div>
          </div>
          <div className="flex gap-2 p-3 bg-gray-50 border-t border-[#e5e5e5]">
            {sectionSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setPreviewIdx(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${i === activeIdx ? 'bg-[#8B4949] w-8' : 'bg-gray-300 w-2 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Slide cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {sectionSlides.map((slide, idx) => (
          <div
            key={slide.id}
            onClick={() => setPreviewIdx(idx)}
            className={`admin-card cursor-pointer transition-all border border-[#e5e5e5] ${activeIdx === idx ? 'border-[#8B4949] ring-2 ring-[#8B4949]/20' : ''}`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Slide {idx + 1}</span>
              <div className="flex gap-1">
                <button onClick={(e) => { e.stopPropagation(); setEditItem(slide); setShowForm(true); }} className="admin-btn admin-btn-ghost admin-btn-icon cursor-pointer"><Pencil size={13} /></button>
                {sectionSlides.length > 1 && (
                  <button onClick={(e) => { e.stopPropagation(); setDeleteId(slide.id); }} className="admin-btn admin-btn-ghost admin-btn-icon text-red-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"><Trash2 size={13} /></button>
                )}
              </div>
            </div>
            <p className="font-bold text-[#1a1410] text-sm">{slide.title} <em className="text-[#8B4949]">{slide.highlight}</em></p>
            <p className="text-xs text-gray-400 mt-1 truncate">{slide.badge}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-[#8B4949]/10 text-[#8B4949] px-2 py-0.5 rounded-full">{slide.cta1.text}</span>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{slide.cta2.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Reorder */}
      {sectionSlides.length > 1 && (
        <div className="admin-card border border-[#e5e5e5]">
          <div className="admin-card-header mb-4">
            <h3 className="font-semibold text-[#1a1410] text-sm">Drag to Reorder Slides</h3>
          </div>
          <DragDropList
            items={sectionSlides}
            onReorder={handleReorder}
            type="HERO_SLIDE"
            renderItem={(s, idx) => (
              <div className="flex items-center gap-3 py-2 px-3 bg-[#faf8f5] rounded-lg border border-[#e5e5e5]">
                <span className="text-xs font-bold text-[#8B4949] w-6 flex-shrink-0">#{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1a1410] truncate">{s.title} <em className="text-[#8B4949]">{s.highlight}</em></p>
                  <p className="text-xs text-gray-400 truncate">{s.badge}</p>
                </div>
              </div>
            )}
          />
        </div>
      )}

      {showForm && <SlideModal slide={editItem} onClose={() => { setShowForm(false); setEditItem(null); }} sectionId={sectionId} />}
      <ConfirmDialog open={!!deleteId} title="Delete Slide" message="Delete this slide?" confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} danger />
    </div>
  );
}
