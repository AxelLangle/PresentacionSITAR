'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Droplet } from 'lucide-react';

export default function Slide9() {
  const { t } = useLanguage();

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-950 px-6 relative overflow-hidden">
      
      {/* Dynamic background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        />
      </div>

      <div className="z-10 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, delay: 0.2 }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
          <Droplet className="w-24 h-24 text-blue-400 relative z-10" strokeWidth={1.5} />
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6"
        >
          {t.closing}
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-8"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-xl md:text-2xl text-slate-400 font-light"
        >
          Gracias por su atención.
        </motion.p>
      </div>
    </div>
  );
}
