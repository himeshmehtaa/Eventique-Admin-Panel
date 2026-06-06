import { useState, type ComponentType } from 'react';
import { Link } from 'react-router';
import { Check, Globe, Heart, MapPin, Users, Calendar, Image as ImageIcon, Music, Gift, Star, ArrowRight, Eye, X, MessageCircle, Mail } from 'lucide-react';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAdmin } from '../admin/context/AdminContext';

interface EventType {
  id: string;
  label: string;
  icon: string;
  tagline: string;
  description: string;
  features: { icon: ComponentType<{ className?: string }>; title: string; description: string }[];
  pricing: { basic: number; premium: number; deluxe: number };
  image: string;
  color: string;
  textColor: string;
}

const eventTypes: EventType[] = [
  {
    id: 'wedding',
    label: 'Wedding',
    icon: '💍',
    tagline: 'Your Love Story, Beautifully Told',
    description: 'Create a stunning wedding website to share your love story, event schedule, venue details, and collect RSVPs from all your guests.',
    features: [
      { icon: Heart, title: 'Love Story', description: 'Share your journey together with a beautiful timeline' },
      { icon: Calendar, title: 'Event Schedule', description: 'Display all wedding events with dates and times' },
      { icon: MapPin, title: 'Venue Details', description: 'Interactive maps and directions for all locations' },
      { icon: ImageIcon, title: 'Photo Gallery', description: 'Showcase pre-wedding and engagement photos' },
      { icon: Users, title: 'RSVP Collection', description: 'Track guest responses and meal preferences' },
      { icon: Globe, title: 'Custom Domain', description: 'Get your personalized wedding website URL' },
    ],
    pricing: { basic: 4999, premium: 7999, deluxe: 11999 },
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&fit=crop',
    color: 'from-rose-50 to-pink-50',
    textColor: 'text-rose-700',
  },
  {
    id: 'anniversary',
    label: 'Anniversary',
    icon: '💑',
    tagline: 'Celebrate Years of Togetherness',
    description: 'A beautiful anniversary website to celebrate milestones, relive cherished memories, and invite your loved ones to the celebration.',
    features: [
      { icon: Heart, title: 'Memory Timeline', description: 'A journey through your years together' },
      { icon: ImageIcon, title: 'Photo Album', description: 'Curated gallery of your favourite moments' },
      { icon: Music, title: 'Video Highlights', description: 'Embed your special videos and reels' },
      { icon: Users, title: 'Guest Messages', description: 'A digital guestbook for warm wishes' },
      { icon: Calendar, title: 'Event Details', description: 'Date, time, and venue information' },
      { icon: Globe, title: 'Custom Domain', description: 'A memorable URL for your milestone' },
    ],
    pricing: { basic: 3999, premium: 6499, deluxe: 9999 },
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&fit=crop',
    color: 'from-amber-50 to-orange-50',
    textColor: 'text-amber-700',
  },
  {
    id: 'baby-shower',
    label: 'Baby Shower',
    icon: '👶',
    tagline: 'Welcome Your Little One in Style',
    description: 'Adorable baby shower websites to share your joy, event details, and gift registry with family and friends near and far.',
    features: [
      { icon: Gift, title: 'Gift Registry', description: 'Link your wishlist for guests to browse' },
      { icon: Calendar, title: 'Event Details', description: 'Date, time, venue, and dress code' },
      { icon: Star, title: 'Theme Design', description: 'Customized with your chosen colour palette' },
      { icon: Users, title: 'RSVP', description: 'Easy online RSVP collection' },
      { icon: ImageIcon, title: 'Photo Gallery', description: 'Bump photos and mommy moments' },
      { icon: Heart, title: 'Baby Details', description: 'Due date, name reveal, and more' },
    ],
    pricing: { basic: 2999, premium: 4999, deluxe: 7499 },
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=900&fit=crop',
    color: 'from-sky-50 to-blue-50',
    textColor: 'text-sky-700',
  },
  {
    id: 'birthday',
    label: 'Birthday',
    icon: '🎂',
    tagline: 'Make Every Birthday Unforgettable',
    description: 'Fun and vibrant birthday websites for milestone celebrations — 18th, 25th, 50th, and beyond. Perfect for surprise parties too!',
    features: [
      { icon: Calendar, title: 'Party Details', description: 'Complete event information for guests' },
      { icon: Star, title: 'Theme & Design', description: 'Vibrant custom themes for every age' },
      { icon: Users, title: 'RSVP & Wishlist', description: 'Collect RSVPs and share your wishlist' },
      { icon: ImageIcon, title: 'Photo Gallery', description: 'A year-by-year photo journey' },
      { icon: Music, title: 'Countdown Timer', description: 'Build excitement with a live countdown' },
      { icon: MapPin, title: 'Location Map', description: 'Easy directions to the venue' },
    ],
    pricing: { basic: 1999, premium: 3999, deluxe: 5999 },
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&fit=crop',
    color: 'from-purple-50 to-fuchsia-50',
    textColor: 'text-purple-700',
  },
  {
    id: 'pooja',
    label: 'Pooja & Events',
    icon: '🪔',
    tagline: 'Sacred Moments, Shared Digitally',
    description: 'Elegant websites for Griha Pravesh, Satyanarayan Pooja, Navratri, and all religious and cultural celebrations.',
    features: [
      { icon: Calendar, title: 'Event Schedule', description: 'Detailed rituals and ceremony timeline' },
      { icon: Users, title: 'Prasad & Meal', description: 'Share prasad and food arrangements' },
      { icon: MapPin, title: 'Venue & Directions', description: 'Venue details with easy navigation' },
      { icon: Heart, title: 'Ritual Information', description: 'Puja vidhi and what to expect' },
      { icon: ImageIcon, title: 'Photo Gallery', description: 'Document the divine celebration' },
      { icon: Star, title: 'Dress Code', description: 'Share attire guidance for guests' },
    ],
    pricing: { basic: 1999, premium: 3499, deluxe: 4999 },
    image: 'https://images.unsplash.com/photo-1680490964983-ca02f691960f?w=900&fit=crop',
    color: 'from-yellow-50 to-amber-50',
    textColor: 'text-yellow-700',
  },
];

interface WebsiteProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  features: string[];
}

const websiteProducts: Record<string, WebsiteProduct[]> = {
  wedding: [
    { id: 'ww1', name: 'Royal Bliss', description: 'Elegant multi-page wedding site with love story, event schedule & RSVP', price: 7999, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&fit=crop', badge: 'Most Popular', features: ['Photo Gallery', 'RSVP', 'Venue Map', 'Custom Domain'] },
    { id: 'ww2', name: 'Garden Romance', description: 'Floral-themed website with soft animations and guest book', price: 4999, image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&fit=crop', features: ['Love Story', 'Event Details', 'RSVP', 'Mobile Optimised'] },
    { id: 'ww3', name: 'Golden Hour', description: 'Luxurious golden-accent website with video integration and gift registry', price: 11999, image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&fit=crop', badge: 'Premium', features: ['Video Integration', 'Gift Registry', 'Password Protected', '12 Months Hosting'] },
    { id: 'ww4', name: 'Minimal Elegance', description: 'Clean modern design focused on couple photos and event timeline', price: 4999, image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&fit=crop', features: ['Timeline', 'Venue Details', 'RSVP', '3 Months Hosting'] },
  ],
  anniversary: [
    { id: 'aw1', name: 'Golden Years', description: 'Warm anniversary website with memory timeline and photo album', price: 6499, image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&fit=crop', badge: 'Most Popular', features: ['Memory Timeline', 'Photo Album', 'Guest Messages', 'Custom Domain'] },
    { id: 'aw2', name: 'Silver Moments', description: 'Elegant milestone website with video highlights and event details', price: 3999, image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&fit=crop', features: ['Video Highlights', 'Event Details', 'RSVP', 'Mobile Optimised'] },
    { id: 'aw3', name: 'Forever Together', description: 'Romantic multi-page site with couple story and celebration countdown', price: 9999, image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&fit=crop', badge: 'Premium', features: ['Countdown Timer', 'Couple Story', 'Guest Book', '12 Months Hosting'] },
    { id: 'aw4', name: 'Love Legacy', description: 'Simple single-page with event details, venue map and RSVP', price: 3999, image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c1f7?w=600&fit=crop', features: ['Event Details', 'Venue Map', 'RSVP', '3 Months Hosting'] },
  ],
  'baby-shower': [
    { id: 'bsw1', name: 'Little Star', description: 'Adorable pastel baby shower website with registry link and RSVP', price: 4999, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&fit=crop', badge: 'Most Popular', features: ['Gift Registry', 'RSVP', 'Theme Design', 'Custom Domain'] },
    { id: 'bsw2', name: 'Sweet Bundle', description: 'Gender-neutral design with countdown, details and wishlist link', price: 2999, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&fit=crop', features: ['Countdown', 'Event Details', 'Wishlist Link', 'Mobile Optimised'] },
    { id: 'bsw3', name: 'Baby in Bloom', description: 'Floral themed site with bump photos gallery and party info', price: 7499, image: 'https://images.unsplash.com/photo-1531956531700-dc0ee0f1f9a5?w=600&fit=crop', badge: 'Premium', features: ['Photo Gallery', 'Gender Reveal', 'Guest Book', '6 Months Hosting'] },
    { id: 'bsw4', name: 'Tiny Miracle', description: 'Minimal single-page with party details, RSVP and registry link', price: 2999, image: 'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=600&fit=crop', features: ['Event Details', 'RSVP', 'Registry Link', '3 Months Hosting'] },
  ],
  birthday: [
    { id: 'bdw1', name: 'Grand Celebration', description: 'Vibrant milestone birthday website with countdown and photo gallery', price: 3999, image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&fit=crop', badge: 'Most Popular', features: ['Countdown Timer', 'Photo Gallery', 'RSVP', 'Custom Domain'] },
    { id: 'bdw2', name: 'Party Central', description: 'Fun and colourful single-page with party details and wishlist', price: 1999, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&fit=crop', features: ['Event Details', 'Wishlist Link', 'RSVP', 'Mobile Optimised'] },
    { id: 'bdw3', name: 'Star of the Day', description: 'Premium multi-page site with video messages and gift registry', price: 5999, image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b19f?w=600&fit=crop', badge: 'Premium', features: ['Video Messages', 'Gift Registry', 'Photo Gallery', '12 Months Hosting'] },
    { id: 'bdw4', name: 'Classic Birthday', description: 'Simple elegant design with party info, venue map and RSVP', price: 1999, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&fit=crop', features: ['Party Info', 'Venue Map', 'RSVP', '3 Months Hosting'] },
  ],
  pooja: [
    { id: 'pw1', name: 'Divine Celebration', description: 'Traditional pooja website with event schedule, prasad info and venue map', price: 3499, image: 'https://images.unsplash.com/photo-1680490964983-ca02f691960f?w=600&fit=crop', badge: 'Most Popular', features: ['Event Schedule', 'Venue Map', 'RSVP', 'Custom Domain'] },
    { id: 'pw2', name: 'Sacred Gathering', description: 'Elegant site with ritual timeline, dress code and guest RSVP', price: 1999, image: 'https://images.unsplash.com/photo-1679141435935-7d8ff9659c9a?w=600&fit=crop', features: ['Ritual Timeline', 'Dress Code Info', 'RSVP', 'Mobile Optimised'] },
    { id: 'pw3', name: 'Blessings & Beyond', description: 'Multi-page site with photo gallery, prasad menu and detailed schedule', price: 4999, image: 'https://images.unsplash.com/photo-1752917889576-46419c28de00?w=600&fit=crop', badge: 'Premium', features: ['Photo Gallery', 'Prasad Menu', 'Guest Book', '6 Months Hosting'] },
    { id: 'pw4', name: 'Puja Vibes', description: 'Simple single-page with pooja details, timings and location', price: 1999, image: 'https://images.unsplash.com/photo-1600298882546-98ebecd47be3?w=600&fit=crop', features: ['Event Details', 'Timings', 'Location Map', '3 Months Hosting'] },
  ],
};

function EventWebsiteGallery({ occasionId, eventLabel }: { occasionId: string; eventLabel: string }) {
  const siteProducts = websiteProducts[occasionId] || [];
  const [demoItem, setDemoItem] = useState<WebsiteProduct | null>(null);

  return (
    <div className="mb-16">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl mb-1">{eventLabel} Website Designs</h2>
          <p className="text-muted-foreground text-sm">
            Preview any design first — then order when you're ready
          </p>
        </div>
        <Link to="/contact" className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium">
          Need something custom? <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {siteProducts.map((site) => (
          <div key={site.id} className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
            <div className="aspect-[4/5] overflow-hidden bg-muted relative">
              <ImageWithFallback
                src={site.image}
                alt={site.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {site.badge && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-3 py-1.5 bg-primary text-white text-xs rounded-full font-semibold shadow-md">{site.badge}</span>
                </div>
              )}
              <div className="absolute top-3 right-3 z-10">
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-primary text-xs rounded-full border border-primary/20 shadow-md">Event Website</span>
              </div>
              {/* Hover: two stacked CTAs */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4 gap-2">
                <button
                  onClick={() => setDemoItem(site)}
                  className="w-full py-2.5 bg-white/95 text-primary rounded-full flex items-center justify-center gap-2 font-semibold text-sm hover:bg-white transition-all"
                >
                  <Eye className="w-4 h-4" /> View Demo
                </button>
                <Link
                  to="/order"
                  state={{ websiteProduct: site }}
                  className="w-full py-2.5 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm hover:bg-primary/90 transition-all"
                >
                  Get This Design
                </Link>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">{site.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{site.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {site.features.slice(0, 3).map((f) => (
                  <span key={f} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">{f}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xs text-muted-foreground">₹</span>
                  <span className="text-lg font-bold text-primary">{site.price.toLocaleString('en-IN')}</span>
                </div>
                <button
                  onClick={() => setDemoItem(site)}
                  className="text-xs px-3 py-1.5 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-colors font-medium flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" /> Demo
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Modal */}
      {demoItem && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDemoItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2">
              {/* Phone mockup preview */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-10 flex items-center justify-center min-h-[400px]">
                <div className="relative">
                  <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-[2.8rem] p-3 shadow-2xl w-[220px]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-gray-900 rounded-b-2xl z-10" />
                    <div className="bg-white rounded-[2.2rem] overflow-hidden aspect-[9/16]">
                      <ImageWithFallback
                        src={demoItem.image}
                        alt={demoItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Glow */}
                  <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-2xl -z-10" />
                </div>
              </div>

              {/* Info panel */}
              <div className="p-8 relative">
                <button
                  onClick={() => setDemoItem(null)}
                  className="absolute top-4 right-4 w-9 h-9 bg-muted rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>

                {demoItem.badge && (
                  <span className="inline-block px-3 py-1 bg-primary text-white text-xs rounded-full mb-3 font-semibold">{demoItem.badge}</span>
                )}
                <h2 className="text-2xl mb-2">{demoItem.name}</h2>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{demoItem.description}</p>

                <div className="space-y-2 mb-6">
                  {demoItem.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-border">
                  <span className="text-sm text-muted-foreground">Starting from</span>
                  <span className="text-3xl font-bold text-primary">₹{demoItem.price.toLocaleString('en-IN')}</span>
                </div>

                <Link
                  to="/order"
                  state={{ websiteProduct: demoItem }}
                  onClick={() => setDemoItem(null)}
                  className="block w-full py-3.5 bg-primary text-white rounded-full text-center font-semibold hover:bg-primary/90 transition-colors mb-3"
                >
                  Get This Design
                </Link>
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 bg-[#25D366] text-white rounded-full text-center font-semibold hover:bg-[#20bc5a] transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default function WeddingWebsites() {
  const { state } = useAdmin();
  const eventWebsitesBlock = state.contentBlocks.find((cb) => cb.sectionName === 'Event Websites');
  const [activeEvent, setActiveEvent] = useState<string>('wedding');

  const event = eventTypes.find((e) => e.id === activeEvent)!;

  return (
    <div className="relative overflow-hidden">
      {/* Floating Decorative Elements */}
      <MandalaDecor className="absolute top-40 right-16 w-64 h-64 text-primary opacity-20 animate-rotate-slow" />
      <LotusDecor className="absolute top-1/2 left-12 w-48 h-48 text-secondary opacity-25 animate-float" />
      <LotusDecor className="absolute bottom-40 right-1/4 w-32 h-32 text-accent opacity-30" />

      <div className="bg-gradient-to-br from-[#fdf8f0] via-white to-[#fff5f0] py-16 md:py-24 border-b border-primary/5 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column — Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <span>🌐 Event Websites</span>
              </div>
              <h1 className="text-4xl md:text-6xl mb-5 text-[#1a1410] font-serif leading-[1.15] tracking-tight">
                {eventWebsitesBlock?.title || 'Event Websites for'} <br />
                <span className="text-primary italic">Every Celebration</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                {eventWebsitesBlock?.subtitle || 'Beautiful, personalized websites for weddings, anniversaries, baby showers, birthdays, and all your special occasions.'}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('templates');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/95 hover:scale-105 transition-all shadow-md font-semibold text-sm cursor-pointer"
                >
                  Explore Designs
                </button>
                <Link
                  to="/order"
                  className="px-6 py-3 bg-white text-gray-700 border border-primary/20 rounded-full hover:bg-primary/5 hover:scale-105 transition-all shadow-sm text-sm"
                >
                  Order Now
                </Link>
              </div>

              {/* Bullet points */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-[#f0ebe0]">
                {['Custom RSVP Form', 'Interactive Map Details', 'Countdown & Gallery'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column — Mockup */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl blur-3xl opacity-50" />
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-3 shadow-2xl max-w-[280px] w-full z-10 hover:scale-[1.03] transition-transform duration-500">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-gray-900 rounded-b-2xl z-10" />
                <div className="bg-white rounded-[1.8rem] overflow-hidden aspect-[9/16]">
                  <ImageWithFallback
                    src={eventWebsitesBlock?.imageUrl || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800'}
                    alt="Event Website Mockup"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10" id="templates">

        {/* Event Type Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#8B4949] rounded-full p-2 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 px-2">
              {eventTypes.map((et) => (
                <button
                  key={et.id}
                  onClick={() => setActiveEvent(et.id)}
                  className={`px-5 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap font-medium text-sm ${
                    activeEvent === et.id
                      ? 'bg-[#F5E6D8] text-foreground shadow-md'
                      : 'text-white hover:text-white/80'
                  }`}
                >
                  {et.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Event Section */}
        <div className={`bg-gradient-to-br ${event.color} rounded-3xl p-8 md:p-12 mb-16 border border-primary/10`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Info */}
            <div>
              <div className="text-5xl mb-4">{event.icon}</div>
              <h2 className="text-3xl md:text-4xl mb-3">{event.tagline}</h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{event.description}</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {event.features.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/80">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm mb-0.5">{feature.title}</div>
                        <div className="text-xs text-muted-foreground">{feature.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link
                to="/order"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-105 shadow-lg font-medium"
              >
                Create Your {event.label} Website
              </Link>
            </div>

            {/* Right — Preview Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-3 shadow-2xl mx-auto max-w-[300px]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-2xl z-10" />
                <div className="bg-white rounded-[1.8rem] overflow-hidden aspect-[9/16]">
                  <ImageWithFallback
                    src={event.image}
                    alt={`${event.label} website preview`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-primary/10">
                <div className="text-xs text-muted-foreground mb-1">Starting from</div>
                <div className="text-2xl font-bold text-primary">₹{event.pricing.basic.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Website Gallery for selected event */}
        <EventWebsiteGallery key={activeEvent} occasionId={activeEvent} eventLabel={event.label} />

        {/* Custom CTA — replaces pricing */}
        <div className="mb-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1410] to-[#3a1f1f]">
          <MandalaDecor className="absolute -top-10 -right-10 w-64 h-64 text-[#D4AF37] opacity-15 animate-rotate-slow" />
          <MandalaDecor className="absolute -bottom-10 -left-10 w-48 h-48 text-[#8B4949] opacity-15 animate-rotate-slow" />
          <div className="relative z-10 p-10 md:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#D4AF37]/40 rounded-full text-[#D4AF37] text-sm mb-6">
                ✨ Fully Custom — Built for Your Celebration
              </div>
              <h2 className="text-3xl md:text-4xl text-white mb-4">
                Ready to Build Your <span className="text-[#D4AF37]">{event.label} Website?</span>
              </h2>
              <p className="text-white/70 text-lg mb-3 leading-relaxed">
                Tell us your vision and we'll craft a beautiful, personalised website that matches your celebration perfectly. No cookie-cutter templates — every site is designed just for you.
              </p>
              <p className="text-white/50 text-sm mb-10">
                Custom pricing based on your requirements &nbsp;·&nbsp; Response within 24 hours &nbsp;·&nbsp; Unlimited revisions
              </p>
              <div className="flex flex-wrap gap-4 justify-center mb-10">
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#25D366] text-white rounded-full font-semibold hover:bg-[#20bc5a] transition-all hover:scale-105 shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2.5 px-8 py-4 border-2 border-[#D4AF37] text-[#D4AF37] rounded-full font-semibold hover:bg-[#D4AF37]/10 transition-all hover:scale-105"
                >
                  <Mail className="w-5 h-5" /> Send an Enquiry
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {[
                  { icon: '⚡', label: '24h Response' },
                  { icon: '🎨', label: 'Custom Design' },
                  { icon: '♾️', label: 'Unlimited Revisions' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-sm text-white/70">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose */}
        <div className="bg-gradient-to-br from-muted to-card rounded-3xl p-8 md:p-12 mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl mb-3">Why Choose Our Event Websites?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'Mobile Optimized', desc: 'Looks perfect on all devices — phones, tablets, and desktops' },
              { title: 'Easy to Share', desc: 'Simple URL that guests can easily access and share' },
              { title: 'Fast Delivery', desc: 'Your website ready in 5–7 days with unlimited revisions' },
              { title: 'Continuous Support', desc: 'We\'re here to help with updates and support throughout' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
