import { useState } from 'react';
import { useAdmin } from '../admin/context/AdminContext';
import { Product, OccasionType, ProductType } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { MandalaDecor, PaisleyDecor } from '../components/decorative/FloralDecor';
import lotusImage from '../../imports/image-3.png';
import { MessageCircle, Mail } from 'lucide-react';

type FilterType = 'All' | string;

export default function Explore() {
  const { state } = useAdmin();
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ProductType | 'all'>('all');
  const [selectedSubType, setSelectedSubType] = useState<FilterType>('All');

  const weddingTypes: FilterType[] = ['All', 'Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Etc'];
  const engagementTypes: FilterType[] = ['All', 'Traditional', 'Modern', 'Romantic', 'Garden', 'Destination'];
  const birthdayTypes: FilterType[] = ['All', 'Kids Party', 'Adults', 'Milestone', 'Themed Party', 'Surprise'];
  const babyShowerTypes: FilterType[] = ['All', 'Boy', 'Girl', 'Neutral', 'Vintage', 'Modern'];
  const poojaTypes: FilterType[] = ['All', 'Griha Pravesh', 'Satyanarayan', 'Ganesh Pooja', 'Navratri', 'Diwali'];
  const anniversaryTypes: FilterType[] = ['All', '1st Anniversary', '5th Anniversary', '10th Anniversary', '25th Anniversary', '50th Anniversary'];

  const occasions = [
    { value: 'all', label: 'All' },
    { value: 'wedding', label: 'Weddings' },
    { value: 'engagement', label: 'Engagements' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'baby-shower', label: 'Baby Shower' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'kids', label: 'Kids Party' },
    { value: 'pooja', label: 'Pooja' },
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'video-invite', label: 'Video Invites' },
    { value: 'pdf-invite', label: 'PDF Invites' },
    { value: 'website', label: 'Websites' },
    { value: 'printed-invite', label: 'Printed Invites' },
  ];

  const filteredProducts = state.products.filter((product) => {
    const matchesOccasion = selectedOccasion === 'all' || product.occasion === selectedOccasion;
    const matchesType = selectedType === 'all' || product.type === selectedType;
    return matchesOccasion && matchesType;
  });

  return (
    <div className="py-12 relative overflow-hidden">
      {/* Background Floral Elements */}
      <MandalaDecor className="absolute top-20 right-10 w-64 h-64 text-primary opacity-35 animate-rotate-slow" />
      <PaisleyDecor className="absolute top-1/3 left-10 w-48 h-48 text-secondary opacity-40 animate-float" />
      <MandalaDecor className="absolute bottom-1/4 right-1/3 w-56 h-56 text-accent opacity-35 animate-rotate-slow" style={{ animationDelay: '5s' }} />
      <PaisleyDecor className="absolute bottom-20 left-20 w-40 h-40 text-primary opacity-40 animate-float" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-12 text-center relative">
          <MandalaDecor className="absolute -top-10 left-1/4 w-32 h-32 text-primary opacity-30 animate-rotate-slow" />
          <MandalaDecor className="absolute -top-10 right-1/4 w-32 h-32 text-secondary opacity-30 animate-rotate-slow" style={{ animationDelay: '3s' }} />

          <div className="flex justify-center mb-6">
            <img src={lotusImage} alt="" className="w-96 h-20 object-contain opacity-35" style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(18%) saturate(1285%) hue-rotate(316deg) brightness(91%) contrast(87%)' }} />
          </div>

          <h1 className="text-4xl md:text-5xl mb-4 relative z-10">Explore All Designs</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto relative z-10">
            Browse through our complete collection of beautiful invitations and stationery
          </p>
        </div>

        {/* Occasion Filter Pills */}
        <div className="mb-8 px-4 w-full">
          <div className="flex justify-start md:justify-center overflow-x-auto hide-scrollbar scroll-smooth">
            <div className="bg-[#8B4949] rounded-full p-1.5 flex gap-1.5 md:gap-2 whitespace-nowrap min-w-max">
              {occasions.map((occasion) => (
                <button
                  key={occasion.value}
                  onClick={() => {
                    setSelectedOccasion(occasion.value as OccasionType | 'all');
                    setSelectedSubType('All');
                  }}
                  className={`px-5 py-2 md:px-6 md:py-2.5 rounded-full transition-all duration-300 whitespace-nowrap font-medium text-xs md:text-sm cursor-pointer touch-manipulation active:scale-95 ${
                    selectedOccasion === occasion.value
                      ? 'bg-[#F5E6D8] text-[#8B4949] font-bold shadow-sm'
                      : 'text-white hover:text-white/80'
                  }`}
                >
                  {occasion.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sub-type Filters - Show based on selected occasion */}
        {(selectedOccasion === 'wedding' || selectedOccasion === 'engagement' || selectedOccasion === 'birthday' || selectedOccasion === 'baby-shower' || selectedOccasion === 'pooja' || selectedOccasion === 'anniversary') && (
          <div className="mb-8 w-full">
            <h2 className="text-sm font-semibold text-center mb-3 text-muted-foreground">
              {selectedOccasion === 'wedding' && 'Browse by Wedding Type'}
              {selectedOccasion === 'engagement' && 'Browse by Engagement Style'}
              {selectedOccasion === 'birthday' && 'Browse by Birthday Type'}
              {selectedOccasion === 'baby-shower' && 'Browse by Baby Shower Theme'}
              {selectedOccasion === 'pooja' && 'Browse by Pooja Type'}
              {selectedOccasion === 'anniversary' && 'Browse by Anniversary'}
            </h2>
            <div className="flex justify-start md:justify-center overflow-x-auto hide-scrollbar scroll-smooth w-full px-4">
              <div className="bg-primary/10 backdrop-blur-sm rounded-full p-1.5 border border-primary/20 flex gap-1.5 md:gap-2 whitespace-nowrap min-w-max">
                {selectedOccasion === 'wedding' && weddingTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSubType(type)}
                    className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full transition-all duration-300 whitespace-nowrap font-medium text-xs md:text-sm cursor-pointer touch-manipulation active:scale-95 ${
                      selectedSubType === type
                        ? 'bg-white text-primary shadow-sm font-semibold'
                        : 'text-foreground/70 hover:text-foreground hover:bg-white/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
                {selectedOccasion === 'engagement' && engagementTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSubType(type)}
                    className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full transition-all duration-300 whitespace-nowrap font-medium text-xs md:text-sm cursor-pointer touch-manipulation active:scale-95 ${
                      selectedSubType === type
                        ? 'bg-white text-primary shadow-sm font-semibold'
                        : 'text-foreground/70 hover:text-foreground hover:bg-white/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
                {selectedOccasion === 'birthday' && birthdayTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSubType(type)}
                    className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full transition-all duration-300 whitespace-nowrap font-medium text-xs md:text-sm cursor-pointer touch-manipulation active:scale-95 ${
                      selectedSubType === type
                        ? 'bg-white text-primary shadow-sm font-semibold'
                        : 'text-foreground/70 hover:text-foreground hover:bg-white/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
                {selectedOccasion === 'baby-shower' && babyShowerTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSubType(type)}
                    className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full transition-all duration-300 whitespace-nowrap font-medium text-xs md:text-sm cursor-pointer touch-manipulation active:scale-95 ${
                      selectedSubType === type
                        ? 'bg-white text-primary shadow-sm font-semibold'
                        : 'text-foreground/70 hover:text-foreground hover:bg-white/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
                {selectedOccasion === 'pooja' && poojaTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSubType(type)}
                    className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full transition-all duration-300 whitespace-nowrap font-medium text-xs md:text-sm cursor-pointer touch-manipulation active:scale-95 ${
                      selectedSubType === type
                        ? 'bg-white text-primary shadow-sm font-semibold'
                        : 'text-foreground/70 hover:text-foreground hover:bg-white/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
                {selectedOccasion === 'anniversary' && anniversaryTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSubType(type)}
                    className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full transition-all duration-300 whitespace-nowrap font-medium text-xs md:text-sm cursor-pointer touch-manipulation active:scale-95 ${
                      selectedSubType === type
                        ? 'bg-white text-primary shadow-sm font-semibold'
                        : 'text-foreground/70 hover:text-foreground hover:bg-white/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Type Filter Pills */}
        <div className="mb-12 px-4 w-full">
          <div className="flex justify-start md:justify-center overflow-x-auto hide-scrollbar scroll-smooth">
            <div className="flex gap-2 md:gap-4 whitespace-nowrap min-w-max">
              {types.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value as ProductType | 'all')}
                  className={`px-5 py-2.5 md:px-8 md:py-3 rounded-full transition-all duration-300 whitespace-nowrap font-medium text-xs md:text-sm cursor-pointer touch-manipulation active:scale-95 ${
                    selectedType === type.value
                      ? 'bg-[#8B4949] text-white shadow-sm font-semibold'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 max-w-7xl mx-auto">
          <p className="text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'design' : 'designs'} found
          </p>
        </div>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">No designs found</p>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={() => {
                setSelectedOccasion('all');
                setSelectedType('all');
                setSelectedSubType('All');
              }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Want Something Truly Personalized? */}
        <div className="mt-20 mb-4 max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#faf8f5] via-[#fff8f3] to-[#faf5e6] rounded-3xl p-10 md:p-16 text-center border border-primary/10 overflow-hidden shadow-sm">
            {/* Decorative blobs */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />

            <h2 className="text-3xl md:text-4xl mb-4 relative z-10">Want Something Truly Personalized?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-3 relative z-10">
              Looking for a custom invitation that tells your unique story? Our design team specializes in
              creating one-of-a-kind invitations tailored to your vision, style, and celebration.
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-10 relative z-10">
              From custom illustrations to bespoke animations, we'll bring your dream invitation to life with attention to every detail.
            </p>
            <div className="flex flex-wrap gap-4 justify-center relative z-10">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#25D366] text-white rounded-full hover:bg-[#20bc5a] transition-all hover:scale-105 shadow-lg font-medium"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Us on WhatsApp
              </a>
              <a
                href="mailto:hello@eventique.in"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-foreground border-2 border-primary/20 rounded-full hover:bg-primary/5 hover:border-primary/40 transition-all hover:scale-105 shadow-md font-medium"
              >
                <Mail className="w-5 h-5 text-primary" />
                Send Us an Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}