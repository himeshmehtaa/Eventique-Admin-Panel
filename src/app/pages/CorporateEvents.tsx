import { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Monitor, 
  QrCode, 
  FileText, 
  Globe, 
  Award, 
  Users, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  Clock, 
  Zap, 
  MessageSquare,
  Layout,
  Briefcase,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const SERVICES = [
  {
    number: '01',
    icon: Monitor,
    title: 'Event Microsites',
    description: 'Custom, high-conversion landing pages designed specifically for your event to showcase agenda, speakers, and venue details.'
  },
  {
    number: '02',
    icon: FileSpreadsheet,
    title: 'Event Registration Systems',
    description: 'Secure, seamless registration flows with custom forms, payment gateways, and instant digital badge generation.'
  },
  {
    number: '03',
    icon: FileText,
    title: 'Digital Invitations',
    description: 'Premium, personalized email and HTML invitations designed to reflect your brand identity and drive RSVPs.'
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'RSVP Management',
    description: 'Complete guest list tracking, automated confirmations, reminder sequences, and real-time dashboard analytics.'
  },
  {
    number: '05',
    icon: Briefcase,
    title: 'Event Branding',
    description: 'Cohesive visual identity design including event logos, customized color palettes, and theme design guidelines.'
  },
  {
    number: '06',
    icon: Layout,
    title: 'Event Collateral Design',
    description: 'Print-ready designs for corporate badges, lanyards, pull-up standees, backdrop backdrops, and brochures.'
  },
  {
    number: '07',
    icon: Sparkles,
    title: 'Presentation Design',
    description: 'Professional Keynote, PowerPoint, and Google Slides designs for keynote speakers and executive presenters.'
  },
  {
    number: '08',
    icon: MessageSquare,
    title: 'Event Communication Design',
    description: 'Structured email newsletters, SMS updates, and WhatsApp notifications to keep attendees informed.'
  },
  {
    number: '09',
    icon: QrCode,
    title: 'QR Check-in Experiences',
    description: 'Fast, contactless on-site check-in using unique QR codes scanned via mobile devices with instant registration validation.'
  },
  {
    number: '10',
    icon: Globe,
    title: 'Conference & Summit Websites',
    description: 'High-performance multi-page websites featuring interactive schedules, speaker bios, and sponsor directories.'
  },
  {
    number: '11',
    icon: Award,
    title: 'Feedback & Survey Experiences',
    description: 'Post-event surveys and interactive feedback widgets to capture valuable attendee insights and generate reports.'
  }
];

const GALLERY_CATEGORIES = [
  'All',
  'Town Halls',
  'Annual Days',
  'Family Days',
  'Leadership Summits',
  'Product Launches',
  'Sales Kickoffs',
  'Conferences',
  'Training Programs',
  'Hackathons',
  'Award Ceremonies'
];

const GALLERY_ITEMS = [
  {
    category: 'Town Halls',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&fit=crop',
    title: 'Executive Town Hall Meeting',
    description: 'Q&A session with clean corporate branding and digital backdrop visuals.'
  },
  {
    category: 'Annual Days',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&fit=crop',
    title: 'Gala Dinner & Annual Day',
    description: 'Bespoke event themes, digital entry tickets, and print collaterals.'
  },
  {
    category: 'Family Days',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&fit=crop',
    title: 'Corporate Family Day Festival',
    description: 'Interactive microsites, digital badges, and outdoor venue print guides.'
  },
  {
    category: 'Leadership Summits',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&fit=crop',
    title: 'Global Leadership Summit',
    description: 'Seamless registration flow, custom agenda planners, and premium executive kits.'
  },
  {
    category: 'Product Launches',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&fit=crop',
    title: 'New Product Launch Event',
    description: 'Teaser event microsites, RSVP tracking, and high-impact stage graphics.'
  },
  {
    category: 'Sales Kickoffs',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&fit=crop',
    title: 'National Sales Kickoff Meet',
    description: 'Audience engagement polls, leaderboard dashboards, and event lanyards.'
  },
  {
    category: 'Conferences',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&fit=crop',
    title: 'Annual Tech & Business Conference',
    description: 'Session schedules, speaker profile directories, and live venue map interfaces.'
  },
  {
    category: 'Training Programs',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&fit=crop',
    title: 'Enterprise Skills Training',
    description: 'Interactive manuals, speaker slide design, and feedback dashboards.'
  },
  {
    category: 'Hackathons',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&fit=crop',
    title: 'Annual Developer Hackathon',
    description: 'RSVP portals, project submission forms, and digital certificates.'
  },
  {
    category: 'Award Ceremonies',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&fit=crop',
    title: 'Corporate Excellence Awards',
    description: 'Entrance branding design, printed invitation boxes, and presenter slides.'
  }
];

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: 'Event-Focused Expertise',
    description: 'We specialize in corporate events and digital experiences, understanding the unique security and scaling needs of enterprise organizations.'
  },
  {
    icon: Zap,
    title: 'UI/UX Driven Experiences',
    description: 'Clean, modern, and intuitive user interfaces designed to maximize registrations, ease check-in, and elevate attendee satisfaction.'
  },
  {
    icon: Clock,
    title: 'Fast Turnaround',
    description: 'Agile design workflows and battle-tested codebases ensure your microsites, ticket engines, and brand assets are delivered ahead of schedule.'
  },
  {
    icon: Users,
    title: 'End-to-End Event Design',
    description: 'From virtual registration portals to on-site print-ready badges, stage graphics, and surveys, we handle every touchpoint cohesively.'
  }
];

const TESTIMONIALS = [
  {
    quote: "Eventique transformed our annual summit experience. The registration system was seamless, and the custom event branding received praise from all our executives.",
    name: "Rahul Mehta",
    company: "TechCorp",
    designation: "VP of Marketing"
  },
  {
    quote: "The event microsite and live QR check-in designed by Eventique made our product launch town hall run flawlessly. Extremely professional and detail-oriented team.",
    name: "Aishwarya Sen",
    company: "InnovateHQ",
    designation: "Chief of Staff"
  },
  {
    quote: "Working with Eventique for our corporate Annual Day was fantastic. They designed everything from digital invites to on-site check-in portals seamlessly.",
    name: "Vikram Malhotra",
    company: "GlobalFinance",
    designation: "Head of Human Resources"
  }
];

const FAQS = [
  {
    question: "What types of corporate events do you support?",
    answer: "We support a wide range of corporate events, including town halls, leadership summits, annual corporate days, family days, product launches, sales kickoffs, conferences, training programs, hackathons, and award ceremonies. Our designs are tailored to fit your enterprise brand guidelines."
  },
  {
    question: "Do you provide event microsites and registration systems?",
    answer: "Yes, we design and build custom event microsites, RSVP tracking systems, and secure registration flows. We generate unique QR codes for tickets, support automated confirmation emails, and build dashboards for guest list management."
  },
  {
    question: "Can you design event branding and event collateral?",
    answer: "Absolutely. We offer complete visual identity design, stage backdrop graphics, standees, pull-up banners, presenter slides (PowerPoint/Keynote), print-ready badge templates, and matching digital newsletters."
  },
  {
    question: "Do you support virtual and hybrid events?",
    answer: "Yes, we design custom virtual event landing pages and embed secure video feeds (Vimeo, YouTube, Zoom, Webex, etc.), interactive agenda modules, slide downloads, and feedback forms."
  },
  {
    question: "How long does a typical project take?",
    answer: "Depending on the complexity, a dedicated event landing page or registration microsite takes about 1-2 weeks. Comprehensive packages (site + registration engine + physical collateral design) take 3-4 weeks."
  },
  {
    question: "Can you customize solutions based on our event requirements?",
    answer: "Yes, all our services are modular. You can choose to hire us just for digital microsites, just for print collateral designs, or for an end-to-end design and experience package. We customize all details to your guidelines."
  }
];

export default function CorporateEvents() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    eventType: 'Conference',
    eventDate: '',
    requirements: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredGallery = activeCategory === 'All' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  const scrollToContact = () => {
    const contactSection = document.getElementById('corporate-contact-form');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="bg-[#faf8f5] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-white pt-24 pb-20 md:py-32 border-b border-slate-100 overflow-hidden">
        {/* Subtle geometric grid line backdrop */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold tracking-wider uppercase border border-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Enterprise Event Design Studio
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Corporate Event Experience Design
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl font-light">
                From event microsites and registrations to branding and attendee engagement, we help organizations create seamless corporate event experiences.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={scrollToContact}
                  className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary/95 transition-all hover:scale-105 inline-flex items-center gap-2 shadow-lg shadow-primary/10 cursor-pointer"
                >
                  Get a Proposal
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={scrollToContact}
                  className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold hover:bg-slate-50 transition-all hover:scale-105 cursor-pointer"
                >
                  Contact Us
                </button>
              </div>
            </div>

            {/* Hero Collage / Image */}
            <div className="lg:col-span-6 relative">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-slate-50">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&fit=crop" 
                      alt="Large conference stage"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className="col-span-4 self-end">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-slate-50">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&fit=crop" 
                      alt="Event registration check-in desk"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-slate-50">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&fit=crop" 
                      alt="Networking and check-in"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className="col-span-8">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-slate-50">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&fit=crop" 
                      alt="Keynote presentation session"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Our Corporate Services
            </h2>
            <p className="text-slate-600 font-light leading-relaxed">
              We design and implement modular digital and physical experiences to make your events run flawlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((srv) => {
              const Icon = srv.icon;
              return (
                <div 
                  key={srv.number}
                  className="p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-slate-200 transition-all group duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors duration-300">
                        <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 font-mono tracking-widest">{srv.number}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-light">
                      {srv.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. EVENT GALLERY */}
      <section className="py-24 bg-[#faf8f5] border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Event Categories & Showcase
            </h2>
            <p className="text-slate-600 font-light leading-relaxed">
              Explore categories of corporate events where we deploy our registration tech and branding design.
            </p>
          </div>

          {/* Categories Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeCategory === cat 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dynamic Gallery Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                  <ImageWithFallback 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 bg-white/95 text-slate-700 text-xs font-bold rounded-full shadow-sm border border-slate-150">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-2 flex-grow flex flex-col justify-center">
                  <h4 className="text-lg font-bold text-slate-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE EVENTIQUE */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Why Choose Eventique
            </h2>
            <p className="text-slate-600 font-light leading-relaxed">
              We align design precision with technical reliability to deliver premium experiences.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-8 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-4 hover:bg-white hover:shadow-xl transition-all duration-300 border-dashed"
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-150 flex items-center justify-center text-primary mx-auto shadow-sm">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-24 bg-[#faf8f5] border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Trusted by Top Teams
            </h2>
            <p className="text-slate-600 font-light leading-relaxed">
              Read what enterprise organizers say about our design studio services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between relative"
              >
                <p className="text-sm text-slate-600 italic leading-relaxed font-light mb-6">
                  "{t.quote}"
                </p>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">
                    {t.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {t.designation} • <span className="font-semibold text-slate-500">{t.company}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 font-light leading-relaxed">
              Find answers to common questions about our corporate services.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
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

      {/* 7. CONTACT CTA SECTION */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="container mx-auto px-4 text-center relative z-10 max-w-2xl space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Planning a Corporate Event?
          </h2>
          <p className="text-lg text-slate-300 font-light leading-relaxed max-w-lg mx-auto">
            Let's create a seamless digital experience for your attendees.
          </p>
          <button
            onClick={scrollToContact}
            className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary/95 transition-all hover:scale-105 inline-flex items-center gap-2 shadow-lg cursor-pointer"
          >
            Request a Proposal
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 8. CONTACT FORM */}
      <section id="corporate-contact-form" className="py-24 bg-[#faf8f5] scroll-mt-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Request Corporate Proposal
              </h3>
              <p className="text-sm text-slate-500 font-light">
                Fill in the details below and our corporate events team will reach out within 24 hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4 animate-in zoom-in-95 duration-500">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-emerald-800">Proposal Request Received</h4>
                <p className="text-sm text-emerald-600 font-light leading-relaxed">
                  Thank you, <span className="font-semibold">{formData.fullName}</span>. Your inquiry for a corporate <span className="font-semibold">{formData.eventType}</span> has been logged. Our design studio will review your project requirements and email a proposal to <span className="font-semibold">{formData.email}</span> shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-sm font-semibold text-emerald-700 hover:underline pt-2 cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="companyName" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Company Name</label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Acme Corp"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@company.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="eventType" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Event Type</label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    >
                      <option value="Town Hall">Town Hall</option>
                      <option value="Annual Day">Annual Day</option>
                      <option value="Family Day">Family Day</option>
                      <option value="Leadership Summit">Leadership Summit</option>
                      <option value="Product Launch">Product Launch</option>
                      <option value="Sales Kickoff">Sales Kickoff</option>
                      <option value="Conference">Conference</option>
                      <option value="Training Program">Training Program</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Award Ceremony">Award Ceremony</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="eventDate" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Event Date</label>
                    <input
                      type="date"
                      id="eventDate"
                      name="eventDate"
                      required
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="requirements" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Project Requirements</label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    required
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Briefly describe what design and technology solutions you need (e.g. Microsite + registration check-in, lanyards, stage backdrops, presentation decks)..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary/95 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] shadow-lg shadow-primary/10 cursor-pointer"
                >
                  Send Inquiry
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
