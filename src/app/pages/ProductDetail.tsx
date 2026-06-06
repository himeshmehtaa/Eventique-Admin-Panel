import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useAdmin } from '../admin/context/AdminContext';
import { ArrowLeft, Check, Clock, IndianRupee, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function ProductDetail() {
  const { state } = useAdmin();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const product = state.products.find((p) => p.id === id);
  const allImages = product ? [product.imageUrl, ...(product.images || [])].filter(Boolean) : [];
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl mb-4">Product not found</h1>
        <Link to="/explore" className="text-primary hover:underline">
          Browse all designs
        </Link>
      </div>
    );
  }

  const typeLabels = {
    'video-invite': 'Video Invitation',
    'pdf-invite': 'PDF Invitation',
    'e-invitation': 'E-Invitation',
    'wedding-website': 'Wedding Website',
    'stationery': 'Stationery',
  };

  const handleWhatsAppCustomize = () => {
    const phoneNumber = '919876543210';
    const message = `Hi! I'm interested in customizing "${product.name}" (${typeLabels[product.type]}). Can you help me?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image / Carousel */}
          <div>
            <div className="sticky top-24 space-y-4">
              <div className="bg-muted rounded-2xl overflow-hidden aspect-[4/3] relative group">
                <ImageWithFallback
                  src={allImages[activeImageIdx]}
                  alt={`${product.name} - Image ${activeImageIdx + 1}`}
                  className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                />
                
                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white text-[#8B4949] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer z-10"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white text-[#8B4949] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer z-10"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Dot Indicators */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          activeImageIdx === idx ? 'bg-[#D4AF37] w-4' : 'bg-white/60 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails Underneath */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto py-1 hide-scrollbar scroll-smooth">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                        activeImageIdx === idx
                          ? 'border-[#8B4949] shadow-md ring-2 ring-[#8B4949]/20'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div>
            {/* Type Badge */}
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full mb-4">
              {typeLabels[product.type]}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-6 h-6 text-primary" />
                <span className="text-3xl font-semibold text-primary">
                  {product.price.toLocaleString('en-IN')}
                </span>
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through opacity-60">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.promoTag && (
                <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                  {product.promoTag}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Delivery Time */}
            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl mb-8">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Delivery Time</p>
                <p className="font-semibold">{product.deliveryTime}</p>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-xl mb-4">What's Included</h3>
              <div className="grid gap-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/order', { state: { product } })}
                className="flex-1 px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors text-center"
              >
                Order Now
              </button>
              <button
                onClick={handleWhatsAppCustomize}
                className="flex-1 px-8 py-4 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Customize on WhatsApp</span>
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-6 bg-muted rounded-xl">
              <h3 className="text-lg mb-3">How It Works</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Click "Order Now" and fill in your event details</li>
                <li>2. Make secure payment through Razorpay</li>
                <li>3. Our team will contact you on WhatsApp for customization</li>
                <li>4. Review and approve the design</li>
                <li>5. Receive your final invitation and share with guests!</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl mb-8">Similar Designs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {state.products
              .filter((p) => p.occasion === product.occasion && p.id !== product.id)
              .slice(0, 3)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <ImageWithFallback
                        src={relatedProduct.imageUrl}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl mb-2 group-hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-primary" />
                        <span className="text-xl font-semibold text-primary">
                          {relatedProduct.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}