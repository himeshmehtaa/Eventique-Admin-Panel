import React, { useState } from 'react';
import { Link } from 'react-router';
import { CheckCircle, ArrowRight, Eye, ShieldCheck, Award, Truck } from 'lucide-react';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';
import { products as defaultProducts } from '../data/products';
import { useAdmin } from '../admin/context/AdminContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import lotusImage from '../../imports/image-3.png';

export default function PrintedLuxuryInvites() {
  const { state } = useAdmin();
  const printedBlock = state.contentBlocks.find((cb) => cb.sectionName === 'Printed Luxury Invites');
  const productsList = state.products && state.products.length > 0 ? state.products : defaultProducts;

  // Filter only printed invites
  const printedInvites = productsList.filter((p) => p.type === 'printed-invite');

  // Smooth scroll helper
  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="overflow-hidden min-h-screen">
      {/* ── HERO HEADER ────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#fdf8f0] via-white to-[#fff5f0] pt-16 pb-20 md:py-28 overflow-hidden border-b border-primary/5">
        {/* Decorative elements */}
        <MandalaDecor className="absolute bottom-10 left-1/4 w-32 h-32 text-secondary opacity-20 animate-rotate-slow z-10" />
        <LotusDecor className="absolute top-1/2 right-6 w-20 h-20 text-accent opacity-20 animate-float z-10" />

        {/* Jasmine corner decor */}
        <div className="absolute top-0 left-0 w-40 h-28 opacity-25">
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

        <div className="container mx-auto px-4 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column — Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm border border-primary/20 shadow-sm font-medium">
                <span>✨ Premium Physical Collections</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 leading-[1.1] tracking-tight text-[#1a1410] font-serif">
                {printedBlock?.title || 'Printed Luxury'} <span className="text-primary italic">Invitations</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                {printedBlock?.body || 'Experience the finest craftsmanship with our premium printed wedding invitations. Each piece is meticulously designed with luxurious materials, exquisite finishes, and attention to detail that makes your invitation unforgettable.'}
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={scrollToCollection}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 hover:shadow-2xl hover:scale-105 inline-flex items-center gap-2 shadow-lg font-medium cursor-pointer"
                >
                  Explore Collection
                  <ArrowRight className="w-5 h-5" />
                </button>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white text-foreground border-2 border-primary/20 rounded-full hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 inline-flex items-center"
                >
                  Request Samples
                </Link>
              </div>

              {/* Quality Features list */}
              <div className="flex items-center gap-6 flex-wrap pt-4 border-t border-[#f0ebe0]">
                {[
                  { icon: ShieldCheck, label: 'Handcrafted Finish' },
                  { icon: Award, label: '300gsm Cotton Stock' },
                  { icon: Truck, label: 'Worldwide Shipping' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column — Premium Collage Mockup */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/15 rounded-3xl blur-3xl opacity-60" />
              
              <div className="grid grid-cols-2 gap-4 w-full max-w-[480px] relative z-10">
                {[
                  'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&fit=crop',
                  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=500&fit=crop',
                  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500&fit=crop',
                  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&fit=crop',
                ].map((src, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl overflow-hidden shadow-2xl border-2 border-white/60 hover:scale-[1.04] transition-all duration-500 ${
                      i === 0 ? 'mt-6' : i === 2 ? '-mt-6' : ''
                    }`}
                  >
                    <ImageWithFallback src={src} alt={`Luxury print design ${i + 1}`} className="w-full aspect-[4/5] object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT COLLECTION SECTION ────────────────────────── */}
      <section id="collection" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 relative">
            <div className="flex justify-center mb-6">
              <img src={lotusImage} alt="" className="w-48 h-12 object-contain opacity-35" style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(18%) saturate(1285%) hue-rotate(316deg) brightness(91%) contrast(87%)' }} />
            </div>
            <h2 className="text-3xl md:text-5xl text-[#1a1410] font-serif mb-4">The Luxury Catalog</h2>
            <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto mb-4" />
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Browse our premium card stocks, rich foil colors, and custom embossing details for your big day.
            </p>
          </div>

          {/* Grid list */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {printedInvites.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-3xl overflow-hidden border border-border hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                  <ImageWithFallback src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 px-3.5 py-1 bg-primary text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                    {item.occasion}
                  </div>
                  {item.paperQuality && (
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-xl text-[10px] text-white">
                      {item.paperQuality}
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-2 line-clamp-2">{item.description}</p>
                    
                    {/* Specifications */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-gray-600 border-t border-b border-border py-3">
                      <div>📏 <span className="font-medium">Size:</span> {item.size || 'Standard'}</div>
                      <div>📦 <span className="font-medium">Min Order:</span> {item.moq || '50 sets'}</div>
                      <div>🎨 <span className="font-medium">Color:</span> {item.color || 'Custom'}</div>
                      <div>✨ <span className="font-medium">Finish:</span> Foil &amp; Embossed</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-[#8B4949] text-xl font-bold">₹{item.price}</span>
                      <span className="text-xs text-muted-foreground">per invite set</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to={`/product/${item.id}`}
                        className="px-4 py-2.5 border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-xs font-semibold rounded-full flex items-center justify-center gap-1"
                      >
                        <Eye size={12} /> View Details
                      </Link>
                      <Link
                        to="/order"
                        className="px-4 py-2.5 bg-primary text-white hover:bg-primary/95 transition-colors text-xs font-semibold rounded-full flex items-center justify-center"
                      >
                        Order Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE CRAFT SECTION ──────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#fdf8f0] to-[#fffbf7]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl text-[#1a1410] font-serif mb-4">Our Craftsmanship Process</h2>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Consultation', desc: 'Select design layouts, paper thickness, color palettes, and finishing options with our head of design.' },
              { num: '02', title: 'Digital Proof', desc: 'We present fully customized digital layouts, scripts, and wording options for your complete sign-off.' },
              { num: '03', title: 'Press & Finish', desc: 'Precision letterpress, real gold or rose gold foil blocking, and custom structural finishing.' },
              { num: '04', title: 'Deliver', desc: 'Carefully packaged, double-boxed, and delivered worldwide with secure tracked logistics.' },
            ].map((step, idx) => (
              <div key={idx} className="bg-white border border-[#D4AF37]/20 rounded-2xl p-6 relative group hover:shadow-xl transition-all duration-300">
                <div className="text-4xl font-serif text-[#D4AF37]/20 absolute top-4 right-4 font-bold group-hover:text-[#D4AF37]/50 transition-colors">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 mt-4">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
