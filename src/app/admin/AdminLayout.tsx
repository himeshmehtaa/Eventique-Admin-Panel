import { useState } from 'react';
import { Outlet, useLocation, Link, Navigate } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { useAdmin } from './context/AdminContext';
import AdminLogin from './pages/AdminLogin';
import { ShieldAlert, ArrowLeft, LockKeyhole } from 'lucide-react';
import type { PermissionKey } from './types';
import '../../styles/admin.css';

function getRequiredPermission(pathname: string): PermissionKey | null {
  const path = pathname.replace(/\/$/, ''); // strip trailing slash
  if (path === '/admin') return null; // dashboard is public to admins
  if (path.startsWith('/admin/products')) return 'products';
  if (path.startsWith('/admin/orders')) return 'orders';
  if (path.startsWith('/admin/leads')) return 'leads';
  if (path.startsWith('/admin/vendors')) return 'vendors';
  if (path.startsWith('/admin/corporate')) return 'corporate';
  if (path.startsWith('/admin/analytics')) return 'products'; // analytics matches products
  if (path.startsWith('/admin/promotions')) return 'promotions';
  if (path.startsWith('/admin/marketing')) return 'marketing';
  if (path.startsWith('/admin/payments')) return 'payments';
  if (path.startsWith('/admin/finance')) return 'finance';
  if (path.startsWith('/admin/contents')) return 'contents';
  if (path.startsWith('/admin/customers')) return 'customers';
  if (path.startsWith('/admin/roles')) return 'settings';
  if (path.startsWith('/admin/settings')) return 'settings';
  
  // Legacy / other sub-routes map to contents
  if (path.startsWith('/admin/packages')) return 'contents';
  if (path.startsWith('/admin/testimonials')) return 'contents';
  if (path.startsWith('/admin/faqs')) return 'contents';
  if (path.startsWith('/admin/hero-slides')) return 'contents';
  if (path.startsWith('/admin/categories')) return 'contents';
  if (path.startsWith('/admin/services')) return 'contents';
  if (path.startsWith('/admin/page-builder')) return 'contents';
  
  return null;
}

export default function AdminLayout() {
  const { isAuthenticated, currentUser, hasPermission, state } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  if (location.pathname === '/admin/login' && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const requiredPermission = getRequiredPermission(location.pathname);
  const isAuthorized = !requiredPermission || hasPermission(requiredPermission);

  // Find user's role name for description
  const userRole = currentUser ? state.roles.find(r => r.id === currentUser.roleId) : null;
  const roleName = userRole ? userRole.name : 'Unknown Role';

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-[#faf8f5] overflow-hidden" style={{ fontFamily: "'Bricolage Grotesque', 'Inter', system-ui, sans-serif" }}>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto
          transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <AdminSidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed(c => !c)}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminHeader onMenuToggle={() => setMobileOpen(o => !o)} />
          <main className="flex-1 overflow-y-auto admin-scrollbar p-6">
            <div className="max-w-7xl mx-auto admin-animate-in">
              {isAuthorized ? (
                <Outlet />
              ) : (
                <div className="bg-white border border-[#f0ece4] rounded-3xl p-8 max-w-lg mx-auto mt-12 shadow-[0_20px_50px_rgba(26,20,16,0.03)] text-center animate-fade-in">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-red-50 text-red-500 mb-6 shadow-sm">
                    <ShieldAlert size={28} />
                  </div>
                  
                  <h2 className="text-2xl font-black text-[#1a1410] tracking-tight mb-2">
                    Restricted Access
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    You do not have the necessary permissions to access this page.
                  </p>

                  {/* Account detail box */}
                  {currentUser && (
                    <div className="bg-[#faf8f5] border border-[#f0ece4] rounded-2xl p-4 mb-6 text-left text-xs">
                      <div className="flex justify-between items-center pb-2.5 border-b border-[#f0ece4] mb-2.5">
                        <span className="font-bold text-gray-400 uppercase tracking-wider">Logged In As</span>
                        <span className="font-bold text-[#8B4949] bg-[#8B4949]/5 px-2.5 py-0.5 rounded-full border border-[#8B4949]/10">
                          {roleName}
                        </span>
                      </div>
                      <div className="space-y-1 text-[#1a1410] font-medium">
                        <div>Name: <span className="text-gray-600 font-normal">{currentUser.name}</span></div>
                        <div>Email: <span className="text-gray-600 font-normal">{currentUser.email}</span></div>
                        {requiredPermission && (
                          <div className="mt-2 text-red-600 font-semibold flex items-center gap-1">
                            <LockKeyhole size={12} />
                            Required Permission: <span className="font-bold uppercase">{requiredPermission}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Back button */}
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl font-bold text-sm text-white bg-[#8B4949] hover:bg-[#9c5050] transition-colors shadow-lg shadow-[#8B4949]/10"
                  >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </DndProvider>
  );
}
