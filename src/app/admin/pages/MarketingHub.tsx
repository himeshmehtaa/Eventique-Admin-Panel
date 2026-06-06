import { useState, useEffect, useMemo } from 'react';
import {
  Megaphone, Users, MessageSquare, Mail, Calendar, BarChart3,
  Search, Plus, Trash2, Edit2, Check, X, Play, Copy,
  LayoutGrid, List, Sparkles, Smartphone, Eye, Send, Info, ArrowUpRight
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { StatsCard } from '../components/StatsCard';

// ── Lead Interface ──────────────────────────────────────────
interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventType: 'Wedding' | 'Birthday' | 'Corporate' | 'Anniversary' | 'Other';
  interestedProduct: string;
  budget: number;
  source: 'Website Form' | 'WhatsApp' | 'Instagram' | 'Facebook' | 'Referral' | 'Direct Call';
  status: 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Lost';
  assignedTo: string;
  notes: string;
  createdAt: string;
}

// ── WhatsApp Campaign Interface ──────────────────────────────
interface WhatsAppCampaign {
  id: string;
  name: string;
  messageType: 'New Collection Launch' | 'Offer Reminder' | 'Wedding Website Promotion' | 'Custom Invite Follow-up' | 'Festival Campaign' | 'Abandoned Inquiry Follow-up';
  targetAudience: 'All Leads' | 'New Leads' | 'Converted Customers' | 'Wedding Customers' | 'Website Inquiry Customers' | 'High Budget Leads';
  messageText: string;
  status: 'Draft' | 'Scheduled' | 'Sent' | 'Paused';
  scheduledDate: string;
  sentCount: number;
  clickCount: number;
}

// ── Email Campaign Interface ─────────────────────────────────
interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  emailType: 'Welcome email' | 'Offer email' | 'New collection email' | 'Abandoned cart email';
  targetAudience: 'All Leads' | 'New Leads' | 'Converted Customers' | 'Wedding Customers' | 'Website Inquiry Customers' | 'High Budget Leads';
  messageText: string;
  status: 'Draft' | 'Scheduled' | 'Sent' | 'Paused';
  scheduledDate: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  couponCode?: string;
}

// ── Social Post Interface ────────────────────────────────────
interface SocialPost {
  id: string;
  title: string;
  platform: 'Instagram' | 'Facebook' | 'Pinterest' | 'YouTube Shorts';
  contentType: 'Reel' | 'Carousel' | 'Story' | 'Static Post' | 'Product Showcase' | 'Testimonial' | 'Offer Post';
  caption: string;
  designStatus: 'Idea' | 'Design Pending' | 'In Design' | 'Ready' | 'Posted';
  assignedDesigner: string;
  postingDate: string;
  mediaPlaceholder?: string;
}

// ── Templates Mappings ──────────────────────────────────────
const WHATSAPP_TEMPLATES = [
  {
    name: 'New Collection Launch',
    text: 'Pranam {{name}}! 🪷 We are delighted to share the exclusive premiere of our new Ganesh Chaturthi video invitation collection. Click below to view the catalog: {{link}}'
  },
  {
    name: 'Wedding Season Offer',
    text: 'Hello {{name}}! ✨ Celebrate your special moments with luxury. Get flat 15% off on all printed invitations and websites for this wedding season. Use code: WEDDING15. Order now: {{link}}'
  },
  {
    name: 'Wedding Website Promotion',
    text: 'Hi {{name}}! 💍 Make your wedding announcement unforgettable. Launch a custom interactive website for your guests with RSVP forms, directions, and galleries. View templates: {{link}}'
  },
  {
    name: 'Custom Invitation Follow-up',
    text: 'Dear {{name}}, we hope you liked the custom invitation layouts we shared on WhatsApp. Please let us know your feedback or if you need any text corrections. Regards, Eventique.'
  },
  {
    name: 'Final Reminder',
    text: 'Hello {{name}}, this is a final reminder that your wedding invitation draft approval is pending. Please review and approve the draft by tonight to avoid shipping delays. Link: {{link}}'
  }
];

const EMAIL_TEMPLATES = [
  {
    name: 'Welcome email',
    subject: 'Welcome to Eventique - Premium Digital Invitations',
    text: 'Hello {{name}}!\n\nWelcome to Eventique. We design luxury digital invitations, premium wedding websites, and custom event stationery that make your special moments memorable.\n\nExplore our catalog here: {{link}}'
  },
  {
    name: 'Offer email',
    subject: '💍 Exclusive Wedding Season Offer - 15% Off',
    text: 'Hello {{name}}!\n\nWedding preparations are in full swing? We have got you covered. Get flat 15% off on our Website + Video invitation packages. Use coupon code: WEDDING15 at checkout.\n\nOrder now: {{link}}'
  },
  {
    name: 'New collection email',
    subject: '🪷 Introducing the Ganesh Chaturthi Premium Collection',
    text: 'Dear {{name}},\n\nWe are excited to share the exclusive premiere of our new Ganesh Chaturthi video invitation designs. Featuring traditional motifs, custom audio transitions, and gold glassmorphic layouts.\n\nView collection: {{link}}'
  },
  {
    name: 'Abandoned cart email',
    subject: 'Still thinking about your Eventique invitation?',
    text: 'Hello {{name}},\n\nWe noticed you left some items in your cart. Your designs are saved and ready! Complete your booking today to secure your event delivery slot.\n\nContinue checkout: {{link}}'
  }
];

export default function MarketingHub() {
  const { state, addActivityLog } = useAdmin();
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'whatsapp' | 'email' | 'social' | 'analytics'>('overview');

  // ── 1. Local Storage Hook States ────────────────────────────
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('eventique_leads');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'L-101', name: 'Amit Sharma', phone: '+91 98765 43210', email: 'amit@gmail.com', eventType: 'Wedding', interestedProduct: 'Premium Video Invite', budget: 25000, source: 'Website Form', status: 'Converted', assignedTo: 'Rohan Verma', notes: 'Shared design drafts. Coupon applied.', createdAt: '2026-06-01' },
      { id: 'L-102', name: 'Neha Gupta', phone: '+91 99999 88888', email: 'neha@yahoo.com', eventType: 'Wedding', interestedProduct: 'Printed Luxury Box Set', budget: 65000, source: 'Instagram', status: 'New', assignedTo: 'Pooja Mehta', notes: 'Requested premium gold theme options.', createdAt: '2026-06-06' },
      { id: 'L-103', name: 'Vikram Singh', phone: '+91 91234 56789', email: 'vikram@outlook.com', eventType: 'Anniversary', interestedProduct: 'Interactive Website', budget: 15000, source: 'WhatsApp', status: 'Contacted', assignedTo: 'Rohan Verma', notes: 'Sent domain mapping pricing list.', createdAt: '2026-06-04' },
      { id: 'L-104', name: 'Priya Patel', phone: '+91 88888 77777', email: 'priya@gmail.com', eventType: 'Corporate', interestedProduct: 'E-Stationery Designs', budget: 30000, source: 'Referral', status: 'Follow-up', assignedTo: 'Pooja Mehta', notes: 'Call scheduled on Monday at 3PM.', createdAt: '2026-06-03' },
      { id: 'L-105', name: 'Rohan Deshmukh', phone: '+91 77777 66666', email: 'rohan@gmail.com', eventType: 'Birthday', interestedProduct: 'E-Card Template', budget: 5000, source: 'Facebook', status: 'Lost', assignedTo: 'Rohan Verma', notes: 'Budget too low for custom assets.', createdAt: '2026-06-02' },
      { id: 'L-106', name: 'Kavita Rao', phone: '+91 98989 88888', email: 'kavita@gmail.com', eventType: 'Wedding', interestedProduct: 'Wedding Website Deluxe', budget: 18000, source: 'Direct Call', status: 'Converted', assignedTo: 'Pooja Mehta', notes: 'Payment confirmed. Live at kavita-wedding.in', createdAt: '2026-06-05' }
    ];
  });

  const [whatsappCampaigns, setWhatsappCampaigns] = useState<WhatsAppCampaign[]>(() => {
    const saved = localStorage.getItem('eventique_wa_campaigns');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'wa-1', name: 'Diwali Invite Promo 2026', messageType: 'Festival Campaign', targetAudience: 'Converted Customers', messageText: 'Pranam {{name}}! 🪷 We wish you a beautiful Diwali. View our collection: {{link}}', status: 'Sent', scheduledDate: '2026-05-10 12:00', sentCount: 480, clickCount: 215 },
      { id: 'wa-2', name: 'Wedding Web Launch', messageType: 'Wedding Website Promotion', targetAudience: 'Wedding Customers', messageText: 'Hi {{name}}! 💍 Make your wedding announcement unforgettable: {{link}}', status: 'Scheduled', scheduledDate: '2026-06-15 10:00', sentCount: 0, clickCount: 0 }
    ];
  });

  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>(() => {
    const saved = localStorage.getItem('eventique_em_campaigns');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'em-1', name: 'Welcome Onboard', subject: 'Welcome to Eventique - Premium Digital Invitations', emailType: 'Welcome email', targetAudience: 'All Leads', messageText: 'Hello {{name}}! Welcome to Eventique...', status: 'Sent', scheduledDate: '2026-06-01 09:00', sentCount: 620, openRate: 48.2, clickRate: 15.6 },
      { id: 'em-2', name: 'Abandoned Cart Nudge', subject: 'Still thinking about your Eventique invitation?', emailType: 'Abandoned cart email', targetAudience: 'Website Inquiry Customers', messageText: 'Hello {{name}}! We noticed you left some items...', status: 'Scheduled', scheduledDate: '2026-06-12 11:30', sentCount: 0, openRate: 0, clickRate: 0 }
    ];
  });

  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => {
    const saved = localStorage.getItem('eventique_social_posts');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'sp-1', title: 'Ganesh Chaturthi Video Invite', platform: 'Instagram', contentType: 'Reel', caption: 'Elegant Ganesh Chaturthi collections are now live! Book today.', designStatus: 'Posted', assignedDesigner: 'Neha Sen', postingDate: '2026-06-05' },
      { id: 'sp-2', title: 'Sharma Wedding Testimonial Card', platform: 'Pinterest', contentType: 'Testimonial', caption: '“Our guests loved the interactive maps!” - Priya & Amit.', designStatus: 'Ready', assignedDesigner: 'Neha Sen', postingDate: '2026-06-08' },
      { id: 'sp-3', title: 'Floral Pastel Motif Showcase', platform: 'Instagram', contentType: 'Carousel', caption: 'Handcrafted floral details representing premium Indian tradition.', designStatus: 'In Design', assignedDesigner: 'Kabir Malhotra', postingDate: '2026-06-10' },
      { id: 'sp-4', title: 'Wax Seal Custom Box Unboxing', platform: 'YouTube Shorts', contentType: 'Product Showcase', caption: 'Unboxing premium gold wax seal invitation sets.', designStatus: 'Idea', assignedDesigner: 'Neha Sen', postingDate: '2026-06-12' }
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('eventique_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('eventique_wa_campaigns', JSON.stringify(whatsappCampaigns));
  }, [whatsappCampaigns]);

  useEffect(() => {
    localStorage.setItem('eventique_em_campaigns', JSON.stringify(emailCampaigns));
  }, [emailCampaigns]);

  useEffect(() => {
    localStorage.setItem('eventique_social_posts', JSON.stringify(socialPosts));
  }, [socialPosts]);

  // ── 2. Modal Controls & Forms ──────────────────────────────
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showEditLeadModal, setShowEditLeadModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Form states for Leads
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadEventType, setLeadEventType] = useState<Lead['eventType']>('Wedding');
  const [leadProduct, setLeadProduct] = useState('');
  const [leadBudget, setLeadBudget] = useState(15000);
  const [leadSource, setLeadSource] = useState<Lead['source']>('Website Form');
  const [leadStatus, setLeadStatus] = useState<Lead['status']>('New');
  const [leadAssigned, setLeadAssigned] = useState('Rohan Verma');
  const [leadNotes, setLeadNotes] = useState('');

  // Form states for WhatsApp Campaigns
  const [showAddWaModal, setShowAddWaModal] = useState(false);
  const [showWaPreview, setShowWaPreview] = useState(false);
  const [selectedWaCampaign, setSelectedWaCampaign] = useState<WhatsAppCampaign | null>(null);
  const [waName, setWaName] = useState('');
  const [waType, setWaType] = useState<WhatsAppCampaign['messageType']>('New Collection Launch');
  const [waAudience, setWaAudience] = useState<WhatsAppCampaign['targetAudience']>('All Leads');
  const [waText, setWaText] = useState('');
  const [waStatus, setWaStatus] = useState<WhatsAppCampaign['status']>('Draft');
  const [waDate, setWaDate] = useState('2026-06-15 10:00');

  // Form states for Email Campaigns
  const [showAddEmModal, setShowAddEmModal] = useState(false);
  const [showEmPreview, setShowEmPreview] = useState(false);
  const [selectedEmCampaign, setSelectedEmCampaign] = useState<EmailCampaign | null>(null);
  const [emName, setEmName] = useState('');
  const [emSubject, setEmSubject] = useState('');
  const [emType, setEmType] = useState<EmailCampaign['emailType']>('Welcome email');
  const [emAudience, setEmAudience] = useState<EmailCampaign['targetAudience']>('All Leads');
  const [emText, setEmText] = useState('');
  const [emStatus, setEmStatus] = useState<EmailCampaign['status']>('Draft');
  const [emDate, setEmDate] = useState('2026-06-15 10:00');

  // Form states for Social Media Planner
  const [showAddSocialModal, setShowAddSocialModal] = useState(false);
  const [selectedSocialPost, setSelectedSocialPost] = useState<SocialPost | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postPlatform, setPostPlatform] = useState<SocialPost['platform']>('Instagram');
  const [postType, setPostType] = useState<SocialPost['contentType']>('Reel');
  const [postCaption, setPostCaption] = useState('');
  const [postDesignStatus, setPostDesignStatus] = useState<SocialPost['designStatus']>('Idea');
  const [postDesigner, setPostDesigner] = useState('Neha Sen');
  const [postDate, setPostDate] = useState('2026-06-10');
  const [socialView, setSocialView] = useState<'kanban' | 'list'>('kanban');

  // ── 3. Filters & Searching ──────────────────────────────────
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsStatusFilter, setLeadsStatusFilter] = useState<'All' | Lead['status']>('All');
  const [leadsSourceFilter, setLeadsSourceFilter] = useState<'All' | Lead['source']>('All');
  const [leadsEventFilter, setLeadsEventFilter] = useState<'All' | Lead['eventType']>('All');

  const [socialPlatformFilter, setSocialPlatformFilter] = useState<'All' | SocialPost['platform']>('All');
  const [socialStatusFilter, setSocialStatusFilter] = useState<'All' | SocialPost['designStatus']>('All');

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchSearch = l.name.toLowerCase().includes(leadsSearch.toLowerCase()) ||
                          l.phone.includes(leadsSearch) ||
                          l.email.toLowerCase().includes(leadsSearch.toLowerCase()) ||
                          l.interestedProduct.toLowerCase().includes(leadsSearch.toLowerCase());
      const matchStatus = leadsStatusFilter === 'All' || l.status === leadsStatusFilter;
      const matchSource = leadsSourceFilter === 'All' || l.source === leadsSourceFilter;
      const matchEvent = leadsEventFilter === 'All' || l.eventType === leadsEventFilter;
      return matchSearch && matchStatus && matchSource && matchEvent;
    });
  }, [leads, leadsSearch, leadsStatusFilter, leadsSourceFilter, leadsEventFilter]);

  // Filtered Social Posts
  const filteredSocialPosts = useMemo(() => {
    return socialPosts.filter(p => {
      const matchPlatform = socialPlatformFilter === 'All' || p.platform === socialPlatformFilter;
      const matchStatus = socialStatusFilter === 'All' || p.designStatus === socialStatusFilter;
      return matchPlatform && matchStatus;
    });
  }, [socialPosts, socialPlatformFilter, socialStatusFilter]);

  // ── 4. Analytics Data Calculations ──────────────────────────
  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const convertedLeadsCount = leads.filter(l => l.status === 'Converted').length;
  const conversionRate = totalLeadsCount > 0 ? ((convertedLeadsCount / totalLeadsCount) * 100).toFixed(1) : '0';
  const activeWhatsAppCampaignsCount = whatsappCampaigns.filter(c => c.status === 'Scheduled' || c.status === 'Sent').length;
  const activeEmailCampaignsCount = emailCampaigns.filter(e => e.status === 'Scheduled' || e.status === 'Sent').length;
  const plannedSocialPostsCount = socialPosts.filter(p => p.designStatus !== 'Posted').length;
  
  const revenueFromLeads = useMemo(() => {
    return leads.filter(l => l.status === 'Converted').reduce((acc, curr) => acc + curr.budget, 0);
  }, [leads]);

  // Leads by source calculations
  const sourcePerformance = useMemo(() => {
    const counts: Record<Lead['source'], number> = {
      'Website Form': 0, 'WhatsApp': 0, 'Instagram': 0, 'Facebook': 0, 'Referral': 0, 'Direct Call': 0
    };
    leads.forEach(l => {
      if (counts[l.source] !== undefined) counts[l.source]++;
    });
    return counts;
  }, [leads]);

  // Leads by status calculations
  const statusPerformance = useMemo(() => {
    const counts: Record<Lead['status'], number> = {
      'New': 0, 'Contacted': 0, 'Follow-up': 0, 'Converted': 0, 'Lost': 0
    };
    leads.forEach(l => {
      if (counts[l.status] !== undefined) counts[l.status]++;
    });
    return counts;
  }, [leads]);

  // Best performing source
  const bestPerformingSource = useMemo(() => {
    const sourceConversions: Record<string, number> = {};
    leads.filter(l => l.status === 'Converted').forEach(l => {
      sourceConversions[l.source] = (sourceConversions[l.source] || 0) + 1;
    });
    let best = 'Website Form';
    let max = 0;
    Object.entries(sourceConversions).forEach(([src, count]) => {
      if (count > max) {
        max = count;
        best = src;
      }
    });
    return { name: best, count: max };
  }, [leads]);

  // ── 5. Handler Operations (CRUD) ────────────────────────────
  
  // Leads Action Handlers
  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim()) return;

    const newLead: Lead = {
      id: `L-${Date.now().toString().slice(-3)}`,
      name: leadName,
      phone: leadPhone,
      email: leadEmail,
      eventType: leadEventType,
      interestedProduct: leadProduct || 'Not Specified',
      budget: Number(leadBudget),
      source: leadSource,
      status: leadStatus,
      assignedTo: leadAssigned,
      notes: leadNotes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setLeads([newLead, ...leads]);
    addActivityLog('Lead Created', `Added lead for ${leadName} (Product: ${newLead.interestedProduct})`, 'success');
    setShowAddLeadModal(false);
    resetLeadForm();
  };

  const handleEditLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    setLeads(leads.map(l => {
      if (l.id === selectedLead.id) {
        return {
          ...l,
          name: leadName,
          phone: leadPhone,
          email: leadEmail,
          eventType: leadEventType,
          interestedProduct: leadProduct,
          budget: Number(leadBudget),
          source: leadSource,
          status: leadStatus,
          assignedTo: leadAssigned,
          notes: leadNotes
        };
      }
      return l;
    }));

    addActivityLog('Lead Modified', `Updated lead profile for ${leadName}`, 'success');
    setShowEditLeadModal(false);
    setSelectedLead(null);
    resetLeadForm();
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('Are you sure you want to delete this lead inquiry?')) {
      setLeads(leads.filter(l => l.id !== id));
      addActivityLog('Lead Removed', `Deleted lead record ${id}`, 'danger');
    }
  };

  const handleQuickStatusChange = (id: string, newStatus: Lead['status']) => {
    setLeads(leads.map(l => {
      if (l.id === id) {
        addActivityLog('Lead Status Updated', `Lead ${l.name} updated to status ${newStatus}`);
        return { ...l, status: newStatus };
      }
      return l;
    }));
  };

  const openEditLead = (l: Lead) => {
    setSelectedLead(l);
    setLeadName(l.name);
    setLeadPhone(l.phone);
    setLeadEmail(l.email);
    setLeadEventType(l.eventType);
    setLeadProduct(l.interestedProduct);
    setLeadBudget(l.budget);
    setLeadSource(l.source);
    setLeadStatus(l.status);
    setLeadAssigned(l.assignedTo);
    setLeadNotes(l.notes);
    setShowEditLeadModal(true);
  };

  const resetLeadForm = () => {
    setLeadName('');
    setLeadPhone('');
    setLeadEmail('');
    setLeadEventType('Wedding');
    setLeadProduct('');
    setLeadBudget(15000);
    setLeadSource('Website Form');
    setLeadStatus('New');
    setLeadAssigned('Rohan Verma');
    setLeadNotes('');
  };

  // WhatsApp Campaign Handlers
  const handleAddWaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waName.trim()) return;

    // Duplicate verification
    const exists = whatsappCampaigns.some(c => c.name.trim().toLowerCase() === waName.trim().toLowerCase());
    if (exists) {
      alert('Error: A WhatsApp Campaign with this name already exists. Duplicate campaigns are not allowed.');
      return;
    }

    const newCamp: WhatsAppCampaign = {
      id: `wa-${Date.now()}`,
      name: waName,
      messageType: waType,
      targetAudience: waAudience,
      messageText: waText,
      status: waStatus,
      scheduledDate: waDate,
      sentCount: waStatus === 'Sent' ? 120 : 0,
      clickCount: 0
    };

    setWhatsappCampaigns([...whatsappCampaigns, newCamp]);
    addActivityLog('WhatsApp Campaign Saved', `Campaign ${waName} added as ${waStatus}`, 'success');
    setShowAddWaModal(false);
    resetWaForm();
  };

  const triggerMarkAsSent = (id: string) => {
    setWhatsappCampaigns(whatsappCampaigns.map(c => {
      if (c.id === id) {
        addActivityLog('WhatsApp Campaign Dispatched', `Broadcasted campaign ${c.name} to all targets`);
        return {
          ...c,
          status: 'Sent',
          sentCount: c.targetAudience === 'All Leads' ? leads.length : 150,
          clickCount: Math.floor(Math.random() * 50) + 10
        };
      }
      return c;
    }));
  };

  const resetWaForm = () => {
    setWaName('');
    setWaType('New Collection Launch');
    setWaAudience('All Leads');
    setWaText(WHATSAPP_TEMPLATES[0].text);
    setWaStatus('Draft');
    setWaDate('2026-06-15 10:00');
  };

  // Email Campaign Handlers
  const handleAddEmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emName.trim()) return;

    // Duplicate verification
    const exists = emailCampaigns.some(c => c.name.trim().toLowerCase() === emName.trim().toLowerCase());
    if (exists) {
      alert('Error: An Email Campaign with this name already exists. Duplicate campaigns are not allowed.');
      return;
    }

    const newCamp: EmailCampaign = {
      id: `em-${Date.now()}`,
      name: emName,
      subject: emSubject || 'Eventique Update',
      emailType: emType,
      targetAudience: emAudience,
      messageText: emText,
      status: emStatus,
      scheduledDate: emDate,
      sentCount: emStatus === 'Sent' ? 850 : 0,
      openRate: emStatus === 'Sent' ? 45.5 : 0,
      clickRate: emStatus === 'Sent' ? 12.2 : 0,
      couponCode: emCoupon || undefined
    };

    setEmailCampaigns([...emailCampaigns, newCamp]);
    addActivityLog('Email Campaign Saved', `Campaign ${emName} added as ${emStatus}`, 'success');
    setShowAddEmModal(false);
    resetEmForm();
  };

  const triggerMarkEmailAsSent = (id: string) => {
    setEmailCampaigns(emailCampaigns.map(c => {
      if (c.id === id) {
        addActivityLog('Email Campaign Sent', `Broadcasted email ${c.name} to targets`);
        return {
          ...c,
          status: 'Sent',
          sentCount: 920,
          openRate: 51.4,
          clickRate: 14.8
        };
      }
      return c;
    }));
  };

  const resetEmForm = () => {
    setEmName('');
    setEmSubject('');
    setEmType('Welcome email');
    setEmAudience('All Leads');
    setEmText(EMAIL_TEMPLATES[0].text);
    setEmStatus('Draft');
    setEmDate('2026-06-15 10:00');
    setEmCoupon('');
  };

  // Social Planner Handlers
  const handleAddSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) return;

    if (selectedSocialPost) {
      // Edit Post
      setSocialPosts(socialPosts.map(p => {
        if (p.id === selectedSocialPost.id) {
          return {
            ...p,
            title: postTitle,
            platform: postPlatform,
            contentType: postType,
            caption: postCaption,
            designStatus: postDesignStatus,
            assignedDesigner: postDesigner,
            postingDate: postDate
          };
        }
        return p;
      }));
      addActivityLog('Social Plan Updated', `Edited content post: ${postTitle}`, 'success');
    } else {
      // Create Post
      const newPost: SocialPost = {
        id: `sp-${Date.now()}`,
        title: postTitle,
        platform: postPlatform,
        contentType: postType,
        caption: postCaption,
        designStatus: postDesignStatus,
        assignedDesigner: postDesigner,
        postingDate: postDate
      };
      setSocialPosts([...socialPosts, newPost]);
      addActivityLog('Social Plan Scheduled', `Added content idea: ${postTitle}`, 'success');
    }

    setShowAddSocialModal(false);
    setSelectedSocialPost(null);
    resetSocialForm();
  };

  const openEditSocial = (p: SocialPost) => {
    setSelectedSocialPost(p);
    setPostTitle(p.title);
    setPostPlatform(p.platform);
    setPostType(p.contentType);
    setPostCaption(p.caption);
    setPostDesignStatus(p.designStatus);
    setPostDesigner(p.assignedDesigner);
    setPostDate(p.postingDate);
    setShowAddSocialModal(true);
  };

  const handleDeleteSocial = (id: string) => {
    if (confirm('Delete this social media planner item?')) {
      setSocialPosts(socialPosts.filter(p => p.id !== id));
      addActivityLog('Social Item Deleted', 'Removed content board entry', 'danger');
    }
  };

  const handleUpdateDesignStatus = (id: string, nextStatus: SocialPost['designStatus']) => {
    setSocialPosts(socialPosts.map(p => {
      if (p.id === id) {
        addActivityLog('Social Design Status Updated', `Post "${p.title}" design status is now ${nextStatus}`);
        return { ...p, designStatus: nextStatus };
      }
      return p;
    }));
  };

  const resetSocialForm = () => {
    setPostTitle('');
    setPostPlatform('Instagram');
    setPostType('Reel');
    setPostCaption('');
    setPostDesignStatus('Idea');
    setPostDesigner('Neha Sen');
    setPostDate('2026-06-10');
  };

  return (
    <div className="space-y-6 admin-animate-in">
      {/* Header Panel */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1410]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Marketing Hub
          </h1>
          <p className="text-sm text-gray-400 mt-0.5 font-medium">Orchestrate Leads, WhatsApp broadcasting, social media posting queues, and performance metrics</p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'leads' && (
            <button
              onClick={() => { resetLeadForm(); setShowAddLeadModal(true); }}
              className="admin-btn admin-btn-primary flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus size={15} />
              <span>Add Lead Inquiry</span>
            </button>
          )}
          {activeTab === 'whatsapp' && (
            <button
              onClick={() => { resetWaForm(); setShowAddWaModal(true); }}
              className="admin-btn admin-btn-primary flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus size={15} />
              <span>Create Campaign</span>
            </button>
          )}
          {activeTab === 'email' && (
            <button
              onClick={() => { resetEmForm(); setShowAddEmModal(true); }}
              className="admin-btn admin-btn-primary flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus size={15} />
              <span>Create Email Campaign</span>
            </button>
          )}
          {activeTab === 'social' && (
            <button
              onClick={() => { resetSocialForm(); setSelectedSocialPost(null); setShowAddSocialModal(true); }}
              className="admin-btn admin-btn-primary flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus size={15} />
              <span>Add Content Post</span>
            </button>
          )}
        </div>
      </div>

      {/* Luxury Tabs */}
      <div className="flex gap-2 bg-white border border-[#e5e5e5] rounded-xl p-1.5 w-fit shadow-sm flex-wrap">
        {[
          { key: 'overview', label: 'Dashboard Overview', icon: Sparkles },
          { key: 'leads', label: 'Leads / Inquiries', icon: Users },
          { key: 'whatsapp', label: 'WhatsApp Campaigns', icon: MessageSquare },
          { key: 'email', label: 'Email Campaigns', icon: Mail },
          { key: 'social', label: 'Social Media Planner', icon: Calendar },
          { key: 'analytics', label: 'Marketing Analytics', icon: BarChart3 }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-[#8B4949] text-white shadow-sm'
                  : 'text-gray-500 hover:text-[#8B4949] hover:bg-[#f5f0e8]'
              }`}
              onClick={() => setActiveTab(tab.key as any)}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── VIEW 1: DASHBOARD SUMMARY OVERVIEW ────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Deck of Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <StatsCard label="Total Leads" value={totalLeadsCount} icon={<Users size={16} />} color="primary" />
            <StatsCard label="New Leads" value={newLeadsCount} icon={<Users size={16} />} color="blue" />
            <StatsCard label="Converted Leads" value={convertedLeadsCount} icon={<Check size={16} />} color="green" />
            <StatsCard label="Conversion Rate" value={`${conversionRate}%`} icon={<ArrowUpRight size={16} />} color="gold" />
            <StatsCard label="Active WhatsApp" value={activeWhatsAppCampaignsCount} icon={<MessageSquare size={16} />} color="primary" />
            <StatsCard label="Active Emails" value={activeEmailCampaignsCount} icon={<Mail size={16} />} color="gold" />
          </div>

          {/* Grid Layout splits */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Recent activity */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Recent Leads */}
              <div className="admin-card p-0 overflow-hidden shadow-xs">
                <div className="px-5 py-3 border-b border-[#f0f0f0] flex justify-between items-center">
                  <h3 className="font-bold text-[#1a1410] text-sm">Recent Leads Inquiries</h3>
                  <button onClick={() => setActiveTab('leads')} className="text-xs font-bold text-[#8B4949] hover:underline flex items-center gap-0.5">
                    View All Leads
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Lead ID</th>
                        <th>Name</th>
                        <th>Event</th>
                        <th>Source</th>
                        <th>Status</th>
                        <th>Created Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.slice(0, 4).map(l => (
                        <tr key={l.id}>
                          <td><span className="font-mono font-bold text-[#8B4949] text-xs">{l.id}</span></td>
                          <td><span className="font-bold text-[#1a1410]">{l.name}</span></td>
                          <td><span className="text-xs font-semibold text-gray-500">{l.eventType}</span></td>
                          <td>
                            <span className="admin-badge admin-badge-info !text-[9px] !py-0.5">
                              {l.source}
                            </span>
                          </td>
                          <td>
                            <span className={`admin-badge !text-[9px] !py-0.5 ${
                              l.status === 'Converted' ? 'admin-badge-success' : l.status === 'Lost' ? 'admin-badge-danger' : 'admin-badge-warning'
                            }`}>
                              {l.status}
                            </span>
                          </td>
                          <td><span className="text-xs text-gray-400 font-medium">{l.createdAt}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* WhatsApp Campaigns widget */}
              <div className="admin-card p-0 overflow-hidden shadow-xs">
                <div className="px-5 py-3 border-b border-[#f0f0f0] flex justify-between items-center">
                  <h3 className="font-bold text-[#1a1410] text-sm">WhatsApp Campaign Status</h3>
                  <button onClick={() => setActiveTab('whatsapp')} className="text-xs font-bold text-[#8B4949] hover:underline">
                    Manage Campaigns
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Campaign</th>
                        <th>Audience</th>
                        <th>Status</th>
                        <th>Sent</th>
                        <th>Clicks</th>
                        <th>CTR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {whatsappCampaigns.slice(0, 3).map(c => (
                        <tr key={c.id}>
                          <td>
                            <span className="font-semibold text-xs text-gray-700 block">{c.name}</span>
                            <span className="text-[9px] text-gray-400 block font-medium">{c.messageType}</span>
                          </td>
                          <td><span className="text-xs font-bold text-gray-500">{c.targetAudience}</span></td>
                          <td>
                            <span className={`admin-badge !text-[9px] !py-0.5 ${
                              c.status === 'Sent' ? 'admin-badge-success' : c.status === 'Scheduled' ? 'admin-badge-warning' : 'admin-badge-info'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td><span className="text-xs font-bold text-gray-700">{c.sentCount}</span></td>
                          <td><span className="text-xs font-bold text-gray-700">{c.clickCount}</span></td>
                          <td>
                            <span className="text-xs font-bold text-[#8B4949]">
                              {c.sentCount > 0 ? `${((c.clickCount/c.sentCount)*100).toFixed(0)}%` : '0%'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column details */}
            <div className="space-y-6">
              
              {/* Upcoming Socials Posts */}
              <div className="admin-card space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f0]">
                  <h3 className="font-bold text-[#1a1410] text-sm">Upcoming Posts</h3>
                  <button onClick={() => setActiveTab('social')} className="text-xs font-bold text-[#8B4949] hover:underline">
                    Open Board
                  </button>
                </div>
                <div className="space-y-3">
                  {socialPosts.filter(p => p.designStatus !== 'Posted').slice(0, 3).map(post => (
                    <div key={post.id} className="bg-[#faf8f5] border border-[#e5e5e5]/50 rounded-xl p-3 flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-[#1a1410] truncate block">{post.title}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">{post.platform} • {post.contentType}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-[10px] block font-bold text-gray-500">{post.postingDate}</span>
                        <span className="admin-badge !text-[8px] !py-0 !px-1.5 mt-1 bg-[#d4af37]/10 text-[#c9a430] uppercase font-bold">
                          {post.designStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Source performance progress bars */}
              <div className="admin-card space-y-4">
                <div>
                  <h3 className="font-bold text-[#1a1410] text-sm">Lead Source Performance</h3>
                  <p className="text-[10px] text-gray-400">Total traffic and lead distributions</p>
                </div>
                <div className="space-y-2">
                  {Object.entries(sourcePerformance).map(([source, count]) => {
                    const pct = totalLeadsCount > 0 ? (count / totalLeadsCount) * 100 : 0;
                    return (
                      <div key={source} className="space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-semibold">
                          <span className="text-gray-600">{source}</span>
                          <span className="text-[#1a1410]">{count} ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#f5f0e8] rounded-full overflow-hidden">
                          <div className="h-full bg-[#8B4949] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW 2: LEADS / INQUIRIES ────────────────────────────── */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#e5e5e5] rounded-xl p-4 shadow-sm">
            <div className="relative flex-1 min-w-[240px]">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="admin-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search leads by customer, contact, or interested product..."
                value={leadsSearch}
                onChange={(e) => setLeadsSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div>
                <select
                  className="admin-select !py-1.5 !px-3 text-xs w-[120px]"
                  value={leadsStatusFilter}
                  onChange={(e) => setLeadsStatusFilter(e.target.value as any)}
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div>
                <select
                  className="admin-select !py-1.5 !px-3 text-xs w-[120px]"
                  value={leadsSourceFilter}
                  onChange={(e) => setLeadsSourceFilter(e.target.value as any)}
                >
                  <option value="All">All Sources</option>
                  <option value="Website Form">Website Form</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Referral">Referral</option>
                  <option value="Direct Call">Direct Call</option>
                </select>
              </div>

              <div>
                <select
                  className="admin-select !py-1.5 !px-3 text-xs w-[120px]"
                  value={leadsEventFilter}
                  onChange={(e) => setLeadsEventFilter(e.target.value as any)}
                >
                  <option value="All">All Events</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Leads Table Card */}
          <div className="admin-card p-0 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Lead ID</th>
                    <th>Customer</th>
                    <th>Event Type</th>
                    <th>Interested Product</th>
                    <th>Budget</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Notes</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-12 text-gray-400 font-medium">
                        No leads found matching current filter settings.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map(l => (
                      <tr key={l.id}>
                        <td><span className="font-mono font-bold text-[#8B4949] text-xs">{l.id}</span></td>
                        <td>
                          <div className="font-bold text-[#1a1410] text-sm">{l.name}</div>
                          <div className="text-[10px] text-gray-400 font-medium">{l.phone} • {l.email}</div>
                        </td>
                        <td>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            {l.eventType}
                          </span>
                        </td>
                        <td><span className="text-xs text-gray-700 font-semibold">{l.interestedProduct}</span></td>
                        <td><span className="text-xs font-bold text-gray-900">₹{l.budget.toLocaleString('en-IN')}</span></td>
                        <td>
                          <span className="admin-badge bg-[#f5f0e8] text-gray-600 font-semibold !text-[9px]">
                            {l.source}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <select
                              value={l.status}
                              onChange={(e) => handleQuickStatusChange(l.id, e.target.value as any)}
                              className={`!py-0.5 !px-1.5 text-[10px] font-bold rounded-lg border-0 cursor-pointer ${
                                l.status === 'Converted' ? 'bg-green-50 text-green-700' :
                                l.status === 'Lost' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Follow-up">Follow-up</option>
                              <option value="Converted">Converted</option>
                              <option value="Lost">Lost</option>
                            </select>
                          </div>
                        </td>
                        <td><span className="text-xs text-gray-500 font-medium">{l.assignedTo}</span></td>
                        <td>
                          <p className="text-xs text-gray-450 truncate max-w-[150px]" title={l.notes}>
                            {l.notes || 'No notes added'}
                          </p>
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditLead(l)}
                              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#8B4949] cursor-pointer"
                              title="Edit Lead"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(l.id)}
                              className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500 cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW 3: WHATSAPP CAMPAIGNS ────────────────────────────── */}
      {activeTab === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="admin-card p-0 overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-[#f0f0f0] flex justify-between items-center">
                <h3 className="font-bold text-[#1a1410] text-sm">Campaigns List</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Campaign Name</th>
                      <th>Type</th>
                      <th>Target Segment</th>
                      <th>Scheduled Date</th>
                      <th>Status</th>
                      <th>Sent</th>
                      <th>Clicks</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {whatsappCampaigns.map(c => (
                      <tr key={c.id}>
                        <td><span className="font-bold text-[#1a1410] text-sm">{c.name}</span></td>
                        <td><span className="text-xs text-gray-500 font-semibold">{c.messageType}</span></td>
                        <td>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#f5f0e8] text-gray-600 font-bold">
                            {c.targetAudience}
                          </span>
                        </td>
                        <td><span className="text-xs text-gray-400 font-medium">{c.scheduledDate}</span></td>
                        <td>
                          <span className={`admin-badge !text-[9px] !py-0.5 ${
                            c.status === 'Sent' ? 'admin-badge-success' : c.status === 'Scheduled' ? 'admin-badge-warning' : 'admin-badge-info'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td><span className="text-xs font-bold text-gray-700">{c.sentCount}</span></td>
                        <td><span className="text-xs font-bold text-gray-700">{c.clickCount}</span></td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {c.status !== 'Sent' && (
                              <button
                                onClick={() => triggerMarkAsSent(c.id)}
                                className="admin-btn admin-btn-outline !py-1 !px-2 text-[10px] flex items-center gap-1 cursor-pointer"
                              >
                                <Send size={9} /> Mark Sent
                              </button>
                            )}
                            <button
                              onClick={() => { setSelectedWaCampaign(c); setShowWaPreview(true); }}
                              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
                              title="Preview Template"
                            >
                              <Eye size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="admin-card space-y-4">
              <h3 className="font-bold text-[#1a1410] text-sm flex items-center gap-2">
                <Info size={16} className="text-[#D4AF37]" /> WhatsApp Campaign Setup
              </h3>
              <p className="text-xs text-gray-450 leading-relaxed font-medium">
                Configure your broadcast templates with dynamic variables like `{"{{name}}"}`. When triggered, the system formats your text and dispatches personal WhatsApp notifications.
              </p>
              <div className="bg-[#faf8f5] border border-[#e5e5e5]/50 rounded-xl p-3 space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Allowed Variables</span>
                <ul className="text-[11px] text-gray-600 space-y-1.5 list-disc pl-4 font-medium">
                  <li>`{"{{name}}"}`: Inserts Lead name</li>
                  <li>`{"{{link}}"}`: Direct checkout link</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW 4: EMAIL CAMPAIGNS ──────────────────────────────── */}
      {activeTab === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="admin-card p-0 overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-[#f0f0f0] flex justify-between items-center">
                <h3 className="font-bold text-[#1a1410] text-sm">Email Campaigns List</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Campaign Name</th>
                      <th>Type</th>
                      <th>Target Segment</th>
                      <th>Status</th>
                      <th>Sent</th>
                      <th>Open Rate</th>
                      <th>CTR</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailCampaigns.map(e => (
                      <tr key={e.id}>
                        <td>
                          <span className="font-bold text-[#1a1410] text-sm block">{e.name}</span>
                          <span className="text-[9px] text-gray-400 font-semibold truncate max-w-[220px] block" title={e.subject}>
                            Subject: {e.subject}
                          </span>
                        </td>
                        <td><span className="text-xs text-gray-500 font-semibold">{e.emailType}</span></td>
                        <td>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#f5f0e8] text-gray-600 font-bold">
                            {e.targetAudience}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-badge !text-[9px] !py-0.5 ${
                            e.status === 'Sent' ? 'admin-badge-success' : e.status === 'Scheduled' ? 'admin-badge-warning' : 'admin-badge-info'
                          }`}>
                            {e.status}
                          </span>
                        </td>
                        <td><span className="text-xs font-bold text-gray-700">{e.sentCount}</span></td>
                        <td>
                          <span className="text-xs font-bold text-gray-700">
                            {e.status === 'Sent' ? `${e.openRate}%` : '—'}
                          </span>
                        </td>
                        <td>
                          <span className="text-xs font-bold text-primary">
                            {e.status === 'Sent' ? `${e.clickRate}%` : '—'}
                          </span>
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {e.status !== 'Sent' && (
                              <button
                                onClick={() => triggerMarkEmailAsSent(e.id)}
                                className="admin-btn admin-btn-outline !py-1 !px-2 text-[10px] flex items-center gap-1 cursor-pointer"
                              >
                                <Send size={9} /> Mark Sent
                              </button>
                            )}
                            <button
                              onClick={() => { setSelectedEmCampaign(e); setShowEmPreview(true); }}
                              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
                              title="Preview Email"
                            >
                              <Eye size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="admin-card space-y-4">
              <h3 className="font-bold text-[#1a1410] text-sm flex items-center gap-2">
                <Info size={16} className="text-[#D4AF37]" /> Email Campaigns Setup
              </h3>
              <p className="text-xs text-gray-450 leading-relaxed font-medium">
                Set up automated promotional newsletter campaigns for different customer demographics. Use templates to match Eventique's luxury branding.
              </p>
              <div className="bg-[#faf8f5] border border-[#e5e5e5]/50 rounded-xl p-3 space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Allowed Variables</span>
                <ul className="text-[11px] text-gray-600 space-y-1.5 list-disc pl-4 font-medium">
                  <li>`{"{{name}}"}`: Recipient Lead name</li>
                  <li>`{"{{link}}"}`: Direct checkout link</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW 5: SOCIAL MEDIA CONTENT PLANNER ──────────────────── */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          {/* Planner filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#e5e5e5] rounded-xl p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <select
                className="admin-select !py-1.5 !px-3 text-xs w-[140px]"
                value={socialPlatformFilter}
                onChange={(e) => setSocialPlatformFilter(e.target.value as any)}
              >
                <option value="All">All Platforms</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Pinterest">Pinterest</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
              </select>

              <select
                className="admin-select !py-1.5 !px-3 text-xs w-[140px]"
                value={socialStatusFilter}
                onChange={(e) => setSocialStatusFilter(e.target.value as any)}
              >
                <option value="All">All Design Statuses</option>
                <option value="Idea">Idea</option>
                <option value="Design Pending">Design Pending</option>
                <option value="In Design">In Design</option>
                <option value="Ready">Ready</option>
                <option value="Posted">Posted</option>
              </select>
            </div>

            <div className="flex items-center bg-[#faf8f5] border border-[#e5e5e5] rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setSocialView('kanban')}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${socialView === 'kanban' ? 'bg-[#8B4949] text-white' : 'text-gray-500'}`}
                title="Board View"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setSocialView('list')}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${socialView === 'list' ? 'bg-[#8B4949] text-white' : 'text-gray-500'}`}
                title="List View"
              >
                <List size={14} />
              </button>
            </div>
          </div>

          {/* Kanban Board Layout */}
          {socialView === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {(['Idea', 'Design Pending', 'In Design', 'Ready', 'Posted'] as SocialPost['designStatus'][]).map(status => {
                const postsInCol = filteredSocialPosts.filter(p => p.designStatus === status);
                return (
                  <div key={status} className="bg-[#faf8f5] border border-[#e5e5e5]/50 rounded-2xl p-4 flex flex-col min-h-[400px]">
                    <div className="flex justify-between items-center pb-2 border-b border-[#e5e5e5] mb-4">
                      <span className="font-bold text-xs text-[#1a1410] uppercase tracking-wider">{status}</span>
                      <span className="bg-[#8B4949]/10 text-[#8B4949] text-[10px] font-bold px-1.5 py-0.5 rounded-full">{postsInCol.length}</span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {postsInCol.map(post => (
                        <div key={post.id} className="bg-white border border-[#e5e5e5] rounded-xl p-3 shadow-xs space-y-2 relative group hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                              {post.platform}
                            </span>
                            <span className="text-[9px] font-semibold text-gray-450">
                              {post.postingDate}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-[#1a1410] leading-snug">{post.title}</h4>
                          <p className="text-[10px] text-gray-450 line-clamp-2">{post.caption}</p>
                          
                          <div className="border-t border-[#f0f0f0] pt-2 flex items-center justify-between">
                            <span className="text-[9px] font-medium text-gray-400">Designer: {post.assignedDesigner}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => openEditSocial(post)}
                                className="w-5 h-5 rounded hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
                              >
                                <Edit2 size={10} />
                              </button>
                              <button
                                onClick={() => handleDeleteSocial(post.id)}
                                className="w-5 h-5 rounded hover:bg-red-50 flex items-center justify-center text-red-500 cursor-pointer"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // List View Layout
            <div className="admin-card p-0 overflow-hidden shadow-xs">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Post Title</th>
                    <th>Platform</th>
                    <th>Content Type</th>
                    <th>Posting Date</th>
                    <th>Designer</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSocialPosts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-400">No scheduled posts found.</td>
                    </tr>
                  ) : (
                    filteredSocialPosts.map(post => (
                      <tr key={post.id}>
                        <td>
                          <div className="font-semibold text-sm text-[#1a1410]">{post.title}</div>
                          <span className="text-[10px] text-gray-450 block line-clamp-1">Caption: {post.caption}</span>
                        </td>
                        <td>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 font-bold rounded">
                            {post.platform}
                          </span>
                        </td>
                        <td><span className="text-xs font-semibold text-gray-500">{post.contentType}</span></td>
                        <td><span className="text-xs text-gray-400 font-medium">{post.postingDate}</span></td>
                        <td><span className="text-xs text-gray-600 font-semibold">{post.assignedDesigner}</span></td>
                        <td>
                          <select
                            value={post.designStatus}
                            onChange={(e) => handleUpdateDesignStatus(post.id, e.target.value as any)}
                            className="!py-0.5 !px-1.5 text-[10px] font-bold rounded-lg border-0 bg-yellow-50 text-yellow-700 cursor-pointer"
                          >
                            <option value="Idea">Idea</option>
                            <option value="Design Pending">Design Pending</option>
                            <option value="In Design">In Design</option>
                            <option value="Ready">Ready</option>
                            <option value="Posted">Posted</option>
                          </select>
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditSocial(post)}
                              className="w-7 h-7 hover:bg-gray-100 rounded flex items-center justify-center text-gray-500 cursor-pointer"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteSocial(post.id)}
                              className="w-7 h-7 hover:bg-red-50 rounded flex items-center justify-center text-red-500 cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── VIEW 6: MARKETING ANALYTICS ─────────────────────────── */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Row Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <StatsCard label="Total Leads" value={totalLeadsCount} icon={<Users size={16} />} color="primary" />
            <StatsCard label="Converted Leads" value={convertedLeadsCount} icon={<Check size={16} />} color="green" />
            <StatsCard label="Conversion Rate" value={`${conversionRate}%`} icon={<ArrowUpRight size={16} />} color="gold" />
            <StatsCard label="WA Campaigns" value={whatsappCampaigns.length} icon={<MessageSquare size={16} />} color="primary" />
            <StatsCard label="Email Campaigns" value={emailCampaigns.length} icon={<Mail size={16} />} color="gold" />
            <StatsCard label="Leads Revenue" value={`₹${revenueFromLeads.toLocaleString('en-IN')}`} icon={<Sparkles size={16} />} color="green" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leads by source progress bars */}
            <div className="admin-card space-y-4">
              <div>
                <h3 className="font-bold text-[#1a1410] text-sm">Leads by Channel Source</h3>
                <p className="text-xs text-gray-450">Volume and performance by customer origin</p>
              </div>
              <div className="space-y-3">
                {Object.entries(sourcePerformance).map(([source, count]) => {
                  const pct = totalLeadsCount > 0 ? (count / totalLeadsCount) * 100 : 0;
                  return (
                    <div key={source} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-gray-700">{source}</span>
                        <span className="text-gray-900">{count} inquiries ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 w-full bg-[#f5f0e8] rounded-full overflow-hidden">
                        <div className="h-full bg-[#8B4949] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leads by status progress bars */}
            <div className="admin-card space-y-4">
              <div>
                <h3 className="font-bold text-[#1a1410] text-sm">Inquiry Stages (Sales Pipeline)</h3>
                <p className="text-xs text-gray-450">Distribution of leads across statuses</p>
              </div>
              <div className="space-y-3">
                {Object.entries(statusPerformance).map(([status, count]) => {
                  const pct = totalLeadsCount > 0 ? (count / totalLeadsCount) * 100 : 0;
                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-gray-700">{status}</span>
                        <span className="text-gray-900">{count} leads ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 w-full bg-[#f5f0e8] rounded-full overflow-hidden">
                        <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Campaign Performance Table */}
            <div className="admin-card p-0 overflow-hidden shadow-xs">
              <div className="px-5 py-3 border-b border-[#f0f0f0]">
                <h3 className="font-bold text-[#1a1410] text-sm">Campaign Click-Through Rates</h3>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Status</th>
                    <th>Audience Size</th>
                    <th>Clicks/Reads</th>
                    <th>CTR %</th>
                  </tr>
                </thead>
                <tbody>
                  {whatsappCampaigns.map(c => (
                    <tr key={c.id}>
                      <td><span className="font-semibold text-xs text-gray-700">{c.name} (WA)</span></td>
                      <td>
                        <span className={`admin-badge !text-[9px] !py-0.5 ${c.status === 'Sent' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td><span className="text-xs font-semibold text-gray-500">{c.status === 'Sent' ? c.sentCount : '—'}</span></td>
                      <td><span className="text-xs font-semibold text-gray-500">{c.status === 'Sent' ? c.clickCount : '—'}</span></td>
                      <td>
                        <span className="text-xs font-bold text-primary">
                          {c.sentCount > 0 ? `${((c.clickCount / c.sentCount) * 100).toFixed(0)}%` : '0%'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {emailCampaigns.map(e => (
                    <tr key={e.id}>
                      <td><span className="font-semibold text-xs text-gray-700">{e.name} (Email)</span></td>
                      <td>
                        <span className={`admin-badge !text-[9px] !py-0.5 ${e.status === 'Sent' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                          {e.status}
                        </span>
                      </td>
                      <td><span className="text-xs font-semibold text-gray-500">{e.status === 'Sent' ? e.sentCount : '—'}</span></td>
                      <td><span className="text-xs font-semibold text-gray-500">{e.status === 'Sent' ? `${e.openRate}% open` : '—'}</span></td>
                      <td>
                        <span className="text-xs font-bold text-primary">
                          {e.status === 'Sent' ? `${e.clickRate}%` : '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Best performing conversion table */}
            <div className="admin-card p-0 overflow-hidden shadow-xs">
              <div className="px-5 py-3 border-b border-[#f0f0f0] flex justify-between items-center">
                <h3 className="font-bold text-[#1a1410] text-sm">Lead Conversion Log</h3>
                <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                  🏆 Top Channel: {bestPerformingSource.name}
                </span>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Event</th>
                    <th>Source</th>
                    <th>Revenue Generated</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.filter(l => l.status === 'Converted').map(l => (
                    <tr key={l.id}>
                      <td><span className="font-semibold text-xs text-gray-800">{l.name}</span></td>
                      <td><span className="text-xs text-gray-500">{l.eventType}</span></td>
                      <td><span className="text-xs text-gray-405 font-semibold">{l.source}</span></td>
                      <td><span className="text-xs font-bold text-green-700 font-mono">₹{l.budget.toLocaleString('en-IN')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD LEAD ──────────────────────────────────────── */}
      {showAddLeadModal && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 admin-animate-in" onClick={() => setShowAddLeadModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-50 overflow-hidden admin-animate-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0ece4]">
              <h3 className="font-bold text-[#1a1410] text-base">Add New Lead Inquiry</h3>
              <button onClick={() => setShowAddLeadModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddLeadSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto admin-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Customer Name *</label>
                  <input type="text" required placeholder="e.g. Amit Sen" className="admin-input" value={leadName} onChange={e => setLeadName(e.target.value)} />
                </div>
                <div>
                  <label className="admin-label">Phone Number *</label>
                  <input type="text" required placeholder="e.g. +91 99999 11111" className="admin-input" value={leadPhone} onChange={e => setLeadPhone(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Email Address</label>
                  <input type="email" placeholder="e.g. amit@gmail.com" className="admin-input" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} />
                </div>
                <div>
                  <label className="admin-label">Event Type</label>
                  <select className="admin-select" value={leadEventType} onChange={e => setLeadEventType(e.target.value as any)}>
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Interested Product</label>
                  <input type="text" placeholder="e.g. Wedding Website Deluxe" className="admin-input" value={leadProduct} onChange={e => setLeadProduct(e.target.value)} />
                </div>
                <div>
                  <label className="admin-label">Estimated Budget (₹)</label>
                  <input type="number" className="admin-input" value={leadBudget} onChange={e => setLeadBudget(Number(e.target.value))} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="admin-label">Lead Source</label>
                  <select className="admin-select" value={leadSource} onChange={e => setLeadSource(e.target.value as any)}>
                    <option value="Website Form">Website Form</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Referral">Referral</option>
                    <option value="Direct Call">Direct Call</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Status</label>
                  <select className="admin-select" value={leadStatus} onChange={e => setLeadStatus(e.target.value as any)}>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Assigned To</label>
                  <select className="admin-select" value={leadAssigned} onChange={e => setLeadAssigned(e.target.value)}>
                    <option value="Rohan Verma">Rohan Verma</option>
                    <option value="Pooja Mehta">Pooja Mehta</option>
                    <option value="Neha Sen">Neha Sen</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="admin-label">Follow-up Notes</label>
                <textarea rows={3} placeholder="Add current details or inquiry requirements..." className="admin-textarea text-xs" value={leadNotes} onChange={e => setLeadNotes(e.target.value)} />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ece4]">
                <button type="button" onClick={() => setShowAddLeadModal(false)} className="admin-btn admin-btn-outline cursor-pointer">Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary cursor-pointer">Add Lead</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── MODAL: EDIT LEAD ─────────────────────────────────────── */}
      {showEditLeadModal && selectedLead && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 admin-animate-in" onClick={() => setShowEditLeadModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-50 overflow-hidden admin-animate-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0ece4]">
              <h3 className="font-bold text-[#1a1410] text-base">Edit Lead Inquiry — {selectedLead.id}</h3>
              <button onClick={() => setShowEditLeadModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleEditLeadSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto admin-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Customer Name *</label>
                  <input type="text" required className="admin-input" value={leadName} onChange={e => setLeadName(e.target.value)} />
                </div>
                <div>
                  <label className="admin-label">Phone Number *</label>
                  <input type="text" required className="admin-input" value={leadPhone} onChange={e => setLeadPhone(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Email Address</label>
                  <input type="email" className="admin-input" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} />
                </div>
                <div>
                  <label className="admin-label">Event Type</label>
                  <select className="admin-select" value={leadEventType} onChange={e => setLeadEventType(e.target.value as any)}>
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Interested Product</label>
                  <input type="text" className="admin-input" value={leadProduct} onChange={e => setLeadProduct(e.target.value)} />
                </div>
                <div>
                  <label className="admin-label">Estimated Budget (₹)</label>
                  <input type="number" className="admin-input" value={leadBudget} onChange={e => setLeadBudget(Number(e.target.value))} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="admin-label">Lead Source</label>
                  <select className="admin-select" value={leadSource} onChange={e => setLeadSource(e.target.value as any)}>
                    <option value="Website Form">Website Form</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Referral">Referral</option>
                    <option value="Direct Call">Direct Call</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Status</label>
                  <select className="admin-select" value={leadStatus} onChange={e => setLeadStatus(e.target.value as any)}>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Assigned To</label>
                  <select className="admin-select" value={leadAssigned} onChange={e => setLeadAssigned(e.target.value)}>
                    <option value="Rohan Verma">Rohan Verma</option>
                    <option value="Pooja Mehta">Pooja Mehta</option>
                    <option value="Neha Sen">Neha Sen</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="admin-label">Follow-up Notes / History</label>
                <textarea rows={3} className="admin-textarea text-xs" value={leadNotes} onChange={e => setLeadNotes(e.target.value)} />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ece4]">
                <button type="button" onClick={() => setShowEditLeadModal(false)} className="admin-btn admin-btn-outline cursor-pointer">Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary cursor-pointer">Save Changes</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── MODAL: CREATE WHATSAPP CAMPAIGN ────────────────────────── */}
      {showAddWaModal && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 admin-animate-in" onClick={() => setShowAddWaModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-50 overflow-hidden admin-animate-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0ece4]">
              <h3 className="font-bold text-[#1a1410] text-base flex items-center gap-1">
                <MessageSquare size={17} className="text-[#8B4949]" /> Create WhatsApp Campaign
              </h3>
              <button onClick={() => setShowAddWaModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddWaSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto admin-scrollbar">
              <div>
                <label className="admin-label">Campaign Name *</label>
                <input type="text" required placeholder="e.g. Wedding Season Sale" className="admin-input" value={waName} onChange={e => setWaName(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Message Type</label>
                  <select className="admin-select" value={waType} onChange={e => setWaType(e.target.value as any)}>
                    <option value="New Collection Launch">New Collection Launch</option>
                    <option value="Offer Reminder">Offer Reminder</option>
                    <option value="Wedding Website Promotion">Wedding Website Promotion</option>
                    <option value="Custom Invite Follow-up">Custom Invite Follow-up</option>
                    <option value="Festival Campaign">Festival Campaign</option>
                    <option value="Abandoned Inquiry Follow-up">Abandoned Inquiry Follow-up</option>
                  </select>
                </div>

                <div>
                  <label className="admin-label">Target Audience</label>
                  <select className="admin-select" value={waAudience} onChange={e => setWaAudience(e.target.value as any)}>
                    <option value="All Leads">All Leads ({leads.length})</option>
                    <option value="New Leads">New Leads ({newLeadsCount})</option>
                    <option value="Converted Customers">Converted Customers ({convertedLeadsCount})</option>
                    <option value="Wedding Customers">Wedding Customers</option>
                    <option value="Website Inquiry Customers">Website Inquiry Customers</option>
                    <option value="High Budget Leads">High Budget Leads</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="admin-label !mb-0">Message Text *</label>
                  <select
                    className="admin-select !py-0.5 !px-2 w-[160px] text-[10px] bg-[#faf8f5]"
                    onChange={(e) => {
                      const idx = Number(e.target.value);
                      if (!isNaN(idx) && WHATSAPP_TEMPLATES[idx]) setWaText(WHATSAPP_TEMPLATES[idx].text);
                    }}
                  >
                    <option value="">Choose Template</option>
                    {WHATSAPP_TEMPLATES.map((tmpl, idx) => (
                      <option key={tmpl.name} value={idx}>{tmpl.name}</option>
                    ))}
                  </select>
                </div>
                <textarea rows={4} required placeholder="Template message details..." className="admin-textarea text-xs" value={waText} onChange={e => setWaText(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Status</label>
                  <select className="admin-select" value={waStatus} onChange={e => setWaStatus(e.target.value as any)}>
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Sent">Sent</option>
                    <option value="Paused">Paused</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Scheduled Date/Time</label>
                  <input type="text" className="admin-input text-xs" placeholder="YYYY-MM-DD HH:MM" value={waDate} onChange={e => setWaDate(e.target.value)} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ece4]">
                <button type="button" onClick={() => setShowAddWaModal(false)} className="admin-btn admin-btn-outline cursor-pointer">Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary cursor-pointer">Create Campaign</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── MODAL: CREATE EMAIL CAMPAIGN ──────────────────────────── */}
      {showAddEmModal && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 admin-animate-in" onClick={() => setShowAddEmModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-50 overflow-hidden admin-animate-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0ece4]">
              <h3 className="font-bold text-[#1a1410] text-base flex items-center gap-1.5">
                <Mail size={17} className="text-[#8B4949]" /> Create Email Campaign
              </h3>
              <button onClick={() => setShowAddEmModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddEmSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto admin-scrollbar">
              <div>
                <label className="admin-label">Campaign Name *</label>
                <input type="text" required placeholder="e.g. Wedding Season Launch" className="admin-input" value={emName} onChange={e => setEmName(e.target.value)} />
              </div>

              <div>
                <label className="admin-label">Email Subject Line *</label>
                <input type="text" required placeholder="e.g. Welcome to Eventique Luxury Invites" className="admin-input text-xs" value={emSubject} onChange={e => setEmSubject(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Email Type</label>
                  <select className="admin-select text-xs" value={emType} onChange={e => {
                    const type = e.target.value as any;
                    setEmType(type);
                    const tmpl = EMAIL_TEMPLATES.find(t => t.name === type);
                    if (tmpl) {
                      setEmSubject(tmpl.subject);
                      setEmText(tmpl.text);
                    }
                  }}>
                    <option value="Welcome email">Welcome email</option>
                    <option value="Offer email">Offer email</option>
                    <option value="New collection email">New collection email</option>
                    <option value="Abandoned cart email">Abandoned cart email</option>
                  </select>
                </div>

                <div>
                  <label className="admin-label">Target Segment</label>
                  <select className="admin-select text-xs" value={emAudience} onChange={e => setEmAudience(e.target.value as any)}>
                    <option value="All Leads">All Leads ({leads.length})</option>
                    <option value="New Leads">New Leads ({newLeadsCount})</option>
                    <option value="Converted Customers">Converted Customers ({convertedLeadsCount})</option>
                    <option value="Wedding Customers">Wedding Customers</option>
                    <option value="Website Inquiry Customers">Website Inquiry Customers</option>
                    <option value="High Budget Leads">High Budget Leads</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="admin-label">Email Message Text *</label>
                <textarea rows={5} required placeholder="Write email body contents..." className="admin-textarea text-xs" value={emText} onChange={e => setEmText(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Status</label>
                  <select className="admin-select" value={emStatus} onChange={e => setEmStatus(e.target.value as any)}>
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Sent">Sent</option>
                    <option value="Paused">Paused</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Scheduled Date/Time</label>
                  <input type="text" className="admin-input text-xs" placeholder="YYYY-MM-DD HH:MM" value={emDate} onChange={e => setEmDate(e.target.value)} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ece4]">
                <button type="button" onClick={() => setShowAddEmModal(false)} className="admin-btn admin-btn-outline cursor-pointer">Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary cursor-pointer">Create Campaign</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── MODAL: EMAIL TEMPLATE PREVIEW ───────────────────────── */}
      {showEmPreview && selectedEmCampaign && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 admin-animate-in" onClick={() => setShowEmPreview(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col p-5 admin-animate-in">
            <div className="flex justify-between items-center w-full pb-3 border-b border-[#f0f0f0] mb-4">
              <span className="font-bold text-xs text-gray-500 uppercase tracking-wider">Email Template Preview</span>
              <button onClick={() => setShowEmPreview(false)} className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer">
                <X size={14} />
              </button>
            </div>

            {/* Email Inbox Preview Pane */}
            <div className="w-full bg-[#faf8f5] border border-[#e5e5e5] rounded-2xl p-4 flex flex-col space-y-3 max-h-[480px] overflow-y-auto admin-scrollbar">
              <div className="border-b border-[#f0f0f0] pb-2 space-y-1">
                <div className="text-xs text-gray-400 font-bold">To: <span className="text-gray-700">amit.sharma@gmail.com</span></div>
                <div className="text-xs text-gray-400 font-bold">Subject: <span className="text-gray-900 font-extrabold">{selectedEmCampaign.subject}</span></div>
                <div className="text-[10px] text-gray-400">From: news@eventique.in</div>
              </div>
              <div className="bg-white border border-[#e5e5e5] rounded-xl p-4 space-y-4">
                <div className="text-center pb-2 border-b border-[#faf8f5]">
                  <span className="text-sm font-bold text-[#8B4949] uppercase tracking-widest font-serif block">Eventique</span>
                  <span className="text-[8px] text-gray-400 tracking-wider">Premium Digital Invites & Event Design Studio</span>
                </div>
                <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedEmCampaign.messageText
                    .replace(/{{name}}/g, 'Amit Sharma')
                    .replace(/{{link}}/g, 'eventique.in/launch/collection')}
                </p>
                <div className="text-center pt-4">
                  <a href="#" className="inline-block bg-[#8B4949] text-white font-bold text-xs px-6 py-2 rounded-lg hover:bg-[#7a3f3f] transition-colors">
                    Explore Luxury Collection
                  </a>
                </div>
              </div>
              <div className="text-[8px] text-gray-400 text-center">
                © 2026 Eventique Inc. • If you wish to unsubscribe, click <span className="underline cursor-pointer">here</span>.
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── MODAL: WHATSAPP TEMPLATE PREVIEW ─────────────────────── */}
      {showWaPreview && selectedWaCampaign && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 admin-animate-in" onClick={() => setShowWaPreview(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col items-center justify-center p-5 admin-animate-in">
            <div className="flex justify-between items-center w-full pb-3 border-b border-[#f0f0f0] mb-4">
              <span className="font-bold text-xs text-gray-500 uppercase tracking-wider">WhatsApp Template Preview</span>
              <button onClick={() => setShowWaPreview(false)} className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer">
                <X size={14} />
              </button>
            </div>

            {/* Phone Screen Mockup */}
            <div className="w-[260px] h-[380px] bg-black rounded-[32px] p-2.5 shadow-xl relative border-[4px] border-gray-800 overflow-hidden flex flex-col">
              <div className="w-20 h-4 bg-gray-900 rounded-full absolute top-1.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                <div className="w-1 h-1 bg-blue-900/60 mr-2" />
                <div className="w-6 h-0.5 bg-gray-800 rounded-full" />
              </div>

              <div className="flex-1 bg-[#efeae2] rounded-[22px] p-2 pt-6 overflow-y-auto flex flex-col justify-end space-y-3 relative">
                <div className="bg-white rounded-xl rounded-tr-none p-2.5 shadow-sm max-w-[95%] self-end border-t-4 border-[#10B981] space-y-1">
                  <span className="text-[8px] font-bold text-[#10B981] block">Template: {selectedWaCampaign.messageType}</span>
                  <p className="text-[10px] text-gray-800 whitespace-pre-wrap leading-tight font-medium">
                    {selectedWaCampaign.messageText
                      .replace(/{{name}}/g, 'Amit Sharma')
                      .replace(/{{link}}/g, 'eventique.in/launch/collection')}
                  </p>
                  <span className="text-[7px] text-gray-400 block text-right mt-1 font-bold">12:30 PM ✓✓</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── MODAL: SCHEDULE SOCIAL MEDIA POST ─────────────────────── */}
      {showAddSocialModal && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 admin-animate-in" onClick={() => setShowAddSocialModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-50 overflow-hidden admin-animate-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0ece4]">
              <h3 className="font-bold text-[#1a1410] text-base flex items-center gap-1.5">
                <Calendar size={17} className="text-[#8B4949]" /> {selectedSocialPost ? 'Edit Scheduled Post' : 'Schedule Content Idea'}
              </h3>
              <button onClick={() => setShowAddSocialModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddSocialSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto admin-scrollbar">
              <div>
                <label className="admin-label">Post Title *</label>
                <input type="text" required placeholder="e.g. Royal Gold Motif Showcase" className="admin-input" value={postTitle} onChange={e => setPostTitle(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Platform</label>
                  <select className="admin-select" value={postPlatform} onChange={e => setPostPlatform(e.target.value as any)}>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Pinterest">Pinterest</option>
                    <option value="YouTube Shorts">YouTube Shorts</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Content Type</label>
                  <select className="admin-select" value={postType} onChange={e => setPostType(e.target.value as any)}>
                    <option value="Reel">Reel</option>
                    <option value="Carousel">Carousel</option>
                    <option value="Story">Story</option>
                    <option value="Static Post">Static Post</option>
                    <option value="Product Showcase">Product Showcase</option>
                    <option value="Testimonial">Testimonial</option>
                    <option value="Offer Post">Offer Post</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="admin-label">Caption Text *</label>
                <textarea rows={3} required placeholder="Post caption & hashtags..." className="admin-textarea text-xs" value={postCaption} onChange={e => setPostCaption(e.target.value)} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="admin-label">Design Status</label>
                  <select className="admin-select" value={postDesignStatus} onChange={e => setPostDesignStatus(e.target.value as any)}>
                    <option value="Idea">Idea</option>
                    <option value="Design Pending">Design Pending</option>
                    <option value="In Design">In Design</option>
                    <option value="Ready">Ready</option>
                    <option value="Posted">Posted</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Designer</label>
                  <select className="admin-select" value={postDesigner} onChange={e => setPostDesigner(e.target.value)}>
                    <option value="Neha Sen">Neha Sen</option>
                    <option value="Kabir Malhotra">Kabir Malhotra</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Posting Date</label>
                  <input type="date" className="admin-input text-xs" value={postDate} onChange={e => setPostDate(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="admin-label">Design File Upload Placeholder</label>
                <div className="border-2 border-dashed border-[#e5e5e5] rounded-xl p-6 text-center bg-[#faf8f5] cursor-pointer hover:border-[#8B4949] transition-colors">
                  <Plus size={20} className="text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500 font-semibold">Select card graphic or video reel</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ece4]">
                <button type="button" onClick={() => setShowAddSocialModal(false)} className="admin-btn admin-btn-outline cursor-pointer">Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary cursor-pointer">Schedule Post</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
