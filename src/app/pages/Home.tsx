import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Star, Video, FileText, Printer, Globe, ChevronLeft, ChevronRight, Gift } from 'lucide-react';
import { testimonials as defaultTestimonials } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';
import { ProductCarousel } from '../components/ProductCarousel';
import mobileMockup from '../../imports/image-1.png';
import elephantDecor from '../../imports/image-2.png';
import lotusImage from '../../imports/image-3.png';
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

      <div className="space-y-5 mb-10">
        {features.map((feat, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/5">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1a1410] mb-0.5">{feat.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {ctaText && (
          <Link
            to={ctaLink || "/explore"}
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

  const featuredProducts = state.products.slice(0, 6);
  const [heroSlide, setHeroSlide] = useState(0);
  const [image1Index, setImage1Index] = useState(0);
  const [image2Index, setImage2Index] = useState(0);
  const [image3Index, setImage3Index] = useState(0);
  const [image4Index, setImage4Index] = useState(0);

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
                    <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 leading-[1.1] tracking-tight">
                      {slide.title} <span className="text-primary italic">{slide.highlight}</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-10 leading-relaxed font-light max-w-xl">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-4 mb-10">
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
                    <div className="flex items-center gap-8 flex-wrap">
                      {['Fast Delivery', 'Unlimited Revisions*', '24/7 Support'].map((item) => (
                        <div key={item} className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">* Terms and conditions apply</p>
                  </div>

                  {/* Right — Visual */}
                  <div className="relative flex items-center justify-center lg:justify-end">
                    {idx % 3 === 0 && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-3xl opacity-60" />
                        <div className="relative w-full max-w-[560px] h-[460px]">
                          <img src={mobileMockup} alt="Mobile Invitation Mockups" className="w-full h-full object-contain drop-shadow-2xl relative z-10 hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="absolute -bottom-8 -left-8 w-28 h-28 opacity-40">
                          <LotusDecor className="w-full h-full text-primary" />
                        </div>
                      </>
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
                            <ImageWithFallback src={src} alt={`New design ${i + 1}`} className="w-full aspect-[3/4] object-cover hover:scale-105 transition-transform duration-500" />
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
                            to="/packages"
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

      {/* Service 1: Explore Designs */}
      <StaggeredSection
        enabled={exploreBlock?.enabled !== false}
        title={exploreBlock?.title || 'Explore Our Designs'}
        body={exploreBlock?.subtitle || 'Browse hundreds of premium invitation designs for every occasion.'}
        ctaText={exploreBlock?.ctaText || 'View Catalog'}
        ctaLink={exploreBlock?.ctaLink || '/explore'}
        images={exploreBlock?.images}
        defaultImages={DEFAULT_EXPLORE_IMAGES}
        features={[
          { title: 'Multitudes of Occasions', desc: 'Curated designs for Weddings, Birthdays, Anniversaries, Pooja, and baby showers.' },
          { title: 'Formats for All Mediums', desc: 'Stunning Video invites, printable PDF invites, premium stationery, and wedding websites.' },
          { title: 'Fully Personalized Service', desc: 'Collaborate with our designers to customize color palettes, layouts, and guest logs.' }
        ]}
        visualPosition="left"
        badgeText="Exquisite Collection"
        footerText="Find your perfect theme in our catalog"
        image1Index={image1Index}
        image2Index={image2Index}
        image3Index={image3Index}
        image4Index={image4Index}
      />

      {/* Service 2: Video Invitations */}
      <StaggeredSection
        enabled={videoInvitesBlock?.enabled !== false}
        title={videoInvitesBlock?.title || 'Video Invitations'}
        body={videoInvitesBlock?.subtitle || 'Stunning animated invites that captivate your guests and tell your love story in cinematic motion.'}
        ctaText={videoInvitesBlock?.ctaText || 'Explore Video Invites'}
        ctaLink={videoInvitesBlock?.ctaLink || '/explore'}
        images={videoInvitesBlock?.images}
        defaultImages={DEFAULT_VIDEO_IMAGES}
        features={[
          { title: 'Cinematic Visuals & Music', desc: 'Engage guests with custom animations, background music, and photographs.' },
          { title: 'High-Definition Playback', desc: 'Optimized for smooth viewing on smartphones, WhatsApp, and large screens.' },
          { title: 'Quick Turnaround', desc: 'Receive your customized high-definition animated invitation within 3-5 days.' }
        ]}
        visualPosition="right"
        badgeText="Animated E-Invites"
        footerText="Starting from ₹1,499 onwards"
        image1Index={image1Index}
        image2Index={image2Index}
        image3Index={image3Index}
        image4Index={image4Index}
      />

      {/* Service 3: Event Websites */}
      <StaggeredSection
        enabled={eventWebsitesBlock?.enabled !== false}
        title={eventWebsitesBlock?.title || 'Your Event, Your Website'}
        body={eventWebsitesBlock?.subtitle || 'Create a beautiful personalized website for your celebration to manage RSVPs and share details effortlessly.'}
        ctaText={eventWebsitesBlock?.ctaText || 'Create Website'}
        ctaLink={eventWebsitesBlock?.ctaLink || '/wedding-websites'}
        images={eventWebsitesBlock?.images}
        defaultImages={DEFAULT_WEBSITE_IMAGES}
        features={[
          { title: 'Real-time RSVP Tracking', desc: 'Ditch the spreadsheet and track guest attendance, preferences, and count instantly.' },
          { title: 'Complete Information Hub', desc: 'Centralize travel directions, schedules, dress codes, and gift registries.' },
          { title: 'Post-Event Memory Lane', desc: 'Share official photography galleries and event highlights with your guests.' }
        ]}
        visualPosition="left"
        badgeText="Personalized Portals"
        footerText="Starting from ₹4,999 onwards"
        image1Index={image1Index}
        image2Index={image2Index}
        image3Index={image3Index}
        image4Index={image4Index}
      />

      {/* Service 4: Stationery */}
      <StaggeredSection
        enabled={stationeryBlock?.enabled !== false}
        title={stationeryBlock?.title || 'Premium Stationery'}
        body={stationeryBlock?.subtitle || 'Complete matching print-ready designs for your big day, from menus to thank-you cards and tags.'}
        ctaText={stationeryBlock?.ctaText || 'Order Stationery'}
        ctaLink={stationeryBlock?.ctaLink || '/stationery'}
        images={stationeryBlock?.images}
        defaultImages={DEFAULT_STATIONERY_IMAGES}
        features={[
          { title: 'Perfectly Coordinated Themes', desc: 'Match your table menus, welcome signs, and luggage tags to your invitations.' },
          { title: 'High-Resolution Files', desc: 'Get print-ready assets tailored for high-end digital or offset printing.' },
          { title: 'Custom Formatting & Fonts', desc: 'Ensure consistent brand typography and accents across every guest touchpoint.' }
        ]}
        visualPosition="right"
        badgeText="Celebrate in Style"
        footerText="Starting from ₹50 per piece"
        image1Index={image1Index}
        image2Index={image2Index}
        image3Index={image3Index}
        image4Index={image4Index}
      />

      {/* Service 5: Printed Luxury Invites */}
      <StaggeredSection
        enabled={printedBlock?.enabled !== false}
        title={printedBlock?.title || 'Printed Luxury Invites'}
        body={printedBlock?.body || 'Experience the finest craftsmanship with our premium printed wedding invitations. Each piece is meticulously designed with luxurious materials, exquisite finishes, and attention to detail that makes your invitation unforgettable.'}
        ctaText={printedBlock?.ctaText || 'Explore Collection'}
        ctaLink={printedBlock?.ctaLink || '/explore'}
        secondaryCtaText="Request Samples"
        secondaryCtaLink="/contact"
        images={printedBlock?.images}
        defaultImages={DEFAULT_PRINTED_IMAGES}
        features={[
          { title: 'Luxury Materials', desc: 'Premium paper stocks, silk fabrics, acrylic, wood, and metal finishes' },
          { title: 'Artisanal Finishing', desc: 'Gold foil, embossing, laser cutting, and hand-tied ribbons' },
          { title: 'Bespoke Design', desc: 'Fully customizable designs tailored to your unique vision' }
        ]}
        visualPosition="left"
        badgeText="Premium Collection"
        footerText="Starting from ₹50 per piece • Minimum order: 50 pieces"
        image1Index={image1Index}
        image2Index={image2Index}
        image3Index={image3Index}
        image4Index={image4Index}
      />

      {/* Categories Section - Bento Box Style */}
      {categoriesBlock?.enabled !== false && (
        <section className="py-24 bg-card relative overflow-hidden">
          <MandalaDecor className="absolute top-10 right-10 w-64 h-64 text-primary opacity-30 animate-rotate-slow" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl mb-4">{categoriesBlock?.title || 'Browse by Occasion'}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {categoriesBlock?.subtitle || 'Curated designs for every celebration in your life'}
              </p>
            </div>

            {/* Balanced Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {categories.map((category, index) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className={`group relative overflow-hidden rounded-3xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                    index === 0 ? 'animate-fade-in-scale' : ''
                  }`}
                >
                  <div className="aspect-[4/3] relative">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="text-5xl mb-3">{category.icon}</div>
                      <h3 className="text-3xl text-white mb-2">{category.name}</h3>
                      {index === 0 && (
                        <p className="text-white/80 text-sm mb-3">Beautiful designs for your special day</p>
                      )}
                      <div className="inline-flex items-center gap-2 text-white text-sm group-hover:gap-3 transition-all">
                        <span>{index === 0 ? 'Explore Designs' : 'View All'}</span>
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
      {productCarouselSection?.enabled !== false && <ProductCarousel />}

      {/* Services Overview */}
      {servicesBlock?.enabled !== false && (
        <section className="py-20 bg-muted relative overflow-hidden">
          {/* Decorative Floral Elements */}
          <MandalaDecor className="absolute top-10 left-10 w-48 h-48 text-primary opacity-30 animate-rotate-slow" />
          <LotusDecor className="absolute bottom-10 right-10 w-40 h-40 text-secondary opacity-35 animate-float" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl mb-4">{servicesBlock?.title || 'Our Services'}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {servicesBlock?.subtitle || 'Complete solutions for all your event invitation and stationery needs'}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {services.map((service, index) => {
                const IconComponent = getServiceIcon(service.iconName);
                return (
                  <Link
                    key={index}
                    to={service.link}
                    className="bg-card p-5 rounded-2xl text-center hover:shadow-lg transition-all hover:scale-105 group border border-transparent hover:border-primary/20"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-base mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{service.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      {howItWorksSection?.enabled !== false && (
        <section className="py-20 relative overflow-hidden">
          {/* Decorative Floral Elements */}
          <LotusDecor className="absolute top-20 right-20 w-44 h-44 text-accent opacity-35 animate-float" />
          <MandalaDecor className="absolute bottom-20 left-16 w-52 h-52 text-primary opacity-30 animate-rotate-slow" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Simple and seamless process to get your perfect invitation
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <span className="text-2xl font-semibold text-primary">{item.step}</span>
                  </div>
                  <h3 className="text-xl mb-3 text-center">{item.title}</h3>
                  <p className="text-muted-foreground text-center">{item.description}</p>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Preview */}
      {testimonialsBlock?.enabled !== false && (
        <section className="py-20 bg-card relative overflow-hidden">
          {/* Decorative Floral Elements */}
          <MandalaDecor className="absolute top-16 left-12 w-48 h-48 text-secondary opacity-30 animate-rotate-slow" />
          <LotusDecor className="absolute bottom-16 right-12 w-36 h-36 text-primary opacity-35 animate-float" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl mb-4">{testimonialsBlock?.title || 'What Our Clients Say'}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {testimonialsBlock?.subtitle || 'Join thousands of happy customers who trusted us with their celebrations'}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch justify-center">
              {(state.testimonials && state.testimonials.length > 0 ? state.testimonials : defaultTestimonials).slice(0, 3).map((t, i) => {
                if (t.videoUrl) {
                  return (
                    <div key={t.id || i} className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg border border-border bg-black group w-full max-w-[320px] mx-auto">
                      <VideoPlayer url={t.videoUrl} />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 text-white pt-16 pointer-events-none">
                        <div className="flex gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star < t.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-500'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="font-semibold text-white mb-0.5">{t.name}</p>
                        <p className="text-xs text-white/80">
                          {t.event} • {t.date || 'Review'}
                        </p>
                        {(t.comment || (t as any).text) && (
                          <p className="text-xs text-white/70 mt-1.5 line-clamp-2 italic">
                            "{t.comment || (t as any).text}"
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={t.id || i} className="bg-muted p-8 rounded-2xl flex flex-col justify-between w-full max-w-[320px] mx-auto">
                    <div>
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star < t.rating ? 'fill-primary text-primary' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        "{t.comment || (t as any).text}"
                      </p>
                    </div>
                    <p className="font-semibold mt-4">- {t.name} {t.event ? `(${t.event})` : ''}</p>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/testimonials"
                className="text-primary hover:underline inline-flex items-center gap-2"
              >
                Read All Reviews
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {ctaSection?.enabled !== false && (
        <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
          {/* Decorative Elephant */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 md:w-40 md:h-40 opacity-20 animate-float">
            <img src={elephantDecor} alt="" className="w-full h-full object-contain" />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl mb-6">Ready to Create Your Perfect Invitation?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Let's create something beautiful for your celebration
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/explore"
                className="px-8 py-4 bg-secondary text-primary-foreground rounded-full hover:bg-secondary/90 transition-colors btn-shimmer"
              >
                Explore Designs
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-transparent border-2 border-primary-foreground rounded-full hover:bg-primary-foreground/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
      <section className="py-24 bg-gradient-to-b from-[#faf8f5] to-white relative overflow-hidden border-t border-gray-100">
        {/* Decorative elements */}
        <MandalaDecor className="absolute top-10 right-10 w-48 h-48 text-primary opacity-20 animate-rotate-slow" />
        <LotusDecor className="absolute bottom-10 left-10 w-40 h-40 text-secondary opacity-25 animate-float" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              ✦ Inspiration & Trends
            </span>
            <h2 className="text-4xl md:text-5xl text-[#1a1410] mb-4">Latest from Our Blog</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tips, trends, and inspiration for planning your dream invitations and stationery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 hover:-translate-y-2 flex flex-col"
              >
                {/* Image Container */}
                <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold tracking-wide uppercase rounded-full shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-3 select-none">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-5">
                    {post.description}
                  </p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-xs font-bold tracking-wider uppercase text-primary inline-flex items-center gap-1.5 mt-auto group-hover:gap-2.5 transition-all w-max"
                  >
                    Read Article <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}