import { useState, type ComponentType } from 'react';
import { Link } from 'react-router';
import { 
  Check, 
  Globe, 
  Heart, 
  MapPin, 
  Users, 
  Calendar, 
  Image as ImageIcon, 
  Music, 
  Gift, 
  Star, 
  ArrowRight, 
  Eye, 
  X, 
  MessageCircle, 
  Mail,
  ShieldCheck,
  Zap,
  Code,
  Laptop,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  QrCode,
  FileSpreadsheet
} from 'lucide-react';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface FeatureItem {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface WebSection {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: FeatureItem[];
  image: string;
  demoUrl: string;
}

const PERSONAL_SITES: WebSection[] = [
  {
    id: 'wedding',
    title: 'Wedding Websites',
    tagline: 'Relive Your Love Story, Beautifully Shared',
    description: 'A dedicated hub for your big day. Share engagement stories, introduce the bridal party, map out multi-day venues, and manage RSVPs seamlessly.',
    features: [
      { icon: Heart, title: 'Our Love Story', description: 'Interactive visual timelines of your journey together' },
      { icon: Calendar, title: 'Multi-Event Schedule', description: 'List dates, timings, dress codes, and details' },
      { icon: MapPin, title: 'Venue Maps', description: 'Google Maps directions for out-of-town guests' },
      { icon: Users, title: 'Interactive RSVPs', description: 'Track numbers, meal preferences, and arrivals' },
      { icon: ImageIcon, title: 'Photo Galleries', description: 'High-res portfolios of pre-wedding shoot highlights' }
    ],
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&fit=crop',
    demoUrl: 'https://demo.eventique.in/wedding-luxury'
  },
  {
    id: 'engagement',
    title: 'Engagement Websites',
    tagline: 'Announce Your Engagement digitally',
    description: 'Keep friends and family excited with simple, high-impact engagement cards hosting photo shoots and instant RSVP collections.',
    features: [
      { icon: Star, title: 'Countdown Timer', description: 'Build excitement for the ring ceremony date' },
      { icon: ImageIcon, title: 'Engagement Shoot', description: 'Highlight photo grids in premium style' },
      { icon: Users, title: 'Quick RSVPs', description: 'Fast confirmatory actions for invitees' }
    ],
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&fit=crop',
    demoUrl: 'https://demo.eventique.in/engagement-modern'
  },
  {
    id: 'anniversary',
    title: 'Anniversary Websites',
    tagline: 'Celebrating Milestones of Love',
    description: 'Honor milestones, silver, or golden anniversaries by sharing life timelines, family trees, and event details.',
    features: [
      { icon: Heart, title: 'Timeline & Legacy', description: 'Document milestones and highlights over the years' },
      { icon: Users, title: 'Guest message books', description: 'Let family record congratulations online' },
      { icon: MapPin, title: 'Celebration Venues', description: 'Directions for dinner receptions' }
    ],
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&fit=crop',
    demoUrl: 'https://demo.eventique.in/anniversary-classic'
  },
  {
    id: 'birthday',
    title: 'Birthday Websites',
    tagline: 'Vibrant Party Hubs',
    description: 'Perfect for milestone 18th, 25th, or 50th celebrations. Share event dress codes, themes, gift registries, and countdowns.',
    features: [
      { icon: Gift, title: 'Gift Registries', description: 'Link list of desired gift options easily' },
      { icon: Star, title: 'Theme Showcase', description: 'Style layouts to reflect party themes' },
      { icon: Calendar, title: 'Timing & Details', description: 'Keep location, party rules, and timings clear' }
    ],
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&fit=crop',
    demoUrl: 'https://demo.eventique.in/birthday-party'
  },
  {
    id: 'baby-shower',
    title: 'Baby Shower Websites',
    tagline: 'Welcoming Your Newest Addition',
    description: 'Delicate baby shower websites featuring gift registries, baby bump timelines, gender reveal options, and baby registry integrations.',
    features: [
      { icon: Gift, title: 'Baby registries', description: 'Help guest pick baby essentials' },
      { icon: Heart, title: 'Mommy Timeline', description: 'Bump photos, ultrasound logs, and stories' },
      { icon: Users, title: 'RSVPs', description: 'Collect confirmations and guest counts' }
    ],
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&fit=crop',
    demoUrl: 'https://demo.eventique.in/baby-shower'
  }
];

const CORPORATE_SITES: WebSection[] = [
  {
    id: 'microsites',
    title: 'Event Microsites',
    tagline: 'High-Performance Landing Pages',
    description: 'Clean, focused event microsites designed for internal team town halls, product releases, annual corporate days, or executive summits.',
    features: [
      { icon: Laptop, title: 'B2B Responsive Designs', description: 'Optimized for company firewalls and intranet access' },
      { icon: Code, title: 'Brand Compliance', description: 'Align layouts with organization guidelines' },
      { icon: Zap, title: 'Agenda Portals', description: 'Modular timelines for panels, speakers, and Q&A' }
    ],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&fit=crop',
    demoUrl: 'https://demo.eventique.in/corporate-microsite'
  },
  {
    id: 'conference',
    title: 'Conference Websites',
    tagline: 'Multi-Track Agenda Frameworks',
    description: 'Robust websites for summits and conferences with calendar tracks, speaker profile directories, sponsor grids, and venue maps.',
    features: [
      { icon: Calendar, title: 'Multi-Track Timelines', description: 'Display concurrent sessions with filter options' },
      { icon: Users, title: 'Speaker Directories', description: 'Profile bios, photo lists, and social linkages' },
      { icon: Globe, title: 'Sponsor Branded Grids', description: 'Feature sponsors, logos, and links cleanly' }
    ],
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&fit=crop',
    demoUrl: 'https://demo.eventique.in/tech-conference'
  },
  {
    id: 'summit',
    title: 'Summit Websites',
    tagline: 'Executive VIP Platforms',
    description: 'Premium layouts tailored for executive leadership summits, featuring password-protected credential logins and document download centers.',
    features: [
      { icon: ShieldCheck, title: 'Secure Login Credential', description: 'Password protection for exclusive attendee circles' },
      { icon: FileText, title: 'Executive Portfolios', description: 'Download centers for slide decks and PDF manuals' },
      { icon: Laptop, title: 'Live Streaming Feed', description: 'Secure video player frames for remote participants' }
    ],
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&fit=crop',
    demoUrl: 'https://demo.eventique.in/leadership-summit'
  },
  {
    id: 'registration',
    title: 'Registration Websites',
    tagline: 'Conversion-Focused Ticketing',
    description: 'Seamless registration software collecting visitor info, sending instant QR badges via email, and tracking numbers on live charts.',
    features: [
      { icon: QrCode, title: 'QR Ticketing Engines', description: 'Instant PDF tickets generated with validation keys' },
      { icon: FileSpreadsheet, title: 'Data Dashboards', description: 'Sync registries instantly to secure databases' },
      { icon: Mail, title: 'Auto Confirmation', description: 'Instant ticket confirm loops via mail and SMS' }
    ],
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&fit=crop',
    demoUrl: 'https://demo.eventique.in/registration-engine'
  }
];

const FAQS = [
  {
    question: "Do you support custom domains?",
    answer: "Yes. All personal and corporate websites can be connected to your custom domain (e.g. www.amitandsneha.com or summit.yourcompany.com)."
  },
  {
    question: "Are attendee registrations secure?",
    answer: "Absolutely. All B2B and B2C websites use secure SSL encryption, and guest/attendee registration data is stored in databases complying with standard privacy controls."
  },
  {
    question: "How long does a website take to build?",
    answer: "Personal celebrations and standard landing pages take 1-2 weeks. Complex B2B registration engines or multi-track conference portals take 3-4 weeks."
  },
  {
    question: "Can we add video and audio elements?",
    answer: "Yes, you can embed video greetings, YouTube/Vimeo streams, background music tracks, countdown timers, and interactive Google maps."
  }
];

export default function EventWebsites() {
  const [activeCategory, setActiveCategory] = useState<'personal' | 'corporate'>('personal');
  const [activeSection, setActiveSection] = useState<string>('wedding');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [demoItem, setDemoItem] = useState<WebSection | null>(null);

  const sectionsList = activeCategory === 'personal' ? PERSONAL_SITES : CORPORATE_SITES;
  const currentSection = sectionsList.find(s => s.id === activeSection) || sectionsList[0];

  const handleCategoryChange = (cat: 'personal' | 'corporate') => {
    setActiveCategory(cat);
    setActiveSection(cat === 'personal' ? 'wedding' : 'microsites');
  };

  const scrollToContact = () => {
    const contactEl = document.getElementById('websites-quote-cta');
    if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#faf8f5] text-slate-800 min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative bg-white pt-24 pb-20 md:py-32 border-b border-slate-100 overflow-hidden">
        {/* Subtle geometric grid line backdrop */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold uppercase tracking-wider border border-slate-200">
                <Globe className="w-3.5 h-3.5 text-primary" />
                Custom Event Websites
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Beautiful Websites <br />
                For Any Celebration
              </h1>
              <p className="text-lg text-slate-600 font-light leading-relaxed max-w-xl">
                Relive memories, share schedules, and collect attendee RSVPs with custom event websites built to fit your celebration or corporate summit perfectly.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={scrollToContact}
                  className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary/95 transition-all hover:scale-105 inline-flex items-center gap-2 shadow-lg shadow-primary/10 cursor-pointer"
                >
                  Get Custom Quote
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('portfolio');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold hover:bg-slate-50 transition-all hover:scale-105 cursor-pointer"
                >
                  Explore Portfolio
                </button>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/5 rounded-[4rem] blur-3xl opacity-60" />
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-3 shadow-2xl max-w-[280px] w-full z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-slate-900 rounded-b-2xl z-10" />
                <div className="bg-white rounded-[1.8rem] overflow-hidden aspect-[9/16]">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800"
                    alt="Responsive mobile event website mockup"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO & FILTER */}
      <section className="py-24 bg-white border-b border-slate-100" id="portfolio">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Explore Website Previews
            </h2>
            <p className="text-slate-500 font-light">
              Toggle between personal events and corporate events to view our portfolios.
            </p>
          </div>

          {/* Main category toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-slate-100 rounded-full p-1.5 flex gap-1 border border-slate-200">
              <button
                onClick={() => handleCategoryChange('personal')}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeCategory === 'personal'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Personal Celebrations
              </button>
              <button
                onClick={() => handleCategoryChange('corporate')}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeCategory === 'corporate'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Corporate Events
              </button>
            </div>
          </div>

          {/* Sub-section tab buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {sectionsList.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeSection === sec.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>

          {/* Display active section details */}
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200/60 max-w-6xl mx-auto shadow-sm">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Info panel */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-primary uppercase tracking-widest block font-mono">
                    {activeCategory === 'personal' ? 'Personal Event Website' : 'Corporate Event Tech'}
                  </span>
                  <h3 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                    {currentSection.title}
                  </h3>
                  <p className="text-md text-slate-600 italic font-light">{currentSection.tagline}</p>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed font-light">
                  {currentSection.description}
                </p>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Features Included:</h4>
                  {currentSection.features.map((feat, i) => {
                    const Icon = feat.icon;
                    return (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-primary">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800 leading-tight">{feat.title}</div>
                          <div className="text-xs text-slate-400 font-light">{feat.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <button
                    onClick={() => setDemoItem(currentSection)}
                    className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/95 hover:scale-105 transition-all shadow-md text-sm cursor-pointer"
                  >
                    View Mockup Preview
                  </button>
                  <button
                    onClick={scrollToContact}
                    className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold hover:bg-slate-50 hover:scale-105 transition-all shadow-sm text-sm cursor-pointer"
                  >
                    Request custom quote
                  </button>
                </div>
              </div>

              {/* Mockup Showcase */}
              <div className="relative">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-3 shadow-2xl mx-auto max-w-[280px]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-slate-900 rounded-b-2xl z-10" />
                  <div className="bg-white rounded-[1.8rem] overflow-hidden aspect-[9/16] relative group">
                    <ImageWithFallback
                      src={currentSection.image}
                      alt={`${currentSection.title} mockup`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="px-4 py-2 bg-white text-slate-900 rounded-full text-xs font-semibold shadow-md">Click View Preview button</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="py-24 bg-[#faf8f5] border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Our Simple Process
            </h2>
            <p className="text-slate-500 font-light">
              From ideation to deployment, we build tailored event experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Creative Briefing', desc: 'We capture your celebration visual themes or company brand guidelines.' },
              { step: '02', title: 'Custom Mockup', desc: 'Our design studio drafts layouts, color palettes, and interactive templates.' },
              { step: '03', title: 'Coding & Sync', desc: 'We build the code, hook registration dashboards, and link custom domains.' },
              { step: '04', title: 'Launch & Support', desc: 'We verify responsiveness, go live, and maintain real-time RSVP databases.' }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white border border-slate-100 rounded-2xl relative shadow-sm space-y-4">
                <span className="text-4xl font-extrabold text-primary/10 font-mono tracking-widest block">{item.step}</span>
                <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Websites FAQ
            </h2>
            <p className="text-slate-500 font-light">
              Common questions about our digital event websites and microsites.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-slate-450" /> : <ChevronDown className="w-5 h-5 text-slate-450" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-slate-500 leading-relaxed font-light border-t border-slate-100 animate-in fade-in duration-300">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LEAD GENERATION CTA / FORM */}
      <section id="websites-quote-cta" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="container mx-auto px-4 max-w-2xl text-center relative z-10 space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Ready for a Custom Website?
          </h2>
          <p className="text-md text-slate-400 font-light leading-relaxed max-w-md mx-auto">
            Share your event date and design parameters. We'll outline features and send a custom quote within 24 hours.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              to="/contact"
              className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary/95 transition-all hover:scale-105 inline-flex items-center gap-2 shadow-lg"
            >
              Get Custom Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

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
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-10 flex items-center justify-center min-h-[400px]">
                <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-[2.8rem] p-3 shadow-2xl w-[220px]">
                  <div className="bg-white rounded-[2.2rem] overflow-hidden aspect-[9/16]">
                    <ImageWithFallback
                      src={demoItem.image}
                      alt={demoItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="p-8 relative flex flex-col justify-between">
                <button
                  onClick={() => setDemoItem(null)}
                  className="absolute top-4 right-4 w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
                <div className="space-y-4">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest block font-mono">{demoItem.category} Design</span>
                  <h2 className="text-2xl font-bold text-slate-950">{demoItem.title}</h2>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">{demoItem.description}</p>
                  
                  <div className="space-y-2 pt-2">
                    {demoItem.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="text-xs font-semibold text-slate-700">{f.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-8 space-y-2">
                  <button
                    onClick={() => {
                      setDemoItem(null);
                      scrollToContact();
                    }}
                    className="w-full py-3 bg-primary text-white rounded-full text-center font-semibold text-xs hover:bg-primary/95 transition-colors cursor-pointer"
                  >
                    Request Custom Quote
                  </button>
                  <button
                    onClick={() => setDemoItem(null)}
                    className="w-full py-3 bg-slate-100 text-slate-700 rounded-full text-center font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
