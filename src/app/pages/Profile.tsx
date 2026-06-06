import { useState } from 'react';
import {
  User, Package, HelpCircle, Mail, Phone, MapPin,
  Download, Truck, ChevronDown, ChevronRight,
  Edit3, LogOut, Lock, Bell, CheckCircle2, XCircle,
  RefreshCw, FileVideo, FileText, Globe, Box,
  Star, ArrowRight, ShoppingBag,
} from 'lucide-react';

type Tab = 'details' | 'orders' | 'help';
type OrderTab = 'digital' | 'physical';
type OrderStatus = 'completed' | 'processing' | 'on-hold' | 'cancelled';

interface DigitalOrder {
  id: string; date: string; product: string;
  type: 'video' | 'pdf' | 'website'; status: OrderStatus;
  amount: string; downloadUrl?: string; downloadExpiry?: string;
}
interface PhysicalOrder {
  id: string; date: string; product: string; quantity: number;
  status: OrderStatus; amount: string; trackingId?: string;
  trackingUrl?: string; estimatedDelivery?: string; deliveredOn?: string;
}

const digitalOrders: DigitalOrder[] = [
  { id: '#EQ-2025-0041', date: '28 Apr 2025', product: 'Royal Hindu Wedding Video Invite', type: 'video', status: 'completed', amount: '₹1,499', downloadUrl: '#', downloadExpiry: '28 Apr 2026' },
  { id: '#EQ-2025-0038', date: '15 Apr 2025', product: 'Floral Engagement PDF Invitation', type: 'pdf', status: 'completed', amount: '₹699', downloadUrl: '#', downloadExpiry: '15 Apr 2026' },
  { id: '#EQ-2025-0031', date: '02 Mar 2025', product: 'Premium Wedding Website – Eternally Yours', type: 'website', status: 'processing', amount: '₹3,999' },
];
const physicalOrders: PhysicalOrder[] = [
  { id: '#EQ-2025-0044', date: '01 May 2025', product: 'Luxury Gold Foil Wedding Invitation Set (100 pcs)', quantity: 100, status: 'processing', amount: '₹12,500', estimatedDelivery: '10 May 2025' },
  { id: '#EQ-2025-0029', date: '20 Feb 2025', product: 'Velvet Boxed Wedding Suite – Maharani Collection', quantity: 50, status: 'completed', amount: '₹18,000', trackingId: 'DTDC7845129630', trackingUrl: '#', deliveredOn: '01 Mar 2025' },
  { id: '#EQ-2025-0019', date: '10 Jan 2025', product: 'Baby Shower Mehndi Printed Invite (25 pcs)', quantity: 25, status: 'cancelled', amount: '₹2,200' },
];
const faqs = [
  { q: 'How do I download my digital invitation?', a: 'Once your order is marked "Completed", a Download button appears in Digital Downloads. Files are available for 1 year from purchase.' },
  { q: 'How long does printed stationery take to deliver?', a: 'Standard printing + dispatch takes 5–7 business days, plus 2–4 days for delivery depending on your location.' },
  { q: 'Can I customise the wording on my invite?', a: 'Yes! After placing your order, our design team will email you within 24 hours to collect your event details and personalise every element.' },
  { q: 'What if I need to change my order details?', a: 'Modifications are accepted within 24 hours. Please email support@eventique.in — we begin design work quickly.' },
  { q: 'Do you offer refunds?', a: 'Digital products are non-refundable once downloaded. Physical orders can be refunded within 48 hours of delivery for quality issues.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI (GPay, PhonePe, Paytm), Net Banking, and EMI via Razorpay. All transactions are SSL-secured.' },
];

const statusMap: Record<OrderStatus, { label: string; dot: string; text: string; bg: string }> = {
  completed:  { label: 'Completed',  dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  processing: { label: 'Processing', dot: 'bg-amber-400',   text: 'text-amber-700',   bg: 'bg-amber-50'   },
  'on-hold':  { label: 'On Hold',    dot: 'bg-blue-400',    text: 'text-blue-700',    bg: 'bg-blue-50'    },
  cancelled:  { label: 'Cancelled',  dot: 'bg-red-400',     text: 'text-red-600',     bg: 'bg-red-50'     },
};
const typeIconMap: Record<DigitalOrder['type'], React.ReactNode> = {
  video:   <FileVideo className="w-5 h-5" style={{ color: '#8B4949' }} />,
  pdf:     <FileText  className="w-5 h-5" style={{ color: '#C4902A' }} />,
  website: <Globe     className="w-5 h-5 text-indigo-400" />,
};
const typeLabelMap: Record<DigitalOrder['type'], string> = {
  video: 'Video Invite', pdf: 'PDF Invite', website: 'Wedding Website',
};

function StatusPill({ status }: { status: OrderStatus }) {
  const s = statusMap[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${s.text} ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {s.label}
    </span>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl overflow-hidden border transition-all ${open ? 'border-gray-200' : 'border-gray-100'}`}>
      <button onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-5 py-4 text-left gap-4 transition-colors ${open ? 'bg-white' : 'bg-[#FAFAF8] hover:bg-gray-50'}`}>
        <span className="text-sm text-gray-700">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-3 text-sm text-gray-500 bg-white leading-relaxed border-t border-gray-100">{a}</div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────── */
export default function Profile() {
  const [tab, setTab]           = useState<Tab>('details');
  const [orderTab, setOrderTab] = useState<OrderTab>('digital');
  const [editMode, setEditMode] = useState(false);

  const user = {
    name: 'Priya Sharma', email: 'priya.sharma@example.com',
    phone: '+91 98765 43210', address: '123 MG Road, Bangalore, Karnataka 560001',
    joined: 'January 2025', initials: 'PS',
  };

  const navItems: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'details', label: 'Personal Details', icon: <User className="w-[17px] h-[17px]" /> },
    { key: 'orders',  label: 'My Orders',        icon: <Package className="w-[17px] h-[17px]" /> },
    { key: 'help',    label: 'Help & FAQ',        icon: <HelpCircle className="w-[17px] h-[17px]" /> },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F0EA' }}>

      {/* ── PROFILE HERO ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #5C2E2E 0%, #8B4949 45%, #A0622A 100%)' }}>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10" style={{ border: '40px solid #D4AF37' }} />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-10" style={{ border: '30px solid #D4AF37' }} />
        <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-36 h-36 rounded-full opacity-5" style={{ border: '20px solid #fff' }} />

        <div className="relative max-w-[980px] mx-auto px-4 py-10 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-[88px] h-[88px] rounded-full flex items-center justify-center text-white mx-auto select-none"
              style={{
                background: 'linear-gradient(145deg, #D4AF37 0%, #C4902A 100%)',
                fontSize: '1.6rem',
                fontFamily: 'Bricolage Grotesque, sans-serif',
                letterSpacing: '0.06em',
                boxShadow: '0 0 0 4px rgba(212,175,55,0.35), 0 8px 24px rgba(0,0,0,0.25)',
              }}>
              {user.initials}
            </div>
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <h1 className="text-white mb-1" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '1.4rem' }}>
            {user.name}
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Member since {user.joined}</p>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="max-w-[980px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* SIDEBAR */}
          <aside className="w-full lg:w-[220px] flex-shrink-0">
            <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: '#fff', border: '1px solid #E8E0D5' }}>
              <nav className="py-2">
                {navItems.map((item, idx) => {
                  const active = tab === item.key;
                  return (
                    <button key={item.key} onClick={() => setTab(item.key)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-all relative${idx < navItems.length - 1 ? ' border-b' : ''}`}
                      style={{
                        borderColor: '#F0E8DE',
                        backgroundColor: active ? '#8B4949' : 'transparent',
                        color: active ? '#fff' : '#666',
                      }}>
                      {active && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r"
                          style={{ backgroundColor: '#D4AF37' }} />
                      )}
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{
                          backgroundColor: active ? 'rgba(255,255,255,0.15)' : '#F7F2EC',
                          color: active ? '#fff' : '#8B4949',
                        }}>
                        {item.icon}
                      </span>
                      <span className="flex-1 text-left text-sm">{item.label}</span>
                      {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                    </button>
                  );
                })}
              </nav>
              <div className="p-3 border-t" style={{ borderColor: '#F0E8DE' }}>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-50 transition-colors">
                  <LogOut className="w-[17px] h-[17px]" />
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* CONTENT */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Personal Details */}
            {tab === 'details' && (
              <>
                <ContentCard>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-[15px] text-gray-800">Contact Information</h2>
                      <p className="text-xs mt-0.5 text-gray-400">Your billing & contact details</p>
                    </div>
                    <button onClick={() => setEditMode(!editMode)}
                      className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border transition-all"
                      style={editMode
                        ? { backgroundColor: '#8B4949', color: '#fff', borderColor: '#8B4949' }
                        : { color: '#8B4949', borderColor: '#D4AF3780', backgroundColor: '#FDFAF5' }}>
                      <Edit3 className="w-3 h-3" />
                      {editMode ? 'Save Changes' : 'Edit Profile'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    <InfoField icon={<User className="w-4 h-4" />}   label="Full Name"       value={user.name}    editable={editMode} />
                    <InfoField icon={<Mail className="w-4 h-4" />}   label="Email Address"   value={user.email}   editable={editMode} type="email" />
                    <InfoField icon={<Phone className="w-4 h-4" />}  label="Phone Number"    value={user.phone}   editable={editMode} type="tel" />
                    <InfoField icon={<MapPin className="w-4 h-4" />} label="Billing Address" value={user.address} editable={editMode} />
                  </div>
                </ContentCard>

                <ContentCard>
                  <h2 className="text-[15px] text-gray-800 mb-4">Account Settings</h2>
                  <div className="space-y-2">
                    <SettingRow icon={<Lock className="w-4 h-4" />} label="Change Password" />
                    <SettingRow icon={<Bell className="w-4 h-4" />} label="Notification Preferences" />
                    <SettingRow icon={<Star className="w-4 h-4" />} label="My Reviews" />
                  </div>
                </ContentCard>
              </>
            )}

            {/* My Orders */}
            {tab === 'orders' && (
              <>
                <div className="flex gap-3 flex-wrap">
                  <OrderTabBtn
                    active={orderTab === 'digital'}
                    onClick={() => setOrderTab('digital')}
                    icon={<Download className="w-4 h-4" />}
                    label="Digital Downloads"
                    count={digitalOrders.length}
                  />
                  <OrderTabBtn
                    active={orderTab === 'physical'}
                    onClick={() => setOrderTab('physical')}
                    icon={<Box className="w-4 h-4" />}
                    label="Shipped Orders"
                    count={physicalOrders.length}
                  />
                </div>

                {orderTab === 'digital' && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-400 px-1">Files are available for 1 year after purchase.</p>
                    {digitalOrders.length === 0
                      ? <EmptyState icon={<Download className="w-10 h-10" />} message="No digital downloads yet." />
                      : digitalOrders.map(o => <DigitalCard key={o.id} order={o} />)}
                  </div>
                )}

                {orderTab === 'physical' && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-400 px-1">Printed invites & physical products. Tracking updates sent via email.</p>
                    {physicalOrders.length === 0
                      ? <EmptyState icon={<ShoppingBag className="w-10 h-10" />} message="No shipped orders yet." />
                      : physicalOrders.map(o => <PhysicalCard key={o.id} order={o} />)}
                  </div>
                )}
              </>
            )}

            {/* Help & FAQ */}
            {tab === 'help' && (
              <>
                <ContentCard>
                  <h2 className="text-[15px] text-gray-800 mb-1">Frequently Asked Questions</h2>
                  <p className="text-xs text-gray-400 mb-5">
                    Can't find an answer?{' '}
                    <a href="mailto:support@eventique.in" style={{ color: '#8B4949' }}>support@eventique.in</a>
                  </p>
                  <div className="space-y-2">
                    {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
                  </div>
                </ContentCard>

                <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  style={{ background: 'linear-gradient(135deg,#8B494908,#D4AF3712)', border: '1px solid #D4AF3730' }}>
                  <div>
                    <p className="text-sm text-gray-800">Still need help?</p>
                    <p className="text-xs text-gray-400 mt-0.5">Our team replies within 2–4 business hours.</p>
                  </div>
                  <a href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm text-white hover:opacity-90 transition-opacity flex-shrink-0"
                    style={{ backgroundColor: '#8B4949' }}>
                    Contact Support <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable pieces ─────────────────────────────────────────── */

function ContentCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: '#fff', border: '1px solid #E8E0D5' }}>
      {children}
    </div>
  );
}

function InfoField({ icon, label, value, editable, type = 'text' }: {
  icon: React.ReactNode; label: string; value: string; editable?: boolean; type?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: '#F7F0E6', color: '#8B4949' }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-1 text-gray-400">{label}</p>
        {editable
          ? <input type={type} defaultValue={value}
              className="w-full text-sm rounded-lg px-3 py-1.5 outline-none transition-colors"
              style={{ border: '1px solid #D4AF3770', background: '#FDFAF5' }} />
          : <p className="text-sm text-gray-700">{value}</p>}
      </div>
    </div>
  );
}

function SettingRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors group"
      style={{ border: '1px solid #F0EBE3' }}>
      <span style={{ color: '#8B4949' }}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}

function OrderTabBtn({ active, onClick, icon, label, count }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count: number;
}) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm transition-all"
      style={active
        ? { backgroundColor: '#8B4949', color: '#fff', boxShadow: '0 4px 12px rgba(139,73,73,0.3)' }
        : { backgroundColor: '#fff', color: '#888', border: '1px solid #E8E0D5' }}>
      {icon}
      <span>{label}</span>
      <span className="text-xs px-1.5 py-0.5 rounded-full ml-0.5"
        style={active
          ? { backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }
          : { backgroundColor: '#F0EBE3', color: '#8B4949' }}>
        {count}
      </span>
    </button>
  );
}

function DigitalCard({ order }: { order: DigitalOrder }) {
  return (
    <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: '#fff', border: '1px solid #E8E0D5' }}>
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F7F0E6' }}>
          {typeIconMap[order.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-800 leading-snug">{order.product}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="text-xs text-gray-400">{order.id}</span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400">{order.date}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#D4AF3720', color: '#9A7D1A' }}>
                  {typeLabelMap[order.type]}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <StatusPill status={order.status} />
              <p className="text-sm text-gray-700">{order.amount}</p>
            </div>
          </div>

          {order.status === 'completed' && order.downloadUrl && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t flex-wrap gap-2" style={{ borderColor: '#F0EBE3' }}>
              <p className="text-xs text-gray-400">Available until {order.downloadExpiry}</p>
              <a href={order.downloadUrl} download
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#8B4949' }}>
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            </div>
          )}
          {order.status === 'processing' && (
            <div className="mt-3 pt-3 border-t" style={{ borderColor: '#F0EBE3' }}>
              <p className="text-xs text-amber-600 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Being prepared — you'll get an email once it's ready.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PhysicalCard({ order }: { order: PhysicalOrder }) {
  return (
    <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: '#fff', border: '1px solid #E8E0D5' }}>
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F7F0E6' }}>
          <Box className="w-5 h-5" style={{ color: '#8B4949' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-800 leading-snug">{order.product}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="text-xs text-gray-400">{order.id}</span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400">{order.date}</span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400">Qty: {order.quantity}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <StatusPill status={order.status} />
              <p className="text-sm text-gray-700">{order.amount}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t" style={{ borderColor: '#F0EBE3' }}>
            {order.status === 'processing' && order.estimatedDelivery && (
              <p className="text-xs text-amber-700 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                Expected by <strong className="ml-0.5">{order.estimatedDelivery}</strong> — tracking shared once dispatched.
              </p>
            )}
            {order.status === 'completed' && (
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Delivered on <strong className="ml-0.5">{order.deliveredOn}</strong>
                </p>
                {order.trackingId && (
                  <a href={order.trackingUrl || '#'} target="_blank" rel="noopener noreferrer"
                    className="text-xs flex items-center gap-1 underline underline-offset-2"
                    style={{ color: '#8B4949' }}>
                    <Truck className="w-3.5 h-3.5" /> {order.trackingId}
                  </a>
                )}
              </div>
            )}
            {order.status === 'cancelled' && (
              <p className="text-xs text-red-500 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                Order cancelled. Refund processed within 5–7 business days.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="rounded-2xl py-16 flex flex-col items-center gap-3"
      style={{ backgroundColor: '#fff', border: '1px solid #E8E0D5' }}>
      <div className="text-gray-200">{icon}</div>
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}
