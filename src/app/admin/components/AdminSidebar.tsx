import { NavLink, useLocation } from 'react-router';
import {
  LayoutDashboard, ShoppingBag, ClipboardList, BarChart3, Tag,
  FileEdit, Users, Shield, CreditCard, Sliders, Settings,
  ExternalLink, ChevronLeft, ChevronRight, Factory, Coins
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import logo from 'figma:asset/18b0c663189a1e14d470c65edfce57c31a40bf8e.png';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { icon: ShoppingBag,   label: 'Products',   path: '/admin/products', permission: 'products' },
      { icon: ClipboardList, label: 'Orders',     path: '/admin/orders', permission: 'orders' },
      { icon: Factory,       label: 'Partners',   path: '/admin/vendors', permission: 'vendors' },
      { icon: BarChart3,     label: 'Analytics',  path: '/admin/analytics', permission: 'products' },
      { icon: Tag,           label: 'Promotions', path: '/admin/promotions', permission: 'promotions' },
      { icon: CreditCard,    label: 'Payments',   path: '/admin/payments', permission: 'payments' },
      { icon: Coins,         label: 'Finance',    path: '/admin/finance', permission: 'finance' },
    ],
  },
  {
    label: 'Content',
    items: [
      { icon: FileEdit, label: 'Contents',  path: '/admin/contents', permission: 'contents' },
    ],
  },
  {
    label: 'People',
    items: [
      { icon: Users,  label: 'Customers', path: '/admin/customers', permission: 'customers' },
      { icon: Shield, label: 'Roles',     path: '/admin/roles', permission: 'settings' },
    ],
  },
  {
    label: 'System',
    items: [
      { icon: Settings,       label: 'Settings',         path: '/admin/settings', permission: 'settings' },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const { state, hasPermission } = useAdmin();

  const pendingOrders = state.orders.filter(o => o.status === 'Processing').length;
  const pendingReviews = state.reviews.filter(r => r.status === 'Pending').length;

  function getBadge(path: string): number {
    if (path === '/admin/orders') return pendingOrders;
    if (path === '/admin/customers') return pendingReviews;
    return 0;
  }

  return (
    <aside
      className="admin-sidebar h-screen flex flex-col flex-shrink-0 overflow-y-auto admin-scrollbar transition-all duration-300"
      style={{ width: collapsed ? '72px' : '220px' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5 flex-shrink-0 justify-center">
        {collapsed ? (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B4949] to-[#D4AF37] flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white font-bold text-sm">E</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1 items-center justify-center w-full">
            <img src={logo} alt="Eventique" className="h-8 object-contain max-w-full" />
            <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mt-1">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto admin-scrollbar">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter(item => {
            if (!item.permission) return true;
            return hasPermission(item.permission as any);
          });
          
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label}>
              {!collapsed && (
                <p className="px-2 mb-1 text-[9px] font-bold uppercase tracking-widest text-white/25">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {visibleItems.map(({ icon: Icon, label, path }) => {
                  const isActive = path === '/admin'
                    ? location.pathname === '/admin'
                    : location.pathname.startsWith(path);
                  const badge = getBadge(path);
                  return (
                    <NavLink
                      key={path}
                      to={path}
                      className={`admin-sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`}
                      title={collapsed ? label : undefined}
                    >
                      <div className="relative flex-shrink-0">
                        <Icon size={17} />
                        {badge > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {badge > 9 ? '9+' : badge}
                          </span>
                        )}
                      </div>
                      {!collapsed && <span className="truncate text-[13px]">{label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 pb-3 border-t border-white/5 pt-3 flex-shrink-0 space-y-0.5">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className={`admin-sidebar-link ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'View Site' : undefined}
        >
          <ExternalLink size={17} className="flex-shrink-0" />
          {!collapsed && <span className="truncate text-[13px]">View Site</span>}
        </a>
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all text-[11px]"
        >
          {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
