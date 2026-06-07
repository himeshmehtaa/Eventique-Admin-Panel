import { Link } from 'react-router';
import { motion } from 'motion/react';
import { MandalaDecor, LotusDecor, PaisleyDecor } from '../components/decorative/FloralDecor';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  Users, PenTool, Star, Clock, MessageCircle,
  Flame, Globe, Layers, TrendingUp,
  Mail, Phone, MapPin, Sparkles, ClipboardList, Scissors, Check
} from 'lucide-react';
import lotusImage from '../../imports/image-3.png';
import { useAdmin } from '../admin/context/AdminContext';

const ICON_MAP: Record<string, any> = {
  Users, PenTool, Star, Clock, MessageCircle, Flame, Globe, Layers, TrendingUp, Mail, Phone, MapPin
};

export default function About() {
  const { state } = useAdmin();
  const aboutBlock = state.contentBlocks.find((cb) => cb.sectionName === 'About');

  const founder = aboutBlock?.aboutFounder || {
    name: 'Himesh Mehta',
    role: 'Founder & Head of Design',
    education: 'NIFT',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    bio: 'With over a decade of experience in traditional and contemporary design, Himesh founded Eventique to bridge the gap between cultural heritage and modern digital experiences. His vision is to make every invitation a piece of art that families cherish forever.',
  };

  const team = aboutBlock?.aboutTeam || [
    { name: 'Rabi Mishra', role: 'Marketing & Growth', education: 'IIT', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
    { name: 'Sanu Kumar', role: 'Design Quality & Review', education: 'NIFT', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
    { name: 'Rishi', role: 'Content Creation', education: 'IIT', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  ];

  const milestones = (aboutBlock?.aboutMilestones || [
    { number: '2000+', label: 'Happy Clients', iconName: 'Users' },
    { number: '5000+', label: 'Designs Created', iconName: 'PenTool' },
    { number: '98%', label: 'Satisfaction Rate', iconName: 'Star' },
    { number: '24/7', label: 'Support Available', iconName: 'Clock' },
  ]).map(m => ({
    number: m.number,
    label: m.label,
    icon: ICON_MAP[m.iconName] || Users
  }));

  const values = aboutBlock?.aboutValues || [
    { icon: '🪷', title: 'Culturally Rooted', desc: 'Every motif, every colour is chosen with the depth of Indian tradition in mind — never generic, always intentional.' },
    { icon: '✦', title: 'Precision Craftsmanship', desc: "From typography to layout, each element is refined until it feels exactly right. We pay attention so you don't have to." },
    { icon: '🌟', title: 'Modern Sensibility', desc: 'Tradition meets contemporary design language — beautiful on every device, shareable in every format.' },
  ];

  const storyPoints = (aboutBlock?.aboutStoryPoints || [
    { title: 'Born from a Passion', text: 'Founded by designers from NIFT and IIT, Eventique started with a simple belief: every invitation deserves to be beautiful and culturally significant.', iconName: 'Flame', color: '#E8704A' },
    { title: 'Rooted in Culture', text: 'We believe every invitation carries meaning — your culture, your rituals, and the unique story behind your celebration.', iconName: 'Globe', color: '#4A9E8B' },
    { title: 'Detail-Driven Design', text: 'From typography to colour palette to intricate motifs — each element is carefully chosen to align with your traditions.', iconName: 'Layers', color: '#9B6DD1' },
    { title: 'Growing With You', text: "From e-invitations to complete stationery, we have grown with our clients' trust — 2,000+ celebrations and counting.", iconName: 'TrendingUp', color: '#D4AF37' },
  ]).map(pt => ({
    title: pt.title,
    text: pt.text,
    icon: ICON_MAP[pt.iconName] || Globe,
    color: pt.color
  }));

  const processSteps = [
    {
      step: '01',
      title: 'Discovery & Moodboarding',
      desc: 'We begin by studying your traditions, requirements, and aesthetic preferences. We align on color concepts, font palettes, and initial visual boards.',
      icon: ClipboardList,
      color: '#E8704A'
    },
    {
      step: '02',
      title: 'Bespoke Craftsmanship',
      desc: 'Our design studio works on detailing monograms, bespoke digital illustrations, page structures, and layouts, refining each asset for elegance.',
      icon: PenTool,
      color: '#D4AF37'
    },
    {
      step: '03',
      title: 'Production & Handover',
      desc: 'We compile interactive invitations, host custom event websites with live RSVP, and coordinate printing on luxury card stock for dispatch.',
      icon: Scissors,
      color: '#4A9E8B'
    }
  ];

  return (
    <div className="overflow-hidden bg-[#faf8f5]">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-[#fdf8f0] to-[#fff5f0] pt-20 pb-16 overflow-hidden">
        <MandalaDecor className="absolute top-8 left-8 w-40 h-40 text-[#D4AF37] opacity-20 animate-rotate-slow pointer-events-none" />
        <MandalaDecor className="absolute top-8 right-8 w-40 h-40 text-[#8B4949] opacity-20 animate-rotate-slow pointer-events-none" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <img src={lotusImage} alt="" className="w-72 h-14 object-contain opacity-30 mx-auto mb-8 pointer-events-none"
            style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(18%) saturate(1285%) hue-rotate(316deg) brightness(91%) contrast(87%)' }} />

          <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#8B4949]/10 text-[#8B4949] rounded-full border border-[#8B4949]/20 text-xs font-semibold mb-6">
            🌺 Design Studio for Indian Celebrations &amp; Corporate Events
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1a1410] mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {aboutBlock?.title || 'The Story of Eventique'}
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
            {aboutBlock?.body || 'Where tradition meets modern design — crafting premium invitations, custom websites, and stationery that feel as special as the moments they celebrate.'}
          </p>

          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-[#D4AF37]/30 rounded-2xl shadow-sm">
            <span className="text-[#D4AF37] text-lg">✦</span>
            <span className="text-[#1a1410] text-xs font-semibold">
              Founded &amp; built by alumni of <span className="text-[#8B4949]">NIFT</span> &amp; <span className="text-[#8B4949]">IIT</span>
            </span>
            <span className="text-[#D4AF37] text-lg">✦</span>
          </div>
        </div>
      </section>

      {/* ── 1. OUR STORY ────────────────────────────────────────── */}
      <section className="py-24 bg-white relative">
        <MandalaDecor className="absolute top-10 right-10 w-72 h-72 text-[#D4AF37] opacity-10 animate-rotate-slow pointer-events-none" />
        <PaisleyDecor className="absolute bottom-10 left-10 w-64 h-64 text-[#8B4949] opacity-10 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block font-mono mb-2">Our Roots</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1410]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Our Story &amp; Founder's Vision
            </h2>
            <div className="flex justify-center mt-3"><div className="w-16 h-0.5 bg-[#D4AF37]" /></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                Crafting Legacies of Celebration Design
              </h3>
              <p className="text-sm text-slate-500 font-light leading-relaxed">
                Eventique was founded with a clear, ambitious goal: to elevate the visual brand of Indian family celebrations and corporate gatherings. We noticed that invitations and stationery were often generic, treated as transactions rather than art.
              </p>
              <p className="text-sm text-slate-500 font-light leading-relaxed">
                By bringing together design alumni from NIFT and engineering pioneers from IIT, we bridged the gap between age-old artistic traditions and cutting-edge web experiences. Today, we stand as a premier event design studio.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150">
                  <span className="text-2xl font-bold text-primary block">2000+</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Celebrations Styled</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150">
                  <span className="text-2xl font-bold text-primary block">15+</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Specialist Designers</span>
                </div>
              </div>
            </div>
            
            {/* Founder Highlight */}
            <div className="bg-gradient-to-br from-[#fdf8f0] to-[#fff5f0] rounded-[2.5rem] p-8 shadow-sm border border-[#D4AF37]/20 relative">
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-32 h-40 rounded-[1.5rem] overflow-hidden shadow-md flex-shrink-0 border-2 border-white">
                  <ImageWithFallback src={founder.image} alt={founder.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8B4949] uppercase tracking-widest block mb-1">Founder's vision</span>
                  <h4 className="text-xl font-bold text-[#1a1410]">{founder.name}</h4>
                  <p className="text-xs text-gray-500">{founder.role} · {founder.education}</p>
                  <p className="text-xs text-gray-600 italic mt-3 leading-relaxed">
                    "{founder.bio}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Leadership Team Grid */}
          <div>
            <h4 className="text-xl font-bold text-slate-900 text-center mb-10" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Our Leadership Team
            </h4>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.name} className="group text-center bg-slate-50 p-6 rounded-3xl border border-slate-150 hover:shadow-md transition-all">
                  <div className="relative mx-auto w-32 h-32 mb-4">
                    <div className="absolute inset-0 bg-[#8B4949] rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-5" />
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm border-2 border-white">
                      <ImageWithFallback src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  </div>
                  <h5 className="text-base font-bold text-slate-900">{member.name}</h5>
                  <p className="text-xs text-[#8B4949] font-medium">{member.role}</p>
                  <p className="text-[10px] text-[#D4AF37] font-bold tracking-wider">{member.education}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. OUR PROCESS ──────────────────────────────────────── */}
      <section className="py-24 bg-[#fdf8f0] relative overflow-hidden">
        <MandalaDecor className="absolute bottom-0 right-0 w-80 h-80 text-primary opacity-5 animate-rotate-slow pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block font-mono mb-2">How We Work</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1410]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Our Design Process
            </h2>
            <div className="flex justify-center mt-3"><div className="w-16 h-0.5 bg-[#8B4949]" /></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {processSteps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div 
                  key={step.step}
                  className="bg-white rounded-3xl p-8 border border-[#D4AF37]/20 shadow-sm relative group hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#8B4949]/5 border border-[#8B4949]/10">
                        <IconComp className="w-5 h-5 text-[#8B4949]" />
                      </div>
                      <span className="text-4xl font-black text-slate-200 group-hover:text-primary/15 transition-colors font-mono">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  <div className="mt-6 h-1 w-12 rounded-full transition-all duration-300 group-hover:w-full" style={{ backgroundColor: step.color }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. WHY EVENTIQUE ────────────────────────────────────── */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block font-mono mb-2">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1410]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Why Choose Eventique
            </h2>
            <div className="flex justify-center mt-3"><div className="w-16 h-0.5 bg-[#D4AF37]" /></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div 
                key={v.title}
                className="bg-gradient-to-br from-[#fdf8f0] to-[#fff5f0] border border-[#D4AF37]/25 rounded-3xl p-8 text-center hover:shadow-md transition-all duration-300 relative"
              >
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-lg font-bold text-[#1a1410] mb-3">{v.title}</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. JOIN OUR TEAM ────────────────────────────────────── */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center space-y-6">
          <span className="px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Build the Future of Events
          </span>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Join Our Team
          </h2>
          <p className="text-sm text-slate-400 font-light max-w-xl mx-auto leading-relaxed">
            We are always looking for creative UI/UX designers, traditional motif illustrators, web developers, and proactive operations managers to work at our design studio. If you are passionate about design excellence, we want to hear from you.
          </p>
          <div className="pt-4">
            <Link 
              to="/careers"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-primary/95 transition-all text-sm shadow-md cursor-pointer"
            >
              Explore Open Careers
              <Check className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#8B4949] to-[#6d3535] relative overflow-hidden">
        <MandalaDecor className="absolute top-0 right-0 w-64 h-64 text-[#D4AF37] opacity-15 animate-rotate-slow pointer-events-none" />
        <MandalaDecor className="absolute bottom-0 left-0 w-64 h-64 text-white opacity-10 animate-rotate-slow pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <img src={lotusImage} alt="" className="w-48 h-10 object-contain opacity-25 mx-auto mb-6 pointer-events-none"
            style={{ filter: 'brightness(0) saturate(100%) invert(80%) sepia(50%) saturate(500%) hue-rotate(5deg) brightness(110%)' }} />
          <h2 className="text-3xl md:text-4xl text-[#D4AF37] mb-4 font-bold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Ready to Celebrate?
          </h2>
          <div className="flex justify-center mb-5"><div className="w-24 h-0.5 bg-[#D4AF37]/60" /></div>
          <p className="text-white/85 text-base max-w-xl mx-auto mb-10 leading-relaxed font-light">
            Let's create something beautiful together. Reach out and we'll get started on your perfect celebration theme.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/events"
              className="px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-[#1a1410] rounded-full font-semibold hover:shadow-xl hover:shadow-[#D4AF37]/30 transition-all hover:scale-105 text-sm">
              Explore Designs &amp; Packages
            </Link>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
              className="px-10 py-4 bg-[#25D366] text-white rounded-full font-semibold hover:bg-[#20bc5a] transition-all hover:scale-105 inline-flex items-center gap-2 text-sm shadow-md">
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </a>
            <Link to="/contact"
              className="px-10 py-4 border-2 border-[#D4AF37] text-[#D4AF37] rounded-full font-semibold hover:bg-[#D4AF37]/10 transition-all hover:scale-105 text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
