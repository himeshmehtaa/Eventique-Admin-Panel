import { useState, useMemo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router';
import { Menu, Bell, Search, User, Settings, Shield, LogOut, CheckCheck, ClipboardList, Star, CreditCard, Upload, Package, Tag, RefreshCw, Download } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  '/admin':              { title: 'Dashboard',     subtitle: 'Welcome back' },
  '/admin/products':     { title: 'Products',      subtitle: 'Manage your invitation products' },
  '/admin/orders':       { title: 'Orders',        subtitle: 'Upload files & track shipments' },
  '/admin/vendors':      { title: 'Partners',      subtitle: 'Manage sourcing vendors & B2B planner partners' },
  '/admin/analytics':    { title: 'Analytics',     subtitle: 'Performance by product type' },
  '/admin/promotions':   { title: 'Promotions',    subtitle: 'Coupons & campaigns' },
  '/admin/contents':     { title: 'Contents',      subtitle: 'Website content management' },
  '/admin/customers':    { title: 'Customers',     subtitle: 'Customer list & reviews' },
  '/admin/roles':        { title: 'Roles',         subtitle: 'Permissions & access control' },
  '/admin/payments':     { title: 'Payments',      subtitle: 'Transaction history' },
  '/admin/finance':      { title: 'Finance & Expenses', subtitle: 'Ledger, payroll & margin tracking' },
  '/admin/settings':     { title: 'Settings',      subtitle: 'Brand, SEO & system utilities' },
  '/admin/packages':     { title: 'Packages',      subtitle: 'Pricing packages' },
  '/admin/testimonials': { title: 'Testimonials',  subtitle: 'Customer reviews' },
  '/admin/faqs':         { title: 'FAQs',          subtitle: 'Frequently asked questions' },
  '/admin/hero-slides':  { title: 'Hero Slides',   subtitle: 'Homepage carousel' },
  '/admin/categories':   { title: 'Categories',    subtitle: 'Browse occasions' },
  '/admin/services':     { title: 'Services',      subtitle: 'Service cards' },
  '/admin/page-builder': { title: 'Page Builder',  subtitle: 'Section order & visibility' },
};

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, logout } = useAdmin();
  const info = routeTitles[location.pathname] || { title: 'Admin', subtitle: '' };

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // Mock unread count
  const [notifTab, setNotifTab] = useState<'all' | 'orders' | 'reviews' | 'payments' | 'system'>('all');

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currPw, setCurrPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (currPw !== 'eventique123') {
      setPwError('Current password is incorrect.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('New passwords do not match.');
      return;
    }
    setPwError('');
    setPwSuccess(true);
    setCurrPw('');
    setNewPw('');
    setConfirmPw('');
  };

  const recentLogs = useMemo(() => {
    const logs = state.activityLogs.filter(log => {
      const act = log.action.toLowerCase();
      const det = log.detail.toLowerCase();
      if (notifTab === 'all') return true;
      if (notifTab === 'orders') return act.includes('order') || det.includes('order');
      if (notifTab === 'reviews') return act.includes('review') || det.includes('review');
      if (notifTab === 'payments') return act.includes('payment') || det.includes('payment');
      if (notifTab === 'system') {
        return !act.includes('order') && !det.includes('order') &&
               !act.includes('review') && !det.includes('review') &&
               !act.includes('payment') && !det.includes('payment');
      }
      return true;
    });
    return logs.slice(0, 5);
  }, [state.activityLogs, notifTab]);

  const getLogIcon = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('order')) return <ClipboardList size={14} className="text-[#8B4949]" />;
    if (act.includes('review')) return <Star size={14} className="text-[#D4AF37]" />;
    if (act.includes('payment')) return <CreditCard size={14} className="text-green-600" />;
    if (act.includes('file') || act.includes('upload')) return <Upload size={14} className="text-blue-600" />;
    if (act.includes('product')) return <Package size={14} className="text-indigo-600" />;
    if (act.includes('promo') || act.includes('coupon')) return <Tag size={14} className="text-purple-600" />;
    return <RefreshCw size={14} className="text-gray-600" />;
  };

  const getLogBg = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('order')) return 'bg-[#8B4949]/10';
    if (act.includes('review')) return 'bg-[#D4AF37]/10';
    if (act.includes('payment')) return 'bg-green-500/10';
    if (act.includes('file') || act.includes('upload')) return 'bg-blue-500/10';
    if (act.includes('product')) return 'bg-indigo-500/10';
    if (act.includes('promo') || act.includes('coupon')) return 'bg-purple-500/10';
    return 'bg-gray-500/10';
  };

  return (
    <header className="bg-white border-b border-[#e5e5e5] px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30 relative">
      {/* Fullscreen click-away backdrop */}
      {(showNotifications || showProfile) && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => { setShowNotifications(false); setShowProfile(false); }} 
        />
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#f5f0e8] text-gray-500 hover:text-[#8B4949] transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-[#1a1410] leading-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {info.title}
          </h1>
          <p className="text-xs text-gray-400">{info.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 relative z-50">
        {/* Expanded premium search bar */}
        <div className="hidden md:flex items-center gap-2 bg-[#faf8f5] border border-[#e5e5e5] rounded-xl px-3.5 py-2 w-72 lg:w-96 focus-within:border-[#8B4949] focus-within:shadow-[0_0_0_3px_rgba(139,73,73,0.08)] transition-all duration-300">
          <Search size={13} className="text-gray-400 flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm text-[#4a4a4a] placeholder-gray-400 w-full" 
          />
        </div>

        {/* Working notifications bell */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className={`w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#f5f0e8] text-gray-500 hover:text-[#8B4949] transition-all cursor-pointer relative ${showNotifications ? 'bg-[#f5f0e8] text-[#8B4949]' : ''}`}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-white border border-[#e5e5e5] rounded-2xl shadow-xl py-3 z-50 admin-scale-in">
              <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                <span className="font-bold text-sm text-[#1a1410]">Recent Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="text-[10px] font-bold text-[#8B4949] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck size={11} /> Mark all read
                  </button>
                )}
              </div>

              {/* Notification Category Tabs */}
              <div className="px-3 py-2 bg-[#faf8f5] border-b border-gray-100 flex gap-1 overflow-x-auto admin-scrollbar">
                {(['all', 'orders', 'reviews', 'payments', 'system'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setNotifTab(tab)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      notifTab === tab
                        ? 'bg-[#8B4949] text-white shadow-sm'
                        : 'text-gray-400 hover:text-[#8B4949] hover:bg-[#f5f0e8]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="max-h-64 overflow-y-auto admin-scrollbar divide-y divide-gray-50">
                {recentLogs.length === 0 ? (
                  <p className="text-center py-6 text-xs text-gray-400">No recent notifications</p>
                ) : (
                  recentLogs.map((log) => (
                    <div key={log.id} className="p-3 hover:bg-[#faf8f5] transition-colors flex gap-2.5 items-start">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${getLogBg(log.action)}`}>
                        {getLogIcon(log.action)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#1a1410] truncate">{log.action}</p>
                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-normal">{log.detail}</p>
                        <p className="text-[9px] text-gray-400 mt-1 font-medium">{log.timestamp}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-gray-100 pt-2 px-3">
                <Link
                  to="/admin/settings?tab=utilities&sub=logs"
                  onClick={() => setShowNotifications(false)}
                  className="w-full text-center py-1.5 bg-[#faf8f5] hover:bg-[#f5f0e8] text-xs font-bold text-[#8B4949] rounded-lg transition-colors block"
                >
                  View All Activity Logs
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar section */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
            alt="Amit Patel"
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="w-9 h-9 rounded-full object-cover border-2 border-[#D4AF37]/50 shadow-sm cursor-pointer hover:scale-105 transition-all select-none"
          />

          {/* Profile Dropdown Popover */}
          {showProfile && (
            <div className="absolute right-0 top-11 w-64 bg-white border border-[#e5e5e5] rounded-2xl shadow-xl p-4 z-50 admin-scale-in">
              <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                  alt="Amit Patel"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37] shadow-md mb-2.5"
                />
                <h3 className="font-bold text-base text-[#1a1410]">Amit Patel</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">amit@eventique.in</p>
                <p className="text-xs text-gray-400 mt-0.5">+91 98765 43210</p>
                <div className="mt-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#8B4949]/10 text-[#8B4949] text-[10px] font-bold border border-[#8B4949]/20 uppercase tracking-wider">
                    Super Admin
                  </span>
                </div>
              </div>

              <div className="pt-3.5 space-y-2">
                <button
                  onClick={() => {
                    setShowProfile(false);
                    setShowChangePassword(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-[#8B4949] hover:bg-[#8B4949]/5 text-[#8B4949] text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  <Shield size={13} />
                  <span>Change Password</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    logout();
                    navigate('/admin/login');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Log Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowChangePassword(false)} />
          {/* Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 admin-scale-in z-10 border border-[#e5e5e5]">
            <h3 className="text-base font-bold text-[#1a1410] mb-4">Change Password</h3>
            
            {pwSuccess ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3 text-green-500">
                  <CheckCheck size={24} />
                </div>
                <p className="text-sm font-bold text-[#1a1410]">Password Changed Successfully</p>
                <p className="text-xs text-gray-500 mt-1">Your credentials have been updated.</p>
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setPwSuccess(false);
                  }}
                  className="mt-5 px-4 py-2 bg-[#8B4949] hover:bg-[#723b3b] text-white text-xs font-bold rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {pwError && (
                  <div className="p-2.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">
                    {pwError}
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currPw}
                    onChange={(e) => setCurrPw(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-[#faf8f5] border border-[#e5e5e5] rounded-xl px-3.5 py-2.5 text-sm text-[#4a4a4a] focus:border-[#8B4949] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-[#faf8f5] border border-[#e5e5e5] rounded-xl px-3.5 py-2.5 text-sm text-[#4a4a4a] focus:border-[#8B4949] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-[#faf8f5] border border-[#e5e5e5] rounded-xl px-3.5 py-2.5 text-sm text-[#4a4a4a] focus:border-[#8B4949] focus:outline-none"
                  />
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="flex-1 py-2.5 border border-[#e5e5e5] hover:bg-[#faf8f5] text-gray-500 text-xs font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#8B4949] hover:bg-[#723b3b] text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
