import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from '../data/products';
import { Link } from 'react-router';

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our services, pricing, and process
          </p>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-muted transition-colors"
                >
                  <h3 className="text-lg pr-4">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl mb-4">Still Have Questions?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Can't find the answer you're looking for? Our team is here to help.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
              >
                Contact Us
              </Link>
              <button
                onClick={() => {
                  const phoneNumber = '919876543210';
                  const message = 'Hi! I have a question about Eventique services.';
                  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="px-8 py-3 bg-[#25D366] text-white rounded-full hover:bg-[#20BD5C] transition-colors"
              >
                Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Explore more</p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link to="/explore" className="text-primary hover:underline">
              Browse Designs
            </Link>
            <Link to="/packages" className="text-primary hover:underline">
              View Packages
            </Link>
            <Link to="/about" className="text-primary hover:underline">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
