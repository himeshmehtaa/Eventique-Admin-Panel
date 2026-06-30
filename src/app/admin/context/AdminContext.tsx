import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { products as defaultProducts, packages as defaultPackages, testimonials as defaultTestimonials, faqs as defaultFaqs } from '../../data/products';
import type { Product, Package, Testimonial } from '../../data/products';
import type {
  FAQ, HeroSlide, Category, Service, SectionConfig, AdminState,
  Order, Customer, Review, Promotion, Payment, Role, MediaFile,
  ContentBlock, ActivityLog, AppSettings, PermissionKey, TeamMember,
  BlogPost, Vendor, VendorOrder, Expense, ExpenseCategory,
  ClientLead, VendorLead, PlannerLead, CorporateLead, CorporateOrder,
  JobApplication
} from '../types';

const defaultHeroSlides: HeroSlide[] = [
  { id: 'hero-1', badge: '🌺 Personalized Digital Invitations', title: 'Celebrate Every Moment with', highlight: 'Elegance', subtitle: 'Create stunning digital invitations, beautiful event websites, and premium stationery for all your celebrations.', cta1: { text: 'Explore Designs', link: '/events' }, cta2: { text: 'View Packages', link: '/events?tab=packages' }, tag: null, accentBg: 'from-[#faf8f5] via-white to-[#fff5f0]' },
  { id: 'hero-2', badge: '✨ Just Launched', title: 'Discover Our Latest', highlight: 'New Arrivals', subtitle: 'Be among the first to celebrate with our freshest designs.', cta1: { text: 'Shop New Arrivals', link: '/events' }, cta2: { text: 'Browse Occasions', link: '/category/wedding' }, tag: '🆕 New Launch', accentBg: 'from-[#fff5f0] via-white to-[#faf5e6]' },
  { id: 'hero-3', badge: '🎉 Limited Time Offer', title: 'Exclusive Festive', highlight: 'Deals & Savings', subtitle: 'Save up to 30% on video invitations, event websites, and premium stationery bundles.', cta1: { text: 'View Packages', link: '/events?tab=packages' }, cta2: { text: 'Contact for Custom', link: '/contact' }, tag: '💰 Up to 30% Off', accentBg: 'from-[#faf5e6] via-white to-[#fff5f0]' },
  // Explore Designs Slides
  {
    id: 'explore-slide-1',
    sectionId: 'Explore Designs',
    badge: '✨ Premium Collection',
    title: 'Explore Our',
    highlight: 'Designs',
    subtitle: 'Browse hundreds of premium invitation designs for every occasion.',
    cta1: { text: 'View Catalog', link: '/events' },
    cta2: { text: 'Request Custom Quote', link: '/contact' },
    tag: null,
    accentBg: 'from-[#faf8f5] via-white to-[#fff5f0]',
    images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800']
  },
  // Video Invites Slides
  {
    id: 'video-slide-1',
    sectionId: 'Video Invites',
    badge: '🎬 Animated E-Invites',
    title: 'Video',
    highlight: 'Invitations',
    subtitle: 'Stunning animated invites that captivate your guests and tell your love story in motion.',
    cta1: { text: 'Explore Designs', link: '/events' },
    cta2: { text: 'Request Custom Quote', link: '/contact' },
    tag: '🎥 Video',
    accentBg: 'from-[#fff5f0] via-white to-[#faf5e6]',
    images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800']
  },
  // Event Websites Slides
  {
    id: 'website-slide-1',
    sectionId: 'Event Websites',
    badge: '💻 Personalized Portals',
    title: 'Your Event, Your',
    highlight: 'Website',
    subtitle: 'Create a beautiful personalized website for your celebration to manage RSVPs and share details effortlessly.',
    cta1: { text: 'Create Website', link: '/event-websites' },
    cta2: { text: 'Request Custom Quote', link: '/contact' },
    tag: '🌐 Custom Domain',
    accentBg: 'from-[#faf5e6] via-white to-[#fff5f0]',
    images: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800']
  },
  // Stationery Slides
  {
    id: 'stationery-slide-1',
    sectionId: 'Stationery',
    badge: '✉️ Celebrate in Style',
    title: 'Premium',
    highlight: 'Stationery',
    subtitle: 'Complete matching print-ready designs for your big day, from menus to thank-you cards and tags.',
    cta1: { text: 'Order Stationery', link: '/stationery' },
    cta2: { text: 'Request Custom Quote', link: '/contact' },
    tag: '✍️ Bespoke typography',
    accentBg: 'from-[#faf8f5] via-white to-[#fff5f0]',
    images: ['https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800']
  },
  // Printed Luxury Invites Slides
  {
    id: 'printed-slide-1',
    sectionId: 'Printed Luxury Invites',
    badge: '👑 Premium Collection',
    title: 'Printed Luxury',
    highlight: 'Invitations',
    subtitle: 'Experience the finest craftsmanship with our premium printed wedding invitations. Each piece is meticulously designed with luxurious materials and exquisite finishes.',
    cta1: { text: 'Explore Collection', link: '/events' },
    cta2: { text: 'Request Samples', link: '/contact' },
    tag: '✨ Foil & Wax Seals',
    accentBg: 'from-[#fff5f0] via-white to-[#faf5e6]',
    images: ['https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800']
  },
];

const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Wedding', path: '/category/wedding', icon: '💐', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&fit=crop' },
  { id: 'cat-2', name: 'Engagement', path: '/category/engagement', icon: '💍', image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&fit=crop' },
  { id: 'cat-3', name: 'Birthday', path: '/category/birthday', icon: '🎂', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&fit=crop' },
  { id: 'cat-4', name: 'Baby Shower', path: '/category/baby-shower', icon: '👶', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&fit=crop' },
  { id: 'cat-5', name: 'Pooja', path: '/category/pooja', icon: '🙏', image: 'https://images.unsplash.com/photo-1680490964983-ca02f691960f?w=600&fit=crop' },
  { id: 'cat-6', name: 'Anniversary', path: '/category/anniversary', icon: '💑', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&fit=crop' },
];

const defaultServices: Service[] = [
  { id: 'svc-1', title: 'Digital Invites', description: 'Video Invites & PDF Invites', iconName: 'Video', link: '/events' },
  { id: 'svc-2', title: 'Printed Luxury Invites', description: 'Premium quality printed invitations', iconName: 'Printer', link: '/events' },
  { id: 'svc-3', title: 'Event Websites', description: 'Beautiful personalized websites', iconName: 'Globe', link: '/event-websites' },
  { id: 'svc-4', title: 'Wedding Stationery', description: 'Print-ready designs', iconName: 'FileText', link: '/stationery' },
  { id: 'svc-5', title: 'Curated Gifts', description: 'Personalized hampers & keepsakes', iconName: 'Gift', link: '/gifts' },
];

const defaultSections: SectionConfig[] = [
  { id: 'hero', name: 'Hero Carousel', enabled: true, order: 0 },
  { id: 'product-showcase', name: 'Product Showcase', enabled: true, order: 1 },
  { id: 'printed-invites', name: 'Printed Luxury Invites', enabled: true, order: 2 },
  { id: 'categories', name: 'Browse by Occasion', enabled: true, order: 3 },
  { id: 'product-carousel', name: 'Product Carousel', enabled: true, order: 4 },
  { id: 'services', name: 'Our Services', enabled: true, order: 5 },
  { id: 'how-it-works', name: 'How It Works', enabled: true, order: 6 },
  { id: 'testimonials', name: 'Testimonials', enabled: true, order: 7 },
  { id: 'cta', name: 'Call to Action', enabled: true, order: 8 },
];

// ── Mock Orders ─────────────────────────────────────────────
const getOffsetDateString = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().split('T')[0];
};

const defaultOrders: Order[] = [
  { id: 'ORD-001', customerId: 'c1', customerName: 'Priya Sharma', customerEmail: 'priya@example.com', productName: 'Royal Wedding Video Invite', productType: 'Video Invites', status: 'Processing', paymentStatus: 'Paid', amount: 125000, createdAt: getOffsetDateString(0) },
  { id: 'ORD-002', customerId: 'c2', customerName: 'Rahul Mehta', customerEmail: 'rahul@example.com', productName: 'Floral PDF Invite', productType: 'PDF Invites', status: 'Completed', paymentStatus: 'Paid', amount: 45000, createdAt: getOffsetDateString(1), uploadedFileName: 'floral-invite-rahul.pdf', uploadedFileUrl: '#' },
  { id: 'ORD-003', customerId: 'c3', customerName: 'Anjali Kapoor', customerEmail: 'anjali@example.com', productName: 'Wedding Website Deluxe', productType: 'Event Websites', status: 'Processing', paymentStatus: 'Paid', amount: 149999, createdAt: getOffsetDateString(3) },
  { id: 'ORD-004', customerId: 'c4', customerName: 'Vikram Nair', customerEmail: 'vikram@example.com', productName: 'Gold Foil Printed Invite (50 pcs)', productType: 'Printed Invites', status: 'Shipped', paymentStatus: 'Paid', amount: 265000, createdAt: getOffsetDateString(5), courierName: 'Delhivery', trackingId: 'DL89034521', shippingStatus: 'In Transit' },
  { id: 'ORD-005', customerId: 'c5', customerName: 'Sneha Joshi', customerEmail: 'sneha@example.com', productName: 'Premium Gift Hamper', productType: 'Gifts', status: 'Shipped', paymentStatus: 'Paid', amount: 132000, createdAt: getOffsetDateString(12), courierName: 'BlueDart', trackingId: 'BD1234567', shippingStatus: 'Delivered' },
  { id: 'ORD-006', customerId: 'c1', customerName: 'Priya Sharma', customerEmail: 'priya@example.com', productName: 'Wedding Stationery Set', productType: 'Stationery', status: 'Processing', paymentStatus: 'Pending', amount: 18000, createdAt: getOffsetDateString(20) },
  { id: 'ORD-007', customerId: 'c6', customerName: 'Arjun Patel', customerEmail: 'arjun@example.com', productName: 'Ethnic E-Invitation', productType: 'PDF Invites', status: 'Cancelled', paymentStatus: 'Refunded', amount: 5999, createdAt: getOffsetDateString(45) },
  { id: 'ORD-008', customerId: 'c7', customerName: 'Meera Iyer', customerEmail: 'meera@example.com', productName: 'Anniversary Video Invite', productType: 'Video Invites', status: 'Completed', paymentStatus: 'Paid', amount: 19999, createdAt: getOffsetDateString(90), uploadedFileName: 'anniversary-meera.mp4', uploadedFileUrl: '#' },
];

// ── Mock Customers ──────────────────────────────────────────
const defaultCustomers: Customer[] = [
  { id: 'c1', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43210', ordersCount: 3, totalSpent: 143000, status: 'Active', joinedAt: '2026-03-15' },
  { id: 'c2', name: 'Rahul Mehta', email: 'rahul@example.com', phone: '+91 87654 32109', ordersCount: 1, totalSpent: 45000, status: 'Active', joinedAt: '2026-04-02' },
  { id: 'c3', name: 'Anjali Kapoor', email: 'anjali@example.com', phone: '+91 76543 21098', ordersCount: 2, totalSpent: 149999, status: 'Active', joinedAt: '2026-02-20' },
  { id: 'c4', name: 'Vikram Nair', email: 'vikram@example.com', phone: '+91 65432 10987', ordersCount: 1, totalSpent: 265000, status: 'Active', joinedAt: '2026-04-18' },
  { id: 'c5', name: 'Sneha Joshi', email: 'sneha@example.com', phone: '+91 54321 09876', ordersCount: 2, totalSpent: 132000, status: 'Inactive', joinedAt: '2026-01-10' },
  { id: 'c6', name: 'Arjun Patel', email: 'arjun@example.com', phone: '+91 43210 98765', ordersCount: 1, totalSpent: 0, status: 'Active', joinedAt: '2026-05-01' },
  { id: 'c7', name: 'Meera Iyer', email: 'meera@example.com', phone: '+91 32109 87654', ordersCount: 1, totalSpent: 19999, status: 'Active', joinedAt: '2026-03-22' },
];

// ── Mock Reviews ────────────────────────────────────────────
const defaultReviews: Review[] = [
  { id: 'r1', customerId: 'c1', customerName: 'Priya Sharma', productName: 'Royal Wedding Video Invite', rating: 5, text: 'Absolutely stunning! Our guests loved it.', status: 'Approved', createdAt: '2026-05-15' },
  { id: 'r2', customerId: 'c2', customerName: 'Rahul Mehta', productName: 'Floral PDF Invite', rating: 4, text: 'Beautiful design, delivered on time.', status: 'Approved', createdAt: '2026-05-12' },
  { id: 'r3', customerId: 'c3', customerName: 'Anjali Kapoor', productName: 'Wedding Website Deluxe', rating: 5, text: 'The website was gorgeous. Got so many compliments!', status: 'Pending', createdAt: '2026-05-14' },
  { id: 'r4', customerId: 'c7', customerName: 'Meera Iyer', productName: 'Anniversary Video Invite', rating: 3, text: 'Good quality but took a bit longer than expected.', status: 'Pending', createdAt: '2026-05-10' },
];

// ── Mock Promotions ─────────────────────────────────────────
const defaultPromotions: Promotion[] = [
  { id: 'promo-1', campaignName: 'Summer Celebration Sale', couponCode: 'SUMMER25', discountType: 'percent', discountValue: 25, validTill: '2026-06-30', status: 'Active', applicableCategory: 'All', minOrderValue: 1500, usageCount: 42 },
  { id: 'promo-2', campaignName: 'Wedding Season Special', couponCode: 'WEDDING500', discountType: 'flat', discountValue: 500, validTill: '2026-07-31', status: 'Active', applicableCategory: 'Video Invites', minOrderValue: 2000, usageCount: 18 },
  { id: 'promo-3', campaignName: 'New User Welcome', couponCode: 'WELCOME10', discountType: 'percent', discountValue: 10, validTill: '2026-12-31', status: 'Paused', applicableCategory: 'All', minOrderValue: 0, usageCount: 87 },
  { id: 'promo-4', campaignName: 'Republic Day Offer', couponCode: 'REPUBLIC20', discountType: 'percent', discountValue: 20, validTill: '2026-01-26', status: 'Expired', applicableCategory: 'All', minOrderValue: 1000, usageCount: 134 },
];

// ── Mock Payments ───────────────────────────────────────────
const defaultPayments: Payment[] = [
  { id: 'PAY-001', orderId: 'ORD-001', customerName: 'Priya Sharma', amount: 125000, method: 'Razorpay', status: 'Paid', date: getOffsetDateString(0) },
  { id: 'PAY-002', orderId: 'ORD-002', customerName: 'Rahul Mehta', amount: 45000, method: 'UPI', status: 'Paid', date: getOffsetDateString(1) },
  { id: 'PAY-003', orderId: 'ORD-003', customerName: 'Anjali Kapoor', amount: 149999, method: 'Card', status: 'Paid', date: getOffsetDateString(3) },
  { id: 'PAY-004', orderId: 'ORD-004', customerName: 'Vikram Nair', amount: 265000, method: 'Razorpay', status: 'Paid', date: getOffsetDateString(5) },
  { id: 'PAY-005', orderId: 'ORD-005', customerName: 'Sneha Joshi', amount: 132000, method: 'UPI', status: 'Paid', date: getOffsetDateString(12) },
  { id: 'PAY-006', orderId: 'ORD-006', customerName: 'Priya Sharma', amount: 18000, method: 'Razorpay', status: 'Pending', date: getOffsetDateString(20) },
  { id: 'PAY-007', orderId: 'ORD-007', customerName: 'Arjun Patel', amount: 5999, method: 'UPI', status: 'Refunded', date: getOffsetDateString(45) },
];

// ── Mock Roles ──────────────────────────────────────────────
const defaultRoles: Role[] = [
  { id: 'role-1', name: 'Super Admin', color: '#8B4949', membersCount: 1, permissions: { products: true, orders: true, upload_files: true, contents: true, customers: true, payments: true, settings: true, promotions: true, vendors: true, finance: true, marketing: true, leads: true, corporate: true } },
  { id: 'role-2', name: 'Designer', color: '#6366F1', membersCount: 2, permissions: { products: true, orders: false, upload_files: true, contents: true, customers: false, payments: false, settings: false, promotions: false, vendors: false, finance: false, marketing: false, leads: false, corporate: false } },
  { id: 'role-3', name: 'Content Editor', color: '#D4AF37', membersCount: 1, permissions: { products: false, orders: false, upload_files: false, contents: true, customers: false, payments: false, settings: false, promotions: true, vendors: false, finance: false, marketing: true, leads: false, corporate: false } },
  { id: 'role-4', name: 'Support', color: '#4A7C59', membersCount: 2, permissions: { products: false, orders: true, upload_files: true, contents: false, customers: true, payments: false, settings: false, promotions: false, vendors: false, finance: false, marketing: false, leads: false, corporate: false } },
];

const defaultClientLeads: ClientLead[] = [
  { id: 'L-101', name: 'Amit Sharma', phone: '+91 98765 43210', email: 'amit@gmail.com', eventType: 'Wedding', interestedProduct: 'Premium Video Invite', budget: 25000, source: 'Website Form', status: 'Converted', assignedTo: 'Rohan Verma', notes: 'Shared design drafts. Coupon applied.', tag: 'Invitations', createdAt: '2026-06-01' },
  { id: 'L-102', name: 'Neha Gupta', phone: '+91 99999 88888', email: 'neha@yahoo.com', eventType: 'Wedding', interestedProduct: 'Printed Luxury Box Set', budget: 65000, source: 'Instagram', status: 'New', assignedTo: 'Pooja Mehta', notes: 'Requested premium gold theme options.', tag: 'Printed Invites', createdAt: '2026-06-06' },
  { id: 'L-103', name: 'Vikram Singh', phone: '+91 91234 56789', email: 'vikram@outlook.com', eventType: 'Anniversary', interestedProduct: 'Interactive Website', budget: 15000, source: 'WhatsApp', status: 'Contacted', assignedTo: 'Rohan Verma', notes: 'Sent domain mapping pricing list.', tag: 'Event Websites', createdAt: '2026-06-04' },
  { id: 'L-104', name: 'Priya Patel', phone: '+91 88888 77777', email: 'priya@gmail.com', eventType: 'Corporate', interestedProduct: 'E-Stationery Designs', budget: 30000, source: 'Referral', status: 'Follow-up', assignedTo: 'Pooja Mehta', notes: 'Call scheduled on Monday at 3PM.', tag: 'Stationery', createdAt: '2026-06-03' },
  { id: 'L-105', name: 'Rohan Deshmukh', phone: '+91 77777 66666', email: 'rohan@gmail.com', eventType: 'Birthday', interestedProduct: 'E-Card Template', budget: 5000, source: 'Facebook', status: 'Lost', assignedTo: 'Rohan Verma', notes: 'Budget too low for custom assets.', tag: 'Gifts', createdAt: '2026-06-02' },
  { id: 'L-106', name: 'Kavita Rao', phone: '+91 98989 88888', email: 'kavita@gmail.com', eventType: 'Wedding', interestedProduct: 'Wedding Website Deluxe', budget: 18000, source: 'Direct Call', status: 'Converted', assignedTo: 'Pooja Mehta', notes: 'Payment confirmed. Live at kavita-wedding.in', tag: 'Corporate', createdAt: '2026-06-05' }
];

const defaultVendorLeads: VendorLead[] = [
  { id: 'VL-201', companyName: 'Chawla Paper Mills', contactName: 'Rajesh Chawla', phone: '+91 98300 12345', email: 'rajesh@chawlapaper.com', category: 'Printed Stationery', status: 'Deal', expectedMargin: 45, notes: 'Negotiating wholesale rates for 350gsm cotton sheets.', createdAt: '2026-06-10' },
  { id: 'VL-202', companyName: 'Royal Box Crafters', contactName: 'Harpreet Singh', phone: '+91 91111 22222', email: 'harpreet@royalboxes.in', category: 'Printed Invites', status: 'Closed', expectedMargin: 35, notes: 'Signed contract for rigid box sourcing.', createdAt: '2026-06-12' },
  { id: 'VL-203', companyName: 'Organic Hampers & Co.', contactName: 'Shweta Sen', phone: '+91 88899 00000', email: 'shweta@organichampers.com', category: 'Gifts', status: 'Paused', expectedMargin: 40, notes: 'Sample boxes received, quality needs improvement.', createdAt: '2026-06-14' }
];

const defaultPlannerLeads: PlannerLead[] = [
  { id: 'PL-301', agencyName: 'Red Velvet Events', contactName: 'Meghna Kapoor', phone: '+91 98900 98900', email: 'meghna@redvelvet.in', commissionRate: 10, status: 'Active Partnership', notes: 'Agreed on 10% referral commission for all digital invites.', createdAt: '2026-06-08' },
  { id: 'PL-302', agencyName: 'Vows & Beyond', contactName: 'Devika Roy', phone: '+91 97777 88888', email: 'devika@vowsbeyond.com', commissionRate: 15, status: 'Prospect', notes: 'Discussed co-branded wedding packages. Proposal pending.', createdAt: '2026-06-11' }
];

const defaultCorporateLeads: CorporateLead[] = [
  { id: 'CL-901', company: 'Infosys Bangalore', contact: 'Sudha Murthy', email: 'corporate.events@infosys.com', phone: '+91 80285 20261', product: 'Anniversary Stationery Set', qty: 2500, budget: 1500000, status: 'Negotiation', notes: 'Requested recycled handmade paper with silver emboss.', createdAt: '2026-05-20' },
  { id: 'CL-902', company: 'Wipro Limited', contact: 'Rishad Premji', email: 'rishad@wipro.com', phone: '+91 80284 40011', product: 'New Year Gift Boxes', qty: 1000, budget: 800000, status: 'Proposal Sent', notes: 'Proposal sent with sample pricing details.', createdAt: '2026-06-02' }
];

const defaultCorporateOrders: CorporateOrder[] = [
  { id: 'CO-1001', company: 'Tata Consultancy Services', contact: 'Natarajan C.', email: 'natarajan@tcs.com', phone: '+91 22677 89999', product: 'Printed Platinum Invites', qty: 1500, pricePerUnit: 120, total: 180000, gst: '27AAACT1234F1Z9', status: 'Printing', date: '2026-05-24' }
];

const defaultJobApplications: JobApplication[] = [
  { id: 'APP-101', name: 'Rohan Sharma', email: 'rohan.sharma@gmail.com', phone: '+91 98888 12345', position: 'Video Editor', experience: '3 Years (Premiere, After Effects)', portfolioUrl: 'https://vimeo.com/rohanshama', resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', status: 'Pending', appliedAt: '2026-06-25' },
  { id: 'APP-102', name: 'Ananya Iyer', email: 'ananya.iyer@gmail.com', phone: '+91 97777 54321', position: 'Graphic Designer', experience: '5 Years (Illustrator, Luxury Branding)', portfolioUrl: 'https://behance.net/ananyaiyer', resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', status: 'Approved', appliedAt: '2026-06-22' },
  { id: 'APP-103', name: 'Vikram Malhotra', email: 'vikram.m@gmail.com', phone: '+91 96666 98765', position: 'Event Coordinator', experience: '2 Years (On-ground Operations)', portfolioUrl: 'https://linkedin.com/in/vikramm', resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', status: 'Rejected', appliedAt: '2026-06-18' }
];

const defaultJobOpenings: JobOpening[] = [
  {
    id: 'designer',
    title: 'Senior Visual Designer',
    department: 'Creative Design',
    location: 'Remote / New Delhi',
    type: 'Full-Time',
    description: 'Lead visual design workflows for luxury wedding stationery, custom illustrations, and event branding assets. NIFT background is a plus.'
  },
  {
    id: 'engineer',
    title: 'Frontend React Engineer',
    department: 'Technology',
    location: 'Remote',
    type: 'Full-Time',
    description: 'Develop responsive event registration engines, ticket verification apps, and custom high-performance event websites using React and Tailwind CSS.'
  },
  {
    id: 'manager',
    title: 'Event Design Project Manager',
    department: 'Operations & Client Services',
    location: 'Remote / Mumbai',
    type: 'Full-Time',
    description: 'Coordinate with enterprise clients and our internal design team to manage delivery milestones for event microsites and printed branding collaterals.'
  }
];

// ── Mock Team Members ────────────────────────────────────────
const defaultTeamMembers: TeamMember[] = [
  { id: 'm-1', name: 'Amit Patel', email: 'amit@eventique.in', roleId: 'role-1', status: 'Active', joinedAt: '2026-01-10', salary: 75000, paymentFrequency: 'Monthly', phone: '+91 99999 11111' },
  { id: 'm-2', name: 'Neha Sen', email: 'neha@eventique.in', roleId: 'role-2', status: 'Active', joinedAt: '2026-02-15', salary: 55000, paymentFrequency: 'Monthly', phone: '+91 99999 22222' },
  { id: 'm-3', name: 'Kabir Malhotra', email: 'kabir@eventique.in', roleId: 'role-2', status: 'Active', joinedAt: '2026-03-01', salary: 50000, paymentFrequency: 'Monthly', phone: '+91 99999 33333' },
  { id: 'm-4', name: 'Pooja Mehta', email: 'pooja@eventique.in', roleId: 'role-3', status: 'Active', joinedAt: '2026-02-28', salary: 45000, paymentFrequency: 'Monthly', phone: '+91 99999 44444' },
  { id: 'm-5', name: 'Rohan Verma', email: 'rohan@eventique.in', roleId: 'role-4', status: 'Active', joinedAt: '2026-04-05', salary: 35000, paymentFrequency: 'Monthly', phone: '+91 99999 55555' },
  { id: 'm-6', name: 'Simran Kaur', email: 'simran@eventique.in', roleId: 'role-4', status: 'Inactive', joinedAt: '2026-04-12', salary: 35000, paymentFrequency: 'Monthly', phone: '+91 99999 66666' },
];

// ── Mock Media Files ────────────────────────────────────────
const defaultMediaFiles: MediaFile[] = [
  { id: 'med-1', name: 'hero-wedding.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', size: '420 KB', uploadedAt: '2026-05-01', tag: 'Sliders' },
  { id: 'med-2', name: 'sample-video-invite.mp4', type: 'video', url: '#', size: '12 MB', uploadedAt: '2026-05-03', tag: 'Products' },
  { id: 'med-3', name: 'floral-invite-sample.pdf', type: 'pdf', url: '#', size: '1.2 MB', uploadedAt: '2026-05-05', tag: 'Drafts' },
  { id: 'med-4', name: 'stationery-bundle.zip', type: 'zip', url: '#', size: '34 MB', uploadedAt: '2026-05-06', tag: 'Other' },
];

// ── Mock Content Blocks ─────────────────────────────────────
const defaultContentBlocks: ContentBlock[] = [
  { id: 'cb-1', sectionName: 'Hero', title: 'Celebrate Every Moment with Elegance', subtitle: 'Create stunning digital invitations, beautiful event websites, and premium stationery.', enabled: true, lastUpdated: '2026-05-01', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200', ctaText: 'Explore Designs', ctaLink: '/events' },
  { 
    id: 'cb-2', 
    sectionName: 'Explore Designs', 
    title: 'Explore Our Designs', 
    subtitle: 'Browse hundreds of premium invitation designs for every occasion.', 
    enabled: true, 
    lastUpdated: '2026-05-01', 
    ctaText: 'View Catalog', 
    ctaLink: '/events',
    badgeText: 'Exquisite Collection',
    footerText: 'Find your perfect theme in our catalog',
    features: [
      { title: 'Multitudes of Occasions', desc: 'Curated designs for Weddings, Birthdays, Anniversaries, Pooja, and baby showers.' },
      { title: 'Formats for All Mediums', desc: 'Stunning Video invites, printable PDF invites, premium stationery, and wedding websites.' },
      { title: 'Fully Personalized Service', desc: 'Collaborate with our designers to customize color palettes, layouts, and guest logs.' }
    ]
  },
  { id: 'cb-3', sectionName: 'Packages', title: 'Our Packages', subtitle: 'Choose the perfect package for your celebration.', enabled: true, lastUpdated: '2026-05-01', ctaText: 'View Packages', ctaLink: '/events?tab=packages' },
  { 
    id: 'cb-4', 
    sectionName: 'Event Websites', 
    title: 'Your Event, Your Website', 
    subtitle: 'Beautiful personalized websites for every celebration.', 
    enabled: true, 
    lastUpdated: '2026-05-01', 
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', 
    ctaText: 'Create Website', 
    ctaLink: '/event-websites', 
    images: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800'],
    badgeText: 'Personalized Portals',
    footerText: 'Starting from ₹4,999 onwards',
    features: [
      { title: 'Real-time RSVP Tracking', desc: 'Ditch the spreadsheet and track guest attendance, preferences, and count instantly.' },
      { title: 'Complete Information Hub', desc: 'Centralize travel directions, schedules, dress codes, and gift registries.' },
      { title: 'Post-Event Memory Lane', desc: 'Share official photography galleries and event highlights with your guests.' }
    ]
  },
  { 
    id: 'cb-5', 
    sectionName: 'Stationery', 
    title: 'Premium Stationery', 
    subtitle: 'Print-ready designs for every occasion.', 
    enabled: true, 
    lastUpdated: '2026-05-01', 
    imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', 
    ctaText: 'Order Stationery', 
    ctaLink: '/stationery', 
    images: ['https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400'],
    badgeText: 'Celebrate in Style',
    footerText: 'Starting from ₹50 per piece',
    features: [
      { title: 'Perfectly Coordinated Themes', desc: 'Match your table menus, welcome signs, and luggage tags to your invitations.' },
      { title: 'High-Resolution Files', desc: 'Get print-ready assets tailored for high-end digital or offset printing.' },
      { title: 'Custom Formatting & Fonts', desc: 'Ensure consistent brand typography and accents across every guest touchpoint.' }
    ]
  },
  { id: 'cb-6', sectionName: 'FAQ', title: 'Frequently Asked Questions', subtitle: 'Find answers to common questions about our services.', enabled: true, lastUpdated: '2026-05-01' },
  { 
    id: 'cb-7', 
    sectionName: 'Footer', 
    body: 'Eventique — Premium Digital Invitations & Event Design Studio', 
    enabled: true, 
    lastUpdated: '2026-05-01',
    footerBrandTagline: 'Personalized digital e-invites for every celebration. Making your special moments memorable.',
    footerContactInfo: { phone: '+91 98765 43210', email: 'hello@eventique.in' },
    footerSocialLinks: [
      { platform: 'instagram', url: 'https://instagram.com' },
      { platform: 'facebook', url: 'https://facebook.com' },
      { platform: 'youtube', url: 'https://youtube.com' },
      { platform: 'pinterest', url: 'https://pinterest.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' },
      { platform: 'x', url: 'https://x.com' }
    ]
  },
  { id: 'cb-8', sectionName: 'About', title: 'The Story of Eventique', body: 'Where tradition meets modern design — crafting invitations that feel as special as the moments they celebrate.', enabled: true, lastUpdated: '2026-05-01',
    aboutValues: [
      { icon: '🪷', title: 'Culturally Rooted', desc: 'Every motif, every colour is chosen with the depth of Indian tradition in mind — never generic, always intentional.' },
      { icon: '✦', title: 'Precision Craftsmanship', desc: "From typography to layout, each element is refined until it feels exactly right. We pay attention so you don't have to." },
      { icon: '🌟', title: 'Modern Sensibility', desc: 'Tradition meets contemporary design language — beautiful on every device, shareable in every format.' }
    ],
    aboutStoryPoints: [
      { title: 'Born from a Passion', text: 'Founded by designers from NIFT and IIT, Eventique started with a simple belief: every invitation deserves to be beautiful and culturally significant.', iconName: 'Flame', color: '#E8704A' },
      { title: 'Rooted in Culture', text: 'We believe every invitation carries meaning — your culture, your rituals, and the unique story behind your celebration.', iconName: 'Globe', color: '#4A9E8B' },
      { title: 'Detail-Driven Design', text: 'From typography to colour palette to intricate motifs — each element is carefully chosen to align with your traditions.', iconName: 'Layers', color: '#9B6DD1' },
      { title: 'Growing With You', text: "From e-invitations to complete stationery, we have grown with our clients' trust — 2,000+ celebrations and counting.", iconName: 'TrendingUp', color: '#D4AF37' }
    ],
    aboutMilestones: [
      { number: '2000+', label: 'Happy Clients', iconName: 'Users' },
      { number: '5000+', label: 'Designs Created', iconName: 'PenTool' },
      { number: '98%', label: 'Satisfaction Rate', iconName: 'Star' },
      { number: '24/7', label: 'Support Available', iconName: 'Clock' }
    ],
    aboutFounder: {
      name: 'Himesh Mehta',
      role: 'Founder & Head of Design',
      education: 'NIFT',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      bio: 'With over a decade of experience in traditional and contemporary design, Himesh founded Eventique to bridge the gap between cultural heritage and modern digital experiences. His vision is to make every invitation a piece of art that families cherish forever.'
    },
    aboutTeam: [
      { name: 'Rabi Mishra', role: 'Marketing & Growth', education: 'IIT', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
      { name: 'Sanu Kumar', role: 'Design Quality & Review', education: 'NIFT', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
      { name: 'Rishi', role: 'Content Creation', education: 'IIT', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' }
    ]
  },
  { id: 'cb-9', sectionName: 'Contact', title: "Let's Create Together", subtitle: 'Whether you have a specific vision or need creative guidance, our team is here to help you craft the perfect invitation.', enabled: true, lastUpdated: '2026-05-01',
    contactDetails: [
      { type: 'whatsapp', title: 'WhatsApp', subtitle: 'Chat with us instantly', value: '919876543210', linkText: 'Start Chat →', linkUrl: 'https://wa.me/919876543210' },
      { type: 'phone', title: 'Phone', subtitle: 'Mon-Sat, 9AM to 8PM IST', value: '+91 98765 43210' },
      { type: 'email', title: 'Email', subtitle: "We'll reply within 24 hours", value: 'hello@eventique.in' },
      { type: 'studio', title: 'Studio', subtitle: 'Available for virtual consultations worldwide.', value: 'Mumbai, Maharashtra, India' },
      { type: 'response', title: 'Our Response Time', subtitle: 'We typically respond within 2-4 hours during business hours.', value: '2-4 hours' }
    ],
    contactFaqs: [
      { q: 'How long does it take to receive my invitation design?', a: 'Standard turnaround is 3–5 business days. Rush delivery within 24–48 hours is available for an additional fee.' },
      { q: 'Can I request unlimited revisions?', a: 'Every order includes up to 3 rounds of revisions. Additional revisions can be requested at a nominal charge.' },
      { q: 'Do you offer physical printed stationery?', a: 'Yes! We offer premium printed stationery shipped across India and 20+ countries. Delivery timelines vary by location.' },
      { q: 'What file formats will I receive?', a: 'Digital invitations are delivered as high-resolution PDFs and print-ready files. Video invites are delivered as MP4.' },
      { q: 'Can I customise the language or script?', a: 'Absolutely. We support designs in Hindi, Gujarati, Tamil, Telugu, Punjabi, and many other regional scripts alongside English.' }
    ],
    contactCtaInfo: {
      title: "Let's talk",
      subtitle: 'directly.',
      detail: 'Our team is happy to walk you through options, pricing, and timelines — no pressure, just a warm and friendly conversation.',
      whatsappNumber: '919876543210',
      whatsappText: 'Hi! I have a question about Eventique services.'
    }
  },
  { id: 'cb-10', sectionName: 'Terms', title: 'Terms & Conditions', body: 'By using our services, you agree to these terms...', enabled: true, lastUpdated: '2026-05-01' },
  { id: 'cb-11', sectionName: 'Privacy Policy', title: 'Privacy Policy', body: 'We value your privacy and are committed to protecting your data...', enabled: true, lastUpdated: '2026-05-01' },
  { id: 'cb-12', sectionName: 'Refund Policy', title: 'Refund Policy', body: 'We offer refunds within 7 days of purchase for eligible orders...', enabled: true, lastUpdated: '2026-05-01' },
  { id: 'cb-13', sectionName: 'Browse by Occasion', title: 'Browse by Occasion', subtitle: 'Curated designs for every celebration in your life', enabled: true, lastUpdated: '2026-05-01' },
  { id: 'cb-14', sectionName: 'Our Services', title: 'Our Services', subtitle: 'Complete solutions for all your event invitation and stationery needs', enabled: true, lastUpdated: '2026-05-01' },
  { 
    id: 'cb-15', 
    sectionName: 'Printed Luxury Invites', 
    title: 'Printed Luxury Invites', 
    body: 'Experience the finest craftsmanship with our premium printed wedding invitations. Each piece is meticulously designed with luxurious materials, exquisite finishes, and attention to detail that makes your invitation unforgettable.', 
    enabled: true, 
    lastUpdated: '2026-05-01', 
    imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', 
    ctaText: 'Explore Collection', 
    ctaLink: '/events', 
    images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800'],
    badgeText: 'Premium Collection',
    footerText: 'Starting from ₹50 per piece • Minimum order: 50 pieces',
    features: [
      { title: 'Luxury Materials', desc: 'Premium paper stocks, silk fabrics, acrylic, wood, and metal finishes' },
      { title: 'Artisanal Finishing', desc: 'Gold foil, embossing, laser cutting, and hand-tied ribbons' },
      { title: 'Bespoke Design', desc: 'Fully customizable designs tailored to your unique vision' }
    ]
  },
  { id: 'cb-16', sectionName: 'Testimonials', title: 'What Our Clients Say', subtitle: 'Join thousands of happy customers who trusted us with their celebrations', enabled: true, lastUpdated: '2026-05-01' },
  { 
    id: 'cb-17', 
    sectionName: 'Video Invites', 
    title: 'Video Invitations', 
    subtitle: 'Stunning animated invites that captivate your guests', 
    enabled: true, 
    lastUpdated: '2026-05-01', 
    imageUrl: '', 
    ctaText: 'Explore Designs', 
    ctaLink: '/events', 
    images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800'],
    badgeText: 'Animated E-Invites',
    footerText: 'Starting from ₹1,499 onwards',
    features: [
      { title: 'Cinematic Visuals & Music', desc: 'Engage guests with custom animations, background music, and photographs.' },
      { title: 'High-Definition Playback', desc: 'Optimized for smooth viewing on smartphones, WhatsApp, and large screens.' },
      { title: 'Quick Turnaround', desc: 'Receive your customized high-definition animated invitation within 3-5 days.' }
    ]
  },
];

const defaultCampaigns: LaunchCampaign[] = [
  {
    id: 'camp-1',
    slug: 'ganesh-chaturthi-invites',
    title: 'Ganesh Chaturthi Premium Launch',
    productName: 'Vighnaharta Premium Video Invitation',
    status: 'Active',
    accentColor: '#D4AF37',
    theme: 'Royal',
    heroTitle: 'Invite Blessings into Your Celebration with',
    heroSubtitle: 'A premium, custom-animated video invitation celebrating the Lord of Beginnings. Perfect for home poojas, temple events, and family gatherings.',
    heroImage: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800',
    features: [
      { title: 'Divine Vedic Mantras', desc: 'Pre-recorded traditional chants and custom high-fidelity background music.' },
      { title: 'Golden Foil Art Themes', desc: 'Stunning visual templates detailed with clay-lamp motifs and modak decorations.' },
      { title: 'Personalized Guest Greetings', desc: 'Add personalized name cards to each invitation video before sharing.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-celebration-colored-particles-1014-large.mp4',
    pricingPackages: [
      { name: 'Standard Divine Pack', price: 1999, features: ['1 Round of custom edits', 'Delivered in 48 hours', 'Standard MP4 Video File', 'Includes 1 background chant option'] },
      { name: 'Royal Vedic Suite', price: 4499, features: ['Unlimited revisions', 'Delivered in 24 hours', 'HD Cinematic MP4 + Web link', 'Custom audio selection', 'Matching WhatsApp welcome card'] }
    ],
    faqs: [
      { q: 'Can I add my family photo to the video?', a: 'Yes! The Royal Vedic Suite allows you to include up to three high-resolution photos in the animation slides.' },
      { q: 'How will I receive the final invitation?', a: 'The invitation is delivered as a high-definition MP4 file via email/WhatsApp, plus a secure web sharing link.' }
    ]
  }
];


// ── Default Blog Posts ──────────────────────────────────────
const defaultBlogPosts: BlogPost[] = [
  {
    id: 1,
    category: 'Digital Trends',
    date: 'June 3, 2026',
    readTime: '4 min read',
    title: 'The Rise of E-Invites: Why Modern Couples Prefer Digital Video Invitations',
    subtitle: 'Discover how digital video invitations are transforming wedding planning from environmental benefits to instant global delivery.',
    description: 'Discover how digital video invitations are transforming wedding planning. From environmental benefits to instant global delivery, explore why modern couples are going digital.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&fit=crop',
    content: [
      {
        type: 'paragraph',
        text: 'In the era of smartphones and instant connectivity, wedding planning is undergoing a major digital revolution. One of the biggest shifts we are seeing today is the transition from traditional paper invites to high-quality digital video invitations, often referred to as E-Invites. Modern couples are embracing this medium not just as a cost-effective alternative, but as a premium, creative, and highly personalized experience that sets the tone for their big day.'
      },
      {
        type: 'heading',
        text: '1. Seamless Global Delivery'
      },
      {
        type: 'paragraph',
        text: 'Traditional invitations take weeks to print, address, and ship, with a high risk of getting lost or delayed in transit—especially for international guests. With E-Invites, delivery is instantaneous. You can share your beautiful animated video invite via WhatsApp, email, or social media with a single click. There are no postage fees, no custom delays, and no geographical limits. Your guests receive their invitation in HD quality, no matter where they are in the world.'
      },
      {
        type: 'heading',
        text: '2. Immersive Visual Storytelling'
      },
      {
        type: 'paragraph',
        text: 'Unlike static paper, video invites allow you to combine motion graphics, beautiful typography, romantic music, and personal photographs into a cinematic experience. You can guide your guests through your love story, show off your pre-wedding shoot, or animate traditional motifs (like jasmine garlands, elephants, or mandalas) to match your wedding theme. It is a highly sensory introduction to your wedding celebrations that creates an immediate emotional connection.'
      },
      {
        type: 'quote',
        text: 'E-invites are not just about sharing the date—they are about sharing the anticipation, the music, and the visual essence of your love story in a way paper never could.'
      },
      {
        type: 'heading',
        text: '3. Eco-Friendly and Sustainable'
      },
      {
        type: 'paragraph',
        text: 'As couples become more conscious of their environmental impact, sustainability has become a core value in wedding planning. Paper invitations require harvesting trees, processing chemical inks, and transportation emissions. Going digital is a zero-waste choice that saves hundreds of sheets of paper and plastic wraps, allowing you to celebrate your union while being kind to the planet.'
      },
      {
        type: 'heading',
        text: '4. Instant Updates and RSVP Integration'
      },
      {
        type: 'paragraph',
        text: 'With traditional paper cards, any change in venue, timing, or itinerary requires a costly reprint or tedious manual notifications. With a digital setup, your E-Invite can be linked directly to your personalized wedding website or RSVP form. Guests can click a button right below the video to confirm attendance, submit dietary preferences, or view updated schedule details, streamlining the entire planning process for you.'
      }
    ]
  },
  {
    id: 2,
    category: 'Printed Luxury',
    date: 'May 28, 2026',
    readTime: '6 min read',
    title: 'Crafting First Impressions: A Guide to Choosing Luxury Wedding Paper & Finishes',
    subtitle: 'Gold foil, letterpress, acrylic, or velvet? Learn about the premium paper stocks and printing techniques that turn invitations into masterpieces.',
    description: 'Gold foil, letterpress, acrylic, or velvet? Learn about different premium paper stocks and printing techniques that can make your physical invitations a tactile masterpiece.',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&fit=crop',
    content: [
      {
        type: 'paragraph',
        text: 'A physical wedding invitation is more than just information—it is a tactile keepsake that your guests will hold, feel, and cherish. It serves as the official introduction to the aesthetic of your wedding. Designing a luxury paper suite involves choosing the right combination of materials, paper weights, and artisanal finishes. This guide walks you through the premium choices that can elevate your printed invitations into works of art.'
      },
      {
        type: 'heading',
        text: '1. Choosing the Right Paper Stock'
      },
      {
        type: 'paragraph',
        text: 'The foundation of any printed suite is the paper. For a luxury feel, standard cardstock will not suffice. Instead, look for: \n• Cotton Paper: Often called rag paper, made from 100% cotton fibers. It has a soft, pillowy texture and is incredibly thick (usually 300 to 600 gsm), making it ideal for deep impressions. \n• Handmade Paper: Features deckled edges and organic textures, perfect for vintage or rustic elegant styles. \n• Frosted Acrylic: A modern, high-end alternative that offers a sleek, glass-like look, printed with opaque white or gold ink.'
      },
      {
        type: 'heading',
        text: '2. The Timeless Elegance of Foil Stamping'
      },
      {
        type: 'paragraph',
        text: 'Foil stamping is a technique where metallic foil (usually gold, silver, rose gold, or copper) is pressed onto the paper using heat and pressure. It creates a shiny, reflective finish that catches the light beautifully and gives the invitation an immediate regal look. It is perfect for titles, initials monograms, and intricate border patterns.'
      },
      {
        type: 'quote',
        text: 'Luxury is in the details you can feel. The heavy weight of cotton paper combined with the crisp texture of gold foil stamps creates an unforgettable physical connection.'
      },
      {
        type: 'heading',
        text: '3. Letterpress vs. Debossing'
      },
      {
        type: 'paragraph',
        text: 'Letterpress is one of the oldest printing methods, where a metal plate with raised lettering is inked and pressed directly into the paper. This leaves a crisp, inked indentation in the thick cotton stock. Debossing is similar but uses no ink, creating a blind, elegant impression. Both techniques add a gorgeous three-dimensional depth that is highly satisfying to touch.'
      },
      {
        type: 'heading',
        text: '4. The Finishing Touches: Wax Seals and Vellum'
      },
      {
        type: 'paragraph',
        text: 'To complete your invitation suite, consider wrapping the card in a translucent vellum jacket, tied with silk ribbon or metallic thread, and sealed with a custom wax stamp. Wax seals (featuring your monogram or a botanical motif) add a romantic, medieval charm that shows your guests that every single envelope was packaged with care and elegance.'
      }
    ]
  },
  {
    id: 3,
    category: 'Planning Tips',
    date: 'May 15, 2026',
    readTime: '5 min read',
    title: 'Interactive RSVP & Beyond: How Event Websites Make Guest Management Effortless',
    subtitle: 'Ditch the spreadsheets. Discover how a customized event website streamlines guest list management, event details, and photo sharing.',
    description: 'Tired of tracking RSVP cards manually? Explore how a customized wedding or event website streamlines guest list management, event details, and photo sharing.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&fit=crop',
    content: [
      {
        type: 'paragraph',
        text: 'Planning a wedding or large milestone celebration involves managing dozens of moving parts. Among these, coordinating the guest list, collecting RSVPs, tracking dietary restrictions, and keeping everyone updated on travel arrangements is notoriously the most stressful. This is why more couples are turning to customized event websites. A dedicated website acts as a 24/7 central hub that handles the heavy lifting of guest management, leaving you free to focus on the design and celebration.'
      },
      {
        type: 'heading',
        text: '1. Real-time RSVP Tracking'
      },
      {
        type: 'paragraph',
        text: 'Traditional RSVP cards mailed back in envelopes are slow, easily lost, and require you to manually compile answers into a spreadsheet. A personalized wedding website allows guests to RSVP digitally. The responses are logged instantly in a private database, showing you exactly who has RSVP\'d "Yes" or "No", their guest count, and their selections, all in real-time.'
      },
      {
        type: 'heading',
        text: '2. Centralizing Event Details'
      },
      {
        type: 'paragraph',
        text: 'Instead of cramming directions, hotel accommodations, gift registries, and dress codes onto a small paper card, your website provides unlimited space. You can embed interactive Google Maps, link directly to hotel booking pages, post direct registry links, and outline the itinerary day-by-day. It keeps your guests informed and reduces the number of repetitive questions you have to answer via phone calls.'
      },
      {
        type: 'quote',
        text: 'A customized event website is your digital concierge—it welcomes your guests, provides all the details, and handles the logistics silently in the background.'
      },
      {
        type: 'heading',
        text: '3. Custom RSVP Questionnaires'
      },
      {
        type: 'paragraph',
        text: 'Need to know if guests prefer paneer or chicken? Or if they need shuttle service from the hotel? Your digital RSVP form can contain custom checkboxes or fields to gather this information. You can ask for dietary restrictions, song requests for the DJ, or RSVP preferences for separate events (e.g., Sangeet vs. Reception).'
      },
      {
        type: 'heading',
        text: '4. Post-Event Photo Sharing'
      },
      {
        type: 'paragraph',
        text: 'After the celebration is over, your wedding website can live on. You can upload a link to your official photo gallery, add a section where guests can upload the snapshots they took on their phones, or share a highlight video. It remains a beautiful digital memory lane for you and your guests to revisit for years to come.'
      }
    ]
  }
];

// ── Mock Activity Logs ──────────────────────────────────────
const defaultActivityLogs: ActivityLog[] = [
  { id: 'log-01', action: 'New Order Received', user: 'System', detail: 'Order ORD-009 placed by Priya Sharma for Royal Wedding Video Invite (₹2,499)', timestamp: new Date(Date.now() - 5 * 60 * 1000).toLocaleString('en-IN'), severity: 'success' },
  { id: 'log-02', action: 'New Review Submitted', user: 'System', detail: '5-star review submitted by Rahul Mehta on Floral PDF Invite', timestamp: new Date(Date.now() - 45 * 60 * 1000).toLocaleString('en-IN'), severity: 'info' },
  { id: 'log-03', action: 'New Payment Paid', user: 'Razorpay', detail: 'Payment of ₹4,999 captured successfully for ORD-003', timestamp: new Date(Date.now() - 120 * 60 * 1000).toLocaleString('en-IN'), severity: 'success' },
  { id: 'log-1', action: 'Order Updated', user: 'Admin', detail: 'Order ORD-001 status changed to Processing', timestamp: '2026-05-13 14:32:00', severity: 'info' },
  { id: 'log-2', action: 'File Uploaded', user: 'Admin', detail: 'Uploaded floral-invite-rahul.pdf for ORD-002', timestamp: '2026-05-12 10:15:00', severity: 'info' },
  { id: 'log-3', action: 'Product Added', user: 'Designer', detail: 'Added new product: Jasmine E-Invite', timestamp: '2026-05-11 09:00:00', severity: 'success' },
  { id: 'log-4', action: 'Review Approved', user: 'Admin', detail: 'Review by Priya Sharma approved', timestamp: '2026-05-10 16:00:00', severity: 'success' },
  { id: 'log-5', action: 'Promotion Created', user: 'Admin', detail: 'Coupon SUMMER25 created', timestamp: '2026-05-09 11:30:00', severity: 'success' },
];

// ── Default Vendors ─────────────────────────────────────────
const defaultVendors: Vendor[] = [
  {
    id: 'vnd-1',
    name: 'Rajesh Kumar',
    companyName: 'Apex Prints & Stationery',
    email: 'rajesh@apexprints.in',
    phone: '+91 98765 00112',
    socialId: 'apex_prints_inst',
    website: 'https://apexprints.in',
    category: 'Printed Stationery',
    services: ['Screen Printing', 'Digital Printing', 'Matte Laminating'],
    products: [
      { id: 'vp-1', name: 'Menu Card (Botanical Theme)', costPrice: 25, retailPrice: 85 },
      { id: 'vp-2', name: 'Thank You Tag (Floral Dream)', costPrice: 10, retailPrice: 35 },
    ],
    status: 'Deal'
  },
  {
    id: 'vnd-2',
    name: 'Karan Johar',
    companyName: 'Royal Foilers Ltd.',
    email: 'karan@royalfoil.in',
    phone: '+91 99887 11223',
    socialId: 'royal_foil_decor',
    website: 'https://royalfoil.in',
    category: 'Printed Invites',
    services: ['Gold Foil Stamping', 'Laser Cutting', 'Embossing'],
    products: [
      { id: 'vp-3', name: 'Gold Foil Invitation Card', costPrice: 150, retailPrice: 450 },
      { id: 'vp-4', name: 'Luxury Envelope with Wax Seal', costPrice: 60, retailPrice: 180 },
    ],
    status: 'Deal'
  },
  {
    id: 'vnd-3',
    name: 'Meena Advani',
    companyName: 'Elegant Keepsakes',
    email: 'meena@elegantkeepsakes.com',
    phone: '+91 88776 55443',
    socialId: 'elegant_keepsakes',
    website: 'https://elegantkeepsakes.com',
    category: 'Gifts',
    services: ['Gift Box Curation', 'Laser Engraving', 'Hamper Packaging'],
    products: [
      { id: 'vp-5', name: 'Premium Brass Incense Holder', costPrice: 450, retailPrice: 1250 },
      { id: 'vp-6', name: 'Scented Soy Wax Candle Set', costPrice: 200, retailPrice: 600 },
    ],
    status: 'Paused'
  },
  {
    id: 'vnd-4',
    name: 'Priya Mehta',
    companyName: 'Dream Day Planners',
    email: 'priya@dreamday.in',
    phone: '+91 91234 56789',
    socialId: 'dreamday_planners',
    website: 'https://dreamdayplanners.in',
    category: 'Event Planner',
    services: ['Full Wedding Coordination', 'B2B Sourcing Partner', 'Stage Decor Coordination'],
    products: [
      { id: 'vp-7', name: 'Luxury Decor & Stationery Package', costPrice: 45000, retailPrice: 75000, pricingType: 'Package' },
      { id: 'vp-8', name: 'Digital Invite Customization Suite', costPrice: 5000, retailPrice: 12000, pricingType: 'Fixed Price' },
    ],
    status: 'Deal'
  }
];

const defaultVendorOrders: VendorOrder[] = [
  { id: 'vo-1', clientOrderId: 'ORD-004', productName: 'Gold Foil Invitation Card', quantity: 50, vendorId: 'vnd-2', vendorName: 'Royal Foilers Ltd.', status: 'Shipped', sentDate: '2026-06-01', trackingNumber: 'TRK9023415', notes: 'Design layout shared via WhatsApp' },
  { id: 'vo-2', clientOrderId: 'ORD-005', productName: 'Premium Brass Incense Holder', quantity: 20, vendorId: 'vnd-3', vendorName: 'Elegant Keepsakes', status: 'Design Given', sentDate: '2026-06-05', notes: 'Custom client initials engraving required' }
];

// ── Default Expenses ─────────────────────────────────────────
const defaultExpenses: Expense[] = [
  { id: 'exp-1', title: 'Monthly Salary - Amit Patel', amount: 75000, category: 'Salary', date: '2026-05-01', recipientName: 'Amit Patel', recipientId: 'm-1', paymentMethod: 'Bank Transfer', status: 'Paid', notes: 'May 2026 Salary' },
  { id: 'exp-2', title: 'Monthly Salary - Neha Sen', amount: 55000, category: 'Salary', date: '2026-05-01', recipientName: 'Neha Sen', recipientId: 'm-2', paymentMethod: 'Bank Transfer', status: 'Paid', notes: 'May 2026 Salary' },
  { id: 'exp-3', title: 'Monthly Salary - Kabir Malhotra', amount: 50000, category: 'Salary', date: '2026-05-01', recipientName: 'Kabir Malhotra', recipientId: 'm-3', paymentMethod: 'Bank Transfer', status: 'Paid', notes: 'May 2026 Salary' },
  { id: 'exp-4', title: 'Paper Sourcing - Apex Prints', amount: 12500, category: 'Vendor Sourcing', date: '2026-05-10', recipientName: 'Apex Prints & Stationery', recipientId: 'vnd-1', paymentMethod: 'UPI', status: 'Paid', notes: 'Paper stock for invitation cards' },
  { id: 'exp-5', title: 'Foil Invites Printing - Royal Foilers', amount: 8500, category: 'Vendor Sourcing', date: '2026-05-18', recipientName: 'Royal Foilers Ltd.', recipientId: 'vnd-2', paymentMethod: 'Card', status: 'Paid', notes: 'Order #ORD-004 sourcing cost' },
  { id: 'exp-6', title: 'Adobe Creative Cloud Subscription', amount: 4200, category: 'Software', date: '2026-05-05', recipientName: 'Adobe', paymentMethod: 'Card', status: 'Paid', notes: 'Monthly license fee for designers' },
  { id: 'exp-7', title: 'Google Workspace', amount: 1500, category: 'Software', date: '2026-05-05', recipientName: 'Google', paymentMethod: 'Card', status: 'Paid', notes: 'Business email accounts' },
  { id: 'exp-8', title: 'Vercel Pro', amount: 1600, category: 'Software', date: '2026-05-05', recipientName: 'Vercel Inc.', paymentMethod: 'Card', status: 'Paid', notes: 'Hosting & serverless hosting' },
  { id: 'exp-11', title: 'Instagram Ads Campaign', amount: 15000, category: 'Marketing', date: '2026-05-15', recipientName: 'Meta Platforms', paymentMethod: 'Card', status: 'Paid', notes: 'Wedding season promo campaign' },
];

// ── Default Settings ────────────────────────────────────────
const defaultSettings: AppSettings = {
  brand: { logoUrl: '', name: 'Eventique', tagline: 'Premium Digital Invitations & Event Design', themeColor: '#8B4949', faviconUrl: '', primaryFont: 'Bricolage Grotesque', secondaryFont: 'Inter' },
  seo: { siteUrl: 'https://eventique-website-eta.vercel.app', seoTitle: 'Eventique — Premium Digital Invitations', metaDescription: 'Create stunning digital invitations, beautiful event websites, and premium stationery for all your celebrations.', keywords: 'wedding invitations, digital invites, event website, India', googleAnalyticsId: 'G-F123456789', facebookPixelId: '123456789012345', socialShareImgUrl: '', robotsTxt: 'User-agent: *\nAllow: /' },
  contact: { email: 'hello@eventique.in', phone: '+91 98765 43210', whatsapp: '919876543210', instagram: 'eventique.in', facebook: 'eventique', pinterest: 'eventique', address: 'Mumbai, Maharashtra, India', youtube: 'https://youtube.com/@eventique', operatingHours: 'Mon - Sat: 9:00 AM - 6:00 PM', googleMapsEmbed: '' },
  payment: { razorpayKey: '', gstPercent: 18, invoicePrefix: 'EVT', autoInvoice: true, partialPayment: false, razorpaySecret: '', currency: 'INR', upiId: 'eventique@okaxis', bankAccountDetails: 'Account Name: Eventique Studios\nA/C: 9876543210123\nIFSC: UTIB0001234\nAxis Bank, Mumbai', gstinNumber: '27AAAAA0000A1Z5' },
  downloads: { fileExpiry: 7, maxDownloads: 3, allowedTypes: 'pdf,mp4,zip', maxUploadSizeMb: 50, notifyAfterUpload: true, requireLogin: true, watermarkPreviews: true, downloadHeadline: 'Your Custom Eventique Invite is Ready!' },
  shipping: { defaultCourier: 'Delhivery', dispatchDays: 3, shippingCharge: 150, freeShippingAbove: 5000, shippingPolicy: 'Orders are dispatched within 3 business days.', enableIntlShipping: false, intlShippingCharge: 1500, shiprocketUsername: '', shiprocketPassword: '', localPickup: true },
  notifications: { newOrderAlert: true, paymentSuccessEmail: true, fileUploadedEmail: true, shippedWhatsapp: true, alertEmails: 'hello@eventique.in', whatsappApiKey: '', lowStockAlert: true, lowStockThreshold: 15 },
  security: { twoFactor: false, activityLogs: true, autoBackup: false, sessionTimeout: 30, ipWhitelist: '', enforceStrongPassword: true },
};

// ── Storage ─────────────────────────────────────────────────
const STORAGE_KEY = 'eventique-admin-v2';

function loadFromStorage(): AdminState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.error('Failed to load', e); }
  return null;
}

function saveToStorage(state: AdminState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { console.error('Failed to save', e); }
}

// ── Context Types ────────────────────────────────────────────
interface AdminContextType {
  state: AdminState;
  // Products
  addProduct: (p: Product) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  reorderProducts: (p: Product[]) => void;
  // Packages
  addPackage: (p: Package) => void;
  updatePackage: (id: string, p: Partial<Package>) => void;
  deletePackage: (id: string) => void;
  reorderPackages: (p: Package[]) => void;
  // Testimonials
  addTestimonial: (t: Testimonial) => void;
  updateTestimonial: (id: string, t: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  reorderTestimonials: (t: Testimonial[]) => void;
  // FAQs
  addFAQ: (f: FAQ) => void;
  updateFAQ: (id: string, f: Partial<FAQ>) => void;
  deleteFAQ: (id: string) => void;
  reorderFAQs: (f: FAQ[]) => void;
  // Hero Slides
  addHeroSlide: (s: HeroSlide) => void;
  updateHeroSlide: (id: string, s: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;
  reorderHeroSlides: (s: HeroSlide[], sectionId?: string) => void;
  // Categories
  addCategory: (c: Category) => void;
  updateCategory: (id: string, c: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (c: Category[]) => void;
  // Services
  addService: (s: Service) => void;
  updateService: (id: string, s: Partial<Service>) => void;
  deleteService: (id: string) => void;
  reorderServices: (s: Service[]) => void;
  // Sections
  updateSection: (id: string, c: Partial<SectionConfig>) => void;
  reorderSections: (s: SectionConfig[]) => void;
  // Orders
  updateOrder: (id: string, o: Partial<Order>) => void;
  uploadOrderFile: (id: string, fileName: string, fileUrl: string) => void;
  // Customers
  updateCustomer: (id: string, c: Partial<Customer>) => void;
  // Reviews
  updateReview: (id: string, r: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  // Promotions
  addPromotion: (p: Promotion) => void;
  updatePromotion: (id: string, p: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
  // Payments
  updatePayment: (id: string, p: Partial<Payment>) => void;
  // Roles
  addRole: (r: Role) => void;
  updateRole: (id: string, r: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  // Vendors
  addVendor: (v: Vendor) => void;
  updateVendor: (id: string, v: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  // Vendor Orders
  addVendorOrder: (vo: VendorOrder) => void;
  updateVendorOrder: (id: string, vo: Partial<VendorOrder>) => void;
  deleteVendorOrder: (id: string) => void;
  // Team
  addTeamMember: (m: TeamMember) => void;
  updateTeamMember: (id: string, m: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  // Expenses
  addExpense: (e: Expense) => void;
  updateExpense: (id: string, e: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  // Media
  addMediaFile: (m: MediaFile) => void;
  updateMediaFile: (id: string, m: Partial<MediaFile>) => void;
  deleteMediaFile: (id: string) => void;
  // Content Blocks
  updateContentBlock: (id: string, b: Partial<ContentBlock>) => void;
  addContentBlock: (b: ContentBlock) => void;
  deleteContentBlock: (id: string) => void;
  // Blog Posts
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (id: number, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: number) => void;
  // Settings
  updateSettings: (s: Partial<AppSettings>) => void;
  // Utility
  addActivityLog: (action: string, detail: string, severity?: 'info' | 'success' | 'warning' | 'danger') => void;
  purgeActivityLogs: () => void;
  resetToDefaults: () => void;
  // Auth
  isAuthenticated: boolean;
  currentUser: TeamMember | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (key: PermissionKey) => boolean;
  // Campaigns
  addCampaign: (c: LaunchCampaign) => void;
  updateCampaign: (id: string, c: Partial<LaunchCampaign>) => void;
  deleteCampaign: (id: string) => void;
  // Client Leads
  addClientLead: (l: ClientLead) => void;
  updateClientLead: (id: string, l: Partial<ClientLead>) => void;
  deleteClientLead: (id: string) => void;
  // Vendor Leads
  addVendorLead: (l: VendorLead) => void;
  updateVendorLead: (id: string, l: Partial<VendorLead>) => void;
  deleteVendorLead: (id: string) => void;
  // Planner Leads
  addPlannerLead: (l: PlannerLead) => void;
  updatePlannerLead: (id: string, l: Partial<PlannerLead>) => void;
  deletePlannerLead: (id: string) => void;
  // Corporate Leads
  addCorporateLead: (l: CorporateLead) => void;
  updateCorporateLead: (id: string, l: Partial<CorporateLead>) => void;
  deleteCorporateLead: (id: string) => void;
  // Corporate Orders
  addCorporateOrder: (o: CorporateOrder) => void;
  updateCorporateOrder: (id: string, o: Partial<CorporateOrder>) => void;
  deleteCorporateOrder: (id: string) => void;
  // Actions
  convertCorporateLeadToOrder: (leadId: string, pricePerUnit: number, gst: string) => void;
  simulateLiveInquiry: () => void;
  // Job Applications
  addJobApplication: (app: JobApplication) => void;
  updateJobApplication: (id: string, app: Partial<JobApplication>) => void;
  deleteJobApplication: (id: string) => void;
  hireApplicant: (appId: string, roleId: string) => void;
  // Job Openings
  addJobOpening: (opening: Omit<JobOpening, "id">) => void;
  deleteJobOpening: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

function buildDefault(): AdminState {
  return {
    products: defaultProducts.map((p, idx) => ({
      ...p,
      createdAt: p.createdAt || (
        idx === 0 ? getOffsetDateString(0) : // Today
        idx === 1 ? getOffsetDateString(2) : // This week
        idx === 2 ? getOffsetDateString(5) : // This week
        idx === 3 ? getOffsetDateString(12) : // This month
        idx === 4 ? getOffsetDateString(25) : // This month
        getOffsetDateString(45) // Older
      )
    })),
    packages: defaultPackages,
    testimonials: defaultTestimonials,
    faqs: defaultFaqs.map((f, i) => ({ id: `faq-${i + 1}`, question: f.question, answer: f.answer })),
    heroSlides: defaultHeroSlides,
    categories: defaultCategories,
    services: defaultServices,
    sections: defaultSections,
    orders: defaultOrders,
    customers: defaultCustomers,
    reviews: defaultReviews,
    promotions: defaultPromotions,
    payments: defaultPayments,
    roles: defaultRoles,
    teamMembers: defaultTeamMembers,
    mediaFiles: defaultMediaFiles,
    contentBlocks: defaultContentBlocks,
    blogPosts: defaultBlogPosts,
    activityLogs: defaultActivityLogs,
    settings: defaultSettings,
    vendors: defaultVendors,
    vendorOrders: defaultVendorOrders,
    expenses: defaultExpenses,
    campaigns: defaultCampaigns,
    clientLeads: defaultClientLeads,
    vendorLeads: defaultVendorLeads,
    plannerLeads: defaultPlannerLeads,
    corporateLeads: defaultCorporateLeads,
    corporateOrders: defaultCorporateOrders,
    jobApplications: defaultJobApplications,
    jobOpenings: defaultJobOpenings,
  };
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>(() => {
    const stored = loadFromStorage();
    if (!stored) return buildDefault();

    // Auto-migrate old low-amount default data to new premium profit numbers
    const totalPaidRevenue = (stored.payments || [])
      .filter((p: any) => p.status === 'Paid')
      .reduce((s: number, p: any) => s + p.amount, 0);
    if (totalPaidRevenue < 30000) {
      stored.payments = defaultPayments;
      stored.orders = defaultOrders;
      stored.customers = defaultCustomers;
      stored.expenses = defaultExpenses;
    }

    // Purge any old Rent & Utilities category expenses from history
    if (stored.expenses) {
      stored.expenses = stored.expenses.filter((e: any) => e.category !== 'Rent & Utilities' && e.category !== ('Rent \u0026 Utilities' as any));
    } else {
      stored.expenses = defaultExpenses;
    }

    // Migrate old role permissions to include vendors & finance keys
    if (stored.roles) {
      stored.roles = stored.roles.map((r: any) => ({
        ...r,
        permissions: {
          products: r.permissions.products !== undefined ? r.permissions.products : false,
          orders: r.permissions.orders !== undefined ? r.permissions.orders : false,
          upload_files: r.permissions.upload_files !== undefined ? r.permissions.upload_files : false,
          contents: r.permissions.contents !== undefined ? r.permissions.contents : false,
          customers: r.permissions.customers !== undefined ? r.permissions.customers : false,
          payments: r.permissions.payments !== undefined ? r.permissions.payments : false,
          settings: r.permissions.settings !== undefined ? r.permissions.settings : false,
          promotions: r.permissions.promotions !== undefined ? r.permissions.promotions : false,
          vendors: r.permissions.vendors !== undefined ? r.permissions.vendors : (r.id === 'role-1'),
          finance: r.permissions.finance !== undefined ? r.permissions.finance : (r.id === 'role-1'),
          marketing: r.permissions.marketing !== undefined ? r.permissions.marketing : (r.id === 'role-1' || r.id === 'role-3'),
        }
      }));
    } else {
      stored.roles = defaultRoles;
    }

    if (!stored.teamMembers) {
      stored.teamMembers = defaultTeamMembers;
    } else {
      stored.teamMembers = stored.teamMembers.map((m: any) => {
        const def = defaultTeamMembers.find(d => d.id === m.id);
        return {
          ...m,
          salary: m.salary !== undefined ? m.salary : (def?.salary || 35000),
          phone: m.phone || def?.phone || '',
          paymentFrequency: m.paymentFrequency || def?.paymentFrequency || 'Monthly'
        };
      });
    }
    if (!stored.blogPosts) {
      stored.blogPosts = defaultBlogPosts;
    }
    if (!stored.contentBlocks) {
      stored.contentBlocks = defaultContentBlocks;
    } else {
      const storedBlocks = stored.contentBlocks;
      const updatedBlocks = [...storedBlocks];
      defaultContentBlocks.forEach(def => {
        const exists = storedBlocks.some(b => b.sectionName === def.sectionName);
        if (!exists) {
          updatedBlocks.push(def);
        }
      });
      stored.contentBlocks = updatedBlocks;
    }

    if (!stored.vendors) {
      stored.vendors = defaultVendors;
    }
    if (!stored.vendorOrders) {
      stored.vendorOrders = defaultVendorOrders;
    }
    if (!stored.expenses) {
      stored.expenses = defaultExpenses;
    }
    
    // Auto-merge new default products and update missing specifications for existing ones
    const storedProds = stored.products || [];
    const defaultProdsMap = new Map(defaultProducts.map(p => [p.id, p]));
    
    // Update existing products with missing fields from defaults
    const updatedProds = storedProds.map(p => {
      const def = defaultProdsMap.get(p.id);
      if (def) {
        return {
          ...p,
          shape: p.shape || def.shape,
          color: p.color || def.color,
          paperQuality: p.paperQuality || def.paperQuality,
          material: p.material || def.material,
        };
      }
      return p;
    });
    
    // Add any completely new default products
    const storedIds = new Set(updatedProds.map(p => p.id));
    const newProds = defaultProducts.filter(p => !storedIds.has(p.id));
    
    stored.products = [...updatedProds, ...newProds];

    if (!stored.campaigns) {
      stored.campaigns = defaultCampaigns;
    }
    if (!stored.clientLeads) stored.clientLeads = defaultClientLeads;
    stored.clientLeads = stored.clientLeads.map((cl: any) => ({
      ...cl,
      createdAt: cl.id === 'L-101' || cl.id === 'L-102' || cl.id === 'L-103' ? '2026-07-01' : cl.createdAt
    }));
    if (!stored.vendorLeads) stored.vendorLeads = defaultVendorLeads;
    stored.vendorLeads = stored.vendorLeads.map((vl: any) => ({
      ...vl,
      createdAt: vl.createdAt.startsWith('2026-07') || vl.createdAt.startsWith('2026-06-30') ? vl.createdAt : '2026-07-01'
    }));
    if (!stored.plannerLeads) stored.plannerLeads = defaultPlannerLeads;
    stored.plannerLeads = stored.plannerLeads.map((pl: any) => ({
      ...pl,
      createdAt: pl.createdAt.startsWith('2026-07') || pl.createdAt.startsWith('2026-06-30') ? pl.createdAt : '2026-07-01'
    }));
    if (!stored.corporateLeads) stored.corporateLeads = defaultCorporateLeads;
    stored.corporateLeads = stored.corporateLeads.map((cl: any) => ({
      ...cl,
      createdAt: cl.createdAt.startsWith('2026-07') || cl.createdAt.startsWith('2026-06-30') ? cl.createdAt : '2026-07-01'
    }));
    if (!stored.corporateOrders) stored.corporateOrders = defaultCorporateOrders;
    if (!stored.jobApplications) {
      stored.jobApplications = defaultJobApplications;
    } else {
      stored.jobApplications = stored.jobApplications.map((x: any) => ({
        ...x,
        resumeUrl: x.resumeUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }));
    }
    if (!stored.jobOpenings) {
      stored.jobOpenings = defaultJobOpenings;
    }

    return stored;
  });

  useEffect(() => { saveToStorage(state); }, [state]);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('eventique-admin-authenticated') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<TeamMember | null>(() => {
    const cached = sessionStorage.getItem('eventique-admin-user');
    return cached ? JSON.parse(cached) : null;
  });

  const set = useCallback(<K extends keyof AdminState>(key: K, updater: (prev: AdminState[K]) => AdminState[K]) => {
    setState(prev => ({ ...prev, [key]: updater(prev[key]) }));
  }, []);

  const addActivityLog = useCallback((action: string, detail: string, severity: 'info' | 'success' | 'warning' | 'danger' = 'info') => {
    const log: ActivityLog = { id: `log-${Date.now()}`, action, user: 'Admin', detail, timestamp: new Date().toLocaleString('en-IN'), severity };
    set('activityLogs', prev => [log, ...(prev as ActivityLog[]).slice(0, 99)]);
  }, [set]);

  const login = useCallback((email: string, password: string) => {
    const emailLower = email.toLowerCase().trim();
    const member = state.teamMembers.find(t => t.email.toLowerCase().trim() === emailLower);
    
    if (member) {
      const firstName = member.name.split(' ')[0].toLowerCase();
      const expectedPassword = `${firstName}123`;
      
      const isSuperAdmin = state.roles.find(r => r.id === member.roleId)?.name === 'Super Admin';
      const isMasterPassword = isSuperAdmin && password === 'eventique123';
      
      if (password === expectedPassword || isMasterPassword) {
        sessionStorage.setItem('eventique-admin-authenticated', 'true');
        sessionStorage.setItem('eventique-admin-user', JSON.stringify(member));
        setIsAuthenticated(true);
        setCurrentUser(member);
        addActivityLog('Admin Login', `${member.name} logged in successfully`, 'success');
        return true;
      }
    }
    
    addActivityLog('Admin Login Failed', `Failed login attempt for: ${email}`, 'danger');
    return false;
  }, [state.teamMembers, state.roles, addActivityLog]);

  const logout = useCallback(() => {
    sessionStorage.removeItem('eventique-admin-authenticated');
    sessionStorage.removeItem('eventique-admin-user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    addActivityLog('Admin Logout', 'Logged out of admin session', 'info');
  }, [addActivityLog]);

  const hasPermission = useCallback((key: PermissionKey) => {
    if (!currentUser) return false;
    const role = state.roles.find(r => r.id === currentUser.roleId);
    if (!role) return false;
    
    // Super Admin gets all permissions
    if (role.name === 'Super Admin') return true;
    
    return !!role.permissions[key];
  }, [currentUser, state.roles]);

  const value: AdminContextType = {
    state,
    isAuthenticated,
    currentUser,
    login,
    logout,
    hasPermission,
    addProduct: (p) => {
      const newProduct = { ...p, createdAt: p.createdAt || new Date().toISOString().split('T')[0] };
      set('products', prev => [...prev as Product[], newProduct]);
      addActivityLog('Product Added', p.name, 'success');
    },
    updateProduct: (id, p) => set('products', prev => (prev as Product[]).map(x => x.id === id ? { ...x, ...p } : x)),
    deleteProduct: (id) => { set('products', prev => (prev as Product[]).filter(x => x.id !== id)); addActivityLog('Product Deleted', id, 'danger'); },
    reorderProducts: (p) => set('products', () => p),
    addPackage: (p) => set('packages', prev => [...prev as Package[], p]),
    updatePackage: (id, p) => set('packages', prev => (prev as Package[]).map(x => x.id === id ? { ...x, ...p } : x)),
    deletePackage: (id) => set('packages', prev => (prev as Package[]).filter(x => x.id !== id)),
    reorderPackages: (p) => set('packages', () => p),
    addTestimonial: (t) => set('testimonials', prev => [...prev as Testimonial[], t]),
    updateTestimonial: (id, t) => set('testimonials', prev => (prev as Testimonial[]).map(x => x.id === id ? { ...x, ...t } : x)),
    deleteTestimonial: (id) => set('testimonials', prev => (prev as Testimonial[]).filter(x => x.id !== id)),
    reorderTestimonials: (t) => set('testimonials', () => t),
    addFAQ: (f) => set('faqs', prev => [...prev as FAQ[], f]),
    updateFAQ: (id, f) => set('faqs', prev => (prev as FAQ[]).map(x => x.id === id ? { ...x, ...f } : x)),
    deleteFAQ: (id) => set('faqs', prev => (prev as FAQ[]).filter(x => x.id !== id)),
    reorderFAQs: (f) => set('faqs', () => f),
    addHeroSlide: (s) => set('heroSlides', prev => [...prev as HeroSlide[], s]),
    updateHeroSlide: (id, s) => set('heroSlides', prev => (prev as HeroSlide[]).map(x => x.id === id ? { ...x, ...s } : x)),
    deleteHeroSlide: (id) => set('heroSlides', prev => (prev as HeroSlide[]).filter(x => x.id !== id)),
    reorderHeroSlides: (s, sectionId) => set('heroSlides', prev => {
      const otherSlides = (prev as HeroSlide[]).filter(x => (x.sectionId || 'Hero') !== (sectionId || 'Hero'));
      return [...otherSlides, ...s];
    }),
    addCategory: (c) => set('categories', prev => [...prev as Category[], c]),
    updateCategory: (id, c) => set('categories', prev => (prev as Category[]).map(x => x.id === id ? { ...x, ...c } : x)),
    deleteCategory: (id) => set('categories', prev => (prev as Category[]).filter(x => x.id !== id)),
    reorderCategories: (c) => set('categories', () => c),
    addService: (s) => set('services', prev => [...prev as Service[], s]),
    updateService: (id, s) => set('services', prev => (prev as Service[]).map(x => x.id === id ? { ...x, ...s } : x)),
    deleteService: (id) => set('services', prev => (prev as Service[]).filter(x => x.id !== id)),
    reorderServices: (s) => set('services', () => s),
    updateSection: (id, c) => set('sections', prev => (prev as SectionConfig[]).map(x => x.id === id ? { ...x, ...c } : x)),
    reorderSections: (s) => set('sections', () => s),
    updateOrder: (id, o) => { set('orders', prev => (prev as Order[]).map(x => x.id === id ? { ...x, ...o, updatedAt: new Date().toISOString() } : x)); addActivityLog('Order Updated', `${id} → ${o.status || ''}`, 'info'); },
    uploadOrderFile: (id, fileName, fileUrl) => {
      set('orders', prev => (prev as Order[]).map(x => x.id === id ? { ...x, uploadedFileName: fileName, uploadedFileUrl: fileUrl, status: 'Completed', updatedAt: new Date().toISOString() } : x));
      addActivityLog('File Uploaded', `Uploaded ${fileName} for ${id}`, 'success');
    },
    updateCustomer: (id, c) => set('customers', prev => (prev as Customer[]).map(x => x.id === id ? { ...x, ...c } : x)),
    updateReview: (id, r) => set('reviews', prev => (prev as Review[]).map(x => x.id === id ? { ...x, ...r } : x)),
    deleteReview: (id) => set('reviews', prev => (prev as Review[]).filter(x => x.id !== id)),
    addPromotion: (p) => { set('promotions', prev => [...prev as Promotion[], p]); addActivityLog('Promotion Created', p.couponCode, 'success'); },
    updatePromotion: (id, p) => set('promotions', prev => (prev as Promotion[]).map(x => x.id === id ? { ...x, ...p } : x)),
    deletePromotion: (id) => set('promotions', prev => (prev as Promotion[]).filter(x => x.id !== id)),
    updatePayment: (id, p) => set('payments', prev => (prev as Payment[]).map(x => x.id === id ? { ...x, ...p } : x)),
    addRole: (r) => { set('roles', prev => [...prev as Role[], r]); addActivityLog('Role Created', r.name, 'success'); },
    updateRole: (id, r) => set('roles', prev => (prev as Role[]).map(x => x.id === id ? { ...x, ...r } : x)),
    deleteRole: (id) => { set('roles', prev => (prev as Role[]).filter(x => x.id !== id)); addActivityLog('Role Deleted', id, 'danger'); },
    addVendor: (v) => { set('vendors', prev => [...prev as Vendor[], v]); addActivityLog('Vendor Added', v.companyName, 'success'); },
    updateVendor: (id, v) => set('vendors', prev => (prev as Vendor[]).map(x => x.id === id ? { ...x, ...v } : x)),
    deleteVendor: (id) => { set('vendors', prev => (prev as Vendor[]).filter(x => x.id !== id)); addActivityLog('Vendor Deleted', id, 'danger'); },
    addVendorOrder: (vo) => { set('vendorOrders', prev => [...prev as VendorOrder[], vo]); addActivityLog('Vendor Order Sent', `${vo.productName} (${vo.quantity})`, 'success'); },
    updateVendorOrder: (id, vo) => set('vendorOrders', prev => (prev as VendorOrder[]).map(x => x.id === id ? { ...x, ...vo } : x)),
    deleteVendorOrder: (id) => { set('vendorOrders', prev => (prev as VendorOrder[]).filter(x => x.id !== id)); addActivityLog('Vendor Order Deleted', id, 'danger'); },
    addTeamMember: (m) => { set('teamMembers', prev => [...prev as TeamMember[], m]); addActivityLog('Team Member Added', m.name, 'success'); },
    updateTeamMember: (id, m) => set('teamMembers', prev => (prev as TeamMember[]).map(x => x.id === id ? { ...x, ...m } : x)),
    deleteTeamMember: (id) => { set('teamMembers', prev => (prev as TeamMember[]).filter(x => x.id !== id)); addActivityLog('Team Member Removed', id, 'danger'); },
    addExpense: (e) => { set('expenses', prev => [...prev as Expense[], e]); addActivityLog('Expense Recorded', `${e.title} (₹${e.amount})`, 'success'); },
    updateExpense: (id, e) => set('expenses', prev => (prev as Expense[]).map(x => x.id === id ? { ...x, ...e } : x)),
    deleteExpense: (id) => { set('expenses', prev => (prev as Expense[]).filter(x => x.id !== id)); addActivityLog('Expense Deleted', id, 'danger'); },
    addMediaFile: (m) => set('mediaFiles', prev => [...prev as MediaFile[], m]),
    updateMediaFile: (id, m) => set('mediaFiles', prev => (prev as MediaFile[]).map(x => x.id === id ? { ...x, ...m } : x)),
    deleteMediaFile: (id) => set('mediaFiles', prev => (prev as MediaFile[]).filter(x => x.id !== id)),
    updateContentBlock: (id, b) => set('contentBlocks', prev => (prev as ContentBlock[]).map(x => x.id === id ? { ...x, ...b, lastUpdated: new Date().toLocaleDateString() } : x)),
    addContentBlock: (b) => {
      set('contentBlocks', prev => [...prev as ContentBlock[], b]);
      addActivityLog('Content Block Added', b.sectionName, 'success');
    },
    deleteContentBlock: (id) => {
      set('contentBlocks', prev => (prev as ContentBlock[]).filter(x => x.id !== id));
      addActivityLog('Content Block Deleted', id, 'danger');
    },
    addBlogPost: (post) => { set('blogPosts', prev => [...prev as BlogPost[], post]); addActivityLog('Blog Post Added', post.title, 'success'); },
    updateBlogPost: (id, post) => set('blogPosts', prev => (prev as BlogPost[]).map(x => x.id === id ? { ...x, ...post } : x)),
    deleteBlogPost: (id) => { set('blogPosts', prev => (prev as BlogPost[]).filter(x => x.id !== id)); addActivityLog('Blog Post Deleted', String(id), 'danger'); },
    updateSettings: (s) => setState(prev => ({ ...prev, settings: { ...prev.settings, ...s } })),
    addActivityLog,
    purgeActivityLogs: () => set('activityLogs', () => []),
    resetToDefaults: () => setState(buildDefault()),
    addCampaign: (c) => {
      set('campaigns', prev => [...prev as LaunchCampaign[], c]);
      addActivityLog('Campaign Created', c.title, 'success');
    },
    updateCampaign: (id, c) => {
      set('campaigns', prev => (prev as LaunchCampaign[]).map(x => x.id === id ? { ...x, ...c } : x));
      addActivityLog('Campaign Updated', id, 'info');
    },
    deleteCampaign: (id) => {
      set('campaigns', prev => (prev as LaunchCampaign[]).filter(x => x.id !== id));
      addActivityLog('Campaign Deleted', id, 'danger');
    },
    addClientLead: (l) => {
      set('clientLeads', prev => [...prev as ClientLead[], l]);
      addActivityLog('Client Lead Added', l.name, 'success');
    },
    updateClientLead: (id, l) => {
      set('clientLeads', prev => (prev as ClientLead[]).map(x => x.id === id ? { ...x, ...l } : x));
      addActivityLog('Client Lead Updated', id, 'info');
    },
    deleteClientLead: (id) => {
      set('clientLeads', prev => (prev as ClientLead[]).filter(x => x.id !== id));
      addActivityLog('Client Lead Deleted', id, 'danger');
    },
    addVendorLead: (vl) => {
      set('vendorLeads', prev => [...prev as VendorLead[], vl]);
      addActivityLog('Vendor Lead Added', vl.companyName, 'success');
    },
    updateVendorLead: (id, vl) => {
      set('vendorLeads', prev => (prev as VendorLead[]).map(x => x.id === id ? { ...x, ...vl } : x));
      addActivityLog('Vendor Lead Updated', id, 'info');
    },
    deleteVendorLead: (id) => {
      set('vendorLeads', prev => (prev as VendorLead[]).filter(x => x.id !== id));
      addActivityLog('Vendor Lead Deleted', id, 'danger');
    },
    addPlannerLead: (pl) => {
      set('plannerLeads', prev => [...prev as PlannerLead[], pl]);
      addActivityLog('Planner Lead Added', pl.agencyName, 'success');
    },
    updatePlannerLead: (id, pl) => {
      set('plannerLeads', prev => (prev as PlannerLead[]).map(x => x.id === id ? { ...x, ...pl } : x));
      addActivityLog('Planner Lead Updated', id, 'info');
    },
    deletePlannerLead: (id) => {
      set('plannerLeads', prev => (prev as PlannerLead[]).filter(x => x.id !== id));
      addActivityLog('Planner Lead Deleted', id, 'danger');
    },
    addCorporateLead: (cl) => {
      set('corporateLeads', prev => [...prev as CorporateLead[], cl]);
      addActivityLog('Corporate Lead Added', cl.company, 'success');
    },
    updateCorporateLead: (id, cl) => {
      set('corporateLeads', prev => (prev as CorporateLead[]).map(x => x.id === id ? { ...x, ...cl } : x));
      addActivityLog('Corporate Lead Updated', id, 'info');
    },
    deleteCorporateLead: (id) => {
      set('corporateLeads', prev => (prev as CorporateLead[]).filter(x => x.id !== id));
      addActivityLog('Corporate Lead Deleted', id, 'danger');
    },
    addCorporateOrder: (co) => {
      set('corporateOrders', prev => [...prev as CorporateOrder[], co]);
      addActivityLog('Corporate Order Added', co.company, 'success');
    },
    updateCorporateOrder: (id, co) => {
      set('corporateOrders', prev => (prev as CorporateOrder[]).map(x => x.id === id ? { ...x, ...co } : x));
      addActivityLog('Corporate Order Updated', id, 'info');
    },
    deleteCorporateOrder: (id) => {
      set('corporateOrders', prev => (prev as CorporateOrder[]).filter(x => x.id !== id));
      addActivityLog('Corporate Order Deleted', id, 'danger');
    },
    convertCorporateLeadToOrder: (leadId, pricePerUnit, gst) => {
      setState(prev => {
        const lead = prev.corporateLeads.find(l => l.id === leadId);
        if (!lead) return prev;
        const newOrder: CorporateOrder = {
          id: `CO-${Date.now().toString().slice(-4)}`,
          company: lead.company,
          contact: lead.contact,
          email: lead.email,
          phone: lead.phone,
          product: lead.product,
          qty: lead.qty,
          pricePerUnit,
          total: lead.qty * pricePerUnit,
          gst,
          status: 'Planning',
          date: new Date().toISOString().split('T')[0]
        };
        const nextState = {
          ...prev,
          corporateLeads: prev.corporateLeads.filter(l => l.id !== leadId),
          corporateOrders: [...prev.corporateOrders, newOrder]
        };
        saveToStorage(nextState);
        return nextState;
      });
      addActivityLog('B2B Lead Converted', `Converted lead ${leadId} to Order`, 'success');
    },
    simulateLiveInquiry: () => {
      const names = ['Karan Johar', 'Ranbir Kapoor', 'Alia Bhatt', 'Deepika Padukone', 'Ranveer Singh', 'Anushka Sharma', 'Virat Kohli'];
      const phones = ['+91 99887 76655', '+91 88776 65544', '+91 77665 54433', '+91 66554 43322'];
      const emails = ['karan@dharmaprod.com', 'ranbir@kapoor.com', 'alia@bhatt.in', 'deepika@padukone.com', 'ranveer@singh.com'];
      const products = ['Floral Wedding Suite', 'Modern E-Invite', 'Ganesh Chaturthi Video Card', 'Royal Box Printed Cards', 'Corporate Gift Box Set'];
      const tagsFiltered: ClientLeadTag[] = ['Invitations', 'Stationery', 'Gifts', 'Corporate'];
      const eventTypes = ['Wedding', 'Birthday', 'Corporate', 'Anniversary', 'Other'];
      const sources = ['Website Form', 'WhatsApp', 'Instagram', 'Facebook', 'Referral', 'Direct Call'];

      const newLead: ClientLead = {
        id: `L-${Math.floor(Math.random() * 900 + 100)}`,
        name: names[Math.floor(Math.random() * names.length)],
        phone: phones[Math.floor(Math.random() * phones.length)],
        email: emails[Math.floor(Math.random() * emails.length)],
        eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)] as any,
        interestedProduct: products[Math.floor(Math.random() * products.length)],
        budget: Math.floor(Math.random() * 50 + 5) * 5000,
        source: sources[Math.floor(Math.random() * sources.length)] as any,
        status: 'New',
        assignedTo: 'Rohan Verma',
        notes: 'Automatically captured via simulator.',
        tag: tagsFiltered[Math.floor(Math.random() * tagsFiltered.length)],
        createdAt: new Date().toISOString().split('T')[0]
      };

      setState(prev => {
        const nextState = {
          ...prev,
          clientLeads: [...prev.clientLeads, newLead]
        };
        saveToStorage(nextState);
        return nextState;
      });
      addActivityLog('Simulated Inquiry Captured', `${newLead.name} - ${newLead.interestedProduct}`, 'success');
    },
    addJobApplication: (app) => {
      set('jobApplications', prev => [...prev as JobApplication[], app]);
      addActivityLog('Job Application Received', `${app.name} - ${app.position}`, 'info');
    },
    updateJobApplication: (id, app) => {
      set('jobApplications', prev => (prev as JobApplication[]).map(x => x.id === id ? { ...x, ...app } : x));
      addActivityLog('Job Application Updated', id, 'info');
    },
    deleteJobApplication: (id) => {
      set('jobApplications', prev => (prev as JobApplication[]).filter(x => x.id !== id));
      addActivityLog('Job Application Deleted', id, 'danger');
    },
    hireApplicant: (appId, roleId) => {
      setState(prev => {
        const app = prev.jobApplications.find(x => x.id === appId);
        if (!app) return prev;
        const newMember: TeamMember = {
          id: `m-${Date.now().toString().slice(-4)}`,
          name: app.name,
          email: app.email,
          phone: app.phone,
          roleId: roleId,
          status: 'Active',
          joinedAt: new Date().toISOString().split('T')[0],
          salary: 45000,
          paymentFrequency: 'Monthly'
        };
        const nextState = {
          ...prev,
          jobApplications: prev.jobApplications.map(x => x.id === appId ? { ...x, status: 'Approved' } : x),
          teamMembers: [...prev.teamMembers, newMember]
        };
        saveToStorage(nextState);
        return nextState;
      });
      addActivityLog('Applicant Hired', `Hired applicant ${appId} into the team`, 'success');
    },
    addJobOpening: (opening) => {
      setState(prev => {
        const newOpening: JobOpening = {
          ...opening,
          id: `job-${Date.now().toString().slice(-4)}`
        };
        const next = {
          ...prev,
          jobOpenings: [...prev.jobOpenings, newOpening]
        };
        saveToStorage(next);
        return next;
      });
      addActivityLog('Job Opening Created', `Created new job posting for ${opening.title}`, 'info');
    },
    deleteJobOpening: (id) => {
      setState(prev => {
        const next = {
          ...prev,
          jobOpenings: prev.jobOpenings.filter(x => x.id !== id)
        };
        saveToStorage(next);
        return next;
      });
      addActivityLog('Job Opening Deleted', `Removed job posting ${id}`, 'danger');
    },
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
