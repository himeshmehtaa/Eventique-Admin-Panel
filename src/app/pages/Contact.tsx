import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, ChevronDown } from 'lucide-react';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';
import { useAdmin } from '../admin/context/AdminContext';

export default function Contact() {
  const { state } = useAdmin();
  const contactBlock = state.contentBlocks.find((cb) => cb.sectionName === 'Contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const contactDetails = contactBlock?.contactDetails || [
    { type: 'whatsapp', title: 'WhatsApp', subtitle: 'Chat with us instantly', value: '919876543210', linkText: 'Start Chat →', linkUrl: 'https://wa.me/919876543210' },
    { type: 'phone', title: 'Phone', subtitle: 'Mon-Sat, 9AM to 8PM IST', value: '+91 98765 43210' },
    { type: 'email', title: 'Email', subtitle: "We'll reply within 24 hours", value: 'hello@eventique.in' },
    { type: 'studio', title: 'Studio', subtitle: 'Available for virtual consultations worldwide.', value: 'Mumbai, Maharashtra, India' },
    { type: 'response', title: 'Our Response Time', subtitle: 'We typically respond within 2-4 hours during business hours.', value: '2-4 hours' }
  ];

  const getDetail = (type: string) => contactDetails.find(d => d.type === type);
  const whatsappDetail = getDetail('whatsapp');
  const phoneDetail = getDetail('phone');
  const emailDetail = getDetail('email');
  const studioDetail = getDetail('studio');
  const responseDetail = getDetail('response');

  const ctaInfo = contactBlock?.contactCtaInfo || {
    title: "Let's talk",
    subtitle: 'directly.',
    detail: "Our team is happy to walk you through options, pricing, and timelines — no pressure, just a warm and friendly conversation.",
    whatsappNumber: '919876543210',
    whatsappText: 'Hi! I have a question about Eventique services.'
  };

  const faqs = contactBlock?.contactFaqs || [
    { q: 'How long does it take to receive my invitation design?', a: 'Standard turnaround is 3–5 business days. Rush delivery within 24–48 hours is available for an additional fee.' },
    { q: 'Can I request unlimited revisions?', a: 'Every order includes up to 3 rounds of revisions. Additional revisions can be requested at a nominal charge.' },
    { q: 'Do you offer physical printed stationery?', a: 'Yes! We offer premium printed stationery shipped across India and 20+ countries. Delivery timelines vary by location.' },
    { q: 'What file formats will I receive?', a: 'Digital invitations are delivered as high-resolution PDFs and print-ready files. Video invites are delivered as MP4.' },
    { q: 'Can I customise the language or script?', a: 'Absolutely. We support designs in Hindi, Gujarati, Tamil, Telugu, Punjabi, and many other regional scripts alongside English.' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', eventType: '', eventDate: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsApp = () => {
    const phoneNumber = whatsappDetail?.value || '919876543210';
    const message = ctaInfo.whatsappText || 'Hi! I would like to know more about Eventique services.';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="py-12 relative overflow-hidden">
      <MandalaDecor className="absolute top-20 right-10 w-56 h-56 text-primary opacity-35 animate-rotate-slow" />
      <LotusDecor className="absolute bottom-20 left-10 w-40 h-40 text-secondary opacity-40 animate-float" />

      <div className="container mx-auto px-4 relative z-10 pb-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase mb-6">
            Contact Us
          </div>
          <h1 className="text-5xl md:text-6xl mb-6">{contactBlock?.title || "Let's Create Together"}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {contactBlock?.subtitle || "Whether you have a specific vision or need creative guidance, our team is here to help you craft the perfect invitation."}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 max-w-7xl mx-auto items-start">

          {/* Contact Information - Left Sidebar */}
          <div className="lg:col-span-4 space-y-4">

            {/* WhatsApp */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex gap-4 group hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-[#25D366]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <h4 className="font-semibold text-base mb-0.5">{whatsappDetail?.title || "WhatsApp"}</h4>
                <p className="text-sm text-muted-foreground mb-2">{whatsappDetail?.subtitle || "Chat with us instantly"}</p>
                <button onClick={handleWhatsApp} className="text-[#25D366] text-sm font-medium hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer">
                  {whatsappDetail?.linkText || "Start Chat →"}
                </button>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex gap-4 group hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-base mb-0.5">{phoneDetail?.title || "Phone"}</h4>
                <p className="text-sm text-muted-foreground mb-2">{phoneDetail?.subtitle || "Mon-Sat, 9AM to 8PM IST"}</p>
                <a href={`tel:${(phoneDetail?.value || "+919876543210").replace(/\s+/g, '')}`} className="text-primary text-sm font-medium hover:underline">
                  {phoneDetail?.value || "+91 98765 43210"}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex gap-4 group hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-base mb-0.5">{emailDetail?.title || "Email"}</h4>
                <p className="text-sm text-muted-foreground mb-2">{emailDetail?.subtitle || "We'll reply within 24 hours"}</p>
                <a href={`mailto:${emailDetail?.value || "hello@eventique.in"}`} className="text-primary text-sm font-medium hover:underline">
                  {emailDetail?.value || "hello@eventique.in"}
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex gap-4 group hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-base mb-0.5">{studioDetail?.title || "Studio"}</h4>
                <p className="text-sm text-muted-foreground">
                  {studioDetail?.subtitle || "Available for virtual consultations worldwide."}
                </p>
                {studioDetail?.value && (
                  <p className="text-xs text-gray-400 mt-1 font-semibold">{studioDetail.value}</p>
                )}
              </div>
            </div>

            {/* Response time badge */}
            <div className="p-5 bg-[#fdf8f0] rounded-2xl border border-[#D4AF37]/20">
              <p className="text-xs text-[#8B4949] font-bold uppercase tracking-widest mb-1">{responseDetail?.title || "Our Response Time"}</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                We typically respond within <span className="font-bold text-[#8B4949]">{responseDetail?.value || "2-4 hours"}</span> during business hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] border border-border p-10 shadow-xl shadow-primary/5">
              <h2 className="text-2xl mb-8">Send Us a Message</h2>

              {submitted ? (
                <div className="text-center py-20 bg-[#fdf8f0] rounded-3xl border border-dashed border-primary/30">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-3xl mb-4">Message Sent!</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Thank you for reaching out. A design consultant will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name + Email */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-sm font-semibold text-gray-700">Your Name *</label>
                      <input
                        type="text" id="name" name="name" required
                        value={formData.name} onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address *</label>
                      <input
                        type="email" id="email" name="email" required
                        value={formData.email} onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number</label>
                    <input
                      type="tel" id="phone" name="phone"
                      value={formData.phone} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  {/* Event Type + Event Date */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="eventType" className="text-sm font-semibold text-gray-700">Event Type</label>
                      <select
                        id="eventType" name="eventType"
                        value={formData.eventType} onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                      >
                        <option value="">Select event type</option>
                        <option value="wedding">Wedding</option>
                        <option value="engagement">Engagement</option>
                        <option value="birthday">Birthday</option>
                        <option value="baby-shower">Baby Shower</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="eventDate" className="text-sm font-semibold text-gray-700">Event Date</label>
                      <input
                        type="date" id="eventDate" name="eventDate"
                        value={formData.eventDate} onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-sm font-semibold text-gray-700">Subject *</label>
                    <select
                      id="subject" name="subject" required
                      value={formData.subject} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                    >
                      <option value="">Select a subject</option>
                      <option value="custom-design">Custom Design Request</option>
                      <option value="bulk-order">Bulk Order Enquiry</option>
                      <option value="digital-invite">Digital Invitation</option>
                      <option value="print-stationery">Print Stationery</option>
                      <option value="event-website">Event Website</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="general">General Enquiry</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-sm font-semibold text-gray-700">Message *</label>
                    <textarea
                      id="message" name="message" required
                      value={formData.message} onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-none text-sm"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#8B4949] text-white rounded-full hover:bg-[#7a3f3f] active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-semibold text-base shadow-lg shadow-[#8B4949]/20"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase mb-5">
              FAQs
            </div>
            <h2 className="text-4xl text-[#1a1410] mb-3">Frequently Asked Questions</h2>
            <div className="flex justify-center"><div className="w-20 h-0.5 bg-[#D4AF37]" /></div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-7 py-5 text-left hover:bg-[#fdf8f0]/60 transition-colors"
                >
                  <span className="font-semibold text-[#1a1410] pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8B4949] flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-7 pb-5">
                    <div className="w-full h-px bg-border mb-4" />
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA SECTION ─────────────────────────────────────── */}
        <div className="mt-24 relative overflow-hidden rounded-[2.5rem] bg-[#1a1410]">
          {/* Decorative mandalas */}
          <MandalaDecor className="absolute -top-12 -right-12 w-72 h-72 text-[#D4AF37] opacity-10 animate-rotate-slow" />
          <MandalaDecor className="absolute -bottom-12 -left-12 w-64 h-64 text-[#8B4949] opacity-10 animate-rotate-slow" />
          {/* Gold top border */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

          <div className="relative z-10 px-8 md:px-16 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left — text */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                  ✦ Still have questions?
                </div>
                <h2 className="text-4xl md:text-5xl text-[#F4E4C1] mb-5 leading-tight">
                  {ctaInfo.title || "Let's talk"}<br />
                  <span className="text-[#D4AF37] italic">{ctaInfo.subtitle || "directly."}</span>
                </h2>
                <p className="text-gray-400 leading-relaxed mb-8 max-w-md">
                  {ctaInfo.detail || "Our team is happy to walk you through options, pricing, and timelines — no pressure, just a warm and friendly conversation."}
                </p>

                {/* Quick contact rows */}
                <div className="space-y-4">
                  <a href={`tel:${(phoneDetail?.value || "+919876543210").replace(/\s+/g, '')}`}
                    className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-[#8B4949]/20 border border-[#8B4949]/30 flex items-center justify-center group-hover:bg-[#8B4949]/40 transition-colors">
                      <Phone className="w-5 h-5 text-[#8B4949]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">Call us</p>
                      <p className="text-[#F4E4C1] font-medium group-hover:text-white transition-colors">{phoneDetail?.value || "+91 98765 43210"}</p>
                    </div>
                  </a>
                  <a href={`mailto:${emailDetail?.value || "hello@eventique.in"}`}
                    className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37]/25 transition-colors">
                      <Mail className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">Email us</p>
                      <p className="text-[#F4E4C1] font-medium group-hover:text-white transition-colors">{emailDetail?.value || "hello@eventique.in"}</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Right — action cards */}
              <div className="space-y-4">
                {/* WhatsApp card */}
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center gap-5 bg-[#25D366]/10 border border-[#25D366]/25 rounded-2xl px-7 py-5 hover:bg-[#25D366]/20 hover:border-[#25D366]/50 transition-all group text-left border-solid cursor-pointer"
                >
                  <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#25D366]/30 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[#F4E4C1] font-semibold mb-0.5">Chat on WhatsApp</p>
                    <p className="text-gray-500 text-sm">Fastest response · Usually within minutes</p>
                  </div>
                  <span className="ml-auto text-gray-600 group-hover:text-[#25D366] transition-colors text-xl">→</span>
                </button>

                {/* Schedule call card */}
                <div className="flex items-center gap-5 bg-[#8B4949]/10 border border-[#8B4949]/25 rounded-2xl px-7 py-5 hover:bg-[#8B4949]/20 hover:border-[#8B4949]/50 transition-all group cursor-default">
                  <div className="w-12 h-12 bg-[#8B4949] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#8B4949]/30 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[#F4E4C1] font-semibold mb-0.5">Book a Free Consultation</p>
                    <p className="text-gray-500 text-sm">Mon – Sat · 9AM to 8PM IST</p>
                  </div>
                  <span className="ml-auto text-gray-600 group-hover:text-[#8B4949] transition-colors text-xl">→</span>
                </div>

                {/* Response promise */}
                <div className="flex items-center gap-3 px-5 py-4 bg-white/4 rounded-2xl border border-white/8">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0 animate-pulse" />
                  <p className="text-gray-400 text-sm">
                    We respond to every enquiry within <span className="text-[#D4AF37] font-semibold">{responseDetail?.value || "2–4 hours"}</span> during business hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Gold divider */}
            <div className="mt-12 mb-10 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

            {/* Follow / Shipping / Collaborations */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Follow Our Work */}
              <div className="text-center">
                <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-5">Follow Our Work</p>
                <div className="flex justify-center gap-3">
                  {/* Instagram */}
                  <a href="#"
                    className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-[#D4AF37]/15 hover:border-[#D4AF37]/40 transition-all group">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-[#D4AF37] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  {/* Pinterest */}
                  <a href="#"
                    className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-[#D4AF37]/15 hover:border-[#D4AF37]/40 transition-all group">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-[#D4AF37] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  {/* Facebook */}
                  <a href="#"
                    className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-[#D4AF37]/15 hover:border-[#D4AF37]/40 transition-all group">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-[#D4AF37] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Global Shipping */}
              <div className="text-center">
                <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-5">Global Shipping</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Digital designs delivered instantly. Physical stationery shipped across <span className="text-gray-300">20+ countries</span> — USA, Canada, UK, UAE & more.
                </p>
              </div>

              {/* Collaborations */}
              <div className="text-center">
                <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-5">Collaborations</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Wedding planner or event stylist? We love partnering with fellow creatives.
                </p>
                <a href="mailto:collab@eventique.in"
                  className="inline-block mt-3 text-[#D4AF37] text-sm font-medium hover:text-[#F4E4C1] transition-colors hover:underline underline-offset-4">
                  collab@eventique.in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
