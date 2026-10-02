'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePresentation } from '@/hooks/usePresentation';
import { Mic } from 'lucide-react';
import Slide4 from './slides/Slide4';
import Slide7 from './slides/Slide7';

// Placeholder for other slides
const SlidePlaceholder = ({ index, title }: { index: number; title: string }) => (
  <div className="flex h-screen w-full items-center justify-center bg-slate-950">
    <h1 className="text-4xl font-bold text-white">Slide {index}: {title}</h1>
  </div>
);

// Placeholder para Slide 1 (Intro) según requerimiento, de forma sencilla
const Slide1 = () => (
  <div className="flex h-screen w-full items-center justify-center bg-slate-950 relative overflow-hidden">
    {/* Fondo sutil CSS */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 to-slate-950"></div>
    <div className="z-10 text-center">
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="font-sans font-bold text-7xl text-white tracking-tight"
      >
        SITAR
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        className="text-gray-400 mt-4 text-xl"
      >
        Sistema Integrado de Telemetría
      </motion.p>
    </div>
  </div>
);

const slides = [
  { id: 0, component: <Slide1 /> },
  { id: 1, component: <SlidePlaceholder index={1} title="El Problema" /> },
  { id: 2, component: <SlidePlaceholder index={2} title="Concepto" /> },
  { id: 3, component: <Slide4 /> },
  { id: 4, component: <SlidePlaceholder index={4} title="Firmware" /> },
  { id: 5, component: <SlidePlaceholder index={5} title="Nube / Backend" /> },
  { id: 6, component: <Slide7 /> },
  { id: 7, component: <SlidePlaceholder index={7} title="Impacto" /> },
  { id: 8, component: <SlidePlaceholder index={8} title="Cierre" /> },
];

export default function PresentationContainer() {
  const { currentSlide, language, setLanguage } = usePresentation(slides.length);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-950 text-white font-sans">
      {/* Header / Language Toggle */}
      <header className="absolute top-0 right-0 p-8 z-50">
        <div className="flex space-x-2 rounded-full border border-gray-800 bg-black/50 backdrop-blur-md p-1">
          {['ES', 'EN', 'PL', 'SK'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                language === lang ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </header>

      {/* Audio Element placeholder - Sincronizado con slide e idioma */}
      {/* <audio src={`/audio/slide-${currentSlide}-${language}.mp3`} autoPlay /> */}

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {slides[currentSlide].component}
        </motion.div>
      </AnimatePresence>

      {/* Microfono icon */}
      <div className="absolute bottom-8 left-8 z-50">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Mic className="text-gray-500 w-6 h-6" />
        </motion.div>
      </div>

      {/* Signature */}
      <div className="absolute bottom-8 right-8 z-50">
         <p className="text-sm text-gray-500">Axel Fernando Langle Camacho</p>
      </div>
    </div>
  );
}
