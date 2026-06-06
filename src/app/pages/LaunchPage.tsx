import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { useAdmin } from '../admin/context/AdminContext';
import { 
  CheckCircle, Sparkles, Video, Play, ChevronDown, 
  ArrowRight, X, MessageSquare, ShieldCheck, ArrowLeft 
} from 'lucide-react';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';

export default function LaunchPage() {
  const { slug } = useParams();
  const { state } = useAdmin();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Find the campaign matching the slug
  const campaign = state.campaigns.find(c => c.slug === slug);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-6 text-center" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6">
          <X size={32} />
        </div>
        <h1 className="text-3xl font-black text-[#1a1410] mb-2">Launch Page Not Found</h1>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          The campaign link you followed doesn't exist or has been deactivated.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B4949] text-white font-bold rounded-full text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <ArrowLeft size={16} />
          Back to Homepage
        </Link>
      </div>
    );
  }

  // Set up dynamic color variables
  const accentColor = campaign.accentColor || '#8B4949';
  const styleVariables = {
    '--accent-color': accentColor,
    '--accent-bg': `${accentColor}12`, // 7% opacity for bg highlights
    '--accent-border': `${accentColor}33` // 20% opacity for borders
  } as React.CSSProperties;

  // Retrieve contact details for checkout
  const whatsappNumber = state.settings?.contact?.whatsapp || '919876543210';

  // Theme configuration details
  const themeStyles = {
    Royal: {
      wrapperClass: 'bg-[#faf6f0] text-[#1a1410]',
      fontFamily: "'Playfair Display', 'Georgia', serif",
      heroBg: 'bg-gradient-to-b from-[#faf6f0] via-[#f5ede0] to-[#faf6f0]',
      cardClass: 'bg-white border border-[#ebdcc8] shadow-sm',
      decor: <LotusDecor className="absolute top-10 right-10 w-44 h-44 text-[#D4AF37]/20 animate-float pointer-events-none" />
    },
    Modern: {
      wrapperClass: 'bg-[#f8fafc] text-[#0f172a]',
      fontFamily: "'Inter', sans-serif",
      heroBg: 'bg-gradient-to-b from-[#f8fafc] via-[#e2e8f0] to-[#f8fafc]',
      cardClass: 'bg-white border border-[#e2e8f0] shadow-sm rounded-3xl',
      decor: <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-tr from-[#6366F1]/10 to-[#8B4949]/10 rounded-full blur-2xl animate-pulse pointer-events-none" />
    },
    Minimalist: {
      wrapperClass: 'bg-white text-[#18181b]',
      fontFamily: "'Outfit', sans-serif",
      heroBg: 'bg-gradient-to-b from-white via-[#f4f4f5] to-white',
      cardClass: 'bg-white border border-gray-100 shadow-sm rounded-xl',
      decor: null
    },
    Floral: {
      wrapperClass: 'bg-[#fff9fa] text-[#2d1e21]',
      fontFamily: "'Bricolage Grotesque', sans-serif",
      heroBg: 'bg-gradient-to-b from-[#fff9fa] via-[#ffeef1] to-[#fff9fa]',
      cardClass: 'bg-white border border-[#ffd1d9] shadow-sm rounded-2xl',
      decor: <MandalaDecor className="absolute top-12 right-12 w-48 h-48 text-[#E8704A]/10 animate-rotate-slow pointer-events-none" />
    }
  }[campaign.theme] || {
    wrapperClass: 'bg-[#faf8f5] text-[#1a1410]',
    fontFamily: "'Inter', sans-serif",
    heroBg: 'bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5]',
    cardClass: 'bg-white border border-[#f0ece4] shadow-sm',
    decor: null
  };

  const handleCheckout = (pkgName: string) => {
    const text = `Hi Eventique! I am interested in ordering the "${campaign.productName}" launch package: "${pkgName}". Please share customization process and timelines.`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      style={{ ...styleVariables, fontFamily: themeStyles.fontFamily }} 
      className={`min-h-screen ${themeStyles.wrapperClass} overflow-x-hidden relative`}
    >
      {/* Decorative background vectors */}
      {themeStyles.decor}
      
      {/* Hero Banner Section */}
      <section className={`py-20 md:py-32 relative overflow-hidden ${themeStyles.heroBg}`}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Hero text */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--accent-bg)] border border-[var(--accent-border)]" style={{ color: 'var(--accent-color)' }}>
              <Sparkles size={14} className="animate-pulse" />
              Special Launch Collection
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {campaign.heroTitle}{' '}
              <span style={{ color: 'var(--accent-color)' }} className="italic font-serif">
                {campaign.productName}
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-500 leading-relaxed font-light">
              {campaign.heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#pricing"
                className="px-8 py-4 text-white font-bold rounded-full text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                View Pricing Packages
                <ArrowRight size={16} />
              </a>
              <a 
                href="#gallery"
                className="px-8 py-4 bg-white text-gray-700 font-bold rounded-full text-sm border border-gray-200 hover:bg-gray-50 hover:shadow-md hover:scale-105 transition-all inline-flex items-center"
              >
                Browse Designs
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative flex justify-center animate-fade-in-scale">
            <div className="absolute inset-0 bg-[var(--accent-color)]/5 rounded-3xl blur-3xl opacity-60"></div>
            <div className="relative w-full max-w-[460px] aspect-[4/3] md:aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-[#faf8f5]">
              <img 
                src={campaign.heroImage} 
                alt={campaign.productName} 
                className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700" 
              />
            </div>
          </div>

        </div>
      </section>

      {/* Features Grid Section */}
      {campaign.features && campaign.features.length > 0 && (
        <section className="py-20 max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Highlight Features</h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Crafted to perfection with premium details</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {campaign.features.map((feat, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-2xl transition-all hover:scale-[1.02] shadow-sm ${themeStyles.cardClass}`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 border" style={{ backgroundColor: 'var(--accent-bg)', borderColor: 'var(--accent-border)', color: 'var(--accent-color)' }}>
                  <CheckCircle size={18} />
                </div>
                <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-light">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Video Showcase Section (Optional) */}
      {campaign.videoUrl && (
        <section className="py-16 bg-black/5 border-y border-black/5 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tight">Watch Video Invite Showcase</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Experience the cinematic motion graphics, traditional Vedic chants, and gorgeous typography transitions.
            </p>
            
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10 max-w-2xl mx-auto group">
              {isVideoPlaying ? (
                <video 
                  src={campaign.videoUrl} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <>
                  <img 
                    src={campaign.heroImage} 
                    alt="Video Preview Placeholder" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-[1.02] transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => setIsVideoPlaying(true)}
                      className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer group-hover:bg-[var(--accent-color)] group-hover:text-white"
                      title="Play Preview Video"
                    >
                      <Play size={24} className="ml-1" fill="currentColor" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Bento Image Gallery Section */}
      {campaign.gallery && campaign.gallery.length > 0 && (
        <section id="gallery" className="py-20 max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Bento Gallery Preview</h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Click any image to view details</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {campaign.gallery.map((url, idx) => {
              // Create bento-like layout heights/widths dynamically based on index
              const isLarge = idx === 0 || idx === 3;
              return (
                <div 
                  key={idx}
                  onClick={() => setLightboxImage(url)}
                  className={`group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-md cursor-pointer border border-[#e5e5e5]/40 aspect-square ${
                    isLarge ? 'md:col-span-2 md:row-span-1' : ''
                  }`}
                >
                  <img 
                    src={url} 
                    alt={`Gallery preview ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-semibold px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full">
                      View Fullscreen
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Pricing Packages Section */}
      {campaign.pricingPackages && campaign.pricingPackages.length > 0 && (
        <section id="pricing" className="py-20 bg-black/5 border-t border-black/5 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Pricing & Package Suites</h2>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Select a customized tier tailored for you</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {campaign.pricingPackages.map((pkg, idx) => {
                const isPopular = idx === 1; // Mark the second package as popular/regal suite
                return (
                  <div 
                    key={idx}
                    className={`p-8 rounded-3xl relative overflow-hidden transition-all hover:scale-[1.02] flex flex-col justify-between ${
                      isPopular 
                        ? 'border-2 border-[var(--accent-color)] shadow-xl' 
                        : 'border border-[#e5e5e5] shadow-sm'
                    } bg-white`}
                  >
                    {isPopular && (
                      <div className="absolute top-4 right-4 bg-[var(--accent-color)] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                        Recommended
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-xl font-bold text-[#1a1410] mb-2">{pkg.name}</h3>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-black text-[#1a1410]">₹{pkg.price.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-gray-400 font-medium">Flat Fee</span>
                      </div>

                      <ul className="space-y-3.5 mb-8">
                        {pkg.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-sm font-medium text-gray-600">
                            <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      onClick={() => handleCheckout(pkg.name)}
                      className="w-full py-4 text-white font-bold rounded-2xl text-xs hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      style={{ backgroundColor: isPopular ? 'var(--accent-color)' : '#1a1410' }}
                    >
                      <MessageSquare size={14} />
                      Order via WhatsApp
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Accordion FAQs Section */}
      {campaign.faqs && campaign.faqs.length > 0 && (
        <section className="py-20 max-w-3xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Everything you need to know about this campaign launch</p>
          </div>

          <div className="space-y-4">
            {campaign.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-[#e5e5e5] rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button 
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left font-bold text-sm text-[#1a1410] flex justify-between items-center cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown 
                      size={18} 
                      className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--accent-color)]' : ''}`} 
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-0.5 text-xs text-gray-500 leading-relaxed font-light border-t border-gray-50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Trust Badge Footer */}
      <section className="py-12 bg-white border-t border-gray-100 relative z-10 text-center">
        <div className="max-w-md mx-auto px-6 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <ShieldCheck size={16} className="text-green-500" />
            100% Satisfaction Guarantee
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            All designs are fully customizable in close consultation with our professional designers. Revisions are completed within 24 hours of requests.
          </p>
          <div className="pt-2 text-[10px] text-gray-300 font-semibold uppercase tracking-widest">
            Eventique Studios • All Rights Reserved
          </div>
        </div>
      </section>

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center"
            title="Close details"
          >
            <X size={20} />
          </button>
          <img 
            src={lightboxImage} 
            alt="Lightbox view" 
            className="max-w-full max-h-full rounded-lg shadow-2xl object-contain animate-fade-in-scale" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}
