'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const carouselItems = [
  { type: 'video', src: '/carousel/Animacion.mkv', duration: 16000 },
  { type: 'image', src: '/carousel/ATTINY1614_2.png', duration: 12000 },
  { type: 'image', src: '/carousel/RS48 Y SIM800L.png', duration: 26000 },
  { type: 'image', src: '/carousel/PowerSupply.png', duration: 16000 },
];

export default function Slide4() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const currentItem = carouselItems[currentIndex];
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, currentItem.duration);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length);
  };

  const currentItem = carouselItems[currentIndex];

  return (
    <div 
      className="h-full w-full relative flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundImage: 'radial-gradient(ellipse at center, #111827, #000000)' }}
    >
      <div className="absolute top-14 left-5 right-5 md:top-16 md:left-16 md:right-auto z-20 pointer-events-none text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">{t.hardware}</h2>
        <p className="text-gray-300 mt-2 md:mt-3 text-base md:text-xl drop-shadow-md">{t.hardwareDesc}</p>
      </div>

      {/* Flecha Izquierda */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all border border-white/10 hover:border-white/30 hover:scale-110"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Flecha Derecha */}
      <button 
        onClick={handleNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all border border-white/10 hover:border-white/30 hover:scale-110"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {currentItem.type === 'video' ? (
            <motion.video
              key={currentIndex}
              src={currentItem.src}
              autoPlay
              loop
              muted
              playsInline
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute max-w-[90%] max-h-[80%] object-contain rounded-2xl shadow-2xl border border-white/10 pointer-events-auto"
            />
          ) : (
            <motion.img
              key={currentIndex}
              src={currentItem.src}
              alt={`Render PCB ${currentIndex + 1}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute max-w-[90%] max-h-[80%] object-contain rounded-2xl shadow-2xl border border-white/10 pointer-events-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%231f2937"/><text x="400" y="300" font-family="sans-serif" font-size="24" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle">Error loading media</text></svg>';
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Indicadores del carrusel */}
      <div className="absolute bottom-12 flex gap-3 z-20">
        {carouselItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              idx === currentIndex ? 'w-8 bg-blue-500' : 'w-2.5 bg-gray-500 hover:bg-gray-400'
            }`}
            aria-label={`Ir a la imagen ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
