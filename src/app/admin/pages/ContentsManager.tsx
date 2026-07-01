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

  
  // ── VISUAL BUILDER RENDER HELPERS ──────────────────────────
  
  // Helper to read current field value (draft or context block)
  const getVisualBlockData = (sectionName: string) => {
    const block = state.contentBlocks.find(b => b.sectionName === sectionName);
    if (!block) return {};
    
    // If we are currently editing this section, return the live state values
    const isEditingCurrent = 
      (sectionName === 'Hero' && activeVisualSection === 'hero') ||
      (sectionName === 'Explore Designs' && activeVisualSection === 'product-showcase') ||
      (sectionName === 'Printed Luxury Invites' && (activeVisualSection === 'printed-invites' || activeVisualSection === 'printed')) ||
      (sectionName === 'Browse by Occasion' && activeVisualSection === 'categories') ||
      (sectionName === 'Our Services' && activeVisualSection === 'services') ||
      (sectionName === 'Testimonials' && activeVisualSection === 'testimonials') ||
      (sectionName === 'CTA' && activeVisualSection === 'cta') ||
      (sectionName === 'About' && activeVisualSection === 'about') ||
      (sectionName === 'Contact' && activeVisualSection === 'contact');

    if (isEditingCurrent) {
      return {
        title: sectionTitle,
        subtitle: sectionSubtitle,
        body: sectionBody,
        imageUrl: sectionImageUrl,
        ctaText: sectionCtaText,
        ctaLink: sectionCtaLink,
        badgeText: badgeText,
        layoutStyle: layoutStyle,
        features: features,
        images: sectionImages,
      };
    }

    return {
      title: block.title || '',
      subtitle: block.subtitle || '',
      body: block.body || '',
      imageUrl: block.imageUrl || '',
      ctaText: block.ctaText || '',
      ctaLink: block.ctaLink || '',
      badgeText: block.badgeText || '',
      layoutStyle: block.layoutStyle || 'Split-Image-Right',
      features: block.features || [],
      images: block.images || [],
    };
  };

  const renderVisualHome = () => {
    const sorted = [...state.sections].sort((a, b) => a.order - b.order);
    return (
      <div className="space-y-20 py-10 px-4 max-w-7xl mx-auto">
        {sorted.map((sec) => {
          if (!sec.enabled) return null;
          
          const isSelected = activeVisualSection === sec.id;
          
          return (
            <div
              key={sec.id}
              onClick={(e) => {
                if (visualEditMode) {
                  e.stopPropagation();
                  setActiveVisualSection(sec.id);
                  // Populate drawer fields
                  const data = getVisualBlockData(
                    sec.id === 'hero' ? 'Hero' 
                    : sec.id === 'product-showcase' ? 'Explore Designs'
                    : sec.id === 'printed-invites' ? 'Printed Luxury Invites'
                    : sec.id === 'categories' ? 'Browse by Occasion'
                    : sec.id === 'services' ? 'Our Services'
                    : sec.id === 'testimonials' ? 'Testimonials'
                    : sec.id === 'cta' ? 'CTA' : ''
                  );
                  setSectionTitle(data.title || '');
                  setSectionSubtitle(data.subtitle || '');
                  setSectionBody(data.body || '');
                  setSectionImageUrl(data.imageUrl || '');
                  setSectionCtaText(data.ctaText || '');
                  setSectionCtaLink(data.ctaLink || '');
                  setBadgeText(data.badgeText || '');
                  setLayoutStyle(data.layoutStyle || 'Split-Image-Right');
                }
              }}
              className={`relative rounded-3xl transition-all duration-300 ${
                visualEditMode 
                  ? `border-2 border-dashed p-3 cursor-pointer hover:border-[#8B4949] hover:bg-[#8B4949]/[0.01] ${
                      isSelected ? 'border-[#8B4949] bg-[#8B4949]/[0.02]' : 'border-transparent'
                    }`
                  : ''
              }`}
            >
              {/* Wix hover banner */}
              {visualEditMode && (
                <div className="absolute top-2 left-2 z-30 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity bg-[#8B4949] text-white text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded shadow-md pointer-events-none select-none">
                  {sec.name} · Click to edit content
                </div>
              )}

              {/* Render dynamic section mocks */}
              {(() => {
                if (sec.id === 'hero') {
                  const slides = [
                    { title: 'Celebrate Every Moment with', highlight: 'Elegance', badge: 'Personalized Invitations', bg: 'from-amber-50 to-[#faf8f5]' },
                    { title: 'Elegant Premium Rigid Box', highlight: 'Invites', badge: 'Handcrafted Physical Collections', bg: 'from-[#faf0e8] to-[#faf8f5]' },
                    { title: 'Interactive Custom RSVP', highlight: 'Microsites', badge: 'Event Websites & RSVPs', bg: 'from-[#f0f5f8] to-[#faf8f5]' }
                  ];
                  return (
                    <div className="p-12 bg-gradient-to-br from-amber-50 to-[#faf8f5] rounded-3xl flex items-center justify-between min-h-[300px]">
                      <div className="space-y-4 max-w-lg">
                        <span className="inline-block px-3 py-1.5 bg-[#8B4949]/5 text-[#8B4949] rounded-full text-xs font-bold uppercase tracking-wider border border-[#8B4949]/10">
                          🌸 Personalized Invitations Collection
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-[#1a1410] leading-tight">
                          Celebrate Every Moment with <span className="text-[#8B4949] italic">Elegance</span>
                        </h1>
                        <p className="text-sm text-gray-500 font-light">
                          Experience premium luxury design for wedding, birthday, Pooja, and corporate invitations.
                        </p>
                        <div className="flex gap-3">
                          <span className="px-6 py-2.5 bg-[#8B4949] text-white font-extrabold text-xs rounded-xl shadow-md">Explore Collection</span>
                          <span className="px-6 py-2.5 bg-white border border-gray-250 text-gray-700 font-extrabold text-xs rounded-xl shadow-xs">Request Quote</span>
                        </div>
                      </div>
                      <div className="w-1/3 hidden md:flex justify-end">
                        <span className="text-6xl animate-bounce">💌</span>
                      </div>
                    </div>
                  );
                }

                if (sec.id === 'product-showcase') {
                  const data = getVisualBlockData('Explore Designs');
                  return (
                    <div className="space-y-8 py-4">
                      <div className="text-center max-w-md mx-auto space-y-2">
                        {data.badgeText && (
                          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#8B4949] bg-[#8B4949]/5 px-3 py-1 rounded-full">
                            {data.badgeText}
                          </span>
                        )}
                        <h2 className="text-3xl font-extrabold text-[#1a1410] tracking-tight">{data.title || 'Explore Collections'}</h2>
                        <p className="text-sm text-gray-500 leading-relaxed">{data.subtitle || 'Select from our range of invitation formats'}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { name: 'Video Invites', desc: 'Premium animated loop cards', emoji: '🎬' },
                          { name: 'Event Websites', desc: 'Interactive guest RSVP portals', emoji: '🌐' },
                          { name: 'Printed Luxury Invites', desc: 'Handcrafted rigid cotton boards', emoji: '✉️' }
                        ].map((cat, i) => (
                          <div key={i} className="p-6 bg-white border border-gray-150 rounded-2xl shadow-xs space-y-2 text-center hover:scale-[1.01] transition-transform">
                            <span className="text-3xl block mb-2">{cat.emoji}</span>
                            <h4 className="text-sm font-bold text-[#1a1410]">{cat.name}</h4>
                            <p className="text-[11px] text-gray-500">{cat.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (sec.id === 'printed-invites') {
                  const data = getVisualBlockData('Printed Luxury Invites');
                  const pImage = data.imageUrl || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600";
                  const layout = data.layoutStyle || 'Split-Image-Right';

                  if (layout === 'Split-Image-Left') {
                    return (
                      <div className="flex flex-col md:flex-row gap-8 items-center py-6">
                        <div className="w-full md:w-5/12 flex justify-center">
                          <img src={pImage} alt="Mock Left" className="max-h-[220px] rounded-2xl object-cover border shadow-md" />
                        </div>
                        <div className="w-full md:w-7/12 space-y-4 text-left">
                          {data.badgeText && (
                            <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#8B4949] bg-[#8B4949]/5 px-3 py-1 rounded-full">
                              {data.badgeText}
                            </span>
                          )}
                          <h2 className="text-3xl font-extrabold text-[#1a1410] tracking-tight">{data.title || 'Printed Luxury'}</h2>
                          <p className="text-sm text-gray-500 leading-relaxed">{data.body || 'Bespoke rigid envelopes and gold foil borders...'}</p>
                        </div>
                      </div>
                    );
                  }

                  if (layout === 'Centered-Accent') {
                    return (
                      <div className="text-center max-w-2xl mx-auto space-y-4 py-6">
                        {data.badgeText && (
                          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#8B4949] bg-[#8B4949]/5 px-3 py-1 rounded-full">
                            {data.badgeText}
                          </span>
                        )}
                        <h2 className="text-3xl font-extrabold text-[#1a1410] tracking-tight">{data.title || 'Printed Luxury'}</h2>
                        <p className="text-sm text-gray-500 leading-relaxed">{data.body || 'Bespoke rigid envelopes and gold foil borders...'}</p>
                      </div>
                    );
                  }

                  if (layout === 'Minimalist-Banner') {
                    return (
                      <div className="bg-[#faf8f5] p-6 rounded-2xl border border-gray-150 flex justify-between items-center max-w-4xl mx-auto">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-[#1a1410]">{data.title || 'Printed Luxury'}</h3>
                          <p className="text-xs text-gray-500">{data.subtitle || 'Elegant rigid cards'}</p>
                        </div>
                        <span className="text-xs font-bold text-[#8B4949]">Order Samples Now →</span>
                      </div>
                    );
                  }

                  // Default: Split-Image-Right
                  return (
                    <div className="flex flex-col md:flex-row gap-8 items-center py-6">
                      <div className="w-full md:w-7/12 space-y-4 text-left">
                        {data.badgeText && (
                          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#8B4949] bg-[#8B4949]/5 px-3 py-1 rounded-full">
                            {data.badgeText}
                          </span>
                        )}
                        <h2 className="text-3xl font-extrabold text-[#1a1410] tracking-tight">{data.title || 'Printed Luxury'}</h2>
                        <p className="text-sm text-gray-500 leading-relaxed">{data.body || 'Bespoke rigid envelopes and gold foil borders...'}</p>
                      </div>
                      <div className="w-full md:w-5/12 flex justify-center">
                        <img src={pImage} alt="Mock Right" className="max-h-[220px] rounded-2xl object-cover border shadow-md" />
                      </div>
                    </div>
                  );
                }

                if (sec.id === 'categories') {
                  const data = getVisualBlockData('Browse by Occasion');
                  return (
                    <div className="space-y-6">
                      <div className="text-center max-w-xs mx-auto space-y-1">
                        <h3 className="text-xl font-bold text-[#1a1410]">{data.title || 'Browse by Occasion'}</h3>
                        <p className="text-xs text-gray-400">{data.subtitle || 'Custom Occasion collections'}</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Wedding', 'Anniversary', 'Engagement', 'Birthday'].map(occ => (
                          <div key={occ} className="aspect-[4/3] rounded-2xl bg-gray-100 flex items-center justify-center relative overflow-hidden">
                            <span className="absolute inset-0 bg-black/45 z-10" />
                            <span className="relative z-20 text-white font-extrabold text-sm">{occ}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (sec.id === 'product-carousel') {
                  return (
                    <div className="space-y-3">
                      <p className="text-xs uppercase font-extrabold text-gray-400 tracking-wider">🌟 Popular Design Highlights</p>
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          'https://images.unsplash.com/photo-1519741497674-611481863552?w=300',
                          'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300',
                          'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300',
                          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300'
                        ].map((src, idx) => (
                          <div key={idx} className="aspect-[3/4] bg-[#faf8f5] rounded-xl overflow-hidden border">
                            <img src={src} className="w-full h-full object-cover" alt="Product" />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (sec.id === 'services') {
                  const data = getVisualBlockData('Our Services');
                  return (
                    <div className="space-y-6">
                      <div className="text-center max-w-md mx-auto">
                        <h3 className="text-2xl font-extrabold text-[#1a1410]">{data.title || 'Our Services'}</h3>
                        <p className="text-xs text-gray-400 mt-1">{data.subtitle || 'Complete invite packages'}</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {['Digital Cards', 'Video Invites', 'RSVP Websites', 'Custom Stationery', 'Premium Gifts'].map((ser, i) => (
                          <div key={i} className="p-4 bg-white border border-gray-150 rounded-xl text-center shadow-xs">
                            <span className="text-2xl">⚡</span>
                            <h5 className="text-xs font-bold text-[#1a1410] mt-2">{ser}</h5>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (sec.id === 'how-it-works') {
                  return (
                    <div className="space-y-6">
                      <h4 className="text-lg font-bold text-center text-[#1a1410]">Our Four-Step Process</h4>
                      <div className="grid grid-cols-4 gap-6 text-center">
                        {['1. Select Design', '2. Personalize', '3. Approve Proof', '4. Secure Delivery'].map((step, i) => (
                          <div key={i} className="space-y-2">
                            <div className="w-10 h-10 rounded-full bg-[#8B4949]/10 text-[#8B4949] mx-auto flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </div>
                            <p className="text-xs font-bold text-gray-600">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (sec.id === 'testimonials') {
                  return (
                    <div className="space-y-6">
                      <h4 className="text-lg font-bold text-center text-[#1a1410]">❤️ What Clients Say</h4>
                      <div className="grid grid-cols-2 gap-6">
                        {[
                          { name: 'Riya & Amit', review: 'The rigid wedding box was breathtaking and gold foil was perfect.' },
                          { name: 'Karan Shah', review: 'Beautiful animations, very fast revisions and supportive team.' }
                        ].map((t, idx) => (
                          <div key={idx} className="p-5 bg-[#faf8f5] border rounded-2xl shadow-xs">
                            <div className="flex text-amber-400 gap-0.5 mb-2"><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /></div>
                            <p className="text-xs text-gray-500 italic">"{t.review}"</p>
                            <h6 className="text-xs font-bold text-gray-600 mt-2">{t.name}</h6>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (sec.id === 'cta') {
                  const data = getVisualBlockData('CTA');
                  return (
                    <div className="p-10 bg-gradient-to-r from-[#2d1515] via-[#8B4949] to-[#D4AF37] text-white rounded-3xl text-center space-y-4">
                      <h2 className="text-3xl font-black tracking-tight">{data.title || 'Create Something Unforgettable'}</h2>
                      <p className="text-xs text-white/70 max-w-md mx-auto">
                        Ready to design the invitations for your dream celebration? Reach out to us today.
                      </p>
                      {data.ctaText && (
                        <span className="inline-block px-5 py-2 bg-white text-[#8B4949] font-extrabold text-xs rounded-xl shadow-md">
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
    );
  };

  const renderVisualAbout = () => {
    const data = getVisualBlockData('About');
    const isSelected = activeVisualSection === 'about';
    return (
      <div
        onClick={() => {
          if (visualEditMode) {
            setActiveVisualSection('about');
            setSectionTitle(data.title || '');
            setSectionBody(data.body || '');
          }
        }}
        className={`py-12 px-6 max-w-5xl mx-auto space-y-12 relative rounded-3xl border-2 border-dashed ${
          visualEditMode 
            ? `cursor-pointer hover:border-[#8B4949] hover:bg-[#8B4949]/[0.01] ${isSelected ? 'border-[#8B4949] bg-[#8B4949]/[0.02]' : 'border-transparent'}`
            : 'border-transparent'
        }`}
      >
        {visualEditMode && (
          <div className="absolute top-2 left-2 z-30 bg-[#8B4949] text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded animate-pulse pointer-events-none">
            About Section · Click to Edit
          </div>
        )}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#8B4949] bg-[#8B4949]/5 px-3 py-1 rounded-full">🌺 STUDIO COLLECTION</span>
          <h1 className="text-4xl font-extrabold text-[#1a1410]">{data.title || 'The Story of Eventique'}</h1>
          <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">{data.body || 'Where tradition meets modern design...'}</p>
        </div>

        {/* Founder Row */}
        <div className="grid md:grid-cols-2 gap-8 bg-[#faf8f5] p-6 rounded-2xl border border-gray-150 items-center">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#8B4949]">Founder &amp; Vision</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We design and print invitations with alumni of NIFT &amp; IIT, delivering premium rigid boxes worldwide.
            </p>
          </div>
          <div className="flex justify-center">
            <span className="text-8xl">👑</span>
          </div>
        </div>
      </div>
    );
  };

  const renderVisualContact = () => {
    const data = getVisualBlockData('Contact');
    const isSelected = activeVisualSection === 'contact';
    return (
      <div
        onClick={() => {
          if (visualEditMode) {
            setActiveVisualSection('contact');
            setSectionTitle(data.title || '');
            setSectionSubtitle(data.subtitle || '');
          }
        }}
        className={`py-12 px-6 max-w-5xl mx-auto space-y-12 relative rounded-3xl border-2 border-dashed ${
          visualEditMode 
            ? `cursor-pointer hover:border-[#8B4949] hover:bg-[#8B4949]/[0.01] ${isSelected ? 'border-[#8B4949] bg-[#8B4949]/[0.02]' : 'border-transparent'}`
            : 'border-transparent'
        }`}
      >
        {visualEditMode && (
          <div className="absolute top-2 left-2 z-30 bg-[#8B4949] text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded animate-pulse pointer-events-none">
            Contact Section · Click to Edit
          </div>
        )}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#8B4949] bg-[#8B4949]/5 px-3 py-1 rounded-full">📞 TALK TO US</span>
          <h1 className="text-4xl font-extrabold text-[#1a1410]">{data.title || "Let's Create Together"}</h1>
          <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">{data.subtitle || 'Ask questions or customize rigid prints'}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          {['WhatsApp Support', 'Phone Call', 'Studio Mail'].map(cType => (
            <div key={cType} className="p-5 bg-white border rounded-xl shadow-xs">
              <span className="text-2xl">💬</span>
              <h4 className="text-xs font-bold mt-2">{cType}</h4>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVisualPrinted = () => {
    const data = getVisualBlockData('Printed Luxury Invites');
    const isSelected = activeVisualSection === 'printed';
    return (
      <div
        onClick={() => {
          if (visualEditMode) {
            setActiveVisualSection('printed');
            setSectionTitle(data.title || '');
            setSectionBody(data.body || '');
            setSectionImageUrl(data.imageUrl || '');
            setLayoutStyle(data.layoutStyle || 'Split-Image-Right');
            setBadgeText(data.badgeText || '');
          }
        }}
        className={`py-12 px-6 max-w-5xl mx-auto space-y-12 relative rounded-3xl border-2 border-dashed ${
          visualEditMode 
            ? `cursor-pointer hover:border-[#8B4949] hover:bg-[#8B4949]/[0.01] ${isSelected ? 'border-[#8B4949] bg-[#8B4949]/[0.02]' : 'border-transparent'}`
            : 'border-transparent'
        }`}
      >
        {visualEditMode && (
          <div className="absolute top-2 left-2 z-30 bg-[#8B4949] text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded animate-pulse pointer-events-none">
            Printed Page Header · Click to Edit
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-7/12 space-y-4 text-left">
            <h1 className="text-4xl font-extrabold text-[#1a1410]">{data.title || 'Printed Luxury Invites'}</h1>
            <p className="text-sm text-gray-500 leading-relaxed">{data.body || 'Meticulously crafted boxes...'}</p>
          </div>
          <div className="w-full md:w-5/12 flex justify-center">
            <img src={data.imageUrl || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600"} className="max-h-[180px] rounded-xl object-cover border" alt="Printed preview" />
          </div>
        </div>
      </div>
    );
  };

  const renderVisualFormInputs = () => {
    if (!activeVisualSection) return null;
    const isHero = activeVisualSection === 'hero';
    const isShowcase = activeVisualSection === 'product-showcase';
    const isPrinted = ['printed-invites', 'printed'].includes(activeVisualSection);
    const isCta = activeVisualSection === 'cta';

    return (
      <div className="space-y-4 text-left">
        {/* Title */}
        {activeVisualSection !== 'hero' && (
          <div>
            <label className="admin-label">Header Title Text</label>
            <input
              type="text"
              className="admin-input text-xs"
              value={sectionTitle}
              onChange={(e) => { setSectionTitle(e.target.value); setSectionDirty(true); }}
            />
          </div>
        )}

        {/* Subtitle / Description */}
        {!['hero', 'cta'].includes(activeVisualSection) && (
          <div>
            <label className="admin-label">Subtitle Description</label>
            <input
              type="text"
              className="admin-input text-xs"
              value={sectionSubtitle}
              onChange={(e) => { setSectionSubtitle(e.target.value); setSectionDirty(true); }}
            />
          </div>
        )}

        {/* Body Text */}
        {isPrinted && (
          <div>
            <label className="admin-label">Luxury Description Paragraph</label>
            <textarea
              rows={4}
              className="admin-textarea text-xs"
              value={sectionBody}
              onChange={(e) => { setSectionBody(e.target.value); setSectionDirty(true); }}
            />
          </div>
        )}

        {/* Layout style */}
        {isPrinted && (
          <div>
            <label className="admin-label">Visual Layout Option</label>
            <select
              className="admin-input text-xs cursor-pointer"
              value={layoutStyle}
              onChange={(e) => { setLayoutStyle(e.target.value); setSectionDirty(true); }}
            >
              <option value="Split-Image-Right">Split Layout (Right Image)</option>
              <option value="Split-Image-Left">Split Layout (Left Image)</option>
              <option value="Centered-Accent">Centered Text &amp; Banner</option>
              <option value="Minimalist-Banner">Minimal Banner (Hide visual)</option>
            </select>
          </div>
        )}

        {/* Image picker */}
        {isPrinted && (
          <div>
            <label className="admin-label">Section Collage Image / Design</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="admin-input text-xs flex-1"
                value={sectionImageUrl}
                onChange={(e) => { setSectionImageUrl(e.target.value); setSectionDirty(true); }}
                placeholder="Image URL"
              />
              <button
                type="button"
                onClick={() => {
                  setPickerTarget('section');
                  setShowMediaPicker(true);
                }}
                className="px-3 py-2 bg-gray-50 border rounded-xl text-xs hover:bg-gray-100 cursor-pointer font-bold"
              >
                Browse
              </button>
            </div>
          </div>
        )}

        {/* Hero Slides Info */}
        {isHero && (
          <div className="p-3 bg-[#faf8f5] border rounded-xl space-y-1.5">
            <h5 className="text-xs font-bold text-[#8B4949]">Hero Slides Config</h5>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Hero slideshow layout details (titles, badges, custom highlights) are fully synced and editable under the central slides editor.
            </p>
          </div>
        )}

        {/* CTA Button config */}
        {isCta && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-[#faf8f5] border rounded-xl">
            <div>
              <label className="admin-label">Button Text</label>
              <input
                type="text"
                className="admin-input text-xs bg-white"
                value={sectionCtaText}
                onChange={(e) => { setSectionCtaText(e.target.value); setSectionDirty(true); }}
              />
            </div>
            <div>
              <label className="admin-label">Button Link</label>
              <input
                type="text"
                className="admin-input text-xs bg-white"
                value={sectionCtaLink}
                onChange={(e) => { setSectionCtaLink(e.target.value); setSectionDirty(true); }}
              />
            </div>
          </div>
        )}
      </div>
    );
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

            {/* ── TAB 1: WEBSITE SECTIONS (VISUAL WYSIWYG EDITOR) ── */}
      {activeTab === 'sections' && (
        <div className="flex flex-col relative bg-[#faf8f5] border border-[#e5e5e5] rounded-3xl overflow-hidden shadow-sm" style={{ minHeight: '680px' }}>
          
          {/* Top Sticky Bar */}
          <div className="sticky top-0 z-40 bg-white border-b border-[#e5e5e5] px-6 py-3.5 flex items-center justify-between flex-wrap gap-4 shadow-sm font-sans">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Page:</span>
              <select
                className="px-3 py-1.5 bg-[#faf8f5] border border-[#e5e5e5] rounded-xl text-xs font-bold text-[#1a1410] focus:ring-1 focus:ring-[#8B4949] focus:outline-none cursor-pointer"
                value={activeVisualPage}
                onChange={(e) => {
                  setActiveVisualPage(e.target.value as any);
                  setActiveVisualSection(null);
                }}
              >
                <option value="home">🏠 Home Page</option>
                <option value="about">ℹ️ About Page</option>
                <option value="contact">📞 Contact Page</option>
                <option value="printed">📃 Printed Luxury Page</option>
              </select>
            </div>

            {/* Mode Switcher */}
            <div className="flex gap-1.5 bg-[#faf8f5] border border-[#e5e5e5] rounded-xl p-1 shadow-xs">
              <button
                type="button"
                onClick={() => { setVisualEditMode(true); setActiveVisualSection(null); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-none ${
                  visualEditMode
                    ? 'bg-[#8B4949] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#8B4949] hover:bg-[#f5f0e8]'
                }`}
              >
                ✏️ Edit Mode
              </button>
              <button
                type="button"
                onClick={() => { setVisualEditMode(false); setActiveVisualSection(null); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-none ${
                  !visualEditMode
                    ? 'bg-[#8B4949] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#8B4949] hover:bg-[#f5f0e8]'
                }`}
              >
                👁️ Preview Mode
              </button>
            </div>

            {/* Save indicator & action */}
            <div className="flex items-center gap-3">
              {sectionDirty && (
                <span className="text-[10px] text-[#b08d23] bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-2 py-0.5 rounded font-bold animate-pulse">
                  Unsaved Changes*
                </span>
              )}
              <button
                type="button"
                onClick={handleSectionSave}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#8B4949] text-white text-xs font-bold rounded-xl shadow-md hover:scale-[1.02] hover:bg-[#723a3a] transition-all cursor-pointer"
              >
                <Save size={12} /> Save Page Changes
              </button>
            </div>
          </div>

          <div className="flex flex-1 relative min-h-[580px]">
            {/* ── MAIN WEBSITE CANVAS (100% full visual preview) ── */}
            <div className="flex-1 overflow-y-auto admin-scrollbar bg-white" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              {activeVisualPage === 'home' && renderVisualHome()}
              {activeVisualPage === 'about' && renderVisualAbout()}
              {activeVisualPage === 'contact' && renderVisualContact()}
              {activeVisualPage === 'printed' && renderVisualPrinted()}
            </div>

            {/* ── SLEEK FLOATING DRAWER (Right sidebar, slides in on click) ── */}
            {activeVisualSection && (
              <div
                className="w-[380px] border-l border-[#e5e5e5] bg-white h-full shadow-2xl flex flex-col justify-between flex-shrink-0 admin-animate-in"
                style={{ height: 'calc(100vh - 280px)', position: 'sticky', top: 0 }}
              >
                {/* Drawer Header */}
                <div className="p-5 border-b border-[#f0f0f0] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-[#1a1410]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                      Edit Section Contents
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Customize texts, images, and layout style</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveVisualSection(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Drawer Scrollable Content Form */}
                <div className="flex-1 overflow-y-auto admin-scrollbar p-5 space-y-4">
                  {renderVisualFormInputs()}
                </div>

                {/* Drawer Footer Status */}
                <div className="p-4 bg-[#faf8f5] border-t border-[#f0f0f0] flex items-center justify-between text-[10px] text-gray-400 font-semibold select-none font-mono">
                  <span>Syncs live on canvas</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                </div>
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
