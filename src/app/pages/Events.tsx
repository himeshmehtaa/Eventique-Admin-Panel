import { useState } from 'react';
import { useAdmin } from '../admin/context/AdminContext';
import { Product, OccasionType, ProductType } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { MandalaDecor, LotusDecor, PaisleyDecor } from '../components/decorative/FloralDecor';
import lotusImage from '../../imports/image-3.png';
import { MessageCircle, Mail, Sparkles, Check, IndianRupee } from 'lucide-react';
import { Link } from 'react-router';

type FilterType = 'All' | string;

export default function Events() {
  const { state } = useAdmin();
  const [activeTab, setActiveTab] = useState<'invitations' | 'packages'>('invitations');
  
  // Invitations tab state
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSubType, setSelectedSubType] = useState<FilterType>('All');

  const weddingTypes: FilterType[] = ['All', 'Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Etc'];
  const engagementTypes: FilterType[] = ['All', 'Traditional', 'Modern', 'Romantic', 'Garden', 'Destination'];
  const birthdayTypes: FilterType[] = ['All', 'Kids Party', 'Adults', 'Milestone', 'Themed Party', 'Surprise'];
  const babyShowerTypes: FilterType[] = ['All', 'Boy', 'Girl', 'Neutral', 'Vintage', 'Modern'];
  const poojaTypes: FilterType[] = ['All', 'Griha Pravesh', 'Satyanarayan', 'Ganesh Pooja', 'Navratri', 'Diwali'];
  const anniversaryTypes: FilterType[] = ['All', '1st Anniversary', '5th Anniversary', '10th Anniversary', '25th Anniversary', '50th Anniversary'];

  const occasions = [
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

  const types = [
    { value: 'all', label: 'All Formats' },
    { value: 'video-invite', label: 'Video Invitations' },
    { value: 'pdf-invite', label: 'PDF Invitations' },
    { value: 'printed-invite', label: 'Printed Invitations' },
  ];

  // Filtering invitations
  const filteredProducts = state.products.filter((product) => {
    // Only display invitation types, not websites or other stationery
    const isInvitation = product.type === 'video-invite' || product.type === 'pdf-invite' || product.type === 'printed-invite' || product.type === 'e-invitation';
    if (!isInvitation) return false;

    // Matches Occasion
    let matchesOccasion = true;
    if (selectedOccasion !== 'all') {
      if (selectedOccasion === 'kids') {
        matchesOccasion = product.occasion === 'birthday' && 
          (product.name.toLowerCase().includes('kids') || product.description.toLowerCase().includes('kids'));
      } else if (selectedOccasion === 'housewarming') {
        matchesOccasion = product.occasion === 'pooja' && 
          (product.name.toLowerCase().includes('housewarming') || product.description.toLowerCase().includes('house') || product.name.toLowerCase().includes('griha'));
      } else {
        matchesOccasion = product.occasion === selectedOccasion;
      }
    }

    // Matches Type (Format)
    let matchesType = true;
    if (selectedType !== 'all') {
      if (selectedType === 'video-invite') {
        matchesType = product.type === 'video-invite';
      } else if (selectedType === 'pdf-invite') {
        matchesType = product.type === 'pdf-invite';
      } else if (selectedType === 'printed-invite') {
        matchesType = product.type === 'printed-invite';
      }
    }

    return matchesOccasion && matchesType;
  });

  const customPackages = [
    {
      id: 'essential',
      name: 'Essential Package',
      description: 'Stunning digital invitation designs to begin your celebration branding',
      price: 3499,
      includes: [
        'Custom Monogram / Logo Design',
        'Digital Invitation Design (PDF format)',
        'Save the Date Card Design',
        '2 Revision Rounds',
        'WhatsApp / Email Delivery Files',
        'Standard Turnaround (3-4 days)'
      ],
      savings: 1000,
      badge: 'Invitation Design'
    },
    {
      id: 'premium',
      name: 'Premium Package',
      description: 'Complete digital and video invitations kit for multi-platform sharing',
      price: 7999,
      includes: [
        'Custom Monogram / Logo Design',
        'High Definition Video Invitation',
        'Interactive E-invitation Card',
        'Print-Ready PDF Invitation Card',
        'Save the Date Animated Graphics',
        'Unlimited Revision Rounds',
        'Priority Turnaround (2-3 days)',
        'Dedicated Designer Support'
      ],
      savings: 3500,
      popular: true,
      badge: 'Video + PDF + Printed'
    },
    {
      id: 'luxury',
      name: 'Luxury Package',
      description: 'The ultimate bespoke experience bridging digital invites with luxury physical stationery',
      price: 14999,
      includes: [
        'Everything in Premium Package',
        'Print-Ready Custom Stationery Designs (5 items)',
        'Bespoke Stage Graphic & Backdrop Art',
        'Welcome Board Design',
        'Gift Tag & Box Sleeve Layouts',
        'Printed Sample Card Shipping (Optional)',
        '24/7 Dedicated Manager Support',
        'Custom Handdrawn Illustrations'
      ],
      savings: 6500,
      badge: 'Invitation + Stationery'
    }
  ];

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
            Invitations &amp; Event Design
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto font-light leading-relaxed">
            Beautiful invitations, bespoke stationery, and design packages tailored for your special celebrations.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#8B4949]/15 border border-[#8B4949]/20 rounded-full p-1.5 flex gap-1">
            <button
              onClick={() => setActiveTab('invitations')}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'invitations'
                  ? 'bg-[#8B4949] text-white shadow-md'
                  : 'text-[#8B4949] hover:bg-[#8B4949]/10'
              }`}
            >
              Invitations
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'packages'
                  ? 'bg-[#8B4949] text-white shadow-md'
                  : 'text-[#8B4949] hover:bg-[#8B4949]/10'
              }`}
            >
              Packages
            </button>
          </div>
        </div>

        {/* TAB 1: INVITATIONS TAB */}
        {activeTab === 'invitations' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* Occasion Categories Filters */}
            <div className="w-full">
              <div className="flex justify-start md:justify-center overflow-x-auto hide-scrollbar scroll-smooth">
                <div className="bg-[#8B4949] rounded-full p-1.5 flex gap-1.5 whitespace-nowrap min-w-max">
                  {occasions.map((occ) => (
                    <button
                      key={occ.value}
                      onClick={() => {
                        setSelectedOccasion(occ.value);
                        setSelectedSubType('All');
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

            {/* Type Formats Filter */}
            <div className="w-full">
              <div className="flex justify-start md:justify-center overflow-x-auto hide-scrollbar scroll-smooth">
                <div className="flex gap-2 whitespace-nowrap min-w-max">
                  {types.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`px-6 py-2.5 rounded-full transition-all duration-300 text-xs md:text-sm font-semibold cursor-pointer ${
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

            {/* Results Count */}
            <div className="flex items-center justify-between border-b border-[#f0ebe0] pb-4">
              <p className="text-slate-500 font-light text-sm">
                Showing {filteredProducts.length} design{filteredProducts.length === 1 ? '' : 's'}
              </p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <p className="text-xl text-slate-500 mb-2 font-semibold">No invitation designs found</p>
                <p className="text-slate-400 mb-6 font-light">Try adjusting your category or format filters.</p>
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

            {/* Personalization Contact Banner */}
            <div className="relative bg-gradient-to-br from-white to-[#fff8f3] rounded-3xl p-8 md:p-12 text-center border border-primary/10 overflow-hidden shadow-sm mt-16">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
              <h2 className="text-2xl md:text-3xl mb-3 font-bold text-slate-900" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Looking for a Custom Invitation Design?
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                Our design studio specializes in custom monograms, hand-drawn illustrations, and bespoke video animations tailored specifically to your unique story and celebration.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#25D366] text-white rounded-full hover:bg-[#20bc5a] hover:scale-105 transition-all shadow-md font-semibold text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-slate-700 border border-primary/20 rounded-full hover:bg-primary/5 hover:scale-105 transition-all shadow-sm font-semibold text-sm"
                >
                  <Mail className="w-4 h-4 text-primary" /> Send Inquiry
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PACKAGES TAB */}
        {activeTab === 'packages' && (
          <div className="space-y-12 animate-in fade-in duration-500 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {customPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative rounded-3xl p-8 bg-white border border-slate-200 shadow-sm transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:border-slate-300 ${
                    pkg.popular ? 'border-primary ring-2 ring-primary/20 md:scale-[1.03] z-10' : ''
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-primary text-white text-xs font-bold uppercase rounded-full tracking-wider shadow-md inline-flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Best Seller
                      </span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest block font-mono">{pkg.badge}</span>
                      <h3 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-light leading-relaxed min-h-[40px] px-2">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="w-full h-[1px] bg-slate-100" />

                    {/* Price */}
                    <div className="text-center">
                      <div className="flex items-center justify-center text-slate-900">
                        <IndianRupee className="w-6 h-6 text-primary flex-shrink-0" />
                        <span className="text-4xl font-extrabold tracking-tight">{pkg.price.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-xs text-emerald-600 font-semibold mt-1">
                        Save ₹{pkg.savings.toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Includes List */}
                    <ul className="space-y-3 pt-2">
                      {pkg.includes.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-600 leading-relaxed font-light">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4">
                    <Link
                      to="/order"
                      state={{ package: pkg }}
                      className={`block w-full py-3.5 rounded-full text-center text-sm font-semibold transition-all hover:scale-[1.01] ${
                        pkg.popular
                          ? 'bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/10'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom package request */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-lg border border-slate-800">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className="relative z-10 max-w-xl mx-auto space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Need a Fully Custom Package?
                </h3>
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  Looking for a modular combination of digital invitations, event websites, printed cards, or unique gift hampers? Let us build a bespoke design proposal tailored for you.
                </p>
                <div className="pt-2">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-primary/95 transition-all text-sm shadow-md"
                  >
                    Request Custom Quote
                    <Check className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
