import { useState, useMemo } from 'react';
import { Navigate } from 'react-router';
import { useAdmin } from '../context/AdminContext';
import { Lock, Mail, Eye, EyeOff, AlertCircle, HelpCircle, Shield, ArrowRight } from 'lucide-react';
import logoIcon from '@/assets/logo-icon.png';
import logoWordmark from '@/assets/logo-wordmark.png';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelper, setShowHelper] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const testAccounts = [
    { name: 'Amit (Super Admin)', email: 'amit@eventique.in', pass: 'amit123', role: 'Super Admin' },
    { name: 'Neha (Designer)', email: 'neha@eventique.in', pass: 'neha123', role: 'Designer' },
    { name: 'Pooja (Editor)', email: 'pooja@eventique.in', pass: 'pooja123', role: 'Content Editor' },
    { name: 'Rohan (Support)', email: 'rohan@eventique.in', pass: 'rohan123', role: 'Support' }
  ];

  const handleFill = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your administrator email.');
      return;
    }
    if (!password) {
      setError('Please enter your administrator password.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Tiny mock latency for a premium authentication feel
    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      if (!success) {
        setError('Incorrect email or password. Please try again.');
      }
    }, 800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#faf8f5] p-4 overflow-y-auto animate-fade-in relative"
      style={{ 
        fontFamily: "'Bricolage Grotesque', 'Inter', system-ui, sans-serif"
      }}
    >
      {/* CSS Floating Blobs Animations */}
      <style>{`
        @keyframes float-blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.15); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: float-blob 22s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      {/* Decorative Brand Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#8B4949]/5 blur-[120px] animate-blob" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[650px] h-[650px] rounded-full bg-[#D4AF37]/6 blur-[130px] animate-blob animation-delay-2000" />
        <div className="absolute top-[25%] right-[15%] w-[400px] h-[400px] rounded-full bg-[#8B4949]/3 blur-[110px] animate-blob animation-delay-4000" />
      </div>

      <div className="w-full max-w-[450px] my-8 relative z-10 admin-animate-in">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-7">
          <div className="w-20 h-20 rounded-3xl bg-white border border-[#f0ece4] shadow-md flex items-center justify-center p-3.5 mb-4 relative hover:scale-105 hover:rotate-3 transition-all duration-300">
            <img src={logoIcon} alt="Eventique Icon" className="w-full h-full object-contain" />
            <div className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-sm">
              <span className="text-[9px] text-white font-bold">★</span>
            </div>
          </div>
          <img src={logoWordmark} alt="Eventique Logo" className="h-10 object-contain" />
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#D4AF37]"></span>
            <p className="text-[10px] font-bold text-[#8B4949] tracking-[0.25em] uppercase">
              Studio Admin Panel
            </p>
            <span className="w-1 h-1 rounded-full bg-[#D4AF37]"></span>
          </div>
        </div>

        {/* Premium Login Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-[#ede9e1] rounded-[32px] p-8 shadow-[0_25px_60px_rgba(26,20,16,0.05)] relative overflow-hidden">
          {/* Top glowing gradient stripe */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#8B4949] via-[#D4AF37] to-[#8B4949]"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#1a1410]">Administrator Access</h2>
              <p className="text-xs text-gray-400 mt-1">Please enter your credentials to manage the digital studio.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowHelper(!showHelper)}
              className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                showHelper 
                  ? 'bg-[#8B4949] text-white border-[#8B4949] shadow-sm' 
                  : 'bg-[#faf8f5] text-gray-400 border-[#ede9e1] hover:text-[#8B4949] hover:bg-[#f5f0e8]'
              }`}
              title="Show Quick Credentials Helper"
            >
              <HelpCircle size={15} />
            </button>
          </div>

          {/* Quick Account Helper Popover */}
          {showHelper && (
            <div className="mb-6 p-4 bg-[#faf8f5] border border-[#ede9e1] rounded-2xl animate-slide-down">
              <h3 className="text-[11px] font-extrabold text-[#8B4949] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Shield size={12} className="text-[#D4AF37]" />
                Select Account to Autofill
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {testAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleFill(acc.email, acc.pass)}
                    className="p-2.5 text-left bg-white border border-[#ede9e1] hover:border-[#8B4949] rounded-xl hover:shadow-md hover:scale-[1.01] transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs text-[#1a1410] truncate">{acc.name.split(' ')[0]}</span>
                      <span className="text-[8px] font-bold text-[#8B4949] bg-[#8B4949]/5 px-1.5 py-0.5 rounded border border-[#8B4949]/10 uppercase tracking-wide">
                        {acc.role.split(' ')[0]}
                      </span>
                    </div>
                    <div className="text-[9px] text-gray-400 truncate mt-1">{acc.email}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Mail size={15} />
                </span>
                
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="name@eventique.in"
                  className="w-full bg-[#faf8f5]/80 border border-[#ede9e1] rounded-2xl py-3 pl-10 pr-4 text-sm font-semibold text-[#1a1410] placeholder-gray-300 focus:bg-white focus:outline-none focus:border-[#8B4949] focus:ring-4 focus:ring-[#8B4949]/5 transition-all duration-200"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Security Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Lock size={15} />
                </span>
                
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••••••••"
                  className="w-full bg-[#faf8f5]/80 border border-[#ede9e1] rounded-2xl py-3 pl-10 pr-11 text-sm font-semibold text-[#1a1410] placeholder-gray-300 focus:bg-white focus:outline-none focus:border-[#8B4949] focus:ring-4 focus:ring-[#8B4949]/5 transition-all duration-200"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#8B4949] transition-colors cursor-pointer"
                  disabled={isLoading}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50/60 border border-red-100 rounded-2xl text-xs font-semibold text-red-600 animate-shake">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#8B4949] to-[#9c5050] hover:from-[#9c5050] hover:to-[#b05f5f] transition-all duration-300 shadow-md shadow-[#8B4949]/15 hover:shadow-lg hover:shadow-[#8B4949]/20 hover:scale-[1.01] cursor-pointer ${
                isLoading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying Session...</span>
                </>
              ) : (
                <span className="flex items-center gap-1">
                  Access Dashboard <ArrowRight size={14} />
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center mt-7">
          <p className="text-[11px] text-gray-400 leading-normal">
            Forgot password? Contact system administrator or check development configuration.
          </p>
          <p className="text-[10px] text-gray-300 font-semibold mt-2.5 tracking-wider">
            EVENTIQUE DIGITAL LTD • SECURE SYSTEM
          </p>
        </div>
      </div>
    </div>
  );
}
