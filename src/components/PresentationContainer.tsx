'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePresentation } from '@/hooks/usePresentation';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { Mic } from 'lucide-react';
import Slide1 from './slides/Slide1';
import Slide2 from './slides/Slide2';
import Slide3 from './slides/Slide3';
import Slide4 from './slides/Slide4';
import Slide7 from './slides/Slide7';

const SlidePlaceholder = ({ index, titleKey }: { index: number; titleKey: 'problem' | 'concept' | 'firmware' | 'cloud' | 'impact' | 'closing' }) => {
  const { t } = useLanguage();
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950">
      <h1 className="text-4xl font-bold text-white">Slide {index}: {t[titleKey]}</h1>
    </div>
  );
};

const slides = [
  { id: 0, component: <Slide1 /> },
  { id: 1, component: <Slide2 /> },
  { id: 2, component: <Slide3 /> },
  { id: 3, component: <Slide4 /> },
  { id: 4, component: <SlidePlaceholder index={4} titleKey="firmware" /> },
  { id: 5, component: <SlidePlaceholder index={5} titleKey="cloud" /> },
  { id: 6, component: <Slide7 /> },
  { id: 7, component: <SlidePlaceholder index={7} titleKey="impact" /> },
  { id: 8, component: <SlidePlaceholder index={8} titleKey="closing" /> },
];

export default function PresentationContainer() {
  const { currentSlide, language, setLanguage } = usePresentation(slides.length);

  return (
    <LanguageProvider language={language}>
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
    </LanguageProvider>
  );
}
