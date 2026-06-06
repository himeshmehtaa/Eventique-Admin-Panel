import { Link, useParams } from 'react-router';
import { ArrowLeft, Clock, Calendar, Tag, Share2, Heart, Bot } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';

// Full blog post content data
const blogPostsData = [
  {
    id: 1,
    category: 'Digital Trends',
    date: 'June 3, 2026',
    readTime: '4 min read',
    title: 'The Rise of E-Invites: Why Modern Couples Prefer Digital Video Invitations',
    subtitle: 'Discover how digital video invitations are transforming wedding planning from environmental benefits to instant global delivery.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&fit=crop',
    content: [
      {
        type: 'paragraph',
        text: 'In the era of smartphones and instant connectivity, wedding planning is undergoing a major digital revolution. One of the biggest shifts we are seeing today is the transition from traditional paper invites to high-quality digital video invitations, often referred to as E-Invites. Modern couples are embracing this medium not just as a cost-effective alternative, but as a premium, creative, and highly personalized experience that sets the tone for their big day.'
      },
      {
        type: 'heading',
        text: '1. Seamless Global Delivery'
      },
      {
        type: 'paragraph',
        text: 'Traditional invitations take weeks to print, address, and ship, with a high risk of getting lost or delayed in transit—especially for international guests. With E-Invites, delivery is instantaneous. You can share your beautiful animated video invite via WhatsApp, email, or social media with a single click. There are no postage fees, no custom delays, and no geographical limits. Your guests receive their invitation in HD quality, no matter where they are in the world.'
      },
      {
        type: 'heading',
        text: '2. Immersive Visual Storytelling'
      },
      {
        type: 'paragraph',
        text: 'Unlike static paper, video invites allow you to combine motion graphics, beautiful typography, romantic music, and personal photographs into a cinematic experience. You can guide your guests through your love story, show off your pre-wedding shoot, or animate traditional motifs (like jasmine garlands, elephants, or mandalas) to match your wedding theme. It is a highly sensory introduction to your wedding celebrations that creates an immediate emotional connection.'
      },
      {
        type: 'quote',
        text: 'E-invites are not just about sharing the date—they are about sharing the anticipation, the music, and the visual essence of your love story in a way paper never could.'
      },
      {
        type: 'heading',
        text: '3. Eco-Friendly and Sustainable'
      },
      {
        type: 'paragraph',
        text: 'As couples become more conscious of their environmental impact, sustainability has become a core value in wedding planning. Paper invitations require harvesting trees, processing chemical inks, and transportation emissions. Going digital is a zero-waste choice that saves hundreds of sheets of paper and plastic wraps, allowing you to celebrate your union while being kind to the planet.'
      },
      {
        type: 'heading',
        text: '4. Instant Updates and RSVP Integration'
      },
      {
        type: 'paragraph',
        text: 'With traditional paper cards, any change in venue, timing, or itinerary requires a costly reprint or tedious manual notifications. With a digital setup, your E-Invite can be linked directly to your personalized wedding website or RSVP form. Guests can click a button right below the video to confirm attendance, submit dietary preferences, or view updated schedule details, streamlining the entire planning process for you.'
      }
    ]
  },
  {
    id: 2,
    category: 'Printed Luxury',
    date: 'May 28, 2026',
    readTime: '6 min read',
    title: 'Crafting First Impressions: A Guide to Choosing Luxury Wedding Paper & Finishes',
    subtitle: 'Gold foil, letterpress, acrylic, or velvet? Learn about the premium paper stocks and printing techniques that turn invitations into masterpieces.',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&fit=crop',
    content: [
      {
        type: 'paragraph',
        text: 'A physical wedding invitation is more than just information—it is a tactile keepsake that your guests will hold, feel, and cherish. It serves as the official introduction to the aesthetic of your wedding. Designing a luxury paper suite involves choosing the right combination of materials, paper weights, and artisanal finishes. This guide walks you through the premium choices that can elevate your printed invitations into works of art.'
      },
      {
        type: 'heading',
        text: '1. Choosing the Right Paper Stock'
      },
      {
        type: 'paragraph',
        text: 'The foundation of any printed suite is the paper. For a luxury feel, standard cardstock will not suffice. Instead, look for: \n• Cotton Paper: Often called rag paper, made from 100% cotton fibers. It has a soft, pillowy texture and is incredibly thick (usually 300 to 600 gsm), making it ideal for deep impressions. \n• Handmade Paper: Features deckled edges and organic textures, perfect for vintage or rustic elegant styles. \n• Frosted Acrylic: A modern, high-end alternative that offers a sleek, glass-like look, printed with opaque white or gold ink.'
      },
      {
        type: 'heading',
        text: '2. The Timeless Elegance of Foil Stamping'
      },
      {
        type: 'paragraph',
        text: 'Foil stamping is a technique where metallic foil (usually gold, silver, rose gold, or copper) is pressed onto the paper using heat and pressure. It creates a shiny, reflective finish that catches the light beautifully and gives the invitation an immediate regal look. It is perfect for titles, initials monograms, and intricate border patterns.'
      },
      {
        type: 'quote',
        text: 'Luxury is in the details you can feel. The heavy weight of cotton paper combined with the crisp texture of gold foil stamps creates an unforgettable physical connection.'
      },
      {
        type: 'heading',
        text: '3. Letterpress vs. Debossing'
      },
      {
        type: 'paragraph',
        text: 'Letterpress is one of the oldest printing methods, where a metal plate with raised lettering is inked and pressed directly into the paper. This leaves a crisp, inked indentation in the thick cotton stock. Debossing is similar but uses no ink, creating a blind, elegant impression. Both techniques add a gorgeous three-dimensional depth that is highly satisfying to touch.'
      },
      {
        type: 'heading',
        text: '4. The Finishing Touches: Wax Seals and Vellum'
      },
      {
        type: 'paragraph',
        text: 'To complete your invitation suite, consider wrapping the card in a translucent vellum jacket, tied with silk ribbon or metallic thread, and sealed with a custom wax stamp. Wax seals (featuring your monogram or a botanical motif) add a romantic, medieval charm that shows your guests that every single envelope was packaged with care and elegance.'
      }
    ]
  },
  {
    id: 3,
    category: 'Planning Tips',
    date: 'May 15, 2026',
    readTime: '5 min read',
    title: 'Interactive RSVP & Beyond: How Event Websites Make Guest Management Effortless',
    subtitle: 'Ditch the spreadsheets. Discover how a customized event website streamlines guest list management, event details, and photo sharing.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&fit=crop',
    content: [
      {
        type: 'paragraph',
        text: 'Planning a wedding or large milestone celebration involves managing dozens of moving parts. Among these, coordinating the guest list, collecting RSVPs, tracking dietary restrictions, and keeping everyone updated on travel arrangements is notoriously the most stressful. This is why more couples are turning to customized event websites. A dedicated website acts as a 24/7 central hub that handles the heavy lifting of guest management, leaving you free to focus on the design and celebration.'
      },
      {
        type: 'heading',
        text: '1. Real-time RSVP Tracking'
      },
      {
        type: 'paragraph',
        text: 'Traditional RSVP cards mailed back in envelopes are slow, easily lost, and require you to manually compile answers into a spreadsheet. A personalized wedding website allows guests to RSVP digitally. The responses are logged instantly in a private database, showing you exactly who has RSVP\'d "Yes" or "No", their guest count, and their selections, all in real-time.'
      },
      {
        type: 'heading',
        text: '2. Centralizing Event Details'
      },
      {
        type: 'paragraph',
        text: 'Instead of cramming directions, hotel accommodations, gift registries, and dress codes onto a small paper card, your website provides unlimited space. You can embed interactive Google Maps, link directly to hotel booking pages, post direct registry links, and outline the itinerary day-by-day. It keeps your guests informed and reduces the number of repetitive questions you have to answer via phone calls.'
      },
      {
        type: 'quote',
        text: 'A customized event website is your digital concierge—it welcomes your guests, provides all the details, and handles the logistics silently in the background.'
      },
      {
        type: 'heading',
        text: '3. Custom RSVP Questionnaires'
      },
      {
        type: 'paragraph',
        text: 'Need to know if guests prefer paneer or chicken? Or if they need shuttle service from the hotel? Your digital RSVP form can contain custom checkboxes or fields to gather this information. You can ask for dietary restrictions, song requests for the DJ, or RSVP preferences for separate events (e.g., Sangeet vs. Reception).'
      },
      {
        type: 'heading',
        text: '4. Post-Event Photo Sharing'
      },
      {
        type: 'paragraph',
        text: 'After the celebration is over, your wedding website can live on. You can upload a link to your official photo gallery, add a section where guests can upload the snapshots they took on their phones, or share a highlight video. It remains a beautiful digital memory lane for you and your guests to revisit for years to come.'
      }
    ]
  }
];

import { useAdmin } from '../admin/context/AdminContext';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [liked, setLiked] = useState(false);
  const { state } = useAdmin();
  
  const post = state.blogPosts.find((p) => p.id === Number(id));

  // Auto-scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-[#faf8f5]">
        <h1 className="text-3xl mb-4 text-[#1a1410] font-semibold">Post Not Found</h1>
        <p className="text-gray-500 mb-8">This article doesn't exist or may have been archived.</p>
        <Link to="/" className="px-8 py-3 bg-[#8B4949] text-white rounded-full font-semibold hover:bg-[#7a3f3f] transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  // Related posts (excluding current post)
  const relatedPosts = state.blogPosts.filter((p) => p.id !== post.id);

  return (
    <div className="bg-[#faf8f5] min-h-screen py-8 relative overflow-hidden">
      {/* Background Decors */}
      <MandalaDecor className="absolute top-20 right-10 w-64 h-64 text-primary opacity-10 animate-rotate-slow pointer-events-none" />
      <LotusDecor className="absolute bottom-20 left-10 w-40 h-40 text-secondary opacity-15 animate-float pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Article Container */}
        <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-6 md:p-12 mb-12">
          {/* Category Badge & Metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3.5 py-1.5 bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase rounded-full">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium select-none">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.date}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed font-light">
            {post.subtitle}
          </p>

          {/* Main Image */}
          <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-10 shadow-sm">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Share/Like Bar */}
          <div className="flex items-center justify-between py-4 border-y border-gray-100 mb-8 select-none">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Enjoyed the article?</span>
              <button
                onClick={() => setLiked(!liked)}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                  liked ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-full text-xs text-gray-500 hover:border-primary hover:text-primary transition-all cursor-pointer">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>

          {/* Article Body */}
          <div className="prose max-w-none space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
            {post.content.map((block, idx) => {
              if (block.type === 'paragraph') {
                return (
                  <div key={idx} className="space-y-4">
                    <p className="whitespace-pre-line">
                      {block.text}
                    </p>
                    {block.image && (
                      <div className="my-6 rounded-2xl overflow-hidden shadow-md max-h-[450px]">
                        <img src={block.image} alt="Blog section visual" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                );
              }
              if (block.type === 'heading') {
                return (
                  <div key={idx} className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 pt-4">
                      {block.text}
                    </h3>
                    {block.image && (
                      <div className="my-6 rounded-2xl overflow-hidden shadow-md max-h-[450px]">
                        <img src={block.image} alt="Blog section visual" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                );
              }
              if (block.type === 'quote') {
                return (
                  <div key={idx} className="space-y-4">
                    <blockquote className="border-l-4 border-secondary bg-muted/40 p-4 rounded-r-xl my-6 font-medium italic text-gray-700 pl-6">
                      "{block.text}"
                    </blockquote>
                    {block.image && (
                      <div className="my-6 rounded-2xl overflow-hidden shadow-md max-h-[450px]">
                        <img src={block.image} alt="Blog section visual" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                );
              }
              if (block.type === 'image') {
                return (
                  <div key={idx} className="my-8 rounded-2xl overflow-hidden shadow-md max-h-[500px]">
                    <img src={block.text} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </article>

        {/* Read More Section */}
        <section className="mb-12 border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                to={`/blog/${relatedPost.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all flex flex-col"
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                  <img
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold tracking-wide uppercase rounded-full">
                      {relatedPost.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-[10px] text-gray-400 font-medium mb-1.5">{relatedPost.date}</span>
                  <h3 className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {relatedPost.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
