'use client';

import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePresentation } from '@/hooks/usePresentation';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft, ChevronRight, Mic } from 'lucide-react';
import Slide1 from './slides/Slide1';
import Slide2 from './slides/Slide2';
import Slide3 from './slides/Slide3';
import Slide4 from './slides/Slide4';
import Slide5 from './slides/Slide5';
import Slide6 from './slides/Slide6';
import Slide7 from './slides/Slide7';

const SlidePlaceholder = ({ index, titleKey }: { index: number; titleKey: 'problem' | 'concept' | 'firmware' | 'cloud' | 'impact' | 'closing' }) => {
  const { t } = useLanguage();
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-950 px-6">
      <h1 className="text-2xl md:text-4xl font-bold text-white text-center">Slide {index}: {t[titleKey]}</h1>
    </div>
  );
};

const slides = [
  { id: 0, component: <Slide1 /> },
  { id: 1, component: <Slide2 /> },
  { id: 2, component: <Slide3 /> },
  { id: 3, component: <Slide4 /> },
  { id: 4, component: <Slide5 /> },
  { id: 5, component: <Slide6 /> },
  { id: 6, component: <Slide7 /> },
  { id: 7, component: <SlidePlaceholder index={7} titleKey="impact" /> },
  { id: 8, component: <SlidePlaceholder index={8} titleKey="closing" /> },
];

// Umbrales del gesto de deslizar (swipe) en pantallas táctiles
const SWIPE_MIN_DISTANCE = 50; // px
const SWIPE_MAX_DURATION = 800; // ms

export default function PresentationContainer() {
  const { currentSlide, nextSlide, prevSlide, language, setLanguage } = usePresentation(slides.length);
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Zonas que gestionan sus propios gestos:
    //  - data-no-swipe            → siempre (p. ej. el canvas 3D)
    //  - data-no-swipe="overflow" → solo si tienen scroll horizontal real (código/diagrama en celular)
    const target = e.target as HTMLElement;
    const zone = target.closest<HTMLElement>('[data-no-swipe]');
    const blocked = zone && (zone.dataset.noSwipe !== 'overflow' || zone.scrollWidth > zone.clientWidth);
    if (e.touches.length !== 1 || blocked) {
      touchStart.current = null;
      return;
    }
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY, t: Date.now() };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const isHorizontal = Math.abs(dx) > Math.abs(dy) * 1.5;
    if (!isHorizontal || Math.abs(dx) < SWIPE_MIN_DISTANCE || Date.now() - start.t > SWIPE_MAX_DURATION) return;
    if (dx < 0) nextSlide();
    else prevSlide();
  };

  return (
    <LanguageProvider language={language}>
      <div
        className="relative h-dvh w-full overflow-hidden bg-slate-950 text-white font-sans"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header / Language Toggle */}
        <header className="absolute top-0 right-0 p-4 md:p-8 z-50">
          <div className="flex space-x-1 md:space-x-2 rounded-full border border-gray-800 bg-black/50 backdrop-blur-md p-1">
            {['ES', 'EN', 'PL', 'SK'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang as typeof language)}
                className={`px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm rounded-full font-medium transition-colors ${
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

        {/* Navegación táctil: visible en pantallas pequeñas o dispositivos táctiles (en escritorio se usa el teclado) */}
        <nav className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 hidden max-md:flex pointer-coarse:flex md:bottom-8 items-center gap-1 rounded-full border border-gray-800 bg-black/60 backdrop-blur-md p-1">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            aria-label="Diapositiva anterior"
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 active:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="min-w-12 text-center text-xs font-medium tabular-nums text-gray-400">
            {currentSlide + 1} / {slides.length}
          </span>
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            aria-label="Diapositiva siguiente"
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 active:bg-white/10 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </nav>

        {/* Microfono icon */}
        <div className="absolute bottom-7 left-5 md:bottom-8 md:left-8 z-50">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Mic className="text-gray-500 w-5 h-5 md:w-6 md:h-6" />
          </motion.div>
        </div>

        {/* Signature: en móvil sube a la esquina superior izquierda para no chocar con la navegación */}
        <div className="absolute top-5 left-5 max-w-[40%] md:max-w-none md:top-auto md:left-auto md:bottom-8 md:right-8 z-50 pointer-events-none">
           <p className="text-[10px] leading-tight md:text-sm text-gray-500">Axel Fernando Langle Camacho</p>
        </div>
      </div>
    </LanguageProvider>
  );
}
