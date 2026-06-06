import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Lock, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your administrator password.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Add a tiny mock latency for a premium authentication experience
    setTimeout(() => {
      const success = login(password);
      setIsLoading(false);
      if (!success) {
        setError('Incorrect password. Please try again.');
      }
    }, 800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#faf8f5] p-4 overflow-y-auto"
      style={{ 
        fontFamily: "'Bricolage Grotesque', 'Inter', system-ui, sans-serif",
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(139, 73, 73, 0.03) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(212, 175, 55, 0.04) 0%, transparent 40%)'
      }}
    >
      <div className="w-full max-w-[440px] admin-animate-in">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#8B4949] to-[#a35c5c] text-white shadow-xl shadow-[#8B4949]/10 mb-4 relative overflow-hidden">
            <Sparkles size={26} className="text-[#D4AF37] animate-pulse relative z-10" />
            <div className="absolute inset-0 bg-white/10 opacity-30 blur-sm"></div>
          </div>
          <h1 className="text-3xl font-black text-[#1a1410] tracking-tight">
            Eventique
          </h1>
          <p className="text-sm font-semibold text-[#8B4949] tracking-wider uppercase mt-1">
            Studio Admin Panel
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#f0ece4] rounded-3xl p-8 shadow-[0_20px_50px_rgba(26,20,16,0.04)] relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#8B4949] via-[#D4AF37] to-[#8B4949]"></div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1a1410]">Administrator Access</h2>
            <p className="text-xs text-gray-400 mt-1">Please enter the security password to manage your digital studio.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Security Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Lock size={16} />
                </span>
                
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••••••••"
                  className="w-full bg-[#faf8f5] border border-[#f0ece4] rounded-2xl py-3 pl-10 pr-11 text-sm font-semibold text-[#1a1410] placeholder-gray-300 focus:outline-none focus:border-[#8B4949] focus:ring-1 focus:ring-[#8B4949] transition-all duration-200"
                  disabled={isLoading}
                  autoFocus
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#8B4949] transition-colors cursor-pointer"
                  disabled={isLoading}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#8B4949] to-[#9e5555] hover:from-[#9c5050] hover:to-[#b05f5f] transition-all duration-300 shadow-lg shadow-[#8B4949]/10 cursor-pointer ${
                isLoading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying Session...</span>
                </>
              ) : (
                <span>Access Dashboard</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            Forgot password? Contact system administrator or check development configuration.
          </p>
          <p className="text-[10px] text-gray-300 font-semibold mt-2">
            EVENTIQUE DIGITAL LTD • SECURE SYSTEM
          </p>
        </div>
      </div>
    </div>
  );
}
