'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Slide1() {
  const { t } = useLanguage();
  // null = aún no hay puntero (p. ej. en móvil): el brillo se queda centrado
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // pointermove cubre tanto el ratón como el arrastre del dedo
    const updateMousePosition = (ev: PointerEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('pointermove', updateMousePosition);
    return () => window.removeEventListener('pointermove', updateMousePosition);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Fondo de agua sutil reaccionando al ratón */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute rounded-full bg-blue-900/30 mix-blend-screen"
          // Tamaño acotado a la pantalla y centrado sobre el puntero con translate(-50%, -50%)
          style={{ width: 'min(800px, 120vmax)', height: 'min(800px, 120vmax)', filter: 'blur(120px)', x: '-50%', y: '-50%' }}
          initial={false}
          animate={{
            left: mousePosition ? mousePosition.x : '50%',
            top: mousePosition ? mousePosition.y : '50%',
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

      <div className="z-10 text-center pointer-events-none px-6">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="font-sans font-bold text-5xl sm:text-6xl md:text-7xl text-white tracking-tight"
        >
          {t.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="text-gray-400 mt-3 md:mt-4 text-base sm:text-lg md:text-xl"
        >
          {t.subtitle}
        </motion.p>
      </div>
    </div>
  );
}
