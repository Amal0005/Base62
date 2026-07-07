import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, Link2, Copy, Check, LogOut, Activity, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const navigate = useNavigate();
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('access_token');
      navigate('/login');
    }
  };

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) return;

    setError('');
    setLoading(true);
    setShortUrl('');
    setCopied(false);
    
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/urls/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ originalUrl })
      });

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
      className="min-h-screen bg-[#0a0f1c] text-white flex flex-col font-sans selection:bg-blue-500/30 overflow-hidden relative"
    >
      {/* Dynamic Backgrounds */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], x: [0, -100, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="px-8 py-4 flex items-center justify-between relative z-20 border-b border-white/10 bg-white/5 backdrop-blur-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Link className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Base62</span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-sm bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-4xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12 w-full"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wide border border-blue-500/20 mb-6">
            <Activity size={14} /> ACTIVE WORKSPACE
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Shorten Your Links
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Create secure, trackable short URLs in a single click using our enterprise-grade routing engine.
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleShorten} 
          className="w-full mb-8"
        >
          <div className="relative flex items-center shadow-[0_20px_60px_rgba(0,0,0,0.3)] rounded-2xl bg-white/5 backdrop-blur-xl p-2 border border-white/10 focus-within:border-blue-500/50 focus-within:bg-white/10 transition-all group">
            <Link2 className="absolute left-6 text-gray-400 w-6 h-6 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="url" 
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="Paste your long URL here (e.g. https://google.com)" 
              className="w-full py-5 pr-36 pl-16 text-lg outline-none rounded-xl bg-transparent text-white placeholder:text-gray-500"
              required
            />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="absolute right-3 py-3 px-8 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors disabled:opacity-70 flex justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              {loading ? 'Working...' : 'Shorten'}
            </motion.button>
          </div>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 mt-4 text-center text-sm font-medium">
              {error}
            </motion.div>
          )}
        </motion.form>

        {/* Result Card */}
        <AnimatePresence>
          {shortUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="w-full bg-white/10 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Short URL</p>
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold text-blue-400 truncate hover:text-blue-300 transition-colors flex items-center gap-2 group">
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
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
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
    </motion.div>
  );
}
