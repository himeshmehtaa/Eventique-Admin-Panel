import { Link } from 'react-router';
import { Product } from '../data/products';
import { Clock, Heart, Share2, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: Product;
}

const extraImagesByOccasion: Record<string, string[]> = {
  wedding: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&fit=crop',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&fit=crop',
  ],
  engagement: [
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&fit=crop',
    'https://images.unsplash.com/photo-1543161949-1f9193812ce8?w=600&fit=crop',
  ],
  birthday: [
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&fit=crop',
  ],
  'baby-shower': [
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&fit=crop',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&fit=crop',
  ],
  anniversary: [
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&fit=crop',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&fit=crop',
  ],
  pooja: [
    'https://images.unsplash.com/photo-1680490964983-ca02f691960f?w=600&fit=crop',
    'https://images.unsplash.com/photo-1600298882546-98ebecd47be3?w=600&fit=crop',
  ],
  kids: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&fit=crop',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&fit=crop',
  ],
};

function getTier(price: number) {
  if (price >= 3000) return { label: 'Luxury', cls: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white' };
  if (price >= 1800) return { label: 'Premium', cls: 'bg-gradient-to-r from-[#8B4949] to-[#b05555] text-white' };
  return { label: 'Standard', cls: 'bg-slate-500 text-white' };
}

export function ProductCard({ product }: ProductCardProps) {
  const typeLabels: Record<string, string> = {
    'video-invite': 'Video Invitation',
    'pdf-invite': 'PDF Invitation',
    'e-invitation': 'E-Invitation',
    'wedding-website': 'Wedding Website',
    'stationery': 'Stationery',
    'website': 'Wedding Website',
    'printed-invite': 'Printed Invitation',
  };

  const isCarousel = product.type === 'pdf-invite' || product.type === 'printed-invite';
  const isVideo = product.type === 'video-invite';

  const carouselImages = isCarousel
    ? [product.imageUrl, ...(extraImagesByOccasion[product.occasion] || extraImagesByOccasion.wedding)]
    : [product.imageUrl];

  const [currentImage, setCurrentImage] = useState(0);
  const tier = getTier(product.price);

  useEffect(() => {
    if (!isCarousel) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isCarousel, carouselImages.length]);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert('Added to wishlist!');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: product.name, text: product.description, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % carouselImages.length);
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-scale">
      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden bg-muted relative">
        <ImageWithFallback
          src={carouselImages[currentImage]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Video Play Button — always visible for video invites */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Play className="w-6 h-6 text-primary fill-primary ml-1" />
            </div>
          </div>
        )}

        {/* Carousel controls for PDF & Printed Invites */}
        {isCarousel && carouselImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <ChevronLeft className="w-4 h-4 text-primary" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <ChevronRight className="w-4 h-4 text-primary" />
            </button>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {carouselImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImage(i); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImage ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute top-3 right-3 flex gap-2 z-20">
            <button
              onClick={handleWishlist}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
              aria-label="Add to Wishlist"
            >
              <Heart className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={handleShare}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5 text-primary" />
            </button>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-16">
            <Link
              to={`/product/${product.id}`}
              className="w-full py-3 bg-white text-primary rounded-full hover:bg-primary hover:text-white transition-all flex items-center justify-center font-semibold text-sm"
            >
              Personalize & Buy
            </Link>
          </div>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3 z-10">
          <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-primary text-xs rounded-full border border-primary/20 shadow-md">
            {typeLabels[product.type] || product.type}
          </div>
        </div>
        
        {/* Offer Tag */}
        {product.promoTag && (
          <div className="absolute top-3 right-3 z-10">
            <div className="inline-flex items-center px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold rounded-full shadow-md uppercase tracking-wider">
              {product.promoTag}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link to={`/product/${product.id}`} className="flex-1 min-w-0">
            <h3 className="text-base font-semibold hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <span className={`shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${tier.cls}`}>
            {tier.label}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-baseline gap-0.5">
              <span className="text-xs text-muted-foreground">₹</span>
              <span className="text-lg font-bold text-primary">{product.price.toLocaleString('en-IN')}</span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through opacity-60">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{product.deliveryTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
