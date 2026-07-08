import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginSchema } from './validation';
import { authService } from './services/authService';
import { Link, Mail, Lock, ArrowRight, Activity, Zap } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      return setFieldErrors(errors);
    }

    setLoading(true);

    try {
      const data = await authService.login(formData);
      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants for form inputs
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen bg-[#0f172a] text-white flex overflow-hidden font-sans selection:bg-blue-500/30"
    >
      
      {/* Left Animated Section */}
      <div className="hidden lg:flex w-[55%] relative items-center justify-center p-12">
        {/* Dynamic Background Elements */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], x: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[100px]"
        />
        
        {/* Floating Elements Composition */}
        <div className="relative w-full max-w-lg aspect-square perspective-1000">
          
          {/* Main Logo Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 m-auto w-64 h-64 bg-white/5 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center z-20 overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
            />
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(59,130,246,0.5)]">
              <Link className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Base62</h2>
            <p className="text-blue-200/80 mt-2 font-medium">Analytics Engine</p>
          </motion.div>

          {/* Orbiting Card 1 */}
          <motion.div 
            animate={{ y: [-15, 15, -15], rotate: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 left-4 w-48 h-32 bg-gradient-to-br from-indigo-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border border-white/10 p-5 flex flex-col justify-between z-10 shadow-xl"
          >
            <Zap className="text-blue-400 w-6 h-6" />
            <div>
              <div className="h-2 w-20 bg-white/30 rounded-full mb-2"></div>
              <div className="h-2 w-12 bg-white/30 rounded-full"></div>
            </div>
          </motion.div>

          {/* Orbiting Card 2 */}
          <motion.div 
            animate={{ y: [15, -15, 15], rotate: [2, -2, 2] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-12 right-4 w-56 h-36 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 backdrop-blur-xl rounded-2xl border border-white/10 p-5 flex flex-col justify-between z-30 shadow-xl"
          >
            <div className="flex justify-between items-center">
              <Activity className="text-indigo-300 w-6 h-6" />
              <span className="text-xs font-bold text-indigo-200">+24%</span>
            </div>
            <div>
              <div className="flex items-end gap-1 mb-2 h-10">
                <div className="w-full bg-white/20 rounded-t-sm h-[40%]"></div>
                <div className="w-full bg-white/30 rounded-t-sm h-[70%]"></div>
                <div className="w-full bg-white/50 rounded-t-sm h-[50%]"></div>
                <div className="w-full bg-indigo-400/80 rounded-t-sm h-[100%]"></div>
                <div className="w-full bg-white/40 rounded-t-sm h-[80%]"></div>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-white text-gray-900 relative rounded-l-[2.5rem] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] z-40">
        <div className="w-full max-w-[380px]">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-10"
          >
            <div className="lg:hidden w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Link className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Log In</h1>
            <p className="text-gray-500 text-sm">Enter your credentials to access your workspace.</p>
          </motion.div>

          <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit} 
            className="flex flex-col gap-5"
          >
            {error && (
              <motion.div variants={itemVariants} className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 text-center flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {error}
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Email</label>
              <div className="relative flex items-center group">
                <Mail className={`absolute left-4 w-4 h-4 transition-colors ${fieldErrors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-600'}`} />
                <input 
                  type="email" 
                  name="email"
                  className={`w-full py-3 pr-4 pl-11 border-2 ${fieldErrors.email ? 'border-red-200 bg-red-50 focus:border-red-500' : 'border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white'} rounded-xl text-sm outline-none transition-all`}
                  placeholder="you@company.com" 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.email}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex justify-between mb-1.5 items-end">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Password</label>
              </div>
              <div className="relative flex items-center group">
                <Lock className={`absolute left-4 w-4 h-4 transition-colors ${fieldErrors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-600'}`} />
                <input 
                  type="password" 
                  name="password"
                  className={`w-full py-3 pr-4 pl-11 border-2 ${fieldErrors.password ? 'border-red-200 bg-red-50 focus:border-red-500' : 'border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white'} rounded-xl text-sm outline-none transition-all`}
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {fieldErrors.password && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.password}</p>}
            </motion.div>

            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 mt-4 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-xl shadow-gray-900/20"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </motion.button>

            <motion.div variants={itemVariants} className="text-center text-sm text-gray-500 mt-6">
              New to Base62? <RouterLink to="/" className="text-blue-600 font-semibold hover:underline ml-1">Create an account</RouterLink>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </motion.div>
  );
}
