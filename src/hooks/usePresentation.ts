import { useState, useEffect, useCallback } from 'react';

export const usePresentation = (totalSlides: number) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [language, setLanguage] = useState<'ES' | 'EN' | 'PL' | 'SK'>('ES');

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return { currentSlide, nextSlide, prevSlide, language, setLanguage };
};
