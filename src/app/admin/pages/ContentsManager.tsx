import { useState, useEffect, useRef } from 'react';
import {
  Save, Eye, EyeOff, Clock, Plus, Trash2, ArrowUp, ArrowDown,
  Image as ImageIcon, Link as LinkIcon, FileText, Upload,
  Calendar, Edit3, X, ChevronRight, Check, GripVertical, Rocket, ExternalLink
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { ContentBlock, BlogPost, BlogPostContent, LaunchCampaign } from '../types';
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
  const {
    state,
    updateContentBlock,
    addContentBlock,
    deleteContentBlock,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addCampaign,
    updateCampaign,
    deleteCampaign
  } = useAdmin();

  // Tab State: 'sections' | 'blog' | 'campaigns'
  const [activeTab, setActiveTab] = useState<'sections' | 'blog' | 'campaigns'>('sections');

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
  const [layoutStyle, setLayoutStyle] = useState<string>('Split-Image-Right');
  const [sectionDirty, setSectionDirty] = useState(false);

  // Dynamic custom fields for section editor
  const [badgeText, setBadgeText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [features, setFeatures] = useState<{ title: string; desc: string }[]>([]);

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

  // Footer Page Sub-states
  const [footerBrandTagline, setFooterBrandTagline] = useState('');
  const [footerPhone, setFooterPhone] = useState('');
  const [footerEmail, setFooterEmail] = useState('');
  const [footerSocials, setFooterSocials] = useState<{ platform: string; url: string }[]>([]);

  // Create Custom Section Modal States
  const [showCustomSectionModal, setShowCustomSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionTemplate, setNewSectionTemplate] = useState<'text' | 'hero' | 'grid' | 'faq'>('text');

  // ── LAUNCH CAMPAIGNS STATE ──────────────────────────────────
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [campaignDeleteTarget, setCampaignDeleteTarget] = useState<string | null>(null);

  const [campTitle, setCampTitle] = useState('');
  const [campSlug, setCampSlug] = useState('');
  const [campProductName, setCampProductName] = useState('');
  const [campStatus, setCampStatus] = useState<'Draft' | 'Active' | 'Archived'>('Draft');
  const [campAccentColor, setCampAccentColor] = useState('#8B4949');
  const [campTheme, setCampTheme] = useState<'Royal' | 'Modern' | 'Minimalist' | 'Floral'>('Royal');
  const [campHeroTitle, setCampHeroTitle] = useState('');
  const [campHeroSubtitle, setCampHeroSubtitle] = useState('');
  const [campHeroImage, setCampHeroImage] = useState('');
  const [campVideoUrl, setCampVideoUrl] = useState('');
  const [campFeatures, setCampFeatures] = useState<{ title: string; desc: string }[]>([
    { title: '', desc: '' },
    { title: '', desc: '' },
    { title: '', desc: '' }
  ]);
  const [campGallery, setCampGallery] = useState<string[]>([]);
  const [campPackages, setCampPackages] = useState<{ name: string; price: number; features: string[] }[]>([]);
  const [campFaqs, setCampFaqs] = useState<{ q: string; a: string }[]>([]);
  const [campDirty, setCampDirty] = useState(false);

  // Media Library Picker Modal State
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'section' | 'blog' | 'gallery' | 'campHero' | 'campGallery'>('section');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const campHeroFileInputRef = useRef<HTMLInputElement>(null);
  const campGalleryFileInputRef = useRef<HTMLInputElement>(null);

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
      setLayoutStyle(currentBlock.layoutStyle ?? 'Split-Image-Right');

      // Populate Badge and Footer Text
      setBadgeText(currentBlock.badgeText ?? '');
      setFooterText(currentBlock.footerText ?? '');

      // Populate Features (ensure exactly 3 items are always initialized)
      const blockFeatures = currentBlock.features || [];
      const paddedFeatures = [...blockFeatures];
      while (paddedFeatures.length < 3) {
        paddedFeatures.push({ title: '', desc: '' });
      }
      setFeatures(paddedFeatures.slice(0, 3));

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

      // Populate Footer fields
      if (selectedSection === 'Footer') {
        setFooterBrandTagline(currentBlock.footerBrandTagline ?? '');
        setFooterPhone(currentBlock.footerContactInfo?.phone ?? '');
        setFooterEmail(currentBlock.footerContactInfo?.email ?? '');
        
        const defaultSocials = [
          { platform: 'instagram', url: 'https://instagram.com' },
          { platform: 'facebook', url: 'https://facebook.com' },
          { platform: 'youtube', url: 'https://youtube.com' },
          { platform: 'pinterest', url: 'https://pinterest.com' },
          { platform: 'linkedin', url: 'https://linkedin.com' },
          { platform: 'x', url: 'https://x.com' }
        ];
        const loadedSocials = currentBlock.footerSocialLinks ?? [];
        const socialsMap = new Map(loadedSocials.map(s => [s.platform, s.url]));
        const mergedSocials = defaultSocials.map(s => ({
          platform: s.platform,
          url: socialsMap.get(s.platform) ?? s.url
        }));
        setFooterSocials(mergedSocials);
      }
    } else {
      setSectionTitle('');
      setSectionSubtitle('');
      setSectionBody('');
      setSectionImageUrl('');
      setSectionCtaText('');
      setSectionCtaLink('');
      setShowCtaToggle(false);
      setSectionImages([]);
      setLayoutStyle('Split-Image-Right');
      setBadgeText('');
      setFooterText('');
      setFeatures([{ title: '', desc: '' }, { title: '', desc: '' }, { title: '', desc: '' }]);

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

      // Reset Footer fields
      setFooterBrandTagline('');
      setFooterPhone('');
      setFooterEmail('');
      setFooterSocials([]);
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
      layoutStyle: layoutStyle || undefined,
      badgeText: badgeText || undefined,
      footerText: footerText || undefined,
      features: features.filter(f => f.title.trim() !== ''),
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

    if (selectedSection === 'Footer') {
      updatedFields.footerBrandTagline = footerBrandTagline;
      updatedFields.footerContactInfo = { phone: footerPhone, email: footerEmail };
      updatedFields.footerSocialLinks = footerSocials;
    }

    if (isCustom && customType === 'faq') {
      updatedFields.contactFaqs = contactFaqs;
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

  // ── LAUNCH CAMPAIGNS ACTIONS ────────────────────────────────
  const handleOpenCampaignEditor = (camp: LaunchCampaign | null) => {
    if (camp) {
      setSelectedCampaignId(camp.id);
      setCampTitle(camp.title);
      setCampSlug(camp.slug);
      setCampProductName(camp.productName);
      setCampStatus(camp.status);
      setCampAccentColor(camp.accentColor);
      setCampTheme(camp.theme);
      setCampHeroTitle(camp.heroTitle);
      setCampHeroSubtitle(camp.heroSubtitle);
      setCampHeroImage(camp.heroImage);
      setCampVideoUrl(camp.videoUrl ?? '');
      
      const paddedFeatures = [...camp.features];
      while (paddedFeatures.length < 3) {
        paddedFeatures.push({ title: '', desc: '' });
      }
      setCampFeatures(paddedFeatures.slice(0, 3));
      setCampGallery(camp.gallery ?? []);
      setCampPackages(camp.pricingPackages ?? []);
      setCampFaqs(camp.faqs ?? []);
    } else {
      setSelectedCampaignId(null);
      setCampTitle('');
      setCampSlug('');
      setCampProductName('');
      setCampStatus('Draft');
      setCampAccentColor('#8B4949');
      setCampTheme('Royal');
      setCampHeroTitle('');
      setCampHeroSubtitle('');
      setCampHeroImage('');
      setCampVideoUrl('');
      setCampFeatures([
        { title: '', desc: '' },
        { title: '', desc: '' },
        { title: '', desc: '' }
      ]);
      setCampGallery([]);
      setCampPackages([
        { name: 'Standard Pack', price: 1999, features: ['1 Round of edits', 'MP4 Video Delivery'] },
        { name: 'Royal Suite', price: 4499, features: ['Unlimited edits', 'Cinematic HD MP4', 'WhatsApp welcome card'] }
      ]);
      setCampFaqs([
        { q: 'How do I receive the files?', a: 'We deliver all invitations as high-quality files via secure download link and WhatsApp.' }
      ]);
    }
    setIsEditingCampaign(true);
    setCampDirty(false);
  };

  const handleCampaignSave = () => {
    if (!campTitle.trim() || !campSlug.trim()) {
      alert('Please enter a campaign title and slug.');
      return;
    }

    const campaignData: LaunchCampaign = {
      id: selectedCampaignId ?? `camp-${Date.now()}`,
      slug: campSlug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-'),
      title: campTitle,
      productName: campProductName,
      status: campStatus,
      accentColor: campAccentColor,
      theme: campTheme,
      heroTitle: campHeroTitle,
      heroSubtitle: campHeroSubtitle,
      heroImage: campHeroImage,
      videoUrl: campVideoUrl || undefined,
      features: campFeatures.filter(f => f.title.trim() !== ''),
      gallery: campGallery,
      pricingPackages: campPackages,
      faqs: campFaqs
    };

    if (selectedCampaignId) {
      updateCampaign(selectedCampaignId, campaignData);
      alert('Launch campaign updated successfully!');
    } else {
      addCampaign(campaignData);
      alert('New launch campaign created successfully!');
    }
    setIsEditingCampaign(false);
    setCampDirty(false);
  };

  const handleDeleteCampaignConfirm = () => {
    if (campaignDeleteTarget !== null) {
      deleteCampaign(campaignDeleteTarget);
      setCampaignDeleteTarget(null);
      setIsEditingCampaign(false);
      alert('Launch campaign deleted successfully!');
    }
  };

  const handleCampHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCampHeroImage(url);
      setCampDirty(true);
    }
  };

  const handleCampGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        urls.push(URL.createObjectURL(files[i]));
      }
      setCampGallery(prev => [...prev, ...urls]);
      setCampDirty(true);
    }
  };

  const isCarouselSection = selectedSection === 'Hero';

  // Section fields filter logic
  const isCustom = !!currentBlock?.isCustomSection;
  const customType = currentBlock?.customTemplateType;

  const hasTitle = selectedSection !== 'Footer';
  const hasSubtitle = !['Footer', 'Terms', 'Privacy Policy', 'Refund Policy'].includes(selectedSection);
  const hasBody = isCustom 
    ? (customType === 'text') 
    : ['Footer', 'About', 'Terms', 'Privacy Policy', 'Refund Policy', 'Printed Luxury Invites'].includes(selectedSection);
  const hasImage = isCustom 
    ? (customType === 'hero') 
    : ['Video Invites', 'Event Websites', 'Stationery', 'About', 'Printed Luxury Invites'].includes(selectedSection);
  const hasCta = isCustom 
    ? (customType === 'hero') 
    : ['Explore Designs', 'Video Invites', 'Event Websites', 'Stationery', 'Printed Luxury Invites'].includes(selectedSection);

  const imagesInMedia = state.mediaFiles.filter(f => f.type === 'image');

  const handleCreateCustomSection = () => {
    if (!newSectionName.trim()) {
      alert('Please enter a section name.');
      return;
    }
    const cleanName = newSectionName.trim();
    const exists = state.contentBlocks.some(b => b.sectionName.toLowerCase() === cleanName.toLowerCase());
    if (exists) {
      alert('A section with this name already exists.');
      return;
    }

    const newBlock: ContentBlock = {
      id: `custom-cb-${Date.now()}`,
      sectionName: cleanName,
      enabled: true,
      lastUpdated: new Date().toLocaleDateString(),
      isCustomSection: true,
      customTemplateType: newSectionTemplate,
      title: `${cleanName} Title`,
      subtitle: `${cleanName} Subtitle or description`,
      body: newSectionTemplate === 'text' ? 'Enter paragraph body content here...' : undefined,
      features: newSectionTemplate === 'grid' ? [
        { title: 'Feature 1', desc: 'Feature 1 details...' },
        { title: 'Feature 2', desc: 'Feature 2 details...' },
        { title: 'Feature 3', desc: 'Feature 3 details...' }
      ] : undefined,
      contactFaqs: newSectionTemplate === 'faq' ? [
        { q: 'FAQ Question 1?', a: 'FAQ Answer details...' }
      ] : undefined
    };

    addContentBlock(newBlock);
    setSelectedSection(cleanName);
    setShowCustomSectionModal(false);
    setNewSectionName('');
    alert(`Custom section "${cleanName}" added successfully!`);
  };

  return (
    <div className="space-y-6 admin-animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1410]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Website Contents
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage section headers, images, blogs, and launch campaign builders</p>
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
            setIsEditingCampaign(false);
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
          onClick={() => {
            setActiveTab('blog');
            setIsEditingCampaign(false);
          }}
        >
          Blog Articles
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'campaigns'
              ? 'bg-[#8B4949] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#8B4949] hover:bg-[#f5f0e8]'
          }`}
          onClick={() => {
            setActiveTab('campaigns');
            setIsEditingPost(false);
          }}
        >
          Launch Campaigns
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
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: 'auto',
              minHeight: '560px'
            }}
            className="admin-scrollbar"
          >
            <div style={{ overflowY: 'auto', flexGrow: 1 }}>
              <div style={{ padding: '1.25rem 1rem 0.5rem', borderBottom: '1px solid #f0ebe2' }}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Sections List
                </p>
              </div>
              <ul style={{ padding: '0.5rem' }} className="space-y-0.5">
                {(() => {
                  const ordered = [...state.contentBlocks].sort((a, b) => {
                    const idxA = SECTION_NAMES.indexOf(a.sectionName as any);
                    const idxB = SECTION_NAMES.indexOf(b.sectionName as any);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return a.sectionName.localeCompare(b.sectionName);
                  });
                  return ordered.map((b) => {
                    const name = b.sectionName;
                    const isActive = selectedSection === name;
                    return (
                      <li key={b.id}>
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
                            style={{ background: b.enabled ? '#4A7C59' : '#aaa' }}
                          />
                        </button>
                      </li>
                    );
                  });
                })()}
              </ul>
            </div>

            <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid #f0ebe2', background: '#faf8f5' }}>
              <button
                type="button"
                onClick={() => setShowCustomSectionModal(true)}
                className="w-full flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-white border border-[#8B4949]/30 hover:border-[#8B4949] text-[#8B4949] hover:bg-[#8B4949]/5 text-xs font-semibold cursor-pointer transition-all shadow-sm"
              >
                <Plus size={12} /> Add Custom Section
              </button>
            </div>
          </aside>

          {/* Edit Panel */}
          <div className="flex-1 bg-white p-7 overflow-y-auto admin-scrollbar space-y-6">
            {currentBlock ? (
              <>
                {/* Panel Title & Visibility */}
                <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-[#1a1410] flex items-center gap-2">
                      {selectedSection} Settings
                      {sectionDirty && (
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" title="Unsaved changes" />
                      )}
                    </h2>
                    {currentBlock.isCustomSection && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete the custom section "${selectedSection}"?`)) {
                            deleteContentBlock(currentBlock.id);
                            setSelectedSection(SECTION_NAMES[0]);
                          }
                        }}
                        className="text-[10px] text-red-500 hover:text-white bg-red-50 hover:bg-red-600 px-2 py-1 rounded-lg border border-red-200 hover:border-red-600 cursor-pointer flex items-center gap-1 transition-all"
                        title="Delete Custom Section"
                      >
                        <Trash2 size={10} /> Delete Section
                      </button>
                    )}
                  </div>
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
                {/* ── LAYOUT & DESIGN PICKER (Show for general/custom sections) ── */}
                {!['Footer', 'Terms', 'Privacy Policy', 'Refund Policy'].includes(selectedSection) && (
                  <div className="bg-[#faf8f5] border border-[#f0ece4] rounded-2xl p-5 space-y-4 shadow-xs">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-[#1a1410]">Section Layout & Live Mockup Preview</h3>
                        <p className="text-[11px] text-gray-400">Choose how this section renders on the public site and preview it in real-time:</p>
                      </div>
                      
                      {/* Layout Picker buttons */}
                      {!['FAQ', 'Testimonials', 'Packages', 'Our Services', 'Browse by Occasion', 'Hero'].includes(selectedSection) && (
                        <div className="flex gap-1.5 bg-white border border-[#e5e5e5] rounded-xl p-1 shadow-sm">
                          {[
                            { value: 'Split-Image-Right', label: 'Split (Right Image)' },
                            { value: 'Split-Image-Left', label: 'Split (Left Image)' },
                            { value: 'Centered-Accent', label: 'Centered Text' },
                            { value: 'Minimalist-Banner', label: 'Minimal Banner' }
                          ].map(layout => (
                            <button
                              key={layout.value}
                              type="button"
                              onClick={() => { setLayoutStyle(layout.value); setSectionDirty(true); }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border-none ${
                                layoutStyle === layout.value
                                  ? 'bg-[#8B4949] text-white shadow-sm'
                                  : 'text-gray-500 hover:text-[#8B4949] hover:bg-[#f5f0e8]'
                              }`}
                            >
                              {layout.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* LIVE INTERACTIVE PREVIEW PANEL */}
                    <div className="border border-[#e5e5e5] rounded-2xl bg-white p-6 shadow-inner relative overflow-hidden min-h-[220px] flex flex-col justify-center">
                      <div className="absolute top-2 left-2 text-[9px] bg-gray-100 text-gray-400 font-extrabold uppercase tracking-widest px-2 py-0.5 rounded">
                        Live Preview (Mockup)
                      </div>

                      {/* Mock header decoration */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      </div>

                      {(() => {
                        // Renders based on section layout style
                        const hasCta = showCtaToggle && sectionCtaText;
                        const defaultImage = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600";
                        const previewImage = sectionImageUrl || defaultImage;

                        // Render specialized mockup if it's a built-in module
                        if (selectedSection === 'FAQ') {
                          return (
                            <div className="space-y-4 pt-4">
                              <div className="text-center max-w-md mx-auto">
                                <span className="text-[10px] font-bold text-[#8B4949] uppercase tracking-wider bg-[#8B4949]/5 px-2 py-0.5 rounded-full">FAQ Section</span>
                                <h3 className="text-base font-extrabold text-[#1a1410] mt-2">{sectionTitle || 'Frequently Asked Questions'}</h3>
                                <p className="text-[11px] text-gray-455 mt-1">{sectionSubtitle || 'Got questions? We have got answers.'}</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
                                {contactFaqs.slice(0, 4).map((f, i) => (
                                  <div key={i} className="p-3 bg-[#faf8f5] rounded-xl border border-[#f0ece4]">
                                    <h4 className="text-[11px] font-bold text-[#1a1410]">❓ {f.q || `Sample Question ${i+1}`}</h4>
                                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{f.a || 'Sample answer text goes here.'}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        if (selectedSection === 'Testimonials') {
                          return (
                            <div className="space-y-4 pt-4">
                              <div className="text-center max-w-md mx-auto">
                                <span className="text-[10px] font-bold text-[#8B4949] uppercase tracking-wider bg-[#8B4949]/5 px-2 py-0.5 rounded-full">Testimonials</span>
                                <h3 className="text-base font-extrabold text-[#1a1410] mt-2">{sectionTitle || 'What Clients Say'}</h3>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {[
                                  { name: 'Priya & Rahul', role: 'Wedding Invite Client', text: 'Absolutely spectacular video invite! Everyone loved it.' },
                                  { name: 'Kunal Verma', role: 'Corporate Partner', text: 'Top notch service and luxury rigid box packaging.' },
                                  { name: 'Sneha Shah', role: 'Birthday Invite', text: 'E-Stationery design was very elegant and fast delivery.' }
                                ].map((t, i) => (
                                  <div key={i} className="p-3 bg-white rounded-xl border border-[#e5e5e5] shadow-xs flex flex-col justify-between">
                                    <p className="text-[10px] text-gray-500 italic">"{t.text}"</p>
                                    <div className="mt-3">
                                      <h5 className="text-[10px] font-bold text-[#1a1410]">{t.name}</h5>
                                      <span className="text-[8px] text-gray-400">{t.role}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        // General dynamic layout renderer
                        if (layoutStyle === 'Split-Image-Left') {
                          return (
                            <div className="flex flex-col md:flex-row gap-6 items-center pt-4">
                              <div className="w-full md:w-5/12 flex justify-center">
                                <img src={previewImage} alt="Preview Left" className="max-h-[160px] rounded-xl object-cover shadow-sm border border-[#e5e5e5]" />
                              </div>
                              <div className="w-full md:w-7/12 space-y-2 text-left">
                                {badgeText && (
                                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#8B4949] bg-[#8B4949]/5 px-2 py-0.5 rounded-full">
                                    {badgeText}
                                  </span>
                                )}
                                <h3 className="text-base font-extrabold text-[#1a1410] leading-snug">{sectionTitle || 'Section Title'}</h3>
                                <p className="text-[11px] text-gray-450 font-semibold">{sectionSubtitle || 'Subtitle description goes here.'}</p>
                                <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-3">{sectionBody || 'Body text description content goes here.'}</p>
                                {hasCta && (
                                  <div className="pt-2">
                                    <span className="inline-block px-4 py-1.5 bg-[#8B4949] text-white font-extrabold text-[10px] rounded-lg shadow-sm">
                                      {sectionCtaText}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }

                        if (layoutStyle === 'Centered-Accent') {
                          return (
                            <div className="text-center max-w-xl mx-auto space-y-3 pt-4">
                              {badgeText && (
                                <span className="inline-block text-[8px] font-extrabold uppercase tracking-widest text-[#8B4949] bg-[#8B4949]/5 px-2 py-0.5 rounded-full">
                                  {badgeText}
                                </span>
                              )}
                              <h3 className="text-lg font-extrabold text-[#1a1410] leading-snug">{sectionTitle || 'Section Title'}</h3>
                              <p className="text-[11px] text-gray-455 font-semibold">{sectionSubtitle || 'Subtitle description goes here.'}</p>
                              <p className="text-[10px] text-gray-500 leading-relaxed max-w-md mx-auto">{sectionBody || 'Body text description content goes here.'}</p>
                              {hasCta && (
                                <div className="pt-2">
                                  <span className="inline-block px-4 py-1.5 bg-[#8B4949] text-white font-extrabold text-[10px] rounded-lg shadow-sm">
                                    {sectionCtaText}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        }

                        if (layoutStyle === 'Minimalist-Banner') {
                          return (
                            <div className="bg-[#faf8f5] p-5 rounded-2xl border border-[#f0ece4] flex justify-between items-center flex-wrap gap-4 pt-4">
                              <div className="space-y-1.5 text-left max-w-sm">
                                <h3 className="text-sm font-extrabold text-[#1a1410]">{sectionTitle || 'Section Title'}</h3>
                                <p className="text-[10px] text-gray-500">{sectionSubtitle || 'Subtitle description goes here.'}</p>
                              </div>
                              {hasCta && (
                                <span className="px-4 py-2 bg-[#8B4949] text-white font-extrabold text-[10px] rounded-lg shadow-sm">
                                  {sectionCtaText}
                                </span>
                              )}
                            </div>
                          );
                        }

                        // Default: Split-Image-Right
                        return (
                          <div className="flex flex-col md:flex-row gap-6 items-center pt-4">
                            <div className="w-full md:w-7/12 space-y-2 text-left">
                              {badgeText && (
                                <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#8B4949] bg-[#8B4949]/5 px-2 py-0.5 rounded-full">
                                  {badgeText}
                                </span>
                              )}
                              <h3 className="text-base font-extrabold text-[#1a1410] leading-snug">{sectionTitle || 'Section Title'}</h3>
                              <p className="text-[11px] text-gray-450 font-semibold">{sectionSubtitle || 'Subtitle description goes here.'}</p>
                              <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-3">{sectionBody || 'Body text description content goes here.'}</p>
                              {hasCta && (
                                <div className="pt-2">
                                  <span className="inline-block px-4 py-1.5 bg-[#8B4949] text-white font-extrabold text-[10px] rounded-lg shadow-sm">
                                    {sectionCtaText}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="w-full md:w-5/12 flex justify-center">
                              <img src={previewImage} alt="Preview Right" className="max-h-[160px] rounded-xl object-cover shadow-sm border border-[#e5e5e5]" />
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
                    {selectedSection === 'Footer' && (
                      <div className="space-y-4 bg-[#faf8f5] border border-[#f0ece4] rounded-2xl p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-[#8B4949] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                          <span className="w-1.5 h-3 rounded-full bg-[#8B4949]" /> Footer Design Content
                        </h3>
                        <div>
                          <label className="admin-label">Brand Tagline</label>
                          <textarea
                            className="admin-textarea bg-white text-xs"
                            rows={2}
                            value={footerBrandTagline}
                            onChange={(e) => { setFooterBrandTagline(e.target.value); setSectionDirty(true); }}
                            placeholder="e.g. Personalized digital e-invites for every celebration..."
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="admin-label">Contact Phone</label>
                            <input
                              type="text"
                              className="admin-input bg-white text-xs"
                              value={footerPhone}
                              onChange={(e) => { setFooterPhone(e.target.value); setSectionDirty(true); }}
                              placeholder="e.g. +91 98765 43210"
                            />
                          </div>
                          <div>
                            <label className="admin-label">Contact Email</label>
                            <input
                              type="text"
                              className="admin-input bg-white text-xs"
                              value={footerEmail}
                              onChange={(e) => { setFooterEmail(e.target.value); setSectionDirty(true); }}
                              placeholder="e.g. hello@eventique.in"
                            />
                          </div>
                        </div>

                        <div className="border-t border-[#f0ece4] pt-4 mt-3">
                          <label className="admin-label block mb-2 text-xs font-bold text-[#1a1410]">Social Media Links</label>
                          <div className="grid grid-cols-2 gap-3">
                            {footerSocials.map((soc, idx) => (
                              <div key={soc.platform} className="bg-white p-2 rounded-xl border border-[#e5e5e5] flex items-center gap-2 shadow-xs">
                                <span className="text-[10px] font-bold capitalize text-gray-500 w-16">{soc.platform}</span>
                                <input
                                  type="text"
                                  className="admin-input !border-none p-0 focus:ring-0 text-[11px] text-gray-600 bg-transparent flex-grow"
                                  value={soc.url}
                                  onChange={(e) => {
                                    const updated = [...footerSocials];
                                    updated[idx].url = e.target.value;
                                    setFooterSocials(updated);
                                    setSectionDirty(true);
                                  }}
                                  placeholder={`e.g. https://${soc.platform}.com/...`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

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

                    {/* Badge and Footer Text editors */}
                    {['Explore Designs', 'Video Invites', 'Event Websites', 'Stationery', 'Printed Luxury Invites'].includes(selectedSection) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label">Section Badge Text</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={badgeText}
                            onChange={handleSectionFieldChange(setBadgeText)}
                            placeholder="e.g. Personalized Portals..."
                          />
                        </div>
                        <div>
                          <label className="admin-label">Section Footer Text</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={footerText}
                            onChange={handleSectionFieldChange(setFooterText)}
                            placeholder="e.g. Starting from ₹4,999 onwards..."
                          />
                        </div>
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

                    {/* Features list editor */}
                    {(['Explore Designs', 'Video Invites', 'Event Websites', 'Stationery', 'Printed Luxury Invites'].includes(selectedSection) || (isCustom && customType === 'grid')) && (
                      <div className="bg-[#faf8f5] border border-[#f0ece4] rounded-2xl p-5 space-y-4">
                        <div>
                          <label className="admin-label !mb-1 text-sm font-semibold text-[#1a1410]">Section Features List (Up to 3 Items)</label>
                          <p className="text-xs text-gray-400">Configure key highlights showing under this homepage block.</p>
                        </div>
                        <div className="space-y-4">
                          {features.map((feature, fIdx) => (
                            <div key={fIdx} className="bg-white p-4 rounded-xl border border-[#e5e5e5] space-y-2.5 shadow-sm">
                              <p className="text-[10px] uppercase font-bold text-gray-400">Feature Item {fIdx + 1}</p>
                              <div className="space-y-2">
                                <div>
                                  <label className="text-[10px] font-semibold text-gray-500">Feature Title</label>
                                  <input
                                    type="text"
                                    className="admin-input bg-white text-xs px-2.5 py-1.5"
                                    value={feature.title}
                                    onChange={(e) => {
                                      const updated = [...features];
                                      updated[fIdx] = { ...updated[fIdx], title: e.target.value };
                                      setFeatures(updated);
                                      setSectionDirty(true);
                                    }}
                                    placeholder="e.g. Quick Personalization"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-gray-500">Feature Description</label>
                                  <textarea
                                    className="admin-textarea bg-white text-xs p-2.5"
                                    rows={2}
                                    value={feature.desc}
                                    onChange={(e) => {
                                      const updated = [...features];
                                      updated[fIdx] = { ...updated[fIdx], desc: e.target.value };
                                      setFeatures(updated);
                                      setSectionDirty(true);
                                    }}
                                    placeholder="Describe this highlight detail..."
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
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
                          <h4 className="font-semibold text-xs text-gray-700">Story Points</h4>
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
                          <h4 className="font-semibold text-xs text-gray-700">Bottom CTA Box Details</h4>
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

                    {isCustom && customType === 'faq' && (
                      <div className="bg-[#faf8f5] rounded-2xl p-5 border border-[#e5e5e5]/50 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-xs text-gray-700">FAQ Accordion Items</h4>
                          <button
                            type="button"
                            onClick={() => {
                              setContactFaqs([...contactFaqs, { q: 'New Question?', a: 'New Answer content...' }]);
                              setSectionDirty(true);
                            }}
                            className="admin-btn admin-btn-outline admin-btn-sm text-xs font-semibold px-3 py-1 flex items-center gap-1 cursor-pointer bg-transparent shadow-xs"
                          >
                            <Plus size={12} /> Add FAQ Item
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
                              <p className="text-[10px] uppercase font-bold text-gray-400 font-mono">FAQ {idx + 1}</p>
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
                                  rows={2}
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
                    )}

                    {/* Footer Save Operations */}
                    <div className="border-t border-[#f0f0f0] pt-5 flex items-center gap-3">
                      <button
                        onClick={handleSectionSave}
                        disabled={!sectionDirty}
                        className="admin-btn admin-btn-primary flex items-center gap-2 shadow-sm"
                        style={{ opacity: sectionDirty ? 1 : 0.5, cursor: sectionDirty ? 'pointer' : 'not-allowed' }}
                      >
                        <Save size={15} /> Save Section Content
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
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
                      <label className="admin-label">Short Description</label>
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
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveContentBlock(idx, 'up')}
                                className="w-7 h-7 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 flex items-center justify-center text-gray-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ArrowUp size={13} />
                              </button>
                              <button
                                type="button"
                                disabled={idx === blogContent.length - 1}
                                onClick={() => handleMoveContentBlock(idx, 'down')}
                                className="w-7 h-7 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 flex items-center justify-center text-gray-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ArrowDown size={13} />
                              </button>
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
                                    setPickerTarget('blog');
                                    setShowBlogImagePicker(true);
                                  }}
                                  className="admin-btn admin-btn-outline admin-btn-sm flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <ImageIcon size={12} /> Choose from Media
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

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

      {/* ── TAB 3: LAUNCH CAMPAIGNS ──────────────────────────────── */}
      {activeTab === 'campaigns' && (
        <>
          {!isEditingCampaign ? (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-4 bg-white border border-[#e5e5e5] px-5 py-4 rounded-2xl shadow-sm">
                <div>
                  <h3 className="font-bold text-sm text-[#1a1410]">Product Launch Campaigns</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Build premium landing pages dynamically for new collections</p>
                </div>
                <button
                  onClick={() => handleOpenCampaignEditor(null)}
                  className="admin-btn admin-btn-primary flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={15} /> Create Launch Page
                </button>
              </div>

              {/* Grid of Campaigns */}
              {state.campaigns.length === 0 ? (
                <div className="admin-empty card bg-white border border-[#e5e5e5]">
                  <Rocket size={36} className="text-gray-300 mx-auto" />
                  <p className="mt-2 font-medium">No launch campaigns found</p>
                  <button onClick={() => handleOpenCampaignEditor(null)} className="admin-btn admin-btn-primary admin-btn-sm mt-3">
                    Build First Campaign
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {state.campaigns.map((camp) => (
                    <div key={camp.id} className="bg-white border border-[#e5e5e5] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                      <div className="aspect-[16/10] bg-gray-100 relative">
                        <img src={camp.heroImage} alt={camp.title} className="w-full h-full object-cover" />
                        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm" style={{ color: camp.accentColor }}>
                          Theme: {camp.theme}
                        </span>
                        <span className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                          camp.status === 'Active' ? 'bg-green-100 text-green-700' : camp.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {camp.status}
                        </span>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h4 className="font-bold text-[#1a1410] text-sm leading-snug mb-1 line-clamp-1">{camp.title}</h4>
                        <p className="text-xs text-[#8B4949] font-semibold mb-2">{camp.productName}</p>
                        
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-5">
                          <span>URL:</span>
                          <a 
                            href={`/launch/${camp.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8B4949] hover:underline font-bold flex items-center gap-0.5"
                          >
                            /launch/{camp.slug}
                            <ExternalLink size={10} />
                          </a>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#f0f0f0] pt-4 mt-auto">
                          <button
                            onClick={() => handleOpenCampaignEditor(camp)}
                            className="text-xs font-bold text-[#8B4949] hover:bg-[#8B4949]/5 px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Edit3 size={13} /> Edit Layout
                          </button>
                          <button
                            onClick={() => setCampaignDeleteTarget(camp.id)}
                            className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete Campaign"
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
            /* Campaign Composer Form View */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
              <div className="lg:col-span-8 bg-white border border-[#e5e5e5] rounded-3xl p-7 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
                  <h3 className="font-bold text-[#1a1410] text-base flex items-center gap-2">
                    <Rocket size={18} className="text-[#8B4949]" />
                    {selectedCampaignId ? 'Edit Campaign Builder' : 'Create Launch Campaign'}
                  </h3>
                  <button
                    onClick={() => setIsEditingCampaign(false)}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Card 1: Identity & Style */}
                  <div className="bg-[#faf8f5] border border-[#e5e5e5]/60 rounded-3xl p-5 space-y-4 shadow-sm">
                    <h4 className="font-bold text-[#1a1410] text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-3 rounded-full bg-[#8B4949]" /> Identity & Visual Style
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="admin-label">Campaign Name *</label>
                        <input
                          type="text"
                          className="admin-input bg-white"
                          value={campTitle}
                          onChange={(e) => { 
                            const val = e.target.value;
                            setCampTitle(val); 
                            setCampDirty(true); 
                            // Auto-generate slug
                            const generated = val.toLowerCase()
                              .replace(/[^a-z0-9\s-]/g, '')
                              .trim()
                              .replace(/\s+/g, '-');
                            setCampSlug(generated);
                          }}
                          placeholder="e.g. Ganesh Chaturthi Launch Collection"
                        />
                      </div>
                      <div>
                        <label className="admin-label">URL Slug (Lowercase & Hyphenated) *</label>
                        <input
                          type="text"
                          className="admin-input bg-white"
                          value={campSlug}
                          onChange={(e) => { setCampSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-')); setCampDirty(true); }}
                          placeholder="e.g. ganesh-chaturthi"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Target Product Name</label>
                        <input
                          type="text"
                          className="admin-input bg-white"
                          value={campProductName}
                          onChange={(e) => { setCampProductName(e.target.value); setCampDirty(true); }}
                          placeholder="e.g. Vighnaharta Premium Video Invitation"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Campaign Status</label>
                        <select
                          className="admin-input bg-white"
                          value={campStatus}
                          onChange={(e) => { setCampStatus(e.target.value as any); setCampDirty(true); }}
                        >
                          <option value="Draft">Draft</option>
                          <option value="Active">Active / Public</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t border-[#f0ece4] pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="admin-label block mb-2">Theme Template Style</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: 'Royal', title: 'Royal Classic', desc: 'Gold & Ivory accents', previewBg: 'from-[#fdf8f0] to-[#fff5f0] border-[#D4AF37]/30 text-[#8B4949]' },
                            { value: 'Modern', title: 'Modern Bento', desc: 'Bold grid layouts', previewBg: 'from-slate-50 to-slate-100 border-slate-300 text-slate-800' },
                            { value: 'Minimalist', title: 'Minimalist', desc: 'Refined typography', previewBg: 'from-white to-gray-50 border-gray-200 text-gray-900' },
                            { value: 'Floral', title: 'Floral Pastel', desc: 'Handcrafted floral motifs', previewBg: 'from-rose-50/50 to-emerald-50/30 border-rose-200/40 text-emerald-800' }
                          ].map((t) => {
                            const isSelected = campTheme === t.value;
                            return (
                              <button
                                key={t.value}
                                type="button"
                                onClick={() => { setCampTheme(t.value as any); setCampDirty(true); }}
                                className={`p-2.5 rounded-xl border text-left transition-all hover:scale-[1.01] cursor-pointer flex flex-col justify-between h-20 shadow-sm relative overflow-hidden ${
                                  isSelected 
                                    ? 'border-[#8B4949] bg-gradient-to-br from-[#8B4949]/5 to-[#8B4949]/10 ring-2 ring-[#8B4949]' 
                                    : 'border-[#e5e5e5] bg-white hover:border-[#8B4949]/40'
                                }`}
                              >
                                <div className="z-10">
                                  <span className="text-[10px] font-bold block text-gray-800">
                                    {t.title}
                                  </span>
                                  <span className="text-[9px] text-gray-400 block leading-tight mt-0.5">{t.desc}</span>
                                </div>
                                <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-tl-lg bg-gradient-to-br ${t.previewBg} flex items-center justify-center border-t border-l opacity-80`}>
                                  <span className="text-[9px] font-serif italic">Aa</span>
                                </div>
                                {isSelected && (
                                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#8B4949] rounded-full flex items-center justify-center text-white">
                                    <Check size={8} strokeWidth={3} />
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="admin-label">Accent Color Theme</label>
                        <div className="flex gap-2 bg-white p-2 rounded-2xl border border-[#e5e5e5] items-center h-[90px]">
                          <input
                            type="color"
                            className="w-12 h-12 rounded-xl border border-[#e5e5e5] p-0.5 cursor-pointer bg-white flex-shrink-0"
                            value={campAccentColor}
                            onChange={(e) => { setCampAccentColor(e.target.value); setCampDirty(true); }}
                          />
                          <div className="flex-grow">
                            <input
                              type="text"
                              className="admin-input !border-none font-mono text-xs uppercase p-0 focus:ring-0"
                              value={campAccentColor}
                              onChange={(e) => { setCampAccentColor(e.target.value); setCampDirty(true); }}
                              placeholder="#D4AF37"
                            />
                            <p className="text-[9px] text-gray-400 mt-1">Accent lines & buttons color</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hero Settings */}
                  <div className="bg-[#faf8f5] border border-[#e5e5e5]/60 rounded-2xl p-5 space-y-4">
                    <h4 className="font-bold text-[#1a1410] text-xs uppercase tracking-wider">Campaign Hero Banner</h4>
                    <div>
                      <label className="admin-label text-xs">Hero Highlight Title</label>
                      <input
                        type="text"
                        className="admin-input bg-white"
                        value={campHeroTitle}
                        onChange={(e) => { setCampHeroTitle(e.target.value); setCampDirty(true); }}
                        placeholder="e.g. Invite Blessings into Your Celebration with"
                      />
                    </div>
                    <div>
                      <label className="admin-label text-xs">Hero Description Subtitle</label>
                      <textarea
                        className="admin-textarea bg-white"
                        rows={2}
                        value={campHeroSubtitle}
                        onChange={(e) => { setCampHeroSubtitle(e.target.value); setCampDirty(true); }}
                        placeholder="Detail about the launch or product collection..."
                      />
                    </div>
                  </div>

                  {/* Features Highlights */}
                  <div className="bg-[#faf8f5] border border-[#e5e5e5]/60 rounded-2xl p-5 space-y-4">
                    <h4 className="font-bold text-[#1a1410] text-xs uppercase tracking-wider">Bento Grid Features (Up to 3 highlights)</h4>
                    <div className="space-y-3">
                      {campFeatures.map((f, idx) => (
                        <div key={idx} className="bg-white border border-[#e5e5e5] rounded-xl p-3.5 space-y-2 shadow-sm">
                          <p className="text-[9px] font-bold text-gray-400 uppercase">Highlight {idx + 1}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] font-semibold text-gray-500 block mb-0.5">Feature Title</label>
                              <input
                                type="text"
                                className="admin-input bg-white text-xs px-2.5 py-1.5"
                                value={f.title}
                                onChange={(e) => {
                                  const updated = [...campFeatures];
                                  updated[idx].title = e.target.value;
                                  setCampFeatures(updated);
                                  setCampDirty(true);
                                }}
                                placeholder="e.g. Golden Foil Art Themes"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-semibold text-gray-500 block mb-0.5">Feature Description</label>
                              <input
                                type="text"
                                className="admin-input bg-white text-xs px-2.5 py-1.5"
                                value={f.desc}
                                onChange={(e) => {
                                  const updated = [...campFeatures];
                                  updated[idx].desc = e.target.value;
                                  setCampFeatures(updated);
                                  setCampDirty(true);
                                }}
                                placeholder="Describe this highlight detail..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Packages Builder */}
                  <div className="bg-[#faf8f5] border border-[#e5e5e5]/60 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-[#1a1410] text-xs uppercase tracking-wider">Pricing Packages</h4>
                      <button
                        type="button"
                        onClick={() => {
                          setCampPackages([...campPackages, { name: '', price: 1999, features: [''] }]);
                          setCampDirty(true);
                        }}
                        className="admin-btn admin-btn-outline admin-btn-sm text-xs font-semibold px-3 py-1 flex items-center gap-1 cursor-pointer bg-white"
                      >
                        <Plus size={12} /> Add Package
                      </button>
                    </div>

                    <div className="space-y-4">
                      {campPackages.map((pkg, pkgIdx) => (
                        <div key={pkgIdx} className="bg-white border border-[#e5e5e5] rounded-xl p-4 space-y-3 relative shadow-sm">
                          <button
                            type="button"
                            onClick={() => {
                              setCampPackages(campPackages.filter((_, idx) => idx !== pkgIdx));
                              setCampDirty(true);
                            }}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer border-none"
                          >
                            <Trash2 size={12} />
                          </button>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] font-semibold text-gray-500 block mb-0.5">Package Name</label>
                              <input
                                type="text"
                                className="admin-input text-xs"
                                value={pkg.name}
                                onChange={(e) => {
                                  const updated = [...campPackages];
                                  updated[pkgIdx].name = e.target.value;
                                  setCampPackages(updated);
                                  setCampDirty(true);
                                }}
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-semibold text-gray-500 block mb-0.5">Price (₹)</label>
                              <input
                                type="number"
                                className="admin-input text-xs"
                                value={pkg.price}
                                onChange={(e) => {
                                  const updated = [...campPackages];
                                  updated[pkgIdx].price = Number(e.target.value);
                                  setCampPackages(updated);
                                  setCampDirty(true);
                                }}
                              />
                            </div>
                          </div>

                          {/* Features lines */}
                          <div className="space-y-1.5 pt-2 border-t border-dashed border-gray-100">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[9px] font-bold text-gray-400 uppercase">Package Features</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...campPackages];
                                  updated[pkgIdx].features.push('');
                                  setCampPackages(updated);
                                  setCampDirty(true);
                                }}
                                className="text-[9px] text-[#8B4949] hover:underline font-bold"
                              >
                                + Add Line
                              </button>
                            </div>
                            {pkg.features.map((feat, fIdx) => (
                              <div key={fIdx} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  className="admin-input text-xs bg-gray-50 py-1.5"
                                  value={feat}
                                  onChange={(e) => {
                                    const updated = [...campPackages];
                                    updated[pkgIdx].features[fIdx] = e.target.value;
                                    setCampPackages(updated);
                                    setCampDirty(true);
                                  }}
                                  placeholder="Feature description line..."
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...campPackages];
                                    updated[pkgIdx].features = pkg.features.filter((_, idx) => idx !== fIdx);
                                    setCampPackages(updated);
                                    setCampDirty(true);
                                  }}
                                  className="text-red-400 hover:text-red-600 p-1"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FAQ Builder */}
                  <div className="bg-[#faf8f5] border border-[#e5e5e5]/60 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-[#1a1410] text-xs uppercase tracking-wider">Campaign FAQs Accordion</h4>
                      <button
                        type="button"
                        onClick={() => {
                          setCampFaqs([...campFaqs, { q: '', a: '' }]);
                          setCampDirty(true);
                        }}
                        className="admin-btn admin-btn-outline admin-btn-sm text-xs font-semibold px-3 py-1 flex items-center gap-1 cursor-pointer bg-white"
                      >
                        <Plus size={12} /> Add FAQ
                      </button>
                    </div>

                    <div className="space-y-3">
                      {campFaqs.map((faq, fIdx) => (
                        <div key={fIdx} className="bg-white border border-[#e5e5e5] rounded-xl p-4 space-y-2 relative shadow-sm">
                          <button
                            type="button"
                            onClick={() => {
                              setCampFaqs(campFaqs.filter((_, idx) => idx !== fIdx));
                              setCampDirty(true);
                            }}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer border-none"
                          >
                            <Trash2 size={12} />
                          </button>
                          <div>
                            <label className="text-[9px] font-semibold text-gray-500 block mb-0.5">Question</label>
                            <input
                              type="text"
                              className="admin-input text-xs font-semibold"
                              value={faq.q}
                              onChange={(e) => {
                                const updated = [...campFaqs];
                                updated[fIdx].q = e.target.value;
                                setCampFaqs(updated);
                                setCampDirty(true);
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-semibold text-gray-500 block mb-0.5">Answer</label>
                            <textarea
                              className="admin-textarea text-xs"
                              rows={2}
                              value={faq.a}
                              onChange={(e) => {
                                const updated = [...campFaqs];
                                updated[fIdx].a = e.target.value;
                                setCampFaqs(updated);
                                setCampDirty(true);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="border-t border-[#f0f0f0] pt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCampaignSave}
                      className="admin-btn admin-btn-primary flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Save size={15} /> Save Campaign
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingCampaign(false)}
                      className="admin-btn admin-btn-outline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                  {selectedCampaignId && (
                    <button
                      type="button"
                      onClick={() => setCampaignDeleteTarget(selectedCampaignId)}
                      className="admin-btn admin-btn-danger flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 size={14} /> Delete Campaign
                    </button>
                  )}
                </div>
              </div>

              {/* Right Panel for Campaign media & settings */}
              <div className="lg:col-span-4 space-y-6">
                {/* Hero Banner Image */}
                <div className="bg-white border border-[#e5e5e5] rounded-3xl p-6 shadow-sm space-y-4 animate-fade-in">
                  <h4 className="font-bold text-[#1a1410] text-sm">Hero Banner Image</h4>
                  
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith('image/')) {
                        const url = URL.createObjectURL(file);
                        setCampHeroImage(url);
                        setCampDirty(true);
                      }
                    }}
                    className="border-2 border-dashed border-[#e5e5e5] hover:border-[#8B4949] rounded-2xl bg-[#faf8f5] p-3 flex flex-col items-center justify-center min-h-[170px] relative overflow-hidden transition-all group"
                  >
                    {campHeroImage ? (
                      <>
                        <img src={campHeroImage} alt="Hero Preview" className="max-h-[140px] rounded-lg object-contain group-hover:scale-[1.02] transition-transform" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => { setCampHeroImage(''); setCampDirty(true); }}
                            className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
                            title="Remove image"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-400 space-y-2 select-none pointer-events-none p-4">
                        <div className="w-10 h-10 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center mx-auto text-gray-400 shadow-sm group-hover:scale-110 transition-transform">
                          <Upload size={16} className="text-[#8B4949]" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-gray-600">Drag & drop hero image</p>
                          <p className="text-[9px] text-gray-400 mt-0.5">or drop file here</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => campHeroFileInputRef.current?.click()}
                      className="admin-btn admin-btn-outline admin-btn-sm flex items-center justify-center gap-1 cursor-pointer text-xs"
                    >
                      <Upload size={12} /> Upload
                    </button>
                    <input
                      ref={campHeroFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCampHeroImageUpload}
                    />
                    <button
                      type="button"
                      onClick={() => { setPickerTarget('campHero'); setShowMediaPicker(true); }}
                      className="admin-btn admin-btn-outline admin-btn-sm flex items-center justify-center gap-1 cursor-pointer text-xs"
                    >
                      <ImageIcon size={12} /> Library
                    </button>
                  </div>
                </div>

                {/* Gallery Images List */}
                <div className="bg-white border border-[#e5e5e5] rounded-3xl p-6 shadow-sm space-y-4">
                  <h4 className="font-bold text-[#1a1410] text-sm">Bento Image Gallery</h4>
                  
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = e.dataTransfer.files;
                      if (files) {
                        const urls: string[] = [];
                        for (let i = 0; i < files.length; i++) {
                          if (files[i].type.startsWith('image/')) {
                            urls.push(URL.createObjectURL(files[i]));
                          }
                        }
                        if (urls.length > 0) {
                          setCampGallery(prev => [...prev, ...urls]);
                          setCampDirty(true);
                        }
                      }
                    }}
                    className="border-2 border-dashed border-[#e5e5e5] hover:border-[#8B4949] rounded-2xl bg-[#faf8f5] p-3 min-h-[140px] flex flex-col items-center justify-center relative overflow-hidden transition-all group"
                  >
                    {campGallery.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 w-full">
                        {campGallery.map((url, idx) => (
                          <div key={idx} className="relative aspect-square border border-[#e5e5e5] rounded-xl overflow-hidden bg-white group/item shadow-sm">
                            <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setCampGallery(campGallery.filter((_, i) => i !== idx));
                                setCampDirty(true);
                              }}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center text-white hover:text-red-500 cursor-pointer"
                              title="Remove image"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 space-y-2 select-none pointer-events-none p-4">
                        <Upload size={16} className="mx-auto text-gray-300 group-hover:translate-y-[-2px] transition-transform" />
                        <div>
                          <p className="text-[11px] font-semibold text-gray-500">Drag & drop gallery images</p>
                          <p className="text-[9px] text-gray-400">Multiple files supported</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => campGalleryFileInputRef.current?.click()}
                      className="w-full admin-btn admin-btn-outline admin-btn-sm flex items-center justify-center gap-1 cursor-pointer text-xs"
                    >
                      <Upload size={12} /> Upload
                    </button>
                    <input
                      ref={campGalleryFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleCampGalleryUpload}
                    />
                    <button
                      type="button"
                      onClick={() => { setPickerTarget('campGallery'); setShowMediaPicker(true); }}
                      className="w-full admin-btn admin-btn-outline admin-btn-sm flex items-center justify-center gap-1 cursor-pointer text-xs"
                    >
                      <ImageIcon size={12} /> Library
                    </button>
                  </div>
                </div>

                {/* Video URL */}
                <div className="bg-white border border-[#e5e5e5] rounded-3xl p-6 shadow-sm space-y-4">
                  <h4 className="font-bold text-[#1a1410] text-sm">Product Video Preview (Optional)</h4>
                  <div>
                    <label className="admin-label text-xs">Direct MP4 Video Link</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={campVideoUrl}
                      onChange={(e) => { setCampVideoUrl(e.target.value); setCampDirty(true); }}
                      placeholder="e.g. https://assets.mixkit.co/videos/..."
                    />
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
                        } else if (pickerTarget === 'campHero') {
                          setCampHeroImage(f.url);
                          setCampDirty(true);
                        } else if (pickerTarget === 'campGallery') {
                          setCampGallery(prev => [...prev, f.url]);
                          setCampDirty(true);
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

      {/* Campaign Delete Confirmation Dialog */}
      <ConfirmDialog
        open={campaignDeleteTarget !== null}
        title="Delete Launch Campaign"
        message="This campaign landing page will be permanently removed from the website. This action cannot be undone."
        confirmLabel="Delete Campaign"
        onConfirm={handleDeleteCampaignConfirm}
        onCancel={() => setCampaignDeleteTarget(null)}
        danger
      />

      {/* ── CREATE CUSTOM SECTION MODAL ────────────────────────────── */}
      {showCustomSectionModal && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] admin-animate-in"
            onClick={() => setShowCustomSectionModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[250] overflow-hidden border border-[#e5e5e5]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0]">
              <div>
                <h3 className="font-bold text-[#1a1410] text-base" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Add Custom Section
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Create a new editable content block for the website</p>
              </div>
              <button
                onClick={() => setShowCustomSectionModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="admin-label">Section Name *</label>
                <input
                  type="text"
                  className="admin-input"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="e.g. Wedding Services Highlight"
                />
              </div>

              <div>
                <label className="admin-label">Template Layout Style</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { value: 'text', label: 'Simple Paragraph', desc: 'Title, subtitle, and body text editor' },
                    { value: 'hero', label: 'Hero Section', desc: 'Title, subtitle, CTA button, and single image' },
                    { value: 'grid', label: 'Info Highlights Grid', desc: 'Title, subtitle, and 3 feature blocks' },
                    { value: 'faq', label: 'FAQs Accordion', desc: 'Title, subtitle, and dynamic list of Q&As' }
                  ].map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setNewSectionTemplate(t.value as any)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all hover:scale-[1.01] ${
                        newSectionTemplate === t.value
                          ? 'border-[#8B4949] bg-[#8B4949]/5 ring-2 ring-[#8B4949]'
                          : 'border-[#e5e5e5] bg-white hover:border-[#8B4949]/30'
                      }`}
                    >
                      <span className="text-xs font-bold text-gray-800 block">{t.label}</span>
                      <span className="text-[9px] text-gray-400 block leading-tight mt-1">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#faf8f5] border-t border-[#f0f0f0] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowCustomSectionModal(false)}
                className="admin-btn admin-btn-outline admin-btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCustomSection}
                className="admin-btn admin-btn-primary admin-btn-sm"
              >
                Create Section
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
