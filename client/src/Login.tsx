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
      className="min-h-screen bg-[#030014] text-white flex overflow-hidden font-sans selection:bg-fuchsia-500/30"
    >
      
      {/* Shared Animated Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-5%] lg:top-[20%] left-[-10%] lg:left-[20%] w-[350px] lg:w-[400px] h-[350px] lg:h-[400px] bg-fuchsia-500/30 lg:bg-fuchsia-500/20 rounded-full blur-[80px] lg:blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], x: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-5%] lg:bottom-[10%] right-[-10%] lg:right-[10%] w-[300px] lg:w-[300px] h-[300px] lg:h-[300px] bg-violet-500/30 lg:bg-violet-500/20 rounded-full blur-[80px] lg:blur-[100px]"
        />
        
        {/* Mobile Floating Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="lg:hidden absolute top-12 right-6 w-16 h-16 bg-gradient-to-br from-fuchsia-400/20 to-violet-500/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg flex items-center justify-center"
        >
          <Activity className="text-fuchsia-300 w-8 h-8 opacity-80" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="lg:hidden absolute bottom-12 left-4 w-20 h-20 bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur-md rounded-[1.5rem] border border-white/10 shadow-lg flex items-center justify-center"
        >
          <Zap className="text-violet-300 w-10 h-10 opacity-80" />
        </motion.div>
      </div>
      
      {/* Left Animated Section */}
      <div className="hidden lg:flex w-[55%] relative items-center justify-center p-12 z-10">
        
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
            <div className="w-20 h-20 bg-gradient-to-br from-fuchsia-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(217,70,239,0.5)]">
              <Link className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Base62</h2>
            <p className="text-blue-200/80 mt-2 font-medium">Analytics Engine</p>
          </motion.div>

          {/* Orbiting Card 1 */}
          <motion.div 
            animate={{ y: [-15, 15, -15], rotate: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 left-4 w-48 h-32 bg-gradient-to-br from-violet-500/20 to-fuchsia-600/20 backdrop-blur-xl rounded-2xl border border-white/10 p-5 flex flex-col justify-between z-10 shadow-xl"
          >
            <Zap className="text-fuchsia-400 w-6 h-6" />
            <div>
              <div className="h-2 w-20 bg-white/30 rounded-full mb-2"></div>
              <div className="h-2 w-12 bg-white/30 rounded-full"></div>
            </div>
          </motion.div>

          {/* Orbiting Card 2 */}
          <motion.div 
            animate={{ y: [15, -15, 15], rotate: [2, -2, 2] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-12 right-4 w-56 h-36 bg-gradient-to-br from-fuchsia-400/20 to-violet-500/20 backdrop-blur-xl rounded-2xl border border-white/10 p-5 flex flex-col justify-between z-30 shadow-xl"
          >
            <div className="flex justify-between items-center">
              <Activity className="text-violet-300 w-6 h-6" />
              <span className="text-xs font-bold text-indigo-200">+24%</span>
            </div>
            <div>
              <div className="flex items-end gap-1 mb-2 h-10">
                <div className="w-full bg-white/20 rounded-t-sm h-[40%]"></div>
                <div className="w-full bg-white/30 rounded-t-sm h-[70%]"></div>
                <div className="w-full bg-white/50 rounded-t-sm h-[50%]"></div>
                <div className="w-full bg-violet-400/80 rounded-t-sm h-[100%]"></div>
                <div className="w-full bg-white/40 rounded-t-sm h-[80%]"></div>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-4 sm:p-8 lg:p-0 relative z-40 min-h-screen">
        <div className="w-full max-w-[420px] lg:max-w-none bg-white/5 lg:bg-white/5 backdrop-blur-2xl lg:backdrop-blur-2xl text-white p-8 sm:p-10 lg:p-12 rounded-[2.5rem] lg:rounded-none lg:rounded-l-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] lg:h-full lg:flex lg:flex-col lg:justify-center border border-white/10 relative overflow-hidden">
          
          {/* Subtle Mobile Inner Gradient */}
          <div className="lg:hidden absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-fuchsia-500/10 to-transparent pointer-events-none"></div>

          <div className="w-full lg:max-w-[380px] mx-auto relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.5 }}
            className="mb-10"
          >
            <div className="lg:hidden w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center mb-6 shadow-lg border border-fuchsia-500/30">
              <Link className="w-6 h-6 text-fuchsia-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Log In</h1>
            <p className="text-gray-400 text-sm">Enter your credentials to access your workspace.</p>
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
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">Email</label>
              <div className="relative flex items-center group">
                <Mail className={`absolute left-4 w-4 h-4 transition-colors ${fieldErrors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-fuchsia-400'}`} />
                <input 
                  type="email" 
                  name="email"
                  className={`w-full py-3 pr-4 pl-11 border ${fieldErrors.email ? 'border-red-400/50 bg-red-400/10 focus:border-red-500' : 'border-white/10 bg-white/5 focus:border-fuchsia-500/50 focus:bg-white/10'} rounded-xl text-sm outline-none transition-all text-white placeholder:text-gray-500`}
                  placeholder="you@company.com" 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.email}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex justify-between mb-1.5 items-end">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide">Password</label>
              </div>
              <div className="relative flex items-center group">
                <Lock className={`absolute left-4 w-4 h-4 transition-colors ${fieldErrors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-fuchsia-400'}`} />
                <input 
                  type="password" 
                  name="password"
                  className={`w-full py-3 pr-4 pl-11 border ${fieldErrors.password ? 'border-red-400/50 bg-red-400/10 focus:border-red-500' : 'border-white/10 bg-white/5 focus:border-fuchsia-500/50 focus:bg-white/10'} rounded-xl text-sm outline-none transition-all text-white placeholder:text-gray-500`}
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {fieldErrors.password && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.password}</p>}
            </motion.div>

            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(217,70,239,0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 mt-4 bg-fuchsia-600 text-white rounded-xl text-sm font-semibold hover:bg-fuchsia-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(217,70,239,0.2)] relative overflow-hidden"
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

            <motion.div variants={itemVariants} className="text-center text-sm text-gray-400 mt-6">
              New to Base62? <RouterLink to="/" className="text-fuchsia-400 font-semibold hover:underline ml-1">Create an account</RouterLink>
            </motion.div>
            </motion.form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
