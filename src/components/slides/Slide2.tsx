'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Slide2() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className="h-screen w-full flex cursor-pointer overflow-hidden bg-black" 
      onClick={() => setExpanded(true)}
    >
      {/* Lado Izquierdo (El Pasado) */}
      <motion.div 
        initial={false}
        animate={{ 
          width: expanded ? '0%' : '50%', 
          opacity: expanded ? 0 : 1 
        }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        className="h-full relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/70 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000')" }}
        />
      </motion.div>

      {/* Lado Derecho (El Detonante) */}
      <motion.div 
        initial={false}
        animate={{ 
          width: expanded ? '100%' : '50%'
        }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        className="h-full bg-red-900 flex items-center justify-center relative shadow-2xl z-20"
      >
        <motion.div layout className="text-center">
          {!expanded && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-red-200/50 uppercase tracking-widest text-sm mb-4 absolute top-16 w-full left-0"
            >
              {t.problem}
            </motion.p>
          )}
          <motion.h1 
            layout="position"
            className="text-white font-bold text-5xl md:text-7xl tracking-widest text-center shadow-black drop-shadow-2xl"
          >
            {t.norm}
          </motion.h1>
        </motion.div>
      </motion.div>
    </div>
  );
}
