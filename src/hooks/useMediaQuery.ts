import { useCallback, useSyncExternalStore } from 'react';

/**
 * Devuelve `true` cuando la media query coincide.
 * En el servidor siempre devuelve `false` (se corrige al hidratar sin warnings).
 * Úsalo solo para valores que no se pueden expresar con clases de Tailwind
 * (p. ej. props de librerías o posiciones calculadas en JS).
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Pantallas por debajo del breakpoint `md` de Tailwind (768px). */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
