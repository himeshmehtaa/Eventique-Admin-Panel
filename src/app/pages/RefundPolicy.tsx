import React from 'react';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';
import { useAdmin } from '../admin/context/AdminContext';
import lotusImage from '../../imports/image-3.png';

export default function RefundPolicy() {
  const { state } = useAdmin();
  const policyBlock = state.contentBlocks.find((cb) => cb.sectionName === 'Refund Policy');

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
            Refunds & Cancellations
          </div>
          <h1 className="text-4xl md:text-5xl text-[#1a1410] font-serif mb-4">
            {policyBlock?.title || 'Refund Policy'}
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
                <p>At Eventique, we strive to deliver the highest quality digital invitations and event services. Please review our refund guidelines below.</p>

                <h3 className="text-lg font-semibold text-foreground pt-4">1. Digital Invites & Websites</h3>
                <p>Since our digital invites and website designs are customized digital assets, we generally do not offer full refunds once design work has commenced. However, if you wish to cancel an order before any drafts have been shared, a full refund can be issued.</p>

                <h3 className="text-lg font-semibold text-foreground pt-4">2. Revisions and Satisfaction</h3>
                <p>We work closely with you during the revisions phase (3 rounds included by default) to ensure you are happy with the layout, fonts, and colors before delivery. We are committed to making adjustments to align with your expectations.</p>

                <h3 className="text-lg font-semibold text-foreground pt-4">3. Contacting Support</h3>
                <p>For any queries or concerns regarding refunds, payments, or orders, please reach out to hello@eventique.in or call us. We will evaluate individual circumstances on a case-by-case basis.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
