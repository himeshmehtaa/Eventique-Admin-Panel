import { Star, Quote } from 'lucide-react';
import { testimonials as defaultTestimonials } from '../data/products';
import { Link } from 'react-router';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';
import { useAdmin } from '../admin/context/AdminContext';
import { VideoPlayer } from '../components/VideoPlayer';

export default function Testimonials() {
  const { state } = useAdmin();
  const list = state.testimonials && state.testimonials.length > 0 ? state.testimonials : defaultTestimonials;

  // Split testimonials into text and video reviews
  const textReviews = list.filter((t) => !t.videoUrl);
  const videoReviews = list.filter((t) => t.videoUrl);

  return (
    <div className="py-12 relative overflow-hidden">
      {/* Background Floral Elements */}
      <MandalaDecor className="absolute top-10 right-16 w-60 h-60 text-primary opacity-30 animate-rotate-slow" />
      <LotusDecor className="absolute top-1/4 left-12 w-44 h-44 text-secondary opacity-35 animate-float" />
      <MandalaDecor className="absolute bottom-1/3 right-1/4 w-52 h-52 text-accent opacity-30 animate-rotate-slow" style={{ animationDelay: '3s' }} />
      <LotusDecor className="absolute bottom-20 left-1/4 w-40 h-40 text-primary opacity-35 animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">Client Testimonials</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Read what our happy clients have to say about their experience with Eventique
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-semibold text-primary mb-2">2000+</div>
            <p className="text-muted-foreground">Happy Clients</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-semibold text-primary mb-2">5000+</div>
            <p className="text-muted-foreground">Designs Created</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-semibold text-primary mb-2">4.9/5</div>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-semibold text-primary mb-2">98%</div>
            <p className="text-muted-foreground">Satisfaction Rate</p>
          </div>
        </div>

        {/* Video Testimonials Section (Render first if available, looks more striking!) */}
        {videoReviews.length > 0 && (
          <div className="mb-16 bg-gradient-to-br from-[#fffbf7] to-[#fff5f0] border border-[#D4AF37]/20 rounded-3xl p-8 md:p-12 shadow-sm">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] bg-white border border-[#D4AF37]/20 px-3.5 py-1.5 rounded-full shadow-sm">
                🎬 Watch Stories
              </span>
              <h2 className="text-3xl md:text-4xl mt-3 mb-2 font-serif text-gray-800">Video Testimonials</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
                Hear directly from our happy couples in mobile portrait video format
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto justify-center">
              {videoReviews.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="relative aspect-[9/16] rounded-3xl overflow-hidden shadow-xl border border-border bg-black hover:-translate-y-1.5 transition-all duration-300"
                >
                  <VideoPlayer url={testimonial.videoUrl!} />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent p-6 text-white pt-16 pointer-events-none">
                    <div className="flex gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>
                    <p className="font-semibold text-white mb-0.5">{testimonial.name}</p>
                    <p className="text-xs text-white/80">
                      {testimonial.event} • {testimonial.date}
                    </p>
                    {testimonial.comment && (
                      <p className="text-xs text-white/70 mt-2 line-clamp-3 italic">
                        "{testimonial.comment}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Text Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {textReviews.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl border border-border p-8 hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Quote Icon */}
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Quote className="w-6 h-6 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-border mt-auto">
                <p className="font-semibold mb-1">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.event} • {testimonial.date}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Review Platforms */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl mb-4">Find Us On</h2>
            <p className="text-muted-foreground">See more reviews on popular platforms</p>
          </div>
          <div className="flex flex-wrap gap-6 justify-center">
            <a
              href="#"
              className="px-6 py-3 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
            >
              ⭐ Google Reviews
            </a>
            <a
              href="#"
              className="px-6 py-3 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
            >
              📘 Facebook Reviews
            </a>
            <a
              href="#"
              className="px-6 py-3 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
            >
              📷 Instagram
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-primary text-primary-foreground rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl mb-4">Ready to Join Our Happy Clients?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Let us create something beautiful for your celebration
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/explore"
              className="px-8 py-4 bg-card text-foreground rounded-full hover:bg-white transition-colors"
            >
              Explore Designs
            </Link>
            <Link
              to="/order"
              className="px-8 py-4 bg-transparent border-2 border-primary-foreground rounded-full hover:bg-primary-foreground/10 transition-colors"
            >
              Order Now
            </Link>
          </div>
        </div>

        {/* Leave a Review */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Already worked with us?</p>
          <Link to="/contact" className="text-primary hover:underline text-lg">
            Share your experience →
          </Link>
        </div>
      </div>
    </div>
  );
}
