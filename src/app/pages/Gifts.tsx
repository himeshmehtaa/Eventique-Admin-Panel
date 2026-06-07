import { useState } from 'react';
import { Link } from 'react-router';
import { 
  Check, 
  IndianRupee, 
  MessageCircle, 
  Mail, 
  Sparkles, 
  X, 
  ShieldCheck, 
  Package, 
  Heart,
  ShoppingCart
} from 'lucide-react';
import { MandalaDecor, LotusDecor, PaisleyDecor } from '../components/decorative/FloralDecor';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import lotusImage from '../../imports/image-3.png';

interface GiftProduct {
  id: string;
  name: string;
  category: 'personal' | 'return' | 'corporate' | 'packaging';
  subCategory: string;
  price: number;
  description: string;
  image: string;
  features: string[];
}

const GIFT_PRODUCTS: GiftProduct[] = [
  // 1. Personal Gifts
  {
    id: 'g1',
    name: 'Bespoke Brass & Glass Memory Box',
    category: 'personal',
    subCategory: 'Wedding & Keepsakes',
    price: 1899,
    description: 'A handcrafted brass and glass box with velvet lining, perfect for preserving wedding vows, rings, and memories.',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&fit=crop',
    features: ['Hand-welded Brass', 'Velvet Cushioning', 'Custom Monogram Engraving']
  },
  {
    id: 'g2',
    name: 'Luxury Celebration Wine & Chalice Set',
    category: 'personal',
    subCategory: 'Wedding & Anniversary',
    price: 3499,
    description: 'An elegant gift hamper featuring a bottle of premium sparkling juice, two gold-rimmed chalices, and artisanal chocolates.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238bd34?w=600&fit=crop',
    features: ['Gold-rimmed Glassware', 'Rigid Magnetic Gift Box', 'Personalized Card']
  },
  {
    id: 'g3',
    name: 'Newborn Keepsake Wooden Trunk',
    category: 'personal',
    subCategory: 'Baby Shower & Kids',
    price: 2799,
    description: 'A pine wood trunk decorated with traditional motifs to hold baby blankets, first booties, and birth certificates.',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&fit=crop',
    features: ['Solid Pine Wood', 'Traditional Hand-painted Accents', 'Name Plate Included']
  },
  {
    id: 'g4',
    name: 'Premium Anniversary Gold Foil Tray',
    category: 'personal',
    subCategory: 'Anniversary Gifts',
    price: 2199,
    description: 'A stunning gold foil-embossed wooden tray styled with traditional floral borders, perfect for premium table display.',
    image: 'https://images.unsplash.com/photo-1571781926291-1a36ba6d3e73?w=600&fit=crop',
    features: ['Gold Foil Accents', 'High-quality Pine Wood', 'Artisanal Borders']
  },

  // 2. Return Gifts
  {
    id: 'g5',
    name: 'Silver Plated Pooja Thali Set',
    category: 'return',
    subCategory: 'Wedding & Pooja Return',
    price: 899,
    description: 'An intricately carved silver-plated thali set including a diya, incense holder, and kumkum bowls.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&fit=crop',
    features: ['Premium Silver Plating', 'Velvet-lined Gift Box', 'Tarnish-resistant Coating']
  },
  {
    id: 'g6',
    name: 'Hand-poured Botanical Soy Candle Set',
    category: 'return',
    subCategory: 'Party Favours',
    price: 499,
    description: 'A set of three organic soy wax candles infused with natural essential oils of Jasmine, Rose, and Sandalwood.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&fit=crop',
    features: ['100% Soy Wax', '20-Hour Burn Time Each', 'Custom Decorated Tins']
  },
  {
    id: 'g7',
    name: 'Bespoke Silk Potli Favor Bags',
    category: 'return',
    subCategory: 'Guest Giveaways',
    price: 349,
    description: 'Elegant drawstring potli bags made of raw silk with exquisite zardozi embroidery for distributing dry fruits or sweets.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&fit=crop',
    features: ['Premium Raw Silk', 'Handcrafted Embroidery', 'Custom Color Matching']
  },
  {
    id: 'g8',
    name: 'Glazed Ceramic Succulent Planters',
    category: 'return',
    subCategory: 'Party Favours',
    price: 450,
    description: 'Miniature hand-glazed ceramic pots designed to hold small indoor plants or succulents for eco-friendly return gifting.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&fit=crop',
    features: ['Hand-glazed Ceramic', 'Eco-friendly Packaging', 'Assorted Pastel Shades']
  },

  // 3. Corporate Gifts
  {
    id: 'g9',
    name: 'Executive Welcome Kit',
    category: 'corporate',
    subCategory: 'Employee Welcome Kits',
    price: 1499,
    description: 'A professional onboarding set featuring a matte black steel flask, vegan leather diary, rollerball pen, and a laptop stand.',
    image: 'https://images.unsplash.com/photo-1635126039221-5f64c186162a?w=600&fit=crop',
    features: ['Laser Engraved Flask', 'Undated Planner Diary', 'Custom Corporate Box']
  },
  {
    id: 'g10',
    name: 'Artisanal Coffee & Tea Break Hamper',
    category: 'corporate',
    subCategory: 'Client Gifts & Appreciation',
    price: 1999,
    description: 'A gourmet coffee and tea break box with single-origin coffee grounds, loose-leaf white tea, ceramic mug, and honey jar.',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&fit=crop',
    features: ['Single-Origin Coffee', 'Handmade Mug', 'Teak Wood Drizzler']
  },
  {
    id: 'g11',
    name: 'Sustainably Crafted Desk Accessory Pack',
    category: 'corporate',
    subCategory: 'Conference Merchandise',
    price: 799,
    description: 'Eco-friendly cork desk mat, bamboo phone stand, and seed pencil set packed in recycled craft paper packaging.',
    image: 'https://images.unsplash.com/photo-1595116971913-b52f8ccca4c0?w=600&fit=crop',
    features: ['100% Biodegradable', 'Minimalist Styling', 'High-res Screen Printing']
  },
  {
    id: 'g12',
    name: 'Festive Delight Dry Fruit Box',
    category: 'corporate',
    subCategory: 'Festival Gifts',
    price: 1899,
    description: 'A premium wooden box partitioned with dried almonds, cashews, pistachios, and clay diyas for Diwali or festival celebrations.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238bd345?w=600&fit=crop',
    features: ['Polished Teak Box', 'Premium Salted Nuts', 'Traditional Handcrafted Diyas']
  },

  // 4. Gift Packaging
  {
    id: 'g13',
    name: 'Premium Rigid Magnetic Gift Boxes',
    category: 'packaging',
    subCategory: 'Gift Boxes',
    price: 199,
    description: 'High-strength cardboard boxes with folding magnetic closures, covered in elegant textured paper with gold foil logos.',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&fit=crop',
    features: ['Magnetic Flap Closure', 'Textured Paper Finish', 'Custom Logo Hot Foil']
  },
  {
    id: 'g14',
    name: 'Handwoven Wicker Hamper Baskets',
    category: 'packaging',
    subCategory: 'Gift Hampers',
    price: 499,
    description: 'Eco-friendly hand-woven willow baskets with vegan leather straps and brass buckles, perfect for bespoke hampers.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238bd34?w=600&fit=crop',
    features: ['Natural Willow Straw', 'Vegan Leather Latches', 'Reusable & Durable']
  },
  {
    id: 'g15',
    name: 'Bespoke Illustrated Packaging Sleeves',
    category: 'packaging',
    subCategory: 'Packaging Sleeves',
    price: 79,
    description: 'Heavy cardstock paper sleeves featuring custom event illustrations or patterns to wrap around standard gift boxes.',
    image: 'https://images.unsplash.com/photo-1595116971913-b52f8ccca4c0?w=600&fit=crop',
    features: ['300 GSM Matte Paper', 'Custom Event Illustration', 'Matte Laminating']
  },
  {
    id: 'g16',
    name: 'Custom Calligraphy Gift Tags Set',
    category: 'packaging',
    subCategory: 'Gift Tags & Custom Packaging',
    price: 149,
    description: 'A pack of 20 personalized premium cardstock tags with high-end calligraphy, complete with silk ribbons.',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&fit=crop',
    features: ['Calligraphy Print', 'Silk Ribbon Ties', 'Premium Textured Stock']
  }
];

const CATEGORIES = [
  { value: 'all', label: 'All Gifts' },
  { value: 'personal', label: 'Personal Gifts' },
  { value: 'return', label: 'Return Gifts' },
  { value: 'corporate', label: 'Corporate Gifts' },
  { value: 'packaging', label: 'Gift Packaging' },
];

export default function Gifts() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<GiftProduct | null>(null);
  
  // Inquiry form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState('50');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const filteredProducts = GIFT_PRODUCTS.filter((item) => {
    if (selectedCategory !== 'all') {
      return item.category === selectedCategory;
    }
    return true;
  });

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    
    // Simulate API request or mail trigger
    setSubmitted(true);
    setTimeout(() => {
      // Clear form
      setName('');
      setEmail('');
      setPhone('');
      setQuantity('50');
      setMessage('');
    }, 2000);
  };

  const handleWhatsAppInquiry = (product: GiftProduct) => {
    const text = encodeURIComponent(
      `Hi Eventique Team! I'm interested in inquiring about the "${product.name}" (Price: ₹${product.price} onwards). Please share more details.`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

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
            Bespoke Gifting Studio
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
            Thoughtfully curated gifts, personalized return favors, premium corporate kits, and luxury packaging solutions crafted to elevate your celebrations.
          </p>
        </div>

        {/* Category Tab Filters */}
        <div className="mb-12 w-full">
          <div className="flex justify-start md:justify-center overflow-x-auto hide-scrollbar scroll-smooth">
            <div className="bg-[#8B4949] rounded-full p-1.5 flex gap-1.5 whitespace-nowrap min-w-max">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-6 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap text-xs md:text-sm font-semibold cursor-pointer ${
                    selectedCategory === cat.value
                      ? 'bg-[#F5E6D8] text-[#8B4949] shadow-sm'
                      : 'text-white hover:text-white/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Count */}
        <div className="flex items-center justify-between border-b border-[#f0ebe0] pb-4 mb-6">
          <p className="text-slate-500 font-light text-sm">
            Showing {filteredProducts.length} gift item{filteredProducts.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* Products Gallery Grid */}
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
                      <span className="px-2.5 py-1 bg-white/95 text-slate-700 text-[10px] font-bold rounded-full shadow-sm border border-slate-200 uppercase tracking-wider">
                        {item.subCategory.split(' & ')[0]}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-light line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.features.slice(0, 2).map((f, idx) => (
                        <span key={idx} className="text-[9px] font-medium px-2 py-0.5 bg-[#8B4949]/5 text-[#8B4949] rounded-full border border-[#8B4949]/10">
                          {f}
                        </span>
                      ))}
                      {item.features.length > 2 && (
                        <span className="text-[9px] font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full border border-slate-200">
                          +{item.features.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-50 mt-4">
                  <div className="flex items-center text-[#8B4949]">
                    <IndianRupee className="w-4 h-4 flex-shrink-0" />
                    <span className="text-base font-bold">{item.price.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-400 font-light ml-0.5">onwards</span>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(item)}
                    className="text-xs px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-primary font-semibold transition-colors duration-300 flex items-center gap-1 cursor-pointer"
                  >
                    Inquire
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-150 p-8 shadow-sm">
            <p className="text-xl text-slate-500 mb-2 font-semibold">No gifts found</p>
            <p className="text-slate-400 mb-6 font-light">Try selecting a different gifting category.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/95 transition-all font-semibold text-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Custom Corporate/Bulk Hamper Banner */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-white via-[#fffdfb] to-[#faf5e6] rounded-3xl p-8 md:p-12 text-center border border-primary/10 overflow-hidden shadow-sm mt-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-2xl md:text-3xl mb-3 font-bold text-slate-900" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Curate Custom Hampers in Bulk
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto mb-8 font-light leading-relaxed">
            Need customized branding for wedding guest favors, client appreciation boxes, or company welcome hampers? Connect with our creative director to build a bespoke concept proposal.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/919876543210?text=Hi!%20I'd%20like%20to%20curate%20custom%20gift%20hampers%20in%20bulk%20with%20Eventique."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#25D366] text-white rounded-full hover:bg-[#20bc5a] hover:scale-105 transition-all shadow-md font-semibold text-sm inline-flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
            <Link
              to="/contact"
              className="px-6 py-3 bg-white text-slate-700 border border-primary/20 rounded-full hover:bg-primary/5 hover:scale-105 transition-all shadow-sm font-semibold text-sm"
            >
              Request Custom Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Inquiry Dialog Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col md:flex-row relative">
            
            {/* Close Button */}
            <button 
              onClick={() => {
                setSelectedProduct(null);
                setSubmitted(false);
              }}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors z-20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Side: Product preview */}
            <div className="md:w-5/12 bg-slate-50 border-r border-slate-100 p-6 flex flex-col justify-between">
              <div>
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 shadow-sm">
                  <ImageWithFallback 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase block mb-1">
                  {selectedProduct.subCategory}
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {selectedProduct.name}
                </h3>
                <p className="text-xs text-slate-500 font-light mt-2 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <span className="text-xs text-slate-400 block font-light">Price starting from</span>
                <div className="flex items-center text-[#8B4949] mt-0.5">
                  <IndianRupee className="w-5 h-5 flex-shrink-0" />
                  <span className="text-xl font-extrabold">{selectedProduct.price.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-slate-400 font-light ml-0.5">onwards</span>
                </div>
                <div className="mt-4 space-y-1.5">
                  {selectedProduct.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Inquiry Form */}
            <div className="md:w-7/12 p-8 flex flex-col justify-center">
              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="inline-flex items-center justify-center p-3 bg-emerald-50 text-emerald-600 rounded-full mb-2 border border-emerald-100">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Inquiry Sent Successfully</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto font-light leading-relaxed">
                    Thank you! Our design specialist will get back to you with custom pricing and catalog options within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      setSubmitted(false);
                    }}
                    className="px-6 py-2 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-slate-800 transition-colors mt-4 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                      Send Inquiry Proposal
                    </h4>
                    <p className="text-xs text-slate-400 font-light">
                      Fill out your details to receive corporate discounts and customization options.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aditi Sharma"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#8B4949] focus:outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email</label>
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="aditi@example.com"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#8B4949] focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Phone Number</label>
                        <input 
                          type="tel" 
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 99999 99999"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#8B4949] focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Est. Quantity</label>
                        <select 
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#8B4949] focus:outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="10-50">10 - 50 units</option>
                          <option value="50">50 - 100 units</option>
                          <option value="100">100 - 250 units</option>
                          <option value="250">250 - 500 units</option>
                          <option value="500+">500+ units</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Preferred Contact</label>
                        <div className="flex gap-2 h-10 items-center">
                          <span className="text-xs font-medium text-slate-600">WhatsApp / Call</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Message / Requirements (Optional)</label>
                      <textarea 
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Any specific colors or themes required?"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#8B4949] focus:outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button 
                      type="submit" 
                      className="w-full py-3 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" /> Submit Email Inquiry
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleWhatsAppInquiry(selectedProduct)}
                      className="w-full py-3 bg-[#25D366] text-white rounded-full text-xs font-semibold hover:bg-[#20bc5a] transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Direct WhatsApp Chat
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
