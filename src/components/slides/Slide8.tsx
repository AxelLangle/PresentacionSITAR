'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck, Droplets, Globe } from 'lucide-react';

export default function Slide8() {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-950 px-6 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div 
        className="z-10 max-w-6xl w-full flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-16 text-center"
        >
          {t.impact}
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-colors group">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">{t.compliance}</h3>
            <p className="text-slate-400 leading-relaxed">
              {t.complianceDesc1}<strong>{t.norm}</strong>{t.complianceDesc2}
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-cyan-500/50 transition-colors group">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Droplets className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">{t.waterEfficiency}</h3>
            <p className="text-slate-400 leading-relaxed">
              {t.waterEfficiencyDesc}
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-emerald-500/50 transition-colors group">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">{t.scalability}</h3>
            <p className="text-slate-400 leading-relaxed">
              {t.scalabilityDesc}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
