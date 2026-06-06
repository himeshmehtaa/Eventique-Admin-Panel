import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ShoppingCart, Heart, Share2, Package, Play, ExternalLink, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdmin } from '../admin/context/AdminContext';

export default function InvitationDetail() {
  const { state } = useAdmin();
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const product = state.products.find((p) => p.id === id) || state.products[0];

  const typeLabels: Record<string, string> = {
    'video-invite': 'Video Invitation',
    'pdf-invite': 'PDF Invitation',
    'e-invitation': 'Gifts / E-Invitation',
    'wedding-website': 'Wedding Website',
    'stationery': 'Wedding Stationery',
    'website': 'Wedding Website',
    'printed-invite': 'Printed Invitation',
  };

  const fallbackImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  ];

  const images = [product.imageUrl, ...(product.images || [])].filter(Boolean);
  if (images.length === 1 && (!product.images || product.images.length === 0)) {
    images.push(...fallbackImages);
  }

  const invitation = {
    id: product.id,
    name: product.name,
    type: typeLabels[product.type] || product.type,
    typeRaw: product.type,
    description: product.description,
    images: images,
    videoUrl: product.videoUrl,
    demoUrl: product.demoUrl,
    price: product.price,
    category: product.occasion.charAt(0).toUpperCase() + product.occasion.slice(1),
    deliveryTime: product.deliveryTime,
    features: product.features && product.features.length > 0 ? product.features : [
      'Premium Custom Design',
      'Custom Text & Names',
      'WhatsApp Optimized Format',
      'Fast Delivery & Revisions',
    ],
    // Dynamic specifications
    size: product.size,
    moq: product.moq,
    material: product.material,
    canPersonalise: product.canPersonalise,
    paperQuality: product.paperQuality,
    shape: product.shape,
    color: product.color,
  };


  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/explore" className="hover:text-primary">Explore</Link>
          <span>/</span>
          <span className="text-foreground">{invitation.name}</span>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Left - Video Preview */}
            <div>
              {/* Main Preview */}
              <div className="bg-muted rounded-xl overflow-hidden mb-3 relative group">
                <div className="aspect-[4/5] relative">
                  <ImageWithFallback
                    src={invitation.images[selectedImageIndex]}
                    alt={invitation.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Play Button Overlay */}
                  {(invitation.typeRaw === 'video-invite' || invitation.videoUrl) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                      <button
                        onClick={() => {
                          if (invitation.videoUrl) {
                            window.open(invitation.videoUrl, '_blank');
                          } else {
                            window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
                          }
                        }}
                        className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl cursor-pointer"
                      >
                        <Play className="w-8 h-8 text-primary ml-1" />
                      </button>
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {invitation.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? invitation.images.length - 1 : prev - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white text-[#8B4949] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer z-10"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedImageIndex((prev) => (prev === invitation.images.length - 1 ? 0 : prev + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white text-[#8B4949] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer z-10"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Dot Indicators */}
                  {invitation.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      {invitation.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            selectedImageIndex === idx ? 'bg-[#D4AF37] w-3.5' : 'bg-white/60 hover:bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                {invitation.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-primary shadow-md'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${invitation.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Details */}
            <div className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-2xl font-semibold mb-2">{invitation.name}</h1>
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {invitation.type}
                  </span>
                  <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                    {invitation.category}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-9 h-9 border border-border rounded-full flex items-center justify-center hover:bg-muted transition-all">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 border border-border rounded-full flex items-center justify-center hover:bg-muted transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Price - Highlighted */}
            <div className="mb-4 bg-primary/5 border border-primary/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">₹{invitation.price.toLocaleString('en-IN')}</span>
                  <span className="text-sm text-muted-foreground">/ invitation</span>
                </div>
                {invitation.originalPrice && invitation.originalPrice > invitation.price && (
                  <span className="text-lg text-muted-foreground line-through opacity-60">
                    ₹{invitation.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {invitation.promoTag && (
                  <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                    {invitation.promoTag}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Package className="w-4 h-4 text-primary" />
                <span>Delivered in {invitation.deliveryTime}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 text-foreground">About this Invitation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {invitation.description}
              </p>
            </div>

            {/* Features & Specifications Combined */}
            <div className="mb-4 bg-muted/30 rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Features */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-primary">What's Included</h3>
                  <ul className="space-y-2">
                    {invitation.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5 font-bold">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-primary">Specifications</h3>
                  <div className="space-y-3 text-sm">
                    {invitation.size && (
                      <div className="flex justify-between border-b border-gray-100/50 pb-1">
                        <span className="text-muted-foreground text-xs">Size / Dimensions</span>
                        <span className="font-semibold text-foreground text-xs md:text-sm">{invitation.size}</span>
                      </div>
                    )}
                    {invitation.moq && (
                      <div className="flex justify-between border-b border-gray-100/50 pb-1">
                        <span className="text-muted-foreground text-xs">Minimum Order Qty</span>
                        <span className="font-semibold text-foreground text-xs md:text-sm">{invitation.moq}</span>
                      </div>
                    )}
                    {invitation.material && (
                      <div className="flex justify-between border-b border-gray-100/50 pb-1">
                        <span className="text-muted-foreground text-xs">Material</span>
                        <span className="font-semibold text-foreground text-xs md:text-sm">{invitation.material}</span>
                      </div>
                    )}
                    {invitation.paperQuality && (
                      <div className="flex justify-between border-b border-gray-100/50 pb-1">
                        <span className="text-muted-foreground text-xs">Paper Quality</span>
                        <span className="font-semibold text-foreground text-xs md:text-sm">{invitation.paperQuality}</span>
                      </div>
                    )}
                    {invitation.shape && (
                      <div className="flex justify-between border-b border-gray-100/50 pb-1">
                        <span className="text-muted-foreground text-xs">Shape</span>
                        <span className="font-semibold text-foreground text-xs md:text-sm">{invitation.shape}</span>
                      </div>
                    )}
                    {invitation.color && (
                      <div className="flex justify-between border-b border-gray-100/50 pb-1">
                        <span className="text-muted-foreground text-xs">Colour Theme</span>
                        <span className="font-semibold text-foreground text-xs md:text-sm">{invitation.color}</span>
                      </div>
                    )}
                    {invitation.canPersonalise && (
                      <div className="flex justify-between border-b border-gray-100/50 pb-1">
                        <span className="text-muted-foreground text-xs">Personalization</span>
                        <span className="font-semibold text-green-600 text-xs md:text-sm">
                          ✓ Available
                        </span>
                      </div>
                    )}

                    {/* Web link specs */}
                    {invitation.demoUrl && (
                      <div className="flex justify-between border-b border-gray-100/50 pb-1">
                        <span className="text-muted-foreground text-xs">Live Demo</span>
                        <span className="font-semibold text-primary text-xs md:text-sm">
                          <a href={invitation.demoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1">
                            View Live Demo <ExternalLink className="w-3 h-3" />
                          </a>
                        </span>
                      </div>
                    )}

                    {/* Video link specs */}
                    {invitation.videoUrl && (
                      <div className="flex justify-between border-b border-gray-100/50 pb-1">
                        <span className="text-muted-foreground text-xs">Video Link</span>
                        <span className="font-semibold text-primary text-xs md:text-sm">
                          <a href={invitation.videoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1">
                            Watch Video <ExternalLink className="w-3 h-3" />
                          </a>
                        </span>
                      </div>
                    )}

                    {/* Default specifications fallback only if it is a video-invite and doesn't have custom size/material/moq/demoUrl */}
                    {!invitation.size && !invitation.material && !invitation.moq && !invitation.demoUrl && (invitation.typeRaw === 'video-invite' || !invitation.videoUrl) && (
                      <>
                        <div className="flex justify-between border-b border-gray-100/50 pb-1">
                          <span className="text-muted-foreground text-xs">Duration</span>
                          <span className="font-semibold text-foreground text-xs md:text-sm">1-2 minutes</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100/50 pb-1">
                          <span className="text-muted-foreground text-xs">Format</span>
                          <span className="font-semibold text-foreground text-xs md:text-sm">MP4, MOV</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100/50 pb-1">
                          <span className="text-muted-foreground text-xs">Resolution</span>
                          <span className="font-semibold text-foreground text-xs md:text-sm">1920x1080 (Full HD)</span>
                        </div>
                        <div className="flex justify-between pb-1">
                          <span className="text-muted-foreground text-xs">File Size</span>
                          <span className="font-semibold text-foreground text-xs md:text-sm">Optimized for WhatsApp</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div>
              {invitation.demoUrl && (
                <a
                  href={invitation.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg text-center mb-3 cursor-pointer active:scale-95 touch-manipulation"
                >
                  <Sparkles className="w-4 h-4" />
                  View Live Demo
                </a>
              )}
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <button className="w-full sm:flex-1 py-3.5 bg-white border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md cursor-pointer active:scale-95 touch-manipulation">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <Link
                  to="/order"
                  className="w-full sm:flex-1 py-3.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all flex items-center justify-center font-semibold shadow-md hover:shadow-lg text-center cursor-pointer active:scale-95 touch-manipulation"
                >
                  Buy Now
                </Link>
              </div>

              {/* WhatsApp Button */}
              <button className="w-full py-3.5 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg cursor-pointer active:scale-95 touch-manipulation">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Customize on WhatsApp
              </button>
            </div>
          </div>
        </div>
        </div>

        {/* Similar Designs */}
        <div className="mt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Similar Designs</h2>
            <Link
              to="/explore"
              className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 group"
            >
              See More Designs
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { id: 1, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop' },
              { id: 2, image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=500&fit=crop' },
              { id: 3, image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=500&fit=crop' },
              { id: 4, image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=500&fit=crop' }
            ].map((item) => (
              <div key={item.id} className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all">
                {/* Image - Portrait Format */}
                <div className="aspect-[4/5] overflow-hidden bg-muted relative">
                  <ImageWithFallback
                    src={item.image}
                    alt={`Similar Design ${item.id}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Hover Overlay with Personalize & Buy */}
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
                        to={`/invitation/${item.id}`}
                        className="w-full py-3 bg-white text-primary rounded-full hover:bg-primary hover:text-white transition-all flex items-center justify-center font-semibold text-sm"
                      >
                        Personalize & Buy
                      </Link>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-primary text-xs rounded-full border border-primary/20 shadow-md">
                      Video Invitation
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <Link to={`/invitation/${item.id}`}>
                    <h3 className="text-base font-semibold hover:text-primary transition-colors line-clamp-1 mb-1">
                      Elegant Wedding {item.id}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    Video Invitation
                  </p>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xs text-muted-foreground">₹</span>
                    <span className="text-lg font-bold text-primary">2,499</span>
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
