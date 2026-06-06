import { Link } from 'react-router';
import { motion } from 'motion/react';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  Users, PenTool, Star, Clock, MessageCircle,
  Flame, Globe, Layers, TrendingUp,
} from 'lucide-react';
import lotusImage from '../../imports/image-3.png';
import { useAdmin } from '../admin/context/AdminContext';

import { Mail, Phone, MapPin } from 'lucide-react';

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

  return (
    <div className="overflow-hidden">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-[#fdf8f0] to-[#fff5f0] pt-16 pb-16 overflow-hidden">
        <MandalaDecor className="absolute top-8 left-8 w-40 h-40 text-[#D4AF37] opacity-20 animate-rotate-slow" />
        <MandalaDecor className="absolute top-8 right-8 w-40 h-40 text-[#8B4949] opacity-20 animate-rotate-slow" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <img src={lotusImage} alt="" className="w-72 h-14 object-contain opacity-30 mx-auto mb-8"
            style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(18%) saturate(1285%) hue-rotate(316deg) brightness(91%) contrast(87%)' }} />

          <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#8B4949]/10 text-[#8B4949] rounded-full border border-[#8B4949]/20 text-sm mb-6">
            🌺 Design Studio for Indian Celebrations
          </div>
          <h1 className="text-5xl md:text-7xl mb-6 text-[#1a1410] tracking-tight">
            {aboutBlock?.title || 'The Story of Eventique'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            {aboutBlock?.body || 'Where tradition meets modern design — crafting invitations that feel as special as the moments they celebrate.'}
          </p>

          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-[#D4AF37]/40 rounded-2xl shadow-sm">
            <span className="text-[#D4AF37] text-lg">✦</span>
            <span className="text-[#1a1410] text-sm">
              Founded &amp; built by alumni of <span className="text-[#8B4949] font-semibold">NIFT</span> &amp; <span className="text-[#8B4949] font-semibold">IIT</span>
            </span>
            <span className="text-[#D4AF37] text-lg">✦</span>
          </div>
        </div>
      </section>

      {/* ── VALUES ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl text-[#1a1410] mb-3">What Drives Us</h2>
            <div className="flex justify-center"><div className="w-24 h-0.5 bg-[#D4AF37]" /></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((v) => (
              <div key={v.title} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/8 to-[#8B4949]/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-[#fdf8f0] to-[#fff5f0] border border-[#D4AF37]/25 rounded-3xl p-10 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]/50 rounded-tl-lg" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]/50 rounded-tr-lg" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]/50 rounded-bl-lg" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]/50 rounded-br-lg" />
                  <div className="text-5xl mb-5">{v.icon}</div>
                  <h3 className="text-xl text-[#1a1410] mb-3">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BORN FROM A PASSION ─────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden bg-[#1a1410]">
        <MandalaDecor className="absolute top-0 right-0 w-96 h-96 text-[#D4AF37] opacity-5 -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl text-[#D4AF37] mb-4">Born from a Passion</h2>
              <div className="flex justify-center mb-6"><div className="w-24 h-0.5 bg-[#D4AF37]/60" /></div>
              <p className="text-gray-300 text-lg">Every invitation is a canvas for your story.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {storyPoints.map((pt, i) => {
                const Icon = pt.icon;
                return (
                  <motion.div
                    key={pt.title}
                    initial={{ opacity: 0, y: 50, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
                    className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 cursor-default overflow-hidden"
                  >
                    {/* Animated glow on hover */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{ background: `radial-gradient(ellipse at 30% 40%, ${pt.color}14 0%, transparent 70%)` }}
                    />
                    {/* Top border accent */}
                    <div
                      className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{ background: `linear-gradient(90deg, transparent, ${pt.color}80, transparent)` }}
                    />

                    <div className="flex gap-6 relative z-10">
                      <div className="flex-shrink-0">
                        <motion.div
                          whileHover={{ rotate: 12, scale: 1.15 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                          className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center bg-white/5 group-hover:border-white/20 transition-colors duration-300"
                        >
                          <Icon className="w-6 h-6 transition-colors duration-300" style={{ color: pt.color }} />
                        </motion.div>
                      </div>
                      <div>
                        <h3 className="text-[#F4E4C1] text-xl mb-3 font-medium group-hover:text-white transition-colors duration-300">
                          {pt.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors duration-300">
                          {pt.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-20 text-center relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-4">
                <LotusDecor className="w-12 h-12 text-[#D4AF37] opacity-20" />
              </div>
              <p className="text-2xl md:text-3xl text-[#F4E4C1] italic leading-relaxed font-serif pt-8">
                "Because for us, it is not just about invitations. It is about designing something that represents <span className="text-[#D4AF37]">you</span>."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── OUR JOURNEY SO FAR ──────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-[#1a1410] mb-4">Our Journey So Far</h2>
            <div className="flex justify-center"><div className="w-24 h-0.5 bg-[#D4AF37]" /></div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {milestones.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.55, ease: 'easeOut' }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Circular icon with dashed border */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-[#fdf8f0] border-2 border-dashed border-[#D4AF37]/50
                                    flex items-center justify-center
                                    group-hover:border-[#8B4949]/60 group-hover:bg-[#fff5f0]
                                    transition-all duration-300">
                      <Icon className="w-9 h-9 text-[#8B4949] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-[#8B4949] mb-1">{m.number}</div>
                  <p className="text-gray-500 text-sm">{m.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOUNDER & TEAM ──────────────────────────────────────── */}
      <section className="py-24 bg-[#fdf8f0] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl text-[#1a1410] mb-4">The Creative Minds</h2>
            <div className="flex justify-center mb-6"><div className="w-24 h-0.5 bg-[#8B4949]" /></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              A collective of visionaries from <span className="text-[#8B4949] font-bold underline decoration-[#D4AF37] decoration-2 underline-offset-4">NIFT</span> and <span className="text-[#8B4949] font-bold underline decoration-[#D4AF37] decoration-2 underline-offset-4">IIT</span>, dedicated to redefining the aesthetic of Indian celebrations.
            </p>
          </div>

          {/* Large Founder Feature */}
          <div className="max-w-5xl mx-auto mb-24">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-[#8B4949]/5 border border-[#D4AF37]/20 relative">
              <div className="absolute top-6 right-6 opacity-10">
                <MandalaDecor className="w-32 h-32 text-[#8B4949]" />
              </div>
              <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                <div className="w-full md:w-2/5 aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl border-4 border-[#fdf8f0]">
                  <ImageWithFallback src={founder.image} alt={founder.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="w-full md:w-3/5">
                  <div className="inline-block px-4 py-1.5 bg-[#8B4949]/10 text-[#8B4949] rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                    Founder & Visionary
                  </div>
                  <h3 className="text-4xl text-[#1a1410] mb-2">{founder.name}</h3>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[#8B4949] font-semibold">{founder.role}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span className="text-gray-500">{founder.education}</span>
                  </div>
                  <p className="text-xl text-gray-600 leading-relaxed mb-8 italic">
                    "{founder.bio}"
                  </p>
                  <div className="flex gap-4">
                    <div className="p-3 rounded-full bg-[#fdf8f0] border border-[#D4AF37]/20">
                      <Star className="w-5 h-5 text-[#D4AF37]" fill="currentColor" />
                    </div>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Leading a team of 15+ specialized designers across India.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team grid */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h4 className="text-2xl text-[#1a1410]">Our Leadership Team</h4>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {team.map((member) => (
                <div key={member.name} className="group text-center">
                  <div className="relative mx-auto w-48 h-48 mb-6">
                    <div className="absolute inset-0 bg-[#8B4949] rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-10" />
                    <div className="absolute inset-0 bg-[#D4AF37] rounded-3xl -rotate-3 group-hover:-rotate-6 transition-transform duration-500 opacity-10" />
                    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-lg border-2 border-white">
                      <ImageWithFallback src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1410] mb-1">{member.name}</h3>
                  <p className="text-[#8B4949] font-medium mb-1">{member.role}</p>
                  <p className="text-sm text-[#D4AF37] font-semibold tracking-wider">{member.education}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#8B4949] to-[#6d3535] relative overflow-hidden">
        <MandalaDecor className="absolute top-0 right-0 w-64 h-64 text-[#D4AF37] opacity-15 animate-rotate-slow" />
        <MandalaDecor className="absolute bottom-0 left-0 w-64 h-64 text-white opacity-10 animate-rotate-slow" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <img src={lotusImage} alt="" className="w-48 h-10 object-contain opacity-25 mx-auto mb-6"
            style={{ filter: 'brightness(0) saturate(100%) invert(80%) sepia(50%) saturate(500%) hue-rotate(5deg) brightness(110%)' }} />
          <h2 className="text-4xl md:text-5xl text-[#D4AF37] mb-4">Ready to Celebrate?</h2>
          <div className="flex justify-center mb-5"><div className="w-24 h-0.5 bg-[#D4AF37]/60" /></div>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Let's create something beautiful together. Reach out and we'll get started on your perfect invitation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/explore"
              className="px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-[#1a1410] rounded-full font-semibold hover:shadow-xl hover:shadow-[#D4AF37]/30 transition-all hover:scale-105">
              Explore Designs
            </Link>
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
              className="px-10 py-4 bg-[#25D366] text-white rounded-full font-semibold hover:bg-[#20bc5a] transition-all hover:scale-105 inline-flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> WhatsApp Us
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
