import { useState } from 'react';
import { Link } from 'react-router';
import Slider from 'react-slick';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  Heart, ShoppingCart, Star, ChevronLeft, ChevronRight,
  MessageCircle, Minus, Plus, Check, Package, Zap, Truck,
} from 'lucide-react';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';
import lotusImage from '../../imports/image-3.png';

// ── Data ──────────────────────────────────────────────────────────────────────

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238bd345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    badge: null,
    title: 'Wedding Gifts',
    titleAccent: 'Coming Soon',
    subtitle: 'Thoughtfully curated gifts, personalized keepsakes and luxury hampers for every celebration.',
  },
  {
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    badge: 'Coming Soon',
    title: 'Personalized',
    titleAccent: 'Wedding Gifts',
    subtitle: 'Beautiful gifts designed to make every moment memorable.',
  },
  {
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    badge: 'Launching Soon',
    title: 'Luxury Wedding',
    titleAccent: 'Hampers',
    subtitle: 'Premium gifting experiences crafted with elegance.',
  },
];

const giftCategories = [
  { name: 'Return Gifts',       icon: '🎁', image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { name: 'Bridesmaid Gifts',   icon: '💐', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { name: 'Groomsmen Gifts',    icon: '🎩', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { name: 'Couple Gifts',       icon: '💑', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238bd345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { name: 'Personalized Gifts', icon: '✏️', image: 'https://images.unsplash.com/photo-1571781926291-1a36ba6d3e73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { name: 'Gift Hampers',       icon: '🧺', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { name: 'Traditional Gifts',  icon: '🪔', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { name: 'Gourmet Hampers',    icon: '🍫', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
];

const upcomingProducts = [
  { slug: 'personalized-couple-frame', name: 'Personalized Couple Frame',   price: 899,  image: 'https://images.unsplash.com/photo-1571781926291-1a36ba6d3e73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
  { slug: 'luxury-wedding-hamper',     name: 'Luxury Wedding Hamper',       price: 2499, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238bd345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
  { slug: 'bridesmaid-gift-box',       name: 'Bridesmaid Gift Box',         price: 1299, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
  { slug: 'wedding-name-plaque',       name: 'Wedding Name Plaque',         price: 649,  image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
  { slug: 'premium-dry-fruit-hamper',  name: 'Premium Dry Fruit Hamper',    price: 1899, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
  { slug: 'personalized-keepsake-box', name: 'Personalized Keepsake Box',   price: 1099, image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
];

const reviews = [
  { name: 'Priya Sharma',    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100', rating: 5, text: 'The wedding hampers were absolutely stunning. Every guest was in awe of the presentation and quality!', tag: 'Verified Purchase', event: 'Wedding · Delhi' },
  { name: 'Ankit Mehta',     avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100', rating: 5, text: 'Ordered personalized couple frames. The quality exceeded expectations. Will order again for our anniversary.', tag: 'Verified Purchase', event: 'Anniversary · Mumbai' },
  { name: 'Sneha Reddy',     avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100', rating: 5, text: 'Beautiful bridesmaid gift boxes! The team helped customize everything perfectly within my budget.', tag: 'Verified Purchase', event: 'Wedding · Bangalore' },
  { name: 'Rahul Kapoor',    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100', rating: 4, text: 'Excellent service and premium packaging. The dry fruit hampers were a huge hit at our wedding reception.', tag: 'Verified Purchase', event: 'Wedding · Jaipur' },
];

// ── Hero Arrow Components ──────────────────────────────────────────────────────

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button onClick={onClick} className="absolute right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg">
    <ChevronRight className="w-6 h-6 text-[#8B4949]" />
  </button>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button onClick={onClick} className="absolute left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg">
    <ChevronLeft className="w-6 h-6 text-[#8B4949]" />
  </button>
);

// ── Main Component ─────────────────────────────────────────────────────────────

export default function Gifts() {
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('Medium');
  const [service, setService] = useState<'design' | 'premium'>('design');
  const [detailTab, setDetailTab] = useState<'description' | 'specs' | 'shipping'>('description');

  const toggleWishlist = (i: number) => setWishlisted(prev => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: 'slick-dots !bottom-6',
  };

  const similarSlider = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768,  settings: { slidesToShow: 2 } },
      { breakpoint: 480,  settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="overflow-hidden bg-[#faf8f5]">

      {/* ── HERO CAROUSEL ──────────────────────────────────────── */}
      <section className="relative">
        <Slider {...sliderSettings}>
          {heroSlides.map((slide, i) => (
            <div key={i} className="relative">
              <div className="relative h-[70vh] min-h-[500px]">
                <ImageWithFallback
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-8 md:px-16">
                    <div className="max-w-xl">
                      {slide.badge && (
                        <span className="inline-block mb-5 px-4 py-1.5 bg-[#D4AF37] text-[#1a1410] text-xs font-bold tracking-widest uppercase rounded-full">
                          {slide.badge}
                        </span>
                      )}
                      <h1 className="text-5xl md:text-7xl text-white mb-4 leading-tight">
                        {slide.title}{' '}
                        <span className="text-[#D4AF37] italic">{slide.titleAccent}</span>
                      </h1>
                      <p className="text-white/80 text-lg md:text-xl leading-relaxed">{slide.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* ── COMING SOON ────────────────────────────────────────── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <MandalaDecor className="absolute top-10 right-10 w-72 h-72 text-[#D4AF37] opacity-10 animate-rotate-slow" />
        <LotusDecor className="absolute bottom-10 left-10 w-48 h-48 text-[#8B4949] opacity-10 animate-float" />
        <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
          <img src={lotusImage} alt="" className="w-48 h-10 object-contain opacity-20 mx-auto mb-8"
            style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(18%) saturate(1285%) hue-rotate(316deg) brightness(91%) contrast(87%)' }} />
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-[#8B4949]/10 text-[#8B4949] rounded-full text-xs font-bold tracking-widest uppercase mb-6">
            🎁 Launching Soon
          </span>
          <h2 className="text-4xl md:text-5xl text-[#1a1410] mb-6">
            Curated Wedding<br />
            <span className="text-[#8B4949] italic">Gifting Experience</span>
          </h2>
          <div className="flex justify-center mb-6"><div className="w-24 h-0.5 bg-[#D4AF37]" /></div>
          <p className="text-gray-500 text-lg leading-relaxed mb-10">
            We are working on a beautiful collection of wedding gifts, personalized keepsakes and premium hampers. Be the first to know when we launch.
          </p>
          {/* Notify form */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 bg-[#fdf8f0] border border-[#D4AF37]/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8B4949]/30 text-sm"
            />
            <button className="px-7 py-3.5 bg-[#8B4949] text-white rounded-full font-semibold text-sm hover:bg-[#7a3f3f] transition-all shadow-lg shadow-[#8B4949]/20 whitespace-nowrap">
              Notify Me
            </button>
          </div>
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {['2000+ Happy Clients', '5000+ Designs Created', '98% Satisfaction Rate'].map(b => (
              <div key={b} className="flex items-center gap-2 text-sm text-gray-500">
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GIFT CATEGORIES ────────────────────────────────────── */}
      <section className="py-20 bg-[#fdf8f0] relative overflow-hidden">
        <MandalaDecor className="absolute top-0 left-0 w-64 h-64 text-[#8B4949] opacity-8 animate-rotate-slow" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl text-[#1a1410] mb-3">Gift Categories</h2>
            <div className="flex justify-center mb-4"><div className="w-24 h-0.5 bg-[#D4AF37]" /></div>
            <p className="text-gray-500 max-w-xl mx-auto">Every category crafted for a specific moment in your celebration.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {giftCategories.map((cat) => (
              <div key={cat.name} className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="aspect-square relative">
                  <ImageWithFallback
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Coming Soon badge */}
                  <div className="absolute top-3 right-3">
                    <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 bg-[#D4AF37] text-[#1a1410] rounded-full">
                      Coming Soon
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <h3 className="text-white font-semibold text-sm leading-tight">{cat.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING PRODUCTS ──────────────────────────────────── */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#8B4949]/10 text-[#8B4949] rounded-full text-xs font-bold tracking-widest uppercase mb-5">
              ✦ Preview
            </span>
            <h2 className="text-4xl md:text-5xl text-[#1a1410] mb-3">Upcoming Gift Collection</h2>
            <div className="flex justify-center"><div className="w-24 h-0.5 bg-[#D4AF37]" /></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {upcomingProducts.map((product, i) => (
              <Link key={i} to={`/shop/gift/${product.slug}`} className="group bg-white rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="relative aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold tracking-widest uppercase text-[#8B4949]">
                      View Details
                    </span>
                  </div>
                  {/* Wishlist */}
                  <button
                    onClick={(e) => { e.preventDefault(); toggleWishlist(i); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                  >
                    <Heart className={`w-4 h-4 ${wishlisted.has(i) ? 'fill-[#8B4949] text-[#8B4949]' : 'text-gray-400'}`} />
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="text-[#1a1410] font-semibold mb-2 leading-tight">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block mb-0.5">Starting from</span>
                      <span className="text-[#8B4949] font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#fdf8f0] border border-[#D4AF37]/30 flex items-center justify-center text-[#8B4949] group-hover:bg-[#8B4949] group-hover:border-[#8B4949] group-hover:text-white transition-all">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FUTURE PRODUCT DETAIL PREVIEW ──────────────────────── */}
      <section className="py-20 bg-[#fdf8f0] relative overflow-hidden">
        <MandalaDecor className="absolute top-10 right-10 w-64 h-64 text-[#D4AF37] opacity-10 animate-rotate-slow" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4AF37]/15 text-[#9a7a1a] rounded-full text-xs font-bold tracking-widest uppercase mb-5">
              ✦ Coming Soon
            </span>
            <h2 className="text-4xl md:text-5xl text-[#1a1410] mb-3">Product Experience Preview</h2>
            <div className="flex justify-center mb-4"><div className="w-24 h-0.5 bg-[#D4AF37]" /></div>
            <p className="text-gray-500 max-w-xl mx-auto">Here's a glimpse of the premium gifting experience we're building for you.</p>
          </div>

          {/* Product detail card */}
          <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] border border-border shadow-xl shadow-[#8B4949]/5 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left — gallery */}
              <div className="p-8 bg-[#faf8f5] flex gap-3">
                {/* Thumbnails */}
                <div className="flex flex-col gap-2">
                  {upcomingProducts.slice(0, 4).map((p, i) => (
                    <div key={i} className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === 0 ? 'border-[#8B4949]' : 'border-transparent opacity-50 hover:opacity-100 cursor-pointer'}`}>
                      <ImageWithFallback src={p.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                {/* Main */}
                <div className="flex-1 rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src={upcomingProducts[0].image}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right — details */}
              <div className="p-8 flex flex-col gap-5">
                {/* Badges */}
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-[#8B4949]/10 text-[#8B4949] text-xs font-bold rounded-full tracking-wider uppercase">Wedding</span>
                  <span className="px-3 py-1 bg-[#4A7C59]/10 text-[#4A7C59] text-xs font-bold rounded-full tracking-wider uppercase flex items-center gap-1">
                    <Check className="w-3 h-3" /> Personalization Available
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl text-[#1a1410] mb-1">Luxury Wedding Hamper</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#8B4949]">₹2,499</span>
                    <span className="text-gray-400 text-sm">starting / set</span>
                  </div>
                </div>

                {/* Service toggle */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Select Tier</p>
                  <div className="flex rounded-xl overflow-hidden border border-border w-fit">
                    {(['design', 'premium'] as const).map(s => (
                      <button key={s} onClick={() => setService(s)}
                        className={`px-5 py-2.5 text-sm font-semibold transition-all ${service === s ? 'bg-[#8B4949] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                        {s === 'design' ? 'Standard' : 'Premium'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery */}
                <div className="bg-[#fdf8f0] rounded-2xl p-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600"><Zap className="w-4 h-4 text-[#D4AF37]" /><span>Personalization included</span></div>
                  <div className="flex items-center gap-2 text-gray-600"><Truck className="w-4 h-4 text-[#8B4949]" /><span>Delivered in 10–14 business days</span></div>
                  <div className="flex items-center gap-2 text-[#4A7C59]"><Package className="w-4 h-4" /><span className="font-medium">Premium packaging with ribbon & card</span></div>
                </div>

                {/* Size */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Size</p>
                  <div className="flex gap-2 flex-wrap">
                    {['Small', 'Medium', 'Large', 'Premium'].map(s => (
                      <button key={s} onClick={() => setSize(s)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${size === s ? 'border-[#8B4949] bg-[#8B4949]/5 text-[#8B4949]' : 'border-border text-gray-600 hover:border-[#8B4949]'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Quantity</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-[#8B4949] transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-[#1a1410]">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-[#8B4949] transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Personalization fields */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personalization</p>
                  <input className="w-full px-4 py-2.5 bg-[#fdf8f0] border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4949]/20" placeholder="Names (e.g. Rahul & Priya)" />
                  <input className="w-full px-4 py-2.5 bg-[#fdf8f0] border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4949]/20" placeholder="Message (optional)" />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 py-3.5 bg-[#8B4949] text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-[#7a3f3f] transition-all shadow-lg shadow-[#8B4949]/20">
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                  <button className="flex-1 py-3.5 bg-[#1a1410] text-white rounded-full font-semibold hover:bg-[#2a201a] transition-all">
                    Buy Now
                  </button>
                  <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-gray-400 hover:border-[#8B4949] hover:text-[#8B4949] transition-all">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-border">
              <div className="flex">
                {(['description', 'specs', 'shipping'] as const).map(tab => (
                  <button key={tab} onClick={() => setDetailTab(tab)}
                    className={`flex-1 py-4 text-sm font-semibold tracking-wide capitalize transition-all border-b-2 ${
                      detailTab === tab ? 'border-[#8B4949] text-[#8B4949]' : 'border-transparent text-gray-400 hover:text-[#1a1410]'
                    }`}>
                    {tab === 'specs' ? 'Specifications' : tab === 'shipping' ? 'Shipping Info' : 'Description'}
                  </button>
                ))}
              </div>
              <div className="px-8 py-6 text-sm text-gray-500 leading-relaxed">
                {detailTab === 'description' && 'A beautifully curated luxury hamper filled with premium products, personalized with your names and a heartfelt message. Each hamper is hand-assembled and presented in a rigid gift box with satin ribbon and a branded insert card.'}
                {detailTab === 'specs' && (
                  <ul className="space-y-2">
                    {[['Box Size', '30 × 25 × 15 cm'], ['Material', 'Rigid gift box + satin ribbon'], ['Contains', '8–10 curated premium items'], ['Customisation', 'Names, message, photo insert']].map(([l, v]) => (
                      <li key={l} className="flex gap-3"><span className="text-gray-400 w-28 flex-shrink-0">{l}</span><span className="text-[#1a1410] font-medium">{v}</span></li>
                    ))}
                  </ul>
                )}
                {detailTab === 'shipping' && 'Ships pan-India via temperature-safe packaging. Standard delivery in 10–14 business days. Express delivery (5–7 days) available at an additional charge. Bulk orders of 20+ units receive complimentary express shipping.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ────────────────────────────────────────────── */}
      <section className="py-20 bg-white relative overflow-hidden">
        <LotusDecor className="absolute top-10 right-10 w-48 h-48 text-[#D4AF37] opacity-10 animate-float" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl text-[#1a1410] mb-3">What Our Clients Say</h2>
            <div className="flex justify-center mb-4"><div className="w-24 h-0.5 bg-[#D4AF37]" /></div>
            <div className="flex items-center justify-center gap-2">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />)}
              <span className="text-gray-500 text-sm ml-2">4.9 / 5 from 500+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {reviews.map((r, i) => (
              <div key={i} className="bg-[#fdf8f0] border border-[#D4AF37]/20 rounded-3xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                    <ImageWithFallback src={r.avatar} alt={r.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[#1a1410] font-semibold text-sm leading-tight">{r.name}</p>
                    <p className="text-gray-400 text-xs">{r.event}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{r.text}"</p>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase text-[#4A7C59]">
                  <Check className="w-3 h-3" /> {r.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YOU MAY ALSO LIKE ──────────────────────────────────── */}
      <section className="py-20 bg-[#fdf8f0] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl text-[#1a1410] mb-3">You May Also Like</h2>
            <div className="flex justify-center"><div className="w-24 h-0.5 bg-[#D4AF37]" /></div>
          </div>
          <div className="relative px-8">
            <Slider {...similarSlider}>
              {upcomingProducts.concat(upcomingProducts.slice(0, 2)).map((p, i) => (
                <div key={i} className="px-2">
                  <div className="group bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square overflow-hidden relative">
                      <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-3 left-3">
                        <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 bg-[#8B4949] text-white rounded-full">Soon</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-[#1a1410] font-semibold text-sm mb-1 leading-tight truncate">{p.name}</p>
                      <p className="text-[#8B4949] font-bold text-sm">₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* ── CUSTOM GIFT CTA ────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#8B4949] to-[#6d3535] relative overflow-hidden">
        <MandalaDecor className="absolute top-0 right-0 w-72 h-72 text-[#D4AF37] opacity-15 animate-rotate-slow" />
        <MandalaDecor className="absolute bottom-0 left-0 w-64 h-64 text-white opacity-10 animate-rotate-slow" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <img src={lotusImage} alt="" className="w-48 h-10 object-contain opacity-25 mx-auto mb-6"
            style={{ filter: 'brightness(0) saturate(100%) invert(80%) sepia(50%) saturate(500%) hue-rotate(5deg) brightness(110%)' }} />
          <h2 className="text-4xl md:text-5xl text-[#D4AF37] mb-4">Need a Personalized<br />Wedding Gift?</h2>
          <div className="flex justify-center mb-6"><div className="w-24 h-0.5 bg-[#D4AF37]/60" /></div>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Our team can help create customized wedding gifts and gifting experiences tailored to your budget and vision.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/919876543210?text=Hi!%20I%20need%20help%20with%20a%20personalized%20wedding%20gift."
              target="_blank" rel="noopener noreferrer"
              className="px-10 py-4 bg-[#25D366] text-white rounded-full font-semibold hover:bg-[#20bc5a] transition-all hover:scale-105 inline-flex items-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
            <Link to="/contact"
              className="px-10 py-4 border-2 border-[#D4AF37] text-[#D4AF37] rounded-full font-semibold hover:bg-[#D4AF37]/10 transition-all hover:scale-105">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
