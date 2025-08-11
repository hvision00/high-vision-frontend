// hooks/useSmoothScroll.tsx
import { useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import type { Signal } from '@builder.io/qwik';

interface ScrollState {
  isScrolled: Signal<boolean>;
  scrollDirection: Signal<'up' | 'down' | null>;
  scrollY: Signal<number>;
}

export const useSmoothScroll = (threshold: number = 50): ScrollState => {
  const isScrolled = useSignal(false);
  const scrollDirection = useSignal<'up' | 'down' | null>(null);
  const scrollY = useSignal(0);
  const lastScrollY = useSignal(0);
  const ticking = useSignal(false);

  const updateScrollState$ = $(() => {
    const currentScrollY = window.scrollY;
    
    // Determina se siamo scrollati oltre la soglia
    isScrolled.value = currentScrollY > threshold;
    
    // Determina la direzione dello scroll
    if (currentScrollY > lastScrollY.value) {
      scrollDirection.value = 'down';
    } else if (currentScrollY < lastScrollY.value) {
      scrollDirection.value = 'up';
    }
    
    scrollY.value = currentScrollY;
    lastScrollY.value = currentScrollY;
    ticking.value = false;
  });

  const handleScroll$ = $(() => {
    if (!ticking.value) {
      window.requestAnimationFrame(() => {
        updateScrollState$();
      });
      ticking.value = true;
    }
  });

  useVisibleTask$(() => {
    // Inizializza lo stato
    updateScrollState$();
    
    // Aggiungi event listener con passive per migliori performance
    window.addEventListener('scroll', handleScroll$, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll$);
    };
  });

  return {
    isScrolled,
    scrollDirection,
    scrollY
  };
};