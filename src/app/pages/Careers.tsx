import { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  Send, 
  Users, 
  TrendingUp, 
  Heart, 
  Check, 
  X,
  Plus,
  Minus
} from 'lucide-react';
import { MandalaDecor, LotusDecor } from '../components/decorative/FloralDecor';

const BENEFITS = [
  {
    icon: Sparkles,
    title: 'Creative Freedom',
    description: 'We believe art lies in details. Work on custom monograms, high-end videos, and complex B2B event microsites without creative boundaries.'
  },
  {
    icon: Users,
    title: 'Collaborative Culture',
    description: 'Work closely with designers from NIFT and engineers from IIT in an environment that prioritizes craft, UI/UX precision, and growth.'
  },
  {
    icon: Heart,
    title: 'Work-Life Balance',
    description: 'We support flexible remote working hours, wellness leaves, and continuous learning allowances to help you grow your skillset.'
  },
  {
    icon: TrendingUp,
    title: 'Rapid Career Growth',
    description: 'As a fast-growing event experience studio, you will take ownership of client-facing design pipelines and tech products from day one.'
  }
];

const POSITIONS = [
  {
    id: 'designer',
    title: 'Senior Visual Designer',
    department: 'Creative Design',
    location: 'Remote / New Delhi',
    type: 'Full-Time',
    description: 'Lead visual design workflows for luxury wedding stationary, custom illustrations, and event branding assets. NIFT background is a plus.'
  },
  {
    id: 'engineer',
    title: 'Frontend React Engineer',
    department: 'Technology',
    location: 'Remote',
    type: 'Full-Time',
    description: 'Develop responsive event registration engines, ticket verification apps, and custom high-performance event websites using React and Tailwind CSS.'
  },
  {
    id: 'manager',
    title: 'Event Design Project Manager',
    department: 'Operations & Client Services',
    location: 'Remote / Mumbai',
    type: 'Full-Time',
    description: 'Coordinate with enterprise clients and our internal design team to manage delivery milestones for event microsites and printed branding collaterals.'
  }
];

export default function Careers() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'Senior Visual Designer',
    portfolioUrl: '',
    message: '',
    resume: null as File | null
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 600);
  };

  const scrollToApply = (roleTitle?: string) => {
    if (roleTitle) {
      setFormData(prev => ({ ...prev, role: roleTitle }));
    }
    const formEl = document.getElementById('apply-form-section');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#faf8f5] text-slate-800 font-sans min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative bg-white pt-24 pb-20 md:py-32 border-b border-slate-100 overflow-hidden">
        <MandalaDecor className="absolute top-20 right-10 w-64 h-64 text-primary opacity-20 animate-rotate-slow pointer-events-none" />
        <LotusDecor className="absolute top-1/2 left-12 w-48 h-48 text-secondary opacity-25 pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold uppercase tracking-wider border border-slate-200">
            <Briefcase className="w-3.5 h-3.5 text-primary" />
            Careers at Eventique
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] max-w-3xl mx-auto" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Build the Future of <br />
            Event Experiences
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto font-light leading-relaxed">
            We are looking for passionate designers, engineers, and project leaders to help us craft premium digital and physical event experiences.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => scrollToApply()}
              className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary/95 transition-all hover:scale-105 inline-flex items-center gap-2 shadow-lg shadow-primary/10 cursor-pointer"
            >
              Explore Open Positions
              <Briefcase className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* WHY JOIN EVENTIQUE */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Why Join Eventique
            </h2>
            <p className="text-slate-500 font-light leading-relaxed">
              We align visual design precision with technical reliability to deliver B2C and B2B products.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-8 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-4 hover:bg-white hover:shadow-xl transition-all duration-300 border-dashed"
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-150 flex items-center justify-center text-primary mx-auto shadow-sm">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LIFE AT EVENTIQUE */}
      <section className="py-24 bg-[#faf8f5] border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 shadow-md">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&fit=crop"
                    alt="Creative team brainstorming"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-md">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&fit=crop"
                    alt="Corporate meeting room"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-md">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&fit=crop"
                    alt="Design QA check"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 shadow-md">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&fit=crop"
                    alt="Team presentation workshop"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content info */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Life at Eventique
              </h2>
              <p className="text-slate-600 font-light leading-relaxed">
                At Eventique, we cross-pollinate design sensibilities with frontend software engineering. Our team operates with an obsession for high-end UI details, fast-loading portfolios, and clean typography.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Remote-First Setup', desc: 'Work from anywhere with core check-in hours.' },
                  { title: 'Alumni Network', desc: 'Collaborate with leaders from NIFT and IIT.' },
                  { title: 'Modular Teams', desc: 'Small focused groups where design and tech sync.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 leading-tight">{item.title}</h4>
                      <p className="text-xs text-slate-450 font-light mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPEN POSITIONS */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Explore Open Positions
            </h2>
            <p className="text-slate-550 font-light leading-relaxed">
              Find your role and help us define event technology and design frameworks.
            </p>
          </div>

          <div className="space-y-4">
            {POSITIONS.map((pos) => {
              const isSelected = activeFaq === pos.id;
              return (
                <div 
                  key={pos.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                >
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900">{pos.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="font-semibold text-slate-500 uppercase tracking-wider font-mono">{pos.department}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{pos.location}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{pos.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveFaq(isSelected ? null : pos.id)}
                        className="px-4 py-2 border border-slate-200 text-slate-650 hover:bg-slate-50 rounded-full text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        {isSelected ? 'Hide Details' : 'View Details'}
                      </button>
                      <button
                        onClick={() => scrollToApply(pos.title)}
                        className="px-4 py-2 bg-primary text-white hover:bg-primary/95 rounded-full text-xs font-semibold transition-all cursor-pointer"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="px-6 pb-6 pt-1 text-sm text-slate-500 leading-relaxed font-light border-t border-slate-100 animate-in fade-in duration-300 space-y-4 bg-slate-50/50">
                      <p>{pos.description}</p>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest">Requirements:</h4>
                        <ul className="list-disc pl-4 space-y-1 text-xs">
                          <li>Excellent communication and collaboration skills</li>
                          <li>Strong obsession with design details and craft quality</li>
                          <li>Proven capability to execute workflows under deadlines</li>
                          <li>Prior design agency or tech startup experience is a plus</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section id="apply-form-section" className="py-24 bg-[#faf8f5] scroll-mt-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Submit Application
              </h3>
              <p className="text-sm text-slate-550 font-light leading-relaxed">
                Provide your details and links below. We review all applications within 48 hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4 animate-in zoom-in-95 duration-500">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-emerald-800">Application Submitted!</h4>
                <p className="text-sm text-emerald-600 font-light leading-relaxed">
                  Thank you, <span className="font-semibold">{formData.fullName}</span>. Your application for <span className="font-semibold">{formData.role}</span> has been received successfully. Our team will review your portfolio and reach out to you via <span className="font-semibold">{formData.email}</span> if your profile matches our requirements.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-sm font-semibold text-emerald-700 hover:underline pt-2 cursor-pointer"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 012-3456"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="role" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Applying For Role</label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    >
                      <option value="Senior Visual Designer">Senior Visual Designer</option>
                      <option value="Frontend React Engineer">Frontend React Engineer</option>
                      <option value="Event Design Project Manager">Event Design Project Manager</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="portfolioUrl" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Portfolio Link (Behance, Dribbble, GitHub, personal website)</label>
                  <input
                    type="url"
                    id="portfolioUrl"
                    name="portfolioUrl"
                    required
                    value={formData.portfolioUrl}
                    onChange={handleInputChange}
                    placeholder="https://myportfolio.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="resume" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Upload Resume (PDF format)</label>
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf"
                    required
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cover Letter / Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us a little bit about yourself, your creative style, and why you want to join Eventique..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary/95 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] shadow-lg shadow-primary/10 cursor-pointer"
                >
                  Submit Application
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
