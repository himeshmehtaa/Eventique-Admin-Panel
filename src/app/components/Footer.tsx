import { Link } from 'react-router';
import { Instagram, Facebook, Mail, Phone, Youtube, Linkedin } from 'lucide-react';
import logo from 'figma:asset/18b0c663189a1e14d470c65edfce57c31a40bf8e.png';
import { FloralDivider, LotusDecor } from './decorative/FloralDecor';
import { useAdmin } from '../admin/context/AdminContext';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { state } = useAdmin();
  const footerBlock = state.contentBlocks.find((cb) => cb.sectionName === 'Footer');

  const tagline = footerBlock?.footerBrandTagline || 'Personalized digital e-invites for every celebration. Making your special moments memorable.';
  const phone = footerBlock?.footerContactInfo?.phone || '+91 98765 43210';
  const email = footerBlock?.footerContactInfo?.email || 'hello@eventique.in';

  const getSocialUrl = (platform: string, fallback: string) => {
    const soc = footerBlock?.footerSocialLinks?.find(s => s.platform === platform);
    return soc?.url || fallback;
  };

  return (
    <footer className="bg-gradient-to-br from-muted via-muted to-card border-t border-primary/10 mt-20 relative overflow-hidden">
      {/* Decorative elements */}
      <LotusDecor className="absolute top-10 right-10 w-32 h-24 text-primary opacity-10" />
      <LotusDecor className="absolute bottom-10 left-10 w-32 h-24 text-secondary opacity-10" />
      
      {/* Decorative divider at top */}
      <div className="flex justify-center py-8">
        <FloralDivider className="w-96 h-20 text-primary opacity-60" />
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <img src={logo} alt="Eventique" className="h-10 mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              {tagline}
            </p>
            <div className="flex gap-2.5">
              <a
                href={getSocialUrl('instagram', 'https://instagram.com')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary hover:from-primary hover:to-secondary hover:text-primary-foreground transition-all hover:scale-110 border border-primary/20"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={getSocialUrl('facebook', 'https://facebook.com')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary hover:from-primary hover:to-secondary hover:text-primary-foreground transition-all hover:scale-110 border border-primary/20"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={getSocialUrl('youtube', 'https://youtube.com')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary hover:from-primary hover:to-secondary hover:text-primary-foreground transition-all hover:scale-110 border border-primary/20"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href={getSocialUrl('pinterest', 'https://pinterest.com')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary hover:from-primary hover:to-secondary hover:text-primary-foreground transition-all hover:scale-110 border border-primary/20"
                aria-label="Pinterest"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href={getSocialUrl('linkedin', 'https://linkedin.com')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary hover:from-primary hover:to-secondary hover:text-primary-foreground transition-all hover:scale-110 border border-primary/20"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={getSocialUrl('x', 'https://x.com')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary hover:from-primary hover:to-secondary hover:text-primary-foreground transition-all hover:scale-110 border border-primary/20"
                aria-label="X (Twitter)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/explore" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Explore Designs
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Packages
                </Link>
              </li>
              <li>
                <Link to="/wedding-websites" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Event Website
                </Link>
              </li>
              <li>
                <Link to="/stationery" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Stationery
                </Link>
              </li>
              <li>
                <Link to="/printed-luxury-invites" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Printed Luxury Invites
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/wedding" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Wedding
                </Link>
              </li>
              <li>
                <Link to="/category/engagement" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Engagement
                </Link>
              </li>
              <li>
                <Link to="/category/birthday" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Birthday
                </Link>
              </li>
              <li>
                <Link to="/category/baby-shower" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Baby Shower
                </Link>
              </li>
              <li>
                <Link to="/category/pooja" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pooja
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>{email}</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link
                to="/contact"
                className="text-sm text-primary hover:underline"
              >
                Contact Form →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Eventique. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/faqs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                FAQs
              </Link>
              <Link to="/testimonials" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Testimonials
              </Link>
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-conditions" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/refund-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Refund Policy
              </Link>
              <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}