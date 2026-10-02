'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Slide1() {
  const { t } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Fondo de agua sutil reaccionando al ratón */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute rounded-full bg-blue-900/30 mix-blend-screen"
          style={{ width: '800px', height: '800px', filter: 'blur(120px)' }}
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 1.5 }}
        />
        {/* Pulsación lenta tipo onda */}
        <motion.div 
          className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(30, 58, 138, 0.1), rgba(2, 6, 23, 0.8), rgba(2, 6, 23, 1))' }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />
      </div>

      <div className="z-10 text-center pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="font-sans font-bold text-7xl text-white tracking-tight"
        >
          {t.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="text-gray-400 mt-4 text-xl"
        >
          {t.subtitle}
        </motion.p>
      </div>
    </div>
  );
}
