import { useState } from 'react';
import { Link } from 'react-router';
import Slider from 'react-slick';
import { packages } from '../data/products';
import { Check, IndianRupee, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function Packages() {
  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
      title: 'Complete Packages',
      subtitle: 'Save more with our bundled packages designed to cover all your event needs',
    },
    {
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
      title: 'Premium Wedding Stationery',
      subtitle: 'Beautiful designs for every detail of your special day',
    },
    {
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
      title: 'All-Inclusive Solutions',
      subtitle: 'From invitations to wedding websites, we have you covered',
    },
  ];

  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
        aria-label="Next"
      >
        <ChevronRight className="w-7 h-7 text-gray-800" />
      </button>
    );
  };

  const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
        aria-label="Previous"
      >
        <ChevronLeft className="w-7 h-7 text-gray-800" />
      </button>
    );
  };

  const heroSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="relative overflow-hidden">
      {/* Decorative Background Elements */}
      <LotusDecor className="absolute top-20 right-10 w-48 h-48 text-primary opacity-40 animate-float" />
      <MandalaDecor className="absolute top-1/3 left-10 w-64 h-64 text-secondary opacity-35 animate-rotate-slow" />
      <LotusDecor className="absolute bottom-1/4 right-1/4 w-32 h-32 text-accent opacity-40 animate-float" style={{ animationDelay: '2s' }} />

      {/* Hero Carousel */}
      <div className="relative mb-16">
        <div className="h-[500px] overflow-hidden decorative-pulse">
          <Slider {...heroSettings}>
            {heroSlides.map((slide, index) => (
              <div key={index} className="relative h-[500px]">
                <ImageWithFallback
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white max-w-4xl px-4">
                    <h1 className="text-5xl md:text-6xl mb-4 font-serif drop-shadow-lg">{slide.title}</h1>
                    <p className="text-xl md:text-2xl text-white/95 drop-shadow-md">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-gradient-to-br rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 ${
                pkg.popular
                  ? 'from-[#1a1410] to-[#2d1f16] border-2 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20 scale-105 hover:scale-110'
                  : 'from-[#faf8f5] to-[#f5f0e8] border-2 border-[#D4AF37]/30 hover:border-[#D4AF37]/50'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-[#1a1410] rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="flex justify-center mb-4">
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              </div>

              <h3 className={`text-2xl mb-3 text-center font-serif ${pkg.popular ? 'text-white' : 'text-[#1a1410]'}`}>
                {pkg.name}
              </h3>
              <p className={`mb-6 text-center text-sm ${pkg.popular ? 'text-gray-300' : 'text-gray-600'}`}>
                {pkg.description}
              </p>

              {/* Price */}
              <div className="mb-6 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <IndianRupee className="w-7 h-7 text-[#D4AF37]" />
                  <span className="text-4xl font-bold text-[#D4AF37]">
                    {pkg.price.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className={`text-sm ${pkg.popular ? 'text-[#F4E4C1]' : 'text-[#8B7355]'}`}>
                  Save ₹{pkg.savings.toLocaleString('en-IN')}
                </p>
              </div>

              {/* Features */}
              <div className={`space-y-3 mb-8 rounded-xl p-4 ${pkg.popular ? 'bg-white/5' : 'bg-[#D4AF37]/5'}`}>
                {pkg.includes.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span className={`text-sm ${pkg.popular ? 'text-gray-200' : 'text-gray-700'}`}>{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                to="/order"
                state={{ package: pkg }}
                className={`block w-full py-3 rounded-full text-center font-semibold transition-all ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-[#1a1410] hover:shadow-lg hover:shadow-[#D4AF37]/50'
                    : 'bg-gradient-to-r from-[#D4AF37]/20 to-[#F4E4C1]/20 text-[#D4AF37] border border-[#D4AF37] hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#F4E4C1] hover:text-[#1a1410]'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

      </div>

      {/* Custom Package CTA - Full Width */}
      <div className="mt-16 px-4">
        <div className="bg-gradient-to-br from-[#1a1410] to-[#2d1f16] border-2 border-[#D4AF37] py-16 shadow-xl shadow-[#D4AF37]/20 rounded-3xl">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-4">
              <LotusDecor className="w-20 h-16 text-[#D4AF37]" />
            </div>
            <h2 className="text-3xl md:text-4xl mb-4 font-serif text-[#D4AF37]">Need a Custom Package?</h2>
            <p className="text-gray-300 mb-6 text-lg max-w-2xl mx-auto">
              Can't find what you're looking for? We can create a custom package tailored to your specific needs.
            </p>
            <Link
              to="/contact"
              className="inline-block px-10 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-[#1a1410] rounded-full font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}