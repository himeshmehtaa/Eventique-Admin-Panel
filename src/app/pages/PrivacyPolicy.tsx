import React from 'react';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';
import { useAdmin } from '../admin/context/AdminContext';
import lotusImage from '../../imports/image-3.png';

export default function PrivacyPolicy() {
  const { state } = useAdmin();
  const policyBlock = state.contentBlocks.find((cb) => cb.sectionName === 'Privacy Policy');

  return (
    <div className="overflow-hidden min-h-screen relative py-12">
      {/* Background Floral Elements */}
      <MandalaDecor className="absolute top-10 right-16 w-60 h-60 text-primary opacity-20 animate-rotate-slow" />
      <LotusDecor className="absolute top-1/4 left-12 w-44 h-44 text-secondary opacity-25 animate-float" />
      <MandalaDecor className="absolute bottom-20 right-12 w-48 h-48 text-accent opacity-20 animate-rotate-slow" style={{ animationDelay: '3s' }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Hero */}
        <div className="text-center mb-12">
          <img
            src={lotusImage}
            alt=""
            className="w-40 h-10 object-contain opacity-30 mx-auto mb-6"
            style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(18%) saturate(1285%) hue-rotate(316deg) brightness(91%) contrast(87%)' }}
          />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            Security & Trust
          </div>
          <h1 className="text-4xl md:text-5xl text-[#1a1410] font-serif mb-4">
            {policyBlock?.title || 'Privacy Policy'}
          </h1>
          <p className="text-muted-foreground text-sm">
            Last Updated: {policyBlock?.lastUpdated || 'June 2026'}
          </p>
        </div>

        {/* Policy Body */}
        <div className="max-w-3xl mx-auto bg-card border border-border p-8 md:p-12 rounded-3xl shadow-sm">
          <div className="prose max-w-none text-muted-foreground leading-relaxed space-y-6 text-sm md:text-base whitespace-pre-wrap">
            {policyBlock?.body || (
              <>
                <p>We value your privacy and are committed to protecting your data. This privacy policy explains how we collect, use, and share information when you use our services.</p>
                
                <h3 className="text-lg font-semibold text-foreground pt-4">1. Information We Collect</h3>
                <p>We collect information you provide directly to us, such as when you create an account, purchase invitations, upload media files, or contact our team.</p>

                <h3 className="text-lg font-semibold text-foreground pt-4">2. How We Use Your Information</h3>
                <p>We use your information to process transactions, deliver digital invites, host your personalized wedding websites, and send communication updates regarding your orders.</p>

                <h3 className="text-lg font-semibold text-foreground pt-4">3. Data Retention and Protection</h3>
                <p>All photos, details, and guest lists uploaded for your websites are protected using modern security methods. Guest RSVP details are kept secure and are only accessible by you.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
