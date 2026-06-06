import { useState, useEffect, useRef } from 'react';
import {
  Save, Eye, EyeOff, Clock, Plus, Trash2, ArrowUp, ArrowDown,
  Image as ImageIcon, Link as LinkIcon, FileText, Upload,
  Calendar, Edit3, X, ChevronRight, Check, GripVertical
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { ContentBlock, BlogPost, BlogPostContent } from '../types';
import HeroSlidesManager from './HeroSlidesManager';
import PackagesManager from './PackagesManager';
import FAQsManager from './FAQsManager';
import CategoriesManager from './CategoriesManager';
import ServicesManager from './ServicesManager';
import TestimonialsManager from './TestimonialsManager';

const SECTION_NAMES = [
  'Hero',
  'Explore Designs',
  'Video Invites',
  'Browse by Occasion',
  'Our Services',
  'Packages',
  'Event Websites',
  'Stationery',
  'Printed Luxury Invites',
  'FAQ',
  'Testimonials',
  'Footer',
  'About',
  'Contact',
  'Terms',
  'Privacy Policy',
  'Refund Policy',
] as const;

export default function ContentsManager() {
  const { state, updateContentBlock, addBlogPost, updateBlogPost, deleteBlogPost } = useAdmin();

  // Tab State: 'sections' | 'blog'
  const [activeTab, setActiveTab] = useState<'sections' | 'blog'>('sections');

  // ── SECTIONS TAB STATE ──────────────────────────────────────
  const [selectedSection, setSelectedSection] = useState<string>(SECTION_NAMES[0]);
  const currentBlock = state.contentBlocks.find((b) => b.sectionName === selectedSection);

  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionSubtitle, setSectionSubtitle] = useState('');
  const [sectionBody, setSectionBody] = useState('');
  const [sectionImageUrl, setSectionImageUrl] = useState('');
  const [sectionCtaText, setSectionCtaText] = useState('');
  const [sectionCtaLink, setSectionCtaLink] = useState('');
  const [showCtaToggle, setShowCtaToggle] = useState(false);
  const [sectionImages, setSectionImages] = useState<string[]>([]);
  const [sectionDirty, setSectionDirty] = useState(false);

  // About Page Sub-states
  const [aboutValues, setAboutValues] = useState<{ icon: string; title: string; desc: string }[]>([]);
  const [aboutStoryPoints, setAboutStoryPoints] = useState<{ title: string; text: string; iconName: string; color: string }[]>([]);
  const [aboutMilestones, setAboutMilestones] = useState<{ number: string; label: string; iconName: string }[]>([]);
  const [founderName, setFounderName] = useState('');
  const [founderRole, setFounderRole] = useState('');
  const [founderEducation, setFounderEducation] = useState('');
  const [founderBio, setFounderBio] = useState('');
  const [founderImage, setFounderImage] = useState('');
  const [aboutTeam, setAboutTeam] = useState<{ name: string; role: string; education: string; image: string }[]>([]);

  // Contact Page Sub-states
  const [contactDetails, setContactDetails] = useState<{ type: string; title: string; subtitle: string; value: string; linkText?: string; linkUrl?: string }[]>([]);
  const [contactFaqs, setContactFaqs] = useState<{ q: string; a: string }[]>([]);
  const [contactCtaInfo, setContactCtaInfo] = useState({ title: '', subtitle: '', detail: '', whatsappNumber: '', whatsappText: '' });

  // Media Library Picker Modal State
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'section' | 'blog' | 'gallery'>('section');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Sync section form draft when section selection changes
  useEffect(() => {
    if (currentBlock) {
      setSectionTitle(currentBlock.title ?? '');
      setSectionSubtitle(currentBlock.subtitle ?? '');
      setSectionBody(currentBlock.body ?? '');
      setSectionImageUrl(currentBlock.imageUrl ?? '');
      setSectionCtaText(currentBlock.ctaText ?? '');
      setSectionCtaLink(currentBlock.ctaLink ?? '');
      setShowCtaToggle(!!currentBlock.ctaText);
      setSectionImages(currentBlock.images ?? []);

      // Populate About fields
      setAboutValues(currentBlock.aboutValues ?? []);
      setAboutStoryPoints(currentBlock.aboutStoryPoints ?? []);
      setAboutMilestones(currentBlock.aboutMilestones ?? []);
      setFounderName(currentBlock.aboutFounder?.name ?? '');
      setFounderRole(currentBlock.aboutFounder?.role ?? '');
      setFounderEducation(currentBlock.aboutFounder?.education ?? '');
      setFounderBio(currentBlock.aboutFounder?.bio ?? '');
      setFounderImage(currentBlock.aboutFounder?.image ?? '');
      setAboutTeam(currentBlock.aboutTeam ?? []);

      // Populate Contact fields
      setContactDetails(currentBlock.contactDetails ?? []);
      setContactFaqs(currentBlock.contactFaqs ?? []);
      setContactCtaInfo({
        title: currentBlock.contactCtaInfo?.title ?? '',
        subtitle: currentBlock.contactCtaInfo?.subtitle ?? '',
        detail: currentBlock.contactCtaInfo?.detail ?? '',
        whatsappNumber: currentBlock.contactCtaInfo?.whatsappNumber ?? '',
        whatsappText: currentBlock.contactCtaInfo?.whatsappText ?? '',
      });
    } else {
      setSectionTitle('');
      setSectionSubtitle('');
      setSectionBody('');
      setSectionImageUrl('');
      setSectionCtaText('');
      setSectionCtaLink('');
      setShowCtaToggle(false);
      setSectionImages([]);

      // Reset About fields
      setAboutValues([]);
      setAboutStoryPoints([]);
      setAboutMilestones([]);
      setFounderName('');
      setFounderRole('');
      setFounderEducation('');
      setFounderBio('');
      setFounderImage('');
      setAboutTeam([]);

      // Reset Contact fields
      setContactDetails([]);
      setContactFaqs([]);
      setContactCtaInfo({ title: '', subtitle: '', detail: '', whatsappNumber: '', whatsappText: '' });
    }
    setSectionDirty(false);
  }, [selectedSection, currentBlock?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSectionFieldChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: any) => {
    setter(e.target.value);
    setSectionDirty(true);
  };

  const handleSectionSave = () => {
    if (!currentBlock) return;
    
    const updatedFields: Partial<ContentBlock> = {
      title: sectionTitle || undefined,
      subtitle: sectionSubtitle || undefined,
      body: sectionBody || undefined,
      imageUrl: sectionImageUrl || undefined,
      ctaText: showCtaToggle ? sectionCtaText || undefined : undefined,
      ctaLink: showCtaToggle ? sectionCtaLink || undefined : undefined,
      images: sectionImages,
    };

    if (selectedSection === 'About') {
      updatedFields.aboutValues = aboutValues;
      updatedFields.aboutStoryPoints = aboutStoryPoints;
      updatedFields.aboutMilestones = aboutMilestones;
      updatedFields.aboutFounder = {
        name: founderName,
        role: founderRole,
        education: founderEducation,
        bio: founderBio,
        image: founderImage
      };
      updatedFields.aboutTeam = aboutTeam;
    }

    if (selectedSection === 'Contact') {
      updatedFields.contactDetails = contactDetails;
      updatedFields.contactFaqs = contactFaqs;
      updatedFields.contactCtaInfo = contactCtaInfo;
    }

    updateContentBlock(currentBlock.id, updatedFields);
    setSectionDirty(false);
    alert(`${selectedSection} section content saved successfully!`);
  };

  const handleSectionToggle = () => {
    if (!currentBlock) return;
    updateContentBlock(currentBlock.id, { enabled: !currentBlock.enabled });
  };

  const handleSectionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSectionImageUrl(url);
      setSectionDirty(true);
    }
  };

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        urls.push(URL.createObjectURL(files[i]));
      }
      setSectionImages(prev => [...prev, ...urls]);
      setSectionDirty(true);
    }
  };

  // ── BLOG TAB STATE ──────────────────────────────────────────
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [blogDeleteTarget, setBlogDeleteTarget] = useState<number | null>(null);

  // Blog Post Editor Form State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSubtitle, setBlogSubtitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('5 min read');
  const [blogImage, setBlogImage] = useState('');
  const [blogDescription, setBlogDescription] = useState('');
  const [blogContent, setBlogContent] = useState<BlogPostContent[]>([]);
  const [blogDirty, setBlogDirty] = useState(false);
  const [blogImageBlockIndex, setBlogImageBlockIndex] = useState<number | null>(null);
  const [showBlogImagePicker, setShowBlogImagePicker] = useState(false);

  const blogPostFileInputRef = useRef<HTMLInputElement>(null);

  // Open blog editor for new or existing post
  const handleOpenBlogEditor = (post: BlogPost | null) => {
    if (post) {
      setSelectedPostId(post.id);
      setBlogTitle(post.title);
      setBlogSubtitle(post.subtitle);
      setBlogCategory(post.category);
      setBlogReadTime(post.readTime);
      setBlogImage(post.image);
      setBlogDescription(post.description ?? '');
      setBlogContent(post.content);
    } else {
      setSelectedPostId(null);
      setBlogTitle('');
      setBlogSubtitle('');
      setBlogCategory('Planning Tips');
      setBlogReadTime('4 min read');
      setBlogImage('https://images.unsplash.com/photo-1519741497674-611481863552?w=800');
      setBlogDescription('');
      setBlogContent([
        { type: 'paragraph', text: 'Start writing your blog content here...' }
      ]);
    }
    setIsEditingPost(true);
    setBlogDirty(false);
  };

  const handleBlogImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBlogImage(url);
      setBlogDirty(true);
    }
  };

  // Blog Content block modifications
  const handleAddContentBlock = (type: BlogPostContent['type']) => {
    setBlogContent([...blogContent, { type, text: '' }]);
    setBlogDirty(true);
  };

  const handleUpdateContentBlockText = (index: number, text: string) => {
    const updated = [...blogContent];
    updated[index].text = text;
    setBlogContent(updated);
    setBlogDirty(true);
  };

  const handleUpdateContentBlockImage = (index: number, image: string | undefined) => {
    const updated = [...blogContent];
    updated[index] = { ...updated[index], image };
    setBlogContent(updated);
    setBlogDirty(true);
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const updated = [...blogContent];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);
    setBlogContent(updated);
    setDraggedIndex(null);
    setBlogDirty(true);
  };

  const handleMoveContentBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blogContent.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...blogContent];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setBlogContent(updated);
    setBlogDirty(true);
  };

  const handleRemoveContentBlock = (index: number) => {
    setBlogContent(blogContent.filter((_, i) => i !== index));
    setBlogDirty(true);
  };

  const handleSaveBlogPost = () => {
    if (!blogTitle.trim()) {
      alert('Please enter a blog post title.');
      return;
    }

    const postData: BlogPost = {
      id: selectedPostId ?? Date.now(),
      title: blogTitle,
      subtitle: blogSubtitle,
      category: blogCategory,
      readTime: blogReadTime,
      image: blogImage,
      description: blogDescription,
      content: blogContent,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    if (selectedPostId !== null) {
      updateBlogPost(selectedPostId, postData);
      alert('Blog post updated successfully!');
    } else {
      addBlogPost(postData);
      alert('New blog post published successfully!');
    }

    setIsEditingPost(false);
    setBlogDirty(false);
  };

  const handleDeleteBlogPostConfirm = () => {
    if (blogDeleteTarget !== null) {
      deleteBlogPost(blogDeleteTarget);
      setBlogDeleteTarget(null);
      setIsEditingPost(false);
      alert('Blog post deleted successfully!');
    }
  };

  const isCarouselSection = ['Hero', 'Explore Designs', 'Video Invites', 'Event Websites', 'Stationery', 'Printed Luxury Invites'].includes(selectedSection);

  // Section fields filter logic
  const hasTitle = selectedSection !== 'Footer';
  const hasSubtitle = !['Footer', 'Terms', 'Privacy Policy', 'Refund Policy'].includes(selectedSection);
  const hasBody = ['Footer', 'About', 'Terms', 'Privacy Policy', 'Refund Policy', 'Printed Luxury Invites'].includes(selectedSection);
  const hasImage = ['Video Invites', 'Event Websites', 'Stationery', 'About', 'Printed Luxury Invites'].includes(selectedSection);
  const hasCta = ['Explore Designs', 'Video Invites', 'Event Websites', 'Stationery', 'Printed Luxury Invites'].includes(selectedSection);

  const imagesInMedia = state.mediaFiles.filter(f => f.type === 'image');

  return (
    <div className="space-y-6 admin-animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1410]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Website Contents
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage section headers, images, CTAs, and blog publishing</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 bg-white border border-[#e5e5e5] rounded-xl p-1.5 w-fit shadow-sm">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'sections'
              ? 'bg-[#8B4949] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#8B4949] hover:bg-[#f5f0e8]'
          }`}
          onClick={() => {
            setActiveTab('sections');
            setIsEditingPost(false);
          }}
        >
          Website Sections
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'blog'
              ? 'bg-[#8B4949] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#8B4949] hover:bg-[#f5f0e8]'
          }`}
          onClick={() => setActiveTab('blog')}
        >
          Blog Articles
        </button>
      </div>

      {/* ── TAB 1: WEBSITE SECTIONS ──────────────────────────────── */}
      {activeTab === 'sections' && (
        <div
          className="admin-card !p-0 overflow-hidden flex flex-col md:flex-row shadow-sm border border-[#e5e5e5]"
          style={{ minHeight: '560px' }}
        >
          {/* Side Nav */}
          <aside
            style={{
              width: '220px',
              minWidth: '220px',
              background: '#fcfaf7',
              borderRight: '1px solid #e5e5e5',
              overflowY: 'auto',
            }}
            className="admin-scrollbar"
          >
            <div style={{ padding: '1.25rem 1rem 0.5rem', borderBottom: '1px solid #f0ebe2' }}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Sections List
              </p>
            </div>
            <ul style={{ padding: '0.5rem' }} className="space-y-0.5">
              {SECTION_NAMES.map((name) => {
                const b = state.contentBlocks.find((cb) => cb.sectionName === name);
                const isActive = selectedSection === name;
                return (
                  <li key={name}>
                    <button
                      onClick={() => setSelectedSection(name)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-none cursor-pointer transition-all text-left text-xs font-semibold"
                      style={{
                        fontFamily: "'Bricolage Grotesque', 'Inter', system-ui, sans-serif",
                        background: isActive ? '#8B4949' : 'transparent',
                        color: isActive ? '#ffffff' : '#555',
                      }}
                    >
                      <span className="truncate">{name}</span>
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 ml-2"
                        style={{ background: b?.enabled ? '#4A7C59' : '#aaa' }}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Edit Panel */}
          <div className="flex-1 bg-white p-7 overflow-y-auto admin-scrollbar space-y-6">
            {currentBlock ? (
              <>
                {/* Panel Title & Visibility */}
                <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
                  <h2 className="text-lg font-bold text-[#1a1410] flex items-center gap-2">
                    {selectedSection} Settings
                    {sectionDirty && (
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" title="Unsaved changes" />
                    )}
                  </h2>
                  <div className="flex items-center gap-2.5 bg-[#faf8f5] px-3 py-1.5 rounded-xl border border-[#e5e5e5]/50">
                    <span className="text-xs text-gray-500 font-semibold select-none">
                      {currentBlock.enabled ? 'Section Visible' : 'Section Hidden'}
                    </span>
                    <button
                      onClick={handleSectionToggle}
                      className={`admin-toggle ${currentBlock.enabled ? 'active' : ''}`}
                      title={currentBlock.enabled ? 'Hide Section' : 'Show Section'}
                    />
                    {currentBlock.enabled ? (
                      <Eye size={15} className="text-[#4A7C59]" />
                    ) : (
                      <EyeOff size={15} className="text-[#aaa]" />
                    )}
                  </div>
                </div>

                {/* Form Inputs (Show for non-carousel sections) */}
                {!isCarouselSection && (
                  <div className="space-y-4">
                    {hasTitle && (
                      <div>
                        <label className="admin-label">Section Title</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={sectionTitle}
                          onChange={handleSectionFieldChange(setSectionTitle)}
                          placeholder="e.g. Royal Wedding Video Invite..."
                        />
                      </div>
                    )}

                    {hasSubtitle && (
                      <div>
                        <label className="admin-label">Subtitle / Short description</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={sectionSubtitle}
                          onChange={handleSectionFieldChange(setSectionSubtitle)}
                          placeholder="e.g. Stunning animations that tell your love story..."
                        />
                      </div>
                    )}

                    {hasBody && (
                      <div>
                        <label className="admin-label">Body Content / Details</label>
                        <textarea
                          className="admin-textarea"
                          value={sectionBody}
                          onChange={handleSectionFieldChange(setSectionBody)}
                          placeholder="Enter full body text..."
                          rows={6}
                        />
                      </div>
                    )}

                    {/* Image / Design Upload Row */}
                    {hasImage && (
                      <div>
                        <label className="admin-label">Section Design Image / Preview</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Preview */}
                          <div className="border border-[#e5e5e5] rounded-2xl bg-[#faf8f5] p-3 flex items-center justify-center min-h-[160px] relative overflow-hidden">
                            {sectionImageUrl ? (
                              <>
                                <img src={sectionImageUrl} alt="Design Preview" className="max-h-[140px] rounded-lg object-contain" />
                                <button
                                  type="button"
                                  onClick={() => { setSectionImageUrl(''); setSectionDirty(true); }}
                                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
                                >
                                  <X size={13} />
                                </button>
                              </>
                            ) : (
                              <div className="text-center text-gray-400 space-y-1 select-none">
                                <ImageIcon size={26} className="mx-auto text-gray-300" />
                                <p className="text-xs">No design image selected</p>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="admin-btn admin-btn-outline flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Upload size={14} /> Upload New Design
                            </button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleSectionImageUpload}
                            />
                            <button
                              type="button"
                              onClick={() => { setPickerTarget('section'); setShowMediaPicker(true); }}
                              className="admin-btn admin-btn-outline flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <ImageIcon size={14} /> Pick from Media Library
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Call-to-Action (CTA) Config */}
                    {hasCta && (
                      <div className="bg-[#faf8f5] rounded-2xl p-5 border border-[#e5e5e5]/50 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#1a1410]">Enable Action (CTA) Button</span>
                          <button
                            onClick={() => { setShowCtaToggle(!showCtaToggle); setSectionDirty(true); }}
                            className={`admin-toggle ${showCtaToggle ? 'active' : ''}`}
                          />
                        </div>

                        {showCtaToggle && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            <div>
                              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Button Text</label>
                              <input
                                type="text"
                                className="admin-input bg-white"
                                value={sectionCtaText}
                                onChange={handleSectionFieldChange(setSectionCtaText)}
                                placeholder="e.g. Explore Designs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Link Redirect Path</label>
                              <input
                                type="text"
                                className="admin-input bg-white"
                                value={sectionCtaLink}
                                onChange={handleSectionFieldChange(setSectionCtaLink)}
                                placeholder="e.g. /explore"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Section Image Gallery */}
                    {['Explore Designs', 'Video Invites', 'Event Websites', 'Stationery', 'Printed Luxury Invites'].includes(selectedSection) && (
                      <div className="bg-[#faf8f5] rounded-2xl p-5 border border-[#e5e5e5]/50 space-y-4">
                        <div>
                          <label className="admin-label !mb-1 text-sm font-semibold text-[#1a1410]">Section Image Gallery (Carousel Slides)</label>
                          <p className="text-xs text-gray-400">Manage multiple images displayed as an interactive carousel in this section on the homepage.</p>
                        </div>
                        
                        {/* Thumbnail Grid */}
                        {sectionImages.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {sectionImages.map((url, imgIdx) => (
                              <div key={imgIdx} className="relative aspect-square border border-[#e5e5e5] rounded-xl overflow-hidden bg-white group shadow-sm">
                                <img src={url} alt={`Slide ${imgIdx + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSectionImages(sectionImages.filter((_, idx) => idx !== imgIdx));
                                    setSectionDirty(true);
                                  }}
                                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                                  title="Remove image"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 border border-dashed border-[#e5e5e5] rounded-2xl bg-white text-gray-400">
                            <ImageIcon size={24} className="mx-auto mb-1 text-gray-300" />
                            <p className="text-xs">No images in gallery yet</p>
                          </div>
                        )}
                        
                        {/* Add Buttons */}
                        <div className="flex flex-wrap gap-2.5">
                          <button
                            type="button"
                            onClick={() => galleryFileInputRef.current?.click()}
                            className="admin-btn admin-btn-outline admin-btn-sm flex items-center gap-1.5 cursor-pointer text-xs font-semibold px-3 py-1.5"
                          >
                            <Upload size={13} /> Upload Image File
                          </button>
                          <input
                            ref={galleryFileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleGalleryImageUpload}
                          />
                          <button
                            type="button"
                            onClick={() => { setPickerTarget('gallery'); setShowMediaPicker(true); }}
                            className="admin-btn admin-btn-outline admin-btn-sm flex items-center gap-1.5 cursor-pointer text-xs font-semibold px-3 py-1.5"
                          >
                            <ImageIcon size={13} /> Pick from Media Library
                          </button>
                        </div>
                      </div>
                    )}

                    {/* About Custom Sections */}
                    {selectedSection === 'About' && (
                      <div className="space-y-6 border-t border-[#f0f0f0] pt-6">
                        <h3 className="text-sm font-bold text-[#8B4949] uppercase tracking-wider">About Page Subsections</h3>
                        
                        {/* Milestones Editor */}
                        <div className="bg-[#faf8f5] rounded-2xl p-5 border border-[#e5e5e5]/50 space-y-4">
                          <h4 className="font-semibold text-xs text-gray-700">Milestones (Our Journey So Far)</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {aboutMilestones.map((milestone, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-xl border border-[#e5e5e5] space-y-2.5 shadow-sm">
                                <p className="text-[10px] uppercase font-bold text-gray-400">Milestone {idx + 1}</p>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[10px] font-semibold text-gray-500">Value (e.g. 2000+)</label>
                                    <input
                                      type="text"
                                      className="admin-input bg-white text-xs px-2.5 py-1.5"
                                      value={milestone.number}
                                      onChange={(e) => {
                                        const updated = [...aboutMilestones];
                                        updated[idx].number = e.target.value;
                                        setAboutMilestones(updated);
                                        setSectionDirty(true);
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-semibold text-gray-500">Label (e.g. Happy Clients)</label>
                                    <input
                                      type="text"
                                      className="admin-input bg-white text-xs px-2.5 py-1.5"
                                      value={milestone.label}
                                      onChange={(e) => {
                                        const updated = [...aboutMilestones];
                                        updated[idx].label = e.target.value;
                                        setAboutMilestones(updated);
                                        setSectionDirty(true);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-gray-500">Icon Name</label>
                                  <select
                                    className="admin-input bg-white text-xs px-2.5 py-1.5"
                                    value={milestone.iconName}
                                    onChange={(e) => {
                                      const updated = [...aboutMilestones];
                                      updated[idx].iconName = e.target.value;
                                      setAboutMilestones(updated);
                                      setSectionDirty(true);
                                    }}
                                  >
                                    <option value="Users">Users</option>
                                    <option value="PenTool">Pen Tool</option>
                                    <option value="Star">Star</option>
                                    <option value="Clock">Clock</option>
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Values Editor */}
                        <div className="bg-[#faf8f5] rounded-2xl p-5 border border-[#e5e5e5]/50 space-y-4">
                          <h4 className="font-semibold text-xs text-gray-700">What Drives Us (Values)</h4>
                          <div className="space-y-4">
                            {aboutValues.map((val, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-xl border border-[#e5e5e5] space-y-3 shadow-sm">
                                <p className="text-[10px] uppercase font-bold text-gray-400">Value Card {idx + 1}</p>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                  <div className="md:col-span-2">
                                    <label className="text-[10px] font-semibold text-gray-500">Icon / Emoji</label>
                                    <input
                                      type="text"
                                      className="admin-input bg-white text-xs"
                                      value={val.icon}
                                      onChange={(e) => {
                                        const updated = [...aboutValues];
                                        updated[idx].icon = e.target.value;
                                        setAboutValues(updated);
                                        setSectionDirty(true);
                                      }}
                                    />
                                  </div>
                                  <div className="md:col-span-10">
                                    <label className="text-[10px] font-semibold text-gray-500">Title</label>
                                    <input
                                      type="text"
                                      className="admin-input bg-white text-xs"
                                      value={val.title}
                                      onChange={(e) => {
                                        const updated = [...aboutValues];
                                        updated[idx].title = e.target.value;
                                        setAboutValues(updated);
                                        setSectionDirty(true);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-gray-500">Description</label>
                                  <textarea
                                    className="admin-textarea bg-white text-xs p-2.5"
                                    rows={2}
                                    value={val.desc}
                                    onChange={(e) => {
                                      const updated = [...aboutValues];
                                      updated[idx].desc = e.target.value;
                                      setAboutValues(updated);
                                      setSectionDirty(true);
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Story Points Editor */}
                        <div className="bg-[#faf8f5] rounded-2xl p-5 border border-[#e5e5e5]/50 space-y-4">
                          <h4 className="font-semibold text-xs text-gray-700">Story Points (Born from a Passion)</h4>
                          <div className="space-y-4">
                            {aboutStoryPoints.map((point, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-xl border border-[#e5e5e5] space-y-3 shadow-sm">
                                <p className="text-[10px] uppercase font-bold text-gray-400">Story Point {idx + 1}</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <label className="text-[10px] font-semibold text-gray-500">Title</label>
                                    <input
                                      type="text"
                                      className="admin-input bg-white text-xs"
                                      value={point.title}
                                      onChange={(e) => {
                                        const updated = [...aboutStoryPoints];
                                        updated[idx].title = e.target.value;
                                        setAboutStoryPoints(updated);
                                        setSectionDirty(true);
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-semibold text-gray-500">Icon Name</label>
                                    <select
                                      className="admin-input bg-white text-xs"
                                      value={point.iconName}
                                      onChange={(e) => {
                                        const updated = [...aboutStoryPoints];
                                        updated[idx].iconName = e.target.value;
                                        setAboutStoryPoints(updated);
                                        setSectionDirty(true);
                                      }}
                                    >
                                      <option value="Flame">Flame</option>
                                      <option value="Globe">Globe</option>
                                      <option value="Layers">Layers</option>
                                      <option value="TrendingUp">Trending Up</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-semibold text-gray-500">Color (Hex/CSS)</label>
                                    <input
                                      type="text"
                                      className="admin-input bg-white text-xs"
                                      value={point.color}
                                      onChange={(e) => {
                                        const updated = [...aboutStoryPoints];
                                        updated[idx].color = e.target.value;
                                        setAboutStoryPoints(updated);
                                        setSectionDirty(true);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-gray-500">Body Text</label>
                                  <textarea
                                    className="admin-textarea bg-white text-xs p-2.5"
                                    rows={2}
                                    value={point.text}
                                    onChange={(e) => {
                                      const updated = [...aboutStoryPoints];
                                      updated[idx].text = e.target.value;
                                      setAboutStoryPoints(updated);
                                      setSectionDirty(true);
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Founder Editor */}
                        <div className="bg-[#faf8f5] rounded-2xl p-5 border border-[#e5e5e5]/50 space-y-4">
                          <h4 className="font-semibold text-xs text-gray-700">Founder Details</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="admin-label text-xs">Founder Name</label>
                              <input
                                type="text"
                                className="admin-input bg-white"
                                value={founderName}
                                onChange={(e) => { setFounderName(e.target.value); setSectionDirty(true); }}
                              />
                            </div>
                            <div>
                              <label className="admin-label text-xs">Role Title</label>
                              <input
                                type="text"
                                className="admin-input bg-white"
                                value={founderRole}
                                onChange={(e) => { setFounderRole(e.target.value); setSectionDirty(true); }}
                              />
                            </div>
                            <div>
                              <label className="admin-label text-xs">Education/Alumni Info</label>
                              <input
                                type="text"
                                className="admin-input bg-white"
                                value={founderEducation}
                                onChange={(e) => { setFounderEducation(e.target.value); setSectionDirty(true); }}
                              />
                            </div>
                            <div>
                              <label className="admin-label text-xs">Founder Photo URL</label>
                              <input
                                type="text"
                                className="admin-input bg-white"
                                value={founderImage}
                                onChange={(e) => { setFounderImage(e.target.value); setSectionDirty(true); }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="admin-label text-xs">Founder Bio/Quote</label>
                            <textarea
                              className="admin-textarea bg-white"
                              rows={3}
                              value={founderBio}
                              onChange={(e) => { setFounderBio(e.target.value); setSectionDirty(true); }}
                            />
                          </div>
                        </div>

                        {/* Team Editor */}
                        <div className="bg-[#faf8f5] rounded-2xl p-5 border border-[#e5e5e5]/50 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-xs text-gray-700">Leadership Team Members</h4>
                            <button
                              type="button"
                              onClick={() => {
                                setAboutTeam([...aboutTeam, { name: '', role: '', education: '', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' }]);
                                setSectionDirty(true);
                              }}
                              className="admin-btn admin-btn-outline admin-btn-sm text-xs font-semibold px-3 py-1 flex items-center gap-1 cursor-pointer bg-transparent"
                            >
                              <Plus size={12} /> Add Member
                            </button>
                          </div>

                          <div className="space-y-4">
                            {aboutTeam.map((member, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-xl border border-[#e5e5e5] space-y-3 relative shadow-sm">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAboutTeam(aboutTeam.filter((_, i) => i !== idx));
                                    setSectionDirty(true);
                                  }}
                                  className="absolute top-2 right-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors border-none cursor-pointer"
                                  title="Remove Team Member"
                                >
                                  <Trash2 size={12} />
                                </button>
                                <p className="text-[10px] uppercase font-bold text-gray-400">Team Member {idx + 1}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[10px] font-semibold text-gray-500">Name</label>
                                    <input
                                      type="text"
                                      className="admin-input bg-white text-xs"
                                      value={member.name}
                                      onChange={(e) => {
                                        const updated = [...aboutTeam];
                                        updated[idx].name = e.target.value;
                                        setAboutTeam(updated);
                                        setSectionDirty(true);
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-semibold text-gray-500">Role</label>
                                    <input
                                      type="text"
                                      className="admin-input bg-white text-xs"
                                      value={member.role}
                                      onChange={(e) => {
                                        const updated = [...aboutTeam];
                                        updated[idx].role = e.target.value;
                                        setAboutTeam(updated);
                                        setSectionDirty(true);
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-semibold text-gray-500">Education/College</label>
                                    <input
                                      type="text"
                                      className="admin-input bg-white text-xs"
                                      value={member.education}
                                      onChange={(e) => {
                                        const updated = [...aboutTeam];
                                        updated[idx].education = e.target.value;
                                        setAboutTeam(updated);
                                        setSectionDirty(true);
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-semibold text-gray-500">Photo URL</label>
                                    <input
                                      type="text"
                                      className="admin-input bg-white text-xs"
                                      value={member.image}
                                      onChange={(e) => {
                                        const updated = [...aboutTeam];
                                        updated[idx].image = e.target.value;
                                        setAboutTeam(updated);
                                        setSectionDirty(true);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contact Custom Sections */}
                    {selectedSection === 'Contact' && (
                      <div className="space-y-6 border-t border-[#f0f0f0] pt-6">
                        <h3 className="text-sm font-bold text-[#8B4949] uppercase tracking-wider">Contact Page Subsections</h3>

                        {/* Contact Cards Editor */}
                        <div className="bg-[#faf8f5] rounded-2xl p-5 border border-[#e5e5e5]/50 space-y-4">
                          <h4 className="font-semibold text-xs text-gray-700">Contact Information Cards</h4>
                          <div className="space-y-4">
                            {contactDetails.map((detail, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-xl border border-[#e5e5e5] space-y-3 shadow-sm">
                                <p className="text-[10px] uppercase font-bold text-gray-400">{detail.type.toUpperCase()} Card</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[10px] font-semibold text-gray-500">Title</label>
                                    <input
                                      type="text"
                                      className="admin-input bg-white text-xs"
                                      value={detail.title}
                                      onChange={(e) => {
                                        const updated = [...contactDetails];
                                        updated[idx].title = e.target.value;
                                        setContactDetails(updated);
                                        setSectionDirty(true);
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-semibold text-gray-500">Subtitle / Detail description</label>
                                    <input
                                      type="text"
                                      className="admin-input bg-white text-xs"
                                      value={detail.subtitle}
                                      onChange={(e) => {
                                        const updated = [...contactDetails];
                                        updated[idx].subtitle = e.target.value;
                                        setContactDetails(updated);
                                        setSectionDirty(true);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-gray-500">Value (e.g. Phone number, Email, Address)</label>
                                  <input
                                    type="text"
                                    className="admin-input bg-white text-xs"
                                    value={detail.value}
                                    onChange={(e) => {
                                      const updated = [...contactDetails];
                                      updated[idx].value = e.target.value;
                                      setContactDetails(updated);
                                      setSectionDirty(true);
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* FAQs Editor */}
                        <div className="bg-[#faf8f5] rounded-2xl p-5 border border-[#e5e5e5]/50 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-xs text-gray-700">Contact Page FAQs Accordion</h4>
                            <button
                              type="button"
                              onClick={() => {
                                setContactFaqs([...contactFaqs, { q: '', a: '' }]);
                                setSectionDirty(true);
                              }}
                              className="admin-btn admin-btn-outline admin-btn-sm text-xs font-semibold px-3 py-1 flex items-center gap-1 cursor-pointer bg-transparent"
                            >
                              <Plus size={12} /> Add FAQ
                            </button>
                          </div>

                          <div className="space-y-4">
                            {contactFaqs.map((faq, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-xl border border-[#e5e5e5] space-y-3 relative shadow-sm">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setContactFaqs(contactFaqs.filter((_, i) => i !== idx));
                                    setSectionDirty(true);
                                  }}
                                  className="absolute top-2 right-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors border-none cursor-pointer"
                                  title="Remove FAQ"
                                >
                                  <Trash2 size={12} />
                                </button>
                                <p className="text-[10px] uppercase font-bold text-gray-400">FAQ Question {idx + 1}</p>
                                <div>
                                  <label className="text-[10px] font-semibold text-gray-500">Question</label>
                                  <input
                                    type="text"
                                    className="admin-input bg-white text-xs font-semibold"
                                    value={faq.q}
                                    onChange={(e) => {
                                      const updated = [...contactFaqs];
                                      updated[idx].q = e.target.value;
                                      setContactFaqs(updated);
                                      setSectionDirty(true);
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-gray-500">Answer</label>
                                  <textarea
                                    className="admin-textarea bg-white text-xs p-2.5"
                                    rows={3}
                                    value={faq.a}
                                    onChange={(e) => {
                                      const updated = [...contactFaqs];
                                      updated[idx].a = e.target.value;
                                      setContactFaqs(updated);
                                      setSectionDirty(true);
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTA Info Editor */}
                        <div className="bg-[#faf8f5] rounded-2xl p-5 border border-[#e5e5e5]/50 space-y-4">
                          <h4 className="font-semibold text-xs text-gray-700">Bottom CTA Box Details ("Let's Talk Directly")</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="admin-label text-xs">CTA Main Title</label>
                              <input
                                type="text"
                                className="admin-input bg-white"
                                value={contactCtaInfo.title}
                                onChange={(e) => {
                                  setContactCtaInfo({ ...contactCtaInfo, title: e.target.value });
                                  setSectionDirty(true);
                                }}
                              />
                            </div>
                            <div>
                              <label className="admin-label text-xs">CTA Highlighted Subtitle</label>
                              <input
                                type="text"
                                className="admin-input bg-white"
                                value={contactCtaInfo.subtitle}
                                onChange={(e) => {
                                  setContactCtaInfo({ ...contactCtaInfo, subtitle: e.target.value });
                                  setSectionDirty(true);
                                }}
                              />
                            </div>
                            <div>
                              <label className="admin-label text-xs">WhatsApp Query Message</label>
                              <input
                                type="text"
                                className="admin-input bg-white"
                                value={contactCtaInfo.whatsappText}
                                onChange={(e) => {
                                  setContactCtaInfo({ ...contactCtaInfo, whatsappText: e.target.value });
                                  setSectionDirty(true);
                                }}
                                placeholder="e.g. Hi! I have a question about..."
                              />
                            </div>
                          </div>
                          <div>
                            <label className="admin-label text-xs">CTA Paragraph Detail</label>
                            <textarea
                              className="admin-textarea bg-white"
                              rows={3}
                              value={contactCtaInfo.detail}
                              onChange={(e) => {
                                setContactCtaInfo({ ...contactCtaInfo, detail: e.target.value });
                                setSectionDirty(true);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer Save Operations */}
                    <div className="border-t border-[#f0f0f0] pt-5 flex items-center gap-3">
                      <button
                        onClick={handleSectionSave}
                        disabled={!sectionDirty}
                        className="admin-btn admin-btn-primary flex items-center gap-2 shadow-sm"
                        style={{ opacity: sectionDirty ? 1 : 0.5, cursor: sectionDirty ? 'pointer' : 'not-allowed' }}
                      >
                        <Save size={15} /> Save Section Headers
                      </button>
                      {currentBlock.lastUpdated && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={12} /> Last updated: {currentBlock.lastUpdated}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Embedded Specific Item Managers */}
                {isCarouselSection && (
                  <div className="pt-2">
                    <h3 className="text-base font-bold text-[#1a1410] mb-4">Manage Carousel Slides</h3>
                    <HeroSlidesManager sectionId={selectedSection} />
                  </div>
                )}

                {selectedSection === 'Packages' && (
                  <div className="border-t border-[#f0f0f0] pt-6">
                    <h3 className="text-base font-bold text-[#1a1410] mb-4">Manage Package Cards</h3>
                    <PackagesManager />
                  </div>
                )}

                {selectedSection === 'FAQ' && (
                  <div className="border-t border-[#f0f0f0] pt-6">
                    <h3 className="text-base font-bold text-[#1a1410] mb-4">Manage FAQ Questions</h3>
                    <FAQsManager />
                  </div>
                )}

                {selectedSection === 'Browse by Occasion' && (
                  <div className="border-t border-[#f0f0f0] pt-6">
                    <h3 className="text-base font-bold text-[#1a1410] mb-4">Manage Occasions / Categories</h3>
                    <CategoriesManager />
                  </div>
                )}

                {selectedSection === 'Our Services' && (
                  <div className="border-t border-[#f0f0f0] pt-6">
                    <h3 className="text-base font-bold text-[#1a1410] mb-4">Manage Services Cards</h3>
                    <ServicesManager />
                  </div>
                )}

                {selectedSection === 'Testimonials' && (
                  <div className="border-t border-[#f0f0f0] pt-6">
                    <h3 className="text-base font-bold text-[#1a1410] mb-4">Manage Client Testimonials</h3>
                    <TestimonialsManager />
                  </div>
                )}
              </>
            ) : (
              <div className="admin-empty">
                <p>Select a section on the left sidebar to start editing.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ── TAB 2: BLOG ARTICLES ─────────────────────────────────── */}
      {activeTab === 'blog' && (
        <>
          {/* Dashboard List View */}
          {!isEditingPost ? (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-4 bg-white border border-[#e5e5e5] px-5 py-4 rounded-2xl shadow-sm">
                <div>
                  <h3 className="font-bold text-sm text-[#1a1410]">Published Blog Articles</h3>
                  <p className="text-xs text-gray-400 mt-0.5">List of articles displaying on your public website</p>
                </div>
                <button
                  onClick={() => handleOpenBlogEditor(null)}
                  className="admin-btn admin-btn-primary flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={15} /> Write New Article
                </button>
              </div>

              {/* Grid */}
              {state.blogPosts.length === 0 ? (
                <div className="admin-empty card bg-white border border-[#e5e5e5]">
                  <FileText size={36} className="text-gray-300 mx-auto" />
                  <p className="mt-2 font-medium">No blog posts found</p>
                  <button onClick={() => handleOpenBlogEditor(null)} className="admin-btn admin-btn-primary admin-btn-sm mt-3">
                    Write First Post
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {state.blogPosts.map((post) => (
                    <div key={post.id} className="bg-white border border-[#e5e5e5] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                      <div className="aspect-[16/10] bg-gray-100 relative">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-[#8B4949] uppercase tracking-wider shadow-sm">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold mb-2">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h4 className="font-bold text-[#1a1410] text-sm leading-snug mb-2 line-clamp-2">{post.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-3 mb-5 leading-relaxed">{post.description || post.subtitle}</p>

                        <div className="flex items-center justify-between border-t border-[#f0f0f0] pt-4 mt-auto">
                          <button
                            onClick={() => handleOpenBlogEditor(post)}
                            className="text-xs font-bold text-[#8B4949] hover:bg-[#8B4949]/5 px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Edit3 size={13} /> Edit Article
                          </button>
                          <button
                            onClick={() => setBlogDeleteTarget(post.id)}
                            className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete Post"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Composer / Editor Form View */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Form Panel */}
              <div className="lg:col-span-8 bg-white border border-[#e5e5e5] rounded-3xl p-7 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
                  <h3 className="font-bold text-[#1a1410] text-base">
                    {selectedPostId ? 'Edit Blog Article' : 'Write New Blog Article'}
                  </h3>
                  <button
                    onClick={() => setIsEditingPost(false)}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="admin-label">Article Title *</label>
                    <input
                      type="text"
                      className="admin-input font-bold"
                      value={blogTitle}
                      onChange={(e) => { setBlogTitle(e.target.value); setBlogDirty(true); }}
                      placeholder="e.g. 10 Best Motifs for Wedding Cards..."
                    />
                  </div>

                  <div>
                    <label className="admin-label">Subtitle / Key Summary</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={blogSubtitle}
                      onChange={(e) => { setBlogSubtitle(e.target.value); setBlogDirty(true); }}
                      placeholder="e.g. A deep dive into traditional design themes..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="admin-label">Category</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={blogCategory}
                        onChange={(e) => { setBlogCategory(e.target.value); setBlogDirty(true); }}
                        placeholder="e.g. Planning Tips"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Read Time</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={blogReadTime}
                        onChange={(e) => { setBlogReadTime(e.target.value); setBlogDirty(true); }}
                        placeholder="e.g. 5 min read"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Short Description (for Home Feed)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={blogDescription}
                        onChange={(e) => { setBlogDescription(e.target.value); setBlogDirty(true); }}
                        placeholder="Short card teaser description..."
                      />
                    </div>
                  </div>

                  {/* Dynamic Content Builder */}
                  <div className="border-t border-[#f0f0f0] pt-6 space-y-4">
                    <div>
                      <h4 className="font-bold text-[#1a1410] text-sm">Article Contents / Story Layout</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Build your blog body layout block-by-block</p>
                    </div>

                    <div className="space-y-3">
                      {blogContent.map((block, idx) => (
                        <div
                          key={idx}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, idx)}
                          onDragOver={(e) => handleDragOver(e, idx)}
                          onDrop={(e) => handleDrop(e, idx)}
                          className={`bg-[#faf8f5] border border-[#e5e5e5] rounded-2xl p-4 space-y-3 relative group transition-all duration-200 ${
                            draggedIndex === idx ? 'opacity-40 border-dashed border-[#8B4949] bg-white' : ''
                          }`}
                        >
                          {/* Block Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {/* Drag Handle */}
                              <div
                                className="text-gray-400 cursor-grab active:cursor-grabbing hover:text-[#8B4949] p-1 rounded hover:bg-white border border-transparent hover:border-gray-100"
                                title="Drag to reorder"
                              >
                                <GripVertical size={13} />
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-2.5 py-1 rounded-full border border-[#e5e5e5]/50">
                                Block {idx + 1}: {block.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                              {/* Reorder up */}
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveContentBlock(idx, 'up')}
                                className="w-7 h-7 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 flex items-center justify-center text-gray-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ArrowUp size={13} />
                              </button>
                              {/* Reorder down */}
                              <button
                                type="button"
                                disabled={idx === blogContent.length - 1}
                                onClick={() => handleMoveContentBlock(idx, 'down')}
                                className="w-7 h-7 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 flex items-center justify-center text-gray-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ArrowDown size={13} />
                              </button>
                              {/* Remove */}
                              <button
                                type="button"
                                onClick={() => handleRemoveContentBlock(idx)}
                                className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500 cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Block Input */}
                          {block.type === 'paragraph' ? (
                            <textarea
                              className="admin-textarea bg-white"
                              rows={3}
                              value={block.text}
                              onChange={(e) => handleUpdateContentBlockText(idx, e.target.value)}
                              placeholder="Write paragraph content here..."
                            />
                          ) : block.type === 'heading' ? (
                            <input
                              type="text"
                              className="admin-input bg-white font-semibold"
                              value={block.text}
                              onChange={(e) => handleUpdateContentBlockText(idx, e.target.value)}
                              placeholder="Enter subheading..."
                            />
                          ) : block.type === 'quote' ? (
                            <textarea
                              className="admin-textarea bg-white italic font-medium border-l-4 border-[#D4AF37]"
                              rows={2}
                              value={block.text}
                              onChange={(e) => handleUpdateContentBlockText(idx, e.target.value)}
                              placeholder="Enter quote text..."
                            />
                          ) : (
                            /* Image Block */
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="border border-[#e5e5e5] rounded-xl bg-white p-2 flex items-center justify-center min-h-[120px] relative overflow-hidden">
                                {block.text ? (
                                  <>
                                    <img src={block.text} alt="Blog Photo" className="max-h-[100px] rounded object-contain" />
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateContentBlockText(idx, '')}
                                      className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
                                    >
                                      <X size={12} />
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-xs text-gray-400">No photo selected</span>
                                )}
                              </div>
                              <div className="flex flex-col justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*';
                                    input.onchange = (e) => {
                                      const file = (e.target as HTMLInputElement).files?.[0];
                                      if (file) {
                                        const url = URL.createObjectURL(file);
                                        handleUpdateContentBlockText(idx, url);
                                      }
                                    };
                                    input.click();
                                  }}
                                  className="admin-btn admin-btn-outline admin-btn-sm flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <Upload size={12} /> Upload Photo
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setBlogImageBlockIndex(idx);
                                    setShowBlogImagePicker(true);
                                  }}
                                  className="admin-btn admin-btn-outline admin-btn-sm flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <ImageIcon size={12} /> Choose from Media
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Optional Block Image for text sections */}
                          {block.type !== 'image' && (
                            <div className="mt-2.5 border-t border-[#f0f0f0] pt-2.5 flex items-center gap-3">
                              {block.image ? (
                                <div className="flex items-center gap-2.5 bg-white p-1.5 border border-[#e5e5e5] rounded-xl relative group/img shadow-sm">
                                  <img src={block.image} alt="Section Attachment" className="h-8 w-12 object-cover rounded-lg" />
                                  <span className="text-[10px] text-gray-400 pr-6">Photo attached</span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateContentBlockImage(idx, undefined)}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-50 hover:bg-red-100 text-red-500 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                                    title="Remove Photo"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const input = document.createElement('input');
                                      input.type = 'file';
                                      input.accept = 'image/*';
                                      input.onchange = (e) => {
                                        const file = (e.target as HTMLInputElement).files?.[0];
                                        if (file) {
                                          const url = URL.createObjectURL(file);
                                          handleUpdateContentBlockImage(idx, url);
                                        }
                                      };
                                      input.click();
                                    }}
                                    className="text-[11px] text-gray-500 hover:text-[#8B4949] font-medium flex items-center gap-1 bg-white hover:bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Upload size={10} /> + Add Photo
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setBlogImageBlockIndex(idx);
                                      setShowBlogImagePicker(true);
                                    }}
                                    className="text-[11px] text-gray-500 hover:text-[#8B4949] font-medium flex items-center gap-1 bg-white hover:bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <ImageIcon size={10} /> Choose Media
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add block tools */}
                    <div className="flex gap-2.5 flex-wrap pt-2">
                      <button
                        type="button"
                        onClick={() => handleAddContentBlock('paragraph')}
                        className="admin-btn admin-btn-outline admin-btn-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} /> Add Paragraph
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddContentBlock('heading')}
                        className="admin-btn admin-btn-outline admin-btn-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} /> Add Subheading
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddContentBlock('quote')}
                        className="admin-btn admin-btn-outline admin-btn-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} /> Add Quote
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddContentBlock('image')}
                        className="admin-btn admin-btn-outline admin-btn-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} /> Add Photo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Operations */}
                <div className="border-t border-[#f0f0f0] pt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveBlogPost}
                      className="admin-btn admin-btn-primary flex items-center gap-2 shadow-sm"
                    >
                      <Save size={15} /> Publish Post
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingPost(false)}
                      className="admin-btn admin-btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                  {selectedPostId !== null && (
                    <button
                      type="button"
                      onClick={() => setBlogDeleteTarget(selectedPostId)}
                      className="admin-btn admin-btn-danger flex items-center gap-1.5"
                    >
                      <Trash2 size={14} /> Delete Article
                    </button>
                  )}
                </div>
              </div>

              {/* Right Cover Image Panel */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-[#e5e5e5] rounded-3xl p-6 shadow-sm space-y-4">
                  <h4 className="font-bold text-[#1a1410] text-sm">Cover Image</h4>

                  <div className="border border-[#e5e5e5] rounded-2xl bg-[#faf8f5] p-3 flex items-center justify-center min-h-[180px] relative overflow-hidden">
                    {blogImage ? (
                      <>
                        <img src={blogImage} alt="Cover Preview" className="max-h-[160px] rounded-lg object-contain" />
                        <button
                          onClick={() => { setBlogImage(''); setBlogDirty(true); }}
                          className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
                        >
                          <X size={13} />
                        </button>
                      </>
                    ) : (
                      <div className="text-center text-gray-400 space-y-1 select-none">
                        <ImageIcon size={26} className="mx-auto text-gray-300" />
                        <p className="text-xs">No cover image selected</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => blogPostFileInputRef.current?.click()}
                      className="w-full admin-btn admin-btn-outline flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload size={14} /> Upload Cover Image
                    </button>
                    <input
                      ref={blogPostFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBlogImageUpload}
                    />
                    <button
                      type="button"
                      onClick={() => { setPickerTarget('blog'); setShowMediaPicker(true); }}
                      className="w-full admin-btn admin-btn-outline flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ImageIcon size={14} /> Choose from Media
                    </button>
                  </div>
                </div>

                {/* Cover Teaser Card Preview */}
                <div className="bg-[#faf8f5] border border-[#e5e5e5] rounded-3xl p-6 select-none">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Feed Teaser Preview</p>
                  <div className="bg-white border border-[#e5e5e5]/60 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                    <div className="aspect-[16/10] bg-gray-100 relative">
                      <img src={blogImage} alt="Teaser Preview" className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/95 rounded-full text-[9px] font-bold text-[#8B4949] uppercase shadow-sm">
                        {blogCategory || 'Category'}
                      </span>
                    </div>
                    <div className="p-4 space-y-1">
                      <p className="text-[9px] text-gray-400 font-semibold">{blogReadTime || '5 min read'}</p>
                      <h5 className="font-bold text-xs text-[#1a1410] line-clamp-1">{blogTitle || 'Article Title'}</h5>
                      <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{blogSubtitle || 'Teaser description...'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── MEDIA PICKER MODAL OVERLAY ────────────────────────────── */}
      {showMediaPicker && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] admin-animate-in"
            onClick={() => setShowMediaPicker(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-[250] overflow-hidden admin-animate-in border border-[#e5e5e5]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0]">
              <div>
                <h3 className="font-bold text-[#1a1410] text-base">Select Image Design</h3>
                <p className="text-xs text-gray-400 mt-0.5">Pick an image from the Media Library uploads</p>
              </div>
              <button
                onClick={() => setShowMediaPicker(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-6 max-h-[380px] overflow-y-auto admin-scrollbar">
              {imagesInMedia.length === 0 ? (
                <div className="text-center py-10 text-gray-400 space-y-1 select-none">
                  <ImageIcon size={32} className="mx-auto text-gray-300" />
                  <p className="text-sm font-semibold">No images in Media Library</p>
                  <p className="text-xs">Upload images in the Media Library tab of the System page first.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {imagesInMedia.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        if (pickerTarget === 'section') {
                          setSectionImageUrl(f.url);
                          setSectionDirty(true);
                        } else if (pickerTarget === 'gallery') {
                          setSectionImages(prev => [...prev, f.url]);
                          setSectionDirty(true);
                        } else {
                          setBlogImage(f.url);
                          setBlogDirty(true);
                        }
                        setShowMediaPicker(false);
                      }}
                      className="border border-[#e5e5e5] rounded-xl overflow-hidden aspect-square hover:border-[#8B4949] hover:scale-[1.03] transition-all relative group bg-gray-50 flex items-center justify-center cursor-pointer"
                    >
                      <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Check size={18} className="text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-[#faf8f5] border-t border-[#f0f0f0] text-right">
              <button onClick={() => setShowMediaPicker(false)} className="admin-btn admin-btn-outline admin-btn-sm">
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* Blog Image Block Media Picker */}
      {showBlogImagePicker && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] admin-animate-in"
            onClick={() => setShowBlogImagePicker(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-[250] overflow-hidden admin-animate-in border border-[#e5e5e5]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0]">
              <div>
                <h3 className="font-bold text-[#1a1410] text-base">Select Blog Photo</h3>
                <p className="text-xs text-gray-400 mt-0.5">Pick an image from the Media Library</p>
              </div>
              <button
                onClick={() => setShowBlogImagePicker(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-6 max-h-[380px] overflow-y-auto admin-scrollbar">
              {imagesInMedia.length === 0 ? (
                <div className="text-center py-10 text-gray-400 space-y-1 select-none">
                  <ImageIcon size={32} className="mx-auto text-gray-300" />
                  <p className="text-sm font-semibold">No images in Media Library</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {imagesInMedia.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        if (blogImageBlockIndex !== null) {
                          const block = blogContent[blogImageBlockIndex];
                          if (block && block.type !== 'image') {
                            handleUpdateContentBlockImage(blogImageBlockIndex, f.url);
                          } else {
                            handleUpdateContentBlockText(blogImageBlockIndex, f.url);
                          }
                        }
                        setShowBlogImagePicker(false);
                      }}
                      className="border border-[#e5e5e5] rounded-xl overflow-hidden aspect-square hover:border-[#8B4949] hover:scale-[1.03] transition-all relative group bg-gray-50 flex items-center justify-center cursor-pointer"
                    >
                      <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Check size={18} className="text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-[#faf8f5] border-t border-[#f0f0f0] text-right">
              <button onClick={() => setShowBlogImagePicker(false)} className="admin-btn admin-btn-outline admin-btn-sm">
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={blogDeleteTarget !== null}
        title="Delete Blog Article"
        message="This article will be permanently removed from the website feed. This action cannot be undone."
        confirmLabel="Delete Article"
        onConfirm={handleDeleteBlogPostConfirm}
        onCancel={() => setBlogDeleteTarget(null)}
        danger
      />
    </div>
  );
}
