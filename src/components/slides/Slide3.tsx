'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Slide3() {
  const { t } = useLanguage();
  const [stage, setStage] = useState(0); // 0: falling, 1: exploded

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage(1);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const nodes = [
    { id: 1, label: t.word1, x: -180, y: -60, delay: 0 },
    { id: 2, label: t.word2, x: 0, y: -120, delay: 0.2 },
    { id: 3, label: t.word3, x: 180, y: -60, delay: 0.4 },
  ];

  return (
    <div className="h-screen w-full bg-black relative flex items-center justify-center overflow-hidden">
      
      {/* Etapa 0: Gota cayendo */}
      <motion.div
        initial={{ y: -500, scale: 1, opacity: 1 }}
        animate={
          stage === 0 
            ? { y: 0, scale: [1, 1.2, 1] } 
            : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 1.5, ease: "easeIn" }}
        className="absolute w-3 h-4 rounded-full bg-blue-300 shadow-[0_0_20px_rgba(147,197,253,1)]"
        style={{ originY: 1, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}
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
                 className="w-16 h-16 rounded-full bg-slate-900/50 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)] backdrop-blur-sm flex items-center justify-center"
               >
                 <div className="w-2 h-2 rounded-full bg-blue-300 shadow-[0_0_15px_rgba(147,197,253,1)]" />
               </motion.div>
               <motion.span 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: node.delay + 0.5 }}
                 className="text-white mt-4 font-light tracking-widest text-sm uppercase"
               >
                 {node.label}
               </motion.span>
             </motion.div>
           ))}
           
           {/* Líneas conectoras */}
           <svg className="absolute inset-0 w-[600px] h-[400px] pointer-events-none" style={{ transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }}>
             <motion.line 
               initial={{ pathLength: 0, opacity: 0 }}
               animate={{ pathLength: 1, opacity: 0.2 }}
               transition={{ duration: 1, delay: 0.8 }}
               x1="300" y1="200" x2="120" y2="140" 
               stroke="#60a5fa" strokeWidth="1" 
             />
             <motion.line 
               initial={{ pathLength: 0, opacity: 0 }}
               animate={{ pathLength: 1, opacity: 0.2 }}
               transition={{ duration: 1, delay: 1 }}
               x1="300" y1="200" x2="300" y2="80" 
               stroke="#60a5fa" strokeWidth="1" 
             />
             <motion.line 
               initial={{ pathLength: 0, opacity: 0 }}
               animate={{ pathLength: 1, opacity: 0.2 }}
               transition={{ duration: 1, delay: 1.2 }}
               x1="300" y1="200" x2="480" y2="140" 
               stroke="#60a5fa" strokeWidth="1" 
             />
           </svg>
        </div>
      )}
    </div>
  );
}
