import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, CheckCircle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { verifySchema } from './validation';
import { authService } from './services/authService';
import { motion, type Variants } from 'framer-motion';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [otpTimeLeft, setOtpTimeLeft] = useState(60);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (otpTimeLeft > 0) {
      const timer = setTimeout(() => setOtpTimeLeft(otpTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimeLeft]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResend = async () => {
    if (!email) {
      return setError('No email provided. Please register first.');
    }
    
    setResendLoading(true);
    setResendMessage('');
    setError('');
    
    try {
      await authService.resendOtp(email);
      setResendMessage('A new verification code has been sent.');
      setOtpTimeLeft(60);
      setResendCooldown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldError('');
    
    if (!email) {
      return setError('No email provided. Please register first.');
    }

    if (otpTimeLeft === 0) {
      return setError('Code has expired. Please request a new one.');
    }
    
    const result = verifySchema.safeParse({ otp });
    if (!result.success) {
      return setFieldError(result.error.issues[0].message);
    }
    
    setLoading(true);
    
    try {
      await authService.verifyOtp({ email, otp });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-transparent flex items-center justify-center p-4 selection:bg-fuchsia-500/30 font-sans"
      >
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="bg-white p-12 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] w-full max-w-md text-center border border-slate-200"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
          >
            <CheckCircle size={64} className="text-teal-500 mx-auto mb-6 drop-shadow-md" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-3 text-gray-900 tracking-tight">Account Verified!</h2>
          <p className="text-gray-500 mb-8 font-medium">
            Your email has been verified. You can now log in to start shortening URLs.
          </p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex justify-center items-center gap-2 shadow-xl shadow-gray-900/20 group"
          >
            Go to Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen bg-transparent text-slate-900 flex overflow-hidden font-sans selection:bg-yellow-500/30"
    >
      
      {/* Left Animated Section */}
      <div className="hidden lg:flex w-[55%] relative items-center justify-center p-12">

        
        {/* Floating Elements Composition */}
        <div className="relative w-full max-w-lg aspect-square perspective-1000">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 m-auto w-64 h-64 bg-white/70 backdrop-blur-2xl rounded-[2rem] border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center z-20 overflow-hidden"
          >
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
            />
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(234,179,8,0.3)]">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Verify</h2>
            <p className="text-slate-500 mt-2 font-medium">Identity Check</p>
          </motion.div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-4 sm:p-8 lg:p-0 relative z-40 min-h-screen">
        <div className="w-full max-w-[420px] lg:max-w-none bg-white/70 lg:bg-white/70 backdrop-blur-2xl lg:backdrop-blur-2xl text-slate-900 p-8 sm:p-10 lg:p-12 rounded-[2.5rem] lg:rounded-none lg:rounded-l-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.05)] lg:h-full lg:flex lg:flex-col lg:justify-center border border-slate-200/60 relative overflow-hidden">
          
          {/* Subtle Mobile Inner Gradient */}
          <div className="lg:hidden absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none"></div>

          <div className="w-full lg:max-w-[380px] mx-auto relative z-10">
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, type: "spring", bounce: 0.5 }} className="mb-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-yellow-200">
              <Mail className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Check Your Email</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              We've sent a 6-digit verification code to <span className="font-semibold text-yellow-600">{email}</span>.
            </p>
          </motion.div>

          <motion.form variants={containerVariants} initial="hidden" animate="show" onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && <motion.div variants={itemVariants} className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl border border-red-500/20 text-center">{error}</motion.div>}

            <motion.div variants={itemVariants} className="mb-2">
              <input 
                type="text" 
                maxLength={6}
                className={`w-full py-4 text-center text-4xl font-bold tracking-[0.5em] border-2 ${fieldError ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500' : 'border-slate-200 bg-white text-slate-900 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10'} rounded-xl outline-none transition-all font-mono`}
                placeholder="••••••" 
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  if (fieldError) setFieldError('');
                }}
              />
              {fieldError && <p className="text-red-500 text-xs text-center mt-2">{fieldError}</p>}
            </motion.div>

            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(234,179,8,0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading || otpTimeLeft === 0}
              className="w-full py-4 mt-2 bg-yellow-500 text-white rounded-xl text-sm font-bold hover:bg-yellow-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-xl shadow-yellow-500/20 relative overflow-hidden"
            >
              {loading ? (
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : otpTimeLeft === 0 ? 'Code Expired' : (
                <>
                  Verify Code
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
            
            {resendMessage && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-xl text-center flex items-center justify-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4" />
                {resendMessage}
              </motion.div>
            )}
            
            <motion.div variants={itemVariants} className="text-center text-sm text-slate-500 mt-6 flex flex-col items-center gap-2">
              <p>
                Didn't receive the code? 
                <button type="button" onClick={handleResend} disabled={resendLoading || otpTimeLeft > 0} className={`ml-1 font-bold transition-colors ${otpTimeLeft > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-yellow-600 hover:underline'}`}>
                  {resendLoading ? 'Sending...' : 'Resend Code'}
                </button>
              </p>
              {otpTimeLeft > 0 && (
                <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                  <Clock className="w-3 h-3" />
                  Code expires in {Math.floor(otpTimeLeft / 60)}:{(otpTimeLeft % 60).toString().padStart(2, '0')}
                </div>
              )}
            </motion.div>
          </motion.form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
