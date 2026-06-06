import { useState } from 'react';
import { Link, useParams } from 'react-router';
import Slider from 'react-slick';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ShoppingCart, ChevronLeft, ChevronRight, Heart, Share2, Package, Star } from 'lucide-react';

export default function StationeryDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(40);
  const [selectedSize, setSelectedSize] = useState('S - 1.5inch');
  const [serviceType, setServiceType] = useState<'design' | 'print'>('design');

  // Mock data - in real app, fetch based on id
  const product = {
    name: 'Heart Design Money / Gift Envelope',
    description: 'Beautiful handcrafted textured paper envelopes perfect for weddings, parties, and special occasions. Each envelope is carefully made with premium materials.',
    images: [
      'https://images.unsplash.com/photo-1692098075460-6bdb6009b33e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    designPrice: 125,
    printPrice: 1200,
    moq: 10,
    category: 'Wedding',
    specifications: {
      dimensions: '5.9 x 8.6 cm',
      material: 'Handmade Textured paper',
      thickness: '180-200 gsm',
      fit: 'Accommodates 8.6 x 5.6 cm paper/insert',
      includes: '5 Envelopes Only',
    },
    delivery: {
      minDays: 22,
      maxDays: 26,
    },
    packs: [
      { quantity: 10, price: 125, minOrder: 10 },
      { quantity: 100, price: 1200, minOrder: 100 },
    ],
  };

  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5 text-primary" />
      </button>
    );
  };

  const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5 text-primary" />
      </button>
    );
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (_: number, next: number) => setActiveImageIndex(next),
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/stationery" className="hover:text-primary">Stationery</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Image Gallery */}
          <div>
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-3 w-20">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === index
                        ? 'border-primary shadow-md'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image Carousel */}
              <div className="flex-1 bg-muted rounded-2xl overflow-hidden">
                <Slider {...sliderSettings}>
                  {product.images.map((img, index) => (
                    <div key={index} className="aspect-square">
                      <ImageWithFallback
                        src={img}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>

          {/* Right - Product Details */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-2xl mb-2 font-semibold">{product.name}</h1>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {product.category}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-muted transition-all">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-muted transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Service Type Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Select Service</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setServiceType('design')}
                  className={`flex-1 px-6 py-3.5 rounded-xl font-medium transition-all shadow-sm ${
                    serviceType === 'design'
                      ? 'bg-[#8B4949] text-white shadow-md'
                      : 'bg-white border-2 border-border text-foreground hover:border-primary hover:text-primary'
                  }`}
                >
                  Design Only
                </button>
                <button
                  onClick={() => setServiceType('print')}
                  className={`flex-1 px-6 py-3.5 rounded-xl font-medium transition-all shadow-sm ${
                    serviceType === 'print'
                      ? 'bg-[#8B4949] text-white shadow-md'
                      : 'bg-white border-2 border-border text-foreground hover:border-primary hover:text-primary'
                  }`}
                >
                  Design & Print
                </button>
              </div>
            </div>

            {/* Price - Highlighted */}
            <div className="mb-6 bg-primary/5 border border-primary/20 rounded-xl p-5">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-[#8B4949]">
                  ₹{(serviceType === 'design' ? product.designPrice : product.printPrice).toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-muted-foreground">starting</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {serviceType === 'design' ? 'Digital design file delivered' : 'Printed stationery with design'}
              </p>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Package className="w-4 h-4 text-primary" />
                <span>Delivered in {product.delivery.minDays}-{product.delivery.maxDays} days</span>
              </div>
            </div>

            {/* Specifications */}
            <div className="mb-6">
              <p className="text-sm mb-4 font-semibold text-primary">Orders placed before 5:30pm will be shipped on the same day</p>
              <div className="bg-muted/30 rounded-xl p-4">
                <h3 className="text-sm font-semibold mb-3">Product Specifications</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Dimension:</strong> {product.specifications.dimensions}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Material:</strong> {product.specifications.material}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Thickness:</strong> {product.specifications.thickness}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Fit:</strong> {product.specifications.fit}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Includes:</strong> {product.specifications.includes}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Stickers Quantity */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-3">Stickers Quantity</h3>
              <div className="flex flex-wrap gap-2">
                {[40, 80, 150, 200, 300, 500, 1000, 1500, 2000].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => setSelectedQuantity(qty)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                      selectedQuantity === qty
                        ? 'bg-[#8B4949] text-white shadow-md'
                        : 'bg-white border border-border text-foreground hover:border-primary hover:text-primary'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Size <span className="text-xs text-muted-foreground font-normal">(Medium Recommended)</span></h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'S - 1.5inch', value: 'S - 1.5inch' },
                  { label: 'M - 2inch', value: 'M - 2inch' },
                  { label: 'L - 3inch', value: 'L - 3inch' },
                  { label: 'XL - 5inch', value: 'XL - 5inch' },
                ].map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSelectedSize(size.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                      selectedSize === size.value
                        ? 'bg-[#8B4949] text-white shadow-md'
                        : 'bg-white border border-border text-foreground hover:border-primary hover:text-primary'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <div className="flex gap-3 mb-3">
                <button className="flex-1 py-3.5 bg-white border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <Link
                  to="/order"
                  className="flex-1 py-3.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all flex items-center justify-center font-semibold shadow-md hover:shadow-lg"
                >
                  Buy Now
                </Link>
              </div>

              {/* WhatsApp Button */}
              <button className="w-full py-3.5 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Customize on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mt-16">
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#8B4949]/10 text-[#8B4949] rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              ✦ Client Reviews
            </span>
            <h2 className="text-3xl text-[#1a1410]">What Our Clients Say</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: 'Priya Sharma', rating: 5, date: 'March 2026', comment: 'Absolutely beautiful! The quality exceeded my expectations. The handmade texture gives it such an elegant feel.', verified: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100', event: 'Wedding · Delhi' },
              { name: 'Rahul Mehta', rating: 5, date: 'February 2026', comment: 'Perfect for our wedding! Fast delivery and amazing customer service. Highly recommend!', verified: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100', event: 'Wedding · Mumbai' },
              { name: 'Anjali Patel', rating: 4, date: 'January 2026', comment: 'Great product! The material is premium and the design is lovely. Would order again for our next event.', verified: true, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100', event: 'Anniversary · Bangalore' },
            ].map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <ImageWithFallback src={r.avatar} alt={r.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1410]">{r.name}</p>
                    <p className="text-[10px] text-gray-400">{r.event}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s < r.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{r.comment}</p>
                {r.verified && (
                  <span className="mt-3 inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">✓ Verified Purchase</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* You May Also Like */}
        <div className="mt-16 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#1a1410]">You May Also Like</h2>
            <Link
              to="/stationery"
              className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 group"
            >
              See More Designs
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { id: 1, name: 'Save the Date Cards', price: 1499, category: 'Wedding', moq: 10, image: 'https://images.unsplash.com/photo-1674227832118-df9f372bff25?w=400&h=300&fit=crop' },
              { id: 2, name: 'Welcome Cards', price: 1299, category: 'Engagement', moq: 10, image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop' },
              { id: 3, name: 'Thank You Cards', price: 1299, category: 'Anniversary', moq: 10, image: 'https://images.unsplash.com/photo-1758810741366-aff0d0e37e7f?w=400&h=300&fit=crop' },
              { id: 4, name: 'Menu Cards', price: 999, category: 'Wedding', moq: 10, image: 'https://images.unsplash.com/photo-1581978154820-45d31f11a060?w=400&h=300&fit=crop' }
            ].map((item) => (
              <div key={item.id} className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all">
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Wishlist & Share Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2 z-20">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                      >
                        <Heart className="w-5 h-5 text-primary" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                      >
                        <Share2 className="w-5 h-5 text-primary" />
                      </button>
                    </div>

                    {/* Personalize & Buy Button */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-16">
                      <Link
                        to={`/stationery/${item.id}`}
                        className="w-full py-3 bg-white text-primary rounded-full hover:bg-primary hover:text-white transition-all flex items-center justify-center font-semibold text-sm"
                      >
                        Personalize & Buy
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <Link to={`/stationery/${item.id}`}>
                    <h3 className="text-base font-semibold hover:text-primary transition-colors line-clamp-1 mb-1">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                    Premium handcrafted design for special occasions
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-primary">
                      ₹{item.price.toLocaleString('en-IN')}
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
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
