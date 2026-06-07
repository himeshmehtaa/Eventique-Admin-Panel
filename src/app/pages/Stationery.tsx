import { useState } from 'react';
import { Link } from 'react-router';
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Sparkles,
  ShoppingBag,
  IndianRupee,
  MessageCircle,
  Mail
} from 'lucide-react';
import { MandalaDecor, LotusDecor, PaisleyDecor } from '../components/decorative/FloralDecor';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import lotusImage from '../../imports/image-3.png';

const STATIONERY_PRODUCTS = [
  {
    id: 'st1',
    name: 'Elegant Welcome Board',
    type: 'Welcome Boards',
    occasion: 'wedding',
    price: 1999,
    description: 'Welcome your guests with a beautifully designed floral welcome board.',
    image: 'https://images.unsplash.com/photo-1618107158953-dd4c6424b638?w=600&fit=crop',
    features: ['Custom Monogram', 'Large Format PDF', 'Gold Foil Accents']
  },
  {
    id: 'st2',
    name: 'Bespoke Wedding Menu Card',
    type: 'Menu Cards',
    occasion: 'wedding',
    price: 1499,
    description: 'Detail your celebration menu courses with custom typography designs.',
    image: 'https://images.unsplash.com/photo-1581978154820-45d31f11a060?w=600&fit=crop',
    features: ['Double-Sided Design', 'Premium Font Choice', 'Traditional Motifs']
  },
  {
    id: 'st3',
    name: 'Easel Seating Chart Display',
    type: 'Seating Charts',
    occasion: 'wedding',
    price: 2499,
    description: 'Showcase guest table arrangements clearly with an elegant alphabetized seating chart.',
    image: 'https://images.unsplash.com/photo-1592677818395-72868c4b3c03?w=600&fit=crop',
    features: ['High-Res Vector Format', 'Custom Seating Tables', 'Print-Ready Layout']
  },
  {
    id: 'st4',
    name: 'Calligraphy Name Place Card',
    type: 'Place Cards',
    occasion: 'wedding',
    price: 999,
    description: 'Folded name place cards for guest tables featuring custom branding calligraphy.',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&fit=crop',
    features: ['Individual Guest Names', 'Fold Line Markers', 'Double-Sided Design']
  },
  {
    id: 'st5',
    name: 'Classic Table Numbers Set',
    type: 'Table Numbers',
    occasion: 'wedding',
    price: 999,
    description: 'Numbered tent cards (1-20) to guide guests to their dining tables.',
    image: 'https://images.unsplash.com/photo-1635126039221-5f64c186162a?w=600&fit=crop',
    features: ['Numbers 1-20 included', 'Tent Card Fold Format', 'Matching Monogram']
  },
  {
    id: 'st6',
    name: 'Directional Event Signage',
    type: 'Signage',
    occasion: 'wedding',
    price: 1999,
    description: 'Help guests navigate between ceremony venues, bars, and reception zones.',
    image: 'https://images.unsplash.com/photo-1600349183244-044448ebf637?w=600&fit=crop',
    features: ['Set of 5 custom signs', 'Modern Icons included', 'High Resolution']
  },
  {
    id: 'st7',
    name: 'Floral Thank You Card',
    type: 'Thank You Cards',
    occasion: 'baby-shower',
    price: 1299,
    description: 'Thank-you cards customized with your baby shower visual theme.',
    image: 'https://images.unsplash.com/photo-1758810741366-aff0d0e37e7f?w=600&fit=crop',
    features: ['Custom Message', 'Personal Signature Block', 'Matching Envelopes']
  },
  {
    id: 'st8',
    name: 'Linen Paper Gift Tag',
    type: 'Gift Tags',
    occasion: 'anniversary',
    price: 999,
    description: 'Custom print tags to tie to return gift packages and boxes.',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&fit=crop',
    features: ['Lanyard Hole punches', 'Gold Border Accents', 'Personalized Text']
  },
  {
    id: 'st9',
    name: 'Theme Sticker Pack',
    type: 'Stickers',
    occasion: 'birthday',
    price: 799,
    description: 'Custom adhesive stickers matching your kids party or birthday theme.',
    image: 'https://images.unsplash.com/photo-1595116971913-b52f8ccca4c0?w=600&fit=crop',
    features: ['Round shape cuts', 'Vibrant CMYK Colors', 'Multiple designs']
  },
  {
    id: 'st10',
    name: 'Mandala Envelope Seals',
    type: 'Envelope Seals',
    occasion: 'pooja',
    price: 799,
    description: 'Gold foil round seals featuring sacred motifs to seal invitations.',
    image: 'https://images.unsplash.com/photo-1692098075460-6bdb6009b33e?w=600&fit=crop',
    features: ['Adhesive circular cuts', 'Traditional Mandala Art', 'Gold Foil Embossed look']
  }
];

const OCCASIONS = [
  { value: 'all', label: 'All Occasions' },
  { value: 'wedding', label: 'Weddings' },
  { value: 'engagement', label: 'Engagements' },
  { value: 'anniversary', label: 'Anniversaries' },
  { value: 'baby-shower', label: 'Baby Showers' },
  { value: 'birthday', label: 'Birthdays' },
  { value: 'kids', label: 'Kids Parties' },
  { value: 'housewarming', label: 'Housewarming' },
  { value: 'pooja', label: 'Pooja & Religious' },
];

const STATIONERY_TYPES = [
  { value: 'all', label: 'All Products' },
  { value: 'Welcome Boards', label: 'Welcome Boards' },
  { value: 'Menu Cards', label: 'Menu Cards' },
  { value: 'Seating Charts', label: 'Seating Charts' },
  { value: 'Place Cards', label: 'Place Cards' },
  { value: 'Table Numbers', label: 'Table Numbers' },
  { value: 'Signage', label: 'Signage' },
  { value: 'Thank You Cards', label: 'Thank You Cards' },
  { value: 'Gift Tags', label: 'Gift Tags' },
  { value: 'Stickers', label: 'Stickers' },
  { value: 'Envelope Seals', label: 'Envelope Seals' }
];

export default function Stationery() {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredProducts = STATIONERY_PRODUCTS.filter((item) => {
    let matchesOccasion = true;
    if (selectedOccasion !== 'all') {
      if (selectedOccasion === 'kids') {
        matchesOccasion = item.occasion === 'birthday' && 
          (item.name.toLowerCase().includes('kids') || item.description.toLowerCase().includes('kids') || item.type === 'Stickers');
      } else if (selectedOccasion === 'housewarming') {
        matchesOccasion = item.occasion === 'pooja' && 
          (item.name.toLowerCase().includes('house') || item.name.toLowerCase().includes('griha'));
      } else {
        matchesOccasion = item.occasion === selectedOccasion;
      }
    }

    let matchesType = true;
    if (selectedType !== 'all') {
      matchesType = item.type === selectedType;
    }

    return matchesOccasion && matchesType;
  });

  return (
    <div className="py-12 relative overflow-hidden bg-[#faf8f5]">
      {/* Background Floral Elements */}
      <MandalaDecor className="absolute top-20 right-10 w-64 h-64 text-primary opacity-20 animate-rotate-slow pointer-events-none" />
      <PaisleyDecor className="absolute top-1/3 left-10 w-48 h-48 text-secondary opacity-25 pointer-events-none" />
      <LotusDecor className="absolute bottom-1/4 right-1/4 w-32 h-32 text-accent opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={lotusImage} 
              alt="Lotus logo icon" 
              className="w-40 h-10 object-contain opacity-25" 
              style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(18%) saturate(1285%) hue-rotate(316deg) brightness(91%) contrast(87%)' }} 
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Event Stationery Catalog
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto font-light leading-relaxed">
            Cohesive printed and digital stationery items designed to elevate the visual theme of your celebration.
          </p>
        </div>

        {/* Occasion Filters */}
        <div className="mb-8 w-full">
          <div className="flex justify-start md:justify-center overflow-x-auto hide-scrollbar scroll-smooth">
            <div className="bg-[#8B4949] rounded-full p-1.5 flex gap-1.5 whitespace-nowrap min-w-max">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ.value}
                  onClick={() => {
                    setSelectedOccasion(occ.value);
                  }}
                  className={`px-5 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap text-xs md:text-sm font-semibold cursor-pointer ${
                    selectedOccasion === occ.value
                      ? 'bg-[#F5E6D8] text-[#8B4949] shadow-sm'
                      : 'text-white hover:text-white/80'
                  }`}
                >
                  {occ.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Type Filters */}
        <div className="mb-12 w-full">
          <div className="flex justify-start md:justify-center overflow-x-auto hide-scrollbar scroll-smooth">
            <div className="flex gap-2 whitespace-nowrap min-w-max px-4">
              {STATIONERY_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-5 py-2.5 rounded-full transition-all duration-300 text-xs md:text-sm font-semibold cursor-pointer ${
                    selectedType === type.value
                      ? 'bg-[#8B4949] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Count */}
        <div className="flex items-center justify-between border-b border-[#f0ebe0] pb-4 mb-6">
          <p className="text-slate-500 font-light text-sm">
            Showing {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <div 
                key={item.id} 
                className="group bg-white rounded-2xl overflow-hidden border border-slate-150 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden bg-slate-50 relative border-b border-slate-100">
                    <ImageWithFallback 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2.5 py-1 bg-white/95 text-slate-700 text-[10px] font-bold rounded-full shadow-sm border border-slate-200">
                        {item.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.features.map((f, idx) => (
                        <span key={idx} className="text-[9px] font-medium px-2 py-0.5 bg-[#8B4949]/5 text-[#8B4949] rounded-full border border-[#8B4949]/10">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-50 mt-4">
                  <div className="flex items-center text-[#8B4949]">
                    <IndianRupee className="w-4 h-4 flex-shrink-0" />
                    <span className="text-base font-bold">{item.price.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-400 font-light ml-0.5">onwards</span>
                  </div>
                  <Link
                    to="/contact"
                    className="text-xs px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-primary font-semibold transition-colors duration-300 flex items-center gap-1"
                  >
                    Inquire
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-150 p-8 shadow-sm">
            <p className="text-xl text-slate-500 mb-2 font-semibold">No stationery products found</p>
            <p className="text-slate-400 mb-6 font-light">Try selecting a different occasion or product category.</p>
            <button
              onClick={() => {
                setSelectedOccasion('all');
                setSelectedType('all');
              }}
              className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/95 transition-all font-semibold text-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Cohesive Set CTA Banner */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-white via-[#fffdfb] to-[#faf5e6] rounded-3xl p-8 md:p-12 text-center border border-primary/10 overflow-hidden shadow-sm mt-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-2xl md:text-3xl mb-3 font-bold text-slate-900" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Need a Fully Branded Stationery Set?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto mb-8 font-light leading-relaxed">
            Get all welcome boards, menu cards, table numbers, place cards, and stickers designed together for a cohesive theme layout.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/events"
              className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/95 hover:scale-105 transition-all shadow-md font-semibold text-sm"
            >
              View Design Packages
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-white text-slate-700 border border-primary/20 rounded-full hover:bg-primary/5 hover:scale-105 transition-all shadow-sm font-semibold text-sm"
            >
              Request Custom Set
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}