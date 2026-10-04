'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function Slide2() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  // En celular vertical la pantalla se divide arriba/abajo en lugar de izquierda/derecha
  const stacked = useMediaQuery('(max-width: 767px) and (orientation: portrait)');
  const size = stacked ? 'height' : 'width';

  return (
    <div 
      className={`h-full w-full flex ${stacked ? 'flex-col' : 'flex-row'} cursor-pointer overflow-hidden bg-black`}
      onClick={() => setExpanded(true)}
    >
      {/* Lado Izquierdo (El Pasado) */}
      <motion.div 
        key={`past-${size}`}
        initial={false}
        animate={{ 
          [size]: expanded ? '0%' : '50%', 
          opacity: expanded ? 0 : 1 
        }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        className={`relative overflow-hidden ${stacked ? 'w-full' : 'h-full'}`}
      >
        <div className="absolute inset-0 bg-black/70 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale" 
          style={{ backgroundImage: "url('/Operador_escala_grises.png')" }}
        />
      </motion.div>

      {/* Lado Derecho (El Detonante) */}
      <motion.div 
        key={`trigger-${size}`}
        initial={false}
        animate={{ 
          [size]: expanded ? '100%' : '50%'
        }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        className={`bg-red-900 flex items-center justify-center relative shadow-2xl z-20 px-4 ${stacked ? 'w-full' : 'h-full'}`}
      >
        <motion.div layout className="text-center">
          {!expanded && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className={`text-red-200/50 uppercase tracking-widest text-xs md:text-sm mb-4 absolute w-full left-0 ${stacked ? 'top-8' : 'top-16'}`}
            >
              {t.problem}
            </motion.p>
          )}
          <motion.h1 
            layout="position"
            className="text-white font-bold text-2xl sm:text-4xl md:text-5xl lg:text-7xl tracking-wider md:tracking-widest text-center shadow-black drop-shadow-2xl break-words"
          >
            {t.norm}
          </motion.h1>
        </motion.div>
      </motion.div>
    </div>
  );
}
