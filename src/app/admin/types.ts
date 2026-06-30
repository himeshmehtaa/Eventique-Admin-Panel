// Re-export existing types from the main data file
export type { Product, ProductType, OccasionType, Package, Testimonial } from '../data/products';

// ── Hero Slide ───────────────────────────────────────────────
export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  cta1: { text: string; link: string };
  cta2: { text: string; link: string };
  tag: string | null;
  accentBg: string;
  sectionId?: string;
  images?: string[];
  imageUrl?: string;
}

// ── Category ─────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  path: string;
  icon: string;
  image: string;
  description?: string;
}

// ── Service ──────────────────────────────────────────────────
export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  link: string;
}

// ── FAQ ──────────────────────────────────────────────────────
export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// ── Section Config ────────────────────────────────────────────
export interface SectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

// ── Order ─────────────────────────────────────────────────────
export type OrderStatus = 'Processing' | 'Completed' | 'Shipped' | 'Cancelled' | 'Refunded';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';
export type OrderProductType = 'Video Invites' | 'PDF Invites' | 'Event Websites' | 'Printed Invites' | 'Stationery' | 'Gifts';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  productType: OrderProductType;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  createdAt: string;
  updatedAt?: string;
  // Digital orders
  uploadedFileName?: string;
  uploadedFileUrl?: string;
  // Physical orders
  courierName?: string;
  trackingId?: string;
  shippingStatus?: string;
}

// ── Customer ──────────────────────────────────────────────────
export type CustomerStatus = 'Active' | 'Inactive' | 'Blocked';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  status: CustomerStatus;
  joinedAt: string;
  avatar?: string;
}

// ── Review ────────────────────────────────────────────────────
export type ReviewStatus = 'Approved' | 'Pending' | 'Hidden';

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  productName: string;
  rating: number;
  text: string;
  status: ReviewStatus;
  createdAt: string;
}

// ── Promotion ─────────────────────────────────────────────────
export type PromotionStatus = 'Active' | 'Paused' | 'Expired';

export interface Promotion {
  id: string;
  campaignName: string;
  couponCode: string;
  discountType: 'percent' | 'flat';
  discountValue: number;
  validTill: string;
  status: PromotionStatus;
  applicableCategory: string;
  minOrderValue: number;
  usageCount: number;
}

// ── Payment ───────────────────────────────────────────────────
export type PaymentMethod = 'Razorpay' | 'UPI' | 'Card' | 'Manual';

export interface Payment {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  invoiceUrl?: string;
}

// ── Role ──────────────────────────────────────────────────────
export type PermissionKey = 'products' | 'orders' | 'upload_files' | 'contents' | 'customers' | 'payments' | 'settings' | 'promotions' | 'vendors' | 'finance' | 'marketing' | 'leads' | 'corporate';

export interface Role {
  id: string;
  name: string;
  color: string;
  permissions: Record<PermissionKey, boolean>;
  membersCount: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: 'Active' | 'Inactive';
  joinedAt: string;
  salary?: number;
  paymentFrequency?: 'Monthly' | 'Weekly' | 'Hourly';
  phone?: string;
}

// ── Media File ────────────────────────────────────────────────
export type MediaFileType = 'image' | 'video' | 'pdf' | 'zip';

export interface MediaFile {
  id: string;
  name: string;
  type: MediaFileType;
  url: string;
  size: string;
  uploadedAt: string;
  tag?: 'Logos' | 'Sliders' | 'Products' | 'Drafts' | 'Other';
}

// ── Blog Post ────────────────────────────────────────────────
export interface BlogPostContent {
  type: 'paragraph' | 'heading' | 'quote' | 'image';
  text: string;
  image?: string;
}

export interface BlogPost {
  id: number;
  category: string;
  date: string;
  readTime: string;
  title: string;
  subtitle: string;
  image: string;
  description?: string;
  content: BlogPostContent[];
}

// ── Content Block ─────────────────────────────────────────────
export interface ContentBlock {
  id: string;
  sectionName: string;
  title?: string;
  subtitle?: string;
  body?: string;
  enabled: boolean;
  lastUpdated: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  images?: string[];
  
  // Custom section features/badges
  features?: { title: string; desc: string }[];
  badgeText?: string;
  footerText?: string;
  
  // Custom fields for About page editing
  aboutValues?: { icon: string; title: string; desc: string }[];
  aboutStoryPoints?: { title: string; text: string; iconName: string; color: string }[];
  aboutMilestones?: { number: string; label: string; iconName: string }[];
  aboutFounder?: { name: string; role: string; education: string; image: string; bio: string };
  aboutTeam?: { name: string; role: string; education: string; image: string }[];

  // Custom fields for Contact page editing
  contactDetails?: { type: string; title: string; subtitle: string; value: string; linkText?: string; linkUrl?: string }[];
  contactFaqs?: { q: string; a: string }[];
  contactCtaInfo?: { title: string; subtitle: string; detail: string; whatsappNumber?: string; whatsappText?: string };

  // Custom fields for Footer page editing
  footerBrandTagline?: string;
  footerSocialLinks?: { platform: string; url: string }[];
  footerContactInfo?: { phone: string; email: string };

  // Custom section attributes
  customTemplateType?: 'text' | 'hero' | 'grid' | 'faq';
  isCustomSection?: boolean;
}

// ── Activity Log ──────────────────────────────────────────────
export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  detail: string;
  timestamp: string;
  severity?: 'info' | 'success' | 'warning' | 'danger';
}

// ── App Settings ──────────────────────────────────────────────
export interface AppSettings {
  brand: {
    logoUrl: string;
    name: string;
    tagline: string;
    themeColor: string;
    faviconUrl?: string;
    primaryFont?: string;
    secondaryFont?: string;
  };
  seo: {
    siteUrl: string;
    seoTitle: string;
    metaDescription: string;
    keywords: string;
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    socialShareImgUrl?: string;
    robotsTxt?: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    instagram: string;
    facebook: string;
    pinterest: string;
    address: string;
    youtube?: string;
    operatingHours?: string;
    googleMapsEmbed?: string;
  };
  payment: {
    razorpayKey: string;
    gstPercent: number;
    invoicePrefix: string;
    autoInvoice: boolean;
    partialPayment: boolean;
    razorpaySecret?: string;
    currency?: string;
    upiId?: string;
    bankAccountDetails?: string;
    gstinNumber?: string;
  };
  downloads: {
    fileExpiry: number;
    maxDownloads: number;
    allowedTypes: string;
    maxUploadSizeMb: number;
    notifyAfterUpload: boolean;
    requireLogin: boolean;
    watermarkPreviews?: boolean;
    downloadHeadline?: string;
  };
  shipping: {
    defaultCourier: string;
    dispatchDays: number;
    shippingCharge: number;
    freeShippingAbove: number;
    shippingPolicy: string;
    enableIntlShipping?: boolean;
    intlShippingCharge?: number;
    shiprocketUsername?: string;
    shiprocketPassword?: string;
    localPickup?: boolean;
  };
  notifications: {
    newOrderAlert: boolean;
    paymentSuccessEmail: boolean;
    fileUploadedEmail: boolean;
    shippedWhatsapp: boolean;
    alertEmails?: string;
    whatsappApiKey?: string;
    lowStockAlert?: boolean;
    lowStockThreshold?: number;
  };
  security: {
    twoFactor: boolean;
    activityLogs: boolean;
    autoBackup: boolean;
    sessionTimeout?: number;
    ipWhitelist?: string;
    enforceStrongPassword?: boolean;
  };
}

// ── Vendors ───────────────────────────────────────────────────
export type VendorCategory = 'Printed Stationery' | 'Printed Invites' | 'Gifts' | 'Event Planner' | 'Wedding Planner' | 'Corporate Planner';

export interface VendorProduct {
  id: string;
  name: string;
  costPrice: number;
  retailPrice: number;
  pricingType?: 'Product' | 'Package' | 'Fixed Price';
}

export interface Vendor {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  socialId?: string;
  website?: string;
  category: VendorCategory;
  services: string[];
  products: VendorProduct[];
  status?: 'Deal' | 'Closed' | 'Paused';
}

export type VendorOrderStatus = 'Design Given' | 'Printed' | 'Shipped' | 'Delivered';

export interface VendorOrder {
  id: string;
  clientOrderId: string;
  productName: string;
  quantity: number;
  vendorId: string;
  vendorName: string;
  status: VendorOrderStatus;
  sentDate: string;
  trackingNumber?: string;
  notes?: string;
}

// ── Finance & Expenses ─────────────────────────────────────────
export type ExpenseCategory = 'Salary' | 'Vendor Sourcing' | 'Marketing' | 'Software' | 'Other';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  recipientName: string;
  recipientId?: string;
  paymentMethod: 'UPI' | 'Card' | 'Bank Transfer' | 'Cash';
  status: 'Paid' | 'Pending';
  notes?: string;
}

// ── Launch Campaign ───────────────────────────────────────────
export interface LaunchCampaign {
  id: string;
  slug: string;
  title: string;
  productName: string;
  status: 'Draft' | 'Active' | 'Archived';
  accentColor: string;
  theme: 'Royal' | 'Modern' | 'Minimalist' | 'Floral';
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  features: { title: string; desc: string }[];
  gallery: string[];
  videoUrl?: string;
  pricingPackages: { name: string; price: number; features: string[] }[];
  faqs: { q: string; a: string }[];
}

// ── Admin State ───────────────────────────────────────────────
export interface AdminState {
  products: import('../data/products').Product[];
  packages: import('../data/products').Package[];
  testimonials: import('../data/products').Testimonial[];
  faqs: FAQ[];
  heroSlides: HeroSlide[];
  categories: Category[];
  services: Service[];
  sections: SectionConfig[];
  orders: Order[];
  customers: Customer[];
  reviews: Review[];
  promotions: Promotion[];
  payments: Payment[];
  roles: Role[];
  teamMembers: TeamMember[];
  mediaFiles: MediaFile[];
  contentBlocks: ContentBlock[];
  blogPosts: BlogPost[];
  activityLogs: ActivityLog[];
  settings: AppSettings;
  vendors: Vendor[];
  vendorOrders: VendorOrder[];
  expenses: Expense[];
  campaigns: LaunchCampaign[];
  clientLeads: ClientLead[];
  vendorLeads: VendorLead[];
  plannerLeads: PlannerLead[];
  corporateLeads: CorporateLead[];
  corporateOrders: CorporateOrder[];
  jobApplications: JobApplication[];
}

// ── Careers & Job Applications ──────────────────────────────
export interface JobApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  portfolioUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: string;
}

// ── B2C Client Leads ──────────────────────────────────────────
export type ClientLeadTag = 'Invitations' | 'Stationery' | 'Gifts' | 'Corporate';
export type ClientLeadStatus = 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Lost';
export interface ClientLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventType: 'Wedding' | 'Birthday' | 'Corporate' | 'Anniversary' | 'Other';
  interestedProduct: string;
  budget: number;
  source: 'Website Form' | 'WhatsApp' | 'Instagram' | 'Facebook' | 'Referral' | 'Direct Call';
  status: ClientLeadStatus;
  assignedTo: string;
  notes: string;
  tag: ClientLeadTag;
  createdAt: string;
}

// ── B2B Vendor Partner Leads ──────────────────────────────────
export type VendorLeadStatus = 'Deal' | 'Closed' | 'Paused';
export interface VendorLead {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  category: 'Printed Stationery' | 'Printed Invites' | 'Gifts';
  status: VendorLeadStatus;
  expectedMargin: number;
  notes: string;
  createdAt: string;
}

// ── Event Management/Planner Leads ────────────────────────────
export type PlannerLeadStatus = 'Prospect' | 'Active Partnership' | 'Inactive';
export interface PlannerLead {
  id: string;
  agencyName: string;
  contactName: string;
  phone: string;
  email: string;
  commissionRate: number;
  status: PlannerLeadStatus;
  notes: string;
  createdAt: string;
}

// ── B2B Corporate Leads ───────────────────────────────────────
export type CorporateLeadStatus = 'New' | 'Proposal Sent' | 'Negotiation' | 'Lost';
export interface CorporateLead {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  product: string;
  qty: number;
  budget: number;
  status: CorporateLeadStatus;
  notes: string;
  proposalUrl?: string;
  createdAt: string;
}

// ── B2B Corporate Bulk Orders ─────────────────────────────────
export type CorporateOrderStatus = 'Planning' | 'Sourcing' | 'Printing' | 'Packaging' | 'Dispatched' | 'Delivered';
export interface CorporateOrder {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  product: string;
  qty: number;
  pricePerUnit: number;
  total: number;
  gst: string;
  status: CorporateOrderStatus;
  date: string;
}

// ── Form mode ─────────────────────────────────────────────────
export type FormMode = 'create' | 'edit';
