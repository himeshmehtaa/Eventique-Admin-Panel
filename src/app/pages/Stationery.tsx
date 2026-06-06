import { useState } from 'react';
import { Link } from 'react-router';
import Slider from 'react-slick';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Check, Printer, FileText, ShoppingCart, ChevronLeft, ChevronRight, Upload, ImageIcon } from 'lucide-react';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';
import lotusImage from '../../imports/image-3.png';
import { useAdmin } from '../admin/context/AdminContext';

export default function Stationery() {
  const { state } = useAdmin();
  const stationeryBlock = state.contentBlocks.find((cb) => cb.sectionName === 'Stationery');
  const [cart, setCart] = useState<string[]>([]);
  const [activeImageIndexes, setActiveImageIndexes] = useState<{ [key: number]: number }>({});
  const [showAllItems, setShowAllItems] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const heroImages = [
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    'https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  ];

  const stationeryCategories = [
    {
      name: 'Save the Date',
      image: 'https://images.unsplash.com/photo-1674227832118-df9f372bff25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Envelopes',
      image: 'https://images.unsplash.com/photo-1606377992446-f48e2db5d5b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Menu Cards',
      image: 'https://images.unsplash.com/photo-1581978154820-45d31f11a060?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Table Numbers',
      image: 'https://images.unsplash.com/photo-1635126039221-5f64c186162a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Signage',
      image: 'https://images.unsplash.com/photo-1600349183244-044448ebf637?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Thank You Cards',
      image: 'https://images.unsplash.com/photo-1758810741366-aff0d0e37e7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Seating Chart',
      image: 'https://images.unsplash.com/photo-1592677818395-72868c4b3c03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Custom Logos',
      image: 'https://images.unsplash.com/photo-1692098075460-6bdb6009b33e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Place Cards',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Invitation Cards',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Ceremony Programs',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Wedding Favors',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Gift Tags',
      image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Drink Menus',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Welcome Signs',
      image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Napkin Rings',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Escort Cards',
      image: 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'RSVP Cards',
      image: 'https://images.unsplash.com/photo-1452827073306-6e6e661baf57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Wishing Well Cards',
      image: 'https://images.unsplash.com/photo-1487700160041-babef9c3cb55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Guest Books',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Bookmarks',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      name: 'Coasters',
      image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
  ];

  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6 text-primary" />
      </button>
    );
  };

  const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6 text-primary" />
      </button>
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const stationeryItems = [
    {
      name: 'Custom Logo Design',
      description: 'Unique monogram or logo for your event branding',
      designPrice: 2499,
      printPrice: 4999,
      deliveryTime: '3-4 days',
      images: [
        'https://images.unsplash.com/photo-1692098075460-6bdb6009b33e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ],
      printDetails: 'Printed on premium paper with gold foiling',
      category: 'Wedding',
      moq: 50,
    },
    {
      name: 'Save the Date Cards',
      description: 'Announce your event date with elegant cards',
      designPrice: 1499,
      printPrice: 3999,
      deliveryTime: '2-3 days',
      images: [
        'https://images.unsplash.com/photo-1674227832118-df9f372bff25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ],
      printDetails: '50 cards - Premium cardstock (350 GSM)',
      category: 'Wedding',
      moq: 50,
    },
    {
      name: 'Welcome Cards',
      description: 'Greet your guests with beautiful welcome cards',
      designPrice: 1299,
      printPrice: 3499,
      deliveryTime: '2-3 days',
      images: [
        'https://images.unsplash.com/photo-1618107158953-dd4c6424b638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        'https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ],
      printDetails: '50 cards - Art cardstock (300 GSM)',
      category: 'Engagement',
      moq: 50,
    },
    {
      name: 'Thank You Cards',
      description: 'Express gratitude with personalized thank you cards',
      designPrice: 1299,
      printPrice: 3499,
      deliveryTime: '2-3 days',
      images: [
        'https://images.unsplash.com/photo-1758810741366-aff0d0e37e7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ],
      printDetails: '50 cards with envelopes - Premium paper',
      category: 'Anniversary',
      moq: 50,
    },
    {
      name: 'Menu Cards',
      description: 'Display your food menu in style',
      designPrice: 1499,
      printPrice: 4499,
      deliveryTime: '2-3 days',
      images: [
        'https://images.unsplash.com/photo-1581978154820-45d31f11a060?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        'https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ],
      printDetails: '100 menu cards - Matte finish cardstock',
      category: 'Wedding',
      moq: 100,
    },
    {
      name: 'Itinerary Cards',
      description: 'Event schedule and timeline cards for guests',
      designPrice: 1599,
      printPrice: 4199,
      deliveryTime: '2-3 days',
      images: [
        'https://images.unsplash.com/photo-1712903276040-c99b32a057eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        'https://images.unsplash.com/photo-1604608672516-688347c4d953?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ],
      printDetails: '50 cards - Double-sided printing',
      category: 'Pooja',
      moq: 50,
    },
    {
      name: 'Seating Chart',
      description: 'Beautiful seating arrangement display design',
      designPrice: 1799,
      printPrice: 5999,
      deliveryTime: '3-4 days',
      images: [
        'https://images.unsplash.com/photo-1592677818395-72868c4b3c03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ],
      printDetails: 'Large format print (24x36") with stand',
      category: 'Kids',
      moq: 1,
    },
    {
      name: 'Event Signage',
      description: 'Custom signage for various event locations',
      designPrice: 1999,
      printPrice: 6999,
      deliveryTime: '3-4 days',
      images: [
        'https://images.unsplash.com/photo-1600349183244-044448ebf637?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        'https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ],
      printDetails: 'Set of 5 signs - Foamboard or acrylic',
      category: 'Party',
      moq: 5,
    },
    {
      name: 'Table Numbers',
      description: 'Elegant table number cards for reception',
      designPrice: 999,
      printPrice: 2999,
      deliveryTime: '1-2 days',
      images: [
        'https://images.unsplash.com/photo-1635126039221-5f64c186162a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      ],
      printDetails: 'Set of 20 numbers - Tent card style',
      category: 'Wedding',
      moq: 20,
    },
  ];

  const handleAddToCart = (itemName: string) => {
    setCart(prev => [...prev, itemName]);
    alert(`${itemName} added to cart!`);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Floating Decorative Elements */}
      <LotusDecor className="absolute top-32 right-16 w-40 h-40 text-primary opacity-40 animate-float" />
      <MandalaDecor className="absolute top-96 left-12 w-56 h-56 text-secondary opacity-35 animate-rotate-slow" />
      <LotusDecor className="absolute bottom-1/3 right-1/3 w-32 h-32 text-accent opacity-40 animate-float" style={{ animationDelay: '3s' }} />

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-[#fdf8f0] via-white to-[#fff5f0] py-16 md:py-24 border-b border-primary/5 mb-8">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column — Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <span>✨ Premium Event Stationery</span>
              </div>
              <h1 className="text-4xl md:text-6xl mb-5 text-[#1a1410] font-serif leading-[1.15] tracking-tight">
                {stationeryBlock?.title || 'Premium Wedding'} <br />
                <span className="text-primary italic">Stationery</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                {stationeryBlock?.subtitle || 'Beautiful designs for every detail of your special day. Select Design Only or Design + Print services.'}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('collection');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/95 hover:scale-105 transition-all shadow-md font-semibold text-sm cursor-pointer"
                >
                  Explore Collection
                </button>
                <Link
                  to="/contact"
                  className="px-6 py-3 bg-white text-gray-700 border border-primary/20 rounded-full hover:bg-primary/5 hover:scale-105 transition-all shadow-sm text-sm"
                >
                  Get Custom Quote
                </Link>
              </div>

              {/* Bullet points */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-[#f0ebe0]">
                {['Design Only or Printed Options', 'Premium Matte & Foil Finishes', 'Express Delivery Worldwide'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column — Collage Mockup */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl blur-3xl opacity-50" />
              <div className="grid grid-cols-2 gap-4 w-full max-w-[480px] relative z-10">
                {heroImages.slice(0, 3).map((src, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl overflow-hidden shadow-xl border-2 border-white/60 hover:scale-[1.03] transition-all duration-500 ${
                      i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'
                    }`}
                  >
                    <ImageWithFallback src={src} alt={`Stationery design ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-12" id="collection">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 relative">
            <MandalaDecor className="absolute -top-10 left-10 w-40 h-40 text-primary opacity-30 animate-rotate-slow" />
            <MandalaDecor className="absolute -top-10 right-10 w-40 h-40 text-secondary opacity-30 animate-rotate-slow" style={{ animationDelay: '2s' }} />

            <div className="flex justify-center mb-6">
              <img src={lotusImage} alt="" className="w-96 h-20 object-contain opacity-35" style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(18%) saturate(1285%) hue-rotate(316deg) brightness(91%) contrast(87%)' }} />
            </div>

            <h2 className="text-3xl md:text-4xl mb-4 relative z-10">Print Stationery</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto relative z-10">
              Get beautifully designed stationery - choose Design Only or Design + Print services
            </p>
          </div>

          {/* Stationery Categories */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl">Explore Our Best Seller Stationeries</h2>
              {stationeryCategories.length > 9 && !showAllCategories && (
                <button
                  onClick={() => setShowAllCategories(true)}
                  className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 group"
                >
                  View All Categories
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

            {showAllCategories ? (
              // Grid view for all categories
              <div className="mb-8">
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                  {stationeryCategories.map((cat, index) => (
                    <div
                      key={index}
                      className="text-center group cursor-pointer"
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-border group-hover:border-primary transition-all shadow-md group-hover:shadow-lg mx-auto">
                        <ImageWithFallback
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {cat.name}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <button
                    onClick={() => setShowAllCategories(false)}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Show Less
                  </button>
                </div>
              </div>
            ) : (
              // Horizontal scroll view for limited categories
              <div className="relative max-w-6xl mx-auto mb-8">
                <button
                  onClick={() => {
                    const container = document.getElementById('categories-scroll');
                    if (container) container.scrollLeft -= 200;
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div
                  id="categories-scroll"
                  className="flex gap-6 overflow-x-auto scroll-smooth px-12 hide-scrollbar"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {(stationeryCategories.length > 9 ? stationeryCategories.slice(0, 9) : stationeryCategories).map((cat, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 text-center group cursor-pointer"
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-border group-hover:border-primary transition-all shadow-md group-hover:shadow-lg">
                        <ImageWithFallback
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors whitespace-nowrap">
                        {cat.name}
                      </p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    const container = document.getElementById('categories-scroll');
                    if (container) container.scrollLeft += 200;
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                  aria-label="Scroll Right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

        {/* Stationery Grid */}
        {stationeryItems.length > 0 ? (
          <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {(showAllItems ? stationeryItems : stationeryItems.slice(0, 8)).map((item, index) => {
              const currentImageIndex = activeImageIndexes[index] || 0;
              return (
                <div
                  key={index}
                  className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all group"
                >
                  {/* Image Carousel */}
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    <ImageWithFallback
                      src={item.images[currentImageIndex]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Carousel Controls - Visible on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveImageIndexes(prev => ({
                                ...prev,
                                [index]: currentImageIndex > 0 ? currentImageIndex - 1 : item.images.length - 1
                              }));
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md z-10"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-4 h-4 text-primary" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveImageIndexes(prev => ({
                                ...prev,
                                [index]: currentImageIndex < item.images.length - 1 ? currentImageIndex + 1 : 0
                              }));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md z-10"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-4 h-4 text-primary" />
                          </button>
                        </>
                      )}

                      {/* Personalize & Buy Overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-16">
                        <Link
                          to={`/stationery/${index}`}
                          className="w-full py-3 bg-white text-primary rounded-full hover:bg-primary hover:text-white transition-all flex items-center justify-center font-semibold text-sm"
                        >
                          Personalize & Buy
                        </Link>
                      </div>
                    </div>

                    {/* Dots Indicator */}
                    {item.images.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                        {item.images.map((_, imgIndex) => (
                          <button
                            key={imgIndex}
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveImageIndexes(prev => ({ ...prev, [index]: imgIndex }));
                            }}
                            className={`h-1.5 rounded-full transition-all ${
                              imgIndex === currentImageIndex
                                ? 'w-6 bg-white'
                                : 'w-1.5 bg-white/50'
                            }`}
                            aria-label={`View image ${imgIndex + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link to={`/stationery/${index}`}>
                      <h3 className="text-base font-semibold hover:text-primary transition-colors line-clamp-1 mb-1">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                      Premium handcrafted design for special occasions
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-primary">
                        ₹{item.designPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Min. Order: {item.moq} pcs
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {stationeryItems.length > 8 && !showAllItems && (
            <div className="text-center mb-16">
              <button
                onClick={() => setShowAllItems(true)}
                className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-semibold"
              >
                View All ({stationeryItems.length} items)
              </button>
            </div>
          )}
          </>
        ) : (
          <div className="text-center py-16 mb-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl mb-2">No items found</h3>
            <p className="text-muted-foreground mb-6">
              No stationery items available at the moment.
            </p>
          </div>
        )}

        {/* Complete Set CTA */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Need Complete Stationery Set?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Get all stationery items bundled together at a discounted price. 
            Perfect for cohesive event branding.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/packages"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              View Packages
            </Link>
            <Link
              to="/order"
              className="px-8 py-4 bg-card text-foreground border border-border rounded-full hover:bg-muted transition-colors"
            >
              Order Custom Set
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Why Choose Our Stationery?</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📐</span>
              </div>
              <h3 className="text-lg mb-2">Print Ready</h3>
              <p className="text-sm text-muted-foreground">High-resolution files ready for printing</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg mb-2">Customizable</h3>
              <p className="text-sm text-muted-foreground">Fully personalized to match your theme</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-lg mb-2">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">Professional designs that impress</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg mb-2">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">Quick turnaround times</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}