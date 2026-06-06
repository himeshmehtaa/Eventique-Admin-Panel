import { Link } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';

type ProductType = 'print' | 'stationery' | 'gift';

const tagToRouteType: Record<string, string> = {
  'Printed Invites': 'invite',
  'Stationery':      'stationery',
  'Gifts':           'gift',
};

interface Product {
  tag: string;
  type: ProductType;
  label: string;
  image: string;
  slug: string;
}

// Width varies by type; all share the same fixed height for a uniform, balanced strip
const typeW: Record<ProductType, string> = {
  stationery: 'w-80',
  print:      'w-60',
  gift:       'w-64',
};

const tagStyle: Record<string, string> = {
  'Printed Invites': 'bg-[#8B4949] text-white',
  'Stationery':      'bg-[#D4AF37] text-[#1a1410]',
  'Gifts':           'bg-[#4A7C59] text-white',
};

const CARD_H = 'h-64';

const row1: Product[] = [
  {
    tag: 'Stationery', type: 'stationery',
    label: 'Luxury Wedding Suite',
    slug: 'luxury-wedding-suite',
    image: 'https://images.unsplash.com/photo-1758825178518-ca48833a6c57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700',
  },
  {
    tag: 'Printed Invites', type: 'print',
    label: 'Embossed Gold Card',
    slug: 'embossed-gold-card',
    image: 'https://images.unsplash.com/photo-1764731080480-58b18e519bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
  },
  {
    tag: 'Gifts', type: 'gift',
    label: 'Premium Gift Hamper',
    slug: 'premium-gift-hamper',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238bd345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    tag: 'Stationery', type: 'stationery',
    label: 'Floral Flat Lay Suite',
    slug: 'luxury-wedding-suite',
    image: 'https://images.unsplash.com/photo-1763414902882-4e9d4f8e6275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700',
  },
  {
    tag: 'Printed Invites', type: 'print',
    label: 'Premium Box Set',
    slug: 'wax-seal-envelope-suite',
    image: 'https://images.unsplash.com/photo-1649019489428-70f505daacd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
  },
  {
    tag: 'Gifts', type: 'gift',
    label: 'Curated Wedding Box',
    slug: 'curated-wedding-box',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    tag: 'Stationery', type: 'stationery',
    label: 'Minimalist Suite Collection',
    slug: 'minimalist-suite',
    image: 'https://images.unsplash.com/photo-1732649124686-3bab54f79aa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700',
  },
];

const row2: Product[] = [
  {
    tag: 'Printed Invites', type: 'print',
    label: 'Wax Seal Envelope Suite',
    slug: 'wax-seal-envelope-suite',
    image: 'https://images.unsplash.com/photo-1646568779353-b9d2b903b3e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
  },
  {
    tag: 'Gifts', type: 'gift',
    label: 'Luxury Favour Boxes',
    slug: 'premium-gift-hamper',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    tag: 'Stationery', type: 'stationery',
    label: 'Complete Wedding Stationery',
    slug: 'luxury-wedding-suite',
    image: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700',
  },
  {
    tag: 'Printed Invites', type: 'print',
    label: 'Classic Ivory Card',
    slug: 'classic-ivory-card',
    image: 'https://images.unsplash.com/photo-1759887244219-17c3d64a7f01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
  },
  {
    tag: 'Gifts', type: 'gift',
    label: 'Floral Gift Basket',
    slug: 'luxury-wedding-hamper',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    tag: 'Stationery', type: 'stationery',
    label: 'Botanical Place Cards',
    slug: 'minimalist-suite',
    image: 'https://images.unsplash.com/photo-1567636788276-40a47795ba4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700',
  },
  {
    tag: 'Printed Invites', type: 'print',
    label: 'Burgundy Foil Suite',
    slug: 'embossed-gold-card',
    image: 'https://images.unsplash.com/photo-1567794636765-5e4869f627e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
  },
];

function Card({ item }: { item: Product }) {
  const tagCls = tagStyle[item.tag] ?? 'bg-white text-gray-800';
  const routeType = tagToRouteType[item.tag] ?? 'invite';
  return (
    <Link
      to={`/shop/${routeType}/${item.slug}`}
      className={`relative flex-shrink-0 ${typeW[item.type]} ${CARD_H} rounded-2xl overflow-hidden group cursor-pointer`}
    >
      <ImageWithFallback
        src={item.image}
        alt={item.label}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

      <div className="absolute top-3 left-3">
        <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${tagCls}`}>
          {item.tag}
        </span>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-white text-sm font-semibold leading-snug">{item.label}</p>
      </div>
    </Link>
  );
}

function Row({ items, dir }: { items: Product[]; dir: 'left' | 'right' }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div className={`flex gap-3 w-max ${dir === 'left' ? 'carousel-left' : 'carousel-right'}`}>
        {doubled.map((item, i) => <Card key={i} item={item} />)}
      </div>
    </div>
  );
}

export function ProductCarousel() {
  return (
    <section className="py-20 overflow-hidden bg-[#faf8f5]">
      <div className="container mx-auto px-4 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#8B4949]/10 text-[#8B4949] rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              ✦ Our Collections
            </span>
            <h2 className="text-4xl md:text-5xl text-[#1a1410]">Shop by Format</h2>
          </div>
          <div className="hidden md:flex items-center gap-5">
            {[
              { label: 'Printed Invites', color: '#8B4949' },
              { label: 'Stationery',      color: '#D4AF37' },
              { label: 'Gifts',           color: '#4A7C59' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color }} />
                <span className="text-xs text-gray-500 font-medium">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 h-px bg-gradient-to-r from-[#D4AF37]/60 via-[#D4AF37]/20 to-transparent" />
      </div>

      <div className="carousel-pause flex flex-col gap-3">
        <Row items={row1} dir="left"  />
        <Row items={row2} dir="right" />
      </div>
    </section>
  );
}
