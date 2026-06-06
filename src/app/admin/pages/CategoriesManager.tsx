import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DragDropList } from '../components/DragDropList';
import { FileUploadZone } from '../components/FileUploadZone';
import type { Category } from '../types';

function CategoryModal({ category, onClose }: { category?: Category | null; onClose: () => void }) {
  const { addCategory, updateCategory } = useAdmin();
  const isEdit = !!category;
  const [form, setForm] = useState({
    name: category?.name || '',
    path: category?.path || '/category/',
    icon: category?.icon || '🎉',
    image: category?.image || '',
    description: category?.description || '',
  });
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (isEdit && category) updateCategory(category.id, form);
    else addCategory({ ...form, id: `cat-${Date.now()}` });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto admin-scale-in">
        <div className="sticky top-0 bg-white border-b border-[#e5e5e5] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-[#1a1410]">{isEdit ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="admin-label">Icon (emoji)</label>
              <input type="text" value={form.icon} onChange={(e) => set('icon', e.target.value)} placeholder="💐" className="admin-input text-center text-2xl" />
            </div>
            <div className="col-span-2">
              <label className="admin-label">Category Name *</label>
              <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Wedding" className="admin-input" />
            </div>
          </div>
          <div>
            <label className="admin-label">URL Path</label>
            <input type="text" value={form.path} onChange={(e) => set('path', e.target.value)} placeholder="/category/wedding" className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Description (optional)</label>
            <input type="text" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Brief description..." className="admin-input" />
          </div>
          <FileUploadZone label="Category Image" value={form.image} onChange={(url) => set('image', url)} hint="Recommended: 600×450px" />
        </div>
        <div className="sticky bottom-0 bg-white border-t border-[#e5e5e5] px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} className="admin-btn admin-btn-ghost border border-[#e5e5e5]">Cancel</button>
          <button onClick={handleSave} className="admin-btn admin-btn-primary"><Save size={15} /> {isEdit ? 'Save' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}

export default function CategoriesManager() {
  const { state, deleteCategory, reorderCategories } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => { if (deleteId) { deleteCategory(deleteId); setDeleteId(null); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{state.categories.length} categories</p>
        <button onClick={() => { setEditItem(null); setShowForm(true); }} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {state.categories.map((cat) => (
          <div key={cat.id} className="admin-card !p-0 overflow-hidden group">
            <div className="relative aspect-video overflow-hidden bg-[#f5f0e8]">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">{cat.icon}</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-2xl">{cat.icon}</span>
                <p className="text-white font-bold text-sm mt-0.5">{cat.name}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditItem(cat); setShowForm(true); }} className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
                  <Pencil size={12} className="text-[#8B4949]" />
                </button>
                <button onClick={() => setDeleteId(cat.id)} className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
                  <Trash2 size={12} className="text-red-500" />
                </button>
              </div>
            </div>
            <div className="px-3 py-2">
              <p className="text-xs text-gray-400 truncate">{cat.path}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Reorder */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="font-semibold text-[#1a1410]">Drag to Reorder Categories</h3>
        </div>
        <DragDropList
          items={state.categories}
          onReorder={reorderCategories}
          type="CATEGORY"
          renderItem={(c) => (
            <div className="flex items-center gap-3 py-2 px-3 bg-[#faf8f5] rounded-lg border border-[#e5e5e5]">
              <span className="text-xl flex-shrink-0">{c.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1a1410]">{c.name}</p>
                <p className="text-xs text-gray-400">{c.path}</p>
              </div>
            </div>
          )}
        />
      </div>

      {showForm && <CategoryModal category={editItem} onClose={() => { setShowForm(false); setEditItem(null); }} />}
      <ConfirmDialog open={!!deleteId} title="Delete Category" message="Delete this category?" confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} danger />
    </div>
  );
}
