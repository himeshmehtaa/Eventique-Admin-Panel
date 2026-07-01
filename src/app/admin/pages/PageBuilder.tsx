import { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  Eye, EyeOff, ArrowUp, ArrowDown, Settings, Save, Sparkles,
  Star, ChevronLeft, ChevronRight, Check, X, Plus, Trash2, Edit3, Globe,
  Laptop, RefreshCw, Layers, LayoutGrid, CheckCircle, Info, Image as ImageIcon
} from 'lucide-react';
import type { SectionConfig, ContentBlock } from '../types';

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

const SECTION_LABELS: Record<string, string> = {
  'hero': 'Hero Slider Section',
  'product-showcase': 'Explore Designs Showcase',
  'printed-invites': 'Printed Luxury Invites',
  'categories': 'Browse by Occasion Grid',
  'product-carousel': 'Product Showcase Marquee',
  'services': 'Our Services Grid',
  'how-it-works': 'How It Works Steps',
  'testimonials': 'Customer Testimonials',
  'cta': 'Bottom Call-to-Action',
};

export default function PageBuilder() {
  const { state, updateSection, reorderSections, updateContentBlock } = useAdmin();

  // Active view: 'list' | 'edit'
  const [sidebarTab, setSidebarTab] = useState<'list' | 'edit'>('list');
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // Reorder list state
  const sortedSections = useMemo(() => {
    return [...state.sections].sort((a, b) => a.order - b.order);
  }, [state.sections]);

  // Draft changes local states
  const [sectionDrafts, setSectionDrafts] = useState<Record<string, Partial<ContentBlock>>>({});
  const [sectionOrderDraft, setSectionOrderDraft] = useState<SectionConfig[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Preview Slide Carousel Index (for Hero Mockup)
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);

  // Initialize drafts from global context on load
  useEffect(() => {
    const drafts: Record<string, Partial<ContentBlock>> = {};
    state.contentBlocks.forEach(cb => {
      // Map sectionName to sectionId
      let sid = '';
      if (cb.sectionName === 'Hero') sid = 'hero';
      else if (cb.sectionName === 'Explore Designs') sid = 'product-showcase';
      else if (cb.sectionName === 'Printed Luxury Invites') sid = 'printed-invites';
      else if (cb.sectionName === 'Browse by Occasion') sid = 'categories';
      else if (cb.sectionName === 'Our Services') sid = 'services';
      else if (cb.sectionName === 'Testimonials') sid = 'testimonials';
      else if (cb.sectionName === 'FAQ') sid = 'faq';
      else if (cb.sectionName === 'CTA') sid = 'cta';
      
      if (sid) {
        drafts[sid] = {
          title: cb.title,
          subtitle: cb.subtitle,
          body: cb.body,
          imageUrl: cb.imageUrl,
          ctaText: cb.ctaText,
          ctaLink: cb.ctaLink,
          badgeText: cb.badgeText,
          layoutStyle: cb.layoutStyle || 'Split-Image-Right',
          features: cb.features || [],
          images: cb.images || [],
        };
      }
    });
    setSectionDrafts(drafts);
    setSectionOrderDraft([...state.sections].sort((a, b) => a.order - b.order));
    setDirty(false);
  }, [state.contentBlocks, state.sections]);

  // Get active block helper (resolves draft first, then global state)
  const getBlockData = (sid: string): Partial<ContentBlock> => {
    const draft = sectionDrafts[sid] || {};
    const globalName = sid === 'hero' ? 'Hero' 
                     : sid === 'product-showcase' ? 'Explore Designs'
                     : sid === 'printed-invites' ? 'Printed Luxury Invites'
                     : sid === 'categories' ? 'Browse by Occasion'
                     : sid === 'services' ? 'Our Services'
                     : sid === 'testimonials' ? 'Testimonials'
                     : sid === 'cta' ? 'CTA' : '';
    const globalBlock = state.contentBlocks.find(b => b.sectionName === globalName) || {};

    return {
      title: draft.title !== undefined ? draft.title : globalBlock.title,
      subtitle: draft.subtitle !== undefined ? draft.subtitle : globalBlock.subtitle,
      body: draft.body !== undefined ? draft.body : globalBlock.body,
      imageUrl: draft.imageUrl !== undefined ? draft.imageUrl : globalBlock.imageUrl,
      ctaText: draft.ctaText !== undefined ? draft.ctaText : globalBlock.ctaText,
      ctaLink: draft.ctaLink !== undefined ? draft.ctaLink : globalBlock.ctaLink,
      badgeText: draft.badgeText !== undefined ? draft.badgeText : globalBlock.badgeText,
      layoutStyle: draft.layoutStyle !== undefined ? draft.layoutStyle : (globalBlock.layoutStyle || 'Split-Image-Right'),
      features: draft.features !== undefined ? draft.features : (globalBlock.features || []),
      images: draft.images !== undefined ? draft.images : (globalBlock.images || []),
    };
  };

  // Update specific draft field helper
  const updateDraftField = (sid: string, field: keyof ContentBlock, value: any) => {
    setSectionDrafts(prev => ({
      ...prev,
      [sid]: {
        ...prev[sid],
        [field]: value
      }
    }));
    setDirty(true);
  };

  // Reorder sections handler (local state change)
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= sectionOrderDraft.length) return;

    const list = [...sectionOrderDraft];
    const temp = list[index];
    list[index] = list[nextIndex];
    list[nextIndex] = temp;

    // Recalculate order values
    const updated = list.map((s, i) => ({ ...s, order: i }));
    setSectionOrderDraft(updated);
    setDirty(true);
  };

  // Toggle visibility status
  const toggleVisibility = (sid: string) => {
    const list = sectionOrderDraft.map(s => {
      if (s.id === sid) return { ...s, enabled: !s.enabled };
      return s;
    });
    setSectionOrderDraft(list);
    setDirty(true);
  };

  // Save all drafts to global context
  const handleSaveAll = () => {
    setSaveStatus('saving');
    
    // 1. Save sections list order & enabled flags
    const reordered = sectionOrderDraft.map((s, i) => ({ ...s, order: i }));
    reorderSections(reordered);
    sectionOrderDraft.forEach(sec => {
      updateSection(sec.id, { enabled: sec.enabled });
    });

    // 2. Save content blocks text edits
    Object.entries(sectionDrafts).forEach(([sid, draft]) => {
      const globalName = sid === 'hero' ? 'Hero' 
                       : sid === 'product-showcase' ? 'Explore Designs'
                       : sid === 'printed-invites' ? 'Printed Luxury Invites'
                       : sid === 'categories' ? 'Browse by Occasion'
                       : sid === 'services' ? 'Our Services'
                       : sid === 'testimonials' ? 'Testimonials'
                       : sid === 'cta' ? 'CTA' : '';
      const globalBlock = state.contentBlocks.find(b => b.sectionName === globalName);
      if (globalBlock) {
        updateContentBlock(globalBlock.id, draft);
      }
    });

    setTimeout(() => {
      setSaveStatus('saved');
      setDirty(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  // Switch to specific section editor
  const editSection = (sid: string) => {
    setActiveSectionId(sid);
    setSidebarTab('edit');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 admin-animate-in" style={{ minHeight: 'calc(100vh - 140px)' }}>
      
      {/* ── LEFT PANEL: CONFIGURATION SIDEBAR (30%) ── */}
      <aside className="w-full lg:w-[400px] bg-white border border-[#e5e5e5] rounded-3xl p-5 flex flex-col justify-between shadow-sm flex-shrink-0">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#1a1410] flex items-center gap-1.5" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                <LayoutGrid size={16} className="text-[#8B4949]" /> Shopify-Style Editor
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5">Customize layouts &amp; live contents inline</p>
            </div>
            {dirty && (
              <span className="px-2 py-0.5 bg-[#D4AF37]/15 text-[#b08d23] text-[9px] font-bold rounded-md animate-pulse">
                Unsaved*
              </span>
            )}
          </div>

          {/* Tab Switcher (Show when not editing a specific section) */}
          {sidebarTab === 'list' ? (
            <div className="space-y-4">
              <div className="p-3 bg-[#faf8f5] border border-[#f0ece4] rounded-xl flex gap-2">
                <Info size={14} className="text-[#8B4949] flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Hover over sections in the **Live Mockup** to edit or arrange them. Drag handles or click edit icons below to customize contents.
                </p>
              </div>

              {/* List of sections for reordering */}
              <div>
                <label className="admin-label !text-gray-450 block mb-2 font-bold tracking-widest text-[9px] uppercase">
                  Homepage Layout Sections
                </label>
                <div className="space-y-2">
                  {sectionOrderDraft.map((section, idx) => {
                    const blockData = getBlockData(section.id);
                    return (
                      <div
                        key={section.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          section.enabled
                            ? 'bg-white border-[#e5e5e5] hover:border-[#8B4949]/35 hover:shadow-xs'
                            : 'bg-gray-50 border-gray-100 opacity-60'
                        }`}
                      >
                        {/* Order number */}
                        <div className="w-5 h-5 rounded-full bg-[#8B4949]/10 text-[#8B4949] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </div>

                        <span className="text-xl flex-shrink-0">{SECTION_ICONS[section.id] || '📄'}</span>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#1a1410] truncate">{SECTION_LABELS[section.id] || section.name}</p>
                          <p className="text-[9px] text-gray-400 mt-0.5 truncate">
                            {blockData.title || blockData.badgeText || 'No custom text written'}
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveSection(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-gray-400 hover:text-[#8B4949] disabled:opacity-20 transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSection(idx, 'down')}
                            disabled={idx === sectionOrderDraft.length - 1}
                            className="p-1 text-gray-400 hover:text-[#8B4949] disabled:opacity-20 transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleVisibility(section.id)}
                            className={`p-1.5 rounded-md transition-colors ${
                              section.enabled ? 'text-[#4A7C59] hover:bg-green-50' : 'text-gray-300 hover:bg-gray-100'
                            }`}
                            title={section.enabled ? 'Hide Section' : 'Show Section'}
                          >
                            {section.enabled ? <Eye size={12} /> : <EyeOff size={12} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => editSection(section.id)}
                            className="p-1 text-[#8B4949] hover:bg-[#8B4949]/5 rounded-md transition-colors font-bold text-[10px]"
                            title="Edit Content Settings"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Tab B: Active Section Content Editor */
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSidebarTab('list')}
                  className="px-2.5 py-1 bg-gray-50 border border-gray-200 hover:border-gray-400 text-gray-600 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                >
                  ← Back to List
                </button>
                <span className="text-[10px] text-gray-400">Editing:</span>
                <span className="text-[10px] font-bold text-[#8B4949]">
                  {activeSectionId && SECTION_LABELS[activeSectionId]}
                </span>
              </div>

              {activeSectionId && (() => {
                const data = getBlockData(activeSectionId);
                const hasLayoutSetting = ['product-showcase', 'printed-invites'].includes(activeSectionId);

                return (
                  <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1 admin-scrollbar">
                    {/* General Text Fields */}
                    {activeSectionId !== 'hero' && (
                      <>
                        {/* Title field */}
                        <div>
                          <label className="admin-label">Section Header Title</label>
                          <input
                            type="text"
                            className="admin-input text-xs"
                            value={data.title || ''}
                            onChange={(e) => updateDraftField(activeSectionId, 'title', e.target.value)}
                            placeholder="e.g. Wedding Invitations Collection"
                          />
                        </div>

                        {/* Subtitle field */}
                        {activeSectionId !== 'cta' && (
                          <div>
                            <label className="admin-label">Section Subtitle / Description</label>
                            <textarea
                              rows={2}
                              className="admin-textarea text-xs"
                              value={data.subtitle || ''}
                              onChange={(e) => updateDraftField(activeSectionId, 'subtitle', e.target.value)}
                              placeholder="e.g. Elegant styles for your special occasions"
                            />
                          </div>
                        )}

                        {/* Body field (For Printed Luxury section) */}
                        {activeSectionId === 'printed-invites' && (
                          <div>
                            <label className="admin-label">Luxury Description Body</label>
                            <textarea
                              rows={4}
                              className="admin-textarea text-xs"
                              value={data.body || ''}
                              onChange={(e) => updateDraftField(activeSectionId, 'body', e.target.value)}
                              placeholder="e.g. Meticulously designed rigid boxes..."
                            />
                          </div>
                        )}

                        {/* BadgeText field */}
                        {['printed-invites', 'product-showcase'].includes(activeSectionId) && (
                          <div>
                            <label className="admin-label">Accent Badge Tag</label>
                            <input
                              type="text"
                              className="admin-input text-xs"
                              value={data.badgeText || ''}
                              onChange={(e) => updateDraftField(activeSectionId, 'badgeText', e.target.value)}
                              placeholder="e.g. Premium Collections"
                            />
                          </div>
                        )}
                      </>
                    )}

                    {/* Layout Style Picker */}
                    {hasLayoutSetting && (
                      <div>
                        <label className="admin-label">Section Render Layout</label>
                        <select
                          className="admin-input text-xs"
                          value={data.layoutStyle || 'Split-Image-Right'}
                          onChange={(e) => updateDraftField(activeSectionId, 'layoutStyle', e.target.value)}
                        >
                          <option value="Split-Image-Right">Split Layout (Right Image)</option>
                          <option value="Split-Image-Left">Split Layout (Left Image)</option>
                          <option value="Centered-Accent">Centered Text &amp; Banner</option>
                          <option value="Minimalist-Banner">Minimal Banner (Hide collage)</option>
                        </select>
                      </div>
                    )}

                    {/* Hero Slides Editor */}
                    {activeSectionId === 'hero' && (
                      <div className="space-y-4">
                        <label className="admin-label !text-gray-400 uppercase tracking-widest text-[9px] font-bold">
                          Manage Slides Carousel
                        </label>
                        {[0, 1, 2].map((sIdx) => (
                          <div key={sIdx} className="p-3 bg-[#faf8f5] border border-[#f0ece4] rounded-xl space-y-2.5">
                            <h4 className="text-[10px] font-bold text-[#8B4949]">Slide {sIdx + 1} Content</h4>
                            <div>
                              <input
                                type="text"
                                className="admin-input !bg-white text-xs py-1"
                                placeholder="Slide Main Title"
                                value={state.heroSlides[sIdx]?.title || ''}
                                onChange={(e) => {
                                  // Update slide values in drafts if needed, or simply placeholder notification
                                  alert("Slide titles can be managed in Website Sections -> Hero tab for full carousel image upload.");
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA section Button config */}
                    {activeSectionId === 'cta' && (
                      <div className="grid grid-cols-2 gap-3.5 bg-[#faf8f5] p-3 rounded-xl border border-[#f0ece4]">
                        <div>
                          <label className="admin-label">Button Text</label>
                          <input
                            type="text"
                            className="admin-input !bg-white text-xs"
                            value={data.ctaText || ''}
                            onChange={(e) => updateDraftField(activeSectionId, 'ctaText', e.target.value)}
                            placeholder="Explore Collection"
                          />
                        </div>
                        <div>
                          <label className="admin-label">Button Link</label>
                          <input
                            type="text"
                            className="admin-input !bg-white text-xs"
                            value={data.ctaLink || ''}
                            onChange={(e) => updateDraftField(activeSectionId, 'ctaLink', e.target.value)}
                            placeholder="/events"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Footer controls & Publish */}
        <div className="border-t border-[#f0f0f0] pt-4 mt-5 space-y-2">
          {dirty ? (
            <button
              onClick={handleSaveAll}
              disabled={saveStatus === 'saving'}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#8B4949] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#8B4949]/20 hover:scale-[1.02] cursor-pointer hover:bg-[#723a3a] transition-all disabled:opacity-50"
            >
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Saving Configuration...
                </>
              ) : (
                <>
                  <Save size={14} /> Save &amp; Publish Website
                </>
              )}
            </button>
          ) : (
            <div className="text-center py-2 px-3 bg-[#4A7C59]/10 rounded-xl border border-[#4A7C59]/20 text-[#4A7C59] text-[10px] font-bold flex items-center justify-center gap-1">
              <CheckCircle size={12} /> Live Website Order is Syncing
            </div>
          )}
        </div>
      </aside>

      {/* ── RIGHT PANEL: LIVE MOCKUP WEBSITE CANVAS (70%) ── */}
      <main className="flex-1 bg-[#faf8f5] border border-[#e5e5e5] rounded-3xl p-5 flex flex-col shadow-sm">
        
        {/* Device frame header */}
        <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3 mb-4 bg-white px-4 py-2.5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <div className="ml-3 flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] text-gray-400 select-none">
              <Globe size={10} />
              <span>https://eventique-admin-panel-ready.vercel.app</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 text-gray-400">
              <Laptop size={14} className="text-[#8B4949]" title="Desktop Canvas View" />
            </div>
            <span className="text-[10px] text-gray-400 font-semibold select-none">Wix Live Canvas Preview</span>
          </div>
        </div>

        {/* Scrollable mockup browser viewport */}
        <div className="flex-1 bg-white rounded-2xl shadow-inner border border-gray-150 overflow-y-auto max-h-[66vh] p-6 space-y-12 relative admin-scrollbar">
          
          {/* Loop over section configs locally reordered */}
          {sectionOrderDraft.map((section) => {
            if (!section.enabled) return null;

            // Highlight border if active section
            const isEditingThis = activeSectionId === section.id;

            return (
              <div
                key={section.id}
                onClick={() => editSection(section.id)}
                className={`relative border-2 rounded-2xl p-4 transition-all duration-300 group hover:border-[#8B4949] cursor-pointer hover:shadow-xs ${
                  isEditingThis ? 'border-[#8B4949] bg-[#8B4949]/[0.01]' : 'border-transparent'
                }`}
              >
                {/* Visual hover indicator overlay bar */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-30 flex items-center gap-2 bg-[#8B4949] text-white px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest shadow-md">
                  <span>{section.name}</span>
                  <span className="text-white/60">| Click to Edit inline</span>
                </div>

                {/* Section Specific Mocks */}
                {(() => {
                  const data = getBlockData(section.id);
                  const hasCta = data.ctaText;

                  if (section.id === 'hero') {
                    // Render Hero slides mock
                    const slides = [
                      { title: 'Celebrate Every Moment with', highlight: 'Elegance', badge: 'Personalized Invitations', bg: 'from-amber-50 to-[#faf8f5]' },
                      { title: 'Elegant Premium Rigid Box', highlight: 'Invites', badge: 'Handcrafted Physical Collections', bg: 'from-[#faf0e8] to-[#faf8f5]' },
                      { title: 'Interactive Custom RSVP', highlight: 'Microsites', badge: 'Event Websites &amp; RSVPs', bg: 'from-[#f0f5f8] to-[#faf8f5]' }
                    ];
                    const activeSlide = slides[heroSlideIdx];

                    return (
                      <div className={`p-8 bg-gradient-to-br ${activeSlide.bg} rounded-xl border border-gray-100 flex items-center justify-between min-h-[220px]`}>
                        <div className="space-y-3.5 max-w-sm">
                          <span className="inline-block px-2.5 py-1 bg-[#8B4949]/5 text-[#8B4949] rounded-full text-[9px] font-bold uppercase tracking-wider border border-[#8B4949]/10">
                            🌸 {activeSlide.badge}
                          </span>
                          <h1 className="text-2xl font-black text-[#1a1410] leading-tight">
                            {activeSlide.title} <span className="text-[#8B4949] italic">{activeSlide.highlight}</span>
                          </h1>
                          <p className="text-[10px] text-gray-500 font-light">
                            Experience next-level bespoke design for your premium luxury wedding and birthday invitations.
                          </p>
                          <div className="flex gap-2">
                            <span className="px-3.5 py-1.5 bg-[#8B4949] text-white font-extrabold text-[9px] rounded-lg">
                              Explore Collection
                            </span>
                            <span className="px-3.5 py-1.5 bg-white border border-gray-250 text-gray-700 font-extrabold text-[9px] rounded-lg">
                              Request Quote
                            </span>
                          </div>
                        </div>

                        {/* Slider Nav Controls */}
                        <div className="flex flex-col gap-1 items-center">
                          {[0, 1, 2].map((dotIdx) => (
                            <button
                              key={dotIdx}
                              onClick={(e) => { e.stopPropagation(); setHeroSlideIdx(dotIdx); }}
                              className={`w-2 h-2 rounded-full transition-all ${
                                dotIdx === heroSlideIdx ? 'bg-[#8B4949] h-4' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.id === 'product-showcase') {
                    // Explore Designs Grid
                    return (
                      <div className="space-y-4">
                        <div className="text-center max-w-sm mx-auto">
                          {data.badgeText && (
                            <span className="inline-block text-[8px] font-extrabold uppercase tracking-widest text-[#8B4949] bg-[#8B4949]/5 px-2 py-0.5 rounded-full mb-1">
                              {data.badgeText}
                            </span>
                          )}
                          <h3 className="text-sm font-extrabold text-[#1a1410]">{data.title || 'Explore Collections'}</h3>
                          <p className="text-[10px] text-gray-400">{data.subtitle || 'Select from our range of invitation formats'}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                          {[
                            { name: 'Video Invites', desc: 'Premium animated loops', color: 'bg-red-50 text-red-700' },
                            { name: 'Event Websites', desc: 'Interactive RSVP micro-portals', color: 'bg-indigo-50 text-indigo-700' },
                            { name: 'Printed Luxury Invites', desc: 'Handcrafted rigid cotton cards', color: 'bg-amber-50 text-amber-700' }
                          ].map((cat, i) => (
                            <div key={i} className="p-4 bg-[#faf8f5] border border-gray-150 rounded-xl space-y-1">
                              <span className={`px-2 py-0.5 text-[8px] font-bold rounded-md ${cat.color}`}>{cat.name}</span>
                              <p className="text-[9px] text-gray-500 mt-2">{cat.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.id === 'printed-invites') {
                    // Printed Luxury Invites
                    const defaultImg = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600";
                    const pImage = data.imageUrl || defaultImg;
                    const layout = data.layoutStyle || 'Split-Image-Right';

                    if (layout === 'Split-Image-Left') {
                      return (
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                          <div className="w-full md:w-5/12 flex justify-center">
                            <img src={pImage} alt="Mock Left" className="max-h-[140px] rounded-xl object-cover border shadow-sm" />
                          </div>
                          <div className="w-full md:w-7/12 space-y-2 text-left">
                            {data.badgeText && (
                              <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#8B4949] bg-[#8B4949]/5 px-2 py-0.5 rounded-full">
                                {data.badgeText}
                              </span>
                            )}
                            <h3 className="text-sm font-extrabold text-[#1a1410]">{data.title || 'Printed Luxury'}</h3>
                            <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-3">{data.body || 'Crafted with premium cotton stocks...'}</p>
                          </div>
                        </div>
                      );
                    }

                    if (layout === 'Centered-Accent') {
                      return (
                        <div className="text-center max-w-md mx-auto space-y-2">
                          {data.badgeText && (
                            <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#8B4949] bg-[#8B4949]/5 px-2 py-0.5 rounded-full">
                              {data.badgeText}
                            </span>
                          )}
                          <h3 className="text-sm font-extrabold text-[#1a1410]">{data.title || 'Printed Luxury'}</h3>
                          <p className="text-[10px] text-gray-500 max-w-sm mx-auto leading-relaxed">{data.body || 'Crafted with premium cotton stocks...'}</p>
                        </div>
                      );
                    }

                    if (layout === 'Minimalist-Banner') {
                      return (
                        <div className="bg-[#faf8f5] p-4 rounded-xl border border-gray-150 flex justify-between items-center">
                          <div className="space-y-1">
                            <h3 className="text-xs font-bold text-[#1a1410]">{data.title || 'Printed Luxury'}</h3>
                            <p className="text-[9px] text-gray-500">{data.subtitle || 'Elegant rigid envelopes'}</p>
                          </div>
                          <span className="text-[9px] font-bold text-[#8B4949]">Order Samples →</span>
                        </div>
                      );
                    }

                    // Default: Split-Image-Right
                    return (
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="w-full md:w-7/12 space-y-2 text-left">
                          {data.badgeText && (
                            <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#8B4949] bg-[#8B4949]/5 px-2 py-0.5 rounded-full">
                              {data.badgeText}
                            </span>
                          )}
                          <h3 className="text-sm font-extrabold text-[#1a1410]">{data.title || 'Printed Luxury'}</h3>
                          <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-3">{data.body || 'Crafted with premium cotton stocks...'}</p>
                        </div>
                        <div className="w-full md:w-5/12 flex justify-center">
                          <img src={pImage} alt="Mock Right" className="max-h-[140px] rounded-xl object-cover border shadow-sm" />
                        </div>
                      </div>
                    );
                  }

                  if (section.id === 'categories') {
                    return (
                      <div className="space-y-4">
                        <div className="text-center max-w-xs mx-auto">
                          <h3 className="text-sm font-extrabold text-[#1a1410]">{data.title || 'Browse by Occasion'}</h3>
                          <p className="text-[10px] text-gray-400">{data.subtitle || 'Choose category grids'}</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['Wedding', 'Anniversary', 'Engagement', 'Birthday'].map(occ => (
                            <div key={occ} className="aspect-[4/3] rounded-xl bg-gray-100 flex items-center justify-center relative overflow-hidden group/item">
                              <span className="absolute inset-0 bg-black/40 z-10" />
                              <span className="relative z-20 text-white font-bold text-[10px]">{occ}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.id === 'product-carousel') {
                    return (
                      <div className="space-y-2.5">
                        <p className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">🌟 Popular Design Highlights</p>
                        <div className="grid grid-cols-4 gap-3.5">
                          {[
                            'https://images.unsplash.com/photo-1519741497674-611481863552?w=300',
                            'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300',
                            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300',
                            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300'
                          ].map((src, idx) => (
                            <div key={idx} className="aspect-[3/4] bg-[#faf8f5] rounded-xl overflow-hidden border">
                              <img src={src} className="w-full h-full object-cover" alt="Product thumbnail" />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.id === 'services') {
                    return (
                      <div className="space-y-4">
                        <div className="text-center max-w-xs mx-auto">
                          <h3 className="text-sm font-extrabold text-[#1a1410]">{data.title || 'Our Services'}</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
                          {['Digital Cards', 'Video Invites', 'RSVP Websites', 'Custom Stationery', 'Premium Gifts'].map((ser, i) => (
                            <div key={i} className="p-3 bg-white border border-gray-150 rounded-xl text-center">
                              <span className="text-xs">⚡</span>
                              <h5 className="text-[9px] font-bold text-[#1a1410] mt-1.5">{ser}</h5>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.id === 'how-it-works') {
                    return (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-center text-[#1a1410]">Our Four-Step Process</h4>
                        <div className="grid grid-cols-4 gap-3.5 text-center">
                          {['1. Select Design', '2. Personalize', '3. Approve Proof', '4. Secure Delivery'].map((step, i) => (
                            <div key={i} className="space-y-1">
                              <div className="w-6 h-6 rounded-full bg-[#8B4949]/10 text-[#8B4949] mx-auto flex items-center justify-center text-[10px] font-bold">
                                {i + 1}
                              </div>
                              <p className="text-[8px] font-semibold text-gray-500">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.id === 'testimonials') {
                    return (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-center text-[#1a1410]">❤️ What Clients Say</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { name: 'Riya & Amit', review: 'The rigid wedding box was breathtaking.' },
                            { name: 'Karan Shah', review: 'Beautiful animations, very fast revisions.' }
                          ].map((t, idx) => (
                            <div key={idx} className="p-3 bg-[#faf8f5] border rounded-xl">
                              <div className="flex text-amber-400 gap-0.5 mb-1.5"><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /></div>
                              <p className="text-[8px] text-gray-500 italic">"{t.review}"</p>
                              <h6 className="text-[8px] font-bold text-gray-600 mt-2">{t.name}</h6>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.id === 'cta') {
                    return (
                      <div className="p-6 bg-gradient-to-r from-[#2d1515] via-[#8B4949] to-[#D4AF37] text-white rounded-xl text-center space-y-2">
                        <h3 className="text-sm font-black tracking-tight">{data.title || 'Create Something Unforgettable'}</h3>
                        <p className="text-[8px] text-white/70 max-w-xs mx-auto">
                          Ready to design the invitations for your dream celebration? Reach out to us today.
                        </p>
                        {hasCta && (
                          <span className="inline-block px-3 py-1 bg-white text-[#8B4949] font-extrabold text-[8px] rounded">
                            {data.ctaText}
                          </span>
                        )}
                      </div>
                    );
                  }

                  return null;
                })()}
              </div>
            );
          })}
          
        </div>
      </main>

    </div>
  );
}
