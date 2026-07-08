import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, Link2, Copy, Check, LogOut, Activity, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { urlSchema } from './validation';

export default function Dashboard() {
  const navigate = useNavigate();
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) return;

    setError('');

    const validationResult = urlSchema.safeParse({ url: originalUrl });
    if (!validationResult.success) {
      setError(validationResult.error.issues[0].message);
      return;
    }

    setLoading(true);
    setShortUrl('');
    setCopied(false);
    
    const token = localStorage.getItem('access_token');

    try {
      let currentToken = token;
      let response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/urls/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ originalUrl })
      });

      if (response.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            const refreshRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh_token: refreshToken })
            });
            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              localStorage.setItem('access_token', refreshData.access_token);
              currentToken = refreshData.access_token;
              
              // Retry original request
              response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/urls/shorten`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${currentToken}`
                },
                body: JSON.stringify({ originalUrl })
              });
            } else {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              navigate('/login');
              return;
            }
          } catch (e) {
            console.error('Failed to refresh token', e);
          }
        } else {
          localStorage.removeItem('access_token');
          navigate('/login');
          return;
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to shorten URL');
      }

      setShortUrl(data.shortUrl);
      setOriginalUrl('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#0a0f1c] text-white flex flex-col font-sans selection:bg-fuchsia-500/30 overflow-hidden relative"
    >
      {/* Dynamic Backgrounds */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1], 
          rotate: [0, 90, 0],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-r from-fuchsia-600/20 to-violet-600/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1], 
          x: [0, -100, 0],
          y: [0, 50, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-[120px] pointer-events-none"
      />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
        className="px-8 py-4 flex items-center justify-between relative z-20 border-b border-white/5 bg-white/5 backdrop-blur-xl shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-fuchsia-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.3)]">
            <Link className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Base62</span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLogoutClick}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-sm bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-4xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring", bounce: 0.4 }}
          className="text-center mb-12 w-full relative"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-400 text-xs font-semibold tracking-wide border border-fuchsia-500/20 mb-6 shadow-[0_0_15px_rgba(217,70,239,0.15)]"
          >
            <Activity size={14} /> ACTIVE WORKSPACE
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Shorten Your Links
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto">
            Create secure, trackable short URLs in a single click using our enterprise-grade routing engine.
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, type: "spring", bounce: 0.4 }}
          onSubmit={handleShorten} 
          className="w-full mb-8 relative z-20"
          noValidate
        >
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative flex items-center shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-2xl bg-white/5 backdrop-blur-xl p-2 border border-white/10 focus-within:border-fuchsia-500/60 focus-within:bg-white/10 focus-within:shadow-[0_0_30px_rgba(217,70,239,0.3)] transition-all duration-300 group"
          >
            <Link2 className="absolute left-4 md:left-6 text-gray-400 w-5 h-5 md:w-6 md:h-6 group-focus-within:text-fuchsia-400 transition-colors" />
            <input 
              type="url" 
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="Paste your long URL here..." 
              className="w-full py-4 md:py-5 pr-28 md:pr-36 pl-12 md:pl-16 text-base md:text-lg outline-none rounded-xl bg-transparent text-white placeholder:text-gray-500"
              required
            />
            <motion.button 
              whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(37,99,235,0.6)" }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              disabled={loading}
              className="absolute right-2 md:right-3 py-2 md:py-3 px-4 md:px-8 bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white rounded-xl font-bold text-sm md:text-base hover:from-fuchsia-500 hover:to-violet-500 transition-all disabled:opacity-70 flex justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              {loading ? (
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : 'Shorten'}
            </motion.button>
          </motion.div>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 mt-4 text-center text-sm font-medium">
              {error}
            </motion.p>
          )}
        </motion.form>

        {/* Result Card */}
        <AnimatePresence mode="wait">
          {shortUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 40, rotateX: -20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.7 }}
              className="w-full bg-white/10 backdrop-blur-3xl p-6 md:p-8 rounded-3xl border border-white/20 shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              {/* Shimmer Effect */}
              <motion.div 
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
              />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-400 via-violet-500 to-purple-500"></div>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Short URL</p>
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold text-fuchsia-400 truncate hover:text-fuchsia-300 transition-colors flex items-center gap-2 group">
                    {shortUrl}
                    <ExternalLink size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors ${
                    copied 
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' 
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {copied ? (
                    <><Check size={18} /> Copied</>
                  ) : (
                    <><Copy size={18} /> Copy</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#030014] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full"
            >
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <LogOut className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2 text-white">Sign Out</h3>
              <p className="text-gray-400 text-center mb-6 text-sm">
                Are you sure you want to log out?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
