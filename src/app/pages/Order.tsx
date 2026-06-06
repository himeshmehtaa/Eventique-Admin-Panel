import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Check } from 'lucide-react';

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, package: pkg, websitePlan } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: product?.occasion || '',
    eventDate: '',
    requirements: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate payment redirect (in production, integrate with Razorpay)
    const paymentData = {
      ...formData,
      product: product?.name,
      package: pkg?.name,
      websitePlan: websitePlan?.name,
      amount: product?.price || pkg?.price || websitePlan?.price,
    };

    console.log('Payment data:', paymentData);
    
    // Show success message
    setSubmitted(true);
    
    // In production, redirect to Razorpay payment gateway
    setTimeout(() => {
      const phoneNumber = '919876543210';
      const message = `Hi! I've placed an order for ${product?.name || pkg?.name || websitePlan?.name}. Order details: ${formData.name}, ${formData.phone}, Event Date: ${formData.eventDate}`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl mb-4">Order Received!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your order. Our team will contact you on WhatsApp shortly to discuss customization details.
            </p>
            <div className="bg-muted rounded-xl p-6 mb-8">
              <h3 className="text-lg mb-4">Next Steps:</h3>
              <ol className="text-left space-y-2 text-muted-foreground">
                <li>1. You'll receive a confirmation on WhatsApp within 30 minutes</li>
                <li>2. Our designer will reach out to understand your requirements</li>
                <li>3. We'll create the first draft and share for your review</li>
                <li>4. Make revisions until you're completely satisfied</li>
                <li>5. Receive your final design and start sharing!</li>
              </ol>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl mb-4">Place Your Order</h1>
            <p className="text-lg text-muted-foreground">
              Fill in your details and we'll get started on creating your perfect invitation
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-2xl mb-6">Your Details</h2>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  {/* Event Type */}
                  <div>
                    <label htmlFor="eventType" className="block mb-2">
                      Event Type *
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      required
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select event type</option>
                      <option value="wedding">Wedding</option>
                      <option value="engagement">Engagement</option>
                      <option value="birthday">Birthday</option>
                      <option value="baby-shower">Baby Shower</option>
                      <option value="pooja">Pooja</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Event Date */}
                  <div>
                    <label htmlFor="eventDate" className="block mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      id="eventDate"
                      name="eventDate"
                      required
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Requirements */}
                  <div>
                    <label htmlFor="requirements" className="block mb-2">
                      Special Requirements
                    </label>
                    <textarea
                      id="requirements"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Tell us about your preferences, color themes, or any special requests..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                  >
                    Proceed to Payment
                  </button>

                  <p className="text-sm text-muted-foreground text-center">
                    By proceeding, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-muted rounded-2xl p-6 sticky top-24">
                <h3 className="text-xl mb-6">Order Summary</h3>

                {product && (
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Product</p>
                    <p className="font-semibold mb-1">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.type}</p>
                  </div>
                )}

                {pkg && (
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Package</p>
                    <p className="font-semibold">{pkg.name}</p>
                  </div>
                )}

                {websitePlan && (
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Wedding Website</p>
                    <p className="font-semibold">{websitePlan.name} Plan</p>
                  </div>
                )}

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{(product?.price || pkg?.price || websitePlan?.price || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Tax (18%)</span>
                    <span>₹{Math.round((product?.price || pkg?.price || websitePlan?.price || 0) * 0.18).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">Total</span>
                    <span className="text-2xl font-semibold text-primary">
                      ₹{Math.round((product?.price || pkg?.price || websitePlan?.price || 0) * 1.18).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-center">
                    🔒 Secure payment powered by Razorpay
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
