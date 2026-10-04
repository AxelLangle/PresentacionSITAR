'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/useMediaQuery';

// Lienzo de las líneas conectoras (el centro coincide con el estallido)
const SVG_W = 600;
const SVG_H = 400;

export default function Slide3() {
  const { t } = useLanguage();
  const [stage, setStage] = useState(0); // 0: falling, 1: exploded
  const isMobile = useIsMobile();
  // En móvil la constelación se compacta para que las etiquetas no se salgan de la pantalla
  const spread = isMobile ? 0.6 : 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage(1);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const nodes = [
    { id: 1, label: t.word1, x: -180 * spread, y: -60 * spread, delay: 0 },
    { id: 2, label: t.word2, x: 0, y: -120 * spread, delay: 0.2 },
    { id: 3, label: t.word3, x: 180 * spread, y: -60 * spread, delay: 0.4 },
  ];

  return (
    <div className="h-full w-full bg-black relative flex items-center justify-center overflow-hidden">
      
      {/* Etapa 0: Gota cayendo */}
      <motion.div
        initial={{ y: -500, scale: 1, opacity: 1 }}
        animate={
          stage === 0 
            ? { y: 0, scale: [1, 1.2, 1] } 
            : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 1.5, ease: "easeIn" }}
        className="absolute w-3 h-4 rounded-full bg-blue-300"
        style={{ originY: 1, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', boxShadow: '0 0 20px rgba(147,197,253,1)' }}
      />

      {/* Etapa 1: Constelación */}
      {stage === 1 && (
        <div className="relative flex items-center justify-center">
           {/* Estallido central */}
           <motion.div
             initial={{ scale: 0, opacity: 1 }}
             animate={{ scale: 30, opacity: 0 }}
             transition={{ duration: 1, ease: "easeOut" }}
             className="absolute w-4 h-4 rounded-full bg-blue-400"
           />

           {/* Nodos */}
           {nodes.map(node => (
             <motion.div
               key={node.id}
               initial={{ x: 0, y: 0, opacity: 0 }}
               animate={{ 
                 x: node.x, 
                 y: node.y, 
                 opacity: 1 
               }}
               transition={{ 
                 duration: 1.2, 
                 delay: node.delay,
                 ease: "easeOut"
               }}
               className="absolute flex flex-col items-center z-10"
             >
               <motion.div 
                 animate={{ y: [-5, 5, -5] }}
                 transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: node.delay }}
                 className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-900/50 border border-blue-500/30 backdrop-blur-sm flex items-center justify-center"
                 style={{ boxShadow: '0 0 30px rgba(59,130,246,0.2)' }}
               >
                 <div className="w-2 h-2 rounded-full bg-blue-300" style={{ boxShadow: '0 0 15px rgba(147,197,253,1)' }} />
               </motion.div>
               <motion.span 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: node.delay + 0.5 }}
                 className="text-white mt-3 md:mt-4 font-light tracking-wider md:tracking-widest text-[11px] md:text-sm uppercase"
               >
                 {node.label}
               </motion.span>
             </motion.div>
           ))}
           
           {/* Líneas conectoras */}
           <svg className="absolute inset-0 pointer-events-none" style={{ width: `${SVG_W}px`, height: `${SVG_H}px`, transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }}>
             {nodes.map((node, i) => (
               <motion.line 
                 key={node.id}
                 initial={{ pathLength: 0, opacity: 0 }}
                 animate={{ pathLength: 1, opacity: 0.2 }}
                 transition={{ duration: 1, delay: 0.8 + i * 0.2 }}
                 x1={SVG_W / 2} y1={SVG_H / 2} x2={SVG_W / 2 + node.x} y2={SVG_H / 2 + node.y} 
                 stroke="#60a5fa" strokeWidth="1" 
               />
             ))}
           </svg>
        </div>
      )}
    </div>
  );
}
