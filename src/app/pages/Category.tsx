import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { products, ProductType } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ArrowLeft } from 'lucide-react';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';

type FilterType = 'All' | string;

export default function Category() {
  const { occasion } = useParams<{ occasion: string }>();
  const [selectedSubType, setSelectedSubType] = useState<FilterType>('All');
  const [selectedInviteType, setSelectedInviteType] = useState<ProductType | 'all'>('all');

  const weddingTypes: FilterType[] = ['All', 'Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Etc'];
  const engagementTypes: FilterType[] = ['All', 'Traditional', 'Modern', 'Romantic', 'Garden', 'Destination'];
  const birthdayTypes: FilterType[] = ['All', 'Kids Party', 'Adults', 'Milestone', 'Themed Party', 'Surprise'];
  const babyShowerTypes: FilterType[] = ['All', 'Boy', 'Girl', 'Neutral', 'Vintage', 'Modern'];
  const poojaTypes: FilterType[] = ['All', 'Griha Pravesh', 'Satyanarayan', 'Ganesh Pooja', 'Navratri', 'Diwali'];
  const anniversaryTypes: FilterType[] = ['All', '1st Anniversary', '5th Anniversary', '10th Anniversary', '25th Anniversary', '50th Anniversary'];

  const categoryTitles: Record<string, string> = {
    wedding: 'Wedding Invitations',
    engagement: 'Engagement Invitations',
    birthday: 'Birthday Invitations',
    'baby-shower': 'Baby Shower Invitations',
    pooja: 'Pooja Invitations',
    anniversary: 'Anniversary Invitations',
  };

  const categoryDescriptions: Record<string, string> = {
    wedding: 'Elegant and stunning wedding invitation designs for your special day',
    engagement: 'Beautiful engagement invitation designs to announce your love story',
    birthday: 'Fun and creative birthday invitation designs for all ages',
    'baby-shower': 'Adorable baby shower invitation designs to celebrate the new arrival',
    pooja: 'Traditional and spiritual invitation designs for religious ceremonies',
    anniversary: 'Celebrate your love milestone with beautiful anniversary invitations',
  };

  let categoryProducts = products.filter((p) => p.occasion === occasion);

  // Filter by invite type
  if (selectedInviteType !== 'all') {
    categoryProducts = categoryProducts.filter((p) => p.type === selectedInviteType);
  }

  if (!occasion || !categoryTitles[occasion]) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl mb-4">Category not found</h1>
        <Link to="/explore" className="text-primary hover:underline">
          Browse all designs
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 relative overflow-hidden">
      {/* Background Floral Elements */}
      <MandalaDecor className="absolute top-10 right-12 w-56 h-56 text-primary opacity-35 animate-rotate-slow" />
      <LotusDecor className="absolute top-1/4 left-10 w-40 h-40 text-secondary opacity-40 animate-float" />
      <MandalaDecor className="absolute bottom-1/3 right-1/4 w-48 h-48 text-accent opacity-35 animate-rotate-slow" style={{ animationDelay: '4s' }} />
      <LotusDecor className="absolute bottom-16 left-1/4 w-36 h-36 text-primary opacity-40 animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Breadcrumb */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Designs</span>
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">{categoryTitles[occasion]}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {categoryDescriptions[occasion]}
          </p>
        </div>

        {/* Sub-type Filters - Show based on occasion */}
        {(occasion === 'wedding' || occasion === 'engagement' || occasion === 'birthday' || occasion === 'baby-shower' || occasion === 'pooja' || occasion === 'anniversary') && (
          <div className="mb-12">
            <h2 className="text-base font-semibold text-center mb-3 text-muted-foreground">
              {occasion === 'wedding' && 'Browse by Wedding Type'}
              {occasion === 'engagement' && 'Browse by Engagement Style'}
              {occasion === 'birthday' && 'Browse by Birthday Type'}
              {occasion === 'baby-shower' && 'Browse by Baby Shower Theme'}
              {occasion === 'pooja' && 'Browse by Pooja Type'}
              {occasion === 'anniversary' && 'Browse by Anniversary'}
            </h2>
            <div className="flex justify-center">
              <div className="bg-primary/10 backdrop-blur-sm rounded-full p-1.5 border border-primary/20 overflow-x-auto hide-scrollbar inline-block">
                <div className="flex gap-2 min-w-max px-2">
                  {occasion === 'wedding' && weddingTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedSubType(type)}
                      className={`px-5 py-2 rounded-full transition-all duration-300 whitespace-nowrap font-medium text-sm ${
                        selectedSubType === type
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-foreground/70 hover:text-foreground hover:bg-white/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                  {occasion === 'engagement' && engagementTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedSubType(type)}
                      className={`px-5 py-2 rounded-full transition-all duration-300 whitespace-nowrap font-medium text-sm ${
                        selectedSubType === type
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-foreground/70 hover:text-foreground hover:bg-white/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                  {occasion === 'birthday' && birthdayTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedSubType(type)}
                      className={`px-5 py-2 rounded-full transition-all duration-300 whitespace-nowrap font-medium text-sm ${
                        selectedSubType === type
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-foreground/70 hover:text-foreground hover:bg-white/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                  {occasion === 'baby-shower' && babyShowerTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedSubType(type)}
                      className={`px-5 py-2 rounded-full transition-all duration-300 whitespace-nowrap font-medium text-sm ${
                        selectedSubType === type
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-foreground/70 hover:text-foreground hover:bg-white/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                  {occasion === 'pooja' && poojaTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedSubType(type)}
                      className={`px-5 py-2 rounded-full transition-all duration-300 whitespace-nowrap font-medium text-sm ${
                        selectedSubType === type
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-foreground/70 hover:text-foreground hover:bg-white/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                  {occasion === 'anniversary' && anniversaryTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedSubType(type)}
                      className={`px-5 py-2 rounded-full transition-all duration-300 whitespace-nowrap font-medium text-sm ${
                        selectedSubType === type
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-foreground/70 hover:text-foreground hover:bg-white/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invite Type Filter */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => setSelectedInviteType('all')}
              className={`px-6 py-2.5 rounded-full transition-all ${
                selectedInviteType === 'all'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-foreground hover:bg-primary/10'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedInviteType('video-invite')}
              className={`px-6 py-2.5 rounded-full transition-all ${
                selectedInviteType === 'video-invite'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-foreground hover:bg-primary/10'
              }`}
            >
              Video Invites
            </button>
            <button
              onClick={() => setSelectedInviteType('pdf-invite')}
              className={`px-6 py-2.5 rounded-full transition-all ${
                selectedInviteType === 'pdf-invite'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-foreground hover:bg-primary/10'
              }`}
            >
              PDF Invites
            </button>
            <button
              onClick={() => setSelectedInviteType('website')}
              className={`px-6 py-2.5 rounded-full transition-all ${
                selectedInviteType === 'website'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-foreground hover:bg-primary/10'
              }`}
            >
              Websites
            </button>
            <button
              onClick={() => setSelectedInviteType('printed-invite')}
              className={`px-6 py-2.5 rounded-full transition-all ${
                selectedInviteType === 'printed-invite'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-foreground hover:bg-primary/10'
              }`}
            >
              Printed Invites
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-muted-foreground">
            {categoryProducts.length} {categoryProducts.length === 1 ? 'design' : 'designs'} found
          </p>
        </div>

        {/* Products Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">No designs available for this filter</p>
            <p className="text-muted-foreground mb-6">
              Try selecting a different filter or browse all designs
            </p>
            <button
              onClick={() => {
                setSelectedInviteType('all');
                setSelectedSubType('All');
              }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors inline-block"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Custom Personalized Section */}
        <div className="mt-20 mb-12">
          <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 shadow-lg">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
                Want Something Truly Personalized?
              </h2>
              <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                Looking for a custom invitation that tells your unique story? Our design team specializes in creating one-of-a-kind invitations tailored to your vision, style, and celebration.
              </p>
              <p className="text-base text-muted-foreground mb-8">
                From custom illustrations to bespoke animations, we'll bring your dream invitation to life with attention to every detail.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/1234567890?text=Hi! I'm interested in a custom personalized invitation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Contact Us on WhatsApp
                </a>
                <a
                  href="mailto:custom@eventique.com"
                  className="px-8 py-4 bg-white border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-md font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Us an Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
