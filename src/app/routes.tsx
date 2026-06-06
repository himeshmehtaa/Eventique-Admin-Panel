import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import InvitationDetail from './pages/InvitationDetail';
import Packages from './pages/Packages';
import WeddingWebsites from './pages/WeddingWebsites';
import Stationery from './pages/Stationery';
import StationeryDetail from './pages/StationeryDetail';
import Order from './pages/Order';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQs from './pages/FAQs';
import Testimonials from './pages/Testimonials';
import Gifts from './pages/Gifts';
import ProductPage from './pages/ProductPage';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import BlogPost from './pages/BlogPost';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import RefundPolicy from './pages/RefundPolicy';
import PrintedLuxuryInvites from './pages/PrintedLuxuryInvites';
import LaunchPage from './pages/LaunchPage';


// ── Admin Panel ─────────────────────────────────────────────
import AdminLayout from './admin/AdminLayout';

// Dashboard & Overview
import Dashboard from './admin/pages/Dashboard';

// Commerce
import ProductsManager from './admin/pages/ProductsManager';
import OrdersManager from './admin/pages/OrdersManager';
import VendorsManager from './admin/pages/VendorsManager';
import AnalyticsPage from './admin/pages/AnalyticsPage';
import PromotionsManager from './admin/pages/PromotionsManager';
import PaymentsPage from './admin/pages/PaymentsPage';
import FinanceManager from './admin/pages/FinanceManager';

// Content
import ContentsManager from './admin/pages/ContentsManager';

// People
import CustomersPage from './admin/pages/CustomersPage';
import RolesPage from './admin/pages/RolesPage';

// System
import Settings from './admin/pages/Settings';

// Legacy content pages (accessible from sidebar under Contents)
import PackagesManager from './admin/pages/PackagesManager';
import TestimonialsManager from './admin/pages/TestimonialsManager';
import FAQsManager from './admin/pages/FAQsManager';
import HeroSlidesManager from './admin/pages/HeroSlidesManager';
import CategoriesManager from './admin/pages/CategoriesManager';
import ServicesManager from './admin/pages/ServicesManager';
import PageBuilder from './admin/pages/PageBuilder';

export const router = createBrowserRouter([
  // ── Public Website ───────────────────────────────────────
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'explore', Component: Explore },
      { path: 'category/:occasion', Component: Category },
      { path: 'product/:id', Component: InvitationDetail },
      { path: 'packages', Component: Packages },
      { path: 'wedding-websites', Component: WeddingWebsites },
      { path: 'stationery', Component: Stationery },
      { path: 'stationery/:id', Component: StationeryDetail },
      { path: 'gifts', Component: Gifts },
      { path: 'shop/:type/:slug', Component: ProductPage },
      { path: 'order', Component: Order },
      { path: 'about', Component: About },
      { path: 'contact', Component: Contact },
      { path: 'faqs', Component: FAQs },
      { path: 'testimonials', Component: Testimonials },
      { path: 'privacy-policy', Component: PrivacyPolicy },
      { path: 'terms-conditions', Component: TermsConditions },
      { path: 'refund-policy', Component: RefundPolicy },
      { path: 'printed-luxury-invites', Component: PrintedLuxuryInvites },
      { path: 'wishlist', Component: Wishlist },
      { path: 'cart', Component: Cart },
      { path: 'profile', Component: Profile },
      { path: 'blog/:id', Component: BlogPost },
      { path: 'launch/:slug', Component: LaunchPage },
      { path: '*', Component: NotFound },
    ],
  },
  // ── Admin Panel ──────────────────────────────────────────
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      // Dashboard
      { index: true, Component: Dashboard },
      // Commerce
      { path: 'products',   Component: ProductsManager },
      { path: 'orders',     Component: OrdersManager },
      { path: 'vendors',    Component: VendorsManager },
      { path: 'analytics',  Component: AnalyticsPage },
      { path: 'promotions', Component: PromotionsManager },
      { path: 'payments',   Component: PaymentsPage },
      { path: 'finance',    Component: FinanceManager },
      // Content
      { path: 'contents',   Component: ContentsManager },
      // People
      { path: 'customers',  Component: CustomersPage },
      { path: 'roles',      Component: RolesPage },
      // System
      { path: 'settings',   Component: Settings },
      // Legacy content managers (still accessible directly)
      { path: 'packages',     Component: PackagesManager },
      { path: 'testimonials', Component: TestimonialsManager },
      { path: 'faqs',         Component: FAQsManager },
      { path: 'hero-slides',  Component: HeroSlidesManager },
      { path: 'categories',   Component: CategoriesManager },
      { path: 'services',     Component: ServicesManager },
      { path: 'page-builder', Component: PageBuilder },
    ],
  },
]);
