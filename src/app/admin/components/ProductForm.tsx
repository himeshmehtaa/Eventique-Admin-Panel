import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { FileUploadZone } from './FileUploadZone';
import { TagInput } from './TagInput';
import type { Product, ProductType, OccasionType } from '../../data/products';

const PRODUCT_TYPES: ProductType[] = ['video-invite', 'pdf-invite', 'e-invitation', 'wedding-website', 'stationery', 'website', 'printed-invite'];
const OCCASIONS: OccasionType[] = ['wedding', 'engagement', 'birthday', 'baby-shower', 'pooja', 'anniversary', 'all'];

const TYPE_LABEL_OPTIONS: Record<ProductType, string> = {
  'video-invite': 'Video Invite',
  'pdf-invite': 'PDF Invite',
  'e-invitation': 'Gifts / E-Invitation',
  'wedding-website': 'Event Website',
  'website': 'Wedding Website',
  'stationery': 'Stationery',
  'printed-invite': 'Printed Invite',
};

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  defaultType?: ProductType;
}

export function ProductForm({ product, onClose, defaultType }: ProductFormProps) {
  const { addProduct, updateProduct } = useAdmin();
  const isEdit = !!product;

  const [form, setForm] = useState<Omit<Product, 'id'>>({
    name: product?.name || '',
    type: product?.type || defaultType || 'video-invite',
    occasion: product?.occasion || 'wedding',
    price: product?.price || 0,
    description: product?.description || '',
    features: product?.features || [],
    deliveryTime: product?.deliveryTime || '',
    imageUrl: product?.imageUrl || '',
    videoUrl: product?.videoUrl || '',
    demoUrl: product?.demoUrl || '',
    size: product?.size || '',
    moq: product?.moq || '',
    material: product?.material || '',
    canPersonalise: product?.canPersonalise ?? false,
    paperQuality: product?.paperQuality || '',
    shape: product?.shape || '',
    color: product?.color || '',
    originalPrice: product?.originalPrice || undefined,
    promoTag: product?.promoTag || '',
    tier: product?.tier || '',
    images: product?.images || [],
    createdAt: product?.createdAt || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Product, 'id'> | 'videoUrl' | 'demoUrl', string>>>({});

  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.price <= 0) e.price = 'Price must be greater than 0';
    if (!form.deliveryTime.trim()) e.deliveryTime = 'Delivery time is required';
    if (!form.imageUrl.trim()) e.imageUrl = 'Image is required';

    if (form.type === 'video-invite' && !form.videoUrl?.trim()) {
      e.videoUrl = 'Video URL is required';
    }
    if ((form.type === 'wedding-website' || form.type === 'website') && !form.demoUrl?.trim()) {
      e.demoUrl = 'Demo URL is required';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEdit && product) {
      updateProduct(product.id, form);
    } else {
      addProduct({ ...form, id: `p-${Date.now()}` });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden admin-scale-in">
        {/* Header */}
        <div className="bg-white border-b border-[#e5e5e5] px-6 py-4 flex items-center justify-between shrink-0 z-10">
          <h2 className="text-lg font-bold text-[#1a1410]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>

        {/* Form body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(85vh-140px)] admin-scrollbar grow">
          {/* Name */}
          <div>
            <label className="admin-label">Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Royal Elegance"
              className={`admin-input ${errors.name ? 'border-red-400' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Type + Occasion */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Product Type *</label>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value as ProductType)}
                className="admin-select"
              >
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>{TYPE_LABEL_OPTIONS[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label">Occasion *</label>
              <select
                value={form.occasion}
                onChange={(e) => set('occasion', e.target.value as OccasionType)}
                className="admin-select"
              >
                {OCCASIONS.map((o) => (
                  <option key={o} value={o} className="capitalize">{o.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tailored Specification Fields according to Product Type */}
          <div key={form.type} className="space-y-4 rounded-xl bg-[#faf8f5] border border-[#f0ece4] px-4 py-4 admin-animate-in">
            <p className="text-xs font-semibold text-[#8B4949] uppercase tracking-widest">
              {TYPE_LABEL_OPTIONS[form.type] || form.type.replace(/-/g, ' ')} Specifications
            </p>

            {/* Video Invite specifications */}
            {form.type === 'video-invite' && (
              <div className="space-y-4">
                <div>
                  <label className="admin-label">Video URL *</label>
                  <input
                    type="url"
                    value={form.videoUrl || ''}
                    onChange={(e) => set('videoUrl', e.target.value)}
                    placeholder="e.g. https://youtube.com/watch?v=... or https://vimeo.com/..."
                    className={`admin-input ${errors.videoUrl ? 'border-red-400' : ''}`}
                  />
                  {errors.videoUrl && <p className="text-xs text-red-500 mt-1">{errors.videoUrl}</p>}
                </div>
              </div>
            )}

            {/* Website/Event Demo URL specifications */}
            {(form.type === 'wedding-website' || form.type === 'website') && (
              <div className="space-y-4">
                <div>
                  <label className="admin-label">Live Demo URL *</label>
                  <input
                    type="url"
                    value={form.demoUrl || ''}
                    onChange={(e) => set('demoUrl', e.target.value)}
                    placeholder="e.g. https://my-wedding-demo.vercel.app"
                    className={`admin-input ${errors.demoUrl ? 'border-red-400' : ''}`}
                  />
                  {errors.demoUrl && <p className="text-xs text-red-500 mt-1">{errors.demoUrl}</p>}
                </div>
              </div>
            )}

            {/* PDF Invite specifications (only show Size) */}
            {form.type === 'pdf-invite' && (
              <div className="space-y-4">
                <div>
                  <label className="admin-label">Size / Dimensions</label>
                  <input
                    type="text"
                    value={form.size || ''}
                    onChange={(e) => set('size', e.target.value)}
                    placeholder="e.g. A5 Size, 5x7 inches"
                    className="admin-input"
                  />
                </div>
              </div>
            )}

            {/* Printed Invite specifications (Full specs) */}
            {form.type === 'printed-invite' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">Size / Dimensions</label>
                    <input
                      type="text"
                      value={form.size || ''}
                      onChange={(e) => set('size', e.target.value)}
                      placeholder="e.g. 5x7 inches"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Minimum Order Quantity (MOQ)</label>
                    <input
                      type="text"
                      value={form.moq || ''}
                      onChange={(e) => set('moq', e.target.value)}
                      placeholder="e.g. 50 sets"
                      className="admin-input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">Shape</label>
                    <input
                      type="text"
                      value={form.shape || ''}
                      onChange={(e) => set('shape', e.target.value)}
                      placeholder="e.g. Rectangle, Rounded Edge, Die-Cut"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Colour / Color Theme</label>
                    <input
                      type="text"
                      value={form.color || ''}
                      onChange={(e) => set('color', e.target.value)}
                      placeholder="e.g. Burgundy & Gold, Pastel Pink"
                      className="admin-input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">Paper Quality</label>
                    <input
                      type="text"
                      value={form.paperQuality || ''}
                      onChange={(e) => set('paperQuality', e.target.value)}
                      placeholder="e.g. 300gsm Premium Matte"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Material / Finish</label>
                    <input
                      type="text"
                      value={form.material || ''}
                      onChange={(e) => set('material', e.target.value)}
                      placeholder="e.g. Gold Foil Stamping, Velvet"
                      className="admin-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Stationery specifications */}
            {form.type === 'stationery' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">Size / Dimensions</label>
                    <input
                      type="text"
                      value={form.size || ''}
                      onChange={(e) => set('size', e.target.value)}
                      placeholder="e.g. Custom size"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Minimum Order Quantity (MOQ)</label>
                    <input
                      type="text"
                      value={form.moq || ''}
                      onChange={(e) => set('moq', e.target.value)}
                      placeholder="e.g. 100 pcs"
                      className="admin-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Material / Finish</label>
                  <input
                    type="text"
                    value={form.material || ''}
                    onChange={(e) => set('material', e.target.value)}
                    placeholder="e.g. Cotton paper, Textured board"
                    className="admin-input"
                  />
                </div>
              </div>
            )}

            {/* Gifts / E-Invitation specifications */}
            {form.type === 'e-invitation' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">Size / Dimensions</label>
                    <input
                      type="text"
                      value={form.size || ''}
                      onChange={(e) => set('size', e.target.value)}
                      placeholder="e.g. 6x6 inches"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Minimum Order Quantity (MOQ)</label>
                    <input
                      type="text"
                      value={form.moq || ''}
                      onChange={(e) => set('moq', e.target.value)}
                      placeholder="e.g. 25 boxes"
                      className="admin-input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">Shape</label>
                    <input
                      type="text"
                      value={form.shape || ''}
                      onChange={(e) => set('shape', e.target.value)}
                      placeholder="e.g. Square, Rectangular"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Colour / Color Theme</label>
                    <input
                      type="text"
                      value={form.color || ''}
                      onChange={(e) => set('color', e.target.value)}
                      placeholder="e.g. Luxury Gold & Cream"
                      className="admin-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Material / Finish</label>
                  <input
                    type="text"
                    value={form.material || ''}
                    onChange={(e) => set('material', e.target.value)}
                    placeholder="e.g. Wood, Velvet lining"
                    className="admin-input"
                  />
                </div>
              </div>
            )}

            {/* Personalization checkbox (Shared by all types) */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="canPersonalise"
                checked={form.canPersonalise || false}
                onChange={(e) => set('canPersonalise', e.target.checked)}
                className="w-4 h-4 text-[#8B4949] border-gray-300 rounded focus:ring-[#8B4949]"
              />
              <label htmlFor="canPersonalise" className="text-sm font-semibold text-gray-700 select-none">
                Can customer Personalise their Design?
              </label>
            </div>
          </div>

          {/* Price + Delivery */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Price (₹) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set('price', Number(e.target.value))}
                placeholder="e.g. 2499"
                min={0}
                className={`admin-input ${errors.price ? 'border-red-400' : ''}`}
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="admin-label">Delivery Time *</label>
              <input
                type="text"
                value={form.deliveryTime}
                onChange={(e) => set('deliveryTime', e.target.value)}
                placeholder="e.g. 3-4 days"
                className={`admin-input ${errors.deliveryTime ? 'border-red-400' : ''}`}
              />
              {errors.deliveryTime && <p className="text-xs text-red-500 mt-1">{errors.deliveryTime}</p>}
            </div>
          </div>

          {/* Offer & Discount Section */}
          <div className="space-y-4 rounded-xl border border-dashed border-[#e5e5e5] px-4 py-4 bg-white">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Offer & Promotion (Optional)</p>
              <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">Promo Badge Active</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Original Price (₹) <span className="text-gray-400 font-normal">(Compare-at)</span></label>
                <input
                  type="number"
                  value={form.originalPrice || ''}
                  onChange={(e) => set('originalPrice', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 3499"
                  min={0}
                  className="admin-input"
                />
                <p className="text-[10px] text-gray-400 mt-1">Leave empty or higher than Price to show strike-through.</p>
              </div>
              <div>
                <label className="admin-label">Offer Tag / Promo Badge</label>
                <input
                  type="text"
                  value={form.promoTag || ''}
                  onChange={(e) => set('promoTag', e.target.value)}
                  placeholder="e.g. 30% OFF, SALE, BUNDLE"
                  className="admin-input"
                />
                <p className="text-[10px] text-gray-400 mt-1">Displays as a red discount badge on the catalog.</p>
              </div>
            </div>
          </div>

          {/* Product Tag / Tier Classification */}
          <div className="space-y-4 rounded-xl border border-dashed border-[#e5e5e5] px-4 py-4 bg-white">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Product Classification Tag (Optional)</p>
              <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">Premium Branding</span>
            </div>
            <div>
              <label className="admin-label">Tag / Tier Name</label>
              <input
                type="text"
                value={form.tier || ''}
                onChange={(e) => set('tier', e.target.value)}
                placeholder="e.g. Standard, Premium, Luxury"
                className="admin-input"
              />
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {['Standard', 'Premium', 'Luxury'].map((t) => {
                  const isActive = form.tier === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set('tier', t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        isActive
                          ? 'bg-[#8B4949] text-white border-[#8B4949] shadow-sm'
                          : 'bg-[#faf8f5] text-[#4a4a4a] border-[#e5e5e5] hover:bg-[#f5f0e8] hover:text-[#1a1410]'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
                {form.tier && !['Standard', 'Premium', 'Luxury'].includes(form.tier) && (
                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#D4AF37] text-white border border-[#D4AF37] flex items-center gap-1">
                    {form.tier}
                    <button type="button" onClick={() => set('tier', '')} className="hover:text-red-200">
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Select a quick tag or type custom classification name (e.g. Premium). Leave empty for no tag.</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="admin-label">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Brief description of the product..."
              rows={3}
              className={`admin-textarea ${errors.description ? 'border-red-400' : ''}`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Features */}
          <TagInput
            label="Features"
            value={form.features}
            onChange={(tags) => set('features', tags)}
            placeholder="Add feature and press Enter..."
          />

          {/* Image */}
          <FileUploadZone
            label="Product Image *"
            value={form.imageUrl}
            onChange={(url) => set('imageUrl', url)}
            hint="Recommended size: 800×600px"
          />
          {errors.imageUrl && <p className="text-xs text-red-500">{errors.imageUrl}</p>}

          {/* Carousel Images Section */}
          <div className="space-y-4 rounded-xl border border-dashed border-[#e5e5e5] px-4 py-4 bg-white">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Carousel Gallery (Optional)</p>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">Multiple Photos</span>
            </div>
            
            {/* Display list of current carousel images */}
            {form.images && form.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {form.images.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-[#e5e5e5] group bg-gray-50">
                    <img src={url} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...(form.images || [])];
                        next.splice(idx, 1);
                        set('images', next);
                      }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-md text-gray-500 hover:text-red-500 hover:bg-red-50"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new image input/uploader */}
            <div className="pt-2">
              <FileUploadZone
                label="Add Photo to Carousel"
                value=""
                onChange={(url) => {
                  if (url) {
                    const current = form.images || [];
                    set('images', [...current, url]);
                  }
                }}
                hint="Upload or paste a URL to append to the carousel gallery"
              />
            </div>
          </div>


        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#e5e5e5] px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} className="admin-btn admin-btn-ghost border border-[#e5e5e5]">Cancel</button>
          <button onClick={handleSubmit} className="admin-btn admin-btn-primary">
            <Save size={15} /> {isEdit ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
