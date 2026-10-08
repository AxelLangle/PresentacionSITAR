'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const pcbImages = [
  '/render1.jpg',
  '/render2.jpg',
  '/render3.jpg',
  '/render4.jpg',
];

export default function Slide4() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % pcbImages.length);
    }, 7500); // Cambia cada 7.5 segundos

    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="h-full w-full relative flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundImage: 'radial-gradient(ellipse at center, #111827, #000000)' }}
    >
      <div className="absolute top-14 left-5 right-5 md:top-16 md:left-16 md:right-auto z-20 pointer-events-none text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">{t.hardware}</h2>
        <p className="text-gray-300 mt-2 md:mt-3 text-base md:text-xl drop-shadow-md">{t.hardwareDesc}</p>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={pcbImages[currentIndex]}
            alt={`Render PCB ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute max-w-[90%] max-h-[80%] object-contain rounded-2xl shadow-2xl border border-white/10"
            // Se le pone una imagen por defecto o se oculta el error si no existe para evitar el icono de imagen rota
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%231f2937"/><text x="400" y="300" font-family="sans-serif" font-size="24" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle">Render Placeholder ${currentIndex + 1}</text></svg>';
            }}
          />
        </AnimatePresence>
      </div>

      {/* Indicadores del carrusel */}
      <div className="absolute bottom-12 flex gap-3 z-20">
        {pcbImages.map((_, idx) => (
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
