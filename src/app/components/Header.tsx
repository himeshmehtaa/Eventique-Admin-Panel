import { Link, useLocation } from 'react-router';
import { Menu, X, Search, Heart, User, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import logo from 'figma:asset/18b0c663189a1e14d470c65edfce57c31a40bf8e.png';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount] = useState(0);
  const [wishlistCount] = useState(0);
  const location = useLocation();

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Packages', path: '/packages' },
    { name: 'Event Website', path: '/wedding-websites' },
    { name: 'Stationery', path: '/stationery' },
    { name: 'Gifts', path: '/gifts' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-primary/10 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 transition-transform hover:scale-105">
            <img src={logo} alt="Eventique" className="h-10 md:h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm transition-all relative group py-2 ${
                    isActive
                      ? 'text-primary font-medium'
                      : 'text-foreground/70 hover:text-primary'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-muted rounded-full transition-all hover:scale-110"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-foreground/70 hover:text-primary transition-colors" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 hover:bg-muted rounded-full transition-all hover:scale-110 relative group"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-foreground/70 group-hover:text-primary group-hover:fill-primary/20 transition-all" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 hover:bg-muted rounded-full transition-all hover:scale-110 relative group"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile - Round Circle */}
            <Link
              to="/profile"
              className="w-9 h-9 bg-primary/10 hover:bg-primary/20 rounded-full transition-all hover:scale-110 flex items-center justify-center border-2 border-primary/30"
              aria-label="Profile"
            >
              <User className="w-5 h-5 text-primary" />
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                setMobileMenuOpen(false);
              }}
              className="p-2 hover:bg-muted rounded-full transition-all"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-foreground/70" />
            </button>
            <Link
              to="/cart"
              className="p-2 hover:bg-muted rounded-full transition-all relative"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-foreground/70" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setSearchOpen(false);
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="mt-4 pb-4 border-t border-primary/10 pt-4 animate-in slide-in-from-top">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for invitations, packages, themes..."
                className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 flex flex-col gap-4 border-t border-primary/10 pt-4 animate-in slide-in-from-top">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-all ${
                    isActive
                      ? 'text-primary font-medium'
                      : 'text-foreground/80 hover:text-primary'
                  } hover:translate-x-2`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Mobile Action Icons */}
            <div className="flex items-center gap-4 pt-4 border-t border-primary/10">
              <Link
                to="/wishlist"
                className="flex-1 py-3 border border-border rounded-full text-center hover:bg-muted transition-all flex items-center justify-center gap-2 relative"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 right-4 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/profile"
                className="flex-1 py-3 border border-border rounded-full text-center hover:bg-muted transition-all flex items-center justify-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}