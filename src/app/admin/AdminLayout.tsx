import { useState } from 'react';
import { Outlet } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import '../../styles/admin.css';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </DndProvider>
  );
}
