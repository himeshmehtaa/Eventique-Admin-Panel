import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Save, X, GripVertical } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DragDropList } from '../components/DragDropList';
import type { FAQ } from '../types';

function FAQModal({ faq, onClose }: { faq?: FAQ | null; onClose: () => void }) {
  const { addFAQ, updateFAQ } = useAdmin();
  const isEdit = !!faq;
  const [question, setQuestion] = useState(faq?.question || '');
  const [answer, setAnswer] = useState(faq?.answer || '');

  const handleSave = () => {
    if (!question.trim() || !answer.trim()) return;
    if (isEdit && faq) updateFAQ(faq.id, { question, answer });
    else addFAQ({ id: `faq-${Date.now()}`, question, answer });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg admin-scale-in">
        <div className="border-b border-[#e5e5e5] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1a1410]">{isEdit ? 'Edit FAQ' : 'Add FAQ'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="admin-label">Question *</label>
            <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. How long does it take?" className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Answer *</label>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Detailed answer..." rows={5} className="admin-textarea" />
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

export default function FAQsManager() {
  const { state, deleteFAQ, reorderFAQs } = useAdmin();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<FAQ | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => { if (deleteId) { deleteFAQ(deleteId); setDeleteId(null); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{state.faqs.length} FAQs</p>
        <button onClick={() => { setEditItem(null); setShowForm(true); }} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {state.faqs.map((faq, idx) => (
          <div key={faq.id} className="admin-card !p-0 overflow-hidden">
            <div
              className="flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-[#faf8f5] transition-colors"
              onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
            >
              <span className="w-7 h-7 rounded-full bg-[#8B4949]/10 text-[#8B4949] flex items-center justify-center text-xs font-bold flex-shrink-0">
                {idx + 1}
              </span>
              <p className="flex-1 font-medium text-[#1a1410] text-sm">{faq.question}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setEditItem(faq); setShowForm(true); }}
                  className="admin-btn admin-btn-ghost admin-btn-icon"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteId(faq.id); }}
                  className="admin-btn admin-btn-ghost admin-btn-icon text-red-400 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={13} />
                </button>
                {expanded === faq.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>
            </div>
            {expanded === faq.id && (
              <div className="px-4 pb-4 pl-14">
                <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
        {state.faqs.length === 0 && (
          <div className="admin-empty"><p>No FAQs yet. Add your first one!</p></div>
        )}
      </div>

      {/* Drag reorder */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="font-semibold text-[#1a1410]">Drag to Reorder FAQs</h3>
        </div>
        <DragDropList
          items={state.faqs}
          onReorder={reorderFAQs}
          type="FAQ"
          renderItem={(f, idx) => (
            <div className="flex items-center gap-3 py-2 px-3 bg-[#faf8f5] rounded-lg border border-[#e5e5e5]">
              <span className="text-xs font-bold text-[#8B4949] w-5 flex-shrink-0">#{idx + 1}</span>
              <p className="text-sm text-[#1a1410] truncate flex-1">{f.question}</p>
            </div>
          )}
        />
      </div>

      {showForm && <FAQModal faq={editItem} onClose={() => { setShowForm(false); setEditItem(null); }} />}
      <ConfirmDialog open={!!deleteId} title="Delete FAQ" message="Delete this FAQ permanently?" confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} danger />
    </div>
  );
}
