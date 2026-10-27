'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { HardDrive, Database, ShieldCheck, Cpu } from 'lucide-react';

export default function SlidePCBv2() {
  const { t } = useLanguage();

  const cards = [
    {
      icon: HardDrive,
      title: t.pcbV2Card1Title,
      desc: t.pcbV2Card1Desc,
      tag: 'SPI · FAT32',
      accent: 'text-cyan-400',
      bgAccent: 'bg-cyan-500/15 border-cyan-500/30',
      borderHover: 'hover:border-cyan-500/40',
    },
    {
      icon: Database,
      title: t.pcbV2Card2Title,
      desc: t.pcbV2Card2Desc,
      tag: 'STORE & FORWARD',
      accent: 'text-emerald-400',
      bgAccent: 'bg-emerald-500/15 border-emerald-500/30',
      borderHover: 'hover:border-emerald-500/40',
    },
    {
      icon: ShieldCheck,
      title: t.pcbV2Card3Title,
      desc: t.pcbV2Card3Desc,
      tag: 'NMX-AA-179-2018',
      accent: 'text-blue-400',
      bgAccent: 'bg-blue-500/15 border-blue-500/30',
      borderHover: 'hover:border-blue-500/40',
    },
  ];

  return (
    <div
      className="h-full w-full relative flex flex-col justify-between overflow-y-auto lg:overflow-hidden px-5 pt-14 pb-20 md:px-14 md:pt-10 md:pb-12"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 50% 35%, #0f172a 0%, #060913 65%, #02040a 100%)',
      }}
    >
      {/* Luces ambientales de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[110px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[110px]" />
      </div>

      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-2 shrink-0 pr-0 md:pr-44"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono tracking-wider uppercase mb-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.pcbV2Badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
            {t.pcbV2Title}
          </h2>
          <p className="text-slate-300 mt-1 text-sm md:text-lg drop-shadow">
            {t.pcbV2Desc}
          </p>
        </div>
      </motion.div>

      {/* Video Protagonista en el Centro */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="relative z-20 my-3 md:my-4 flex-1 min-h-0 flex items-center justify-center"
      >
        <div className="relative h-full max-h-[46vh] md:max-h-[54vh] w-full max-w-5xl flex items-center justify-center">
          <div className="relative h-full w-full flex items-center justify-center rounded-2xl overflow-hidden bg-slate-950/80 border border-cyan-500/25 shadow-[0_0_50px_rgba(6,182,212,0.12)]">
            <video
              src="/carousel/pcb_v2.0.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain rounded-2xl"
            />

            {/* Etiqueta flotante superior izquierda sobre el video */}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-200 pointer-events-none">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>KiCad 3D · PCB v2.0 + MicroSD</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Badges Técnicos Inferiores */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-6xl w-full mx-auto shrink-0"
      >
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`bg-slate-900/65 backdrop-blur-md px-4 py-3.5 rounded-2xl border border-white/10 ${card.borderHover} transition-all flex items-start gap-3.5`}
            >
              <div
                className={`w-10 h-10 rounded-xl border ${card.bgAccent} flex items-center justify-center shrink-0 mt-0.5`}
              >
                <Icon className={`w-5 h-5 ${card.accent}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm md:text-base font-semibold text-white truncate">
                    {card.title}
                  </h3>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 ${card.accent} shrink-0`}
                  >
                    {card.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-1 line-clamp-2">
                  {card.desc}
                </p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
