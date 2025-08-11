// MobileMenu.tsx
import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';

interface Props {
  theme?: 'light' | 'dark';
  mobileMenuBg?: string;
  mobileMenuText?: string;
  mobileMenuTextHover?: string;
  hamburgerColor?: string;
  isScrolled?: boolean;
}

export const MobileMenu = component$<Props>((props) => {
  const isOpen = useSignal(false);
  const hasInitialized = useSignal(false);
  
  const {
    theme = 'light',
    mobileMenuBg = 'bg-dark',
    mobileMenuText = 'text-gray-100',
    mobileMenuTextHover = 'hover:text-gray-400',
    hamburgerColor = 'bg-white',
    isScrolled = false
  } = props;

  // Inizializza lo stato al mount del componente
  useVisibleTask$(() => {
    hasInitialized.value = true;
  });

  // Toggle menu
  const toggleMenu$ = $(() => {
    isOpen.value = !isOpen.value;
  });

  // Il menu dropdown deve sempre avere solo background semitrasparente (no blur)
  const getMenuClasses = () => {
    const baseClasses = 'fixed top-0 left-0 w-full flex flex-col gap-6 px-4 pb-6 mt-[96px] shadow-md rounded-none transform transition-all duration-700 ease-in-out';
    const bgClasses = theme === 'light' ? 'bg-black/80' : 'bg-white/80';
    const visibilityClasses = isOpen.value
      ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
      : 'opacity-0 scale-90 -translate-y-6 pointer-events-none';
    
    return `${baseClasses} ${bgClasses} ${visibilityClasses}`;
  };

  return (
    <div class="md:hidden">
      {/* Hamburger button standard */}
      <button
        class="z-60 hover:opacity-80 focus:outline-none transition-all duration-300"
        aria-label="Apri menu"
        onClick$={toggleMenu$}
      >
        <div class="relative h-4 flex flex-col justify-between items-center">
          <span class={`block h-0.5 ${hamburgerColor} transform transition duration-300 ease-in-out rounded w-8 self-end ${isOpen.value ? 'rotate-45 translate-y-1' : ''}`}></span>
          <span class={`block h-0.5 ${hamburgerColor} transform transition duration-300 ease-in-out rounded w-6 self-end ${isOpen.value ? 'translate-x-8 rotate-180 opacity-0' : ''}`}></span>
          <span class={`block h-0.5 ${hamburgerColor} transform transition duration-300 ease-in-out rounded w-4 self-end ${isOpen.value ? '-rotate-45 -translate-y-2.5 w-8' : ''}`}></span>
        </div>
      </button>

      {/* Mobile menu dropdown con sfondo blur sempre attivo */}
      <div class={getMenuClasses()}>
        <a href="/" class={`${mobileMenuText} ${mobileMenuTextHover}`}>Home</a>
        <a href="/chi-siamo" class={`${mobileMenuText} ${mobileMenuTextHover}`}>Chi siamo</a>
        <a href="/offerte" class={`${mobileMenuText} ${mobileMenuTextHover}`}>Offerte</a>
        <a href="/contatti" class={`${mobileMenuText} ${mobileMenuTextHover}`}>Contatti</a>
        <a href="/catalogo" class="bg-brand text-white text-center px-4 py-2 rounded hover:bg-brand-dark transition">
          Catalogo
        </a>
      </div>
    </div>
  );
});