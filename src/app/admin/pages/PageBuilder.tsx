import { useAdmin } from '../context/AdminContext';
import { DragDropList } from '../components/DragDropList';
import { Eye, EyeOff, GripVertical } from 'lucide-react';
import type { SectionConfig } from '../types';

const SECTION_ICONS: Record<string, string> = {
  'hero': '🎯',
  'product-showcase': '🛍️',
  'printed-invites': '📃',
  'categories': '📂',
  'product-carousel': '🎠',
  'services': '⚡',
  'how-it-works': '📋',
  'testimonials': '⭐',
  'cta': '📣',
};

const SECTION_DESC: Record<string, string> = {
  'hero': 'The main hero carousel with 3 rotating slides',
  'product-showcase': 'Three-column grid: Video Invites, Stationery, Event Websites',
  'printed-invites': 'Full-width section showcasing printed luxury invitations',
  'categories': 'Browse by Occasion — Wedding, Engagement, Birthday, etc.',
  'product-carousel': 'Infinite horizontal marquee of products',
  'services': 'Five service cards: Digital, Printed, Websites, Stationery, Gifts',
  'how-it-works': 'Four-step process: Browse → Customize → Pay → Share',
  'testimonials': 'Customer reviews grid with star ratings',
  'cta': 'Final call-to-action banner',
};

export default function PageBuilder() {
  const { state, updateSection, reorderSections } = useAdmin();

  const sorted = [...state.sections].sort((a, b) => a.order - b.order);

  const toggle = (id: string, enabled: boolean) => {
    updateSection(id, { enabled });
  };

  const handleReorder = (sections: SectionConfig[]) => {
    const updated = sections.map((s, i) => ({ ...s, order: i }));
    reorderSections(updated);
  };

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl">
        <span className="text-2xl">💡</span>
        <div>
          <p className="font-semibold text-[#1a1410] text-sm">Drag to reorder homepage sections</p>
          <p className="text-xs text-gray-500 mt-0.5">Toggle visibility with the eye icon. Changes control homepage layout when integrated with the main website.</p>
        </div>
      </div>

      {/* Section list */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="font-semibold text-[#1a1410]">Homepage Sections</h3>
          <p className="text-xs text-gray-400">{state.sections.filter(s => s.enabled).length} of {state.sections.length} sections enabled</p>
        </div>

        <DragDropList
          items={sorted}
          onReorder={handleReorder}
          type="SECTION"
          renderItem={(section, idx) => (
            <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              section.enabled
                ? 'bg-white border-[#e5e5e5] hover:border-[#8B4949]/30'
                : 'bg-gray-50 border-gray-200 opacity-60'
            }`}>
              {/* Order number */}
              <div className="w-7 h-7 rounded-full bg-[#8B4949]/10 flex items-center justify-center text-[#8B4949] text-xs font-bold flex-shrink-0">
                {idx + 1}
              </div>

              {/* Icon */}
              <span className="text-2xl flex-shrink-0">{SECTION_ICONS[section.id] || '📄'}</span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1a1410] text-sm">{section.name}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{SECTION_DESC[section.id] || ''}</p>
              </div>

              {/* Status badge */}
              <span className={`admin-badge text-xs flex-shrink-0 ${
                section.enabled ? 'admin-badge-success' : 'admin-badge-danger'
              }`}>
                {section.enabled ? 'Visible' : 'Hidden'}
              </span>

              {/* Toggle */}
              <button
                onClick={() => toggle(section.id, !section.enabled)}
                title={section.enabled ? 'Hide section' : 'Show section'}
                className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                  section.enabled
                    ? 'text-[#4A7C59] hover:bg-green-50'
                    : 'text-gray-300 hover:bg-gray-100 hover:text-gray-500'
                }`}
              >
                {section.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          )}
        />
      </div>

      {/* Preview Order */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="font-semibold text-[#1a1410]">Current Page Order</h3>
          <p className="text-xs text-gray-400">Enabled sections only</p>
        </div>
        <div className="space-y-1">
          {sorted
            .filter((s) => s.enabled)
            .map((section, i) => (
              <div key={section.id} className="flex items-center gap-3 text-sm py-1.5 border-b border-[#f0f0f0] last:border-0">
                <span className="text-[#D4AF37] font-bold text-xs w-5">{i + 1}.</span>
                <span className="text-lg">{SECTION_ICONS[section.id] || '📄'}</span>
                <span className="text-[#4a4a4a]">{section.name}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
