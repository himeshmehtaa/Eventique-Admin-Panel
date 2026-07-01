import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Star, Video, FileText, Printer, Globe, ChevronLeft, ChevronRight, Gift, Laptop, QrCode, ShieldCheck, Sparkles } from 'lucide-react';
import { testimonials as defaultTestimonials } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';
import { ProductCarousel } from '../components/ProductCarousel';
import mobileMockup from '../../imports/image-1.png';
import elephantDecor from '../../imports/image-2.png';
import lotusImage from '../../imports/image-3.png';
import logo from 'figma:asset/18b0c663189a1e14d470c65edfce57c31a40bf8e.png';
import { useAdmin } from '../admin/context/AdminContext';
import { VideoPlayer } from '../components/VideoPlayer';

const getServiceIcon = (name: string) => {
  if (name === 'Video') return Video;
  if (name === 'Printer') return Printer;
  if (name === 'Globe') return Globe;
  if (name === 'FileText') return FileText;
  if (name === 'Gift') return Gift;
  return FileText;
};

const DEFAULT_EXPLORE_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&fit=crop',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&fit=crop',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&fit=crop'
];

const DEFAULT_VIDEO_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&fit=crop',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&fit=crop',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&fit=crop'
];

const DEFAULT_WEBSITE_IMAGES = [
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&fit=crop',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&fit=crop',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&fit=crop',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&fit=crop'
];

const DEFAULT_STATIONERY_IMAGES = [
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&fit=crop',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&fit=crop',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&fit=crop'
];

const DEFAULT_PRINTED_IMAGES = [
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&fit=crop',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&fit=crop',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&fit=crop'
];

function getQuadrantImages(images: string[] | undefined, defaultImages: string[]): [string[], string[], string[], string[]] {
  const list = images && images.length > 0 ? images : defaultImages;
  
  const q1: string[] = [];
  const q2: string[] = [];
  const q3: string[] = [];
  const q4: string[] = [];
  
  list.forEach((img, idx) => {
    const q = idx % 4;
    if (q === 0) q1.push(img);
    else if (q === 1) q2.push(img);
    else if (q === 2) q3.push(img);
    else if (q === 3) q4.push(img);
  });
  
  if (q1.length === 0) q1.push(list[0] || defaultImages[0]);
  if (q2.length === 0) q2.push(list[1] || list[0] || defaultImages[1]);
  if (q3.length === 0) q3.push(list[2] || list[0] || defaultImages[2]);
  if (q4.length === 0) q4.push(list[3] || list[0] || defaultImages[3]);
  
  return [q1, q2, q3, q4];
}

interface StaggeredSectionProps {
  enabled?: boolean;
  title: string;
  body: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  images?: string[];
  defaultImages: string[];
  features: { title: string; desc: string }[];
  visualPosition: 'left' | 'right';
  badgeText: string;
  subTitleText?: string;
  footerText?: string;
  image1Index: number;
  image2Index: number;
  image3Index: number;
  image4Index: number;
}

const renderTitle = (titleText: string) => {
  if (titleText.includes('Luxury')) {
    const parts = titleText.split('Luxury');
    return (
      <>
        {parts[0]}
        <span className="text-primary italic font-serif">Luxury</span>
        {parts[1]}
      </>
    );
  }
  return titleText;
};

function StaggeredSection({
  enabled = true,
  title,
  body,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  images,
  defaultImages,
  features,
  visualPosition,
  badgeText,
  subTitleText,
  footerText,
  image1Index,
  image2Index,
  image3Index,
  image4Index,
}: StaggeredSectionProps) {
  if (!enabled) return null;

  const [q1, q2, q3, q4] = getQuadrantImages(images, defaultImages);

  const visualCol = (
    <div className="relative">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-[#faf8f5]">
            <ImageWithFallback
              src={q1[image1Index % q1.length]}
              alt={`${title} Preview 1`}
              className="w-full h-full object-cover transition-all duration-1000"
            />
            {q1.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {q1.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === (image1Index % q1.length) ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-[#faf8f5]">
            <ImageWithFallback
              src={q2[image2Index % q2.length]}
              alt={`${title} Preview 2`}
              className="w-full h-full object-cover transition-all duration-1000"
            />
            {q2.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {q2.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === (image2Index % q2.length) ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 pt-8">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-[#faf8f5]">
            <ImageWithFallback
              src={q3[image3Index % q3.length]}
              alt={`${title} Preview 3`}
              className="w-full h-full object-cover transition-all duration-1000"
            />
            {q3.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {q3.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === (image3Index % q3.length) ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-[#faf8f5]">
            <ImageWithFallback
              src={q4[image4Index % q4.length]}
              alt={`${title} Preview 4`}
              className="w-full h-full object-cover transition-all duration-1000"
            />
            {q4.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {q4.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === (image4Index % q4.length) ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const textCol = (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="inline-flex items-center gap-3">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-primary"></div>
          <span className="text-sm tracking-[0.2em] uppercase text-primary font-bold">{badgeText}</span>
        </div>
      </div>

      <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight font-bold text-[#1a1410] leading-none" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        {renderTitle(title)}
      </h2>

      {subTitleText && (
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed font-light">
          {subTitleText}
        </p>
      )}

      <div className="text-muted-foreground space-y-6 mb-10 text-lg leading-relaxed font-light">
        {body?.split('\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="space-y-4 mb-10">
        {features.map((feat, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <h4 className="text-lg font-bold text-[#1a1410] leading-none">{feat.title}</h4>
              {feat.desc && <p className="text-sm text-muted-foreground leading-relaxed mt-1">{feat.desc}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {ctaText && (
          <Link
            to={ctaLink || "/events"}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:shadow-xl hover:scale-105 inline-flex items-center gap-2 shadow-lg group btn-shimmer"
          >
            {ctaText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
        <Link
          to={secondaryCtaLink || "/contact"}
          className="px-8 py-4 bg-white text-foreground border-2 border-primary/20 rounded-full hover:bg-primary/5 hover:border-primary/40 transition-all shadow-md hover:shadow-lg hover:scale-105"
        >
          {secondaryCtaText || "Request Custom Quote"}
        </Link>
      </div>

      {footerText && (
        <p className="text-sm text-muted-foreground mt-6 italic">
          {footerText}
        </p>
      )}
    </div>
  );

  return (
    <section className="py-24 bg-white relative overflow-hidden border-b border-gray-100">
      <LotusDecor className="absolute top-16 right-16 w-40 h-40 text-primary opacity-20 animate-float pointer-events-none" />
      <MandalaDecor className="absolute bottom-20 left-20 w-56 h-56 text-secondary opacity-15 animate-rotate-slow pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {visualPosition === 'left' ? (
            <>
              {visualCol}
              {textCol}
            </>
          ) : (
            <>
              {textCol}
              {visualCol}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { state } = useAdmin();
  const { heroSlides, categories, services, blogPosts } = state;
  const heroBlock = state.contentBlocks.find(b => b.sectionName === 'Hero');
  const exploreBlock = state.contentBlocks.find(b => b.sectionName === 'Explore Designs');
  const videoInvitesBlock = state.contentBlocks.find(b => b.sectionName === 'Video Invites');
  const categoriesBlock = state.contentBlocks.find(b => b.sectionName === 'Browse by Occasion');
  const servicesBlock = state.contentBlocks.find(b => b.sectionName === 'Our Services');
  const printedBlock = state.contentBlocks.find(b => b.sectionName === 'Printed Luxury Invites');
  const testimonialsBlock = state.contentBlocks.find(b => b.sectionName === 'Testimonials');
  const eventWebsitesBlock = state.contentBlocks.find(b => b.sectionName === 'Event Websites');
  const stationeryBlock = state.contentBlocks.find(b => b.sectionName === 'Stationery');

  const productCarouselSection = state.sections.find(s => s.id === 'product-carousel');
  const howItWorksSection = state.sections.find(s => s.id === 'how-it-works');
  const ctaSection = state.sections.find(s => s.id === 'cta');

  const blockImages = printedBlock?.images && printedBlock.images.length > 0 
    ? printedBlock.images 
    : DEFAULT_PRINTED_IMAGES;

  const printedCardImages1 = [
    blockImages[0 % blockImages.length],
    blockImages[1 % blockImages.length],
    blockImages[2 % blockImages.length]
  ];
  const printedCardImages2 = [
    blockImages[1 % blockImages.length],
    blockImages[2 % blockImages.length],
    blockImages[3 % blockImages.length]
  ];
  const printedCardImages3 = [
    blockImages[2 % blockImages.length],
    blockImages[3 % blockImages.length],
    blockImages[0 % blockImages.length]
  ];
  const printedCardImages4 = [
    blockImages[3 % blockImages.length],
    blockImages[0 % blockImages.length],
    blockImages[1 % blockImages.length]
  ];

  const featuredProducts = state.products.slice(0, 6);
  const [heroSlide, setHeroSlide] = useState(0);
  const [image1Index, setImage1Index] = useState(0);
  const [image2Index, setImage2Index] = useState(0);
  const [image3Index, setImage3Index] = useState(0);
  const [image4Index, setImage4Index] = useState(0);
  const [activeB2BScreen, setActiveB2BScreen] = useState<'microsite' | 'branding'>('microsite');

  // Auto-switch B2B screen content every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveB2BScreen(prev => prev === 'microsite' ? 'branding' : 'microsite');
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance hero carousel
  useEffect(() => {
    const heroInterval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(heroInterval);
  }, []);

  // Auto-change images every 3 seconds for each carousel
  useEffect(() => {
    const interval1 = setInterval(() => {
      setImage1Index((prev) => prev + 1);
    }, 3000);
    const interval2 = setInterval(() => {
      setImage2Index((prev) => prev + 1);
    }, 3200);
    const interval3 = setInterval(() => {
      setImage3Index((prev) => prev + 1);
    }, 3400);
    const interval4 = setInterval(() => {
      setImage4Index((prev) => prev + 1);
    }, 3600);
    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
      clearInterval(interval3);
      clearInterval(interval4);
    };
  }, []);

  // Fallback Scroll Animations + stagger activation via IntersectionObserver
  useEffect(() => {
    const useNative = typeof window !== 'undefined' && window.CSS?.supports?.('(animation-timeline: view()) and (animation-range: entry)');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Activate stagger children if this is a stagger-parent
            if (entry.target.classList.contains('stagger-parent')) {
              entry.target.classList.add('stagger-active');
            }
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -45px 0px' }
    );
    document.querySelectorAll('.scroll-reveal, .scroll-animate, .stagger-parent').forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const steps = [
    { step: '1', title: 'Browse & Select', description: 'Explore our designs and choose your favorite' },
    { step: '2', title: 'Customize', description: 'Share your event details and personalization needs' },
    { step: '3', title: 'Review & Pay', description: 'Approve the design and make secure payment' },
    { step: '4', title: 'Receive & Share', description: 'Get your invitation and share with guests' },
  ];

  return (
    <div>
      {/* Hero Section — Carousel */}
      {heroBlock?.enabled !== false && (
        <section className="relative overflow-hidden min-h-[620px] md:min-h-[720px]">
          {/* Floating ambient particles */}
          {[
            { size: 6, left: '8%',  top: '20%', dur: '7s',  del: '0s',   color: 'rgba(139,73,73,0.25)' },
            { size: 4, left: '15%', top: '70%', dur: '11s', del: '1.5s', color: 'rgba(212,175,55,0.3)' },
            { size: 8, left: '80%', top: '15%', dur: '9s',  del: '0.5s', color: 'rgba(139,73,73,0.2)' },
            { size: 5, left: '90%', top: '65%', dur: '13s', del: '2s',   color: 'rgba(212,175,55,0.2)' },
            { size: 3, left: '50%', top: '85%', dur: '8s',  del: '3s',   color: 'rgba(139,73,73,0.15)' },
            { size: 7, left: '35%', top: '10%', dur: '10s', del: '1s',   color: 'rgba(212,175,55,0.18)' },
          ].map((p, i) => (
            <span
              key={i}
              className="particle z-10"
              style={{ width: p.size, height: p.size, left: p.left, top: p.top, background: p.color, animationDuration: p.dur, animationDelay: p.del }}
            />
          ))}
          {/* Static decorative elements */}
          <MandalaDecor className="absolute bottom-10 left-1/4 w-32 h-32 text-secondary opacity-20 animate-rotate-slow z-10" />
          <LotusDecor className="absolute top-1/2 right-6 w-20 h-20 text-accent opacity-20 animate-float z-10" />

          {/* Slides */}
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 bg-gradient-to-br ${slide.accentBg} ${
                idx === heroSlide ? 'opacity-100 z-20' : 'opacity-0 z-10 pointer-events-none'
              }`}
            >
              {/* Jasmine corner decor */}
              <div className="absolute top-0 left-0 w-40 h-28 opacity-30">
                <svg viewBox="0 0 200 150" fill="none" className="w-full h-full">
                  {[0, 1, 2].map((fi) => {
                    const x = 40 + fi * 25; const y = 40 + (fi % 2) * 20;
                    return (
                      <g key={fi}>
                        {[0, 72, 144, 216, 288].map((a) => {
                          const r = (a * Math.PI) / 180;
                          return <ellipse key={a} cx={x + Math.cos(r) * 12} cy={y + Math.sin(r) * 12} rx="6" ry="10" fill="#8B4949" transform={`rotate(${a} ${x + Math.cos(r) * 12} ${y + Math.sin(r) * 12})`} />;
                        })}
                        <circle cx={x} cy={y} r="4" fill="#D4AF37" />
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="absolute top-0 right-0 w-40 h-28 opacity-30">
                <svg viewBox="0 0 200 150" fill="none" className="w-full h-full">
                  {[0, 1, 2].map((fi) => {
                    const x = 160 - fi * 25; const y = 40 + (fi % 2) * 20;
                    return (
                      <g key={fi}>
                        {[0, 72, 144, 216, 288].map((a) => {
                          const r = (a * Math.PI) / 180;
                          return <ellipse key={a} cx={x + Math.cos(r) * 12} cy={y + Math.sin(r) * 12} rx="6" ry="10" fill="#8B4949" transform={`rotate(${a} ${x + Math.cos(r) * 12} ${y + Math.sin(r) * 12})`} />;
                        })}
                        <circle cx={x} cy={y} r="4" fill="#D4AF37" />
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="container mx-auto px-4 py-20 md:py-28 h-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
                  {/* Left — Text */}
                  <div>
                    <div className={`transform transition-all duration-700 ease-out ${
                      idx === heroSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      {idx === 0 ? (
                        <div className="flex items-center gap-2.5 mb-6">
                          <span className="px-3.5 py-1.5 bg-[#8B4949]/10 text-[#8B4949] rounded-full text-xs font-bold tracking-wider uppercase border border-[#8B4949]/20 shadow-sm">
                            new collection
                          </span>
                          <span className="px-3.5 py-1.5 bg-[#D4AF37]/15 text-[#b08d23] rounded-full text-xs font-bold tracking-wider uppercase border border-[#D4AF37]/35 shadow-sm">
                            festive sale
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 mb-6">
                          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm border border-primary/20 shadow-sm">
                            <span>{slide.badge}</span>
                          </div>
                          {slide.tag && (
                            <span className="px-4 py-1.5 bg-secondary text-white rounded-full text-sm font-semibold shadow-md">
                              {slide.tag}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <h1 className={`text-5xl md:text-6xl lg:text-7xl mb-6 leading-[1.1] tracking-tight transform transition-all duration-700 ease-out delay-100 ${
                      idx === heroSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      {slide.title} <span className="text-primary italic font-serif">{slide.highlight}</span>
                    </h1>
                    <p className={`text-xl text-muted-foreground mb-10 leading-relaxed font-light max-w-xl transform transition-all duration-700 ease-out delay-200 ${
                      idx === heroSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      {slide.subtitle}
                    </p>
                    <div className={`flex flex-wrap gap-4 mb-10 transform transition-all duration-700 ease-out delay-300 ${
                      idx === heroSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      <Link
                        to={slide.cta1.link}
                        className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 hover:shadow-2xl hover:scale-105 inline-flex items-center gap-2 shadow-lg group btn-shimmer"
                      >
                        {slide.cta1.text}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </Link>
                      <Link
                        to={slide.cta2.link}
                        className="px-8 py-4 bg-white text-foreground border-2 border-primary/20 rounded-full hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105"
                      >
                        {slide.cta2.text}
                      </Link>
                    </div>
                    <div className={`flex items-center gap-8 flex-wrap transform transition-all duration-700 ease-out delay-400 ${
                      idx === heroSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      {['free delivery', 'unlimited revisions*', '24/7 support'].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span className="text-xs tracking-wider uppercase font-semibold text-gray-500">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">* Terms and conditions apply</p>
                  </div>

                  {/* Right — Visual */}
                  <div className="relative flex items-center justify-center lg:justify-end">
                    {idx % 3 === 0 && (
                      <div className="grid grid-cols-2 gap-4 w-full max-w-[500px]">
                        <div className="space-y-4">
                          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-[#faf8f5]">
                            <ImageWithFallback
                              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&fit=crop"
                              alt="Premium invitation card design"
                              className={`w-full h-full object-cover hover:scale-105 transition-transform duration-500 ${idx === heroSlide ? 'kenburns-active' : ''}`}
                            />
                          </div>
                          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-[#faf8f5]">
                            <ImageWithFallback
                              src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&fit=crop"
                              alt="Luxury wedding gold rings close up"
                              className={`w-full h-full object-cover hover:scale-105 transition-transform duration-500 ${idx === heroSlide ? 'kenburns-active' : ''}`}
                            />
                          </div>
                        </div>
                        <div className="space-y-4 pt-8">
                          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-[#faf8f5]">
                            <ImageWithFallback
                              src="https://images.unsplash.com/photo-1649019489428-70f505daacd6?w=800&fit=crop"
                              alt="Wedding suite envelope details"
                              className={`w-full h-full object-cover hover:scale-105 transition-transform duration-500 ${idx === heroSlide ? 'kenburns-active' : ''}`}
                            />
                          </div>
                          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-[#faf8f5]">
                            <ImageWithFallback
                              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&fit=crop"
                              alt="Happy wedding couple dancing together"
                              className={`w-full h-full object-cover hover:scale-105 transition-transform duration-500 ${idx === heroSlide ? 'kenburns-active' : ''}`}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {idx % 3 === 1 && (
                      <div className="grid grid-cols-2 gap-4 w-full max-w-[500px]">
                        {[
                          'https://images.unsplash.com/photo-1764731080480-58b18e519bd9?w=500&fit=crop',
                          'https://images.unsplash.com/photo-1647470226271-5e60e269a1f1?w=500&fit=crop',
                          'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=500&fit=crop',
                          'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&fit=crop',
                        ].map((src, i) => (
                          <div key={i} className={`rounded-2xl overflow-hidden shadow-xl ${i === 0 ? 'mt-6' : i === 2 ? '-mt-6' : ''}`}>
                            <ImageWithFallback src={src} alt={`New design ${i + 1}`} className={`w-full aspect-[3/4] object-cover hover:scale-105 transition-transform duration-500 ${idx === heroSlide ? 'kenburns-active' : ''}`} />
                          </div>
                        ))}
                        <div className="absolute top-4 right-4 px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold shadow-lg animate-bounce-subtle">
                          🆕 Fresh Designs
                        </div>
                      </div>
                    )}
                    {idx % 3 === 2 && (
                      <div className="relative w-full max-w-[480px]">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-primary/10">
                          <div className="text-center mb-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-semibold mb-4 border border-red-200">
                              🔥 Festive Sale — Limited Time
                            </div>
                            <div className="text-6xl font-bold text-primary mb-2">30%</div>
                            <div className="text-xl text-muted-foreground">Off on all packages</div>
                          </div>
                          <div className="space-y-3">
                            {[
                              { label: 'Video Invitations', from: '₹2,499', now: '₹1,749' },
                              { label: 'Event Websites', from: '₹7,999', now: '₹5,599' },
                              { label: 'Stationery Bundle', from: '₹4,999', now: '₹3,499' },
                            ].map((offer) => (
                              <div key={offer.label} className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/10">
                                <span className="text-sm font-medium">{offer.label}</span>
                                <div className="text-right">
                                  <div className="text-xs text-muted-foreground line-through">{offer.from}</div>
                                  <div className="text-sm font-bold text-primary">{offer.now}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <Link
                            to="/events?tab=packages"
                            className="mt-6 w-full py-3 bg-primary text-white rounded-full flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors font-semibold"
                          >
                            Claim Offer <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                        <div className="absolute -top-4 -right-4 w-20 h-20 opacity-30">
                          <MandalaDecor className="w-full h-full text-secondary animate-rotate-slow" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Prev / Next Arrows */}
          <button
            onClick={() => setHeroSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
          <button
            onClick={() => setHeroSlide((p) => (p + 1) % heroSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>

          {/* Dot navigation */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${i === heroSlide ? 'bg-primary w-8' : 'bg-primary/30 w-2.5 hover:bg-primary/50'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Everything You Need Section */}
      <section className="py-24 bg-[#faf8f5] relative overflow-hidden border-b border-gray-100 scroll-animate">
        {/* Floating particles */}
        {[
          { size: 5, left: '5%',  top: '30%', dur: '9s',  del: '0s',   color: 'rgba(139,73,73,0.12)' },
          { size: 4, left: '92%', top: '60%', dur: '11s', del: '2s',   color: 'rgba(212,175,55,0.15)' },
          { size: 6, left: '50%', top: '10%', dur: '13s', del: '1s',   color: 'rgba(139,73,73,0.1)'  },
        ].map((p, i) => (
          <span key={i} className="particle" style={{ width: p.size, height: p.size, left: p.left, top: p.top, background: p.color, animationDuration: p.dur, animationDelay: p.del }} />
        ))}
        <MandalaDecor className="absolute top-10 right-10 w-64 h-64 text-primary opacity-5 animate-rotate-slow pointer-events-none" />
        <LotusDecor className="absolute bottom-10 left-10 w-48 h-48 text-secondary opacity-10 animate-float pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase mb-4 badge-pop">
              ✦ Collections
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1410] mb-4 blur-reveal" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Everything You <span className="text-gradient-flow">Need</span>
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed blur-reveal-delay">
              Select from our premium range of invitation products and services
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto stagger-parent">
            {[
              {
                title: 'E-Card & Video',
                desc: 'Handcrafted video & e-card templates',
                price: '₹1,499 onwards',
                image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&fit=crop',
                tag: 'Digital',
                link: '/events'
              },
              {
                title: 'Premium Stationery',
                desc: 'Matching menus, thank-you cards, etc.',
                price: '₹50 onwards',
                image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&fit=crop',
                tag: 'Printed',
                link: '/printed-luxury-invites'
              },
              {
                title: 'Event Websites',
                desc: 'Personalized RSVP & guest management',
                price: '₹11,999 onwards',
                image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&fit=crop',
                tag: 'Websites',
                link: '/event-websites'
              },
              {
                title: 'Curated Gifts',
                desc: 'Personalized hampers & keepsakes',
                price: '₹999 onwards',
                image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&fit=crop',
                tag: 'Gifts',
                link: '/gifts'
              }
            ].map((card, i) => (
              <Link
                key={i}
                to={card.link}
                className="group stagger-child relative h-[460px] rounded-[32px] overflow-hidden shadow-lg hover:shadow-[0_24px_60px_rgba(139,73,73,0.18)] transition-all duration-500 hover:-translate-y-3 flex flex-col justify-between p-5 border border-gray-100/10"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <ImageWithFallback
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-112 transition-transform duration-700"
                  />
                  {/* Default gradient — dark at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-10" />
                  {/* Stronger overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  {/* Luxury color wash on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                </div>

                {/* Luxury Inset Border Frame */}
                <div className="absolute inset-4 border border-white/10 rounded-[22px] z-20 pointer-events-none transition-all duration-500 group-hover:inset-3 group-hover:border-secondary/40" />

                {/* Top Badge */}
                <div className="relative z-20 self-start mt-1 ml-1">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-primary text-[10px] font-bold tracking-widest uppercase rounded-full shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {card.tag}
                  </span>
                </div>

                {/* Title visible by default at bottom */}
                <div className="relative z-20 mt-auto">
                  {/* Pre-hover: just title + arrow */}
                  <div className="flex items-end justify-between gap-3 group-hover:hidden transition-all duration-300">
                    <div className="text-white">
                      <h3 className="text-xl font-bold leading-tight tracking-wide drop-shadow-md">{card.title}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur text-primary flex items-center justify-center shadow-md flex-shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* On hover: glassmorphic full panel with rounded corners */}
                  <div className="hidden group-hover:flex w-full bg-black/50 backdrop-blur-md border border-white/20 rounded-2xl p-4 items-center justify-between gap-3 shadow-2xl transition-all duration-500">
                    <div className="flex-1 text-white">
                      <h3 className="text-lg font-bold mb-1 leading-tight tracking-wide text-secondary">{card.title}</h3>
                      <p className="text-xs text-gray-300 mb-2.5 font-light leading-relaxed">{card.desc}</p>
                      <span className="text-[#D4AF37] font-semibold text-[11px] bg-primary/25 px-2.5 py-0.5 rounded-full border border-secondary/20 inline-block">
                        {card.price}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-md flex-shrink-0">
                      <ArrowRight className="w-4 h-4 translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* Service 5: Printed Luxury Invites (Custom 4-carousel grid layout) */}
      {printedBlock?.enabled !== false && (
        <section className="py-28 bg-[#faf8f5] relative overflow-hidden border-b border-gray-100 scroll-animate">
          <LotusDecor className="absolute top-16 right-16 w-40 h-40 text-primary opacity-20 pointer-events-none" />
          <MandalaDecor className="absolute bottom-20 left-20 w-56 h-56 text-secondary opacity-15 pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className={`grid gap-16 items-center max-w-7xl mx-auto ${printedBlock?.layoutStyle === 'Centered-Accent' ? 'grid-cols-1 text-center' : 'lg:grid-cols-2'}`}>
              
              {/* Left - Visual */}
              <div className={`relative ${printedBlock?.layoutStyle === 'Split-Image-Right' ? 'lg:order-last' : ''} ${printedBlock?.layoutStyle === 'Centered-Accent' ? 'max-w-[480px] mx-auto' : ''} ${printedBlock?.layoutStyle === 'Minimalist-Banner' ? 'hidden' : ''}`}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    {/* Image 1 Carousel */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-[#faf8f5]">
                      <ImageWithFallback
                        src={printedCardImages1[image1Index % printedCardImages1.length]}
                        alt="Premium Wedding Card"
                        className="w-full h-full object-cover transition-opacity duration-1000"
                      />
                      {/* Dots for Image 1 */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {printedCardImages1.map((_, index) => (
                          <div
                            key={index}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                              index === (image1Index % printedCardImages1.length) ? 'bg-white w-4' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Image 2 Carousel */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-[#faf8f5]">
                      <ImageWithFallback
                        src={printedCardImages2[image2Index % printedCardImages2.length]}
                        alt="Luxury Invitation"
                        className="w-full h-full object-cover transition-opacity duration-1000"
                      />
                      {/* Dots for Image 2 */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {printedCardImages2.map((_, index) => (
                          <div
                            key={index}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                              index === (image2Index % printedCardImages2.length) ? 'bg-white w-4' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-8">
                    {/* Image 3 Carousel */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-[#faf8f5]">
                      <ImageWithFallback
                        src={printedCardImages3[image3Index % printedCardImages3.length]}
                        alt="Artisanal Finishing"
                        className="w-full h-full object-cover transition-opacity duration-1000"
                      />
                      {/* Dots for Image 3 */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {printedCardImages3.map((_, index) => (
                          <div
                            key={index}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                              index === (image3Index % printedCardImages3.length) ? 'bg-white w-4' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Image 4 Carousel */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-[#faf8f5]">
                      <ImageWithFallback
                        src={printedCardImages4[image4Index % printedCardImages4.length]}
                        alt="Bespoke Design"
                        className="w-full h-full object-cover transition-opacity duration-1000"
                      />
                      {/* Dots for Image 4 */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {printedCardImages4.map((_, index) => (
                          <div
                            key={index}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                              index === (image4Index % printedCardImages4.length) ? 'bg-white w-4' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative accent */}
                <div className="absolute -bottom-6 -right-6 w-40 h-40 opacity-20 pointer-events-none">
                  <LotusDecor className="w-full h-full text-primary" />
                </div>
              </div>

              {/* Right - Content */}
              <div className={`${printedBlock?.layoutStyle === 'Split-Image-Right' ? 'lg:order-first' : ''} ${printedBlock?.layoutStyle === 'Centered-Accent' ? 'flex flex-col items-center text-center' : ''}`}>
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-primary"></div>
                  <span className="text-sm tracking-[0.2em] uppercase text-primary font-bold">{printedBlock?.badgeText || "Premium Collection"}</span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight font-bold text-[#1a1410] leading-[1.08]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Printed{' '}
                  <span className="animate-luxury-word font-serif italic" style={{ fontFamily: "'Bricolage Grotesque', serif" }}>Luxury</span>{' '}
                  Invites
                </h2>

                <p className="text-lg text-muted-foreground mb-8 leading-relaxed font-light">
                  {printedBlock?.body || 'Experience the finest craftsmanship with our premium printed wedding invitations. Each piece is meticulously designed with luxurious materials, exquisite finishes, and attention to detail that makes your invitation unforgettable.'}
                </p>

                <div className="space-y-5 mb-10">
                  {printedBlock?.features && printedBlock.features.length > 0 ? (
                    printedBlock.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/5">
                          <CheckCircle className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-[#1a1410] mb-0.5">{feat.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    [
                      { title: 'Luxury Materials', desc: 'Premium paper stocks, silk fabrics, acrylic, wood, and metal finishes' },
                      { title: 'Artisanal Finishing', desc: 'Gold foil, embossing, laser cutting, and hand-tied ribbons' },
                      { title: 'Bespoke Design', desc: 'Fully customizable designs tailored to your unique vision' }
                    ].map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/5">
                          <CheckCircle className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-[#1a1410] mb-0.5">{feat.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to={printedBlock?.ctaLink || '/events'}
                    className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:shadow-xl hover:scale-105 inline-flex items-center gap-2 shadow-lg group btn-shimmer"
                  >
                    {printedBlock?.ctaText || 'Explore Collection'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/contact"
                    className="px-8 py-4 bg-white text-foreground border-2 border-primary/20 rounded-full hover:bg-primary/5 hover:border-primary/40 transition-all shadow-md hover:shadow-lg hover:scale-105"
                  >
                    Request Samples
                  </Link>
                </div>

                <p className="text-sm text-muted-foreground mt-6 italic">
                  {printedBlock?.footerText || "Starting from ₹50 per piece • Minimum order: 50 pieces"}
                </p>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Categories Section - Browse by Occasion — expanded to ALL services */}
      {categoriesBlock?.enabled !== false && (
        <section className="py-24 bg-card relative overflow-hidden scroll-animate">
          <MandalaDecor className="absolute top-10 right-10 w-64 h-64 text-primary opacity-30 animate-rotate-slow" />
          <LotusDecor className="absolute bottom-10 left-10 w-48 h-48 text-secondary opacity-20 animate-float" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase mb-4">✦ Shop by Occasion</span>
              <h2 className="text-4xl md:text-6xl mb-4">{categoriesBlock?.title || 'Browse by Occasion'}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {categoriesBlock?.subtitle || 'Invitations, stationery, gifts & websites — curated for every celebration'}
              </p>
            </div>

            {/* Service type quick-tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {[
                { label: 'Invitations', link: '/events', icon: FileText },
                { label: 'Stationery', link: '/stationery', icon: Printer },
                { label: 'Gifts', link: '/gifts', icon: Gift },
                { label: 'Event Websites', link: '/event-websites', icon: Globe },
              ].map(tab => {
                const TabIcon = tab.icon;
                return (
                  <Link
                    key={tab.label}
                    to={tab.link}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-primary/15 rounded-full text-sm font-semibold text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 group"
                  >
                    <TabIcon className="w-3.5 h-3.5 text-primary group-hover:text-white transition-colors" strokeWidth={2} />
                    {tab.label}
                  </Link>
                );
              })}
            </div>

            {/* Balanced Grid — stagger in */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto stagger-parent">
              {categories.map((category, index) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="group stagger-child relative overflow-hidden rounded-3xl transform transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
                >
                  <div className="aspect-[4/3] relative">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent group-hover:from-black/88 transition-all duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-6 left-6 right-6">
                      {(() => {
                        const catIconMap: Record<string, React.ElementType> = {
                          'Wedding': Star,
                          'Engagement': Sparkles,
                          'Birthday': Gift,
                          'Baby Shower': Video,
                          'Pooja': Star,
                          'Anniversary': Globe,
                        };
                        const CatIcon = catIconMap[category.name] ?? Star;
                        return (
                          <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-3 group-hover:bg-secondary/80 group-hover:border-secondary/40 transition-all duration-300">
                            <CatIcon className="w-4.5 h-4.5 text-white" strokeWidth={1.5} />
                          </div>
                        );
                      })()}
                      <h3 className="text-2xl text-white mb-1 font-bold">{category.name}</h3>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {['Invitations','Stationery','Gifts'].map(s => (
                          <span key={s} className="text-[10px] font-bold tracking-wider uppercase text-white/60 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">{s}</span>
                        ))}
                      </div>
                      <div className="inline-flex items-center gap-2 text-white text-sm font-semibold group-hover:gap-3 transition-all bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/15">
                        <span>Explore All</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Carousel Gallery */}
      {productCarouselSection?.enabled !== false && (
        <div className="scroll-animate">
          <ProductCarousel />
        </div>
      )}

      {/* B2B Corporate Section */}
      <section className="py-24 bg-white relative overflow-hidden border-b border-gray-100 scroll-animate">
        <style>{`
          @keyframes scan-line {
            0%, 100% { top: 15%; opacity: 0.6; }
            50% { top: 75%; opacity: 1; filter: drop-shadow(0 0 8px #8B4949); }
          }
          @keyframes float-shape {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(2.5deg); }
          }
          @keyframes pulse-ring {
            0% { transform: scale(0.95); opacity: 0.25; }
            50% { transform: scale(1.03); opacity: 0.45; }
            100% { transform: scale(1.08); opacity: 0; }
          }
          @keyframes qr-pulse {
            0%, 100% { transform: scale(1); opacity: 0.75; filter: drop-shadow(0 0 0px rgba(139, 73, 73, 0)); }
            50% { transform: scale(1.03); opacity: 0.95; filter: drop-shadow(0 0 10px rgba(139, 73, 73, 0.2)); }
          }
          @keyframes check-verify {
            0% { transform: translateY(12px) scale(0.96); opacity: 0; }
            100% { transform: translateY(0) scale(1); opacity: 1; }
          }
          .qr-pulse-active { animation: qr-pulse 3.5s ease-in-out infinite; }
          .check-verify-anim { animation: check-verify 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          /* iPhone 17 Pro Max titanium sheen */
          .iphone-frame {
            background: linear-gradient(145deg, #C8C8C8 0%, #A8A8A8 30%, #909090 60%, #B0B0B0 100%);
            box-shadow: 0 0 0 1px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25), 0 40px 80px rgba(0,0,0,0.25), 0 10px 30px rgba(0,0,0,0.15);
          }
          .iphone-screen-glass {
            background: #000;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
          }
          .dynamic-island {
            background: #000;
            box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
          }
        `}</style>

        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-br from-accent/8 to-primary/4 rounded-full blur-3xl pointer-events-none" style={{ animation: 'pulse-ring 10s ease-in-out infinite' }} />
        <div className="absolute -bottom-10 left-10 w-48 h-48 opacity-8 pointer-events-none" style={{ animation: 'float-shape 6s ease-in-out infinite' }}>
          <MandalaDecor className="w-full h-full text-primary animate-rotate-slow" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: iPhone 17 Pro Max Mockup */}
            <div className="relative flex items-center justify-center order-2 lg:order-1 scroll-animate">
              <div className="absolute inset-0 bg-primary/4 rounded-[5rem] blur-3xl opacity-60 pointer-events-none" />

              {/* iPhone 17 Pro Max Frame */}
              <div className="relative iphone-frame rounded-[52px] p-[3.5px] max-w-[270px] w-full z-10 hover:scale-[1.02] transition-transform duration-500" style={{ animation: 'float-shape 8s ease-in-out infinite' }}>
                {/* Volume buttons left */}
                <div className="absolute left-[-4px] top-[110px] w-[4px] h-7 rounded-l-full" style={{ background: 'linear-gradient(180deg, #B8B8B8, #909090)' }} />
                <div className="absolute left-[-4px] top-[148px] w-[4px] h-7 rounded-l-full" style={{ background: 'linear-gradient(180deg, #B8B8B8, #909090)' }} />
                <div className="absolute left-[-4px] top-[186px] w-[4px] h-7 rounded-l-full" style={{ background: 'linear-gradient(180deg, #B8B8B8, #909090)' }} />
                {/* Power button right */}
                <div className="absolute right-[-4px] top-[155px] w-[4px] h-14 rounded-r-full" style={{ background: 'linear-gradient(180deg, #B8B8B8, #909090)' }} />

                {/* Screen */}
                <div className="iphone-screen-glass rounded-[49px] overflow-hidden relative" style={{ aspectRatio: '9/19.5' }}>
                  {/* Dynamic Island */}
                  <div className="dynamic-island absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-[30px] rounded-full z-30 flex items-center justify-between px-3">
                    <div className="w-2 h-2 rounded-full bg-[#1C1C1C]" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }} />
                    <div className="w-[14px] h-[14px] rounded-full" style={{ background: 'radial-gradient(circle at 35% 35%, #2a2a2a, #0a0a0a)', boxShadow: 'inset 0 0 0 2px #1a1a1a, 0 0 6px rgba(80,140,255,0.3)' }}>
                      <div className="w-1 h-1 bg-[#3a6ff0] rounded-full mx-auto mt-1 opacity-70" />
                    </div>
                  </div>

                  {/* White screen content */}
                  <div className="absolute inset-0 bg-[#f8f8fa] flex flex-col pt-16 px-3.5 pb-3">
                    {/* App header — generic event branding */}
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-800 leading-none">Summit Hub</div>
                          <div className="text-[7px] text-slate-400 leading-none mt-0.5">Event Management</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                        <span className="text-[8px] font-bold text-emerald-600">LIVE</span>
                      </div>
                    </div>

                    {/* Event Microsite & Branding Animation Container */}
                    <div className="flex-1 relative overflow-hidden flex flex-col justify-between mt-1">
                      {/* SCREEN 1: EVENT MICROSITE */}
                      <div
                        className={`absolute inset-0 flex flex-col justify-between transition-all duration-700 ease-in-out ${
                          activeB2BScreen === 'microsite'
                            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                        }`}
                      >
                        {/* Browser header mockup */}
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 space-y-1.5 shadow-sm">
                          <div className="flex justify-between items-center">
                            <div className="flex gap-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f]" />
                            </div>
                            <span className="text-[7px] text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-md leading-none truncate w-[90px] text-center font-mono">summit.eventique.com</span>
                            <div className="w-3" />
                          </div>
                          
                          {/* Banner image mockup */}
                          <div className="h-14 bg-gradient-to-br from-primary/20 via-secondary/15 to-primary/10 rounded-md relative overflow-hidden flex items-center justify-center border border-primary/5">
                            <div className="absolute top-1 right-1 text-[6px] bg-primary/20 text-primary font-bold px-1 py-0.5 rounded-sm">COUNTDOWN</div>
                            <div className="text-center">
                              <div className="text-[7px] font-bold text-primary tracking-widest leading-none">TECH SUMMIT</div>
                              <div className="text-[5px] text-slate-500 font-bold mt-0.5 leading-none">02D : 14H : 36M</div>
                            </div>
                            {/* Floating decorative mini lotus */}
                            <LotusDecor className="absolute -bottom-1 -right-1 w-6 h-6 text-primary opacity-20" />
                          </div>
                        </div>

                        {/* Speaker/Session item mockups */}
                        <div className="space-y-1.5">
                          <div className="text-[8px] font-bold text-slate-400 tracking-wider">UPCOMING SESSIONS</div>
                          
                          <div className="bg-white border border-slate-100 hover:border-primary/10 rounded-xl p-1.5 flex items-center justify-between shadow-sm transition-all">
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&fit=crop" className="w-full h-full object-cover" alt="speaker" />
                              </div>
                              <div>
                                <div className="text-[8px] font-bold text-slate-800">Opening Keynote</div>
                                <div className="text-[6px] text-slate-400 leading-none mt-0.5">10:00 AM · Dr. Jenkins</div>
                              </div>
                            </div>
                            <span className="text-[6px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 py-0.5 rounded">STAGE A</span>
                          </div>

                          <div className="bg-white border border-slate-100 hover:border-primary/10 rounded-xl p-1.5 flex items-center justify-between shadow-sm transition-all">
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&fit=crop" className="w-full h-full object-cover" alt="speaker" />
                              </div>
                              <div>
                                <div className="text-[8px] font-bold text-slate-800">Panel: Future AI</div>
                                <div className="text-[6px] text-slate-400 leading-none mt-0.5">11:15 AM · Tech Leads</div>
                              </div>
                            </div>
                            <span className="text-[6px] font-bold text-primary bg-primary/5 border border-primary/10 px-1 py-0.5 rounded">STAGE B</span>
                          </div>
                        </div>

                        {/* CTA button mockup */}
                        <div className="bg-primary hover:bg-primary/95 text-white text-[9px] font-bold py-1.5 rounded-xl text-center shadow-md cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-center gap-1 mt-1">
                          <span>Register For Pass</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </div>
                      </div>

                      {/* SCREEN 2: EVENT BRANDING */}
                      <div
                        className={`absolute inset-0 flex flex-col justify-between transition-all duration-700 ease-in-out ${
                          activeB2BScreen === 'branding'
                            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                            : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
                        }`}
                      >
                        {/* Design canvas header */}
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 space-y-1.5 shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-[7px] font-bold text-slate-500 tracking-wider">BRAND ASSET CANVAS</span>
                            <span className="text-[6px] font-bold text-[#D4AF37] bg-secondary/10 px-1.5 py-0.5 rounded-md">VECTOR</span>
                          </div>
                          
                          {/* Main brand logomark container */}
                          <div className="h-14 bg-slate-50 border border-dashed border-slate-200 rounded-md relative flex items-center justify-center overflow-hidden">
                            {/* Grid coordinates */}
                            <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 opacity-20 pointer-events-none">
                              {Array.from({ length: 18 }).map((_, idx) => (
                                <div key={idx} className="border-[0.5px] border-slate-300" />
                              ))}
                            </div>
                            {/* Bounding box guide overlays */}
                            <div className="absolute w-[95px] h-[34px] border border-secondary/40 flex items-center justify-center">
                              <span className="absolute -top-0.5 -left-0.5 w-1 h-1 bg-secondary" />
                              <span className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-secondary" />
                              <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-secondary" />
                              <span className="absolute -bottom-0.5 -right-0.5 w-1 h-1 bg-secondary" />
                              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[4px] font-mono text-secondary font-semibold bg-white px-0.5">W: 190px x H: 68px</span>
                            </div>
                            
                            <div className="text-center z-10">
                              <div className="text-[12px] font-bold tracking-[0.18em] text-[#1a1410] leading-none" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>EVENTIQUE</div>
                              <div className="text-[5px] text-primary tracking-[0.25em] font-semibold uppercase mt-0.5">EXPERIENCE</div>
                            </div>
                          </div>
                        </div>

                        {/* Color swatches */}
                        <div className="space-y-1">
                          <div className="text-[8px] font-bold text-slate-400 tracking-wider">ACTIVE COLOR PALETTE</div>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[
                              { hex: '#8B4949', name: 'Primary' },
                              { hex: '#D4AF37', name: 'Accent' },
                              { hex: '#1A1410', name: 'Dark' },
                              { hex: '#FAF8F5', name: 'Light' }
                            ].map((col, idx) => (
                              <div key={idx} className="text-center">
                                <div
                                  className="h-8 rounded-lg shadow-sm border border-slate-100 hover:scale-105 transition-transform duration-300"
                                  style={{ backgroundColor: col.hex }}
                                />
                                <div className="text-[6px] font-bold text-slate-700 mt-1 truncate">{col.name}</div>
                                <div className="text-[5px] text-slate-400 truncate leading-none">{col.hex}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Typography sample */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 mt-1">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="text-[6px] font-bold text-slate-400 uppercase font-mono">Typography Family</span>
                            <span className="text-[5px] font-mono text-slate-400">Bricolage Grotesque</span>
                          </div>
                          <div className="text-[10px] font-bold text-slate-800 leading-tight">Modern Premium Minimal</div>
                        </div>
                      </div>
                    </div>

                    {/* Check-in notification */}
                    <div
                      className={`border p-2 flex items-center gap-2 shadow-sm rounded-2xl transition-all duration-500 mt-2.5 ${
                        activeB2BScreen === 'microsite'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-[#fdf9ee] border-[#f5ebcb] text-[#856515]'
                      }`}
                    >
                      {activeB2BScreen === 'microsite' ? (
                        <>
                          <div className="w-5.5 h-5.5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-[9px] font-bold">Microsite Live ✓</div>
                            <div className="text-[8px] opacity-85 leading-none mt-0.5">12,480 Active Users</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-5.5 h-5.5 rounded-full bg-[#D4AF37] text-white flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-3.5 h-3.5 animate-sparkle-blink" />
                          </div>
                          <div>
                            <div className="text-[9px] font-bold">Assets Deployed ✓</div>
                            <div className="text-[8px] opacity-85 leading-none mt-0.5">100% Brand Consistent</div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Home indicator */}
                    <div className="flex justify-center pt-2">
                      <div className="w-24 h-1 bg-slate-900 rounded-full opacity-20" />
                    </div>
                  </div>

                  {/* Screen glass reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-transparent pointer-events-none rounded-[49px]" />
                </div>
              </div>

              {/* Floating badge */}
              <div
                className="absolute bottom-12 -right-4 bg-white border border-primary/10 p-3.5 rounded-2xl shadow-xl z-20 hidden sm:flex items-center gap-3"
                style={{ animation: 'float-shape 7s ease-in-out infinite' }}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">1,248 Checked In</div>
                  <div className="text-[9px] text-emerald-600 font-bold tracking-wider uppercase mt-0.5">Registration: 98%</div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8 order-1 lg:order-2 scroll-animate">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3">
                  <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-primary"></div>
                  <span className="text-xs tracking-[0.25em] uppercase text-primary font-bold">B2B Enterprise Solutions</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-[#1a1410] tracking-tight leading-[1.15]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Corporate Event<br />
                  <span
                    className="animate-luxury-word"
                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontStyle: 'normal' }}
                  >Experience</span>{' '}Design
                </h2>
                <p className="text-base text-slate-500 font-light leading-relaxed max-w-xl">
                  We translate organization values into cohesive, high-performance event tools. From fast microsites and secure guest check-in systems to custom executive gift bags, we align design with enterprise reliability.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                {[
                  { icon: Laptop, title: 'Event Microsites', desc: 'Secure portals with multi-track calendars and speaker pages.' },
                  { icon: QrCode, title: 'Registration & Tickets', desc: 'Conversion engines issuing custom email badges & QR codes.' },
                  { icon: Gift, title: 'Corporate Gifting', desc: 'Artisanal employee boxes & client VIP hampers.' },
                  { icon: ShieldCheck, title: 'Data & Security', desc: 'SSL-encrypted check-in panels complying with standard data controls.' },
                  { icon: Globe, title: 'Event Branding', desc: 'End-to-end visual identity and signage for summits & conferences.' },
                  { icon: FileText, title: 'Digital Invitations', desc: 'Professional corporate e-invites and branded RSVP systems.' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="group flex gap-3 items-start p-4 hover:bg-primary/4 rounded-2xl border border-transparent hover:border-primary/10 transition-all duration-300">
                      <div className="w-9 h-9 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary/15 transition-colors">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-light">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-4 pt-4 border-t border-primary/10">
                <Link to="/contact" className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all hover:scale-105 inline-flex items-center gap-2 text-sm shadow-md">
                  Request a Proposal <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/corporate" className="px-8 py-3.5 bg-white text-primary border-2 border-primary/25 rounded-full font-semibold hover:bg-primary/5 transition-all hover:scale-105 text-sm shadow-sm">
                  Explore Corporate Hub
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Overview — Personal + Corporate */}
      {servicesBlock?.enabled !== false && (
        <section className="py-24 bg-muted relative overflow-hidden scroll-animate">
          <MandalaDecor className="absolute top-10 left-10 w-48 h-48 text-primary opacity-30 animate-rotate-slow" />
          <LotusDecor className="absolute bottom-10 right-10 w-40 h-40 text-secondary opacity-35 animate-float" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase mb-4">✦ What We Offer</span>
              <h2 className="text-4xl md:text-5xl mb-4 font-bold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{servicesBlock?.title || 'Our Services'}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {servicesBlock?.subtitle || 'Complete event experience solutions — from personal celebrations to enterprise events'}
              </p>
            </div>

            {/* Unified Services Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 stagger-parent">
              {services.map((service, index) => {
                const IconComponent = getServiceIcon(service.iconName);
                return (
                  <Link
                    key={index}
                    to={service.link}
                    className="stagger-child bg-card p-5 rounded-2xl text-center hover:shadow-xl transition-all hover:scale-105 group border border-transparent hover:border-primary/20 glow-hover"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <IconComponent className="w-6 h-6 text-primary group-hover:text-white transition-colors" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-base mb-2 group-hover:text-primary transition-colors font-semibold">{service.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{service.description}</p>
                  </Link>
                );
              })}
              {/* 6th Card: Corporate */}
              <Link
                to="/corporate"
                className="stagger-child bg-card p-5 rounded-2xl text-center hover:shadow-xl transition-all hover:scale-105 group border border-transparent hover:border-primary/20 glow-hover"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Laptop className="w-6 h-6 text-primary group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <h3 className="text-base mb-2 group-hover:text-primary transition-colors font-semibold">Corporate Events</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">Enterprise invitations & microsites</p>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works — stagger steps + animated number circles */}
      {howItWorksSection?.enabled !== false && (
        <section className="py-24 relative overflow-hidden scroll-animate">
          <LotusDecor className="absolute top-20 right-20 w-44 h-44 text-accent opacity-35 animate-float" />
          <MandalaDecor className="absolute bottom-20 left-16 w-52 h-52 text-primary opacity-30 animate-rotate-slow" />
          {/* Subtle background orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full orb-pulse" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)' }} />
            <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full orb-pulse" style={{ background: 'radial-gradient(circle, rgba(139,73,73,0.08) 0%, transparent 70%)', animationDelay: '4s' }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase mb-4 badge-pop">✦ The Process</span>
              <h2 className="text-4xl md:text-5xl mb-4 font-bold blur-reveal" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How It <span className="text-gradient-flow">Works</span></h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto blur-reveal-delay">
                Simple and seamless process to get your perfect invitation
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-parent">
              {steps.map((item, index) => (
                <div key={index} className="stagger-child relative text-center group">
                  {/* Animated number circle */}
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-full bg-primary/20 group-hover:scale-125 transition-transform duration-500 orb-pulse" />
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/15 transition-all duration-500">
                      <span className="text-2xl font-bold text-primary num-pop" style={{ animationDelay: `${index * 0.15}s` }}>{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl mb-3 font-bold group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[65%] w-[70%] h-4 pointer-events-none select-none z-0">
                      <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path
                          d="M0,5 L100,5"
                          stroke="var(--primary)"
                          strokeWidth="2"
                          strokeDasharray="6, 6"
                          className="animate-dash-flow"
                          style={{ opacity: 0.35 }}
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Preview — video first (always shown), then text cards */}
      {testimonialsBlock?.enabled !== false && (() => {
        const allTestimonials = state.testimonials && state.testimonials.length > 0 ? state.testimonials : defaultTestimonials;
        const videoOnes = allTestimonials.filter(t => t.videoUrl).slice(0, 3);
        const textOnes = allTestimonials.filter(t => !t.videoUrl).slice(0, 3);
        // Hardcoded sample video testimonials as portrait cards with poster imagery when no videos
        const sampleVideoCards = [
          { name: 'Priya & Rahul', event: 'Wedding · Mumbai', rating: 5, poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&fit=crop', quote: 'The video invitation was stunning! Our guests loved it.' },
          { name: 'Neha Kapoor', event: 'Baby Shower · Delhi', rating: 5, poster: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&fit=crop', quote: 'Absolutely beautiful work. Highly recommend Eventique!' },
          { name: 'Amit & Sonia', event: 'Engagement · Pune', rating: 5, poster: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&fit=crop', quote: 'The customization was seamless and the team was so helpful.' },
        ];
        return (
          <section className="py-24 bg-card relative overflow-hidden scroll-animate">
            <MandalaDecor className="absolute top-16 left-12 w-48 h-48 text-secondary opacity-30 animate-rotate-slow" />
            <LotusDecor className="absolute bottom-16 right-12 w-36 h-36 text-primary opacity-35 animate-float" />

            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-14">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase mb-4">✦ Happy Clients</span>
                <h2 className="text-4xl md:text-5xl mb-4 font-bold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{testimonialsBlock?.title || 'What Our Clients Say'}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {testimonialsBlock?.subtitle || 'Join thousands of happy customers who trusted us with their celebrations'}
                </p>
              </div>

              {/* Video testimonials — always shown */}
              <div className="mb-14 scroll-animate">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                  <span className="text-xs font-bold tracking-widest uppercase text-primary/70 px-3 flex items-center gap-1.5"><Video className="w-3 h-3" /> Video Reviews</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/20 to-transparent" />
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                  {(videoOnes.length > 0 ? videoOnes.map((t, i) => ({
                    name: t.name, event: t.event, rating: t.rating,
                    poster: sampleVideoCards[i]?.poster || sampleVideoCards[0].poster,
                    quote: (t as any).comment || sampleVideoCards[i]?.quote || '',
                    videoUrl: t.videoUrl,
                    id: t.id
                  })) : sampleVideoCards).map((card, i) => (
                    <div
                      key={i}
                      className="relative rounded-3xl overflow-hidden shadow-xl border border-primary/10 group w-full max-w-[220px] hover:scale-[1.04] hover:shadow-2xl transition-all duration-500 scroll-animate"
                      style={{ aspectRatio: '9/16' }}
                    >
                      {/* Poster image */}
                      <img
                        src={(card as any).poster}
                        alt={card.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 shadow-lg">
                          <div className="w-0 h-0 ml-1" style={{ borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '16px solid rgba(255,255,255,0.9)' }} />
                        </div>
                      </div>

                      {/* Stars + quote + name */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <div className="flex gap-0.5 mb-2">
                          {Array.from({ length: 5 }).map((_, star) => (
                            <Star key={star} className={`w-3.5 h-3.5 ${star < card.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white/30'}`} />
                          ))}
                        </div>
                        <p className="text-[11px] text-white/85 italic leading-relaxed mb-2 line-clamp-2">"{(card as any).quote}"</p>
                        <p className="text-sm font-bold text-white">{card.name}</p>
                        <p className="text-[10px] text-white/60">{card.event}</p>
                      </div>

                      {/* Eventique watermark badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-white/15 backdrop-blur-sm text-white text-[9px] font-bold tracking-wider uppercase rounded-full border border-white/20">
                          ★ Eventique
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Text testimonials */}
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto stagger-parent">
                {textOnes.map((t, i) => (
                  <div key={t.id || i} className="stagger-child bg-white border border-gray-100 p-7 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
                    <div>
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, star) => (
                          <Star key={star} className={`w-5 h-5 ${star < t.rating ? 'fill-primary text-primary' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <p className="text-foreground/80 mb-4 leading-relaxed text-[15px] italic">
                        "{(t.comment || (t as any).text)}"
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">{t.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{t.name}</p>
                        {t.event && <p className="text-xs text-muted-foreground">{t.event}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link to="/testimonials" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-all duration-300 font-semibold text-sm hover:scale-105">
                  Read All Reviews <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Blog Section */}
      <section className="py-24 bg-gradient-to-b from-[#faf8f5] to-white relative overflow-hidden border-t border-gray-100 scroll-animate">
        {/* Floating micro-particles */}
        {[
          { size: 4, left: '3%',  top: '40%', dur: '10s', del: '0s',   color: 'rgba(139,73,73,0.10)' },
          { size: 5, left: '95%', top: '25%', dur: '12s', del: '1.5s', color: 'rgba(212,175,55,0.12)' },
          { size: 3, left: '55%', top: '5%',  dur: '8s',  del: '0.8s', color: 'rgba(139,73,73,0.08)' },
        ].map((p, i) => (
          <span key={i} className="particle" style={{ width: p.size, height: p.size, left: p.left, top: p.top, background: p.color, animationDuration: p.dur, animationDelay: p.del }} />
        ))}
        <MandalaDecor className="absolute top-10 right-10 w-48 h-48 text-primary opacity-20 animate-rotate-slow" />
        <LotusDecor className="absolute bottom-10 left-10 w-40 h-40 text-secondary opacity-25 animate-float" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase mb-4 badge-pop">
              ✦ Inspiration &amp; Trends
            </span>
            <h2 className="text-4xl md:text-5xl text-[#1a1410] mb-4 font-bold blur-reveal" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Latest from Our <span className="text-gradient-flow">Blog</span></h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto blur-reveal-delay">
              Tips, trends, and inspiration for planning your dream invitations and stationery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto stagger-parent">
            {blogPosts.map((post, postIdx) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="stagger-child group relative flex flex-col rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-[0_16px_48px_rgba(139,73,73,0.13)] transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  {/* Gradient reveal */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Category badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-primary text-[10px] font-bold tracking-widest uppercase rounded-full shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {post.category}
                    </span>
                  </div>
                  {/* Read more overlay that appears on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
                    <div className="flex items-center gap-2 bg-white/95 backdrop-blur text-primary px-4 py-2 rounded-full text-xs font-bold shadow-xl translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                  {/* Issue number accent */}
                  <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-secondary/90 backdrop-blur text-white text-[9px] font-bold flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0">
                    #{postIdx + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Meta row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                      <span>{post.date}</span>
                      <span className="text-gray-200">•</span>
                      <span className="text-primary font-semibold">{post.readTime}</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-primary/8 flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                      <ArrowRight className="w-3 h-3 text-primary group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-800 mb-2.5 group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-grow">
                    {post.description}
                  </p>

                  {/* Bottom read more CTA */}
                  <div className="flex items-center gap-2 pt-3.5 border-t border-gray-100 group-hover:border-primary/15 transition-colors duration-300">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-primary group-hover:tracking-[0.2em] transition-all duration-300">Read Article</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent group-hover:from-primary/50 transition-all duration-300" />
                    <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section — premium redesign */}
      {ctaSection?.enabled !== false && (
        <section className="relative overflow-hidden scroll-animate" style={{ background: 'linear-gradient(135deg, #1a0f0f 0%, #2d1515 30%, #8B4949 65%, #D4AF37 100%)' }}>
          <style>{`
            @keyframes cta-float-orb {
              0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.18; }
              33% { transform: translate(30px, -40px) scale(1.12); opacity: 0.28; }
              66% { transform: translate(-20px, 20px) scale(0.92); opacity: 0.14; }
            }
            @keyframes cta-shimmer-line {
              0% { transform: translateX(-100%) skewX(-15deg); }
              100% { transform: translateX(300%) skewX(-15deg); }
            }
            @keyframes cta-text-reveal {
              from { opacity: 0; transform: translateY(24px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .cta-text-anim { animation: cta-text-reveal 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }
            .cta-text-anim-delay { animation: cta-text-reveal 0.9s 0.15s cubic-bezier(0.16,1,0.3,1) both; }
            .cta-text-anim-delay2 { animation: cta-text-reveal 0.9s 0.3s cubic-bezier(0.16,1,0.3,1) both; }
            .cta-shimmer-line {
              animation: cta-shimmer-line 4s ease-in-out infinite;
            }
          `}</style>

          {/* Animated orbs */}
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)', animation: 'cta-float-orb 12s ease-in-out infinite' }} />
          <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,73,73,0.4) 0%, transparent 70%)', animation: 'cta-float-orb 9s 3s ease-in-out infinite' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)', animation: 'cta-float-orb 15s 6s ease-in-out infinite' }} />

          {/* Shimmer sweep line */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-32 h-full bg-white/5 blur-xl cta-shimmer-line" />
          </div>

          {/* Decorative SVG pattern */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          <div className="container mx-auto px-4 py-28 text-center relative z-10">
            {/* Eye-catching badge with sparkle-blink icon */}
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-xs font-bold tracking-widest uppercase mb-8 cta-text-anim">
              <Sparkles className="w-3.5 h-3.5 text-secondary sparkle-blink" />
              Start your Eventique journey
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl mb-6 font-bold text-white leading-[1.05] tracking-tight cta-text-anim-delay" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Create Something
              <span className="block" style={{ background: 'linear-gradient(90deg, #D4AF37, #f0d060, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Unforgettable.</span>
            </h2>

            <p className="text-xl mb-10 text-white/70 max-w-2xl mx-auto font-light leading-relaxed cta-text-anim-delay2">
              From intimate celebrations to enterprise events — we craft experiences that leave a lasting impression.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-8 mb-12 cta-text-anim-delay2">
              {[{ val: '10K+', label: 'Happy Clients' }, { val: '50+', label: 'Occasion Types' }, { val: '4.9★', label: 'Avg Rating' }].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-white">{stat.val}</div>
                  <div className="text-xs text-white/50 font-semibold tracking-wider uppercase mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/events"
                className="group px-10 py-4 rounded-full font-bold text-sm text-slate-900 inline-flex items-center gap-2 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-secondary/40 btn-shimmer"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #f0d060)' }}
              >
                Explore Designs
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/25 text-white rounded-full hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 font-bold text-sm"
              >
                Talk to Us
              </Link>
              <Link
                to="/corporate"
                className="px-10 py-4 bg-transparent border border-white/15 text-white/70 rounded-full hover:bg-white/5 hover:text-white hover:border-white/30 transition-all duration-300 hover:scale-105 font-semibold text-sm"
              >
                Corporate Solutions
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}