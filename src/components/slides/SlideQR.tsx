'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Smartphone, Headphones, Activity, ShieldCheck, QrCode } from 'lucide-react';

interface SlideQRProps {
  variant?: 'intro' | 'outro';
}

export default function SlideQR({ variant = 'intro' }: SlideQRProps) {
  const { t } = useLanguage();

  const features = [
    {
      icon: Headphones,
      text: t.qrFeature1,
      accent: 'text-cyan-400',
      bg: 'bg-cyan-500/15 border-cyan-500/30',
    },
    {
      icon: ShieldCheck,
      text: t.qrFeature2,
      accent: 'text-blue-400',
      bg: 'bg-blue-500/15 border-blue-500/30',
    },
    {
      icon: Activity,
      text: t.qrFeature3,
      accent: 'text-emerald-400',
      bg: 'bg-emerald-500/15 border-emerald-500/30',
    },
  ];

  return (
    <div
      className="h-full w-full relative flex items-center justify-center overflow-y-auto lg:overflow-hidden px-6 py-14 md:px-14"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 50% 45%, #0f172a 0%, #050814 65%, #020409 100%)',
      }}
    >
      {/* Efectos de iluminación ambiental */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[130px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[130px] animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Columna Izquierda: Información e invitación */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider uppercase mb-4">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>{t.qrBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
            {variant === 'intro' ? t.qrIntroTitle : t.qrOutroTitle}
          </h1>

          <p className="text-slate-300 text-base md:text-lg xl:text-xl leading-relaxed max-w-xl mb-6">
            {t.qrDesc}
          </p>

          <div className="flex flex-col gap-3 w-full max-w-xl">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + idx * 0.12 }}
                  className="flex items-center gap-4 bg-slate-900/70 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 text-left"
                >
                  <div
                    className={`w-10 h-10 rounded-xl border ${item.bg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${item.accent}`} />
                  </div>
                  <span className="text-sm md:text-base font-medium text-slate-100">
                    {item.text}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Columna Derecha: Código QR de gran tamaño para auditorio */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="lg:col-span-6 flex flex-col items-center justify-center"
        >
          <div className="relative group">
            {/* Halo luminoso detrás del QR */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/45 via-blue-500/35 to-emerald-400/45 rounded-[2.5rem] blur-2xl opacity-85 group-hover:opacity-100 transition-opacity" />

            <div className="relative bg-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/45 rounded-[2.25rem] p-5 sm:p-6 md:p-7 shadow-2xl flex flex-col items-center">
              <div className="bg-white p-3 sm:p-4 md:p-5 rounded-3xl shadow-inner flex items-center justify-center">
                <img
                  src="/presentacion_comite.png"
                  alt="Código QR Versión Móvil SITAR"
                  style={{ width: 'min(58vh, 78vw, 500px)', height: 'min(58vh, 78vw, 500px)' }}
                  className="object-contain select-none"
                />
              </div>

              <div className="mt-4 flex items-center gap-2.5 px-5 py-2 rounded-full bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 text-xs md:text-sm font-mono font-bold tracking-widest uppercase">
                <QrCode className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                <span>{t.qrScanPrompt}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
