import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  Heart, ShoppingCart, Star, Minus, Plus, Check,
  Package, ChevronLeft, ChevronRight, Share2, ArrowLeft, Sparkles,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Tier {
  label: string;
  price: number;
  features: string[];
}

interface CatalogProduct {
  name: string;
  eventBadge: string;
  hasPersonalization: boolean;
  tiers: Tier[];
  sizes: string[];
  images: string[];
  specs: { label: string; value: string }[];
  backPath: string;
  backLabel: string;
}

// ── Catalog ───────────────────────────────────────────────────────────────────

const catalog: Record<string, CatalogProduct> = {
  'gift/luxury-wedding-hamper': {
    name: 'Luxury Wedding Hamper',
    eventBadge: 'WEDDING',
    hasPersonalization: true,
    tiers: [
      { label: 'Standard', price: 2499, features: ['Personalization included', 'Delivered in 10-14 business days', 'Premium packaging with ribbon & card'] },
      { label: 'Premium',  price: 3999, features: ['Full personalization with photo', 'Delivered in 5-7 business days', 'Luxury box with silk lining', 'Handwritten note included'] },
    ],
    sizes: ['Small', 'Medium', 'Large', 'Premium'],
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238bd345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1547592180-85f173990554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    specs: [
      { label: 'Contents',     value: 'Dry fruits, chocolates, scented candle, photo frame' },
      { label: 'Packaging',    value: 'Premium wooden box with gold foil print' },
      { label: 'Weight',       value: '1.2 – 2.5 kg (size dependent)' },
      { label: 'Customization',value: 'Names, date, and message on lid' },
      { label: 'Delivery',     value: '10-14 business days (Standard)' },
    ],
    backPath: '/gifts', backLabel: 'Gifts',
  },

  'gift/personalized-couple-frame': {
    name: 'Personalized Couple Frame',
    eventBadge: 'WEDDING',
    hasPersonalization: true,
    tiers: [
      { label: 'Standard', price: 899,  features: ['Name & date engraving', 'Delivered in 7-10 business days', 'Gift-wrapped with ribbon'] },
      { label: 'Premium',  price: 1499, features: ['Full custom photo + engraving', 'Delivered in 5-7 business days', 'Premium gift box included'] },
    ],
    sizes: ['5×7 inch', '8×10 inch', '12×15 inch'],
    images: [
      'https://images.unsplash.com/photo-1571781926291-1a36ba6d3e73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1549465220-1a8b9238bd345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    specs: [
      { label: 'Material',      value: 'Premium acrylic / wood' },
      { label: 'Frame finish',  value: 'Gold / Silver / Rose Gold' },
      { label: 'Printing',      value: 'UV print, scratch-resistant' },
      { label: 'Customization', value: 'Couple names, date, short message' },
      { label: 'Delivery',      value: '7-10 business days (Standard)' },
    ],
    backPath: '/gifts', backLabel: 'Gifts',
  },

  'gift/bridesmaid-gift-box': {
    name: 'Bridesmaid Gift Box',
    eventBadge: 'WEDDING',
    hasPersonalization: true,
    tiers: [
      { label: 'Standard', price: 1299, features: ['Personalization on each box', 'Delivered in 10-12 business days', 'Satin ribbon finish'] },
      { label: 'Premium',  price: 2199, features: ['Full custom design', 'Delivered in 7-9 business days', 'Luxury hamper contents', 'Handwritten card per box'] },
    ],
    sizes: ['Set of 3', 'Set of 5', 'Set of 8', 'Set of 10'],
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1549465220-1a8b9238bd345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1547592180-85f173990554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    specs: [
      { label: 'Contents',     value: 'Candle, face mask, chocolates, scrunchie' },
      { label: 'Packaging',    value: 'Rigid gift box with custom sleeve' },
      { label: 'Personalization', value: 'Name on each box + inside card' },
      { label: 'Minimum order',value: '3 boxes' },
      { label: 'Delivery',     value: '10-12 business days (Standard)' },
    ],
    backPath: '/gifts', backLabel: 'Gifts',
  },

  'gift/wedding-name-plaque': {
    name: 'Wedding Name Plaque',
    eventBadge: 'WEDDING',
    hasPersonalization: true,
    tiers: [
      { label: 'Standard', price: 649, features: ['Name engraving', 'Delivered in 7-10 business days', 'Velvet pouch packaging'] },
      { label: 'Premium',  price: 999, features: ['Custom shape + name', 'Delivered in 5-7 business days', 'Premium display stand included'] },
    ],
    sizes: ['Small (20cm)', 'Medium (30cm)', 'Large (45cm)'],
    images: [
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1571781926291-1a36ba6d3e73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1549465220-1a8b9238bd345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    specs: [
      { label: 'Material',   value: 'Acrylic / MDF wood' },
      { label: 'Finish',     value: 'Mirror / Matte / Glitter' },
      { label: 'LED option', value: 'Available on Premium tier' },
      { label: 'Hanging',    value: 'Wall-mount + table stand ready' },
      { label: 'Delivery',   value: '7-10 business days (Standard)' },
    ],
    backPath: '/gifts', backLabel: 'Gifts',
  },

  'gift/premium-dry-fruit-hamper': {
    name: 'Premium Dry Fruit Hamper',
    eventBadge: 'CELEBRATIONS',
    hasPersonalization: true,
    tiers: [
      { label: 'Standard', price: 1899, features: ['Brand label personalization', 'Delivered in 5-7 business days', 'Decorative tray with cling wrap'] },
      { label: 'Premium',  price: 2999, features: ['Full custom box & label', 'Delivered in 3-5 business days', 'Silk-lined luxury tray', 'Gold ribbon & sealing wax'] },
    ],
    sizes: ['250g', '500g', '750g', '1kg'],
    images: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1549465220-1a8b9238bd345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    specs: [
      { label: 'Contents',     value: 'Almonds, cashews, pistachios, dates, walnuts' },
      { label: 'Packaging',    value: 'Premium tray / luxury box' },
      { label: 'Shelf life',   value: '3-6 months (varies per product)' },
      { label: 'Personalization', value: 'Custom label with names & message' },
      { label: 'Delivery',     value: '5-7 business days (Standard)' },
    ],
    backPath: '/gifts', backLabel: 'Gifts',
  },

  'gift/personalized-keepsake-box': {
    name: 'Personalized Keepsake Box',
    eventBadge: 'WEDDING',
    hasPersonalization: true,
    tiers: [
      { label: 'Standard', price: 1099, features: ['Couple name & date engraving', 'Delivered in 10-14 business days', 'Velvet-lined interior'] },
      { label: 'Premium',  price: 1799, features: ['Photo + name engraving', 'Delivered in 7-10 business days', 'Lock & key included', 'Gift-wrapped presentation'] },
    ],
    sizes: ['Small', 'Medium', 'Large'],
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1549465220-1a8b9238bd345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    specs: [
      { label: 'Material',      value: 'Mango wood with gold/silver hardware' },
      { label: 'Interior',      value: 'Velvet-lined with multiple compartments' },
      { label: 'Engraving',     value: 'Laser-engraved, permanent' },
      { label: 'Customization', value: 'Names, date, message, initials monogram' },
      { label: 'Delivery',      value: '10-14 business days (Standard)' },
    ],
    backPath: '/gifts', backLabel: 'Gifts',
  },

  // Invite / carousel products
  'invite/embossed-gold-card': {
    name: 'Embossed Gold Card Invitation',
    eventBadge: 'WEDDING',
    hasPersonalization: true,
    tiers: [
      { label: 'Digital PDF', price: 799,  features: ['Print-ready digital file (PDF/PNG)', 'Delivered in 3-5 business days', 'Unlimited digital sharing', '3 rounds of revisions'] },
      { label: 'Printed Cards', price: 2499, features: ['Gold foil embossed print', 'Delivered in 10-12 business days', 'Gold-lined envelope included', 'Per-set pricing (see quantities)'] },
    ],
    sizes: ['25 cards', '50 cards', '100 cards', '200 cards', '500 cards'],
    images: [
      'https://images.unsplash.com/photo-1764731080480-58b18e519bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1646568779353-b9d2b903b3e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1759887244219-17c3d64a7f01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1567794636765-5e4869f627e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    specs: [
      { label: 'Paper',       value: '350 gsm ultra-thick cotton paper' },
      { label: 'Finish',      value: 'Embossed + gold foil stamping' },
      { label: 'Card size',   value: 'A5 / A6 / custom' },
      { label: 'Envelope',    value: 'Gold-lined envelope included' },
      { label: 'Delivery',    value: '10-12 business days (Printed Cards)' },
    ],
    backPath: '/explore', backLabel: 'Explore',
  },

  'invite/wax-seal-envelope-suite': {
    name: 'Wax Seal Envelope Suite',
    eventBadge: 'WEDDING',
    hasPersonalization: true,
    tiers: [
      { label: 'Digital PDF',   price: 999,  features: ['Print-ready PDF + PNG files', 'Delivered in 3-5 business days', 'Custom wax seal design included', '2 rounds of revisions'] },
      { label: 'Printed Cards', price: 3199, features: ['Letterpress printed + wax seal', 'Delivered in 12-15 business days', 'Vellum inner envelope', 'Hand-tied ribbon presentation'] },
    ],
    sizes: ['25 sets', '50 sets', '100 sets', '200 sets', '300 sets'],
    images: [
      'https://images.unsplash.com/photo-1646568779353-b9d2b903b3e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1764731080480-58b18e519bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1567794636765-5e4869f627e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1759887244219-17c3d64a7f01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    specs: [
      { label: 'Paper',         value: '300 gsm premium textured card' },
      { label: 'Wax seal',      value: 'Custom initial / crest seal' },
      { label: 'Envelope',      value: 'Vellum inner envelope' },
      { label: 'Personalization', value: 'Bride & groom names, venue, date, time' },
      { label: 'Delivery',      value: '14-18 business days (Standard)' },
    ],
    backPath: '/explore', backLabel: 'Explore',
  },

  'invite/classic-ivory-card': {
    name: 'Classic Ivory Card Invitation',
    eventBadge: 'WEDDING',
    hasPersonalization: true,
    tiers: [
      { label: 'Digital PDF',   price: 599,  features: ['Print-ready PDF + PNG files', 'Delivered in 2-4 business days', 'Ivory palette design included', '2 rounds of revisions'] },
      { label: 'Printed Cards', price: 1699, features: ['Offset-printed on ivory matte', 'Delivered in 8-10 business days', 'Satin ribbon + belly band', 'RSVP card included'] },
    ],
    sizes: ['25 cards', '50 cards', '100 cards', '200 cards', '500 cards'],
    images: [
      'https://images.unsplash.com/photo-1759887244219-17c3d64a7f01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1764731080480-58b18e519bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1646568779353-b9d2b903b3e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1567794636765-5e4869f627e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    specs: [
      { label: 'Paper',     value: '250 gsm ivory matte card' },
      { label: 'Printing',  value: 'Letterpress / offset (choice)' },
      { label: 'Size',      value: 'A5 (14.8 × 21 cm)' },
      { label: 'Envelope',  value: 'Ivory peel-and-seal envelope' },
      { label: 'Delivery',  value: '10-14 business days (Standard)' },
    ],
    backPath: '/explore', backLabel: 'Explore',
  },

  'stationery/luxury-wedding-suite': {
    name: 'Luxury Wedding Stationery Suite',
    eventBadge: 'WEDDING',
    hasPersonalization: true,
    tiers: [
      { label: 'Design Only', price: 2999, features: ['Digital files (PDF/PNG)', 'Delivered in 5-7 business days', 'Unlimited revisions', '3 format sizes included'] },
      { label: 'Design & Print', price: 7499, features: ['Design + printed copies', 'Delivered in 14-18 business days', 'Premium paper, foil finish', 'Includes envelopes'] },
    ],
    sizes: ['A5 Suite', 'A4 Suite', 'Square (15cm)', 'Custom'],
    images: [
      'https://images.unsplash.com/photo-1758825178518-ca48833a6c57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1763414902882-4e9d4f8e6275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1732649124686-3bab54f79aa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1578926288207-a90a5366759d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    specs: [
      { label: 'Suite includes', value: 'Invitation, RSVP, details card, envelope' },
      { label: 'Paper (print)',  value: '350 gsm premium cotton' },
      { label: 'Finish',        value: 'Gold foil / letterpress / flat print' },
      { label: 'Personalization', value: 'All text, colour palette, motifs' },
      { label: 'Delivery',      value: '14-18 business days (Design & Print)' },
    ],
    backPath: '/stationery', backLabel: 'Stationery',
  },

  'stationery/minimalist-suite': {
    name: 'Minimalist Suite Collection',
    eventBadge: 'WEDDING',
    hasPersonalization: true,
    tiers: [
      { label: 'Design Only',   price: 1999, features: ['Digital files (PDF/PNG)', 'Delivered in 3-5 business days', '2 revisions included'] },
      { label: 'Design & Print',price: 5499, features: ['Design + printed cards', 'Delivered in 12-15 business days', 'Premium matte finish', 'Kraft envelopes'] },
    ],
    sizes: ['50 sets', '100 sets', '200 sets', '500 sets'],
    images: [
      'https://images.unsplash.com/photo-1732649124686-3bab54f79aa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1758825178518-ca48833a6c57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1578926288207-a90a5366759d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1763414902882-4e9d4f8e6275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    specs: [
      { label: 'Style',         value: 'Clean lines, elegant typography' },
      { label: 'Paper (print)', value: '300 gsm matte coated' },
      { label: 'Finish',        value: 'Flat print / digital foil' },
      { label: 'Personalization', value: 'All text & colour scheme' },
      { label: 'Delivery',      value: '12-15 business days (Design & Print)' },
    ],
    backPath: '/stationery', backLabel: 'Stationery',
  },

  // Carousel gift items that link here
  'gift/premium-gift-hamper': {
    name: 'Premium Gift Hamper',
    eventBadge: 'CELEBRATIONS',
    hasPersonalization: true,
    tiers: [
      { label: 'Standard', price: 1999, features: ['Basic personalization', 'Delivered in 7-10 business days', 'Gift-wrapped presentation'] },
      { label: 'Premium',  price: 3299, features: ['Full custom box & label', 'Delivered in 5-7 business days', 'Luxury hamper contents', 'Silk ribbon & sealing wax'] },
    ],
    sizes: ['Small', 'Medium', 'Large', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238bd345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1547592180-85f173990554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    specs: [
      { label: 'Contents',      value: 'Gourmet items, chocolates, candle, keepsake' },
      { label: 'Packaging',     value: 'Branded gift box / wicker basket' },
      { label: 'Personalization', value: 'Custom label, ribbon print, gift card' },
      { label: 'Min. quantity', value: '1 hamper' },
      { label: 'Delivery',      value: '7-10 business days (Standard)' },
    ],
    backPath: '/gifts', backLabel: 'Gifts',
  },

  'gift/curated-wedding-box': {
    name: 'Curated Wedding Box',
    eventBadge: 'WEDDING',
    hasPersonalization: true,
    tiers: [
      { label: 'Standard', price: 1599, features: ['Name & date on box lid', 'Delivered in 10-14 business days', 'Satin ribbon finish'] },
      { label: 'Premium',  price: 2799, features: ['Full custom design + monogram', 'Delivered in 7-10 business days', 'Luxury silk interior', 'Personalized notecard'] },
    ],
    sizes: ['Small', 'Medium', 'Large'],
    images: [
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1549465220-1a8b9238bd345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    ],
    specs: [
      { label: 'Box material',  value: 'Rigid chipboard, matte laminate' },
      { label: 'Contents',      value: 'Curated selection of luxury items' },
      { label: 'Personalization', value: 'Lid print, ribbon, inside card' },
      { label: 'Min. quantity', value: '1 box' },
      { label: 'Delivery',      value: '10-14 business days (Standard)' },
    ],
    backPath: '/gifts', backLabel: 'Gifts',
  },
};

// ── Related products shown in "You May Also Like" ─────────────────────────────

const relatedProducts = [
  { slug: 'gift/luxury-wedding-hamper',    name: 'Luxury Wedding Hamper',       price: 2499, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238bd345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { slug: 'gift/personalized-couple-frame',name: 'Personalized Couple Frame',    price: 899,  image: 'https://images.unsplash.com/photo-1571781926291-1a36ba6d3e73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { slug: 'invite/embossed-gold-card',     name: 'Embossed Gold Card',           price: 1299, image: 'https://images.unsplash.com/photo-1764731080480-58b18e519bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { slug: 'gift/bridesmaid-gift-box',      name: 'Bridesmaid Gift Box',          price: 1299, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { slug: 'invite/wax-seal-envelope-suite',name: 'Wax Seal Envelope Suite',      price: 1799, image: 'https://images.unsplash.com/photo-1646568779353-b9d2b903b3e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { slug: 'gift/premium-dry-fruit-hamper', name: 'Premium Dry Fruit Hamper',     price: 1899, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
];

const clientReviews = [
  { name: 'Priya Sharma',   avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100', rating: 5, text: 'Absolutely stunning quality! Every guest kept asking where we got these from. Eventique exceeded every expectation.', event: 'Wedding · Delhi', verified: true },
  { name: 'Rahul Mehta',    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100', rating: 5, text: 'The packaging was premium and personalization was exactly as requested. Delivered 2 days before the deadline!', event: 'Anniversary · Mumbai', verified: true },
  { name: 'Sneha Reddy',    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100', rating: 5, text: 'Ordered bridesmaid boxes and they were a huge hit! The team was so helpful with last-minute customization requests.', event: 'Wedding · Bangalore', verified: true },
  { name: 'Arjun Kapoor',   avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100', rating: 4, text: 'Great attention to detail and beautiful presentation. The hampers were loved by everyone at the reception.', event: 'Wedding · Jaipur', verified: true },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const { type, slug } = useParams<{ type: string; slug: string }>();
  const key = `${type}/${slug}`;
  const product = catalog[key];

  const [activeImg, setActiveImg] = useState(0);
  const [tierIdx, setTierIdx] = useState(0);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  // Gift fields
  const [names, setNames] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  // Invite / stationery event fields
  const [coupleNames, setCoupleNames] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'Description' | 'Specifications' | 'Shipping Info'>('Description');

  const isGift = type === 'gift';
  const isInvite = type === 'invite';
  const isStationery = type === 'stationery';

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl mb-4 text-[#1a1410]">Product Not Found</h1>
        <p className="text-gray-500 mb-8">This product doesn't exist or may have moved.</p>
        <Link to="/explore" className="px-8 py-3 bg-[#8B4949] text-white rounded-full font-semibold hover:bg-[#7a3f3f] transition-all">
          Browse Products
        </Link>
      </div>
    );
  }

  const tier = product.tiers[tierIdx];
  const currentSize = size || product.sizes[0];

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Filter out current product from related
  const related = relatedProducts.filter(r => r.slug !== key).slice(0, 4);

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#8B4949] transition-colors">Home</Link>
          <span>/</span>
          <Link to={product.backPath} className="hover:text-[#8B4949] transition-colors">{product.backLabel}</Link>
          <span>/</span>
          <span className="text-[#1a1410]">{product.name}</span>
        </div>

        {/* Back link */}
        <Link to={product.backPath} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#8B4949] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to {product.backLabel}
        </Link>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── LEFT: Image Gallery ────────────────────────────── */}
          <div className="flex gap-4 sticky top-24">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3 w-[68px] flex-shrink-0">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square w-full rounded-xl overflow-hidden border-2 transition-all ${
                    activeImg === i
                      ? 'border-[#8B4949] shadow-md shadow-[#8B4949]/20'
                      : 'border-transparent hover:border-[#8B4949]/40'
                  }`}
                >
                  <ImageWithFallback src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-white shadow-sm group aspect-square">
              <ImageWithFallback
                src={product.images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Nav arrows */}
              <button
                onClick={() => setActiveImg(i => (i - 1 + product.images.length) % product.images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4 text-[#8B4949]" />
              </button>
              <button
                onClick={() => setActiveImg(i => (i + 1) % product.images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronRight className="w-4 h-4 text-[#8B4949]" />
              </button>
            </div>
          </div>

          {/* ── RIGHT: Product Details ─────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#8B4949] text-white text-xs font-bold tracking-widest uppercase rounded-full">
                {product.eventBadge}
              </span>
              {product.hasPersonalization && (
                <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold tracking-wide uppercase rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Personalization Available
                </span>
              )}
            </div>

            {/* Name + actions */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl md:text-3xl text-[#1a1410] leading-tight">{product.name}</h1>
              <div className="flex gap-2 flex-shrink-0 mt-1">
                <button
                  onClick={() => setWishlisted(w => !w)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                    wishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:border-[#8B4949]/40 hover:text-[#8B4949]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="w-9 h-9 rounded-full border border-gray-200 text-gray-400 flex items-center justify-center hover:border-[#8B4949]/40 hover:text-[#8B4949] transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div>
              <span className="text-3xl font-bold text-[#8B4949]">₹{tier.price.toLocaleString('en-IN')}</span>
              <span className="text-sm text-gray-400 ml-2">
                starting / {isInvite ? 'set' : isStationery ? 'suite' : 'piece'}
              </span>
            </div>

            {/* Tier selector */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2.5">
                {isInvite ? 'Select Format' : isStationery ? 'Select Service' : 'Select Tier'}
              </p>
              <div className="flex gap-3">
                {product.tiers.map((t, i) => (
                  <button
                    key={t.label}
                    onClick={() => setTierIdx(i)}
                    className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all ${
                      tierIdx === i
                        ? 'bg-[#8B4949] text-white shadow-md shadow-[#8B4949]/20'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-[#8B4949]/40'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier features */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              {tier.features.map((f, i) => (
                <div key={i} className={`flex items-start gap-2.5 text-sm text-gray-600 ${i > 0 ? 'mt-2.5 pt-2.5 border-t border-gray-50' : ''}`}>
                  {i === 0 ? <Sparkles className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" /> :
                   i === 1 ? <Package className="w-4 h-4 text-[#8B4949] flex-shrink-0 mt-0.5" /> :
                   <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />}
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Size selector */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2.5">
                {isInvite ? 'Quantity' : isStationery ? 'Suite Format' : 'Size'}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      currentSize === s
                        ? 'bg-[#8B4949] text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-[#8B4949]/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2.5">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#8B4949]/40 hover:text-[#8B4949] transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#8B4949]/40 hover:text-[#8B4949] transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Personalization — type-specific fields */}
            {product.hasPersonalization && isGift && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2.5">Personalization</p>
                <div className="flex flex-col gap-2">
                  <input value={names} onChange={e => setNames(e.target.value)}
                    placeholder="Names (e.g. Rahul & Priya)"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4949]/30 focus:border-[#8B4949]/50 transition-all placeholder:text-gray-300" />
                  <input value={giftMessage} onChange={e => setGiftMessage(e.target.value)}
                    placeholder="Message (optional)"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4949]/30 focus:border-[#8B4949]/50 transition-all placeholder:text-gray-300" />
                </div>
              </div>
            )}

            {product.hasPersonalization && (isInvite || isStationery) && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2.5">Event Details</p>
                <div className="flex flex-col gap-2">
                  <input value={coupleNames} onChange={e => setCoupleNames(e.target.value)}
                    placeholder="Bride & Groom / Couple Names"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4949]/30 focus:border-[#8B4949]/50 transition-all placeholder:text-gray-300" />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={eventDate} onChange={e => setEventDate(e.target.value)}
                      placeholder="Wedding Date"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4949]/30 focus:border-[#8B4949]/50 transition-all placeholder:text-gray-300" />
                    <input value={eventTime} onChange={e => setEventTime(e.target.value)}
                      placeholder="Ceremony Time"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4949]/30 focus:border-[#8B4949]/50 transition-all placeholder:text-gray-300" />
                  </div>
                  <input value={venue} onChange={e => setVenue(e.target.value)}
                    placeholder="Venue Name & City"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4949]/30 focus:border-[#8B4949]/50 transition-all placeholder:text-gray-300" />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
              <div className="flex flex-1 gap-2.5">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 touch-manipulation ${
                    addedToCart
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#8B4949] text-white hover:bg-[#7a3f3f] shadow-md shadow-[#8B4949]/20 hover:shadow-lg'
                  }`}
                >
                  {addedToCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                  {addedToCart ? 'Added!' : 'Add to Cart'}
                </button>
                <Link
                  to="/order"
                  className="flex-1 py-3.5 bg-[#1a1410] text-white rounded-full font-semibold text-sm text-center hover:bg-[#2d241e] transition-all shadow-md cursor-pointer active:scale-95 touch-manipulation"
                >
                  Buy Now
                </Link>
              </div>
              <button
                onClick={() => setWishlisted(w => !w)}
                className={`w-full sm:w-12 h-12 rounded-full border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer active:scale-95 touch-manipulation ${
                  wishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:border-[#8B4949]/40 hover:text-[#8B4949]'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
                <span className="sm:hidden ml-2 font-medium text-sm">Add to Wishlist</span>
              </button>
            </div>

          </div>
        </div>

        {/* ── Description / Specifications / Shipping Info Tabs ─── */}
        <div className="mt-10 border-t border-gray-100">
          <div className="flex border-b border-gray-100">
            {(['Description', 'Specifications', 'Shipping Info'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-medium transition-all relative text-center ${
                  activeTab === tab
                    ? 'text-[#8B4949]'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B4949]" />
                )}
              </button>
            ))}
          </div>

          <div className="py-6 px-2">
            {activeTab === 'Description' && (
              <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
                A beautifully crafted {product.name.toLowerCase()} filled with premium quality and care, personalized with your names and a heartfelt message. Each piece is handcrafted by our artisans using only the finest materials — ensuring every detail is perfect for your special occasion. Whether you are celebrating a wedding, anniversary, or milestone, this makes an unforgettable impression on every recipient.
              </p>
            )}
            {activeTab === 'Specifications' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                {product.specs.map(s => (
                  <div key={s.label} className="flex items-start gap-2 text-sm">
                    <span className="text-[#8B4949] font-semibold flex-shrink-0 w-32">{s.label}</span>
                    <span className="text-gray-500">{s.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'Shipping Info' && (
              <div className="space-y-3 max-w-lg text-sm text-gray-500">
                <p><span className="font-semibold text-[#1a1410]">Standard shipping:</span> 10-14 business days after order confirmation.</p>
                <p><span className="font-semibold text-[#1a1410]">Premium tier:</span> 5-7 business days with priority processing.</p>
                <p><span className="font-semibold text-[#1a1410]">Tracking:</span> You will receive a tracking link via WhatsApp and email once your order ships.</p>
                <p><span className="font-semibold text-[#1a1410]">Packaging:</span> All orders are securely packed in branded boxes to prevent damage in transit.</p>
                <p><span className="font-semibold text-[#1a1410]">Returns:</span> Since items are personalized, we do not accept returns. However, if you receive a damaged or incorrect item, please contact us within 48 hours.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── What Our Clients Say ───────────────────────────────── */}
        <section className="mt-20">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#8B4949]/10 text-[#8B4949] rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              ✦ Client Reviews
            </span>
            <h2 className="text-3xl md:text-4xl text-[#1a1410]">What Our Clients Say</h2>
            <div className="mt-4 flex justify-center">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {clientReviews.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
                <p className="text-sm text-gray-500 leading-relaxed">{r.text}</p>
                {r.verified && (
                  <span className="mt-3 inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                    <Check className="w-3 h-3" /> Verified Purchase
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── You May Also Like ──────────────────────────────────── */}
        <section className="mt-20 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl text-[#1a1410]">You May Also Like</h2>
            <Link to="/explore" className="text-sm text-[#8B4949] hover:text-[#7a3f3f] font-medium flex items-center gap-1 group">
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((item) => (
              <Link
                key={item.slug}
                to={`/shop/${item.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3.5">
                  <p className="text-sm font-semibold text-[#1a1410] line-clamp-1 mb-1">{item.name}</p>
                  <p className="text-[#8B4949] font-bold text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
