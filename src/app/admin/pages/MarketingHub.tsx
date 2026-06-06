import { useState, useRef } from 'react';
import {
  Megaphone, MessageSquare, Mail, BarChart3, Plus, Send,
  Smartphone, Check, Facebook, Instagram, Tag, HelpCircle,
  Eye, Trash2, Sparkles, Upload, Users, Globe, Play, Info
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { StatsCard } from '../components/StatsCard';

interface WhatsAppCampaign {
  id: string;
  name: string;
  template: string;
  status: 'Sent' | 'Scheduled' | 'Draft';
  targetGroup: string;
  size: number;
  sent: number;
  read: number;
  clicked: number;
  mediaUrl?: string;
  createdAt: string;
}

interface EmailCampaign {
  id: string;
  subject: string;
  previewText: string;
  body: string;
  status: 'Sent' | 'Draft' | 'Scheduled';
  sent: number;
  openRate: number;
  clickRate: number;
  couponCode?: string;
  headerImage?: string;
  createdAt: string;
}

interface MetaAdCampaign {
  id: string;
  name: string;
  campaignTarget: string;
  status: 'Active' | 'Paused' | 'Pending';
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  roas: number;
  startDate: string;
}

export default function MarketingHub() {
  const { state, addActivityLog } = useAdmin();
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email' | 'meta-ads' | 'analytics'>('whatsapp');

  // WhatsApp States
  const [whatsappCampaigns, setWhatsappCampaigns] = useState<WhatsAppCampaign[]>([
    {
      id: 'wa-1',
      name: 'Ganesh Chaturthi Launch Invite',
      template: 'Pranam {{name}}! 🪷 We are delighted to share the exclusive premiere of our new Ganesh Chaturthi video invitation collection. Click below to view the catalog and secure early booking discounts: {{link}}',
      status: 'Sent',
      targetGroup: 'Premium Leads',
      size: 450,
      sent: 450,
      read: 395,
      clicked: 215,
      mediaUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300&auto=format&fit=crop',
      createdAt: '2026-05-15'
    },
    {
      id: 'wa-2',
      name: 'Wedding RSVP Follow-up Reminder',
      template: 'Dear {{name}}, we hope you are doing well. This is a gentle reminder to please confirm your attendance RSVP for the upcoming celebration of {{couple}}. Click to RSVP: {{link}}',
      status: 'Scheduled',
      targetGroup: 'RSVP Pending',
      size: 125,
      sent: 0,
      read: 0,
      clicked: 0,
      createdAt: '2026-06-12'
    }
  ]);
  const [showNewWaModal, setShowNewWaModal] = useState(false);
  const [waName, setWaName] = useState('');
  const [waTemplate, setWaTemplate] = useState('Namaste {{name}}! ✨ We invite you to view our luxury digital invitations. Tap the button below to view: {{link}}');
  const [waTarget, setWaTarget] = useState('All Customers');
  const [waMediaUrl, setWaMediaUrl] = useState('');
  
  // Email States
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([
    {
      id: 'em-1',
      subject: '💍 Unveiling the 2026 Luxury Wedding Website Themes',
      previewText: 'Discover the royal motifs and modern minimalist layouts that couples are loving this season.',
      body: 'Hello {{name}},\n\nWedding preparations are in full swing! At Eventique, we are excited to showcase our newly launched interactive wedding website templates. From animations that reflect traditional Indian heritage to glassmorphic minimalist cards, your invitation will be the talk of the town.\n\nUse the coupon below to get flat 15% off on our Website + Video combo packages.',
      status: 'Sent',
      sent: 1250,
      openRate: 48.2,
      clickRate: 15.6,
      couponCode: 'WEDDING15',
      headerImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop',
      createdAt: '2026-05-20'
    }
  ]);
  const [showNewEmModal, setShowNewEmModal] = useState(false);
  const [emSubject, setEmSubject] = useState('');
  const [emPreview, setEmPreview] = useState('');
  const [emBody, setEmBody] = useState('');
  const [emCoupon, setEmCoupon] = useState('');
  const [emHeaderImage, setEmHeaderImage] = useState('');
  const [emailViewport, setEmailViewport] = useState<'desktop' | 'mobile'>('desktop');

  // Ads States
  const [metaAds, setMetaAds] = useState<MetaAdCampaign[]>([
    {
      id: 'ad-1',
      name: 'Printed Invites - High Intent India',
      campaignTarget: 'Printed Luxury Invites',
      status: 'Active',
      budget: 1500,
      spend: 18450,
      impressions: 142000,
      clicks: 8400,
      leads: 310,
      roas: 4.8,
      startDate: '2026-05-01'
    },
    {
      id: 'ad-2',
      name: 'Video Invites - Metro Cities Lookalikes',
      campaignTarget: 'Video Invites',
      status: 'Active',
      budget: 800,
      spend: 9600,
      impressions: 98000,
      clicks: 6100,
      leads: 195,
      roas: 5.2,
      startDate: '2026-05-10'
    }
  ]);
  const [showNewAdModal, setShowNewAdModal] = useState(false);
  const [adName, setAdName] = useState('');
  const [adTarget, setAdTarget] = useState('Video Invites');
  const [adBudget, setAdBudget] = useState(1000);
  const [adGender, setAdGender] = useState('All');
  const [adAge, setAdAge] = useState('22-38');
  const [adLocation, setAdLocation] = useState('Metro Cities');

  const mediaImages = state.mediaFiles.filter(f => f.type === 'image');
  const activePromotions = state.promotions?.filter(p => p.status === 'Active') || [];
  const launchCampaigns = state.launchCampaigns || [];

  // WhatsApp Submit
  const handleCreateWhatsAppCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waName.trim()) return;

    const size = waTarget === 'All Customers' ? state.customers.length : waTarget === 'RSVP Pending' ? 45 : 120;
    const newCamp: WhatsAppCampaign = {
      id: `wa-${Date.now()}`,
      name: waName,
      template: waTemplate,
      status: 'Draft',
      targetGroup: waTarget,
      size,
      sent: 0,
      read: 0,
      clicked: 0,
      mediaUrl: waMediaUrl || undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setWhatsappCampaigns([newCamp, ...whatsappCampaigns]);
    addActivityLog('WhatsApp Campaign Created', `${waName} - Target: ${waTarget}`, 'success');
    setShowNewWaModal(false);
    setWaName('');
  };

  // WhatsApp Trigger Send Simulation
  const triggerSendWhatsApp = (id: string) => {
    setWhatsappCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        addActivityLog('WhatsApp Campaign Broadcasted', `${c.name} sent to ${c.size} recipients.`, 'success');
        return {
          ...c,
          status: 'Sent',
          sent: c.size,
          read: Math.floor(c.size * 0.88),
          clicked: Math.floor(c.size * 0.45)
        };
      }
      return c;
    }));
  };

  // Email Submit
  const handleCreateEmailCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emSubject.trim()) return;

    const newCamp: EmailCampaign = {
      id: `em-${Date.now()}`,
      subject: emSubject,
      previewText: emPreview,
      body: emBody,
      status: 'Draft',
      sent: 0,
      openRate: 0,
      clickRate: 0,
      couponCode: emCoupon || undefined,
      headerImage: emHeaderImage || undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setEmailCampaigns([newCamp, ...emailCampaigns]);
    addActivityLog('Email Campaign Created', emSubject, 'success');
    setShowNewEmModal(false);
    setEmSubject('');
    setEmPreview('');
    setEmBody('');
  };

  // Email Trigger Send Simulation
  const triggerSendEmail = (id: string) => {
    setEmailCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        addActivityLog('Email Broadcast Sent', `${c.subject} sent to subscribers.`, 'success');
        return {
          ...c,
          status: 'Sent',
          sent: 1450,
          openRate: 45.8,
          clickRate: 12.4
        };
      }
      return c;
    }));
  };

  // Meta Ad Submit
  const handleLaunchMetaAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adName.trim()) return;

    const newAd: MetaAdCampaign = {
      id: `ad-${Date.now()}`,
      name: adName,
      campaignTarget: adTarget,
      status: 'Active',
      budget: adBudget,
      spend: 0,
      impressions: 0,
      clicks: 0,
      leads: 0,
      roas: 0,
      startDate: new Date().toISOString().split('T')[0]
    };

    setMetaAds([newAd, ...metaAds]);
    addActivityLog('Meta Ad Launched', `${adName} (Budget: ₹${adBudget}/day)`, 'success');
    setShowNewAdModal(false);
    setAdName('');
  };

  const handleToggleAdStatus = (id: string) => {
    setMetaAds(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'Active' ? 'Paused' : 'Active';
        addActivityLog('Meta Ad Status Changed', `${a.name} is now ${nextStatus}`);
        return { ...a, status: nextStatus as any };
      }
      return a;
    }));
  };

  // Parsing helper for preview
  const parseWhatsAppPreview = (tmpl: string) => {
    return tmpl
      .replace(/{{name}}/g, 'Neha Sen')
      .replace(/{{couple}}/g, 'Rohan & Ananya')
      .replace(/{{link}}/g, 'eventique.in/l/royal')
      .replace(/{{campaign_name}}/g, 'Ganesh Chaturthi Collection');
  };

  // Count active stats
  const totalLeads = metaAds.reduce((acc, curr) => acc + curr.leads, 0);
  const totalAdSpend = metaAds.reduce((acc, curr) => acc + curr.spend, 0);
  const avgRoas = (metaAds.reduce((acc, curr) => acc + curr.roas, 0) / metaAds.length).toFixed(1);

  return (
    <div className="space-y-6 admin-animate-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1410]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Marketing & Automation Hub
          </h1>
          <p className="text-sm text-gray-400 mt-0.5 font-medium">Create WhatsApp broadcasts, construct newsletter campaigns, and configure paid social ads</p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'whatsapp' && (
            <button
              onClick={() => setShowNewWaModal(true)}
              className="admin-btn admin-btn-primary flex items-center gap-2 cursor-pointer shadow-sm hover:shadow"
            >
              <Plus size={15} />
              <span>New Broadcast</span>
            </button>
          )}
          {activeTab === 'email' && (
            <button
              onClick={() => setShowNewEmModal(true)}
              className="admin-btn admin-btn-primary flex items-center gap-2 cursor-pointer shadow-sm hover:shadow"
            >
              <Plus size={15} />
              <span>Create Newsletter</span>
            </button>
          )}
          {activeTab === 'meta-ads' && (
            <button
              onClick={() => setShowNewAdModal(true)}
              className="admin-btn admin-btn-primary flex items-center gap-2 cursor-pointer shadow-sm hover:shadow"
            >
              <Plus size={15} />
              <span>Launch Meta Ad</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white border border-[#e5e5e5] rounded-xl p-1.5 w-fit shadow-sm">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'whatsapp'
              ? 'bg-[#8B4949] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#8B4949] hover:bg-[#f5f0e8]'
          }`}
          onClick={() => setActiveTab('whatsapp')}
        >
          <MessageSquare size={15} />
          <span>WhatsApp Broadcasts</span>
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'email'
              ? 'bg-[#8B4949] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#8B4949] hover:bg-[#f5f0e8]'
          }`}
          onClick={() => setActiveTab('email')}
        >
          <Mail size={15} />
          <span>Email Campaigns</span>
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'meta-ads'
              ? 'bg-[#8B4949] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#8B4949] hover:bg-[#f5f0e8]'
          }`}
          onClick={() => setActiveTab('meta-ads')}
        >
          <Facebook size={15} />
          <span>Meta Ads Integration</span>
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-[#8B4949] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#8B4949] hover:bg-[#f5f0e8]'
          }`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={15} />
          <span>ROI Analytics</span>
        </button>
      </div>

      {/* ── TAB 1: WHATSAPP BROADCASTS ────────────────────────────── */}
      {activeTab === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="admin-card p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0f0f0]">
                <h3 className="font-bold text-[#1a1410] text-sm">WhatsApp Campaign Logs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Campaign Name</th>
                      <th>Target Segment</th>
                      <th>Audience</th>
                      <th>Delivery / Reads</th>
                      <th>CTR (Clicks)</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {whatsappCampaigns.map(c => (
                      <tr key={c.id}>
                        <td>
                          <div className="font-semibold text-[#1a1410] text-sm">{c.name}</div>
                          <span className="text-[10px] text-gray-400 font-medium">Created: {c.createdAt}</span>
                        </td>
                        <td>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 font-medium text-gray-600">
                            {c.targetGroup}
                          </span>
                        </td>
                        <td><span className="text-sm font-semibold text-gray-700">{c.size}</span></td>
                        <td>
                          {c.status === 'Sent' ? (
                            <div className="space-y-0.5">
                              <div className="text-xs text-[#1a1410] font-medium">Sent: {c.sent}</div>
                              <div className="text-[10px] text-[#4A7C59] font-bold">Read: {c.read} ({(c.read/c.sent*100).toFixed(0)}%)</div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td>
                          {c.status === 'Sent' ? (
                            <div>
                              <span className="text-sm font-semibold text-primary">{c.clicked} clicks</span>
                              <span className="text-[10px] text-gray-400 block font-medium">({(c.clicked/c.read*100).toFixed(0)}% CTR)</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td>
                          <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                            c.status === 'Sent' ? 'bg-green-50 text-green-700' : c.status === 'Scheduled' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="text-right">
                          {c.status !== 'Sent' ? (
                            <button
                              onClick={() => triggerSendWhatsApp(c.id)}
                              className="admin-btn admin-btn-primary !py-1 !px-2.5 text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Play size={10} />
                              Send Now
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 font-semibold flex items-center justify-end gap-1 text-[#4A7C59]">
                              <Check size={12} /> Complete
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Setup Walkthrough Panel */}
          <div className="space-y-6">
            <div className="admin-card space-y-4">
              <h3 className="font-bold text-[#1a1410] text-sm flex items-center gap-2">
                <Info size={16} className="text-[#D4AF37]" /> WhatsApp API Connection
              </h3>
              <div className="bg-[#faf8f5] rounded-xl p-3 border border-[#e5e5e5]/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-600">API Gateway:</span>
                  <span className="text-[#4A7C59] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4A7C59] animate-pulse" /> Connected (Meta Cloud)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-600">Sending Number:</span>
                  <span className="text-gray-700 font-medium">+91 85912 00020</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-600">Monthly Usage:</span>
                  <span className="text-gray-700 font-medium">1,820 / 10,000 free</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Your WhatsApp Business Profile is verified. All messages use approved templates to prevent spam reports.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: EMAIL NEWSLETTER CAMPAIGNS ─────────────────────── */}
      {activeTab === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="admin-card p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0f0f0]">
                <h3 className="font-bold text-[#1a1410] text-sm">Newsletter & Email Logs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Email Subject</th>
                      <th>Date Sent</th>
                      <th>Delivered</th>
                      <th>Open Rate</th>
                      <th>CTR</th>
                      <th>Promo Code</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailCampaigns.map(e => (
                      <tr key={e.id}>
                        <td>
                          <div className="font-semibold text-[#1a1410] text-sm truncate max-w-[200px]">{e.subject}</div>
                          <span className="text-[10px] text-gray-400 block font-medium">Preview: {e.previewText}</span>
                        </td>
                        <td><span className="text-xs text-gray-500 font-semibold">{e.createdAt}</span></td>
                        <td><span className="text-sm font-semibold text-gray-700">{e.status === 'Sent' ? e.sent : 0}</span></td>
                        <td>
                          {e.status === 'Sent' ? (
                            <span className="text-sm font-bold text-gray-700">{e.openRate}%</span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td>
                          {e.status === 'Sent' ? (
                            <span className="text-sm font-bold text-primary">{e.clickRate}%</span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td>
                          {e.couponCode ? (
                            <span className="text-[10px] font-bold bg-[#faf8f5] border border-[#d4af37]/30 text-[#8B4949] px-2 py-0.5 rounded">
                              {e.couponCode}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">None</span>
                          )}
                        </td>
                        <td className="text-right">
                          {e.status !== 'Sent' ? (
                            <button
                              onClick={() => triggerSendEmail(e.id)}
                              className="admin-btn admin-btn-primary !py-1 !px-2.5 text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Play size={10} />
                              Send Now
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 font-semibold flex items-center justify-end gap-1 text-[#4A7C59]">
                              <Check size={12} /> Complete
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Email Integration Panel */}
          <div className="space-y-6">
            <div className="admin-card space-y-4">
              <h3 className="font-bold text-[#1a1410] text-sm flex items-center gap-2">
                <Globe size={16} className="text-[#8B4949]" /> SMTP & Mail Settings
              </h3>
              <div className="bg-[#faf8f5] rounded-xl p-3 border border-[#e5e5e5]/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-600">SMTP Server:</span>
                  <span className="text-[#4A7C59] font-bold">Connected (AWS SES)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-600">Sender Domain:</span>
                  <span className="text-gray-700 font-semibold">newsletters.eventique.in</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-600">Spam Score:</span>
                  <span className="text-[#4A7C59] font-bold">0.8 / 10 (Excellent)</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                All marketing emails include mandatory unsubscribe headers to comply with CAN-SPAM regulations and ensure maximum inbox delivery rates.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: META ADS & SOCIAL INTEGRATIONS ─────────────────── */}
      {activeTab === 'meta-ads' && (
        <div className="space-y-6">
          {/* Spend Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard label="Daily Ads Budget" value={`₹${metaAds.reduce((acc, c) => acc + (c.status === 'Active' ? c.budget : 0), 0)}`} icon={<Facebook size={18} />} color="primary" />
            <StatsCard label="Total Spent" value={`₹${totalAdSpend.toLocaleString('en-IN')}`} icon={<Sparkles size={18} />} color="gold" />
            <StatsCard label="Leads Generated" value={totalLeads} icon={<Users size={18} />} color="green" trend={{ value: 18, label: 'vs last week' }} />
            <StatsCard label="Avg ROAS" value={`${avgRoas}x`} icon={<Tag size={18} />} color="blue" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Meta Ad Campaigns */}
            <div className="lg:col-span-2 admin-card p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0f0f0]">
                <h3 className="font-bold text-[#1a1410] text-sm">Active Meta Ad Campaigns</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ad Campaign Name</th>
                      <th>Target Theme</th>
                      <th>Daily Budget</th>
                      <th>Spend</th>
                      <th>Clicks</th>
                      <th>Leads</th>
                      <th>ROAS</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metaAds.map(a => (
                      <tr key={a.id}>
                        <td>
                          <div className="font-semibold text-[#1a1410] text-sm">{a.name}</div>
                          <span className="text-[10px] text-gray-400 block font-medium">Started: {a.startDate}</span>
                        </td>
                        <td>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f5f0e8] text-[#8B4949]">
                            {a.campaignTarget}
                          </span>
                        </td>
                        <td><span className="text-sm font-semibold text-gray-700">₹{a.budget}/day</span></td>
                        <td><span className="text-sm font-semibold text-gray-700">₹{a.spend.toLocaleString('en-IN')}</span></td>
                        <td>
                          <div className="space-y-0.5">
                            <span className="text-xs font-semibold text-gray-700">{a.clicks} clicks</span>
                            <span className="text-[10px] text-gray-400 block">({((a.clicks/a.impressions)*100).toFixed(1)}% CTR)</span>
                          </div>
                        </td>
                        <td><span className="text-sm font-bold text-gray-700">{a.leads}</span></td>
                        <td><span className="text-sm font-bold text-green-700">{a.roas}x</span></td>
                        <td className="text-right">
                          <button
                            onClick={() => handleToggleAdStatus(a.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                              a.status === 'Active'
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                          >
                            {a.status === 'Active' ? 'Pause' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pixel Status Panel */}
            <div className="space-y-6">
              <div className="admin-card space-y-4">
                <h3 className="font-bold text-[#1a1410] text-sm flex items-center gap-2">
                  <Facebook size={16} className="text-blue-600" /> Tracking Pixels Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-[#faf8f5] p-2.5 rounded-lg border border-[#e5e5e5]/50 text-xs">
                    <span className="font-semibold text-gray-600">Meta Pixel Tag</span>
                    <span className="text-[#4A7C59] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4A7C59] animate-pulse" /> Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-[#faf8f5] p-2.5 rounded-lg border border-[#e5e5e5]/50 text-xs">
                    <span className="font-semibold text-gray-600">Google Analytics (G4)</span>
                    <span className="text-[#4A7C59] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4A7C59] animate-pulse" /> Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-[#faf8f5] p-2.5 rounded-lg border border-[#e5e5e5]/50 text-xs">
                    <span className="font-semibold text-gray-600">Pinterest Tag</span>
                    <span className="text-[#4A7C59] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4A7C59] animate-pulse" /> Active
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Pixels are tracking `Lead` registrations and `Purchase` completions on all customer invitation cards and wedding landing pages.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: MARKETING ANALYTICS GRAPHS ──────────────────────── */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traffic Conversion Sources */}
          <div className="admin-card space-y-5">
            <div>
              <h3 className="font-bold text-[#1a1410] text-sm">Traffic Acquisition Channels</h3>
              <p className="text-xs text-gray-405 mt-0.5">Which platforms drive the most digital invite visits</p>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Instagram Ads', count: 680, pct: 42, color: 'linear-gradient(90deg, #EC4899, #8B5CF6)' },
                { name: 'WhatsApp Invites', count: 480, pct: 30, color: 'linear-gradient(90deg, #10B981, #059669)' },
                { name: 'Google Search (SEO)', count: 280, pct: 18, color: 'linear-gradient(90deg, #3B82F6, #1D4ED8)' },
                { name: 'Email Newsletters', count: 160, pct: 10, color: 'linear-gradient(90deg, #F59E0B, #D97706)' }
              ].map(src => (
                <div key={src.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-gray-700">{src.name}</span>
                    <span className="text-gray-900">{src.count} inquiries ({src.pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#faf8f5] rounded-full overflow-hidden border border-[#e5e5e5]/40">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${src.pct}%`, background: src.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marketing ROI comparison */}
          <div className="admin-card space-y-5">
            <div>
              <h3 className="font-bold text-[#1a1410] text-sm">Channel Efficiency (Avg ROAS)</h3>
              <p className="text-xs text-gray-405 mt-0.5">Return on investment per platform channel</p>
            </div>

            <div className="space-y-4">
              {[
                { name: 'WhatsApp broadcasts', roas: '5.6x', val: 93, color: '#10B981' },
                { name: 'Meta Ads (Facebook/Insta)', roas: '4.8x', val: 80, color: '#3B82F6' },
                { name: 'Email Newsletters', roas: '3.8x', val: 63, color: '#EC4899' },
                { name: 'Google Ads', roas: '2.9x', val: 48, color: '#F59E0B' }
              ].map(ch => (
                <div key={ch.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-gray-700">{ch.name}</span>
                    <span className="text-gray-900 font-bold" style={{ color: ch.color }}>{ch.roas} Return</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#faf8f5] rounded-full overflow-hidden border border-[#e5e5e5]/40">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${ch.val}%`, background: ch.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── NEW WHATSAPP CAMPAIGN MODAL ──────────────────────────── */}
      {showNewWaModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 admin-animate-in" onClick={() => setShowNewWaModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[650px] admin-animate-in">
            {/* Form Side */}
            <form onSubmit={handleCreateWhatsAppCampaign} className="flex-1 p-6 space-y-4 overflow-y-auto admin-scrollbar">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ece4]">
                <h3 className="font-bold text-[#1a1410] text-base">New WhatsApp Campaign</h3>
              </div>

              <div>
                <label className="admin-label">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Video Card Launch"
                  className="admin-input bg-[#faf8f5]"
                  value={waName}
                  onChange={(e) => setWaName(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Message Template Text</label>
                <span className="text-[10px] text-gray-400 block mb-1">
                  Use variables: `{"{{name}}"}` for recipient name, `{"{{link}}"}` for invitation link, `{"{{campaign_name}}"}` for campaign theme.
                </span>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Hello {{name}}! We are thrilled..."
                  className="admin-textarea bg-[#faf8f5] text-xs"
                  value={waTemplate}
                  onChange={(e) => setWaTemplate(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Target Audience Segment</label>
                  <select
                    className="admin-select bg-[#faf8f5]"
                    value={waTarget}
                    onChange={(e) => setWaTarget(e.target.value)}
                  >
                    <option value="All Customers">All Customers ({state.customers.length})</option>
                    <option value="RSVP Pending">RSVP Pending (45)</option>
                    <option value="Premium Leads">Premium Leads (120)</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Attach Cover Graphic</label>
                  <select
                    className="admin-select bg-[#faf8f5]"
                    value={waMediaUrl}
                    onChange={(e) => setWaMediaUrl(e.target.value)}
                  >
                    <option value="">No Graphic Attachment</option>
                    {mediaImages.map(img => (
                      <option key={img.id} value={img.url}>{img.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ece4]">
                <button
                  type="button"
                  onClick={() => setShowNewWaModal(false)}
                  className="admin-btn admin-btn-outline cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary cursor-pointer"
                >
                  Save as Draft
                </button>
              </div>
            </form>

            {/* Mobile Preview Side */}
            <div className="w-full md:w-[320px] bg-[#f5f0e8] border-l border-[#e5e5e5] p-5 flex flex-col items-center justify-center relative flex-shrink-0">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest absolute top-4">Live WhatsApp Preview</span>

              {/* Phone Frame */}
              <div className="w-[260px] h-[480px] bg-black rounded-[32px] p-2.5 shadow-xl relative border-[4px] border-gray-800 mt-6 overflow-hidden flex flex-col">
                {/* Speaker/Camera notch */}
                <div className="w-20 h-4 bg-gray-900 rounded-full absolute top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60 mr-2" />
                  <div className="w-6 h-1 bg-gray-800 rounded-full" />
                </div>

                {/* WhatsApp Chat Area */}
                <div className="flex-1 bg-[#efeae2] rounded-[22px] p-2 pt-6 overflow-y-auto flex flex-col justify-end space-y-3 relative">
                  {/* Chat Message Bubble */}
                  <div className="bg-white rounded-xl rounded-tr-none p-2 shadow-sm max-w-[90%] self-end relative border-t-4 border-[#10B981]">
                    {/* Media preview */}
                    {waMediaUrl && (
                      <img
                        src={waMediaUrl}
                        alt="attachment"
                        className="w-full h-28 object-cover rounded-lg mb-2"
                      />
                    )}
                    <p className="text-[10px] text-gray-800 whitespace-pre-wrap leading-tight">
                      {parseWhatsAppPreview(waTemplate)}
                    </p>
                    <span className="text-[8px] text-gray-400 block text-right mt-1 font-semibold">12:30 PM ✓✓</span>

                    {/* Action buttons */}
                    <div className="border-t border-[#f0f0f0] mt-2 pt-1.5 space-y-1">
                      <div className="w-full py-1 text-center bg-[#f0f9f4] hover:bg-[#e1f5e8] rounded-md text-[9px] font-bold text-[#059669] cursor-pointer flex items-center justify-center gap-1">
                        View Invitation
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── NEW EMAIL NEWSLETTER MODAL ────────────────────────────── */}
      {showNewEmModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 admin-animate-in" onClick={() => setShowNewEmModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[680px] admin-animate-in">
            {/* Form Side */}
            <form onSubmit={handleCreateEmailCampaign} className="flex-1 p-6 space-y-4 overflow-y-auto admin-scrollbar">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ece4]">
                <h3 className="font-bold text-[#1a1410] text-base flex items-center gap-1.5">
                  <Mail size={18} className="text-[#8B4949]" /> Create Newsletter Campaign
                </h3>
              </div>

              <div>
                <label className="admin-label">Subject Line *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🌟 Exclusive Wedding Season Offer — Save 15%"
                  className="admin-input bg-[#faf8f5]"
                  value={emSubject}
                  onChange={(e) => setEmSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Pre-header Preview Text</label>
                <input
                  type="text"
                  placeholder="e.g. Claim your wedding package discount before slots fill up..."
                  className="admin-input bg-[#faf8f5] text-xs"
                  value={emPreview}
                  onChange={(e) => setEmPreview(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Email Message Body (Plain Text / Paragraphs)</label>
                <span className="text-[10px] text-gray-400 block mb-1">
                  Use variable `{"{{name}}"}` to personalize the greeting.
                </span>
                <textarea
                  required
                  rows={5}
                  placeholder="Dear {{name}},\n\nWe are excited to share..."
                  className="admin-textarea bg-[#faf8f5] text-xs"
                  value={emBody}
                  onChange={(e) => setEmBody(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Attached Promo Coupon</label>
                  <select
                    className="admin-select bg-[#faf8f5]"
                    value={emCoupon}
                    onChange={(e) => setEmCoupon(e.target.value)}
                  >
                    <option value="">No Coupon Attached</option>
                    {activePromotions.map(promo => (
                      <option key={promo.id} value={promo.code}>{promo.code} ({promo.discountValue}% Off)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Select Header Banner Graphic</label>
                  <select
                    className="admin-select bg-[#faf8f5]"
                    value={emHeaderImage}
                    onChange={(e) => setEmHeaderImage(e.target.value)}
                  >
                    <option value="">No Header Banner</option>
                    {mediaImages.map(img => (
                      <option key={img.id} value={img.url}>{img.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ece4]">
                <button
                  type="button"
                  onClick={() => setShowNewEmModal(false)}
                  className="admin-btn admin-btn-outline cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary cursor-pointer"
                >
                  Save Campaign
                </button>
              </div>
            </form>

            {/* Email Preview Frame */}
            <div className="w-full md:w-[380px] bg-[#f5f0e8] border-l border-[#e5e5e5] p-5 flex flex-col relative flex-shrink-0">
              <div className="flex justify-between items-center w-full mb-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email Template Preview</span>
                <div className="flex bg-white rounded-lg border border-[#e5e5e5] p-0.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setEmailViewport('desktop')}
                    className={`px-2 py-0.5 rounded-md font-bold cursor-pointer ${emailViewport === 'desktop' ? 'bg-[#8B4949] text-white' : 'text-gray-500'}`}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailViewport('mobile')}
                    className={`px-2 py-0.5 rounded-md font-bold cursor-pointer ${emailViewport === 'mobile' ? 'bg-[#8B4949] text-white' : 'text-gray-500'}`}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              {/* Email Content Sandbox Container */}
              <div className="flex-1 bg-white rounded-xl shadow-lg border border-[#e5e5e5] p-4 overflow-y-auto admin-scrollbar">
                {/* Header graphic */}
                {emHeaderImage ? (
                  <img
                    src={emHeaderImage}
                    alt="banner"
                    className="w-full h-24 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-12 bg-[#faf8f5] border border-dashed border-[#e5e5e5] rounded-lg mb-4 flex items-center justify-center text-[10px] text-gray-400">
                    No Graphic Selected
                  </div>
                )}

                {/* Email content */}
                <div className="space-y-3">
                  <div className="space-y-0.5 pb-2 border-b border-[#f0f0f0]">
                    <div className="text-[10px] text-gray-400 font-bold">Subject: {emSubject || '(Enter subject)'}</div>
                    <div className="text-[8px] text-gray-400">From: news@eventique.in</div>
                  </div>

                  <p className="text-[11px] text-gray-700 whitespace-pre-wrap leading-normal font-medium">
                    {emBody ? emBody.replace(/{{name}}/g, 'Neha Sen') : 'Dear Neha Sen,\n\n(Write message body)'}
                  </p>

                  {/* Coupon card */}
                  {emCoupon && (
                    <div className="bg-[#faf8f5] border border-dashed border-[#d4af37]/40 rounded-xl p-3.5 text-center space-y-2">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your Exclusive Promo Code</div>
                      <div className="inline-block px-3 py-1 font-mono text-xs font-bold bg-[#8B4949] text-white rounded-md">
                        {emCoupon}
                      </div>
                      <div className="text-[8px] text-gray-400">Apply at checkout to claim your discount.</div>
                    </div>
                  )}

                  {/* Footer links */}
                  <div className="text-[8px] text-gray-400 text-center pt-5 border-t border-[#f0f0f0]">
                    © 2026 Eventique Design Studio. All rights reserved.<br />
                    Want to change how you receive emails? <span className="underline cursor-pointer">Unsubscribe</span> here.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── NEW META AD CAMPAIGN MODAL ───────────────────────────── */}
      {showNewAdModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 admin-animate-in" onClick={() => setShowNewAdModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden admin-animate-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0ece4]">
              <h3 className="font-bold text-[#1a1410] text-base flex items-center gap-1.5">
                <Facebook size={18} className="text-blue-600" /> Launch Social Ad Campaign
              </h3>
            </div>
            <form onSubmit={handleLaunchMetaAd} className="p-6 space-y-4">
              <div>
                <label className="admin-label">Ad Campaign Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Luxury Wedding Stationery - Festive Target"
                  className="admin-input bg-[#faf8f5]"
                  value={adName}
                  onChange={(e) => setAdName(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Target Page Theme / Occasion</label>
                <select
                  className="admin-select bg-[#faf8f5]"
                  value={adTarget}
                  onChange={(e) => setAdTarget(e.target.value)}
                >
                  <option value="Printed Luxury Invites">Printed Luxury Invites</option>
                  <option value="Video Invites">Video Invites</option>
                  <option value="Event Websites">Event Websites</option>
                  <option value="Stationery">Stationery</option>
                  {launchCampaigns.map(lc => (
                    <option key={lc.id} value={lc.title}>{lc.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="admin-label">Daily Budget (₹) *</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="500"
                    className="flex-grow accent-[#8B4949]"
                    value={adBudget}
                    onChange={(e) => setAdBudget(Number(e.target.value))}
                  />
                  <span className="text-sm font-bold text-gray-700 w-20 text-right">₹{adBudget}/day</span>
                </div>
              </div>

              <div className="border-t border-[#f0ece4] pt-3 mt-2 space-y-3">
                <label className="admin-label block text-xs font-bold text-[#1a1410]">Audience Targeting</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Age Group</label>
                    <select
                      className="admin-select bg-[#faf8f5] mt-1 !text-xs"
                      value={adAge}
                      onChange={(e) => setAdAge(e.target.value)}
                    >
                      <option value="22-38">22 - 38 yrs (Couples)</option>
                      <option value="25-50">25 - 50 yrs (Parents/Family)</option>
                      <option value="18-50">18 - 50 yrs (Broad)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Locations</label>
                    <select
                      className="admin-select bg-[#faf8f5] mt-1 !text-xs"
                      value={adLocation}
                      onChange={(e) => setAdLocation(e.target.value)}
                    >
                      <option value="Metro Cities">Top Metros (MUM/DEL/BLR)</option>
                      <option value="All India">All India</option>
                      <option value="Custom Zone">Custom High Net Worth Zones</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ece4]">
                <button
                  type="button"
                  onClick={() => setShowNewAdModal(false)}
                  className="admin-btn admin-btn-outline cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary cursor-pointer flex items-center gap-1.5"
                >
                  <Send size={13} />
                  Launch Ad Campaign
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
