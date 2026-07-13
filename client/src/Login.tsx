import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginSchema } from './validation';
import { authService } from './services/authService';
import { Link, Mail, Lock, ArrowRight, Activity, Zap, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

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
      className="min-h-screen bg-transparent text-slate-900 flex overflow-hidden font-sans selection:bg-yellow-500/30"
    >
      

      
      {/* Left Animated Section */}
      <div className="hidden lg:flex w-[55%] relative items-center justify-center p-12 z-10">
        
        {/* Floating Elements Composition */}
        <div className="relative w-full max-w-lg aspect-square perspective-1000">
          
          {/* Main Logo Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 m-auto w-64 h-64 bg-white/70 backdrop-blur-2xl rounded-[2rem] border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center z-20 overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
            />
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(234,179,8,0.3)]">
              <Link className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Base62</h2>
            <p className="text-slate-500 mt-2 font-medium">Analytics Engine</p>
          </motion.div>

          {/* Orbiting Card 1 */}
          <motion.div 
            animate={{ y: [-15, 15, -15], rotate: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 left-4 w-48 h-32 bg-white/60 backdrop-blur-xl rounded-2xl border border-slate-200 p-5 flex flex-col justify-between z-10 shadow-xl shadow-slate-200/50"
          >
            <Zap className="text-yellow-500 w-6 h-6" />
            <div>
              <div className="h-2 w-20 bg-slate-300 rounded-full mb-2"></div>
              <div className="h-2 w-12 bg-slate-300 rounded-full"></div>
            </div>
          </motion.div>

          {/* Orbiting Card 2 */}
          <motion.div 
            animate={{ y: [15, -15, 15], rotate: [2, -2, 2] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-12 right-4 w-56 h-36 bg-white/60 backdrop-blur-xl rounded-2xl border border-slate-200 p-5 flex flex-col justify-between z-30 shadow-xl shadow-slate-200/50"
          >
            <div className="flex justify-between items-center">
              <Activity className="text-amber-500 w-6 h-6" />
              <span className="text-xs font-bold text-amber-600">+24%</span>
            </div>
            <div>
              <div className="flex items-end gap-1 mb-2 h-10">
                <div className="w-full bg-slate-200 rounded-t-sm h-[40%]"></div>
                <div className="w-full bg-slate-300 rounded-t-sm h-[70%]"></div>
                <div className="w-full bg-slate-400 rounded-t-sm h-[50%]"></div>
                <div className="w-full bg-amber-400 rounded-t-sm h-[100%]"></div>
                <div className="w-full bg-slate-300 rounded-t-sm h-[80%]"></div>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-4 sm:p-8 lg:p-0 relative z-40 min-h-screen">
        <div className="w-full max-w-[420px] lg:max-w-none bg-white/70 lg:bg-white/70 backdrop-blur-2xl lg:backdrop-blur-2xl text-slate-900 p-8 sm:p-10 lg:p-12 rounded-[2.5rem] lg:rounded-none lg:rounded-l-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.05)] lg:h-full lg:flex lg:flex-col lg:justify-center border border-slate-200/60 relative overflow-hidden">
          
          {/* Subtle Mobile Inner Gradient */}
          <div className="lg:hidden absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none"></div>

          <div className="w-full lg:max-w-[380px] mx-auto relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.5 }}
            className="mb-10"
          >
            <div className="lg:hidden w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-yellow-200">
              <Link className="w-6 h-6 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Log In</h1>
            <p className="text-slate-500 text-sm">Enter your credentials to access your workspace.</p>
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
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Email</label>
              <div className="relative flex items-center group">
                <Mail className={`absolute left-4 w-4 h-4 transition-colors ${fieldErrors.email ? 'text-red-500' : 'text-slate-400 group-focus-within:text-yellow-500'}`} />
                <input 
                  type="email" 
                  name="email"
                  className={`w-full py-3 pr-4 pl-11 border ${fieldErrors.email ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-white focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10'} rounded-xl text-sm outline-none transition-all text-slate-900 placeholder:text-slate-400 shadow-sm`}
                  placeholder="you@company.com" 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.email}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex justify-between mb-1.5 items-end">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Password</label>
              </div>
              <div className="relative flex items-center group">
                <Lock className={`absolute left-4 w-4 h-4 transition-colors ${fieldErrors.password ? 'text-red-500' : 'text-slate-400 group-focus-within:text-yellow-500'}`} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  className={`w-full py-3 pr-12 pl-11 border ${fieldErrors.password ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-white focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10'} rounded-xl text-sm outline-none transition-all text-slate-900 placeholder:text-slate-400 shadow-sm`}
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.password}</p>}
            </motion.div>

            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(234,179,8,0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 mt-4 bg-yellow-500 text-white rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(234,179,8,0.2)] relative overflow-hidden"
            >
              {loading ? (
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>

            <motion.div variants={itemVariants} className="text-center text-sm text-slate-500 mt-6">
              New to Base62? <RouterLink to="/" className="text-yellow-600 font-semibold hover:underline ml-1">Create an account</RouterLink>
            </motion.div>
            </motion.form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
