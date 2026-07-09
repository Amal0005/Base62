import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AnimatedBackground() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Mouse position tracking for the spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring physics for smooth spotlight following
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    setIsMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-slate-50 selection:bg-fuchsia-500/30">
      
      {/* Base Noise Texture */}
      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] mix-blend-overlay"></div>

      {isMounted && (
        <>
          {/* Interactive Mouse Spotlight */}
          <motion.div
            className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-fuchsia-400/15 blur-[120px] -translate-x-1/2 -translate-y-1/2"
            style={{
              x: springX,
              y: springY,
            }}
          />

          {/* Primary Gradient Orb 1 */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1], 
              rotate: [0, 90, 0],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-400/25 rounded-full blur-[120px]"
          />

          {/* Primary Gradient Orb 2 */}
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1], 
              x: [0, -70, 0],
              y: [0, -50, 0],
              rotate: [0, -90, 0]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-400/25 rounded-full blur-[130px]"
          />

          {/* Floating Accent Particles */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0.1,
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              }}
              animate={{
                y: [null, Math.random() * -100 - 50],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: Math.random() * 5 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute w-1.5 h-1.5 rounded-full bg-violet-400/50 blur-[1px]"
            />
          ))}
        </>
      )}
    </div>
  );
}
