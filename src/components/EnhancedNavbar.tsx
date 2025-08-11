// EnhancedNavbar.tsx
import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import type { Signal } from '@builder.io/qwik';
import { MobileMenu } from './MobileMenu';

interface Props {
  theme?: 'light' | 'dark';
  logoLight: string;
  currentPath: string;
}

export const EnhancedNavbar = component$<Props>(({ theme = 'light', logoLight, currentPath }) => {
  const isScrolled = useSignal(false);
  const showFloatingMenu = useSignal(false);
  const navbarVisible = useSignal(true);
  const navbarHovered = useSignal(false);
  const lastScrollY = useSignal(0);

  // Determina il tema
  const isHomePage = currentPath === '/';
  const currentTheme = theme === 'light' || isHomePage ? 'light' : 'dark';

  // Configurazione colori
  const themeConfig = {
    light: {
      logo: logoLight,
      textColor: 'text-white',
      textColorActive: 'text-gray-400',
      hoverEffect: 'hover:translate-y-[-2px] hover:[text-shadow:0_3px_6px_rgba(255,255,255,0.4)]',
      mobileMenuBg: 'bg-dark',
      mobileMenuText: 'text-gray-100',
      mobileMenuTextHover: 'hover:text-gray-400',
      hamburgerColor: 'bg-white',
      navbarBg: 'bg-black/80 backdrop-blur-md',
      navbarBgMobile: 'bg-black/80', // Sfondo mobile senza blur
      floatingBtnBg: 'bg-brand',
      floatingBtnBorder: 'border-white'
    },
    dark: {
      logo: '/images/logo-dark.png',
      textColor: 'text-gray-900',
      textColorActive: 'text-blue-600',
      hoverEffect: 'hover:translate-y-[-2px] hover:text-gray-700',
      mobileMenuBg: 'bg-white',
      mobileMenuText: 'text-gray-900',
      mobileMenuTextHover: 'hover:text-blue-600',
      hamburgerColor: 'bg-gray-900',
      navbarBg: 'bg-white/80 backdrop-blur-md',
      navbarBgMobile: 'bg-white/80', // Sfondo mobile senza blur
      floatingBtnBg: 'bg-brand',
      floatingBtnBorder: 'border-gray-900'
    }
  };

  const config = themeConfig[currentTheme];

  // Gestione scroll
  const handleScroll$ = $(() => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
      isScrolled.value = true;
      
      // Animazione solo per desktop
      if (window.innerWidth >= 768) {
        // Se scrolliamo verso il basso e non siamo in hover
        if (currentScrollY > lastScrollY.value && !navbarHovered.value) {
          navbarVisible.value = false;
          showFloatingMenu.value = true;
        }
      }
    } else {
      isScrolled.value = false;
      navbarVisible.value = true;
      showFloatingMenu.value = false;
    }
    
    lastScrollY.value = currentScrollY;
  });

  // Click sul pulsante floating (solo desktop)
  const handleFloatingClick$ = $(() => {
    navbarVisible.value = true;
    showFloatingMenu.value = false;
  });

  // Mouse enter/leave sulla navbar (solo desktop)
  const handleNavbarMouseEnter$ = $(() => {
    if (window.innerWidth >= 768) {
      navbarHovered.value = true;
    }
  });

  const handleNavbarMouseLeave$ = $(() => {
    if (window.innerWidth >= 768) {
      navbarHovered.value = false;
      // Se siamo scrollati, nascondi la navbar quando il mouse esce
      if (isScrolled.value) {
        setTimeout(() => {
          if (!navbarHovered.value) {
            navbarVisible.value = false;
            showFloatingMenu.value = true;
          }
        }, 300);
      }
    }
  });

  // Funzione per ottenere le classi della navbar
  const getNavbarClasses = () => {
    const baseClasses = 'w-full fixed z-50 transition-all duration-500 ease-in-out';
    
    // Classi per visibilità (solo desktop)
    const visibilityClasses = navbarVisible.value 
      ? 'md:translate-y-0 md:opacity-100' 
      : 'md:-translate-y-full md:opacity-0 md:pointer-events-none';
    
    // Classi per background quando scrollato
    let bgClasses = '';
    if (isScrolled.value) {
      if (currentTheme === 'light') {
        // Desktop: blur, Mobile: solo trasparenza
        bgClasses = 'md:bg-black/80 md:backdrop-blur-md bg-black/80';
      } else {
        // Desktop: blur, Mobile: solo trasparenza
        bgClasses = 'md:bg-white/80 md:backdrop-blur-md bg-white/80';
      }
    }
    
    return `${baseClasses} ${visibilityClasses} ${bgClasses}`;
  };

  // Setup scroll listener e inizializza lo stato
  useVisibleTask$(() => {
    // Controlla lo stato iniziale dello scroll
    const checkInitialScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        isScrolled.value = true;
        // Non nascondiamo la navbar all'inizializzazione
        navbarVisible.value = true;
        showFloatingMenu.value = false;
      }
    };
    
    // Esegui il controllo iniziale
    checkInitialScroll();
    
    // Aggiungi il listener per gli scroll successivi
    window.addEventListener('scroll', handleScroll$);
    
    return () => {
      window.removeEventListener('scroll', handleScroll$);
    };
  });

  return (
    <>
      {/* Navbar principale */}
      <nav 
        class={getNavbarClasses()}
        onMouseEnter$={handleNavbarMouseEnter$}
        onMouseLeave$={handleNavbarMouseLeave$}
      >
        <div class="max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-7xl flex items-center justify-between h-24 mx-5 md:mx-auto">
          {/* Logo */}
          <div class="flex-shrink-0">
            <a href="/" class="text-xl font-sans">
              <img src={config.logo} alt="Logo" class="h-12 w-auto"/>
            </a>
          </div>

          {/* Menu centrale */}
          <div class="hidden md:flex gap-8">
            <a 
              href="/" 
              class={`${currentPath === '/' ? config.textColorActive : config.textColor} font-regular group relative transition-all duration-300 transform ${config.hoverEffect}`}
            >
              Home
            </a>
            <a 
              href="/chi-siamo" 
              class={`${currentPath === '/chi-siamo' ? config.textColorActive : config.textColor} font-regular group relative transition-all duration-300 transform ${config.hoverEffect}`}
            >
              Chi siamo
            </a>
            <a 
              href="/offerte" 
              class={`${currentPath === '/offerte' ? config.textColorActive : config.textColor} font-regular group relative transition-all duration-300 transform ${config.hoverEffect}`}
            >
              Offerte
            </a>
            <a 
              href="/contatti" 
              class={`${currentPath === '/contatti' ? config.textColorActive : config.textColor} font-regular group relative transition-all duration-300 transform ${config.hoverEffect}`}
            >
              Contatti
            </a>
          </div>

          {/* Pulsante Catalogo */}
          <div class="hidden md:block">
            <a href="/catalogo" class="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark transition">
              Catalogo
            </a>
          </div>

          {/* Mobile Menu */}
          <MobileMenu 
            theme={currentTheme}
            mobileMenuBg={config.mobileMenuBg}
            mobileMenuText={config.mobileMenuText}
            mobileMenuTextHover={config.mobileMenuTextHover}
            hamburgerColor={config.hamburgerColor}
            isScrolled={isScrolled.value}
          />
        </div>
      </nav>

      {/* Floating Hamburger Button - Solo Desktop */}
      <button
        onClick$={handleFloatingClick$}
        class={`fixed top-6 right-6 z-40 w-12 h-12 rounded-full ${config.floatingBtnBg} border-2 border-white hidden md:flex items-center justify-center transition-all duration-500 transform ${
          showFloatingMenu.value 
            ? 'translate-y-0 opacity-100 scale-100' 
            : '-translate-y-20 opacity-0 scale-0 pointer-events-none'
        } hover:scale-110 shadow-lg`}
        aria-label="Mostra menu"
      >
        <div class="w-6 h-4 flex flex-col justify-between">
          <span class="block h-0.5 bg-white rounded-full"></span>
          <span class="block h-0.5 bg-white rounded-full"></span>
          <span class="block h-0.5 bg-white rounded-full"></span>
        </div>
      </button>
    </>
  );
});